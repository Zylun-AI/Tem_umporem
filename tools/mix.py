"""Efeitos sonoros sintetizados + trilha + mixagem.
Uso: python3 tools/mix.py work/<slug> [long|short]
Lê voice.wav, sfx.json (de render.js sfx) e grava mix.wav.
Nomes de SFX disponíveis: veja o dicionário S (ou rode python3 tools/mix.py --list).
"""
import json, numpy as np, subprocess, wave, sys, os
from scipy import signal
SR=44100
rng=np.random.default_rng(5)
def env(n,a=0.005,r=0.1):
    e=np.ones(n); na=int(a*SR); nr=int(r*SR)
    if na>0: e[:na]=np.linspace(0,1,na)
    if nr>0: e[-nr:]*=np.linspace(1,0,nr)
    return e
def T(d): return np.arange(int(d*SR))/SR
def noise(d): return rng.standard_normal(int(d*SR))
def lp(x,f): b,a=signal.butter(2,f/(SR/2),'low'); return signal.lfilter(b,a,x)
def hp(x,f): b,a=signal.butter(2,f/(SR/2),'high'); return signal.lfilter(b,a,x)
def bp(x,f0,f1): b,a=signal.butter(2,[f0/(SR/2),f1/(SR/2)],'band'); return signal.lfilter(b,a,x)
def sine(f,d): return np.sin(2*np.pi*np.cumsum(np.broadcast_to(f,(int(d*SR),)))/SR)
def sweep(f0,f1,d): t=T(d); f=f0+(f1-f0)*(t/d); return np.sin(2*np.pi*np.cumsum(f)/SR)
S={}
def reg(n):
    def d(f): S[n]=f; return f
    return d
