# Roteiro: "E se a humanidade tivesse que recomeçar num navio que nunca pode parar?"
# Fontes: NOAA — os oceanos cobrem cerca de 71% da superfície da Terra;
# Hedenström et al., Current Biology (2016), Universidade de Lund — o andorinhão-preto pode passar até 10 meses voando sem pousar;
# Royal Caribbean / Wärtsilä — navios de cruzeiro fabricam a própria água doce a partir da água do mar (dessalinização), gastando energia dos motores;
# beber água do mar desidrata (o rim precisa de mais água pra eliminar o sal) — NOAA/Ocean Service;
# escorbuto (falta de vitamina C) foi uma das grandes causas de morte de marinheiros na era das grandes navegações;
# em tempestade, um barco sem motor tende a ficar de lado para as ondas ("atravessar"/broach) e pode virar; por isso se mantém a proa contra as ondas;
# âncora de mar / "âncora de paraquedas" (sea anchor): um paraquedas jogado na água pela proa segura o barco de frente para as ondas;
# Onda de Draupner, Mar do Norte, 1º de janeiro de 1995 — primeira onda gigante (rogue wave) medida por instrumento, cerca de 25,6 metros;
# SkySails — em 2008 o cargueiro MS Beluga SkySails cruzou o Atlântico puxado em parte por uma pipa gigante.
# A névoa nos continentes, o navio Andorinhão e os personagens são ficção.
META = dict(
    format='long',
    title='E se a humanidade tivesse que recomeçar num navio que nunca pode parar?',
    description="""E se a terra firme ficasse proibida, e trezentas pessoas tivessem que recomeçar a vida num navio que nunca pode parar? 🚢🌊

A Tati é a capitã. O Seu Dito é pescador há cinquenta anos. A doutora Cecília é médica. E o Nino, de nove anos, nunca larga um livro velho de pescaria. No mar tem peixe, chuva e vento… mas se o motor parar no meio da tempestade, o navio vira.

⏱️ CAPÍTULOS
{CHAPTERS}

📚 Fontes: NOAA (oceanos cobrem cerca de 71% da Terra; por que não se pode beber água do mar); Current Biology, 2016 (andorinhão-preto voa até 10 meses sem pousar); Royal Caribbean e Wärtsilä (navios fabricam água doce com dessalinização); história do escorbuto nas grandes navegações; técnica da âncora de mar (paraquedas) em tempestades; Onda de Draupner, 1995 (cerca de 25,6 m); SkySails, 2008 (cargueiro puxado por pipa gigante). A névoa, o navio Andorinhão e os personagens são ficção. História ilustrativa baseada nesses fatos.

💬 E você? Aguentaria viver anos num navio sem nunca pisar em terra? Comenta aí!

#ese #navio #oceano #historiasanimadas #curiosidades #animação""",
    tags=['e se', 'e se a humanidade recomeçasse', 'navio', 'oceano', 'tempestade', 'onda gigante', 'alto mar', 'história animada', 'cenário hipotético', 'curiosidades'],
    thumb=dict(beat='b03', frac=0.85, text='ONDA DE 25 METROS', text2='e o motor parou'),
    chapters=[('b01', 'A tempestade'), ('b04', 'A névoa'), ('b10', 'O que o mar dá'), ('b15', 'O preço do mar'), ('b19', 'O ponto fraco'), ('b21', 'O motor parou'), ('b28', 'Os anos passam'), ('b29', 'O final')],
)
BEATS = [
 # ---------- GANCHO ----------
 dict(id="b01", pre=0.6, post=0.4,
  text="Esse é o navio Andorinhão. Ele não para há [[y:três anos]]. Não pode atracar, não pode ancorar, e não pode desligar o motor. E ele é a [[y:única casa]] de trezentas pessoas."),
 dict(id="b02", pre=0.2, post=0.3,
  text="Hoje, chegou a maior tempestade que eles já viram. E no meio dela, o motor [[r:engasgou e parou]]."),
 dict(id="b03", pre=0.1, post=0.5,
  text="Sem motor, o navio começa a virar de lado para as ondas. E lá na frente vem uma onda [[r:do tamanho de um prédio]]. Mas pra entender como eles vieram parar aqui, a gente precisa voltar três anos."),
 # ---------- COMEÇO ----------
 dict(id="b04", pre=0.9, post=0.2,
  text="Três anos antes, uma névoa estranha começa a cobrir as cidades. Quem respira fica doente. Em poucos meses, ela cobre [[r:todos os continentes]]."),
 dict(id="b05", pre=0.1, post=0.3,
  text="Mas os cientistas percebem uma coisa: a névoa não aguenta o sal e o vento do [[c:mar aberto]]. E os oceanos cobrem uns setenta e um por cento do planeta."),
 dict(id="b06", pre=0.2, post=0.3,
  text="Então trezentas pessoas sobem num velho navio de carga, rebatizado de [[y:Andorinhão]]. É o nome de um pássaro que consegue passar até dez meses voando, sem pousar."),
 dict(id="b07", pre=0.2, post=0.2,
  text="Tem a Tati, a capitã mais nova da companhia. O Seu Dito, pescador há cinquenta anos. A doutora Cecília, médica. E o Nino, nove anos, que nunca larga um [[y:livro velho de pescaria]]."),
 dict(id="b08", pre=0.2, post=0.4,
  text="[[y:Regra número um]]: o motor nunca desliga. É ele que dá energia pra máquina que tira o sal da água. E água do mar não mata a sede, ela [[r:desidrata]]."),
 dict(id="b09", pre=0.2, post=0.3,
  text="[[y:Regra número dois]]: na tempestade, o navio fica sempre de frente pras ondas. De lado, uma onda grande consegue [[r:virar o navio]]."),
 # ---------- VANTAGENS ----------
 dict(id="b10", pre=0.2, post=0.2,
  text="Mas o mar também dá muita coisa. O Seu Dito ensina todo mundo a pescar, e no primeiro mês já tem [[g:peixe todo dia]] no jantar. Até a criançada aprende a fazer nó de marinheiro."),
 dict(id="b11", pre=0.1, post=0.2,
  text="A máquina de dessalinização transforma água do mar em água de beber, igual nos navios de cruzeiro de verdade. E quando chove, lonas enormes [[g:guardam cada gota]]."),
 dict(id="b12", pre=0.1, post=0.3,
  text="Os contêineres do convés viram uma horta. Terra, sementes e muita luz do sol. Porque os marinheiros antigos morriam de [[r:escorbuto]], a falta de vitamina C, e aqui ninguém quer repetir isso."),
 dict(id="b13", pre=0.1, post=0.2,
  text="E à noite, o céu do mar aberto tem [[y:mais estrelas]] do que qualquer um já viu. O Nino aprende com a capitã a se localizar por elas."),
 dict(id="b14", pre=0.1, post=0.3,
  text="Primeiro ano: festa no convés, com a primeira salada da horta e um cardume de peixes-voadores que [[y:caiu sozinho]] no navio."),
 # ---------- PREÇO ----------
 dict(id="b15", pre=0.2, post=0.2,
  text="Mas o mar cobra. O sal come tudo: ferro, fios, parafusos. A capitã passa o dia inteiro [[r:raspando ferrugem]]. E tem gente que enjoa por semanas, sem conseguir comer nada."),
 dict(id="b16", pre=0.1, post=0.2,
  text="E o combustível não é infinito. Então a Tati faz uma coisa que parece loucura: amarra uma [[y:pipa gigante]] na proa. Em 2008, um cargueiro de verdade cruzou o oceano puxado em parte por uma pipa assim."),
 dict(id="b17", pre=0.1, post=0.3,
  text="Com o vento ajudando, o motor gasta bem menos. Mas ele ainda é o [[c:coração do navio]]. O Seu Dito escuta o barulho dele toda noite antes de dormir."),
 # ---------- CTA MEIO ----------
 dict(id="b18", pre=0.1, post=0.4,
  text="E quase todo mundo que assiste ainda não é inscrito. Se você está curtindo a história do Nino, aperta o [[y:inscrever]] e deixa o like. É de graça, e é isso que faz o próximo vídeo sair."),
 # ---------- O PORÉM ----------
 dict(id="b19", pre=0.2, post=0.2,
  text="Só que [[r:tem um porém]]. No mar existem ondas que ninguém acreditava. Em 1995, uma plataforma no Mar do Norte mediu uma onda de [[r:vinte e cinco metros]]."),
 dict(id="b20", pre=0.1, post=0.3,
  text="Por três anos, nada parecido. Mas numa tarde, o céu fica verde-escuro, os pássaros somem, e o Seu Dito fala baixinho: [[r:essa é das grandes.]]"),
 # ---------- CLÍMAX ----------
 dict(id="b21", pre=0.2, post=0.2,
  text="Agora, aconteceu. Ondas de dez metros quebram no convés. A água do mar entra pela tomada de ar, e o motor [[r:para]]."),
 dict(id="b22", pre=0.1, post=0.2,
  text="Sem motor, o navio começa a [[r:girar de lado]]. A pipa já tinha sido recolhida por causa do vento. E lá na frente, uma onda gigante vem vindo."),
 dict(id="b23", pre=0.1, post=0.2,
  text="O Nino corre até a capitã com o livro de pescaria aberto. Tem uma página sobre a [[y:âncora de mar]]: um paraquedas que se joga na água pela proa."),
 dict(id="b24", pre=0.1, post=0.2,
  text="Eles não têm paraquedas. Mas têm a lona da chuva. O Seu Dito amarra as pontas com corda grossa, e eles jogam tudo no mar pela [[y:proa]]."),
 dict(id="b25", pre=0.1, post=0.2,
  text="A lona abre debaixo d'água e puxa. Devagar, o navio vira de novo [[g:de frente pra onda]]. E ela chega."),
 dict(id="b26", pre=0.1, post=0.4,
  text="O navio sobe, sobe… e passa por cima. Lá embaixo, o mecânico limpa a tomada de ar, e o motor [[g:volta a roncar]]. Trezentas pessoas gritam no meio da chuva."),
 dict(id="b27", pre=0.1, post=0.3,
  text="Desde aquele dia, o Andorinhão tem [[g:dois motores]], e uma âncora de mar de verdade, costurada à mão, pendurada na proa."),
 # ---------- FINAL ----------
 dict(id="b28", pre=0.2, post=0.3,
  text="Os anos passam. Outros barcos se juntam, e o Andorinhão vira uma [[y:cidade flutuante]]. Os filhos de quem embarcou aprendem a nadar antes de andar. Um dia, o rádio traz a notícia: a névoa sumiu. Dá pra voltar."),
 dict(id="b29", pre=0.2, post=0.3,
  text="Muita gente volta pra terra. Mas muita gente [[y:fica]]. E o Nino, agora adulto, é o capitão. E ele ainda guarda aquele livro velho na ponte de comando."),
 dict(id="b30", pre=0.3, post=0.5,
  text="A humanidade não recomeçou no mar porque era fácil. Recomeçou porque trezentas pessoas aprenderam a [[y:nunca parar]]."),
 dict(id="b31", pre=0.2, post=1.2,
  text="E você? Aguentaria viver anos num navio, sem nunca pisar em terra? Comenta aqui. E deixa nos comentários onde a humanidade deveria recomeçar no próximo episódio. Se inscreve, e deixa o like. Até lá!"),
]
