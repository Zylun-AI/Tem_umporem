#!/bin/bash
# Baixa a voz offline (piper pt_BR faber) usada como reserva quando o edge-tts falha.
set -e
mkdir -p models
[ -f models/vits-piper-pt_BR-faber-medium/pt_BR-faber-medium.onnx ] && exit 0
curl -sSL -o /tmp/faber.tar.bz2 https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-pt_BR-faber-medium.tar.bz2
tar -xjf /tmp/faber.tar.bz2 -C models && rm /tmp/faber.tar.bz2
echo "voz piper em models/vits-piper-pt_BR-faber-medium"
