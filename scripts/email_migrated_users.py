import argparse
import logging
import requests

from client import ExperimenterClient
import conf

url = '{}/v1/id/collections/{}.accounts/_search?q=_exists_:migratedFrom'.format(conf.JAM_HOST, conf.JAM_NAMESPACE)  # noqa


def main(dry=True, debug=False, verbosity=0, user=None):
    verbosity = min(max(verbosity, 0), 2)
    if verbosity == 1:
        logging.basicConfig(level=logging.INFO)
    elif verbosity == 2:
        logging.basicConfig(level=logging.DEBUG)

    client = ExperimenterClient(access_token=conf.OSF_ACCESS_TOKEN).authenticate()

    if user:
        accounts = [client.fetch_account(user)]
    else:
        accounts = client.fetch_accounts('q=_exists_:migratedFrom')
    for account in accounts:
        logging.info('Sending password reset request to {} for account {} ({})'.format(account.email, account.name, account.id))  # noqa
        if not dry:
            url = '{}/v1/id/collections/{}.accounts/user'.format(conf.JAM_HOST, conf.JAM_NAMESPACE)
            res = requests.post(
                json={
                    "data": {
                        "type": "reset",
                        "attributes": {
                            "id": account.id
                        }
                    }
                }
            )
            if res.status_code != 201:
                if debug:
                    import ipdb
                    ipdb.set_trace()
                else:
                    raise RuntimeError(res.json())

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry', action='store_true')
    parser.add_argument('-d', '--debug', type=bool, default=False)
    parser.add_argument('-u', '--user', type=str, help='If specified, only perform migration on a single user account')
    parser.add_argument('-v', '--verbosity', type=int, default=0, choices=(0, 1, 2))  # noqa
    args = parser.parse_args()
    main(**vars(args))
