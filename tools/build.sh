#!/bin/bash
# Gera um episódio completo: narração → quadros → áudio → MP4 (+ thumbnail e youtube.json).
# Uso: tools/build.sh episodes/<slug> [workers]
# Saída: work/<slug>/video.mp4, thumbnail.jpg (só vídeo longo), youtube.json
set -euo pipefail
EP=${1%/}; SLUG=$(basename "$EP"); W=work/$SLUG; mkdir -p "$W"
NPROC=${2:-$(nproc)}
FMT=$(python3 -c "import importlib.util as u;s=u.spec_from_file_location('s','$EP/script.py');m=u.module_from_spec(s);s.loader.exec_module(m);print(getattr(m,'META',{}).get('format','long'))")
FPS=30
echo "== $SLUG ($FMT), $NPROC processos"
export PORT=${PORT:-8765}
python3 -m http.server $PORT >/dev/null 2>&1 & SRV=$!; trap "kill $SRV 2>/dev/null || true" EXIT; sleep 1
echo "== narração"; python3 tools/tts.py "$EP" --engine ${TTS_ENGINE:-edge}
TOTAL=$(python3 -c "import json;print(json.load(open('$W/timeline.json'))['total'])")
FRAMES=$(python3 -c "import math;print(math.ceil($TOTAL*$FPS))")
echo "== efeitos"; EP=$EP FMT=$FMT node tools/render.js sfx "$W/sfx.json"
echo "== render: $FRAMES quadros"
SEG=$(( (FRAMES + NPROC*4 - 1) / (NPROC*4) )); rm -f "$W"/seg_*.mp4
seq 0 $(( (FRAMES + SEG - 1) / SEG - 1 )) | xargs -P "$NPROC" -I{} bash -c "f0=\$(({}*$SEG)); f1=\$(( f0+$SEG < $FRAMES ? f0+$SEG : $FRAMES )); EP=$EP FMT=$FMT node tools/render.js range \$f0 \$f1 $FPS $W/seg_\$(printf %04d {}).mp4 > $W/seg_\$(printf %04d {}).log 2>&1 || { echo FALHOU seg {}; tail -20 $W/seg_\$(printf %04d {}).log; exit 255; }"
ls "$W"/seg_*.mp4 | sed "s#^#file '$PWD/#; s#\$#'#" > "$W/list.txt"
ffmpeg -y -v error -f concat -safe 0 -i "$W/list.txt" -c copy "$W/video_only.mp4"
echo "== áudio"; python3 tools/mix.py "$W" "$FMT"
ffmpeg -y -v error -i "$W/video_only.mp4" -i "$W/mix.wav" -t "$TOTAL" -c:v copy -c:a aac -b:a 192k -movflags +faststart "$W/video.mp4"
echo "== metadados"; python3 tools/meta.py "$EP"
if [ "$FMT" = "long" ]; then
  EP=$EP FMT=$FMT node tools/render.js thumb "$W/thumb_full.jpg" "$W/youtube.json"
  ffmpeg -y -v error -i "$W/thumb_full.jpg" -vf scale=1280:720 -q:v 3 "$W/thumbnail.jpg"
fi
ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$W/video.mp4"
echo "== pronto: $W/video.mp4"
