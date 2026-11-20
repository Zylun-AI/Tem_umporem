# Roteiro: "E se a humanidade tivesse que recomeçar numa nave que viaja por cem anos?"
# Fontes: NASA (Imagine the Universe) — Proxima Centauri a ~4,2 anos-luz; na velocidade da Voyager, ~73 mil anos de viagem;
# NASA (Human Research Program, risco de alterações ósseas) — em microgravidade, perda de ~1% a 1,5% da densidade óssea por mês;
# NASA (2023) — o sistema de suporte à vida da Estação Espacial Internacional recupera 98% da água (inclusive suor e urina);
# Britannica / relatos da Biosfera 2 — em 1991, 8 pessoas se trancaram por 2 anos no Arizona; o oxigênio caiu de ~21% para ~14,5% e foi preciso injetar oxigênio.
# A nave Travessia e a viagem de 100 anos são ficção (nenhuma tecnologia atual chega a outra estrela em 100 anos).
META = dict(
    format='long',
    title='E se a humanidade tivesse que recomeçar numa nave que viaja por cem anos?',
    description="""E se cem pessoas embarcassem numa nave para outra estrela, sabendo que a viagem dura cem anos e que só os bisnetos delas iam chegar? 🚀✨

A Maya é engenheira. O Caio é botânico. A doutora Íris é médica. O Juca é piloto e piadista. E o espaço tem radiação, ossos que enfraquecem, ar que precisa ser fabricado… e pedrinhas mais rápidas que uma bala.

⏱️ CAPÍTULOS
{CHAPTERS}

📚 Fontes: NASA (distância até Proxima Centauri e tempo de viagem na velocidade da Voyager; perda óssea em microgravidade; reciclagem de 98% da água na Estação Espacial Internacional); Britannica (Biosfera 2, 1991–1993). A nave Travessia é ficção: nenhuma tecnologia atual chega a outra estrela em cem anos. História ilustrativa baseada nesses números.

💬 E você? Embarcaria numa viagem que só os seus bisnetos iam terminar? Comenta aí!
🔔 Próximo episódio: E se a humanidade tivesse que recomeçar debaixo da terra?

#ese #espaço #historiasanimadas #curiosidades #animação""",
    tags=['e se', 'e se a humanidade recomeçasse', 'nave geracional', 'viagem espacial', 'história animada', 'cenário hipotético', 'espaço', 'curiosidades'],
    thumb=dict(beat='b02', frac=0.7, text='O AR ESTÁ ESCAPANDO', text2='e faltam 60 anos de viagem'),
    chapters=[('b01', 'A única casa'), ('b04', 'Quarenta anos antes'), ('b09', 'O lado bom da nave'), ('b14', 'O preço do espaço'), ('b17', 'A lição da Biosfera 2'), ('b19', 'O ponto fraco'), ('b21', 'O furo'), ('b27', 'Os anos passam'), ('b29', 'O final')],
)
BEATS = [
 # ---------- GANCHO ----------
 dict(id="b01", pre=0.6, post=0.4,
  text="Essa nave saiu da Terra há quarenta anos, e ainda faltam sessenta pra chegar. Quase ninguém que embarcou nela vai ver o fim da viagem. E agora, ela é a [[y:única casa]] de cem pessoas."),
 dict(id="b02", pre=0.2, post=0.3,
  text="Um alarme toca no anel das plantações. Uma pedrinha do espaço, menor que um grão de arroz, atravessou a parede. E o ar começa a [[r:escapar]]."),
 dict(id="b03", pre=0.1, post=0.5,
  text="Sem a plantação, não tem comida nem oxigênio pra chegar do outro lado. A Maya tem dois minutos pra resolver. Mas pra entender como eles chegaram aqui, a gente precisa voltar quarenta anos."),
 # ---------- COMEÇO ----------
 dict(id="b04", pre=0.9, post=0.2,
  text="Quarenta anos antes, a Maya, vinte e oito anos, engenheira, embarca na nave Travessia com outras noventa e nove pessoas. O destino: um planeta parecido com a Terra, [[y:em outra estrela]]."),
 dict(id="b05", pre=0.1, post=0.2,
  text="Tem um botânico, o Caio. Uma médica, a doutora Íris. E o Juca, vinte e quatro anos, piloto, que faz piada até na contagem regressiva."),
 dict(id="b06", pre=0.2, post=0.4,
  text="[[y:Regra número um]]: não existe volta. A viagem dura cem anos. Quem embarca sabe que vai envelhecer na nave, e que quem vai pisar no planeta novo são os bisnetos."),
 dict(id="b07", pre=0.1, post=0.3,
  text="E cem anos ainda é rápido. A estrela mais próxima do Sol fica a uns quatro anos-luz. Na velocidade da sonda Voyager, a viagem levaria uns [[r:setenta e três mil anos]]. A Travessia é uma nave imaginária, muito mais rápida que qualquer uma de hoje."),
 dict(id="b08", pre=0.2, post=0.3,
  text="Na partida, todo mundo corre pras janelas. A Terra vai ficando pequena, até virar um pontinho azul. E depois, só sobra o escuro."),
 # ---------- VANTAGENS ----------
 dict(id="b09", pre=0.2, post=0.2,
  text="Primeira descoberta: dá pra viver bem aqui. A nave tem um anel gigante que gira sem parar. E esse giro empurra todo mundo contra o chão, quase como uma [[c:gravidade de verdade]]."),
 dict(id="b10", pre=0.1, post=0.2,
  text="E isso salva o corpo. Segundo a {NASA|Nasa}, sem gravidade, os astronautas perdem de um a um e meio por cento da densidade dos ossos [[r:por mês]]. Sem o giro, em cem anos, ninguém ia conseguir ficar de pé."),
 dict(id="b11", pre=0.1, post=0.2,
  text="Água, ninguém desperdiça. Na Estação Espacial, a {NASA|Nasa} já recupera [[c:noventa e oito por cento]] da água, até o suor e o xixi dos astronautas. Na Travessia, é igual: cada gota volta pro copo."),
 dict(id="b12", pre=0.1, post=0.2,
  text="E o Caio cuida do coração da nave: o anel das plantações. Ali cresce a comida, e as plantas transformam o gás carbônico que a gente solta em [[g:oxigênio]]."),
 dict(id="b13", pre=0.1, post=0.3,
  text="Primeiro ano: festa. O Juca organiza um campeonato de futebol no anel, e nasce o primeiro bebê do espaço. O nome dela é [[y:Estrela]]."),
 # ---------- PREÇO ----------
 dict(id="b14", pre=0.2, post=0.2,
  text="Mas o espaço cobra. Lá fora, não tem atmosfera nenhuma protegendo da radiação. Então as paredes da nave são grossas, e a doutora Íris faz [[y:exame em todo mundo]], todo mês."),
 dict(id="b15", pre=0.1, post=0.3,
  text="E tem um preço que ninguém imaginava: a saudade. A Estrela cresce sem nunca ter visto chuva, mar, ou um céu azul. Na escola da nave, a Terra é só uma [[c:foto na parede]]."),
 # ---------- CTA MEIO ----------
 dict(id="b16", pre=0.1, post=0.4,
  text="E quase todo mundo que assiste ainda não é inscrito. Se você está curtindo a história da Maya, aperta o [[y:inscrever]] e deixa o like. É de graça, e é isso que faz o próximo vídeo sair."),
 # ---------- A CONTA ----------
 dict(id="b17", pre=0.2, post=0.2,
  text="E tem uma lição que veio da Terra. Em mil novecentos e noventa e um, oito pessoas se trancaram na {Biosfera 2|Biosfera Dois}, uma estufa gigante no Arizona, pra viver dois anos sem ajuda de fora."),
 dict(id="b18", pre=0.1, post=0.3,
  text="O oxigênio lá dentro caiu de vinte e um por cento pra perto de [[r:quatorze e meio]], e eles precisaram receber oxigênio de fora. Na Travessia, não existe fora. A plantação é a parte mais importante da nave."),
 dict(id="b19", pre=0.2, post=0.2,
  text="Só que [[r:tem um porém]]. O espaço não é vazio. Tem pedrinhas viajando muito mais rápido que uma bala. E o anel das plantações tem as paredes mais finas da nave, cheias de janelas pra luz entrar."),
 dict(id="b20", pre=0.1, post=0.3,
  text="Por quarenta anos, a blindagem segurou tudo. A Maya, agora com sessenta e oito anos, ainda confere as paredes toda semana. Mas uma hora, [[r:a sorte acaba]]."),
 # ---------- CLÍMAX ----------
 dict(id="b21", pre=0.2, post=0.2,
  text="Agora, aconteceu. Um estalo, um assobio, e as folhas começam a voar na direção de um furinho na parede. O ar está [[r:escapando]]."),
 dict(id="b22", pre=0.1, post=0.2,
  text="As portas de emergência vão fechar em dois minutos, e isolar o anel. A nave sobrevive. Mas a plantação inteira [[r:morre congelada]]."),
 dict(id="b23", pre=0.1, post=0.2,
  text="A Maya não espera. Ela pega uma placa de metal e corre até o furo, contra o vento, enquanto o Caio corre atrás com a cola de emergência."),
 dict(id="b24", pre=0.1, post=0.2,
  text="A pressão puxa a placa com força. Ela escorrega uma vez. Duas. A porta já está na metade do caminho."),
 dict(id="b25", pre=0.1, post=0.4,
  text="Na terceira, a placa gruda na parede, e a cola endurece. O assobio [[g:para]]. E a porta trava a um palmo do chão."),
 dict(id="b26", pre=0.1, post=0.4,
  text="A doutora Íris confere todo mundo: ninguém se feriu. E as plantas, que quase congelaram, voltam a se levantar em [[g:poucos dias]]."),
 # ---------- FINAL ----------
 dict(id="b27", pre=0.2, post=0.2,
  text="Os anos passam. A Maya vira avó, depois bisavó. E antes de partir, ela grava uma mensagem, pra ser aberta só no dia da chegada."),
 dict(id="b28", pre=0.2, post=0.3,
  text="Cem anos depois da partida, a Travessia chega. A bisneta dela, também chamada Maya, pisa num chão de verdade pela primeira vez, e sente o [[c:vento no rosto]]."),
 dict(id="b29", pre=0.3, post=0.5,
  text="A humanidade não recomeçou nas estrelas porque era fácil. Recomeçou porque cem pessoas começaram uma viagem que só os bisnetos iam terminar."),
 dict(id="b30", pre=0.2, post=1.2,
  text="E você? Embarcaria numa viagem que só os seus bisnetos iam terminar? Comenta aqui. E se a humanidade tivesse que recomeçar debaixo da terra? Esse é o próximo episódio. Se inscreve, e deixa o like. Até lá!"),
]
