// Folha de teste dos modelos (palito e Roblox) em várias poses.
export const SHOTS = {};
const A = ['idle', 'walk', 'run', 'point', 'cheer', 'shrug', 'think', 'sit', 'crouch', 'carry', 'wave', 'hug'];
export const CAST = {};
A.forEach((a, i) => { CAST['p' + i] = { style: 'palito', cap: i % 2 ? 0x1b8a3c : null, hair: i % 2 ? null : 'lia', shirt: i % 2 ? 0xf6c90e : 0x7b3fe4, num: i % 2 ? '10' : null, flag: !!(i % 2) };
  CAST['r' + i] = { style: 'roblox', shirt: [0x2f6fde, 0xd33, 0x2a9d4b, 0x222][i % 4], pants: 0x2b2b38, skin: ['light', 'tan', 'brown', 'white'][i % 4], hair: ['short', 'long', 'curly', 'bun', 'spiky', 'pony'][i % 6], female: i % 6 === 1 || i % 6 === 3, seed: i, hat: [null, 'cap', 'police', 'captain', null, 'fedora'][i % 6], hatColor: 0x1b8a3c, sleeves: ['short', 'long', 'none'][i % 3], tie: i % 4 === 3 ? 0xaa2222 : null }; });
SHOTS.s = (c) => { c.env('outro'); const half = c.t < 10 ? 'p' : 'r';
  const em = ['neutral', 'happy', 'smirk', 'sad', 'angry', 'surprised', 'scared', 'worried', 'tired', 'cry', 'deadpan', 'happy'];
  A.forEach((a, i) => { const x = (i % 6 - 2.5) * 1.5, z = i < 6 ? 6.5 : 4.2; c.track(half + i, [{ t: 0, p: [x, a === 'sit' ? 0.45 : 0, z], ry: 0.35, a, e2: em[i], hold: a === 'point' ? 'phone' : null }]); });
  c.camSet([0, 2.0, 11.5], [0, 1.0, 3], 46); };
