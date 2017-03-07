"""
All-in-one script for basic Lookit/Experimenter platform management and administration tasks

Make sure to install requirements (`pip install requests`), then run at the command line as `python experimenter.py`
  for help and options.
"""
from __future__ import print_function

import argparse
import copy
import datetime
import json
import operator
import os
import re
import sys

import requests


# Prepackaged defaults for convenience when distributing this script to users
JAMDB_SERVER_URL = 'https://staging-metadata.osf.io'
JAMDB_NAMESPACE = 'experimenter'

DEFAULT_CONFIG = {
    'host': JAMDB_SERVER_URL,
    'namespace': JAMDB_NAMESPACE,
    'osf_token': None
}


CONFIG_DIR = os.path.abspath(os.path.dirname(__file__))
CONFIG_PATH = os.path.join(CONFIG_DIR, 'config.json')


########
# Script configuration and CLI interface
OSF_USER_PATTERN = re.compile('^[a-zA-Z0-9]{5,6}$')


def create_default_config():
    """If no configuration file is present, save one with built-in defaults"""
    with open(CONFIG_PATH, 'w') as f:
        json.dump(DEFAULT_CONFIG, f, indent=4, sort_keys=4)


def load_config(osf_token=None, host=None, namespace=None):
    """
    Load configuration from three places: built in defaults, a file, and options provided via command line
      (in case of a conflict, the most directly user-provided option "wins")
    """
    if not os.path.isfile(CONFIG_PATH):
        create_default_config()

    with open(CONFIG_PATH, 'r') as f:
        file_config = json.load(f)

    # User configuration file takes precedence over default options
    final_config = copy.deepcopy(DEFAULT_CONFIG)
    final_config.update(file_config)

    # Options provided directly (eg via the command line) override anything else
    if osf_token:
        final_config['osf_token'] = osf_token
    if host:
        final_config['host'] = host
    if namespace:
        final_config['namespace'] = namespace

    if not all([final_config['osf_token'], final_config['host'], final_config['namespace']]):
        print('ERROR: Must provide osf_token, host, and namespace in order to run')
        sys.exit(1)

    return final_config


def validate_osf_user(value):
    """Validate that the provided string corresponds to an OSF user ID"""

    if not OSF_USER_PATTERN.match(value):
        raise argparse.ArgumentTypeError('{} does not appear to be a valid user ID'.format(value))
    return str(value)


def parse_args():
    """Define command line interface and connect it to functionality"""
    parser = argparse.ArgumentParser('Experimenter platform administration script')
    parser.add_argument('--osf_token', help='An OSF personal access token used to authenticate to JamDB')
    parser.add_argument('--host', help='The fully qualified hostname for the JamDB server backend')
    parser.add_argument('--namespace', help='The namespace (eg "Lookit") where records are stored')

    subparsers = parser.add_subparsers()
    subparsers.required = True

    # Download collection data
    parser_download = subparsers.add_parser('download',
                                            help='Allow downloading of data from a specific collection')
    parser_download.set_defaults(func=download_records)
    parser_download.add_argument('collection',
                                 help='The collection from which to fetch records')
    parser_download.add_argument('--record', type=str, required=False,
                                 help='If provided, the ID of a specific record to fetch')
    parser_download.add_argument('--out', type=str, required=False,
                                 help='If provided, the filename of where to output the results')

    # User management
    parser_permission = subparsers.add_parser('permissions',
                                              help='Manage who has access to a specified collection. Must be a Lookit admin to use this functionality.')
    parser_permission.set_defaults(func=manage_permissions)
    parser_permission.add_argument('collection', type=str,
                                   help='The ID of the collection ')
    parser_permission.add_argument('--level', default='READ', required=False, choices=['READ', 'WRITE', 'ADMIN'],
                                   help='The level of permissions to grant a user (when adding)')
    permission_group = parser_permission.add_mutually_exclusive_group(required=True)
    permission_group.add_argument('--add', nargs='+', type=validate_osf_user,
                                  help='A list of OSF users to add with the specified permission level')
    permission_group.add_argument('--remove', nargs='+', type=validate_osf_user,
                                  help='A list of OSF users to remove (regardless of permission level)')
    permission_group.add_argument('--list', action='store_true',
                                  help='Print out a list of OSF users with permissions on this collection, then exit')

    # Email management
    parser_emails = subparsers.add_parser('emails',
                                          help='Support managing the default email template. Must be a Lookit admin to use this functionality.')
    parser_emails.set_defaults(func=manage_emails)
    parser_emails.add_argument('template',
                               help='The ID of the sendgrid template to use')

    return parser.parse_args()


