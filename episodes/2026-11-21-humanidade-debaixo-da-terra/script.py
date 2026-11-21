# Roteiro: "E se a humanidade tivesse que recomeçar debaixo da terra?"
# Fontes: Britannica / registros históricos — erupção do Tambora (Indonésia, 1815) e o "ano sem verão" de 1816 (neve em junho, colheitas perdidas);
# gradiente geotérmico — a temperatura da crosta sobe em média ~25 °C por quilômetro de profundidade (Britannica / Energy Education);
# cavernas mantêm temperatura quase constante, perto da média anual da superfície;
# Derinkuyu (Capadócia, Turquia) — cidade subterrânea antiga, ~85 m de profundidade, estimativas de até 20 mil pessoas;
# Cofre Global de Sementes de Svalbard (Noruega) — mais de um milhão de amostras de sementes;
# fazendas verticais usam LEDs vermelhos e azuis, as cores que a clorofila mais absorve;
# vitamina D é produzida na pele com a luz do sol (UVB); radônio é um gás radioativo natural que se acumula em lugares fechados (EPA);
# minas e túneis dependem de bombeamento constante — quando as bombas param, eles alagam.
# O supervulcão, a cidade e os personagens são ficção.
META = dict(
    format='long',
    title='E se a humanidade tivesse que recomeçar debaixo da terra?',
    description="""E se o céu ficasse coberto de cinzas, a superfície congelasse, e trezentas pessoas tivessem que viver vinte anos dentro de uma caverna, com um sol de mentira pendurado no teto? 🕳️💡

A Nara é engenheira. O Beto é geólogo. A doutora Luz é médica. O Tito é eletricista e tem medo do escuro. E debaixo da terra tem calor de graça, sementes guardadas, fazendas de LED… e uma coisa que ninguém pode esquecer: a água.

⏱️ CAPÍTULOS
{CHAPTERS}

📚 Fontes: Britannica (erupção do Tambora em 1815 e o "ano sem verão" de 1816; gradiente geotérmico de ~25 °C por km); Derinkuyu, Turquia (cidade subterrânea antiga com ~85 m de profundidade); Cofre Global de Sementes de Svalbard (mais de um milhão de amostras); EPA (gás radônio em lugares fechados). O supervulcão, a cidade e os personagens são ficção. História ilustrativa baseada nesses fatos.

💬 E você? Teria coragem de viver vinte anos debaixo da terra? Comenta aí!
🔔 Próximo episódio: E se a humanidade tivesse que recomeçar numa ilha deserta?

#ese #debaixodaterra #historiasanimadas #curiosidades #animação""",
    tags=['e se', 'e se a humanidade recomeçasse', 'cidade subterrânea', 'debaixo da terra', 'história animada', 'cenário hipotético', 'supervulcão', 'curiosidades'],
    thumb=dict(beat='b02', frac=0.75, text='O TÚNEL ESTÁ ENCHENDO', text2='a 100 metros debaixo da terra'),
    chapters=[('b01', 'A cidade no escuro'), ('b04', 'O céu de cinzas'), ('b09', 'O lado bom da terra'), ('b15', 'O preço do escuro'), ('b19', 'O ponto fraco'), ('b21', 'A enchente'), ('b28', 'Os anos passam'), ('b29', 'O final')],
)
BEATS = [
 # ---------- GANCHO ----------
 dict(id="b01", pre=0.6, post=0.4,
  text="Essa cidade fica a cem metros debaixo da terra. Aqui nunca chove, nunca venta, e o sol é uma lâmpada pendurada no teto. E ela é a [[y:única casa]] de trezentas pessoas."),
 dict(id="b02", pre=0.2, post=0.3,
  text="Lá em cima, o mundo está congelado. E aqui embaixo, começa um barulho que ninguém queria ouvir: água. O túnel principal está [[r:enchendo]]."),
 dict(id="b03", pre=0.1, post=0.5,
  text="Se a água chegar na sala das bombas, a cidade inteira afoga. A Nara tem meia hora pra resolver. Mas pra entender como eles vieram parar aqui, a gente precisa voltar vinte anos."),
 # ---------- COMEÇO ----------
 dict(id="b04", pre=0.9, post=0.2,
  text="Vinte anos antes, um supervulcão entra em erupção. As cinzas cobrem o céu do planeta inteiro, e a luz do sol quase [[r:não chega]] no chão."),
 dict(id="b05", pre=0.1, post=0.3,
  text="Isso não é tão absurdo. Em mil oitocentos e quinze, o vulcão {Tambora|Tambóra}, na Indonésia, soltou tanta cinza que o ano seguinte ficou conhecido como o [[c:ano sem verão]]. Teve neve em junho, e plantações perdidas."),
 dict(id="b06", pre=0.2, post=0.3,
  text="Agora imagina algo muito pior. Sem sol, a superfície congela. E trezentas pessoas decidem descer pra um lugar onde o frio não chega: [[y:debaixo da terra]]."),
 dict(id="b07", pre=0.1, post=0.2,
  text="Tem a Nara, trinta anos, engenheira. O Beto, geólogo, que conversa com as pedras. A doutora Luz, médica. E o Tito, vinte e dois anos, eletricista, que tem [[y:medo do escuro]]."),
 dict(id="b08", pre=0.2, post=0.4,
  text="[[y:Regra número um]]: ninguém sobe sem roupa especial. Lá fora, o frio é de matar, e a cinza no ar machuca os pulmões. O elevador só abre com a autorização da Nara."),
 # ---------- VANTAGENS ----------
 dict(id="b09", pre=0.2, post=0.2,
  text="Primeira descoberta: debaixo da terra, a temperatura quase não muda. Uma caverna fica perto da média do ano lá fora, faça frio ou calor. A rocha vira um [[c:cobertor de pedra]]."),
 dict(id="b10", pre=0.1, post=0.2,
  text="E o Beto sabe de outro segredo: quanto mais fundo, mais quente. A cada quilômetro pra baixo, a rocha esquenta uns [[y:vinte e cinco graus]]. Eles furam um poço, e o calor da terra aquece a cidade inteira."),
 dict(id="b11", pre=0.1, post=0.3,
  text="E morar debaixo da terra não é ideia nova. Na Turquia, existe uma cidade subterrânea de verdade, {Derinkuyu|Derincuiú}, cavada há muitos séculos. Ela desce uns [[y:oitenta e cinco metros]], e pode ter abrigado milhares de pessoas."),
 dict(id="b12", pre=0.1, post=0.2,
  text="A comida vem de fazendas de {LED|léd}. Luz vermelha e azul, as cores que as plantas mais aproveitam. Sem chuva e sem praga, dá alface [[g:o ano inteiro]]."),
 dict(id="b13", pre=0.1, post=0.2,
  text="E as sementes vieram de um cofre. No mundo real, existe um na Noruega, o cofre de {Svalbard|Isvalbar}, guardando mais de [[g:um milhão]] de amostras de sementes, dentro de uma montanha gelada."),
 dict(id="b14", pre=0.1, post=0.3,
  text="Primeiro ano: festa. O Tito pendura luzinhas no teto da caverna, e nasce o primeiro bebê da cidade. O nome dele é [[y:Sol]]."),
 # ---------- PREÇO ----------
 dict(id="b15", pre=0.2, post=0.2,
  text="Mas viver no escuro cobra. O corpo usa a luz do sol pra fabricar vitamina D, que ajuda a deixar os ossos fortes. Então a doutora Luz coloca todo mundo debaixo de [[c:lâmpadas especiais]], todo dia."),
 dict(id="b16", pre=0.1, post=0.2,
  text="E o relógio do corpo se perde. Sem dia e noite, ninguém sabe a hora de dormir. Então a Nara inventa um sol de mentira, que [[y:acende de manhã e apaga à noite]]."),
 dict(id="b17", pre=0.1, post=0.3,
  text="E tem um inimigo invisível: o ar parado. Algumas rochas soltam um gás chamado radônio, que se acumula em lugares fechados. Por isso, os ventiladores [[r:nunca podem parar]]."),
 # ---------- CTA MEIO ----------
 dict(id="b18", pre=0.1, post=0.4,
  text="E quase todo mundo que assiste ainda não é inscrito. Se você está curtindo a história da Nara, aperta o [[y:inscrever]] e deixa o like. É de graça, e é isso que faz o próximo vídeo sair."),
 # ---------- O PORÉM ----------
 dict(id="b19", pre=0.2, post=0.2,
  text="Só que [[r:tem um porém]]. Debaixo da terra corre água. Minas e túneis só ficam secos porque bombas puxam essa água sem parar. Quando as bombas param, eles [[r:enchem]]."),
 dict(id="b20", pre=0.1, post=0.3,
  text="Por vinte anos, as bombas funcionaram. O Tito, agora com quarenta e dois anos, cuida delas como se fossem da família. Mas uma noite, o gelo lá em cima começa a derreter, e a água desce [[r:de uma vez]]."),
 # ---------- CLÍMAX ----------
 dict(id="b21", pre=0.2, post=0.2,
  text="Agora, aconteceu. Um estrondo, e o gerador das bombas [[r:apaga]]. A água começa a subir no túnel principal, um palmo a cada minuto."),
 dict(id="b22", pre=0.1, post=0.2,
  text="Se ela chegar na sala das bombas, nunca mais dá pra religar. A Nara e o Tito descem correndo, com água [[r:até o joelho]]."),
 dict(id="b23", pre=0.1, post=0.2,
  text="O gerador não pega. O Tito acha o problema: um cabo queimado. E o cabo reserva está do outro lado do túnel [[r:alagado]]."),
 dict(id="b24", pre=0.1, post=0.2,
  text="A Nara não pensa duas vezes. Ela atravessa o túnel no escuro, com a lanterna acima da água, e volta com o cabo nas mãos."),
 dict(id="b25", pre=0.1, post=0.2,
  text="O Tito troca o cabo. Uma vez, nada. Duas vezes, nada. E a água já está batendo na porta da sala."),
 dict(id="b26", pre=0.1, post=0.4,
  text="Na terceira, o gerador [[g:ruge]]. As luzes voltam, as bombas puxam a água, e o túnel começa a secar."),
 dict(id="b27", pre=0.1, post=0.4,
  text="A doutora Luz confere todo mundo: ninguém se machucou, só muita roupa molhada. E desde aquela noite, a cidade tem [[g:dois geradores reserva]]."),
 # ---------- FINAL ----------
 dict(id="b28", pre=0.2, post=0.3,
  text="Os anos passam. As cinzas vão baixando. E um dia, a câmera lá em cima mostra uma coisa que ninguém via havia vinte e cinco anos: [[c:céu azul]]."),
 dict(id="b29", pre=0.2, post=0.3,
  text="O Sol, aquele primeiro bebê, agora é adulto. Ele é o primeiro a sair, e sente o calor do sol de verdade no rosto. Ele [[y:chora]]."),
 dict(id="b30", pre=0.3, post=0.5,
  text="A humanidade não recomeçou debaixo da terra porque era fácil. Recomeçou porque trezentas pessoas aprenderam a viver no escuro, até a luz voltar."),
 dict(id="b31", pre=0.2, post=1.2,
  text="E você? Teria coragem de viver vinte anos debaixo da terra? Comenta aqui. E se a humanidade tivesse que recomeçar numa ilha deserta? Esse é o próximo episódio. Se inscreve, e deixa o like. Até lá!"),
]
