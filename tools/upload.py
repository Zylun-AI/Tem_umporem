# Envia o vídeo ao YouTube (Data API v3) e define a thumbnail (se existir).
# Env: YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN. Args: video thumbnail|- youtube.json publish_at(ISO ou "now")
import sys, json, datetime, os
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
video, thumb, meta_path, publish_at = sys.argv[1:5]
meta = json.load(open(meta_path))
creds = Credentials(None, refresh_token=os.environ['YT_REFRESH_TOKEN'], client_id=os.environ['YT_CLIENT_ID'], client_secret=os.environ['YT_CLIENT_SECRET'],
                    token_uri='https://oauth2.googleapis.com/token', scopes=['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube'])
yt = build('youtube', 'v3', credentials=creds, cache_discovery=False)
status = dict(selfDeclaredMadeForKids=False, containsSyntheticMedia=False)
when = None
if publish_at and publish_at != 'now':
    when = datetime.datetime.fromisoformat(publish_at)
    if when.tzinfo is None: when = when.replace(tzinfo=datetime.timezone(datetime.timedelta(hours=-3)))
    if when <= datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=5): when = None   # too late: publish right away
if os.environ.get('YT_PRIVACY') in ('private', 'unlisted'):
    status['privacyStatus'] = os.environ['YT_PRIVACY']
elif when:
    status['privacyStatus'] = 'private'; status['publishAt'] = when.astimezone(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
else:
    status['privacyStatus'] = 'public'
body = dict(snippet=dict(title=meta['title'], description=meta['description'], tags=meta['tags'], categoryId=meta.get('category', '1'), defaultLanguage=meta.get('lang', 'pt-BR'), defaultAudioLanguage=meta.get('lang', 'pt-BR')), status=status)
req = yt.videos().insert(part='snippet,status', body=body, media_body=MediaFileUpload(video, chunksize=16*1024*1024, resumable=True, mimetype='video/mp4'))
resp = None
while resp is None:
    st, resp = req.next_chunk()
    if st: print(f'upload {int(st.progress()*100)}%', flush=True)
vid = resp['id']; print('uploaded', vid, resp.get('status'))
if thumb != '-' and os.path.exists(thumb):
  try:
    yt.thumbnails().set(videoId=vid, media_body=MediaFileUpload(thumb, mimetype='image/jpeg')).execute(); print('thumbnail set')
  except Exception as e:
    print('thumbnail failed (the channel may need to be verified for custom thumbnails):', e)
json.dump(dict(id=vid, url=f'https://youtu.be/{vid}', status=resp.get('status')), open(os.path.join(os.path.dirname(meta_path), 'uploaded.json'), 'w'))