########
# Basic client logic
class ExperimenterClient(object):
    """
    Base class for experimenter requests
    """
    BASE_URL = JAMDB_SERVER_URL
    NAMESPACE = JAMDB_NAMESPACE

    def __init__(self, jam_token=None, url=None, namespace=None):
        self.jam_token = jam_token
        self.BASE_URL = url or self.BASE_URL
        self.NAMESPACE = namespace or self.NAMESPACE

    def _url_for_collection(self, collection):
        return '{}/v1/id/collections/{}.{}'.format(
            self.BASE_URL,
            self.NAMESPACE,
            collection
        )

    def _url_for_collection_records(self, collection):
        base_url = self._url_for_collection(collection)
        return base_url + '/documents/'

    def _make_request(self, method, *args, **kwargs):
        """Make a request with the appropriate authorization"""
        headers = kwargs.get('headers', {})
        headers['authorization'] = self.jam_token
        kwargs['headers'] = headers
        return getattr(requests, method)(*args, **kwargs)

    def _fetch_all(self, response):
        # TODO: Rewrite this as a generator
        res_json = response.json()

        try:
            data = res_json['data']
        except KeyError:
            return {
                'data': []
            }

        total = res_json['meta']['total']
        per_page = res_json['meta']['perPage']
        remainder = total - per_page
        page = 2
        while remainder > 0:
            response = self._make_request(
                response.request.method.lower(),
                response.request.url.split('?page=')[0],
                params={
                    'page': page
                }
            )
            data = data + response.json()['data']
            remainder = remainder - per_page
            page += 1
        res_json['data'] = data
        return res_json

    @classmethod
    def authenticate(cls, osf_token, base_url=None, namespace=None):
        """
        Perform the authentication flow, exchanging an OSF access token for a JamDB token

        :param osf_token:
        :param base_url:
        :param namespace:
        :return:
        """
        base_url = base_url or cls.BASE_URL
        namespace = namespace or cls.NAMESPACE

        # TODO: Add error handling
        res = requests.post(
            '{}/v1/auth/'.format(cls.BASE_URL),
            json={
                'data': {
                    'type': 'users',
                    'attributes': {
                        'provider': 'osf',
                        'access_token': osf_token
                    }
                }
            }
        )
        return cls(
            jam_token=res.json()['data']['attributes']['token'],
            url=base_url,
            namespace=namespace
        )

    def fetch_collection_meta(self, collection):
        """Fetch collection metadata, like permissions. May require admin permissions to use."""
        # TODO: Verify permissions rules
        url = self._url_for_collection(collection)
        res = self._make_request('get', url)
        # TODO: Do not suppress non-200 status codes in future
        return res.json()['data']

    def fetch_collection_records(self, collection):
        """Fetch all records that are a member of the specified collection"""
        url = self._url_for_collection_records(collection)
        res = self._make_request('get', url)
        if res.status_code == 404:
            print('No results found for specified collection!')
            return []
        else:
            return self._fetch_all(res)['data']

    def fetch_record(self, collection, record):
        """

        :param collection: Name of the desired collection
        :param record: Name of the desired record
        :return:
        """
        url = '{}/v1/id/documents/{}.{}.{}'.format(
            self.BASE_URL,
            self.NAMESPACE,
            collection,
            record
        )
        res = self._make_request('get', url)
        if res.status_code != 200:
            return None
        if res.json().get('data'):
            return res.json()['data']
        return None

    def set_email_template(self, template_id):
        """Set the email template associated with password reset (and other contact functionality)"""
        url = self._url_for_collection('accounts')
        self._make_request(
            'patch',
            url,
            headers={
                'content-type': 'application/vnd.api+json; ext=jsonpatch',
            },
            json=[
                {
                    'op': 'replace',
                    'path': '/plugins/user/template',
                    'value': template_id
                }
            ]
        )


########
# Specific tasks used by argparse
def download_records(args, client):
    collection_id = args.collection
    record_id = args.record

    out_fn = 'data_{}'.format(collection_id)
    if record_id:
        data = client.fetch_record(collection_id, record_id)
        out_fn = '{}_{}'.format(out_fn, record_id)
    else:
        print('Fetching records. This may take a while- please wait...')
        data = client.fetch_collection_records(collection_id)
        print('Download complete. Found {} records'.format(len(data)))

    out_fn += '{}.json'.format(datetime.datetime.utcnow())
    # Can override the constructed filename with a manually passed in option
    out_fn = args.out or out_fn
    print('Writing results to: ', out_fn)
    with open(out_fn, 'w') as f:
        json.dump(data, f, indent=4)


def manage_emails(args, client):
    """Provide a way to change the auth template"""
    # TODO: Perhaps we would like to print out the old template first in case of error / rollback?
    client.set_email_template(args.template)


def manage_permissions(args, client):
    """Manage who has access to a collection"""

    collection_meta = client.fetch_collection_meta(args.collection)
    current_permissions = collection_meta['attributes']['permissions']

    # Accounts managed by this script must have pattern `user-osf-abc12`
    osf_permission_pattern = re.compile('^user-osf-([a-zA-Z0-9]{5,6}|\\*)$')

    # Sort the selectors alphabetically for display
    for selector, level in sorted(current_permissions.items(), key=operator.itemgetter(1)):
        match = osf_permission_pattern.match(selector)
        if match:
            osf_id = match.group(1)
            print('{:10s} {}'.format(level, osf_id))

    if args.list:
        # Always list out users with access. If that is the only action requested, exit cleanly.
        sys.exit(0)


    # In first iteration we'll update payload, then we may cycle back and explore PATCH operations


if __name__ == '__main__':
    options = parse_args()

    config = load_config(osf_token=options.osf_token, host=options.host, namespace=options.namespace)

    client = ExperimenterClient.authenticate(config['osf_token'],
                                             base_url=config['host'],
                                             namespace=config['namespace'])
    options.func(options, client)
