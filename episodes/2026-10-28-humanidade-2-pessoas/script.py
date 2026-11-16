# Roteiro: "E se a humanidade recomeçasse com apenas 2 pessoas?"
# Markup: [[y:texto]] = palavra destacada (y amarelo, r vermelho, c ciano, g verde)
#         {legenda|fala} = legenda mostra "legenda", a voz fala "fala"
META = dict(
    format='long',
    title='E se a humanidade recomeçasse com apenas 2 pessoas?',
    description="""E se só sobrassem 2 pessoas no planeta, e o resto do mundo ficasse exatamente onde estava? 🌍

Caio, motoboy de 33 anos, e Lia, professora de biologia de 29, acordam num mundo sem ninguém. Supermercado de graça, Ferrari na Paulista, Morumbi só pra eles… até a luz piscar.

⏱️ CAPÍTULOS
{CHAPTERS}

💬 E você? No primeiro dia, aproveitava o mundo de graça ou já corria atrás do tanque? Comenta MUNDO ou TANQUE!
🔔 Próximo episódio: E se a humanidade recomeçasse com 98 pessoas?

#ese #historiasanimadas #curiosidades #animação""",
    tags=['e se', 'e se a humanidade recomeçasse', 'últimas 2 pessoas na terra', 'apocalipse', 'história animada', 'cenário hipotético'],
    thumb=dict(beat='b01', frac=0.9, text='SÓ SOBRARAM 2', text2='e o tanque tem 11 minutos'),
    chapters=[('b01', 'O número que mudou'), ('b04', 'Três semanas antes'), ('b07', 'Regra número um'), ('b08', 'O melhor feriado da história'), ('b12', 'O preço da cidade vazia'), ('b14', 'O hospital sem médicos'), ('b16', 'Primeiro desafio: comida'), ('b20', 'A conta que não fecha'), ('b23', '30 km até o tanque'), ('b24', 'Onze minutos'), ('b26', 'Os anos passam'), ('b27', 'O final')],
)
BEATS = [
 # ---------- GANCHO ----------
 dict(id="b01", env="void", pre=0.6, post=0.5,
  text="Esse número era oito bilhões e duzentos milhões. Agora ele é [[r:dois]]."),
 dict(id="b02", env="lab", pre=0.2, post=0.3,
  text="Esse tanque guarda a última chance da humanidade. A bateria dele acaba em [[y:onze minutos]]. E a Lia nunca consertou um gerador na vida."),
 dict(id="b03", env="lab", pre=0.1, post=0.5,
  text="O Caio chega atrás dela, sem fôlego. Se o gerador não ligar, acabou. Só que três semanas antes..."),
 # ---------- COMEÇO ----------
 dict(id="b04", env="street", pre=0.9, post=0.2,
  text="Três semanas antes, o Caio, trinta e três anos, motoboy, está parado num semáforo da Avenida Paulista. O sinal abre. Ninguém buzina. Nem um carro. Nem uma pessoa."),
 dict(id="b05", env="street", pre=0.1, post=0.2,
  text="O celular dele tem duzentos contatos. Ninguém atende. Até que ele ouve um rádio, tocando sozinho numa padaria, no fim da rua."),
 dict(id="b06", env="bakery", pre=0.1, post=0.3,
  text="Atrás do balcão, alguém. É a Lia, vinte e nove anos, professora de biologia. Ela olha pro Caio. Ele olha pra ela. Só nós? Só nós."),
 dict(id="b07", env="rules", pre=0.2, post=0.4,
  text="[[y:Regra número um]]: só as pessoas sumiram. O resto do mundo ficou exatamente onde estava. Prédios, carros, comida, hospitais. E isso vai sair caro."),
 # ---------- VANTAGENS ----------
 dict(id="b08", env="market", pre=0.2, post=0.2,
  text="Primeira semana: o melhor feriado da história. Supermercado inteiro de graça. Sem fila. Sem caixa. O Caio faz corrida de carrinho no corredor das bolachas."),
 dict(id="b09", env="car", pre=0.1, post=0.2,
  text="Ele pega uma Ferrari da concessionária e acelera a Paulista inteira a trezentos por hora. Sozinho. Sem multa."),
 dict(id="b10", env="stadium", pre=0.1, post=0.2,
  text="A Lia entra no {Morumbi|Morumbí}, para no meio do campo e grita o próprio nome. O estádio devolve o eco. Mais de sessenta mil lugares, e todos vazios."),
 dict(id="b11", env="street2", pre=0.1, post=0.3,
  text="Dá pra fazer qualquer coisa. Só não dá pra fazer nada com ninguém. E no segundo dia, a luz pisca."),
 # ---------- PREÇO ----------
 dict(id="b12", env="citynight", pre=0.2, post=0.2,
  text="Sem ninguém nas usinas, os sistemas de segurança desligam tudo sozinhos. A cidade apaga, bairro por bairro. Em dois dias, as bombas do metrô param, e as estações começam a encher de água."),
 dict(id="b12b", env="roof", pre=0.2, post=0.4,
  text="Só que tem um detalhe bonito. Com a cidade apagada, aparece um céu que o Caio nunca tinha visto na vida. Milhões de estrelas. A Lia aponta uma por uma. Ele aprende três nomes. E esquece dois."),
 dict(id="b13", env="market2", pre=0.1, post=0.2,
  text="Sem eletricidade, a comida fresca estraga em dias. Só as latas aguentam. O Caio descobre o que é viver de milho em lata. Ele tenta fazer pastel. Primeira vez: carvão. Segunda: fumaça. Terceira: o alarme de incêndio toca, e ninguém aparece."),
 dict(id="b14", env="hospital", pre=0.1, post=0.3,
  text="No quinto dia, ele abre a mão numa lata de sardinha. Fundo. O hospital mais perto tem três mil leitos e [[r:zero]] médicos. A Lia lê um manual de primeiros socorros em voz alta, e costura a mão dele com a dela tremendo. Dentista mais próximo: [[r:zero]]."),
 # ---------- CTA MEIO ----------
 dict(id="b15", env="cta", pre=0.1, post=0.4,
  text="E quase todo mundo que assiste ainda não é inscrito. Se você está curtindo a história do Caio e da Lia, aperta o [[y:inscrever]] e deixa o like. É de graça, leva um segundo, e é isso que faz o próximo vídeo sair."),
 # ---------- DESAFIOS ----------
 dict(id="b16", env="farm", pre=0.1, post=0.2,
  text="[[y:Primeiro desafio]]: comida. Na Noruega existe um cofre com mais de um milhão e quatrocentas mil amostras de sementes. Aqui, eles têm um pacote de feijão e um livro de jardinagem."),
 dict(id="b17", env="farm", pre=0.1, post=0.2,
  text="Primeira semana: o feijão morre. Segunda: morre de novo. Na quinta semana, nasce um brotinho. O Caio faz uma festa pra uma planta."),
 dict(id="b18", env="solar", pre=0.1, post=0.2,
  text="[[y:Segundo desafio]]: luz. Eles tiram painéis solares do telhado de um shopping e ligam numa geladeira. Primeira tentativa: faísca. O Caio dá um pulo. Quinta tentativa: a luz da geladeira acende. A Lia chora."),
 dict(id="b19", env="library", pre=0.1, post=0.3,
  text="[[y:Terceiro desafio]]: aprender. A biblioteca tem tudo. Como fazer pão, como consertar um motor, como ligar um gerador. O problema é que livro não ensina o que fazer quando o parafuso solta. Eles aprendem errando. Cem vezes."),
 # ---------- A CONTA ----------
 dict(id="b20", env="classroom", pre=0.2, post=0.2,
  text="Dois meses depois, a Lia escreve um número no quadro. O astrofísico {Frédéric Marin|Frederique Marã} calculou que noventa e oito pessoas saudáveis bastariam pra recomeçar uma população. O antropólogo {Cameron Smith|Quémeron Esmíth} diz que o mínimo é catorze mil. Dois não aparece em nenhuma conta."),
 dict(id="b21", env="classroom", pre=0.1, post=0.3,
  text="Com só dois pontos de partida, em poucas gerações todo mundo seria parente muito próximo. E isso multiplica doenças raras. A Lia apaga o quadro inteiro. [[r:A conta não fecha.]]"),
 dict(id="b22", env="classroom", pre=0.1, post=0.4,
  text="Mas existe um backup. Em clínicas de reprodução assistida, tem células congeladas de muita gente diferente. Diversidade guardada a quase duzentos graus negativos. Só que o frio depende de energia. E a energia dos tanques está acabando."),
 # ---------- CLÍMAX ----------
 dict(id="b23", env="moto", pre=0.2, post=0.2,
  text="O tanque mais próximo fica a trinta quilômetros. Ruas rachadas, árvores caídas, carro atravessado em tudo quanto é esquina. Mas o Caio passou dez anos entregando pizza em São Paulo. Ele conhece cada atalho. [[y:Ele vai.]]"),
 dict(id="b24", env="lab", pre=0.1, post=0.2,
  text="Quando chegam, o painel marca onze minutos. A porta do gerador está trancada. O Caio tenta arrombar com o ombro. Não abre. A Lia respira fundo, lembra do livro, e pega a chave de fenda."),
 dict(id="b25", env="gen", pre=0.1, post=0.5,
  text="Cem parafusos soltos depois, ela sabe onde mexer. Cabo vermelho no polo certo. O Caio gira a manivela. O gerador tosse. Tosse de novo. E liga. As luzes voltam. O tanque volta a gelar. Faltavam quarenta segundos."),
 # ---------- FINAL ----------
 dict(id="b26", env="years", pre=0.2, post=0.2,
  text="Os anos passam. O mato sobe pelas calçadas, a Paulista vira floresta, e os prédios mais velhos começam a cair. Mas em volta da fogueira, o número muda. Três. Cinco. Nove. Catorze. Vinte e três."),
 dict(id="b27", env="final", pre=0.3, post=0.5,
  text="A humanidade não recomeçou com dois. Recomeçou com dois, e com tudo o que alguém um dia teve a ideia de guardar."),
 dict(id="b28", env="outro", pre=0.2, post=1.2,
  text="E você? No primeiro dia, aproveitava o mundo de graça, ou já corria atrás do tanque? Comenta: [[y:mundo]] ou [[c:tanque]]? E se a humanidade recomeçasse com noventa e oito pessoas? O próximo episódio já está no forno. Se inscreve, e deixa o like. Até lá!"),
]
