# Roteiro: "E se a humanidade tivesse que recomeçar debaixo do mar?"
# Fontes: NOAA Ocean Service — a pressão aumenta ~1 atmosfera a cada 10 m (33 pés) de profundidade;
# NOAA — os oceanos produzem cerca de metade do oxigênio da Terra (fitoplâncton);
# NOAA (Olympic Coast / sanctuaries) — kelp gigante pode crescer até ~60 cm (2 pés) por dia;
# FIU / NOAA — laboratório submarino Aquarius (Flórida), a ~19 m, ~17 horas de descompressão ao fim das missões;
# NOAA Ocean Explorer — a luz vermelha é absorvida primeiro, nos primeiros metros; bioluminescência;
# NASA — uma pessoa exala cerca de 1 kg de CO2 por dia.
META = dict(
    format='long',
    title='E se a humanidade tivesse que recomeçar debaixo do mar?',
    description="""E se cem pessoas tivessem que recomeçar a humanidade no fundo do mar, sem nenhuma ajuda da superfície? 🌊🐟

A Iara é engenheira naval. O Davi é biólogo marinho. A doutora Sol é médica de mergulho. O Kauê é mergulhador e piadista. E o mar tem pressão que esmaga, ar que precisa ser fabricado… e furacões passando bem em cima da casa deles.

⏱️ CAPÍTULOS
{CHAPTERS}

📚 Fontes: NOAA (pressão debaixo d'água, oxigênio produzido pelos oceanos, crescimento do kelp, luz no oceano, bioluminescência); FIU/NOAA (laboratório submarino Aquarius, na Flórida); NASA (CO2 exalado por pessoa). História ilustrativa (ficção) baseada nesses números.

💬 E você? Moraria debaixo do mar sem nunca mais ver o céu? Comenta aí!
🔔 Próximo episódio: E se a humanidade tivesse que recomeçar numa nave que viaja por cem anos?

#ese #fundodomar #historiasanimadas #curiosidades #animação""",
    tags=['e se', 'e se a humanidade recomeçasse', 'fundo do mar', 'cidade submarina', 'história animada', 'cenário hipotético', 'oceano', 'curiosidades'],
    thumb=dict(beat='b02', frac=0.6, text='PRESOS NO FUNDO DO MAR', text2='e o ar está acabando'),
    chapters=[('b01', 'A única casa'), ('b04', 'Dois anos antes'), ('b08', 'A porta molhada'), ('b09', 'O lado bom do mar'), ('b13', 'O mar não perdoa'), ('b17', 'A conta do ar'), ('b19', 'A boia'), ('b21', 'O furacão'), ('b27', 'Os anos passam'), ('b29', 'O final')],
)
BEATS = [
 # ---------- GANCHO ----------
 dict(id="b01", pre=0.6, post=0.4,
  text="Esse lugar fica a vinte metros debaixo do mar. Não tem céu, não tem vento, e cada respiração precisa ser fabricada. E agora, ele é a [[y:única casa]] de cem pessoas."),
 dict(id="b02", pre=0.2, post=0.3,
  text="Lá em cima, um furacão está passando. As ondas arrancaram o cabo que trazia energia, e o ar da base começa a ficar pesado a cada minuto."),
 dict(id="b03", pre=0.1, post=0.5,
  text="Se a energia acabar, as máquinas que limpam o ar param, e o gás carbônico sobe até ninguém conseguir mais pensar direito. A Iara tem poucas horas pra resolver. Mas pra entender como eles chegaram aqui, a gente precisa voltar dois anos."),
 # ---------- COMEÇO ----------
 dict(id="b04", pre=0.9, post=0.2,
  text="Dois anos antes, a Iara, vinte e nove anos, engenheira naval, embarca num navio com outras noventa e nove pessoas. O destino fica [[y:bem embaixo deles]]."),
 dict(id="b05", pre=0.1, post=0.2,
  text="Tem um biólogo marinho, o Davi. Uma médica de mergulho, a doutora Sol. E o Kauê, vinte e três anos, mergulhador, que faz piada até com tubarão."),
 dict(id="b06", pre=0.2, post=0.4,
  text="[[y:Regra número um]]: a superfície não vai mandar mais nada. Nem comida, nem peças, nem gente. Tudo o que eles precisarem, vão ter que tirar do mar."),
 dict(id="b07", pre=0.1, post=0.3,
  text="E descer já cobra um preço. A cada dez metros de profundidade, a pressão aumenta o equivalente a uma atmosfera inteira. A vinte metros, o corpo aguenta [[r:três vezes]] a pressão da superfície."),
 dict(id="b08", pre=0.2, post=0.3,
  text="A base é montada no fundo, do lado de um recife. O Kauê entra por um buraco no chão, uma piscina que é a porta da casa, tira a máscara, e respira. Ar de verdade, debaixo do mar."),
 # ---------- VANTAGENS ----------
 dict(id="b09", pre=0.2, post=0.2,
  text="Primeira descoberta: o mar tem coisas boas. Água, por exemplo, nunca falta. Uma máquina tira o sal da água do mar, e ela vira [[c:água de beber]]."),
 dict(id="b10", pre=0.1, post=0.2,
  text="E tem comida. O Davi monta uma fazenda de algas do lado da base. Segundo a {NOAA|Nôa}, a alga gigante, o {kelp|kélpi}, pode crescer até [[g:sessenta centímetros por dia]]."),
 dict(id="b11", pre=0.1, post=0.2,
  text="E o próprio mar ajuda a respirar. Os oceanos produzem cerca de [[c:metade do oxigênio]] do planeta. E dentro da base, a Iara usa eletricidade pra quebrar a água, e tirar dela o oxigênio."),
 dict(id="b12", pre=0.1, post=0.3,
  text="Primeiro mês: festa. Eles batizam a base de [[y:Atlântida]], o Kauê aposta corrida com um cardume, e todo mundo dorme olhando os peixes pela janela."),
 # ---------- PREÇO ----------
 dict(id="b13", pre=0.2, post=0.2,
  text="Mas o mar não perdoa. Com a pressão maior, o corpo absorve mais nitrogênio. E se alguém subir rápido demais, esse gás vira [[r:bolhas no sangue]]. É a doença descompressiva."),
 dict(id="b14", pre=0.1, post=0.2,
  text="No laboratório submarino {Aquarius|Aquárius}, na Flórida, a uns dezenove metros, os cientistas precisam de cerca de [[y:dezessete horas]] de descompressão pra voltar. Ou seja: em Atlântida, ninguém sobe correndo."),
 dict(id="b15", pre=0.1, post=0.3,
  text="E tem a luz. A água engole as cores, e o vermelho some primeiro. Lá embaixo, tudo é azul. Então a doutora Sol cria uma regra: [[y:uma hora por dia]] debaixo de lâmpada de sol."),
 # ---------- CTA MEIO ----------
 dict(id="b16", pre=0.1, post=0.4,
  text="E quase todo mundo que assiste ainda não é inscrito. Se você está curtindo a história da Iara, aperta o [[y:inscrever]] e deixa o like. É de graça, e é isso que faz o próximo vídeo sair."),
 # ---------- A CONTA ----------
 dict(id="b17", pre=0.2, post=0.2,
  text="E aí vem a conta do ar. Cada pessoa solta perto de um quilo de gás carbônico por dia. Cem pessoas: [[r:cem quilos]], todo dia, dentro de uma base fechada."),
 dict(id="b18", pre=0.1, post=0.3,
  text="As máquinas que tiram esse gás do ar, e as que fazem oxigênio, funcionam o tempo todo. E elas têm um único inimigo: a [[r:falta de energia]]."),
 dict(id="b19", pre=0.2, post=0.2,
  text="Só que [[r:tem um porém]]. A energia de Atlântida vem de uma boia lá na superfície, com painéis solares, presa à base por um cabo comprido."),
 dict(id="b20", pre=0.1, post=0.3,
  text="E na superfície, quem manda é o oceano. As ondas de um furacão podem passar de dez metros de altura. E a boia é o ponto mais frágil da base inteira."),
 # ---------- CLÍMAX ----------
 dict(id="b21", pre=0.2, post=0.2,
  text="Agora, o furacão chegou. Lá em cima, o mar vira uma montanha. Lá embaixo, as luzes piscam. E o cabo da boia [[r:arrebenta]]."),
 dict(id="b22", pre=0.1, post=0.2,
  text="A Iara faz a conta. As baterias duram umas seis horas. Ou mantém o aquecimento, ou mantém as máquinas do ar. A assembleia vota, e todo mundo escolhe a mesma coisa: [[g:o ar]]."),
 dict(id="b23", pre=0.1, post=0.2,
  text="Cem pessoas ficam quietas, de casaco, falando pouco, pra gastar menos oxigênio. E a Iara lembra de uma coisa: a turbina de maré."),
 dict(id="b24", pre=0.1, post=0.2,
  text="Uma turbina parada a duzentos metros da base, que gira com a corrente do mar, mas que nunca foi ligada. Ela, o Kauê e o Davi saem no escuro, puxando um cabo novo pelo fundo."),
 dict(id="b25", pre=0.1, post=0.4,
  text="Primeira conexão: nada. Segunda: faísca. Na terceira, as hélices pegam a corrente, e as luzes de Atlântida [[g:acendem]]. Lá dentro, o ar volta a circular."),
 dict(id="b26", pre=0.1, post=0.4,
  text="No dia seguinte, o furacão vai embora. E a turbina continua girando, porque a maré [[y:nunca para]]."),
 # ---------- FINAL ----------
 dict(id="b27", pre=0.2, post=0.2,
  text="Os anos passam. Chegam novos módulos, mais gente, uma escola. E nasce o primeiro bebê de Atlântida, que aprende a nadar antes de andar."),
 dict(id="b28", pre=0.2, post=0.3,
  text="Numa noite, a Iara apaga as luzes e olha pela janela. O mar inteiro brilha: são bichinhos que fazem a própria luz. A [[c:bioluminescência]]."),
 dict(id="b29", pre=0.3, post=0.5,
  text="A humanidade não recomeçou no fundo do mar porque era fácil. Recomeçou porque cem pessoas escolheram o ar de todo mundo, antes do próprio conforto."),
 dict(id="b30", pre=0.2, post=1.2,
  text="E você? Moraria debaixo do mar, sem nunca mais ver o céu? Comenta aqui. E se a humanidade tivesse que recomeçar numa nave que viaja por cem anos? Esse é o próximo episódio. Se inscreve, e deixa o like. Até lá!"),
]
