# Roteiro: "E se a humanidade tivesse que recomeçar na Lua?"
# Fontes: NASA — distância média Terra–Lua ~384.400 km; as missões Apollo levavam cerca de 3 dias até a Lua;
# NASA (abril de 2026) — a Artemis II levou 4 astronautas numa volta ao redor da Lua, a primeira viagem tripulada até a Lua em mais de 50 anos;
# NASA — gravidade da Lua ≈ 1/6 da Terra; sem atmosfera, o céu é preto; temperaturas de cerca de +120 °C ao sol e −130 °C à noite no equador,
#   e crateras sombreadas dos polos estão entre os lugares mais frios do Sistema Solar (abaixo de −200 °C, LRO/Diviner);
# NASA/JPL (agosto de 2018, PNAS, dados do instrumento M3 da Chandrayaan-1) — gelo de água confirmado em crateras dos polos onde o sol nunca bate;
# eletrólise: com eletricidade, a água se separa em hidrogênio e oxigênio;
# picos de "luz quase eterna" na borda de crateras do polo sul (ex.: borda da cratera Shackleton);
# da Lua, a Terra parece cerca de 4 vezes maior que a Lua cheia vista daqui, e fica quase parada no céu (a Lua mostra sempre a mesma face);
# a Lua não tem campo magnético global — bússola não funciona;
# NASA — a poeira lunar é afiada e abrasiva; Harrison Schmitt (Apollo 17) descreveu a "febre do feno lunar";
# NASA (2006) — sismógrafos da Apollo registraram tremores lunares rasos de até ~magnitude 5, alguns duraram mais de 10 minutos;
# Nature Astronomy (julho de 2024) — radar da LRO confirmou um túnel/caverna acessível abaixo de um poço no Mar da Tranquilidade.
# O asteroide, a Base Saudade, o tremor que corta o cabo e os personagens são ficção.
META = dict(
    format='long',
    title='E se a humanidade tivesse que recomeçar na Lua?',
    description="""E se um asteroide gigante fosse atingir a Terra, e cento e vinte pessoas tivessem que recomeçar a vida na Lua? 🌕🚀

A Duda é engenheira elétrica. O Seu Raimundo é ex-mineiro e cuida da mina de gelo. A doutora Yara é médica. E o Biel, de nove anos, trouxe um telescópio de brinquedo. Lá não tem ar, mas tem gelo nas crateras e um sol que quase nunca se põe… e tudo depende de um cabo só.

⏱️ CAPÍTULOS
{CHAPTERS}

📚 Fontes: NASA (distância Terra–Lua, gravidade, temperaturas, poeira lunar, tremores lunares registrados pelas Apollo); NASA, abril de 2026 (missão Artemis II); NASA/JPL e PNAS, 2018 (gelo de água confirmado nos polos da Lua, dados da Chandrayaan-1); LRO/Diviner (crateras mais frias do Sistema Solar); Nature Astronomy, 2024 (túnel abaixo de um poço no Mar da Tranquilidade). O asteroide, a Base Saudade, o tremor que corta o cabo e os personagens são ficção. História ilustrativa baseada nesses fatos.

💬 E você? Aguentaria viver num lugar sem ar, olhando a Terra pela janela? Comenta aí!
🔔 Próximo episódio: E se a humanidade tivesse que recomeçar num navio que nunca pode parar?

#ese #lua #espaço #historiasanimadas #curiosidades #animação""",
    tags=['e se', 'e se a humanidade recomeçasse', 'lua', 'base na lua', 'espaço', 'astronauta', 'artemis', 'história animada', 'cenário hipotético', 'curiosidades'],
    thumb=dict(beat='b24', frac=0.85, text='SEM ENERGIA NA LUA', text2='e o ar acaba em 2 dias'),
    chapters=[('b01', 'O tremor'), ('b04', 'O asteroide'), ('b10', 'O segredo nas crateras'), ('b15', 'O preço da Lua'), ('b19', 'O ponto fraco'), ('b21', 'Dois dias de ar'), ('b28', 'Os anos passam'), ('b29', 'O final')],
)
BEATS = [
 # ---------- GANCHO ----------
 dict(id="b01", pre=0.6, post=0.4,
  text="Essa é a Lua. Nenhum ar pra respirar, um céu preto o dia inteiro, e crateras com [[c:mais de duzentos graus negativos]]. E essa base é a [[y:única casa]] de cento e vinte pessoas."),
 dict(id="b02", pre=0.2, post=0.3,
  text="Hoje, o chão começou a tremer. Um tremor lunar sacudiu tudo, e o cabo que traz energia da torre solar [[r:se partiu]]."),
 dict(id="b03", pre=0.1, post=0.5,
  text="Sem energia, a máquina que faz oxigênio para. E as baterias duram [[r:só dois dias]]. Mas pra entender como eles vieram parar aqui, a gente precisa voltar cinco anos."),
 # ---------- COMEÇO ----------
 dict(id="b04", pre=0.9, post=0.2,
  text="Cinco anos antes, os telescópios encontram um asteroide gigante em rota de colisão com a Terra. O impacto vai jogar tanta poeira no céu que o sol vai sumir [[r:por anos]]."),
 dict(id="b05", pre=0.1, post=0.3,
  text="Quase todo mundo vai pra abrigos debaixo da terra. Mas, por segurança, cento e vinte pessoas vão guardar sementes e conhecimento num lugar bem longe do impacto: [[y:a Lua]]."),
 dict(id="b06", pre=0.2, post=0.3,
  text="São uns [[c:trezentos e oitenta e quatro mil quilômetros]]. Os astronautas da Apollo levavam uns três dias. E em 2026, a missão Artemis 2 levou quatro pessoas pra dar a volta na Lua, a primeira vez em mais de cinquenta anos."),
 dict(id="b07", pre=0.1, post=0.2,
  text="Eles pousam no polo sul da Lua e montam a [[y:Base Saudade]]. O nome é porque, de lá, a Terra fica parada no céu, olhando pra eles."),
 dict(id="b08", pre=0.2, post=0.2,
  text="Tem a Duda, engenheira elétrica. O Seu Raimundo, ex-mineiro que nunca tinha saído de Minas Gerais. A doutora Yara, médica. E o Biel, nove anos, que trouxe um [[y:telescópio de brinquedo]]."),
 dict(id="b09", pre=0.2, post=0.4,
  text="[[y:Regra número um]]: ninguém sai sem traje. Lá fora não tem ar, e entre o sol e a sombra a temperatura muda [[r:mais de duzentos graus]]."),
 # ---------- VANTAGENS ----------
 dict(id="b10", pre=0.2, post=0.2,
  text="Mas a Lua guarda um segredo nos polos. Em 2018, cientistas confirmaram [[g:gelo de água]] escondido no fundo de crateras onde o sol nunca bate."),
 dict(id="b11", pre=0.1, post=0.2,
  text="O Seu Raimundo vira o chefe da mina de gelo. Gelo derretido vira água pra beber. E com eletricidade, a água se separa em hidrogênio e [[g:oxigênio]]. É assim que a base respira."),
 dict(id="b12", pre=0.1, post=0.3,
  text="E energia? Na borda de algumas crateras do polo sul, o sol quase [[y:nunca se põe]]. Lá em cima fica a torre solar, ligada à base por um cabo de dois quilômetros."),
 dict(id="b13", pre=0.1, post=0.2,
  text="E a gravidade é só um sexto da Terra. O Biel pula [[y:seis vezes mais alto]], e o Seu Raimundo carrega pedras que aqui na Terra ele nem conseguiria levantar."),
 dict(id="b14", pre=0.1, post=0.3,
  text="Primeiro ano: festa na estufa, com a primeira alface colhida fora da Terra. E pela janela, o Biel aponta o telescópio pro planeta azul, [[c:quatro vezes maior]] que a Lua cheia vista daqui."),
 # ---------- PREÇO ----------
 dict(id="b15", pre=0.2, post=0.2,
  text="Mas a Lua cobra. A poeira lunar é afiada como [[r:caquinho de vidro]]. Os astronautas da Apollo reclamavam: ela gruda em tudo, entra nos trajes e irrita o nariz."),
 dict(id="b16", pre=0.1, post=0.2,
  text="E sem ar, nada segura a radiação do sol. Então a base fica enterrada debaixo de [[y:uma camada grossa de terra lunar]], e a doutora Yara controla quanto tempo cada um passa lá fora."),
 dict(id="b17", pre=0.1, post=0.3,
  text="E tudo depende de uma coisa: o cabo da torre solar. Sem ele, não tem luz, não tem água, e não tem [[c:ar]]. A Duda confere o cabo toda semana."),
 # ---------- CTA MEIO ----------
 dict(id="b18", pre=0.1, post=0.4,
  text="E quase todo mundo que assiste ainda não é inscrito. Se você está curtindo a história do Biel, aperta o [[y:inscrever]] e deixa o like. É de graça, e é isso que faz o próximo vídeo sair."),
 # ---------- O PORÉM ----------
 dict(id="b19", pre=0.2, post=0.2,
  text="Só que [[r:tem um porém]]. A Lua não é tão parada quanto parece. Os sismógrafos deixados pela Apollo registraram tremores lunares que duraram [[r:mais de dez minutos]]."),
 dict(id="b20", pre=0.1, post=0.3,
  text="Por cinco anos, nada. Mas numa manhã, as canecas começam a tremer na mesa. O Seu Raimundo, que já viveu isso na mina, reconhece na hora e grita: [[r:segura!]]"),
 # ---------- CLÍMAX ----------
 dict(id="b21", pre=0.2, post=0.2,
  text="Agora, aconteceu. O chão sacode por minutos. Lá fora, uma rocha rola do morro e corta o cabo da torre. As luzes [[r:apagam]]."),
 dict(id="b22", pre=0.1, post=0.2,
  text="A máquina de oxigênio para. As baterias seguram [[r:dois dias]]. A Duda e o Seu Raimundo vestem os trajes e saem no jipe lunar pra achar o corte."),
 dict(id="b23", pre=0.1, post=0.2,
  text="Mas o caminho passa por uma sombra escura como breu, e a tela de navegação do jipe [[r:apagou]] no tremor. Na Lua não tem GPS. E bússola não funciona."),
 dict(id="b24", pre=0.1, post=0.2,
  text="No rádio, o Biel tem a ideia: a Terra [[y:nunca sai do lugar]] no céu da Lua. É só manter ela sempre à esquerda, que eles chegam na torre."),
 dict(id="b25", pre=0.1, post=0.2,
  text="Eles seguem a Terra no escuro e acham o cabo cortado. A Duda emenda os fios com as luvas grossas. Primeira tentativa: nada. [[r:Segunda: nada.]]"),
 dict(id="b26", pre=0.1, post=0.4,
  text="Terceira: uma faísca… e as luzes da base [[g:acendem]]. Cento e vinte pessoas comemoram, flutuando a cada pulo."),
 dict(id="b27", pre=0.1, post=0.3,
  text="Desde aquele dia, a base tem [[g:dois cabos]], por caminhos diferentes. E uma cidade nova está nascendo dentro de um túnel de lava, igual ao que cientistas confirmaram em 2024 debaixo do Mar da Tranquilidade."),
 # ---------- FINAL ----------
 dict(id="b28", pre=0.2, post=0.3,
  text="Os anos passam. A base vira uma cidade, e a estufa vira um bosque. Um dia, o rádio traz a notícia: o céu da Terra [[c:limpou]]. Dá pra voltar."),
 dict(id="b29", pre=0.2, post=0.3,
  text="Muita gente volta. Mas muita gente [[y:fica]]. E o Biel, agora adulto, é quem cuida dos cabos. E toda noite, ele ainda acena pro planetinha azul."),
 dict(id="b30", pre=0.3, post=0.5,
  text="A humanidade não recomeçou na Lua porque era fácil. Recomeçou porque cento e vinte pessoas aprenderam a [[y:nunca perder a Terra de vista]]."),
 dict(id="b31", pre=0.2, post=1.2,
  text="E você? Aguentaria viver num lugar sem ar, olhando a Terra pela janela? Comenta aqui. E se a humanidade tivesse que recomeçar num navio que nunca pode parar? Esse é o próximo episódio. Se inscreve, e deixa o like. Até lá!"),
]
