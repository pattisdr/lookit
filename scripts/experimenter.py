"""
All-in-one script for basic Lookit/Experimenter platform management and administration tasks

Make sure to install requirements (`pip install requests`), then run at the command line as `python experimenter.py`
  for help and options.
"""
import argparse
import copy
import json
import os

import requests


JAMDB_SERVER_URL = 'https://staging-metadata.osf.io'
JAMDB_NAMESPACE = 'experimenter'

DEFAULT_CONFIG = {
    'JAMDB_SERVER_URL': JAMDB_SERVER_URL,
    'JAMDB_NAMESPACE': JAMDB_NAMESPACE
}


CONFIG_DIR = os.path.abspath(os.path.dirname(__file__))
CONFIG_PATH = os.path.join(CONFIG_DIR, 'config.json')


########
# Script configuration and CLI interface
def create_default_config():
    """If no configuration file is present, save one with built-in defaults"""
    with open(CONFIG_PATH, 'w') as f:
        json.dump(DEFAULT_CONFIG, f, indent=4, sort_keys=4)


def load_config():
    """Load configuration from a file or built-in defaults"""
    if not os.path.isfile(CONFIG_PATH):
        create_default_config()

    with open(CONFIG_PATH, 'r') as f:
        user_config = json.load(f)

    # User configuration takes precedence over default options
    final_config = copy.deepcopy(DEFAULT_CONFIG)
    final_config.update(user_config)

    # TODO: Future: further allow certain configuration params to be overridden by CLI arguments?
    return final_config


def parse_args():
    """Define command line interface and connect it to functionality"""
    parser = argparse.ArgumentParser('Experimenter platform administration script')

    return parser.parse_args()


########
# Basic client logic
class Account(object):
    """Data object with helpers for reading JSON payloads"""
    # TODO: Maybe just use kawrgs and namedtuple
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

    def __init__(self, jam_token=None, jwt=None, url=None, namespace=None):
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

    def fetch_sessions_for_experiment(self, experiment_id):
        url = '{}/v1/id/collections/{}.session{}s/documents/'.format(
            self.BASE_URL,
            self.NAMESPACE,
            experiment_id
        )
        res = self._make_request('get', url)
        if res.status_code == 404:
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

    # TODO: Fire off



########
# Specific tasks


if __name__ == '__main__':
    args = parse_args()
    # TODO Pass in any configuration
    config = load_config()
