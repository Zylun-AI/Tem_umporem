# Roteiro: "E se a humanidade tivesse que recomeçar no alto das montanhas?"
# Fontes: La Rinconada, Peru (~5.100 m) — o povoado permanente mais alto do mundo (NASA Earth Observatory, "The Highest Settlement in the World");
# a 4.000–5.000 m cada respiração traz bem menos oxigênio (a ~5.000 m, cerca de metade do nível do mar) — mal da altitude ("soroche"); aclimatação = subir devagar;
# na troposfera a temperatura cai em média ~6,5 °C a cada 1.000 m (atmosfera padrão, NASA);
# a água ferve a menos de 100 °C em altitude (a ~4.000 m, uns 86–87 °C) — por isso feijão demora a cozinhar e se usa panela de pressão;
# terraços agrícolas (andenes) e chuño (batata desidratada pelo gelo da noite e o sol do dia), que dura anos — Inca agriculture; Live Science (2026), chuño de 500 anos achado num depósito inca;
# lhamas como animais de carga nos Andes;
# Lago Palcacocha, Cordilheira Branca (Peru): em 1941 a barragem natural de morena rompeu e a enxurrada atingiu Huaraz; hoje o lago é vigiado e teve o nível baixado
# com sifões (mangueiras) — Eos/AGU, "The dangers of glacial lake floods"; queda de gelo do glaciar no lago é um dos gatilhos de ondas que transbordam.
# O mar subindo sem parar, a Vila Condor e os personagens são ficção.
META = dict(
    format='long',
    title='E se a humanidade tivesse que recomeçar no alto das montanhas?',
    description="""E se o mar começasse a subir sem parar, e a humanidade tivesse que recomeçar a mais de quatro mil metros de altura, nas montanhas? 🏔️

A Jade é geóloga. O Seu Tomé planta batata desde menino. A doutora Inês é médica. E o Dudu, de dez anos, não desgruda da lhama Pipoca. Lá em cima o mar não chega… mas o ar é fino, a noite congela, e acima da vila tem um lago de gelo derretido segurado por uma parede de pedra.

⏱️ CAPÍTULOS
{CHAPTERS}

📚 Fontes: NASA Earth Observatory (La Rinconada, Peru, o povoado mais alto do mundo, ~5.100 m); mal da altitude e oxigênio rarefeito; atmosfera padrão (a temperatura cai ~6,5 °C a cada 1.000 m); ponto de ebulição da água em altitude; agricultura inca (terraços e chuño) e Live Science (chuño de 500 anos); Eos/AGU sobre o Lago Palcacocha (enxurrada de 1941 em Huaraz e os sifões que baixam o nível do lago). O mar subindo, a Vila Condor e os personagens são ficção. História ilustrativa baseada nesses fatos.

💬 E você? Aguentaria viver a quatro mil metros de altura? Comenta aí!

#ese #montanhas #andes #historiasanimadas #curiosidades #animação""",
    tags=['e se', 'e se a humanidade recomeçasse', 'montanhas', 'andes', 'altitude', 'glaciar', 'lhama', 'história animada', 'cenário hipotético', 'curiosidades'],
    thumb=dict(beat='b03', frac=0.8, text='O LAGO VAI ESTOURAR', text2='a 4 mil metros de altura'),
    chapters=[('b01', 'O lago'), ('b04', 'O mar subiu'), ('b10', 'O que a montanha dá'), ('b15', 'O preço da altura'), ('b19', 'O ponto fraco'), ('b21', 'O gelo caiu'), ('b27', 'Os anos passam'), ('b28', 'O final')],
)
BEATS = [
 # ---------- GANCHO ----------
 dict(id="b01", pre=0.6, post=0.4,
  text="Essa é a Vila Condor. Ela fica a [[y:quatro mil e duzentos metros]] de altura, no meio dos Andes. E ela é a casa de [[y:quinhentas pessoas]] que fugiram do mar."),
 dict(id="b02", pre=0.2, post=0.3,
  text="Logo acima da vila tem um lago de gelo derretido, segurado só por uma parede de pedra solta. E hoje, um pedaço do glaciar do tamanho de um prédio [[r:se soltou]]."),
 dict(id="b03", pre=0.1, post=0.5,
  text="Se a água passar por cima da parede, ela desce direto [[r:em cima das casas]]. Mas pra entender como eles vieram parar aqui, a gente precisa voltar dois anos."),
 # ---------- COMEÇO ----------
 dict(id="b04", pre=0.9, post=0.2,
  text="Dois anos antes, o mar começa a subir. Não um pouquinho por ano: [[r:metros por mês]]. As praias somem, depois os portos, depois as cidades inteiras."),
 dict(id="b05", pre=0.1, post=0.3,
  text="Ninguém sabe onde ele vai parar. Então a regra fica simples: quanto [[c:mais alto]], mais seguro. E não tem lugar mais alto pra morar do que as montanhas."),
 dict(id="b06", pre=0.2, post=0.3,
  text="E isso não é tão maluco assim. No Peru existe uma cidade de verdade, La Rinconada, a uns [[y:cinco mil e cem metros]]. É o lugar mais alto do mundo onde gente mora o ano inteiro."),
 dict(id="b07", pre=0.2, post=0.2,
  text="Quem chega na Vila Condor: a Jade, geóloga. O Seu Tomé, que planta batata desde menino. A doutora Inês, médica. E o Dudu, dez anos, que não desgruda da [[y:lhama Pipoca]]."),
 dict(id="b08", pre=0.2, post=0.4,
  text="O primeiro inimigo é o próprio ar. Lá em cima, cada respiração traz [[r:bem menos oxigênio]]. Dá dor de cabeça, enjoo, falta de fôlego. É o mal da altitude."),
 dict(id="b09", pre=0.2, post=0.3,
  text="Por isso a doutora Inês cria a [[y:regra número um]]: ninguém sobe correndo. Sobe devagar, alguns dias em cada altura, pra o corpo se acostumar."),
 # ---------- VANTAGENS ----------
 dict(id="b10", pre=0.2, post=0.2,
  text="Mas a montanha também dá muita coisa. O mar [[g:nunca chega]] aqui em cima. E o gelo do glaciar derrete devagar, virando água limpa o ano todo."),
 dict(id="b11", pre=0.1, post=0.2,
  text="O Seu Tomé faz igual os incas: corta a encosta em [[g:degraus]], os terraços. Cada degrau segura a terra, guarda o calor do sol, e não deixa a chuva levar tudo embora."),
 dict(id="b12", pre=0.1, post=0.3,
  text="E a batata vira um tesouro. À noite ela congela, de dia o sol seca. Isso é o [[y:chuño]], que dura anos guardado. Arqueólogos acharam chuño inca de quinhentos anos!"),
 dict(id="b13", pre=0.1, post=0.2,
  text="As lhamas carregam peso pelas trilhas, dão lã pro frio, e não reclamam de nada. A Pipoca vira a [[y:mascote da vila]]."),
 dict(id="b14", pre=0.1, post=0.3,
  text="Primeiro ano: festa na praça, com a primeira colheita dos terraços e um céu com [[y:mais estrelas]] do que qualquer um já tinha visto."),
 # ---------- PREÇO ----------
 dict(id="b15", pre=0.2, post=0.2,
  text="Mas a altura cobra. A cada mil metros, faz uns [[r:seis graus e meio]] a menos. De noite a geada queima as plantas, e as estufas viram a única horta que nunca para."),
 dict(id="b16", pre=0.1, post=0.2,
  text="Até cozinhar fica difícil. Lá em cima a água ferve antes, com uns [[y:oitenta e seis graus]], então o feijão não amolece nunca. A solução? [[g:Panela de pressão]] pra vila inteira."),
 dict(id="b17", pre=0.1, post=0.3,
  text="E todo dia a Jade sobe até o lago do glaciar com uma régua. Porque ela sabe de uma coisa que quase ninguém na vila sabe."),
 # ---------- CTA MEIO ----------
 dict(id="b18", pre=0.1, post=0.4,
  text="E quase todo mundo que assiste ainda não é inscrito. Se você está curtindo a história do Dudu e da Pipoca, aperta o [[y:inscrever]] e deixa o like. É de graça, e é isso que faz o próximo vídeo sair."),
 # ---------- O PORÉM ----------
 dict(id="b19", pre=0.2, post=0.2,
  text="Só que [[r:tem um porém]]. Em 1941, no Peru, a parede de pedra de um lago assim, o Palcacocha, cedeu. A enxurrada desceu a montanha e atingiu a cidade de Huaraz."),
 dict(id="b20", pre=0.1, post=0.3,
  text="E o lago da Vila Condor não para de encher. Todo dia a régua mostra [[r:mais um pouco]]. A Jade avisa: se cair gelo lá dentro, a onda passa por cima da parede."),
 # ---------- CLÍMAX ----------
 dict(id="b21", pre=0.2, post=0.2,
  text="Agora, aconteceu. Um estrondo enorme ecoa pelo vale. Um pedaço do glaciar [[r:despenca]] no lago. Ainda não caiu tudo: tem outro bloco rachando logo atrás."),
 dict(id="b22", pre=0.1, post=0.2,
  text="A primeira onda bate na parede e um pouco de água escorre pela rampa. A parede aguentou. Mas se o próximo bloco cair com o lago cheio desse jeito, [[r:não vai aguentar]]."),
 dict(id="b23", pre=0.1, post=0.2,
  text="Aí o Dudu lembra da aula de ciências: dá pra tirar água de um aquário com uma mangueira, sem bomba nenhuma. É um [[y:sifão]]. É só encher a mangueira e deixar a ponta mais baixa que o lago."),
 dict(id="b24", pre=0.1, post=0.2,
  text="A Jade arregala os olhos: no Peru, de verdade, eles baixaram o Palcacocha exatamente assim. A vila inteira corre pras estufas e [[y:arranca todas as mangueiras]]."),
 dict(id="b25", pre=0.1, post=0.2,
  text="As lhamas sobem com os rolos nas costas. Eles enchem as mangueiras, passam por cima da parede, e a água começa a [[g:sair sozinha]], dia e noite. O lago baixa, um palmo de cada vez."),
 dict(id="b26", pre=0.1, post=0.4,
  text="Três dias depois, o segundo bloco despenca. A onda vem, bate na parede… e [[g:não passa]]. Lá embaixo, quinhentas pessoas gritam na praça, e a Pipoca grita junto."),
 # ---------- FINAL ----------
 dict(id="b27", pre=0.2, post=0.3,
  text="Desde aquele dia, os sifões nunca mais saíram do lago. Os anos passam, a vila cresce, e as crianças nascidas lá em cima [[y:correm na montanha]] sem perder o fôlego. Um dia, o rádio traz a notícia: o mar parou de subir."),
 dict(id="b28", pre=0.2, post=0.3,
  text="Muita gente desce pro que sobrou das cidades. Mas muita gente [[y:fica]]. E o Dudu, agora adulto, é quem sobe todo dia até o lago com a régua da Jade."),
 dict(id="b29", pre=0.3, post=0.5,
  text="A humanidade não recomeçou nas montanhas porque era fácil. Recomeçou porque quinhentas pessoas aprenderam a [[y:respeitar a montanha]]."),
 dict(id="b30", pre=0.2, post=1.2,
  text="E você? Aguentaria viver a quatro mil metros de altura? Comenta aqui. E deixa nos comentários onde a humanidade deveria recomeçar no próximo episódio. Se inscreve, e deixa o like. Até lá!"),
]
