import sys
import os
import json

import pymongo

def convert_childs(account_id, records):
    if not records:
        return []

    ret = []

    for childs in records:
        child_ids = childs.get('child', [])
        child_names = childs.get('child_name', [])
        child_genders = childs.get('gender', [])
        child_g_ages = childs.get('weeks', [])

        if isinstance(child_ids, list):
            for i in range(len(child_ids)):
                child = {
                    'profileId': "{}.{}".format(account_id, child_ids[i]),
                    'firstName': child_names[i],
                    'birthday': None,  # TODO
                    'gestationalAgeAtBirth': child_g_ages[i],
                    'gender': child_genders[i],
                    'deleted': False,
                }
                dupes = [item for item in ret if item['profileId'] == child['profileId']]
                if dupes:
                    print "Duplicate child records found under account: {}".format(account_id)
                    print "Record:"
                    print json.dumps(child, sort_keys=True, indent=4, separators=(',', ': '))
                    print "is not being written because:"
                    print json.dumps(dupes[0], sort_keys=True, indent=4, separators=(',', ': '))
                    print "already exists"
                    continue
                ret.append(child)
        else:
            child = {
                'profileId': "{}.{}".format(account_id, child_ids),
                'firstName': child_names,
                'birthday': None,  # TODO
                'gestationalAgeAtBirth': child_g_ages,
                'gender': child_genders,
                'deleted': False,
            }
            dupes = [item for item in ret if item['profileId'] == child['profileId']]
            if dupes:
                print "Duplicate child records found under account: {}".format(account_id)
                print "Record:"
                print json.dumps(child, sort_keys=True, indent=4, separators=(',', ': '))
                print "is not being written because:"
                print json.dumps(dupes[0], sort_keys=True, indent=4, separators=(',', ': '))
                print "already exists"
                continue
            ret.append(child)

    return ret

def convert_users(db):
    ret = []
    for record in db.details.find():
        demographic = db.demographic.find_one({
            'email_label': record['email_label']
        }) or {}

        childs = db.childs.find({
            'parent_id': record['pid']
        })

        ret.append(
            dict(
                id=str(record.get('_id')),
                name=record.get('name'),
                email=record.get('id'),
                emailPreferenceNextSession=True,
                emailPreferenceNewStudies=('updates' in record.get('preference', [])),
                emailPreferenceResultsPublished=('results' in record.get('preference', [])),

                demographicsNumberOfChildren=demographic.get('siblings'),
                demographicsChildBirthdays=[],  # TODO worth migrating?
                demographicsLanguagesSpokenAtHome=demographic.get('language'),
                demographicsNumberOfGuardians=demographic.get('guardians'),
                demographicsNumberOfGuardiansExplanation='',  # TODO?
                demographicsRaceIdentification=demographic.get('race'),
                demographicsAge=demographic.get('age'),
                demographicsGender=demographic.get('gender'),
                demographicsEducationLevel=demographic.get('education-you'),
                demographicsSpouseEducationLevel=demographic.get('education-spouse'),
                demographicsAnnualIncome=demographic.get('family-income'),
                demographicsWillingToBeContactedForSimilarStudies=True,  # TOOD merge with email prefs?
                demographicsCanScheduleAnAppointment=False,  # TODO default?
                demographicsNumberOfBooks=None,  # TODO?
                demographicsAdditionalComments='',

                # TODO get usernames
                profiles=convert_childs(str(record['_id']), childs)
            )
        )
    return ret

def migrate(db, outputdir):
    accounts = convert_users(db)
    with open(os.path.join(outputdir, 'accounts.json'), 'w') as fp:
        json.dump(accounts, fp, sort_keys=True, indent=4, separators=(',', ': '))

def main():
    try:
        inputdir = sys.argv[1]
    except IndexError:
        print "Please supply a path to the mongo backup to be restored and migrated, e.g.:"
        print "./migrate.py --in=<PATH> --out=<PATH>"
        sys.exit(1)
    try:
        outputdir = sys.argv[2]
    except IndexError:
        print "Please supply a path to the desired output directory (of the migrated JSON), e.g.:"
        print "./migrate.py --in=<PATH> --out=<PATH>"
        sys.exit(1)

    db_name = os.path.basename(inputdir)

    client = pymongo.MongoClient('localhost', 27017)
    try:
        db = client[db_name]
    except KeyError:
        print "No database named {} found.".format(db_name)
    else:
        migrate(db, outputdir)

if __name__ == "__main__":
    main()
