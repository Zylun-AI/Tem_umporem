# Tem Um Porém — automação do canal

Todo dia: **1 vídeo longo** (bonequinho palito, 5–8 min, 18:00) e **1 short** (personagens Roblox, ~30 s, 12:00).

- `episodes/<slug>/` – um episódio = `script.py` (texto narrado + metadados) e `shots.js` (as cenas).
- `jobs/` – cada `.json` novo dispara o GitHub Actions, que renderiza e envia ao YouTube.
  Exemplo: `{"episode": "episodes/2026-11-17-short-xxx", "publish_at": "2026-11-17T12:00:00-03:00"}`
  (`"upload": false` só renderiza; `"privacy": "private"` envia como privado.)
- `engine/` – motor 3D (three.js): personagens palito e Roblox, cenários, câmera, legendas.
- `tools/` – narração (edge-tts, com voz offline de reserva), render, efeitos/trilha, metadados, upload.
- `CLAUDE.md` – instruções completas que o Claude segue nas sessões diárias.

## Configuração (uma vez)
1. **Deixe o repositório público** (Settings → General → Danger Zone → Change visibility). Repositório público tem minutos ilimitados no Actions; as senhas ficam nos Secrets e não aparecem.
2. Gere o token do canal novo: no seu PC, com o mesmo `client_secret.json` do canal de mapas, rode `python tools/get_token.py` e **entre com a conta do canal Tem Um Porém**.
3. Em Settings → Secrets and variables → Actions, crie `YT_CLIENT_ID`, `YT_CLIENT_SECRET` e `YT_REFRESH_TOKEN` com os valores impressos.
4. Para thumbnails personalizadas o canal precisa estar verificado no YouTube (verificação por telefone).

O resultado de cada vídeo aparece como uma Issue (✅ enviado / ❌ falha) e o arquivo fica 7 dias em Actions → Artifacts.

Os rostos em `assets/roblox-faces/` são decals oficiais do Roblox (marca da Roblox Corporation), usados em vídeos de fã sobre Roblox.
