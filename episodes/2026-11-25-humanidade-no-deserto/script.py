# Roteiro: "E se a humanidade tivesse que recomeçar no deserto?"
# Fontes: Britannica — o Saara tem cerca de 9 milhões de km² (maior que o Brasil, ~8,5 milhões), dias acima de 40 °C e noites que podem chegar perto de 0 °C;
# OMM / registros nacionais — temperaturas acima de 50 °C já foram medidas no Saara (ex.: Ouargla, Argélia, 51,3 °C em 2018);
# "Saara verde" / Período Úmido Africano (Nature Education / Eos): entre ~11 mil e ~5 mil anos atrás o Saara tinha lagos, savana, hipopótamos e crocodilos, e a arte rupestre mostra girafas e gado;
# IAEA — Sistema Aquífero de Arenito Núbio (Egito, Líbia, Sudão e Chade): cerca de 150 mil km³ de água subterrânea, em grande parte "fóssil", da época úmida;
# usina solar de concentração Noor Ouarzazate (Marrocos), uma das maiores do mundo;
# tempestades de areia (haboob) formam paredes de poeira com mais de 1 km de altura;
# CDC — no calor extremo uma pessoa trabalhando pode perder cerca de 1 litro de suor por hora;
# redes de neblina no Atacama (Chile): a vila de Chungungo recebeu água de "atrapanieblas" nos anos 1990 (FogQuest / Wikipedia "Fog collection");
# Grande Muralha Verde (União Africana / UNCCD): cinturão de árvores e terras recuperadas de cerca de 8 mil km na borda sul do Saara.
# A "chuva que não para", o Oásis Estrela, a tempestade e os personagens são ficção.
META = dict(
    format='long',
    title='E se a humanidade tivesse que recomeçar no deserto?',
    description="""E se chovesse sem parar em quase todo o planeta, e cento e cinquenta pessoas tivessem que recomeçar a vida no lugar mais seco que sobrou: o Saara? 🏜️🌴

A Lara é engenheira e entende de água. O Seu Bento é o guia que já atravessou o deserto vinte vezes. A doutora Nádia é médica. E o Pipo, de dez anos, nunca tinha visto uma duna. Lá tem sol de sobra e água escondida debaixo da areia… mas tudo depende de um poço só.

⏱️ CAPÍTULOS
{CHAPTERS}

📚 Fontes: Britannica (tamanho e clima do Saara); registros de temperatura acima de 50 °C no Saara; Nature Education e Eos (o "Saara verde" de 11 mil a 5 mil anos atrás); IAEA (Sistema Aquífero de Arenito Núbio, cerca de 150 mil km³); usina solar Noor Ouarzazate (Marrocos); CDC (perda de suor no calor extremo); redes de neblina no deserto do Atacama (Chile); UNCCD (Grande Muralha Verde, cerca de 8 mil km). A "chuva que não para", o Oásis Estrela, a tempestade e os personagens são ficção. História ilustrativa baseada nesses fatos.

💬 E você? Aguentaria viver num lugar onde quase nunca chove? Comenta aí!
🔔 Próximo episódio: E se a humanidade tivesse que recomeçar na Lua?

#ese #deserto #saara #historiasanimadas #curiosidades #animação""",
    tags=['e se', 'e se a humanidade recomeçasse', 'deserto', 'saara', 'oásis', 'tempestade de areia', 'história animada', 'cenário hipotético', 'curiosidades'],
    thumb=dict(beat='b02', frac=0.55, text='A ÚLTIMA ÁGUA', text2='e uma tempestade de areia chegando'),
    chapters=[('b01', 'A tempestade'), ('b04', 'A chuva que não para'), ('b10', 'O segredo debaixo da areia'), ('b15', 'O preço do calor'), ('b19', 'O ponto fraco'), ('b21', 'Três dias sem bomba'), ('b28', 'Os anos passam'), ('b29', 'O final')],
)
BEATS = [
 # ---------- GANCHO ----------
 dict(id="b01", pre=0.6, post=0.4,
  text="Esse é o maior deserto quente do mundo. Areia até onde a vista alcança, e quase nunca chove. E esse oásis é a [[y:única casa]] de cento e cinquenta pessoas."),
 dict(id="b02", pre=0.2, post=0.3,
  text="Hoje, o horizonte ficou marrom. Uma parede de areia, com mais de um quilômetro de altura, vem na direção deles. E a bomba do único poço [[r:acabou de parar]]."),
 dict(id="b03", pre=0.1, post=0.5,
  text="Sem bomba, não tem água. E no calor do deserto, uma pessoa pode suar [[r:um litro por hora]]. Mas pra entender como eles vieram parar aqui, a gente precisa voltar três anos."),
 # ---------- COMEÇO ----------
 dict(id="b04", pre=0.9, post=0.2,
  text="Três anos antes, o clima do planeta muda, e começa uma chuva que [[c:não para]]. Rios transbordam, cidades ficam debaixo d'água, e o mofo destrói as plantações."),
 dict(id="b05", pre=0.1, post=0.3,
  text="E sobra um lugar seco: o Saara. Ele tem uns nove milhões de quilômetros quadrados. É [[y:maior que o Brasil]] inteiro."),
 dict(id="b06", pre=0.2, post=0.3,
  text="E ele nem sempre foi deserto. Uns seis mil anos atrás, o Saara era verde, cheio de lagos, com hipopótamos e crocodilos. As pinturas nas rochas [[g:mostram isso até hoje]]."),
 dict(id="b07", pre=0.1, post=0.2,
  text="Uma caravana de caminhões leva cento e cinquenta pessoas até um oásis no meio do nada: o [[y:Oásis Estrela]]."),
 dict(id="b08", pre=0.2, post=0.2,
  text="Tem a Lara, engenheira que entende de água. O Seu Bento, guia que já atravessou o deserto vinte vezes. A doutora Nádia, médica. E o Pipo, dez anos, que nunca tinha visto [[y:uma duna]]."),
 dict(id="b09", pre=0.2, post=0.4,
  text="[[y:Regra número um]]: ninguém trabalha no sol do meio-dia. De dia, o calor passa dos quarenta graus. E de noite, o frio pode chegar [[c:perto de zero]]."),
 # ---------- VANTAGENS ----------
 dict(id="b10", pre=0.2, post=0.2,
  text="Mas o deserto tem um segredo debaixo dos pés. Embaixo do Saara fica um dos maiores reservatórios de água subterrânea do mundo: o Aquífero Núbio, com uns [[g:cento e cinquenta mil quilômetros cúbicos]] de água."),
 dict(id="b11", pre=0.1, post=0.2,
  text="É água fóssil, que caiu como chuva quando o Saara era verde. O oásis tem um poço, e uma bomba puxa essa água [[g:lá do fundo]]."),
 dict(id="b12", pre=0.1, post=0.3,
  text="E energia? Sol é o que não falta. No Marrocos, a usina de {Noor Ouarzazate|Nur Uarzazate} é uma das maiores usinas solares do mundo. O oásis faz igual, em pequeno: [[y:painéis solares]] pra todo lado."),
 dict(id="b13", pre=0.1, post=0.2,
  text="Com água e sol, a horta cresce na sombra das tamareiras. E o Pipo descobre o melhor brinquedo do mundo: [[y:escorregar nas dunas]]."),
 dict(id="b14", pre=0.1, post=0.3,
  text="Primeiro ano: festa na tenda grande. Pão, tâmaras, música. E lá fora, um céu com [[c:milhares de estrelas]], sem nenhuma luz de cidade pra atrapalhar."),
 # ---------- PREÇO ----------
 dict(id="b15", pre=0.2, post=0.2,
  text="Mas o deserto cobra. No verão, já foram medidos [[r:mais de cinquenta graus]] no Saara. Andar na areia ao meio-dia é como pisar numa frigideira."),
 dict(id="b16", pre=0.1, post=0.2,
  text="Então a doutora Nádia cria a [[y:regra da água]]: todo mundo bebe o dia inteiro, mesmo sem sede. Roupa clara, larga, e cabeça coberta, como os povos do deserto fazem há séculos."),
 dict(id="b17", pre=0.1, post=0.3,
  text="E tudo depende de uma coisa: o poço. Ele dá água pra beber, pra horta, pra tudo. A Lara cuida da bomba como se fosse um [[c:bebê]]."),
 # ---------- CTA MEIO ----------
 dict(id="b18", pre=0.1, post=0.4,
  text="E quase todo mundo que assiste ainda não é inscrito. Se você está curtindo a história do Pipo, aperta o [[y:inscrever]] e deixa o like. É de graça, e é isso que faz o próximo vídeo sair."),
 # ---------- O PORÉM ----------
 dict(id="b19", pre=0.2, post=0.2,
  text="Só que [[r:tem um porém]]. O oásis tem um poço só. E o Seu Bento sabe qual é o pior inimigo do deserto: a tempestade de areia."),
 dict(id="b20", pre=0.1, post=0.3,
  text="Por três anos, o céu ficou limpo. Mas numa tarde de junho, o vento para de repente. Os pássaros somem. E o Seu Bento olha pro horizonte e grita: [[r:corre!]]"),
 # ---------- CLÍMAX ----------
 dict(id="b21", pre=0.2, post=0.2,
  text="Agora, aconteceu. A tempestade engole o oásis. A areia entra em tudo, cobre os painéis, e entope a bomba do poço. Ela [[r:para]]."),
 dict(id="b22", pre=0.1, post=0.2,
  text="A caixa d'água tem o suficiente pra [[r:dois dias]]. A Lara e o Seu Bento amarram panos no rosto e começam a cavar. Mas a areia volta tão rápido quanto sai."),
 dict(id="b23", pre=0.1, post=0.2,
  text="No dia seguinte, bem cedo, o Pipo repara numa coisa: os painéis solares estão [[y:molhados]]. É o orvalho da noite fria."),
 dict(id="b24", pre=0.1, post=0.2,
  text="No deserto do Atacama, no Chile, vilas já beberam água tirada da neblina, com redes. A doutora Nádia tem a ideia: lonas, redes, tudo vira [[g:coletor de orvalho]]. Cada gota vai pra um balde."),
 dict(id="b25", pre=0.1, post=0.2,
  text="Não é muito, mas compra tempo. No terceiro dia, a Lara desmonta a bomba e tira a areia, peça por peça. Primeira tentativa: nada. [[r:Segunda: nada.]]"),
 dict(id="b26", pre=0.1, post=0.4,
  text="Terceira: a bomba ronca, tosse… e a água [[g:jorra]]. Cento e cinquenta pessoas dançam debaixo do jato."),
 dict(id="b27", pre=0.1, post=0.3,
  text="Desde aquele dia, o oásis tem [[g:dois poços]] e uma muralha de árvores pra segurar o vento. Igual à Grande Muralha Verde, um cinturão de uns oito mil quilômetros que a África está plantando de verdade na borda do Saara."),
 # ---------- FINAL ----------
 dict(id="b28", pre=0.2, post=0.3,
  text="Os anos passam. O oásis vira uma cidade, e a horta vira um bosque. Um dia, o rádio traz a notícia: a chuva [[c:parou]]. Dá pra voltar."),
 dict(id="b29", pre=0.2, post=0.3,
  text="Muita gente volta. Mas muita gente [[y:fica]]. E o Pipo, agora adulto, é quem cuida dos poços. E toda noite, ele ainda conta as estrelas."),
 dict(id="b30", pre=0.3, post=0.5,
  text="A humanidade não recomeçou no deserto porque era fácil. Recomeçou porque cento e cinquenta pessoas aprenderam que [[y:cada gota conta]]."),
 dict(id="b31", pre=0.2, post=1.2,
  text="E você? Aguentaria viver num lugar onde quase nunca chove? Comenta aqui. E se a humanidade tivesse que recomeçar na Lua? Esse é o próximo episódio. Se inscreve, e deixa o like. Até lá!"),
]
