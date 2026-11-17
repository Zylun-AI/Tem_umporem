# Roteiro: "E se a humanidade recomeçasse com 98 pessoas?"
# Fontes: Marin & Beluffi (2018, arXiv:1806.03856 / JBIS) — 98 pessoas numa nave de gerações, com regras;
# Cameron Smith (2014, Acta Astronautica) — 14 mil a 44 mil; Mayflower (1620) — 102 passageiros, ~metade morreu no 1º inverno;
# Tristão da Cunha — população descende de poucos fundadores; estudos (Zamel et al. 1996) acharam asma muito acima da média.
META = dict(
    format='long',
    title='E se a humanidade recomeçasse com 98 pessoas?',
    description="""E se só sobrassem 98 pessoas no planeta, todas acordando no gramado do Maracanã? 🌍

A Bia é engenheira. O Seu Jorge é agricultor. A doutora Helena é a única médica. E existe uma conta que diz que 98 é o número mínimo… se ninguém se perder no caminho.

⏱️ CAPÍTULOS
{CHAPTERS}

📚 Fontes: Marin & Beluffi (2018), simulação de nave de gerações (arXiv:1806.03856); Cameron Smith (2014), Acta Astronautica; registros históricos do Mayflower (1620); estudos genéticos sobre Tristão da Cunha. História ilustrativa (ficção) baseada nesses números.

💬 E você? Numa cidade de 98 pessoas, qual seria a sua função? Comenta aí!
🔔 Próximo episódio: E se a humanidade tivesse que recomeçar em Marte?

#ese #historiasanimadas #curiosidades #animação""",
    tags=['e se', 'e se a humanidade recomeçasse', '98 pessoas', 'apocalipse', 'história animada', 'cenário hipotético', 'população mínima'],
    thumb=dict(beat='b04', frac=0.85, text='SÓ SOBRARAM 98', text2='e ninguém pode faltar'),
    chapters=[('b01', 'O número 98'), ('b04', 'Seis meses antes'), ('b07', 'Muito melhor que dois'), ('b10', 'Noventa e oito opiniões'), ('b12', 'A conta da comida'), ('b15', 'O estudo do 98'), ('b18', 'Os alertas da história'), ('b20', 'O inverno'), ('b22', 'A noite do gerador'), ('b25', 'Os anos passam'), ('b27', 'O final')],
)
BEATS = [
 # ---------- GANCHO ----------
 dict(id="b01", pre=0.6, post=0.5,
  text="Esse número era oito bilhões e duzentos milhões. Agora ele é [[y:noventa e oito]]. E hoje à noite, ele pode cair."),
 dict(id="b02", pre=0.2, post=0.3,
  text="Uma febre se espalhou pelo acampamento. Vinte pessoas estão de cama, o hospital está no escuro, e a única médica do grupo tem uma lanterna na mão."),
 dict(id="b03", pre=0.1, post=0.5,
  text="O gerador do hospital quebrou. A Bia tem uma noite pra fazer ele funcionar. Mas pra entender como eles chegaram até aqui, a gente precisa voltar seis meses."),
 # ---------- COMEÇO ----------
 dict(id="b04", pre=0.9, post=0.2,
  text="Seis meses antes, a Bia, vinte e seis anos, engenheira eletricista, acorda deitada no gramado do Maracanã. Em volta dela, gente desconhecida levantando, assustada. Ela conta. Noventa e oito."),
 dict(id="b05", pre=0.1, post=0.2,
  text="Tem uma médica, a doutora Helena. Um pedreiro, o Tonho. Um agricultor de sessenta e um anos, o Seu Jorge. E o Davi, dezenove anos, que até ontem só sabia jogar videogame. E ninguém conhece ninguém."),
 dict(id="b06", pre=0.2, post=0.4,
  text="[[y:Regra número um]]: o resto da humanidade sumiu. Só sobraram essas noventa e oito pessoas, todas no Rio de Janeiro. Prédios, comida e máquinas ficaram exatamente onde estavam."),
 # ---------- VANTAGENS ----------
 dict(id="b07", pre=0.2, post=0.2,
  text="Primeira descoberta: noventa e oito é muito melhor que dois. Quando um não sabe, outro sabe. O pedreiro ensina, a médica cuida, e uma padeira faz pão quentinho toda manhã."),
 dict(id="b08", pre=0.1, post=0.2,
  text="Primeira semana: festa. O supermercado vira refeitório. Noventa e oito pessoas comendo de graça, e alguém sempre lava a louça. Quase sempre. À noite, o Davi organiza um campeonato de videogame no telão de um shopping."),
 dict(id="b09", pre=0.1, post=0.3,
  text="Domingo tem futebol no Maracanã. Quarenta e nove contra quarenta e nove. Placar: onze a dez. Até hoje ninguém aceita aquele pênalti."),
 # ---------- PREÇO ----------
 dict(id="b10", pre=0.2, post=0.2,
  text="Mas noventa e oito pessoas também são noventa e oito opiniões. E no décimo dia, sem ninguém nas usinas, a cidade inteira apaga. Elevador parado, chuveiro gelado, e noventa e oito celulares sem bateria."),
 dict(id="b11", pre=0.1, post=0.3,
  text="Primeira assembleia. Quem manda? Uns querem um líder. Outros querem votar tudo. Depois de quatro horas de discussão, eles decidem a coisa mais difícil: [[y:dividir as tarefas]]."),
 dict(id="b12", pre=0.1, post=0.2,
  text="E aí vem a conta da comida. Noventa e oito pessoas precisam de umas duzentas mil calorias por dia. Sem geladeira, a comida fresca estraga, e as latas dos mercados do bairro somem em poucas semanas."),
 dict(id="b13", pre=0.1, post=0.3,
  text="O Seu Jorge vira o homem mais importante da cidade. Ele ensina a plantar feijão, milho e mandioca. E o Davi descobre que é ótimo numa coisa: [[g:irrigação]]. Ele desvia a água de um cano quebrado e molha a horta inteira sem carregar um balde."),
 # ---------- CTA MEIO ----------
 dict(id="b14", pre=0.1, post=0.4,
  text="E quase todo mundo que assiste ainda não é inscrito. Se você está curtindo a história da Bia, aperta o [[y:inscrever]] e deixa o like. É de graça, e é isso que faz o próximo vídeo sair."),
 # ---------- A CONTA ----------
 dict(id="b15", pre=0.2, post=0.2,
  text="Numa noite, a Bia acha um estudo que tira o sono dela. Em dois mil e dezoito, o astrofísico {Frédéric Marin|Frederique Marã} simulou uma nave viajando por milhares de anos, e calculou que noventa e oito pessoas bastariam pra manter uma população saudável."),
 dict(id="b16", pre=0.1, post=0.2,
  text="Só que [[r:tem um porém]]. A simulação só funciona com regras rígidas: ninguém tem filhos com parente próximo, e cada família planeja quantos filhos vai ter, por gerações."),
 dict(id="b17", pre=0.1, post=0.3,
  text="E outros cientistas são bem mais exigentes. O antropólogo {Cameron Smith|Quémeron Esmíth} fala em catorze mil a quarenta e quatro mil pessoas. Noventa e oito é o mínimo do mínimo. [[r:Ninguém pode faltar.]]"),
 # ---------- A HISTÓRIA AVISA ----------
 dict(id="b18", pre=0.2, post=0.2,
  text="E a história real dá dois avisos. Em mil seiscentos e vinte, o navio Mayflower levou cento e duas pessoas para a América. No primeiro inverno, quase metade morreu."),
 dict(id="b19", pre=0.1, post=0.3,
  text="E na ilha de Tristão da Cunha, no meio do Atlântico, quase todo mundo descende de um punhado de fundadores. Lá, a asma é muito mais comum do que no resto do mundo. A Bia fecha o livro. E o inverno chega."),
 # ---------- CLÍMAX ----------
 dict(id="b20", pre=0.2, post=0.2,
  text="Primeiro, uma tosse. Depois, febre. Em uma semana, vinte pessoas estão de cama. A doutora Helena tem remédio, mas tem um problema maior: o hospital precisa de energia."),
 dict(id="b21", pre=0.1, post=0.2,
  text="Numa tempestade, o gerador queima. Sem luz, não tem oxigênio ligado, não tem aquecedor, não tem geladeira pros remédios. A doutora olha pra Bia. Você consegue?"),
 dict(id="b22", pre=0.1, post=0.2,
  text="A Bia nunca consertou um gerador desse tamanho. Mas dessa vez, ela não está sozinha. O Tonho segura a peça, o Davi ilumina, o Seu Jorge gira a manivela. Lá fora, a chuva não para."),
 dict(id="b23", pre=0.1, post=0.4,
  text="Primeira tentativa: nada. Segunda: fumaça. Na terceira, o motor tosse, tosse de novo, e [[g:liga]]. As luzes do hospital voltam, uma por uma."),
 dict(id="b24", pre=0.1, post=0.4,
  text="Na manhã seguinte, a febre começa a baixar. A doutora Helena escreve o número no quadro da enfermaria. [[y:Noventa e oito.]] Ninguém ficou pra trás. E a Bia dorme pela primeira vez em dois dias."),
 # ---------- FINAL ----------
 dict(id="b25", pre=0.2, post=0.2,
  text="Os anos passam. A primeira colheita grande. O primeiro bebê. Depois, o segundo. A regra do estudo vira lei da assembleia, e uma árvore genealógica gigante fica pendurada na parede da escola."),
 dict(id="b26", pre=0.2, post=0.3,
  text="Sessenta anos depois, a Bia, de cabelo branco, senta em volta da fogueira com os netos. E o número muda. Cento e cinquenta. Trezentos. Quinhentos."),
 dict(id="b27", pre=0.3, post=0.5,
  text="A humanidade não recomeçou por causa de um herói. Recomeçou porque noventa e oito pessoas aprenderam a decidir juntas, e a não deixar ninguém pra trás."),
 dict(id="b28", pre=0.2, post=1.2,
  text="E você? Numa cidade de noventa e oito pessoas, qual seria a sua função? Comenta aqui. E se a humanidade tivesse que recomeçar em Marte? Esse é o próximo episódio. Se inscreve, e deixa o like. Até lá!"),
]