@reg('whoosh')
def _(): d=0.7; x=bp(noise(d),300,4000)*np.sin(np.pi*T(d)/d)**2; return x*0.8
@reg('pop')
def _(): d=0.15; return sweep(700,180,d)*np.exp(-T(d)*28)*0.9
@reg('ding')
def _(): d=1.0; t=T(d); return (np.sin(2*np.pi*1320*t)+0.4*np.sin(2*np.pi*2640*t))*np.exp(-t*4)*0.5
@reg('chalk')
def _(): d=0.5; x=hp(noise(d),3000)*(0.5+0.5*np.sin(2*np.pi*14*T(d))); return x*env(int(d*SR),0.02,0.1)*0.4
@reg('alarm')
def _(): d=1.6; t=T(d); f=np.where((t*5)%1<0.5,880,660); return np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*0.25*env(int(d*SR),0.01,0.1)
@reg('wind')
def _(): d=4.0; x=lp(noise(d),500)*(0.6+0.4*np.sin(2*np.pi*0.35*T(d))); return x*env(int(d*SR),0.8,1.0)*0.9
@reg('engine')
def _(): d=3.0; t=T(d); f=70+30*np.sin(2*np.pi*0.7*t)+t*8; x=np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*0.5+lp(noise(d),400)*0.3; return lp(x,900)*env(int(d*SR),0.2,0.5)*0.7
@reg('boom')
def _(): d=1.8; t=T(d); return (sweep(90,28,d)*np.exp(-t*2.2)+lp(noise(d),200)*np.exp(-t*4)*0.5)*1.1
@reg('door')
def _(): d=0.6; t=T(d); return (lp(noise(d),600)*np.exp(-t*14)+sweep(150,60,d)*np.exp(-t*10))*1.0
@reg('hit')
def _(): d=0.5; t=T(d); return (sweep(160,50,d)*np.exp(-t*12)+lp(noise(d),1500)*np.exp(-t*25)*0.7)*1.2
@reg('error')
def _(): d=0.4; t=T(d); return np.sign(np.sin(2*np.pi*180*t))*0.3*env(int(d*SR),0.005,0.05)*np.where(t<0.18,1,np.where(t>0.22,1,0))
@reg('click')
def _(): d=0.1; t=T(d); return (hp(noise(d),2000)*np.exp(-t*60))*0.8
@reg('tick')
def _(): d=0.08; t=T(d); return hp(noise(d),3500)*np.exp(-t*80)*0.7
@reg('radio')
def _(): d=3.0; t=T(d); x=bp(noise(d),400,3000)*0.3+0.12*np.sin(2*np.pi*(440+60*np.sin(2*np.pi*0.8*t))*t); return x*env(int(d*SR),0.1,0.4)*0.7
@reg('wheelie')
def _(): d=1.4; t=T(d); f=90+t*160; return lp(np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*0.4+noise(d)*0.2,2500)*env(int(d*SR),0.05,0.3)*0.8
@reg('sizzle')
def _(): d=1.5; return hp(noise(d),2500)*env(int(d*SR),0.1,0.5)*0.35
@reg('tada')
def _(): d=1.2; t=T(d); x=sum(np.sin(2*np.pi*f*t)*np.exp(-t*3) for f in (523,659,784,1047)); return x*0.2*env(int(d*SR),0.01,0.2)
@reg('spark')
def _(): d=0.5; t=T(d); return hp(noise(d),1500)*(rng.random(len(t))>0.7)*np.exp(-t*6)*0.9
@reg('cheer')
def _(): d=1.6; return bp(noise(d),500,2500)*env(int(d*SR),0.2,0.6)*0.35*(0.7+0.3*np.sin(2*np.pi*6*T(d)))
@reg('cough')
def _(): d=0.8; t=T(d); return (lp(noise(d),500)*np.exp(-t*6)+sweep(110,70,d)*np.exp(-t*7))*1.1
@reg('riser')
def _(): d=1.0; t=T(d); return (sweep(100,1400,d)*0.3+bp(noise(d),500,6000)*0.4)*(t/d)**2
@reg('traffic')
def _(): d=3.0; return lp(noise(d),350)*env(int(d*SR),0.5,1.0)*0.9
@reg('echo')
def _(): d=2.0; t=T(d); return sum(sweep(500,300,0.3).mean()*0 for _ in [0]) if False else np.pad(np.sin(2*np.pi*300*T(0.2))*env(int(0.2*SR),0.01,0.1)*0.3,(0,int(1.8*SR)))
@reg('flicker')
def _(): d=1.2; t=T(d); return np.sign(np.sin(2*np.pi*100*t))*0.15*((np.sin(t*55)>0)&(np.sin(t*9)>-0.4))+hp(noise(d),4000)*0.04
@reg('blackout')
def _(): d=2.5; t=T(d); return (sweep(120,35,d)*np.exp(-t*1.2)*0.9+lp(noise(d),300)*np.exp(-t*1.5)*0.4)
@reg('water')
def _(): d=4.0; return lp(noise(d),1200)*(0.5+0.5*np.sin(2*np.pi*1.7*T(d)))*env(int(d*SR),0.5,1.0)*0.5
@reg('crickets')
def _(): d=5.0; t=T(d); return np.sin(2*np.pi*4200*t)*((t*14)%1<0.3)*0.05*env(int(d*SR),0.5,0.5)
@reg('twinkle')
def _(): d=1.2; t=T(d); return sum(np.sin(2*np.pi*f*t)*np.exp(-(t-o)*6)*(t>o) for f,o in ((1568,0),(2093,0.15),(2637,0.3)))*0.15
@reg('shoot')
def _(): d=0.9; return sweep(3000,600,d)*np.exp(-T(d)*3)*0.18
@reg('buzz')
def _(): d=1.5; t=T(d); return np.sign(np.sin(2*np.pi*120*t))*0.1*env(int(d*SR),0.2,0.4)
@reg('ouch')
def _(): d=0.6; t=T(d); return sweep(500,250,d)*np.exp(-t*4)*0.5
@reg('page')
def _(): d=0.4; return hp(noise(d),1500)*np.sin(np.pi*T(d)/d)*0.3
@reg('clang')
def _(): d=1.0; t=T(d); return sum(np.sin(2*np.pi*f*t) for f in (620,1480,2310))*np.exp(-t*7)*0.2
@reg('wipe')
def _(): d=1.3; return lp(noise(d),2500)*env(int(d*SR),0.1,0.2)*0.4
@reg('ice')
def _(): d=1.5; t=T(d); return (np.sin(2*np.pi*2400*t)*np.exp(-t*5)+hp(noise(d),4000)*np.exp(-t*8)*0.4)*0.25
@reg('crank')
def _(): d=3.0; t=T(d); return hp(noise(d),800)*((t*8)%1<0.15)*0.3+sweep(80,95,d)*0.1
@reg('power')
def _(): d=1.5; t=T(d); return (sweep(60,120,d)*0.4+sine(120,d)*0.2)*env(int(d*SR),0.05,0.5)*0.8
@reg('crackle')
def _(): d=6.0; t=T(d); return hp(noise(d),1500)*(rng.random(len(t))>0.995)*0.8*env(int(d*SR),0.5,0.8)+lp(noise(d),300)*0.05
@reg('pad')
def _(): d=7.0; t=T(d); return sum(np.sin(2*np.pi*f*t) for f in (220,277,330,440))*0.06*env(int(d*SR),1.5,2.0)
@reg('rustle')
def _(): d=0.9; return bp(noise(d),800,5000)*(0.5+0.5*np.sin(2*np.pi*9*T(d)))*env(int(d*SR),0.05,0.2)*0.4
@reg('zip')
def _(): d=0.6; t=T(d); return hp(noise(d),2500)*((t*60)%1<0.4)*env(int(d*SR),0.01,0.1)*0.5
@reg('aww')
def _(): d=1.4; t=T(d); return sum(np.sin(2*np.pi*f*t) for f in (392,494,587))*0.08*env(int(d*SR),0.2,0.6)
@reg('waves')
def _(): d=5.0; return lp(noise(d),700)*(0.5+0.5*np.sin(2*np.pi*0.25*T(d)))*env(int(d*SR),0.8,1.0)*0.6
@reg('swoosh')
def _(): return S['whoosh']()
@reg('dramatic')
def _(): d=2.2; t=T(d); return (sweep(110,55,d)*np.exp(-t*1.5)*0.7+sum(np.sin(2*np.pi*f*t) for f in (220,233,330))*0.06*np.exp(-t))
@reg('heartbeat')
def _(): d=1.2; t=T(d); return sum(np.sin(2*np.pi*55*(t-o))*np.exp(-(t-o)*18)*(t>o) for o in (0,0.28))*0.9
@reg('laugh')
def _(): d=1.2; t=T(d); return bp(noise(d),600,2400)*(np.sin(2*np.pi*7*t)>0)*env(int(d*SR),0.05,0.3)*0.35
@reg('splash')
def _(): d=1.0; t=T(d); return lp(noise(d),3000)*np.exp(-t*4)*0.8
@reg('crash')
def _(): d=1.3; t=T(d); return (lp(noise(d),2500)*np.exp(-t*3)+sweep(120,40,d)*np.exp(-t*4))*0.9
@reg('siren')
def _(): d=3.0; t=T(d); f=750+250*np.sin(2*np.pi*0.7*t); return np.sin(2*np.pi*np.cumsum(f)/SR)*0.2*env(int(d*SR),0.2,0.4)
@reg('phone')
def _(): d=2.0; t=T(d); return (np.sin(2*np.pi*440*t)+np.sin(2*np.pi*480*t))*0.12*((t%1)<0.6)
@reg('knock')
def _(): d=0.8; t=T(d); return sum(lp(noise(0.08),900)*np.exp(-T(0.08)*40) if False else 0 for _ in [0]) + sum(np.pad(lp(noise(0.08),900)*np.exp(-T(0.08)*40),(int(o*SR),int(d*SR)-int(o*SR)-int(0.08*SR))) for o in (0,0.22,0.44))*0.9
@reg('footsteps')
def _(): d=2.0; t=T(d); return lp(noise(d),500)*((t*2.2)%1<0.08)*0.8

