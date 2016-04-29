# Steps to run

### Configuration

##### Generate a token
You will need to generate a personal access token on the OSF to run this script. Visit [https://staging.osf.io/settings/tokens/](https://staging.osf.io/settings/tokens/) to do this.

![example](https://raw.githubusercontent.com/CenterForOpenScience/lookit/scripts/pat-example.png)

**Make sure to save this token's value! You will not be able to retrieve it again.**

##### Create a .env

Create a new file name .env in this directory. It should look like:
```bash
OSF_ACCESS_TOKEN=<your-access-token>
```

##### Install

1. Create a virtualenviornment using a python 2.7.X executable
2. `pip install -r requirements.txt`

### Running

`python client.py`
