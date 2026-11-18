# Roteiro: "E se a humanidade tivesse que recomeçar em Marte?"
# Fontes: NASA (Mars facts: gravidade 38%, ~-60 °C de média, atmosfera ~95% CO2 e <1% da pressão da Terra, dia de ~24h40);
# Hassler et al. (2014, Science) e Zeitlin et al. (2013, Science) — radiação medida pelo RAD da Curiosity (cruzeiro ~1,8 mSv/dia; superfície ~0,67 mSv/dia);
# NASA/JPL (set/2023) — MOXIE: 122 g de oxigênio no total, "o que um cachorro pequeno respira em ~10 horas";
# NASA Phoenix (2008) — percloratos no solo; NASA (2019) — fim da Opportunity após a tempestade global de poeira de 2018;
# NASA — Marte recebe cerca de 43% da luz solar da Terra; astronautas perdem ~1% a 1,5% de massa óssea por mês em microgravidade;
# NASA/Curiosity (2015) — pôr do sol azul em Marte.
META = dict(
    format='long',
    title='E se a humanidade tivesse que recomeçar em Marte?',
    description="""E se cem pessoas tivessem que recomeçar a humanidade em Marte, sem nenhuma ajuda da Terra? 🚀🔴

A Lia é engenheira de energia. O Rafa é botânico. A doutora Nina é a médica da base. O Teo é piloto e piadista. E Marte tem sessenta graus negativos, ar fino demais pra respirar… e tempestades de poeira do tamanho de continentes.

⏱️ CAPÍTULOS
{CHAPTERS}

📚 Fontes: NASA (fatos sobre Marte, MOXIE, Phoenix, Opportunity, pôr do sol azul fotografado pela Curiosity); Zeitlin et al. (2013) e Hassler et al. (2014), Science — radiação medida pelo instrumento RAD da Curiosity. História ilustrativa (ficção) baseada nesses números.

💬 E você? Iria pra Marte sabendo que nunca mais ia voltar? Comenta aí!
🔔 Próximo episódio: E se a humanidade tivesse que recomeçar debaixo do mar?

#ese #marte #historiasanimadas #curiosidades #animação""",
    tags=['e se', 'e se a humanidade recomeçasse', 'marte', 'colonizar marte', 'história animada', 'cenário hipotético', 'espaço', 'nasa'],
    thumb=dict(beat='b02', frac=0.6, text='PRESOS EM MARTE', text2='e a energia está acabando'),
    chapters=[('b01', 'A única casa'), ('b04', 'Dois anos antes'), ('b08', 'O pouso'), ('b09', 'O lado bom de Marte'), ('b13', 'Marte não perdoa'), ('b17', 'A conta da comida'), ('b19', 'O alerta da Opportunity'), ('b21', 'A tempestade'), ('b27', 'Os anos passam'), ('b29', 'O final')],
)
BEATS = [
 # ---------- GANCHO ----------
 dict(id="b01", pre=0.6, post=0.4,
  text="Esse lugar tem sessenta graus negativos, quase nenhum ar pra respirar, e fica a mais de cinquenta milhões de quilômetros da Terra. E agora, ele é a [[y:única casa]] de cem pessoas."),
 dict(id="b02", pre=0.2, post=0.3,
  text="Uma tempestade de poeira do tamanho de um continente está chegando. Os painéis solares estão ficando cobertos, e a energia da base cai a cada minuto."),
 dict(id="b03", pre=0.1, post=0.5,
  text="Se a energia acabar, a estufa congela, e a comida de um ano inteiro morre numa noite. A Lia tem poucas horas pra salvar tudo. Mas pra entender como eles chegaram aqui, a gente precisa voltar dois anos."),
 # ---------- COMEÇO ----------
 dict(id="b04", pre=0.9, post=0.2,
  text="Dois anos antes, a Lia, trinta e um anos, engenheira de energia, entra numa nave com outras noventa e nove pessoas. A viagem até Marte leva uns [[y:sete meses]]."),
 dict(id="b05", pre=0.1, post=0.2,
  text="Tem um botânico, o Rafa. Uma médica, a doutora Nina. E o Teo, vinte e dois anos, piloto, que conta piada até quando a nave treme."),
 dict(id="b06", pre=0.2, post=0.4,
  text="[[y:Regra número um]]: a Terra não vai mandar mais nada. Nem comida, nem peças, nem gente. Tudo o que eles precisarem, vão ter que tirar de Marte."),
 dict(id="b07", pre=0.1, post=0.3,
  text="E a viagem já cobra um preço. Medições da sonda {Curiosity|Quiuriósiti} mostram que, no caminho até Marte, a radiação é [[r:centenas de vezes maior]] do que aqui na superfície da Terra."),
 dict(id="b08", pre=0.2, post=0.3,
  text="Pouso. A porta abre, e a primeira coisa que o Teo faz é pular. Em Marte, a gravidade é só trinta e oito por cento da Terra. Ele sobe mais de um metro, e cai rindo."),
 # ---------- VANTAGENS ----------
 dict(id="b09", pre=0.2, post=0.2,
  text="Primeira descoberta: Marte tem coisas boas. Um dia lá dura quase vinte e quatro horas e quarenta minutos. Quase igual ao nosso. Dá até pra dormir direito."),
 dict(id="b10", pre=0.1, post=0.2,
  text="E tem água. Congelada, debaixo do chão e nos polos. A Lia derrete o gelo, e a água vira três coisas: [[c:bebida]], [[g:irrigação]], e [[y:oxigênio]]."),
 dict(id="b11", pre=0.1, post=0.2,
  text="E o próprio ar ajuda. Um aparelho da Nasa do tamanho de uma torradeira, o {MOXIE|Móxi}, já tirou oxigênio do ar de Marte. Pouco: cento e vinte e dois gramas, o que um cachorrinho respira em umas dez horas. Mas funcionou."),
 dict(id="b12", pre=0.1, post=0.3,
  text="Primeiro mês: festa. Eles batizam a base de [[y:Nova Esperança]], jogam futebol com a bola voando longe, e o Teo bate o recorde de salto em altura. Do planeta, pelo menos."),
 # ---------- PREÇO ----------
 dict(id="b13", pre=0.2, post=0.2,
  text="Mas Marte não perdoa. Lá fora, a temperatura média é de uns sessenta graus negativos. E o ar é quase todo gás carbônico, e tão fino que, sem traje, ninguém sobrevive."),
 dict(id="b14", pre=0.1, post=0.2,
  text="O solo tem um veneno chamado perclorato. Antes de plantar qualquer coisa, o Rafa precisa lavar a terra marciana, balde por balde."),
 dict(id="b15", pre=0.1, post=0.3,
  text="E a gravidade baixa, que era divertida, começa a cobrar. No espaço, astronautas perdem cerca de um por cento dos ossos por mês. Então a doutora Nina cria uma regra: [[y:duas horas de exercício por dia]]."),
 # ---------- CTA MEIO ----------
 dict(id="b16", pre=0.1, post=0.4,
  text="E quase todo mundo que assiste ainda não é inscrito. Se você está curtindo a história da Lia, aperta o [[y:inscrever]] e deixa o like. É de graça, e é isso que faz o próximo vídeo sair."),
 # ---------- A CONTA ----------
 dict(id="b17", pre=0.2, post=0.2,
  text="E aí vem a conta da comida. Cem pessoas precisam de umas duzentas mil calorias por dia. A nave trouxe comida pra dezoito meses. Depois disso, ou a estufa funciona, ou acabou."),
 dict(id="b18", pre=0.1, post=0.3,
  text="O Rafa planta batata, feijão e alface debaixo de luz artificial. E o maior inimigo da estufa não é o frio. É a [[r:falta de energia]]."),
 dict(id="b19", pre=0.2, post=0.2,
  text="Só que [[r:tem um porém]]. A energia da base vem quase toda de painéis solares. E em Marte, a luz do Sol chega com menos da metade da força que tem aqui."),
 dict(id="b20", pre=0.1, post=0.3,
  text="Em dois mil e dezoito, uma tempestade de poeira cobriu Marte inteiro. O robô {Opportunity|Opórtiuniti}, que funcionava com energia solar, ficou sem luz, e nunca mais acordou."),
 # ---------- CLÍMAX ----------
 dict(id="b21", pre=0.2, post=0.2,
  text="Agora, a tempestade chegou na Nova Esperança. O céu escurece ao meio-dia. A energia cai pra quarenta por cento. Trinta. Vinte."),
 dict(id="b22", pre=0.1, post=0.2,
  text="A Lia faz a conta. Não dá pra salvar tudo. Ou aquece os quartos, ou aquece a estufa. A assembleia vota, e todo mundo escolhe a mesma coisa: [[g:a estufa]]."),
 dict(id="b23", pre=0.1, post=0.2,
  text="Naquela noite, cem pessoas dormem juntas no mesmo módulo, de casaco, dividindo o calor. E a Lia tem uma ideia: as baterias de reserva do foguete."),
 dict(id="b24", pre=0.1, post=0.2,
  text="Ela, o Teo e o Rafa saem no meio da tempestade, puxando um cabo de quatrocentos metros até o foguete. Lá fora, não dá pra enxergar dois metros à frente."),
 dict(id="b25", pre=0.1, post=0.4,
  text="Primeira conexão: nada. Segunda: faísca. Na terceira, a luz da estufa [[g:acende]]. E lá dentro, as folhas ainda estão verdes."),
 dict(id="b26", pre=0.1, post=0.4,
  text="Três dias depois, a poeira baixa. Eles limpam os painéis, um por um, com vassoura. E o Rafa colhe a [[y:primeira batata marciana]]."),
 # ---------- FINAL ----------
 dict(id="b27", pre=0.2, post=0.2,
  text="Os anos passam. Chega a segunda nave. Depois, a terceira. E nasce o primeiro bebê marciano, que vai crescer achando a Terra um planeta pesado demais."),
 dict(id="b28", pre=0.2, post=0.3,
  text="Num fim de tarde, a Lia sobe na colina e vê o pôr do sol de Marte. Lá, ele é [[c:azul]]. E bem pequenininho no céu, um pontinho brilhante: a Terra."),
 dict(id="b29", pre=0.3, post=0.5,
  text="A humanidade não recomeçou em Marte porque o planeta era fácil. Recomeçou porque cem pessoas escolheram salvar a comida de todo mundo, antes do próprio conforto."),
 dict(id="b30", pre=0.2, post=1.2,
  text="E você? Iria pra Marte sabendo que nunca mais ia voltar? Comenta aqui. E se a humanidade tivesse que recomeçar debaixo do mar? Esse é o próximo episódio. Se inscreve, e deixa o like. Até lá!"),
]
