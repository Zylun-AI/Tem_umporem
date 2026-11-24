# Roteiro: "E se a humanidade tivesse que recomeçar na Antártida?"
# Fontes: Australian Antarctic Division / Britannica — a Antártida tem ~14 milhões de km², guarda ~90% do gelo e ~70% da água doce do planeta;
# o recorde de frio da Terra: −89,2 °C na estação russa Vostok, em 21/07/1983 (OMM);
# população: alguns milhares de pessoas no verão e cerca de mil no inverno, em estações de pesquisa (COMNAP / Australian Antarctic Division);
# Tratado da Antártida (1959): continente dedicado à paz e à ciência;
# estufa EDEN ISS (DLR) na estação alemã Neumayer III: em 2018 colheu cerca de 270 kg de verduras sem terra e sem sol, com luz de LED;
# pinguins-imperadores atravessam o inverno em grupos apertados ("huddles") e revezam quem fica na borda, no vento;
# no verão o Sol não se põe por semanas; no inverno, longe da costa, some por meses; pele exposta ao vento muito frio congela em minutos.
# O "verão que não acaba", a Estação Aurora, a nevasca e os personagens são ficção.
META = dict(
    format='long',
    title='E se a humanidade tivesse que recomeçar na Antártida?',
    description="""E se o resto do planeta ficasse quente demais pra viver, e cento e vinte pessoas tivessem que recomeçar a vida no lugar mais frio da Terra? 🧊🐧

A Ana estuda o gelo. O Tião é o mecânico que cuida do gerador. A doutora Clara é médica. E o Nico, de onze anos, nunca tinha visto neve. Lá tem água doce de sobra e uma estufa de LED… mas no inverno o Sol some, e tudo depende de uma máquina só.

⏱️ CAPÍTULOS
{CHAPTERS}

📚 Fontes: Australian Antarctic Division e Britannica (tamanho do continente, 90% do gelo e cerca de 70% da água doce do planeta); Organização Meteorológica Mundial (−89,2 °C em Vostok, 1983); COMNAP (população das estações no verão e no inverno); Tratado da Antártida (1959); DLR — estufa EDEN ISS na estação Neumayer III (cerca de 270 kg de verduras em 2018); comportamento dos pinguins-imperadores no inverno. O "verão que não acaba", a Estação Aurora, a nevasca e os personagens são ficção. História ilustrativa baseada nesses fatos.

💬 E você? Aguentaria um inverno inteiro sem ver o Sol? Comenta aí!
🔔 Próximo episódio: E se a humanidade tivesse que recomeçar no deserto?

#ese #antartida #historiasanimadas #curiosidades #animação""",
    tags=['e se', 'e se a humanidade recomeçasse', 'antártida', 'polo sul', 'pinguins', 'história animada', 'cenário hipotético', 'curiosidades'],
    thumb=dict(beat='b02', frac=0.8, text='O GERADOR PAROU', text2='e lá fora faz −60 °C'),
    chapters=[('b01', 'A nevasca'), ('b04', 'O verão que não acaba'), ('b09', 'O lado bom do gelo'), ('b14', 'O preço do frio'), ('b18', 'O ponto fraco'), ('b20', 'A noite sem gerador'), ('b27', 'Os anos passam'), ('b28', 'O final')],
)
BEATS = [
 # ---------- GANCHO ----------
 dict(id="b01", pre=0.6, post=0.4,
  text="Esse é o lugar mais frio da Terra. Não tem árvore, não tem cidade, e o vizinho mais perto fica a mil quilômetros. E essa estação de pesquisa é a [[y:única casa]] de cento e vinte pessoas."),
 dict(id="b02", pre=0.2, post=0.3,
  text="Hoje é o meio do inverno: faz dois meses que o Sol não aparece. Lá fora, uma nevasca de cento e cinquenta quilômetros por hora. E o gerador [[r:acabou de parar]]."),
 dict(id="b03", pre=0.1, post=0.5,
  text="Sem gerador, não tem aquecimento. Em poucas horas, a estação vira um congelador. Mas pra entender como eles vieram parar aqui, a gente precisa voltar três anos."),
 # ---------- COMEÇO ----------
 dict(id="b04", pre=0.9, post=0.2,
  text="Três anos antes, o planeta entra num verão que não acaba. Ano após ano, as ondas de calor ficam tão fortes que cidades inteiras [[r:ficam vazias]]."),
 dict(id="b05", pre=0.1, post=0.3,
  text="E sobra um lugar que continua gelado: a Antártida. Ela é enorme, uns quatorze milhões de quilômetros quadrados. Mais de [[c:uma vez e meia o Brasil]]."),
 dict(id="b06", pre=0.2, post=0.3,
  text="Hoje, só alguns milhares de cientistas vivem lá no verão, e uns mil no inverno. Mas um navio quebra-gelo leva cento e vinte pessoas até uma estação na costa: a [[y:Estação Aurora]]."),
 dict(id="b07", pre=0.1, post=0.2,
  text="Tem a Ana, trinta anos, que estuda o gelo. O Tião, o mecânico que conversa com motor. A doutora Clara, médica. E o Nico, onze anos, que nunca tinha visto [[y:neve]]."),
 dict(id="b08", pre=0.2, post=0.4,
  text="[[y:Regra número um]]: ninguém sai sozinho. Com esse vento, a sensação térmica passa de cinquenta graus negativos, e a pele exposta congela [[r:em poucos minutos]]."),
 # ---------- VANTAGENS ----------
 dict(id="b09", pre=0.2, post=0.2,
  text="Mas o gelo tem um presente. A Antártida guarda uns noventa por cento de todo o gelo do planeta, e uns [[g:setenta por cento da água doce]]. É só derreter."),
 dict(id="b10", pre=0.1, post=0.2,
  text="E comida? Em dois mil e dezoito, uma estufa alemã na estação Neumayer três colheu uns [[g:duzentos e setenta quilos]] de verdura em plena Antártida. Sem terra, e sem sol: só água e luz de LED."),
 dict(id="b11", pre=0.1, post=0.3,
  text="A Estação Aurora copia a ideia. E no verão, o Sol simplesmente não se põe: são semanas de dia o tempo todo. Os painéis solares trabalham [[y:vinte e quatro horas]], e a estufa fica verdinha."),
 dict(id="b12", pre=0.1, post=0.2,
  text="O mar em volta é cheio de vida: peixe, krill, focas e colônias de pinguins. E o Nico vira o guia oficial dos [[y:pinguins]]. Ele dá nome pra cada um."),
 dict(id="b13", pre=0.1, post=0.3,
  text="Primeiro ano: festa no refeitório. Sopa quente, salada da estufa. E lá fora, o céu pega fogo de verde: a [[c:aurora austral]]."),
 # ---------- PREÇO ----------
 dict(id="b14", pre=0.2, post=0.2,
  text="Mas a Antártida cobra. No inverno, o Sol some, e o frio despenca. O recorde de frio da Terra foi medido aqui: [[r:oitenta e nove graus negativos]], na estação russa Vostok, em mil novecentos e oitenta e três."),
 dict(id="b15", pre=0.1, post=0.2,
  text="E o escuro mexe com a cabeça. Muita gente que passa o inverno lá tem insônia e fica triste. Então a doutora Clara cria a [[y:regra da luz]]: café da manhã todo dia, debaixo das lâmpadas mais fortes."),
 dict(id="b16", pre=0.1, post=0.3,
  text="E tudo depende de uma máquina: o gerador. Ele esquenta a estação, derrete a água e acende a estufa. O Tião cuida dele como se fosse um [[c:bebê]]."),
 # ---------- CTA MEIO ----------
 dict(id="b17", pre=0.1, post=0.4,
  text="E quase todo mundo que assiste ainda não é inscrito. Se você está curtindo a história do Nico, aperta o [[y:inscrever]] e deixa o like. É de graça, e é isso que faz o próximo vídeo sair."),
 # ---------- O PORÉM ----------
 dict(id="b18", pre=0.2, post=0.2,
  text="Só que [[r:tem um porém]]. O gerador fica num módulo separado, a cem metros da estação, por causa do risco de incêndio. E o único caminho até lá, na nevasca, é uma corda guia."),
 dict(id="b19", pre=0.1, post=0.3,
  text="Por três invernos, deu certo. Mas numa noite de julho, o vento começa a uivar, a neve fica de lado, e o barulho do motor [[r:muda]]."),
 # ---------- CLÍMAX ----------
 dict(id="b20", pre=0.2, post=0.2,
  text="Agora, aconteceu. A neve entope a entrada de ar do gerador, e ele [[r:apaga]]. As luzes caem. O aquecimento para."),
 dict(id="b21", pre=0.1, post=0.2,
  text="Lá fora, sessenta graus negativos. O Tião e a Ana se prendem na corda guia e entram na nevasca. Não dá pra ver [[r:nem a própria mão]]."),
 dict(id="b22", pre=0.1, post=0.2,
  text="Dentro da estação, o termômetro não para de cair. E a doutora Clara tem uma ideia que veio [[y:dos pinguins]]."),
 dict(id="b23", pre=0.1, post=0.2,
  text="No inverno, os pinguins-imperadores ficam todos colados, num abraço gigante, e vão revezando quem fica na borda, no vento. Cento e vinte pessoas fazem [[g:a mesma coisa]], no refeitório, com todos os cobertores."),
 dict(id="b24", pre=0.1, post=0.2,
  text="No módulo do gerador, o Tião cava a neve da entrada de ar com as mãos. A Ana segura a lanterna. Primeira tentativa: nada. [[r:Segunda: nada.]]"),
 dict(id="b25", pre=0.1, post=0.4,
  text="Terceira: o motor tosse, engasga… e [[g:pega]]. As luzes voltam, uma por uma."),
 dict(id="b26", pre=0.1, post=0.4,
  text="Quando os dois voltam pela corda, encontram cento e vinte pessoas abraçadas, cantando. Ninguém congelou. E desde aquela noite, a estação tem [[g:dois geradores]], e a entrada de ar ganhou um telhado."),
 # ---------- FINAL ----------
 dict(id="b27", pre=0.2, post=0.3,
  text="Os anos passam. A estação cresce, a estufa vira fazenda. E um dia, o rádio traz a notícia: o planeta [[c:esfriou de novo]]. Dá pra voltar."),
 dict(id="b28", pre=0.2, post=0.3,
  text="O navio vem buscar todo mundo. Mas muita gente [[y:fica]]. E o Nico, agora adulto, é o novo cientista da estação. Ele ainda sabe o nome de cada pinguim."),
 dict(id="b29", pre=0.3, post=0.5,
  text="A humanidade não recomeçou no gelo porque era fácil. Recomeçou porque cento e vinte pessoas aprenderam a dividir o calor, a luz e a comida."),
 dict(id="b30", pre=0.2, post=1.2,
  text="E você? Aguentaria um inverno inteiro sem ver o Sol? Comenta aqui. E se a humanidade tivesse que recomeçar no deserto? Esse é o próximo episódio. Se inscreve, e deixa o like. Até lá!"),
]
