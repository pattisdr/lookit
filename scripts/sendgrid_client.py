import sendgrid
import json

import conf


class EmailPreferences(object):

    ASM_MAPPING = {
        'Next Session': 'nextSession',
        'New Studies': 'newStudies',
        'Results Published': 'resultsPublished',
        'Opt Out': 'optOut'
    }

    def __init__(self, nextSession, newStudies, resultsPublished):
        self.nextSession = nextSession
        self.newStudies = newStudies
        self.resultsPublished = resultsPublished


class SendGrid(object):

    def __init__(self, apikey=None, from_addr=None):
        self.sg = sendgrid.SendGridAPIClient(
            apikey=apikey or conf.SENDGRID_KEY
        )
        self.smtp = sendgrid.SendGridClient(
            apikey or conf.SENDGRID_KEY
        )
        self.from_addr = from_addr or 'Test client <test-client@foo.com>'

    def groups(self):
        res = self.sg.client.asm.groups.get()
        return {
            EmailPreferences.ASM_MAPPING[group['name']]: group
            for group in json.loads(res.response_body)
        }

    def unsubscribes_for(self, group):
        return json.loads(
            self.sg.client.asm.groups._(
                group['id']
            ).suppressions.get().response_body
        ) or []

    def unsubscribe_from(self, group, email):
        return self.batch_unsunscribe_from(group, [email])

    def batch_unsubscribe_from(self, group, emails):
        return json.loads(
            self.sg.client.asm.groups._(group['id']).suppressions.post(
                request_body={"recipient_emails": emails}
            ).response_body
        )

    def subscribe_to(self, group, email):
        return json.loads(
            self.sg.client.asm.groups._(group['id']).suppressions._(
                email
            ).delete().response_body
        )

    def send_email_to(self, email, subject, body, group_id=None):
        message = sendgrid.Mail()
        message.add_to(email)
        message.set_subject(subject)
        message.set_html(body)
        message.set_text(body)
        message.set_from(self.from_addr)
        if group_id:
            message.set_asm_group_id(group_id)
        status, msg = self.smtp.send(message)
        print(status, msg)