if __name__ == '__main__':
    if sys.argv[1] == '--list': print(' '.join(sorted(S))); sys.exit()
    work = sys.argv[1].rstrip('/'); FMT = sys.argv[2] if len(sys.argv) > 2 else 'long'
    voice = subprocess.run(['ffmpeg','-v','error','-i',f'{work}/voice.wav','-ar',str(SR),'-ac','1','-f','f32le','-'],capture_output=True,check=True).stdout
    voice = np.frombuffer(voice, dtype=np.float32)
    total = json.load(open(f'{work}/timeline.json'))['total']
    dur = max(total, len(voice)/SR) + 0.2; N = int(dur*SR); mix = np.zeros(N)
    mix[:min(N,len(voice))] += voice[:N]*0.95
    sfx = json.load(open(f'{work}/sfx.json')) if os.path.exists(f'{work}/sfx.json') else []
    miss = set()
    for e in sfx:
        f = S.get(e['n'])
        if f is None: miss.add(e['n']); f = S['pop']; e = dict(e, v=e['v']*0.3)
        x = f(); i = int(e['t']*SR)
        if i >= N: continue
        x = x[:N-i]; mix[i:i+len(x)] += x*e['v']*0.55
    if miss: print('SFX sem som definido (usei pop baixo):', ' '.join(sorted(miss)))
    t = np.arange(N)/SR; mus = np.zeros(N)
    if FMT == 'short':   # trilha leve e rápida (estilo shorts de histórias)
        bpm = 112; beat = 60/bpm; chords = [(261.6,329.6,392),(220,261.6,329.6),(174.6,220,261.6),(196,246.9,293.7)]
        for k in range(int(dur/(beat*8))+2):
            ch = chords[k%4]; a = int(k*beat*8*SR); b = min(N, int((k+1)*beat*8*SR))
            if a >= N: break
            tt = t[a:b]-k*beat*8
            pl = sum(np.sin(2*np.pi*f*tt)*np.exp(-((tt % (beat/2)))*6) for f in ch)*0.028
            bass = np.sin(2*np.pi*ch[0]/2*tt)*np.exp(-((tt % beat))*5)*0.05
            hat = hp(noise((b-a)/SR),6000)[:b-a]*np.exp(-((tt+beat/2) % beat)*40)*0.02
            mus[a:b] += pl + bass + hat
        mix += mus*0.8
    else:
        chords = [(220,261.6,329.6),(174.6,220,261.6),(196,246.9,293.7),(164.8,207.7,246.9)]
        for k in range(int(dur/8)+1):
            ch = chords[k%4]; a = int(k*8*SR); b = min(N, int((k+1)*8*SR)+int(SR))
            if a >= N: break
            tt = t[a:b]-k*8
            seg = sum(np.sin(2*np.pi*f*tt)+0.3*np.sin(2*np.pi*2*f*tt) for f in ch)*0.02
            seg *= np.minimum(1,tt/2)*np.minimum(1,(9-tt)/2).clip(0,1); mus[a:b] += seg
        mix += mus*(0.8+0.4*(0.5+0.5*np.sin(2*np.pi*t/16)))
    mix = np.tanh(mix*0.9); mix = mix/np.max(np.abs(mix))*0.92
    fl = int((0.6 if FMT=='short' else 1.0)*SR); mix[-fl:] *= np.linspace(1,0,fl)
    with wave.open(f'{work}/mix.wav','wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype(np.int16).tobytes())
    print('mix', round(dur,1), 's')
