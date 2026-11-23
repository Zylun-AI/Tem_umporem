# Roteiro: "E se a humanidade tivesse que recomeçar numa ilha deserta?"
# Fontes: Evento Carrington (1859) — a maior tempestade solar já registrada; linhas de telégrafo soltaram faíscas e auroras foram vistas perto dos trópicos (NASA / NOAA);
# "náufragos de Tonga" (1965–1966) — seis garotos sobreviveram ~15 meses na ilha de 'Ata, mantiveram uma fogueira acesa o tempo todo,
# guardavam água da chuva em troncos ocos, fizeram uma horta e foram resgatados pelo capitão australiano Peter Warner (registros históricos / The Guardian);
# Tromelin (Oceano Índico) — o navio L'Utile naufragou em 1761; os sobreviventes abandonados mantiveram o fogo aceso por 15 anos;
# em 1776, sete mulheres e um bebê foram resgatados (pesquisa arqueológica do INRAP / Archaeology);
# Alexander Selkirk viveu 4 anos e 4 meses sozinho numa ilha do arquipélago Juan Fernández (1704–1709) e inspirou Robinson Crusoé (1719);
# água do mar não mata a sede (o sal desidrata ainda mais); ferver a água e recolher o vapor separa o sal (destilação).
# O navio, a ilha, o furacão e os personagens são ficção.
META = dict(
    format='long',
    title='E se a humanidade tivesse que recomeçar numa ilha deserta?',
    description="""E se uma tempestade solar apagasse todos os aparelhos do planeta, e sessenta pessoas de um navio à deriva tivessem que recomeçar a vida numa ilha no meio do oceano? 🏝️🔥

A Mari é marinheira. O Zeca é o cozinheiro do navio. A doutora Rosa é médica. E o Kiko, de doze anos, ganhou o trabalho mais importante da ilha: nunca deixar o fogo apagar. Tem coco, peixe e sol de sobra… mas a água doce é contada gota por gota.

⏱️ CAPÍTULOS
{CHAPTERS}

📚 Fontes: NASA/NOAA (Evento Carrington, a tempestade solar de 1859); os náufragos de Tonga (seis garotos que viveram 15 meses na ilha de 'Ata, 1965–1966); a ilha de Tromelin (sobreviventes do naufrágio do L'Utile mantiveram o fogo aceso por 15 anos, resgate em 1776); Alexander Selkirk (4 anos e 4 meses no arquipélago Juan Fernández, inspiração de Robinson Crusoé). O navio, a ilha, o furacão e os personagens são ficção. História ilustrativa baseada nesses fatos.

💬 E você? Ia querer voltar pra casa ou ficar na ilha? Comenta aí!
🔔 Próximo episódio: E se a humanidade tivesse que recomeçar na Antártida?

#ese #ilhadeserta #historiasanimadas #curiosidades #animação""",
    tags=['e se', 'e se a humanidade recomeçasse', 'ilha deserta', 'náufragos', 'história animada', 'cenário hipotético', 'tempestade solar', 'curiosidades'],
    thumb=dict(beat='b02', frac=0.75, text='O FURACÃO CHEGOU', text2='e a água doce está em perigo'),
    chapters=[('b01', 'A ilha na tempestade'), ('b04', 'O dia em que tudo apagou'), ('b09', 'O lado bom da ilha'), ('b14', 'O preço da ilha'), ('b18', 'O ponto fraco'), ('b20', 'O furacão'), ('b27', 'Os anos passam'), ('b28', 'O final')],
)
BEATS = [
 # ---------- GANCHO ----------
 dict(id="b01", pre=0.6, post=0.4,
  text="Essa ilha fica no meio do oceano, a milhares de quilômetros de qualquer cidade. Não tem loja, não tem hospital, não tem internet. E ela é a [[y:única casa]] de sessenta pessoas."),
 dict(id="b02", pre=0.2, post=0.3,
  text="Hoje à noite, o céu ficou preto. O vento passa de cem quilômetros por hora, e as ondas estão [[r:invadindo a praia]]."),
 dict(id="b03", pre=0.1, post=0.5,
  text="Se a água do mar entrar na caixa d'água, a ilha inteira fica sem nada pra beber. Mas pra entender como eles vieram parar aqui, a gente precisa voltar cinco anos."),
 # ---------- COMEÇO ----------
 dict(id="b04", pre=0.9, post=0.2,
  text="Cinco anos antes, o Sol solta uma explosão gigante. Uma tempestade solar atinge a Terra, e de uma hora pra outra, satélites, celulares e computadores [[r:apagam]]."),
 dict(id="b05", pre=0.1, post=0.3,
  text="Isso já aconteceu, numa versão menor. Em mil oitocentos e cinquenta e nove, o [[c:Evento Carrington]] fez fios de telégrafo soltarem faíscas, e teve aurora no céu perto dos trópicos."),
 dict(id="b06", pre=0.2, post=0.3,
  text="Agora imagina algo muito pior. Um navio está no meio do Pacífico quando tudo apaga. Sem motor e sem GPS, ele fica à deriva por semanas, até encalhar numa ilha [[y:que não está em mapa nenhum]]."),
 dict(id="b07", pre=0.1, post=0.2,
  text="Tem a Mari, trinta anos, marinheira. O Zeca, o cozinheiro do navio, que pesca melhor que fala. A doutora Rosa, médica. E o Kiko, doze anos, que nunca tinha visto [[y:uma estrela cadente]]."),
 dict(id="b08", pre=0.2, post=0.4,
  text="[[y:Regra número um]]: ninguém bebe água do mar. O sal faz o corpo perder ainda mais água. E uma pessoa aguenta só uns [[r:três dias]] sem beber."),
 # ---------- VANTAGENS ----------
 dict(id="b09", pre=0.2, post=0.2,
  text="Primeira descoberta: a ilha tem coqueiros. E dentro de cada coco tem água limpa, docinha, [[g:pronta pra beber]]. Nos primeiros dias, é isso que salva todo mundo."),
 dict(id="b10", pre=0.1, post=0.2,
  text="Depois, a Mari arma uma lona velha do navio pra pegar a chuva. Cada tempestade enche a caixa d'água. E quando não chove, eles fervem a água do mar e recolhem o vapor: o sal [[c:fica pra trás]]."),
 dict(id="b11", pre=0.1, post=0.3,
  text="E dá pra viver assim? Dá. Em mil novecentos e sessenta e cinco, seis garotos de Tonga ficaram presos numa ilha deserta do Pacífico por [[y:quinze meses]]. Eles guardavam água da chuva em troncos, fizeram uma horta, e todos sobreviveram."),
 dict(id="b12", pre=0.1, post=0.2,
  text="O mar vira mercado. O Zeca ensina todo mundo a pescar, e o recife na frente da ilha tem [[g:peixe o ano inteiro]]. Eles plantam as sementes de feijão e de abóbora que estavam na cozinha do navio."),
 dict(id="b13", pre=0.1, post=0.3,
  text="Primeiro ano: festa na praia. O Zeca faz peixe assado pra sessenta pessoas. E o Kiko finalmente vê o céu sem nenhuma luz de cidade: são [[y:milhares de estrelas]]."),
 # ---------- PREÇO ----------
 dict(id="b14", pre=0.2, post=0.2,
  text="Mas a ilha cobra. Não tem fósforo, nem isqueiro que dure pra sempre. Então o fogo vira o tesouro da ilha, e o Kiko ganha um trabalho: [[r:nunca deixar o fogo apagar]]."),
 dict(id="b15", pre=0.1, post=0.2,
  text="Isso também é história de verdade. Na ilha de {Tromelin|Tromelã}, no Oceano Índico, os sobreviventes de um naufrágio de mil setecentos e sessenta e um mantiveram a mesma fogueira acesa por [[y:quinze anos]]."),
 dict(id="b16", pre=0.1, post=0.3,
  text="E qualquer machucado vira perigo. Um corte no coral pode infeccionar. A doutora Rosa ferve os panos, e transforma uma cabana no primeiro [[c:hospital da ilha]]."),
 # ---------- CTA MEIO ----------
 dict(id="b17", pre=0.1, post=0.4,
  text="E quase todo mundo que assiste ainda não é inscrito. Se você está curtindo a história da Mari, aperta o [[y:inscrever]] e deixa o like. É de graça, e é isso que faz o próximo vídeo sair."),
 # ---------- O PORÉM ----------
 dict(id="b18", pre=0.2, post=0.2,
  text="Só que [[r:tem um porém]]. Toda a água doce da ilha fica guardada num lugar só: a caixa d'água, perto da praia. Se ela estragar, sessenta pessoas têm três dias."),
 dict(id="b19", pre=0.1, post=0.3,
  text="Por cinco anos, deu certo. Mas uma tarde, as aves somem, o mar fica liso e estranho, e o céu fica cor de [[r:chumbo]]. A Mari conhece esse céu. É furacão."),
 # ---------- CLÍMAX ----------
 dict(id="b20", pre=0.2, post=0.2,
  text="Agora, aconteceu. O vento arranca o teto das cabanas, e as ondas passam por cima da areia, [[r:cada vez mais perto]] da caixa d'água."),
 dict(id="b21", pre=0.1, post=0.2,
  text="A Mari e o Zeca correm pra praia. A tampa da caixa está solta, e se uma onda entrar ali dentro, a água vira [[r:água salgada]]."),
 dict(id="b22", pre=0.1, post=0.2,
  text="E lá em cima, a chuva está apagando a fogueira. O Kiko enfia uma brasa num pote de barro, abraça o pote, e corre pra caverna."),
 dict(id="b23", pre=0.1, post=0.2,
  text="Na praia, a Mari segura a tampa e o Zeca amarra com corda do navio. Uma volta. Duas voltas. E aí vem a [[r:onda maior]]."),
 dict(id="b24", pre=0.1, post=0.2,
  text="A onda bate na caixa d'água, joga os dois na areia… e passa. A tampa [[g:aguentou]]."),
 dict(id="b25", pre=0.1, post=0.4,
  text="De manhã, o céu abre. As cabanas estão destruídas, mas a água doce está salva. E na caverna, dentro do pote do Kiko, a brasa [[y:ainda está acesa]]."),
 dict(id="b26", pre=0.1, post=0.4,
  text="A doutora Rosa confere todo mundo: só arranhões. E desde aquele dia, a ilha tem [[g:três caixas d'água]], em três lugares diferentes."),
 # ---------- FINAL ----------
 dict(id="b27", pre=0.2, post=0.3,
  text="Os anos passam. As cabanas viram casas, a horta vira roça. E uma manhã, o Kiko, já adulto, vê uma coisa no horizonte: [[c:um navio]]. O mundo tinha voltado a funcionar."),
 dict(id="b28", pre=0.2, post=0.3,
  text="O navio veio buscar todo mundo. Mas na hora de embarcar, muita gente [[y:fica]]. A ilha já não era um lugar onde eles estavam presos. Era a casa deles."),
 dict(id="b29", pre=0.3, post=0.5,
  text="A humanidade não recomeçou na ilha porque era fácil. Recomeçou porque sessenta pessoas aprenderam a dividir a água, o peixe e o fogo."),
 dict(id="b30", pre=0.2, post=1.2,
  text="E você? Ia querer voltar pra casa, ou ficar na ilha? Comenta aqui. E se a humanidade tivesse que recomeçar na Antártida? Esse é o próximo episódio. Se inscreve, e deixa o like. Até lá!"),
]
