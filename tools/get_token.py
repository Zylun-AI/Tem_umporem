# Run ONCE on your own computer to authorize the channel.
#   pip install google-auth-oauthlib
#   put client_secret.json (OAuth "Desktop app" credentials from Google Cloud) next to this file
#   python get_token.py
# Then copy the three printed values into GitHub: Settings -> Secrets and variables -> Actions.
import json
from google_auth_oauthlib.flow import InstalledAppFlow
SCOPES = ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/yt-analytics.readonly']
flow = InstalledAppFlow.from_client_secrets_file('client_secret.json', SCOPES)
creds = flow.run_local_server(port=0, prompt='consent', access_type='offline')
cfg = json.load(open('client_secret.json')); c = cfg.get('installed') or cfg.get('web')
print('\n=== Copie estes 3 valores para os Secrets do GitHub ===\n')
print('YT_CLIENT_ID     =', c['client_id'])
print('YT_CLIENT_SECRET =', c['client_secret'])
print('YT_REFRESH_TOKEN =', creds.refresh_token)
print('\nNão compartilhe esses valores com ninguém.')
