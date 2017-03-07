"""
All-in-one script for basic Lookit/Experimenter platform management and administration tasks

Make sure to install requirements (`pip install requests`), then run at the command line as `python experimenter.py`
  for help and options.
"""
from __future__ import print_function

import argparse
import copy
import json
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

    # User configuration takes precedence over default options
    final_config = copy.deepcopy(DEFAULT_CONFIG)
    final_config.update(file_config)

    if osf_token:
        final_config['osf_token'] = osf_token
    if host:
        final_config['host'] = host
    if namespace:
        final_config['namespace'] = namespace

    final_config.setdefault('osf_token', osf_token)
    final_config.setdefault('host', host)
    final_config.setdefault('namespace', namespace)

    if not all([final_config['osf_token'], final_config['host'], final_config['namespace']]):
        print('ERROR: Must provide osf_token, host, and namespace in order to run')
        sys.exit(1)

    return final_config


def validate_osf_user(value):
    """Validate that the provided string corresponds to an OSF user ID"""

    if not re.match('^[a-zA-Z0-9]{5,6}$', value):
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
    parser_download.add_argument('collection_id')
    parser_download.add_argument('--record', type=str, required=False,
                                 help='The ID of a specific record to fetch')

    # User management
    # TODO: Provide a "list" feature to easily see who has access, making it easier to find someone for removal
    parser_permission = subparsers.add_parser('permissions',
                                              help='Manage who has access to a specified collection')
    parser_permission.set_defaults(func=manage_permissions)
    parser_permission.add_argument('collection_id', type=str,
                                   help='The ID of the collection ')
    parser_permission.add_argument('--level', default='READ', required=False, choices=['READ', 'WRITE', 'ADMIN'],
                                   help='The level of permissions to grant a user')
    # TODO: Make add/remove mutually exclusive group (possibly with list option)
    parser_permission.add_argument('--add', nargs='+', type=validate_osf_user,
                                   help='A list of OSF users to add with the specified permission level')
    parser_permission.add_argument('--remove', nargs='+', type=validate_osf_user,
                                   help='A list of OSF users to remove (regardless of permission level)')

    # Email management
    parser_emails = subparsers.add_parser('emails',
                                          help='Support managing the default email template')
    parser_emails.add_argument('template_id',
                               help='The ID of the sendgrid template to use')
    parser_emails.add_argument('--collection_id',
                               default='accounts',
                               help='The name of the collection that stores account information')
    parser_emails.set_defaults(func=manage_emails)

    return parser.parse_args()


########
# Basic client logic
class Account(object):
    """Data object with helpers for reading JSON payloads"""
    def __init__(self, id, name, email):
        self.id = id
        self.name = name
        self.email = email

    @classmethod
    def from_data(cls, data):
        """Helper to convert JSON payload into """
        attrs = data['attributes']
        return cls(
            id=data['id'],
            name=attrs.get('name', ''),
            email=attrs.get('email'),
        )


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

    def fetch_collection(self, collection_id):
        url = '{}/v1/id/collections/{}.{}/documents/'.format(
            self.BASE_URL,
            self.NAMESPACE,
            collection_id
        )
        res = self._make_request('get', url)
        if res.status_code == 404:
            print('No results found for specified collection!')
            return []
        else:
            return self._fetch_all(res)['data']

    def fetch_account(self, account_id):
        url = '{}/v1/id/documents/{}.accounts.{}'.format(
            self.BASE_URL,
            self.NAMESPACE,
            account_id
        )
        res = self._make_request('get', url)
        if res.status_code != 200:
            return None
        if res.json().get('data'):
            return res.json()['data']
        return None

    def fetch_accounts(self, query=None):
        url = '{}/v1/id/collections/{}.accounts/{}'.format(
            self.BASE_URL,
            self.NAMESPACE,
            '_search?' + query if query else 'documents'
        )
        return map(
            Account.from_data,
            self._fetch_all(self._make_request('get', url))['data']
        )

    def set_email_template(self, template_id):
        """Set the email template associated with password reset (and other contact functionality)"""
        url = '{}/v1/id/collections/{}.accounts'.format(
            self.BASE_URL,
            self.NAMESPACE
        )
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
    ## TODO: Receives collection, record
    print(args)
    pass


def manage_emails(args, client):
    print(args)
    pass


def manage_permissions(args, client):
    print(args)
    pass


if __name__ == '__main__':
    options = parse_args()

    print(options)
    config = load_config(osf_token=options.osf_token, host=options.host, namespace=options.namespace)

    # client = ExperimenterClient.authenticate(config['osf_token'])
    # args.func(args, client)
