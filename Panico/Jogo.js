function rolarDado() {
    return Math.floor(Math.random() * 20) + 1;
}

// ===================================================================
// Ícones SVG embutidos (sem arquivos externos). Usam stroke/fill
// "currentColor" para herdar a cor vermelha definida no CSS.
// ===================================================================
const ICONS = {
    phone: `<svg viewBox="0 0 64 64"><path d="M20 12c-4 0-6 2-6 6 0 16 12 32 28 32 4 0 6-2 6-6l-2-8-10 4c-6-4-10-10-12-16l4-10-8-2z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>`,
    knife: `<svg viewBox="0 0 64 64"><path d="M10 54 L38 26" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M38 26 L54 10 L58 14 L42 30 Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
    window: `<svg viewBox="0 0 64 64"><rect x="10" y="8" width="44" height="48" fill="none" stroke="currentColor" stroke-width="3"/><line x1="32" y1="8" x2="32" y2="56" stroke="currentColor" stroke-width="3"/><line x1="10" y1="32" x2="54" y2="32" stroke="currentColor" stroke-width="3"/></svg>`,
    stairs: `<svg viewBox="0 0 64 64"><path d="M8 56 h10 v-10 h10 v-10 h10 v-10 h10 v-10 h8" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>`,
    mask: `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="34" rx="20" ry="24" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="24" cy="30" r="3" fill="currentColor"/><circle cx="40" cy="30" r="3" fill="currentColor"/><path d="M24 44 q8 6 16 0" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
    carkey: `<svg viewBox="0 0 64 64"><circle cx="16" cy="32" r="10" fill="none" stroke="currentColor" stroke-width="3"/><line x1="26" y1="32" x2="54" y2="32" stroke="currentColor" stroke-width="3"/><line x1="42" y1="32" x2="42" y2="42" stroke="currentColor" stroke-width="3"/><line x1="50" y1="32" x2="50" y2="40" stroke="currentColor" stroke-width="3"/></svg>`,
    flashlight: `<svg viewBox="0 0 64 64"><rect x="14" y="24" width="22" height="16" fill="none" stroke="currentColor" stroke-width="3"/><path d="M36 26 L50 20 V44 L36 38 Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><line x1="52" y1="24" x2="60" y2="18" stroke="currentColor" stroke-width="2"/><line x1="52" y1="32" x2="62" y2="32" stroke="currentColor" stroke-width="2"/><line x1="52" y1="40" x2="60" y2="46" stroke="currentColor" stroke-width="2"/></svg>`,
    bandage: `<svg viewBox="0 0 64 64"><rect x="8" y="26" width="48" height="12" rx="6" fill="none" stroke="currentColor" stroke-width="3" transform="rotate(-20 32 32)"/><line x1="26" y1="14" x2="38" y2="50" stroke="currentColor" stroke-width="2"/></svg>`,
    note: `<svg viewBox="0 0 64 64"><rect x="14" y="10" width="36" height="44" fill="none" stroke="currentColor" stroke-width="3"/><line x1="20" y1="22" x2="44" y2="22" stroke="currentColor" stroke-width="2"/><line x1="20" y1="30" x2="44" y2="30" stroke="currentColor" stroke-width="2"/><path d="M20 40 q6 6 12 0 q6 6 12 0" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
    lamp: `<svg viewBox="0 0 64 64"><line x1="32" y1="4" x2="32" y2="20" stroke="currentColor" stroke-width="2"/><circle cx="32" cy="30" r="12" fill="none" stroke="currentColor" stroke-width="3"/><line x1="26" y1="40" x2="38" y2="40" stroke="currentColor" stroke-width="2"/></svg>`,
    sunrise: `<svg viewBox="0 0 64 64"><circle cx="32" cy="40" r="12" fill="none" stroke="currentColor" stroke-width="3"/><line x1="4" y1="52" x2="60" y2="52" stroke="currentColor" stroke-width="3"/><line x1="32" y1="16" x2="32" y2="8" stroke="currentColor" stroke-width="2"/><line x1="14" y1="24" x2="8" y2="18" stroke="currentColor" stroke-width="2"/><line x1="50" y1="24" x2="56" y2="18" stroke="currentColor" stroke-width="2"/></svg>`,
    static: `<svg viewBox="0 0 64 64"><rect x="6" y="10" width="52" height="6" fill="currentColor" opacity="0.8"/><rect x="6" y="22" width="30" height="5" fill="currentColor" opacity="0.6"/><rect x="6" y="32" width="46" height="6" fill="currentColor" opacity="0.9"/><rect x="6" y="44" width="20" height="5" fill="currentColor" opacity="0.5"/><rect x="6" y="52" width="40" height="6" fill="currentColor" opacity="0.7"/></svg>`,
    door: `<svg viewBox="0 0 64 64"><rect x="16" y="6" width="32" height="52" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="38" cy="32" r="2.5" fill="currentColor"/></svg>`,
    bat: `<svg viewBox="0 0 64 64"><path d="M10 54 L38 26" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M38 26 C46 18 52 12 56 8" stroke="currentColor" stroke-width="10" stroke-linecap="round"/></svg>`,
    silhouette: `<svg viewBox="0 0 64 100"><ellipse cx="32" cy="16" rx="10" ry="12" fill="currentColor"/><path d="M14 100 L20 46 C20 36 44 36 44 46 L50 100 Z" fill="currentColor"/></svg>`,
    lock: `<svg viewBox="0 0 64 64"><rect x="16" y="28" width="32" height="26" rx="3" fill="none" stroke="currentColor" stroke-width="3"/><path d="M22 28 v-8 a10 10 0 0 1 20 0 v8" fill="none" stroke="currentColor" stroke-width="3"/></svg>`,
    check: `<svg viewBox="0 0 64 64"><path d="M12 34 L26 48 L52 16" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};

const ITEM_ICONS = {
    "Faca de Cozinha": "knife",
    "Pedaço de Máscara": "mask",
    "Bilhete Ensanguentado": "note",
    "Taco de Beisebol": "bat",
    "Chave do Carro": "carkey",
    "Lanterna": "flashlight",
    "Celular Carregado": "phone",
    "Kit de Primeiros Socorros": "bandage"
};

// Retratos da Duda por emoção (imagens reais, fundo preto que "some"
// contra o cenário escuro via mix-blend-mode: screen no CSS).
const DUDA_IMAGES = {
    neutra: "imgs/Duda_Neutra.jpeg",
    neutra_falando: "imgs/Duda_Neutra_Falando.jpeg",
    feliz: "imgs/Duda_Feliz.jpeg",
    brava: "imgs/Duda_Brava.jpeg",
    assustada: "imgs/Duda_Assustada.jpeg"
};

// Emoção da Duda em cada cena (só aparece nas cenas em que ela está
// presente; nas demais, o retrato cai de volta para o ícone da cena).
const DUDA_EMOTIONS = {
    duda1: "assustada",
    escolhaResgate: "assustada",
    chegamCasaRafaDeCarro: "neutra",
    chegamCasaRafa2: "assustada",
    emboscadaNaCalcada: "assustada",
    decisaoFugaCarro: "brava",
    emboscada: "assustada",
    lutaOuFuga: "assustada",
    venceuPrimeiroAtaque: "feliz",
    fugiuComSucesso: "assustada",
    feridaGrave: "assustada",
    tratouFerimento: "neutra_falando",
    chamaPolicia: "neutra_falando",
    escolhaResgate2: "assustada",
    esperaPolicia: "assustada",
    esperarEmCasa: "neutra",
    ouveBarulhoPorao: "assustada",
    escondeATempo: "feliz",
    pegaDesprevenida: "assustada",
    ignoraPorao: "neutra",
    lutaOuFugaCasa: "assustada",
    expulsouInvasor: "feliz",
    fugiuPelaJanela: "assustada",
    madrugadaSegura: "neutra",
    chegamCasaRafa: "assustada",
    chegamCasaRafaFerida: "assustada",
    entramCasaRafa: "assustada",
    chamamRafa: "assustada",
    encontramPista: "neutra_falando",
    sonsEstranhos: "assustada",
    confrontoFinalPrep: "assustada",
    revelacaoMascara: "assustada",
    negociarComProva: "neutra_falando",
    negociar: "neutra_falando",
    dudaAjuda: "brava",
    contraAtaque: "assustada",
    lastChance: "assustada",
    feriuAtacante: "brava",
    descobremIdentidade: "assustada",
    escolhaFinal: "neutra",
    finalHeroico: "feliz",
    finalFuga: "assustada",
    finalReviravolta: "assustada",
    ultimaChanceReviravolta: "assustada",
    finalSobrevivenciaAmarga: "neutra",
    finalMorteConfronto: "assustada",
    finalMorteCasa: "assustada",
    finalSobrevivenciaSolitaria: "feliz",
    finalAmbiguo: "neutra",
    finalFugaDeCarro: "neutra"
};

// Retratos da SOFIA (protagonista) por emoção. Só existem sprites prontos
// para neutra/neutra_falando/assustada; feliz e brava caem de volta para
// a neutra até que essas artes específicas existam.
const SOFIA_IMAGES = {
    neutra: "imgs/Sofia_Neutra.png",
    neutra_falando: "imgs/Sofia_Falando.png",
    feliz: "imgs/Sofia_Neutra.png",
    brava: "imgs/Sofia_Neutra.png",
    assustada: "imgs/Sofia_Assustada.png"
};

// Emoção da Sofia nas cenas em que a Duda NÃO está presente (ou seja,
// todas as cenas que não aparecem em DUDA_EMOTIONS). Quando uma cena
// está nos dois mapas, a Duda tem prioridade (ela é quem está "em cena").
const SOFIA_EMOTIONS = {
    start: "neutra",
    casaSozinha: "neutra",
    garagem: "neutra",
    quarto: "neutra",
    banheiro: "assustada",
    tocaTelefone: "assustada",
    atender: "neutra_falando",
    debochou: "brava",
    desligou: "assustada",
    perguntou: "neutra_falando",
    vozAmeaca: "assustada",
    lucesPiscam: "assustada",
    primeiraEscolha: "assustada",
    verificarPorta: "assustada",
    checaJanela: "assustada",
    veSilhueta: "assustada",
    distracaoBarulho: "assustada",
    trancaTudo: "neutra",
    falaComDuda: "neutra_falando",
    pegaFaca: "neutra",
    campainha: "assustada",
    abrirPorta: "assustada",
    olharOlhoMagico: "assustada"
};

// Título de cada final, usado no contador e na galeria
const ENDING_TITLES = {
    finalHeroico: "A Verdade Vem à Tona",
    finalFuga: "Ele Desapareceu de Novo",
    finalSobrevivenciaAmarga: "Nunca Termina de Verdade",
    finalMorteConfronto: "Mais um Nome na Lista",
    finalMorteCasa: "Ninguém Atendeu a Porta",
    finalSobrevivenciaSolitaria: "Mais Uma História Sem Resposta",
    finalAmbiguo: "O Que Aconteceu com o Rafa?",
    finalFugaDeCarro: "Você Escolheu Viver"
};
const TOTAL_ENDINGS = Object.keys(ENDING_TITLES).length;
const ENDINGS_STORAGE_KEY = "noiteDePanico_finais";

// Cenário de fundo (feito em CSS, sem imagens) de cada cena. As classes
// "loc-*" ligam/desligam os elementos decorativos definidos em #scenery.
const LOCATIONS = {
    // Dentro de casa, na sala/corredor
    start: "sala", casaSozinha: "sala", tocaTelefone: "sala", atender: "sala",
    debochou: "sala", desligou: "sala", perguntou: "sala", vozAmeaca: "sala",
    lucesPiscam: "sala", primeiraEscolha: "sala", verificarPorta: "sala",
    checaJanela: "sala", veSilhueta: "sala", distracaoBarulho: "sala",
    trancaTudo: "sala", falaComDuda: "sala", campainha: "sala",
    abrirPorta: "sala", olharOlhoMagico: "sala", duda1: "sala",
    escolhaResgate: "sala", chamaPolicia: "sala", escolhaResgate2: "sala",
    esperaPolicia: "sala", esperarEmCasa: "sala", decisaoFugaCarro: "sala",

    // Cômodos específicos da casa
    pegaFaca: "cozinha",
    garagem: "garagem", chegamCasaRafaDeCarro: "garagem", finalFugaDeCarro: "garagem",
    quarto: "quarto",
    banheiro: "banheiro",

    // Na rua, a caminho da casa do Rafa
    emboscada: "rua", lutaOuFuga: "rua", venceuPrimeiroAtaque: "rua",
    fugiuComSucesso: "rua", feridaGrave: "rua", tratouFerimento: "rua",
    emboscadaNaCalcada: "rua", chegamCasaRafa: "rua", chegamCasaRafa2: "rua",
    chegamCasaRafaFerida: "rua",

    // Porão (e a invasão em casa, que passa por lá)
    ouveBarulhoPorao: "porao", escondeATempo: "porao", pegaDesprevenida: "porao",
    ignoraPorao: "porao", lutaOuFugaCasa: "porao", expulsouInvasor: "porao",
    fugiuPelaJanela: "porao", finalMorteCasa: "porao",

    // Dentro da casa do Rafa
    entramCasaRafa: "casaRafa", chamamRafa: "casaRafa", encontramPista: "casaRafa",
    sonsEstranhos: "casaRafa", confrontoFinalPrep: "casaRafa", revelacaoMascara: "casaRafa",
    negociarComProva: "casaRafa", negociar: "casaRafa", dudaAjuda: "casaRafa",
    contraAtaque: "casaRafa", lastChance: "casaRafa", feriuAtacante: "casaRafa",
    descobremIdentidade: "casaRafa", escolhaFinal: "casaRafa", finalReviravolta: "casaRafa",
    ultimaChanceReviravolta: "casaRafa", finalMorteConfronto: "casaRafa", finalFuga: "casaRafa",

    // Amanhecer
    madrugadaSegura: "amanhecer", finalHeroico: "amanhecer", finalAmbiguo: "amanhecer",
    finalSobrevivenciaAmarga: "amanhecer", finalSobrevivenciaSolitaria: "amanhecer"
};

// ===================================================================
// NOITE DE PÂNICO, história de terror slasher, protagonista única (Sofia).
// Cada cena pode ter:
//   - mood: 'calm' | 'tense' | 'danger' | 'good' | 'bittersweet' | 'bad'
//   - event: 'call' (banner de ligação) | 'danger' (tremor + silhueta)
//   - icon: chave de ICONS mostrada no canto da cena
//   - speaker: nome exibido acima da fala (opcional)
//   - isEnding + endingTitle: marca uma cena como final do jogo
//   - options: lista de escolhas. Uma opção com "type: continue" e uma
//     única entrada representa diálogo contínuo (sem decisão real).
//   - addToInventory pode ser uma string OU um array de strings.
// ===================================================================
const story = {
    start: {
        speaker: "",
        text: "Sexta-feira, 23h12. Seus pais viajaram e a casa está silenciosa demais. Hoje faz exatamente vinte anos desde a Noite do Rio Negro, quando três pessoas desapareceram na sua cidade e nunca mais foram encontradas. Você tenta não pensar nisso enquanto termina de guardar a louça. Lá fora, o vento bate contra as janelas.",
        mood: "calm",
        options: [
            { text: "Dar uma volta pela casa antes de dormir", type: "continue", next: "casaSozinha" }
        ]
    },

    casaSozinha: {
        speaker: "",
        text: "Ainda dá tempo de dar uma volta pela casa antes de se acomodar para a noite.",
        mood: "calm",
        icon: "door",
        options: [
            { text: "Dar uma olhada na garagem", next: "garagem" },
            { text: "Passar pelo seu quarto", next: "quarto" },
            { text: "Verificar o banheiro", next: "banheiro" },
            { text: "Já chega, ir para a sala", type: "continue", next: "tocaTelefone" }
        ]
    },

    garagem: {
        speaker: "",
        text: "Na garagem escura, você encontra o velho taco de beisebol do seu pai encostado na parede, e, pendurada no gancho ao lado, a chave do carro. Pega os dois.",
        mood: "calm",
        icon: "bat",
        addToInventory: ["Taco de Beisebol", "Chave do Carro"],
        options: [{ text: "Voltar para o corredor", type: "continue", next: "casaSozinha" }]
    },

    quarto: {
        speaker: "",
        text: "No seu quarto, você pega a lanterna da gaveta de emergência e percebe que esqueceu o celular carregando na tomada. Guarda os dois.",
        mood: "calm",
        icon: "flashlight",
        addToInventory: ["Lanterna", "Celular Carregado"],
        options: [{ text: "Voltar para o corredor", type: "continue", next: "casaSozinha" }]
    },

    banheiro: {
        speaker: "",
        text: "Você abre o armarinho para pegar o kit de primeiros socorros e, no espelho atrás da porta, por um instante, jura ver um vulto atrás de você. Quando se vira, não há nada. Só o coração acelerado. Você pega o kit e sai rapidamente do banheiro. ",
        mood: "tense",
        event: "danger",
        icon: "bandage",
        addToInventory: "Kit de Primeiros Socorros",
        options: [{ text: "Sair do banheiro", type: "continue", next: "casaSozinha" }]
    },

    tocaTelefone: {
        speaker: "",
        text: "O telefone da sala começa a tocar. Você olha o visor: NÚMERO DESCONHECIDO. Ninguém deveria estar ligando para o fixo àquela hora.",
        mood: "tense",
        event: "call",
        icon: "phone",
        options: [
            { text: "Atender", type: "continue", next: "atender" }
        ]
    },

    atender: {
        speaker: "VOZ DESCONHECIDA",
        text: "Uma voz calma e arrastada pergunta, baixinho, qual final de filme de terror você prefere: aquele em que a garota escapa, ou aquele em que ela é a próxima. Um arrepio sobe pela sua nuca.",
        mood: "tense",
        event: "call",
        icon: "phone",
        options: [
            { text: "Rir e debochar da ligação", next: "debochou", addToChoices: "Debochou da ligação" },
            { text: "Desligar na hora", next: "desligou", addToChoices: "Desligou o telefone" },
            { text: "Perguntar quem está falando", next: "perguntou", addToChoices: "Perguntou quem estava ligando" }
        ]
    },

    debochou: {
        speaker: "VOCÊ",
        text: "Você força uma risada e diz que já assistiu esse filme mil vezes e sabe exatamente como termina. Do outro lado, silêncio. Depois, uma respiração lenta.",
        mood: "tense",
        event: "call",
        icon: "phone",
        options: [{ text: "Esperar a resposta dele", type: "continue", next: "vozAmeaca" }]
    },

    desligou: {
        speaker: "",
        text: "Você desliga na cara. Dois segundos depois, o telefone toca de novo. E de novo. Até você atender de volta.",
        mood: "tense",
        event: "call",
        icon: "phone",
        options: [{ text: "Atender de novo", type: "continue", next: "vozAmeaca" }]
    },

    perguntou: {
        speaker: "VOZ DESCONHECIDA",
        text: "\"Isso importa?\", a voz responde, quase se divertindo. \"O que importa é que eu sei exatamente onde você está agora.\"",
        mood: "tense",
        event: "call",
        icon: "phone",
        options: [{ text: "Esperar a resposta dele", type: "continue", next: "vozAmeaca" }]
    },

    vozAmeaca: {
        speaker: "VOZ DESCONHECIDA",
        text: "\"Aliás\", ele diz, \"troque aquele abajur de lugar. Daqui de onde eu estou, dá pra ver ele o tempo todo.\" A ligação cai. Você olha para o abajur da sala. Está exatamente onde sempre esteve.",
        mood: "danger",
        event: "call",
        icon: "phone",
        options: [{ text: "Olhar assustada para o abajur", type: "continue", next: "lucesPiscam" }]
    },

    lucesPiscam: {
        speaker: "",
        text: "As luzes da casa piscam duas vezes e voltam ao normal. Seu coração dispara. Alguma coisa lá fora não está certa.",
        mood: "tense",
        options: [{ text: "Decidir o que fazer", type: "continue", next: "primeiraEscolha" }]
    },

    primeiraEscolha: {
        speaker: "",
        text: "Você precisa decidir o que fazer agora.",
        mood: "tense",
        options: [
            { text: "Verificar a porta da frente", next: "verificarPorta", addToChoices: "Foi verificar a porta" },
            { text: "Ligar para Duda, sua melhor amiga", next: "falaComDuda", addToChoices: "Ligou para Duda" },
            { text: "Ir até a cozinha pegar uma faca", next: "pegaFaca", addToChoices: "Pegou uma faca na cozinha" }
        ]
    },

    verificarPorta: {
        speaker: "",
        text: "Você se aproxima devagar da porta da frente. Está trancada, mas a cortina da janela ao lado balança como se alguém a tivesse acabado de soltar.",
        mood: "tense",
        icon: "window",
        options: [{ text: "Checar a janela ao lado", type: "continue", next: "checaJanela" }]
    },

    checaJanela: {
        speaker: "",
        text: "Você pode arriscar espiar o quintal escuro, ou preferir não ver nada.",
        mood: "tense",
        icon: "window",
        options: [
            { text: "Observar o quintal pela janela", roll: true, successThreshold: 12, successNext: "veSilhueta", failNext: "distracaoBarulho", addToChoices: "Espiou o quintal" },
            { text: "Não olhar e trancar tudo", next: "trancaTudo", addToChoices: "Preferiu não olhar" }
        ]
    },

    veSilhueta: {
        speaker: "",
        text: "Por um instante, uma forma alta e imóvel aparece sob o poste da rua. Quando você pisca, ela já não está mais lá.",
        mood: "danger",
        event: "danger",
        icon: "silhouette",
        options: [{ text: "Voltar a atenção para dentro de casa", type: "continue", next: "campainha" }]
    },

    distracaoBarulho: {
        speaker: "",
        text: "Um barulho na parte de trás da casa te distrai por um segundo. Quando você volta o olhar para o quintal, não há mais nada, ou nunca houve.",
        mood: "tense",
        options: [{ text: "Voltar a atenção para dentro de casa", type: "continue", next: "campainha" }]
    },

    trancaTudo: {
        speaker: "",
        text: "Você tranca a porta, fecha as cortinas e decide não olhar para fora de novo essa noite.",
        mood: "tense",
        options: [{ text: "Voltar para a sala", type: "continue", next: "campainha" }]
    },

    falaComDuda: {
        speaker: "DUDA",
        text: "\"Também recebi uma ligação estranha\", ela diz, a voz tensa. \"Já tô indo pra tua casa, não fica sozinha.\"",
        mood: "tense",
        icon: "phone",
        options: [{ text: "Desligar o telefone e esperar a Duda", type: "continue", next: "campainha" }]
    },

    pegaFaca: {
        speaker: "",
        text: "Você vai até a cozinha e pega a maior faca da gaveta, segurando com as duas mãos trêmulas.",
        mood: "tense",
        icon: "knife",
        addToInventory: "Faca de Cozinha",
        options: [{ text: "Voltar para a sala com a faca em mãos", type: "continue", next: "campainha" }]
    },

    campainha: {
        speaker: "",
        text: "A campainha toca, três vezes seguidas, rápido demais para ser educado.",
        mood: "danger",
        icon: "door",
        options: [
            { text: "Abrir a porta", next: "abrirPorta", addToChoices: "Abriu a porta direto" },
            { text: "Olhar pelo olho mágico primeiro", next: "olharOlhoMagico", addToChoices: "Checou pelo olho mágico" }
        ]
    },

    abrirPorta: {
        speaker: "",
        text: "Você destrava a porta com o coração na garganta. É a Duda, ofegante, com o celular ainda na mão.",
        mood: "tense",
        options: [{ text: "Deixar a Duda entrar", type: "continue", next: "duda1" }]
    },

    olharOlhoMagico: {
        speaker: "",
        text: "Você espia pelo olho mágico. É a Duda, olhando para os dois lados da rua, claramente assustada.",
        mood: "tense",
        options: [{ text: "Abrir a porta para a Duda", type: "continue", next: "duda1" }]
    },

    duda1: {
        speaker: "DUDA",
        text: "\"Sofia, o Rafa não atende mais o celular\", Duda diz, entrando rápido e trancando a porta atrás dela. \"E eu vi uma coisa branca se mexendo perto da casa dele antes de vir pra cá.\"",
        mood: "tense",
        options: [{ text: "Decidir o que fazer em relação ao Rafa", type: "continue", next: "escolhaResgate" }]
    },

    escolhaResgate: {
        speaker: "",
        text: "Vocês duas se entreolham. Alguma decisão precisa ser tomada agora.",
        mood: "tense",
        icon: "carkey",
        options: [
            { text: "Ir a pé até a casa do Rafa agora", roll: true, successThreshold: 14, successNext: "chegamCasaRafa", failNext: "emboscada", addToChoices: "Foi a pé até a casa do Rafa" },
            { text: "Pegar o carro e ir até a casa do Rafa", requiredItem: "Chave do Carro", next: "chegamCasaRafaDeCarro", addToChoices: "Foi de carro até a casa do Rafa" },
            { text: "Chamar a polícia primeiro", next: "chamaPolicia", addToChoices: "Chamou a polícia primeiro" },
            { text: "Trancar tudo e esperar o Rafa aparecer", next: "esperarEmCasa", addToChoices: "Decidiu esperar em casa" },
            { text: "Pegar o carro e fugir da cidade agora, esquecendo o Rafa", requiredItem: "Chave do Carro", next: "decisaoFugaCarro", addToChoices: "Cogitou fugir de carro" }
        ]
    },

    chegamCasaRafaDeCarro: {
        speaker: "",
        text: "Vocês correm até a garagem, entram no carro e dirigem direto até a casa do Rafa, chegando em poucos minutos, sãs e salvas.",
        mood: "tense",
        icon: "carkey",
        options: [{ text: "Entrar na casa do Rafa", type: "continue", next: "entramCasaRafa" }]
    },

    decisaoFugaCarro: {
        speaker: "DUDA",
        text: "Duda te encara, incrédula. \"Sofia, tem certeza? E o Rafa?\"",
        mood: "tense",
        options: [
            { text: "Confirmar: vamos embora agora", next: "finalFugaDeCarro", addToChoices: "Escolheu fugir e abandonar o Rafa" },
            { text: "Não, não dá pra abandonar o Rafa", next: "chegamCasaRafaDeCarro", addToChoices: "Voltou atrás e foi ajudar o Rafa" }
        ]
    },

    emboscada: {
        speaker: "",
        text: "Vocês saem de casa correndo e seguem a pé pela rua escura. No meio do caminho, entre duas casas, uma figura mascarada surge do nada e bloqueia a passagem.",
        mood: "danger",
        event: "danger",
        icon: "silhouette",
        options: [{ text: "Reagir agora", type: "continue", next: "lutaOuFuga" }]
    },

    lutaOuFuga: {
        speaker: "",
        text: "Não há tempo para pensar.",
        mood: "danger",
        event: "danger",
        icon: "silhouette",
        options: [
            { text: "Lutar com a faca de cozinha", requiredItem: "Faca de Cozinha", roll: true, successThreshold: 11, successNext: "venceuPrimeiroAtaque", failNext: "feridaGrave", addToChoices: "Lutou com a faca" },
            { text: "Golpear com o taco de beisebol", requiredItem: "Taco de Beisebol", roll: true, successThreshold: 10, successNext: "venceuPrimeiroAtaque", failNext: "feridaGrave", addToChoices: "Lutou com o taco" },
            { text: "Lutar com as próprias mãos", roll: true, successThreshold: 16, successNext: "venceuPrimeiroAtaque", failNext: "feridaGrave", addToChoices: "Lutou com as mãos" },
            { text: "Gritar por ajuda pelo celular enquanto foge", requiredItem: "Celular Carregado", roll: true, successThreshold: 9, successNext: "fugiuComSucesso", failNext: "feridaGrave", addToChoices: "Pediu ajuda pelo celular" },
            { text: "Fugir correndo", roll: true, successThreshold: 12, successNext: "fugiuComSucesso", failNext: "feridaGrave", addToChoices: "Tentou fugir da emboscada" }
        ]
    },

    venceuPrimeiroAtaque: {
        speaker: "",
        text: "Você acerta um golpe certeiro. Ele cambaleia, solta um grunhido abafado pela máscara e foge mancando para a escuridão, deixando para trás um pedaço rasgado de tecido.",
        mood: "tense",
        icon: "mask",
        addToInventory: "Pedaço de Máscara",
        addToChoices: "Feriu o atacante e guardou um pedaço da máscara",
        options: [{ text: "Seguir até a casa do Rafa", type: "continue", next: "chegamCasaRafa2" }]
    },

    fugiuComSucesso: {
        speaker: "",
        text: "Vocês correm sem olhar para trás. Quando param para respirar, percebem que se separaram no caminho, mas não há tempo a perder, a casa do Rafa já está logo ali.",
        mood: "tense",
        options: [{ text: "Seguir até a casa do Rafa", type: "continue", next: "chegamCasaRafa2" }]
    },

    feridaGrave: {
        speaker: "",
        text: "Uma dor em fogo corta seu braço. Você consegue se afastar, mas está sangrando e cada passo agora dói.",
        mood: "danger",
        icon: "bandage",
        options: [
            { text: "Usar o kit de primeiros socorros", requiredItem: "Kit de Primeiros Socorros", next: "tratouFerimento", addToChoices: "Usou o kit de primeiros socorros" },
            { text: "Seguir mesmo ferida", type: "continue", next: "chegamCasaRafaFerida", addToChoices: "Seguiu ferida" }
        ]
    },

    tratouFerimento: {
        speaker: "",
        text: "Você usa o kit para estancar o sangramento. Dói, mas você consegue seguir em frente com mais firmeza.",
        mood: "tense",
        options: [{ text: "Seguir até a casa do Rafa", type: "continue", next: "chegamCasaRafa2" }]
    },

    chamaPolicia: {
        speaker: "",
        text: "Você liga para a polícia. A atendente parece cansada: \"Vamos mandar uma viatura assim que possível, mas hoje está uma loucura por aqui.\"",
        mood: "tense",
        icon: "phone",
        options: [{ text: "Decidir se espera a polícia", type: "continue", next: "escolhaResgate2" }]
    },

    escolhaResgate2: {
        speaker: "",
        text: "Vocês não sabem quanto tempo a polícia vai demorar.",
        mood: "tense",
        options: [
            { text: "Não dá pra esperar, ir agora", next: "chegamCasaRafa", addToChoices: "Não esperou a polícia" },
            { text: "Esperar a polícia chegar", next: "esperaPolicia", addToChoices: "Esperou a polícia" }
        ]
    },

    esperaPolicia: {
        speaker: "",
        text: "Os minutos passam devagar demais. Duda decide ir esperar no portão para guiar a viatura mais rápido. Segundos depois, um grito curto vem de fora, a voz dela.",
        mood: "danger",
        event: "danger",
        options: [{ text: "Correr para fora de casa", type: "continue", next: "emboscadaNaCalcada" }]
    },

    // Ambiguidade corrigida: aqui o ataque acontece bem na frente da SUA
    // casa (não no meio do caminho até a do Rafa), então o texto é diferente
    // do nó "emboscada" - mas os dois levam para a mesma luta.
    emboscadaNaCalcada: {
        speaker: "",
        text: "Você corre para fora e encontra a Duda caída na calçada, bem na frente da sua casa. A figura mascarada está parada ao lado dela, virando-se agora na sua direção.",
        mood: "danger",
        event: "danger",
        icon: "silhouette",
        options: [{ text: "Reagir agora", type: "continue", next: "lutaOuFuga" }]
    },

    esperarEmCasa: {
        speaker: "",
        text: "Vocês trancam todas as portas e janelas, apagam as luzes e se sentam encostadas na parede, ouvindo cada som da casa.",
        mood: "tense",
        options: [{ text: "Ficar em silêncio e esperar", type: "continue", next: "ouveBarulhoPorao" }]
    },

    ouveBarulhoPorao: {
        speaker: "",
        text: "Um barulho abafado vem lá de baixo, do porão.",
        mood: "danger",
        icon: "lamp",
        options: [
            { text: "Descer com a lanterna para checar", requiredItem: "Lanterna", roll: true, successThreshold: 8, successNext: "escondeATempo", failNext: "pegaDesprevenida", addToChoices: "Desceu ao porão com a lanterna" },
            { text: "Descer no escuro para checar o porão", roll: true, successThreshold: 13, successNext: "escondeATempo", failNext: "pegaDesprevenida", addToChoices: "Desceu ao porão no escuro" },
            { text: "Ignorar e ficar longe do porão", next: "ignoraPorao", addToChoices: "Ignorou o barulho do porão" }
        ]
    },

    escondeATempo: {
        speaker: "",
        text: "Você desce com cuidado. É só o gato do vizinho, que entrou por uma janela mal fechada. Vocês riem, aliviadas, mas o alívio dura pouco.",
        mood: "tense",
        options: [{ text: "Voltar a tentar dormir", type: "continue", next: "madrugadaSegura" }]
    },

    pegaDesprevenida: {
        speaker: "",
        text: "No escuro do porão, uma mão cobre sua boca antes que você consiga gritar.",
        mood: "danger",
        event: "danger",
        icon: "silhouette",
        options: [{ text: "Reagir imediatamente", type: "continue", next: "lutaOuFugaCasa" }]
    },

    ignoraPorao: {
        speaker: "",
        text: "Vocês decidem não arriscar. O barulho não se repete.",
        mood: "tense",
        options: [{ text: "Voltar a esperar em silêncio", type: "continue", next: "madrugadaSegura" }]
    },

    lutaOuFugaCasa: {
        speaker: "",
        text: "Você precisa reagir agora, ou não vai ter uma segunda chance.",
        mood: "danger",
        event: "danger",
        icon: "silhouette",
        options: [
            { text: "Lutar com a faca de cozinha", requiredItem: "Faca de Cozinha", roll: true, successThreshold: 11, successNext: "expulsouInvasor", failNext: "finalMorteCasa", addToChoices: "Lutou com a faca dentro de casa" },
            { text: "Golpear com o taco de beisebol", requiredItem: "Taco de Beisebol", roll: true, successThreshold: 10, successNext: "expulsouInvasor", failNext: "finalMorteCasa", addToChoices: "Lutou com o taco dentro de casa" },
            { text: "Cegar com a lanterna e empurrar", requiredItem: "Lanterna", roll: true, successThreshold: 9, successNext: "expulsouInvasor", failNext: "finalMorteCasa", addToChoices: "Usou a lanterna para se defender" },
            { text: "Lutar com as próprias mãos", roll: true, successThreshold: 16, successNext: "expulsouInvasor", failNext: "finalMorteCasa", addToChoices: "Lutou com as mãos dentro de casa" },
            { text: "Correr para fora pela janela", roll: true, successThreshold: 12, successNext: "fugiuPelaJanela", failNext: "finalMorteCasa", addToChoices: "Fugiu pela janela" }
        ]
    },

    expulsouInvasor: {
        speaker: "",
        text: "Você consegue se soltar e acerta o suficiente para ele recuar e desaparecer pela porta dos fundos. Vocês trancam tudo de novo, tremendo, mas vivas.",
        mood: "bittersweet",
        options: [{ text: "Ficar de guarda até o amanhecer", type: "continue", next: "finalSobrevivenciaSolitaria" }]
    },

    fugiuPelaJanela: {
        speaker: "",
        text: "Vocês pulam pela janela da cozinha e correm até a casa do vizinho, batendo a porta atrás de vocês.",
        mood: "bittersweet",
        options: [{ text: "Bater na porta do vizinho", type: "continue", next: "finalSobrevivenciaSolitaria" }]
    },

    madrugadaSegura: {
        speaker: "",
        text: "As horas passam. Por volta das quatro da manhã, o céu começa a clarear timidamente. Nada mais acontece, pelo menos não com vocês.",
        mood: "bittersweet",
        icon: "sunrise",
        options: [{ text: "Ver o que o dia seguinte revela", type: "continue", next: "finalAmbiguo" }]
    },

    chegamCasaRafa: {
        speaker: "",
        text: "Vocês saem de casa e seguem a pé pela rua escura até a casa do Rafa. A porta da frente está entreaberta, e não há nenhuma luz acesa lá dentro.",
        mood: "danger",
        icon: "door",
        options: [{ text: "Entrar na casa do Rafa", type: "continue", next: "entramCasaRafa" }]
    },

    // Variante usada quando o encontro com o mascarado já aconteceu na rua,
    // ou seja, quando vocês já saíram de casa - evita repetir "saem de casa".
    chegamCasaRafa2: {
        speaker: "",
        text: "Vocês seguem o resto do caminho e chegam à casa do Rafa. A porta da frente está entreaberta, e não há nenhuma luz acesa lá dentro.",
        mood: "danger",
        icon: "door",
        options: [{ text: "Entrar na casa do Rafa", type: "continue", next: "entramCasaRafa" }]
    },

    chegamCasaRafaFerida: {
        speaker: "",
        text: "Machucada, você se apoia na Duda para caminhar o resto do caminho. A porta da casa do Rafa está entreaberta.",
        mood: "danger",
        icon: "door",
        options: [{ text: "Entrar mesmo assim", type: "continue", next: "entramCasaRafa" }]
    },

    entramCasaRafa: {
        speaker: "",
        text: "O silêncio lá dentro é pesado demais.",
        mood: "danger",
        icon: "stairs",
        options: [
            { text: "Chamar pelo nome do Rafa", next: "chamamRafa", addToChoices: "Chamou pelo Rafa" },
            { text: "Procurar com a lanterna", requiredItem: "Lanterna", roll: true, successThreshold: 8, successNext: "encontramPista", failNext: "sonsEstranhos", addToChoices: "Procurou com a lanterna" },
            { text: "Procurar em silêncio, no escuro", roll: true, successThreshold: 11, successNext: "encontramPista", failNext: "sonsEstranhos", addToChoices: "Procurou em silêncio" }
        ]
    },

    chamamRafa: {
        speaker: "",
        text: "Ninguém responde. Só o eco da própria voz voltando pelos corredores vazios.",
        mood: "danger",
        options: [{ text: "Procurar por sinais dele", type: "continue", next: "sonsEstranhos" }]
    },

    encontramPista: {
        speaker: "",
        text: "No chão da sala, meio escondido sob o sofá, vocês encontram um bilhete manchado de sangue com um símbolo desenhado à mão, o mesmo símbolo da Noite do Rio Negro.",
        mood: "danger",
        icon: "note",
        addToInventory: "Bilhete Ensanguentado",
        options: [{ text: "Guardar o bilhete e continuar procurando", type: "continue", next: "confrontoFinalPrep" }]
    },

    sonsEstranhos: {
        speaker: "",
        text: "Um som de arrastar vem do andar de cima. Alguma coisa, ou alguém, está esperando.",
        mood: "danger",
        options: [{ text: "Subir as escadas", type: "continue", next: "confrontoFinalPrep" }]
    },

    confrontoFinalPrep: {
        speaker: "MASCARADO",
        text: "No topo da escada, uma figura mascarada aparece, bloqueando a única saída. \"Vinte anos\", ele sussurra. \"Ninguém nunca perguntou o que aconteceu comigo naquela noite.\"",
        mood: "danger",
        event: "danger",
        icon: "mask",
        options: [{ text: "Encarar a figura mascarada", type: "continue", next: "revelacaoMascara" }]
    },

    revelacaoMascara: {
        speaker: "",
        text: "É agora ou nunca.",
        mood: "danger",
        event: "danger",
        icon: "mask",
        options: [
            { text: "Usar o pedaço de máscara que você guardou como prova", requiredItem: "Pedaço de Máscara", next: "descobremIdentidade", addToChoices: "Usou o pedaço de máscara como prova" },
            { text: "Mostrar o bilhete e confrontar com a verdade", requiredItem: "Bilhete Ensanguentado", next: "negociarComProva", addToChoices: "Confrontou com o bilhete" },
            { text: "Golpear com o taco de beisebol", requiredItem: "Taco de Beisebol", roll: true, successThreshold: 10, successNext: "feriuAtacante", failNext: "contraAtaque", addToChoices: "Golpeou com o taco" },
            { text: "Arrancar a máscara dele à força", roll: true, successThreshold: 15, successNext: "descobremIdentidade", failNext: "contraAtaque", addToChoices: "Tentou arrancar a máscara" },
            { text: "Atacar direto, sem hesitar", roll: true, successThreshold: 13, successNext: "feriuAtacante", failNext: "contraAtaque", addToChoices: "Atacou direto" },
            { text: "Tentar ganhar tempo conversando", next: "negociar", addToChoices: "Tentou negociar" }
        ]
    },

    negociarComProva: {
        speaker: "",
        text: "Diante da prova nas suas mãos, ele hesita, um segundo de dúvida é tudo que vocês precisam.",
        mood: "tense",
        options: [{ text: "Aproveitar a hesitação dele", type: "continue", next: "descobremIdentidade" }]
    },

    negociar: {
        speaker: "",
        text: "Você fala, tentando prolongar cada segundo. Atrás dele, sem que perceba, Duda se aproxima devagar segurando um abajur de metal.",
        mood: "tense",
        options: [{ text: "Esperar a Duda agir", type: "continue", next: "dudaAjuda" }]
    },

    dudaAjuda: {
        speaker: "DUDA",
        text: "Duda acerta um golpe certeiro na cabeça dele. Ele cai, atordoado, a máscara escorregando.",
        mood: "tense",
        options: [{ text: "Aproveitar a chance", type: "continue", next: "descobremIdentidade" }]
    },

    contraAtaque: {
        speaker: "",
        text: "Ele avança rápido demais, derrubando você no chão. Esta é sua última chance.",
        mood: "danger",
        event: "danger",
        icon: "silhouette",
        options: [{ text: "Tentar mais uma vez", type: "continue", next: "lastChance" }]
    },

    lastChance: {
        speaker: "",
        text: "Tudo o que você tem é um último movimento.",
        mood: "danger",
        event: "danger",
        options: [
            { text: "Última tentativa de lutar", roll: true, successThreshold: 17, successNext: "descobremIdentidade", failNext: "finalMorteConfronto", addToChoices: "Fez a última tentativa" }
        ]
    },

    feriuAtacante: {
        speaker: "",
        text: "Seu golpe acerta em cheio. Ele recua, segurando o ferimento, a máscara torta sobre o rosto.",
        mood: "tense",
        options: [{ text: "Aproveitar a vantagem", type: "continue", next: "descobremIdentidade" }]
    },

    descobremIdentidade: {
        speaker: "MASCARADO",
        text: "A máscara cai no chão. O rosto por trás dela é alguém que a cidade toda conhece, o irmão mais novo de uma das vítimas da Noite do Rio Negro, que todos acreditavam ter se mudado anos atrás. \"Vocês esqueceram\", ele murmura, ainda tonto. \"Mas eu não.\"",
        mood: "tense",
        icon: "mask",
        options: [{ text: "Decidir o que fazer com ele", type: "continue", next: "escolhaFinal" }]
    },

    escolhaFinal: {
        speaker: "",
        text: "Falta pouco para o amanhecer.",
        mood: "tense",
        options: [
            { text: "Prendê-lo até a polícia chegar", next: "finalHeroico", addToChoices: "Prendeu o mascarado" },
            { text: "Fugir e deixar a polícia resolver depois", next: "finalFuga", addToChoices: "Fugiu da casa" },
            { text: "Reparar em um segundo vulto mascarado na porta", roll: true, successThreshold: 14, successNext: "finalReviravolta", failNext: "finalHeroico", addToChoices: "Notou algo estranho na porta" }
        ]
    },

    // ===================== FINAIS =====================

    finalHeroico: {
        speaker: "",
        text: "Vocês o mantêm imobilizado até a polícia chegar. O Rafa é encontrado amarrado, mas vivo, no porão. Nos dias seguintes, a cidade toda fala sobre a Noite do Rio Negro de um jeito que não falava há vinte anos, finalmente em voz alta. Você sobreviveu. Dessa vez, a história teve um final diferente.",
        mood: "good",
        icon: "sunrise",
        isEnding: true,
        endingTitle: "A Verdade Vem à Tona",
        options: [{ text: "Jogar novamente", type: "continue", next: "start" }]
    },

    finalFuga: {
        speaker: "",
        text: "Vocês correm da casa sem olhar para trás e só param na delegacia, ofegantes. Quando a polícia volta ao local, ele já não está mais lá. Ninguém nunca mais o viu, ou pelo menos, ninguém admite ter visto.",
        mood: "bittersweet",
        isEnding: true,
        endingTitle: "Ele Desapareceu de Novo",
        options: [{ text: "Jogar novamente", type: "continue", next: "start" }]
    },

    finalReviravolta: {
        speaker: "MASCARADO",
        text: "Pelo canto do olho, você percebe uma segunda figura parada na porta, observando tudo em silêncio, uma máscara idêntica escondendo o rosto. \"Ele nunca trabalhou sozinho\", a voz sussurra atrás de você.",
        mood: "danger",
        event: "danger",
        icon: "silhouette",
        options: [{ text: "Reagir rápido", type: "continue", next: "ultimaChanceReviravolta" }]
    },

    ultimaChanceReviravolta: {
        speaker: "",
        text: "Só resta uma saída.",
        mood: "danger",
        event: "danger",
        options: [
            { text: "Correr com a Duda antes que o segundo se aproxime", roll: true, successThreshold: 15, successNext: "finalSobrevivenciaAmarga", failNext: "finalMorteConfronto", addToChoices: "Correu do segundo mascarado" }
        ]
    },

    finalSobrevivenciaAmarga: {
        speaker: "",
        text: "Vocês escapam por pouco, mas o segundo mascarado desaparece na noite antes da polícia chegar. Você sobrevive à Noite do Rio Negro, só que, dessa vez, ninguém sabe se ela realmente terminou.",
        mood: "bittersweet",
        isEnding: true,
        endingTitle: "Nunca Termina de Verdade",
        options: [{ text: "Jogar novamente", type: "continue", next: "start" }]
    },

    finalMorteConfronto: {
        speaker: "",
        text: "Você não é rápida o suficiente. A última coisa que vê é a máscara branca se aproximando, e depois, nada. A Noite do Rio Negro ganha mais um nome para sua lista.",
        mood: "bad",
        icon: "static",
        isEnding: true,
        endingTitle: "Mais um Nome na Lista",
        options: [{ text: "Jogar novamente", type: "continue", next: "start" }]
    },

    finalMorteCasa: {
        speaker: "",
        text: "Você luta até o fim, mas não é suficiente. Na manhã seguinte, os vizinhos notam que as luzes da sua casa ficaram acesas a noite inteira, e que ninguém nunca mais atendeu à porta.",
        mood: "bad",
        icon: "static",
        isEnding: true,
        endingTitle: "Ninguém Atendeu a Porta",
        options: [{ text: "Jogar novamente", type: "continue", next: "start" }]
    },

    finalSobrevivenciaSolitaria: {
        speaker: "",
        text: "Vocês passam o resto da madrugada trancadas em casa, o coração ainda disparado. Pela manhã, a polícia encontra sinais de invasão, mas nenhuma pista de quem era. A Noite do Rio Negro continua sendo um mistério, e agora, você faz parte dela.",
        mood: "bittersweet",
        isEnding: true,
        endingTitle: "Mais Uma História Sem Resposta",
        options: [{ text: "Jogar novamente", type: "continue", next: "start" }]
    },

    finalAmbiguo: {
        speaker: "",
        text: "O sol nasce e nada mais acontece. Na manhã seguinte, porém, vocês descobrem que o Rafa nunca foi encontrado. A cidade nunca soube se ele fugiu, se escapou, ou se virou mais um nome na lista da Noite do Rio Negro.",
        mood: "bittersweet",
        icon: "sunrise",
        isEnding: true,
        endingTitle: "O Que Aconteceu com o Rafa?",
        options: [{ text: "Jogar novamente", type: "continue", next: "start" }]
    },

    finalFugaDeCarro: {
        speaker: "",
        text: "Vocês dirigem a noite toda sem parar, saindo da cidade antes do amanhecer. Semanas depois, descobrem que o Rafa nunca foi encontrado. Você está viva. Isso deveria bastar, mas às vezes, tarde da noite, você ainda escuta o telefone tocando.",
        mood: "bittersweet",
        icon: "carkey",
        isEnding: true,
        endingTitle: "Você Escolheu Viver",
        options: [{ text: "Jogar novamente", type: "continue", next: "start" }]
    }
};

let playerState = {
    currentScene: 'start',
    inventory: [],
    choices: []
};

const gameContainer = document.getElementById('game-container');
const dialogueText = document.getElementById('dialogue-text');
const nameTag = document.getElementById('name-tag');
const optionsContainer = document.getElementById('options-container');
const topBanner = document.getElementById('top-banner');
const npcPortraitImg = document.getElementById('npc-portrait-img');
const bgMusic = document.getElementById('bg-music');
const audioToggle = document.getElementById('audio-toggle');

const tabItens = document.getElementById('tab-itens');
const tabFinais = document.getElementById('tab-finais');
const itensOverlay = document.getElementById('itens-overlay');
const itensList = document.getElementById('itens-list');
const endingsOverlay = document.getElementById('endings-overlay');
const endingsList = document.getElementById('endings-list');

const dadoOverlay = document.getElementById('dado-overlay');
const dadoTitulo = document.getElementById('dado-titulo');
const dadoNumero = document.getElementById('dado-numero');
const dadoVeredito = document.getElementById('dado-veredito');
const dadoOkBtn = document.getElementById('dado-ok-btn');

let isTyping = false;
let isProcessingOption = false; // trava contra cliques repetidos (corrige bug do dado)
let typingTimeout;
let pendingRollNext = null; // próxima cena, liberada só quando o jogador clica OK

// ===================== Inventário =====================

function addItem(itemOrItems) {
    const items = Array.isArray(itemOrItems) ? itemOrItems : [itemOrItems];
    items.forEach(item => {
        if (!playerState.inventory.includes(item)) {
            playerState.inventory.push(item);
        }
    });
}

function updateInventoryTab() {
    tabItens.textContent = ` Itens: ${playerState.inventory.length}`;
}

function renderItensList() {
    itensList.innerHTML = '';
    if (playerState.inventory.length === 0) {
        itensList.innerHTML = '<div class="list-entry">Nenhum item ainda.</div>';
        return;
    }
    playerState.inventory.forEach(item => {
        const iconKey = ITEM_ICONS[item];
        const iconSvg = iconKey ? ICONS[iconKey] : '';
        const entry = document.createElement('div');
        entry.className = 'list-entry unlocked';
        entry.innerHTML = iconSvg + item;
        itensList.appendChild(entry);
    });
}

// ===================== Finais (contador + galeria) =====================

function getUnlockedEndings() {
    try {
        const raw = localStorage.getItem(ENDINGS_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveUnlockedEndings(list) {
    try {
        localStorage.setItem(ENDINGS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
        // localStorage indisponível (ex: aberto direto do arquivo em alguns navegadores)
    }
}

function unlockEnding(sceneKey) {
    const unlocked = getUnlockedEndings();
    let isNew = false;
    if (!unlocked.includes(sceneKey)) {
        unlocked.push(sceneKey);
        saveUnlockedEndings(unlocked);
        isNew = true;
    }
    updateEndingsTab();
    return isNew;
}

function updateEndingsTab() {
    const unlocked = getUnlockedEndings();
    tabFinais.textContent = ` Finais: ${unlocked.length}/${TOTAL_ENDINGS}`;
}

function renderEndingsGallery() {
    const unlocked = getUnlockedEndings();
    endingsList.innerHTML = '';
    Object.keys(ENDING_TITLES).forEach(key => {
        const isUnlocked = unlocked.includes(key);
        const entry = document.createElement('div');
        entry.className = 'list-entry ' + (isUnlocked ? 'unlocked' : 'locked');
        const iconSvg = isUnlocked ? ICONS.check : ICONS.lock;
        entry.innerHTML = iconSvg + (isUnlocked ? ENDING_TITLES[key] : '???');
        endingsList.appendChild(entry);
    });
}

// ===================== Abas e overlays =====================

tabItens.addEventListener('click', () => {
    renderItensList();
    itensOverlay.classList.remove('hidden');
});

tabFinais.addEventListener('click', () => {
    renderEndingsGallery();
    endingsOverlay.classList.remove('hidden');
});

document.querySelectorAll('.close-overlay').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById(btn.dataset.target).classList.add('hidden');
    });
});

function anyOverlayOpen() {
    return !itensOverlay.classList.contains('hidden')
        || !endingsOverlay.classList.contains('hidden')
        || !dadoOverlay.classList.contains('hidden');
}

// ===================== Resultado do dado (fica até o jogador confirmar) =====================

dadoOkBtn.addEventListener('click', () => {
    dadoOverlay.classList.add('hidden');
    isProcessingOption = false;
    const next = pendingRollNext;
    pendingRollNext = null;
    if (next) showScene(next);
});

// ===================== Trilha sonora =====================

bgMusic.volume = 0.35;

// Navegadores bloqueiam áudio com som antes de qualquer interação do
// usuário; assim que ele clicar pela primeira vez (o que já acontece
// naturalmente ao jogar), a trilha começa a tocar sozinha.
document.addEventListener('click', () => {
    bgMusic.play().catch(() => {});
}, { once: true });

audioToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgMusic.paused) {
        bgMusic.muted = false;
        bgMusic.play().catch(() => {});
    } else {
        bgMusic.muted = !bgMusic.muted;
    }
    audioToggle.textContent = bgMusic.muted ? '🔇' : '🔊';
});

// ===================== Motor de diálogo =====================

function typeText(text, callback) {
    // Cancela qualquer digitação anterior ainda em andamento antes de
    // começar uma nova - evita que dois textos se misturem na tela.
    clearTimeout(typingTimeout);
    isTyping = true;
    dialogueText.textContent = '';
    let index = 0;
    function type() {
        if (index < text.length) {
            dialogueText.textContent += text.charAt(index);
            index++;
            typingTimeout = setTimeout(type, 22);
        } else {
            isTyping = false;
            if (callback) callback();
        }
    }
    type();
}

function applyMoodAndEvent(sceneKey, scene) {
    gameContainer.className = '';
    if (scene.mood) {
        gameContainer.classList.add('mood-' + scene.mood);
    }
    if (LOCATIONS[sceneKey]) {
        gameContainer.classList.add('loc-' + LOCATIONS[sceneKey]);
    }
    if (scene.event === 'call') {
        gameContainer.classList.add('event-call');
        topBanner.textContent = '📞 CHAMADA DE ' + (scene.callerLabel || 'NÚMERO DESCONHECIDO');
    } else {
        topBanner.textContent = '';
    }
    if (scene.event === 'danger') {
        gameContainer.classList.remove('event-danger');
        void gameContainer.offsetWidth; // força reflow para reiniciar a animação
        gameContainer.classList.add('event-danger');
    }
}

// Mostra o sprite de quem está "em cena": a Duda tem prioridade quando
// está presente; senão, mostra a Sofia (protagonista). Se o arquivo de
// imagem ainda não existir, o onerror abaixo esconde a imagem quebrada.
function updatePortrait(sceneKey) {
    const dudaEmotion = DUDA_EMOTIONS[sceneKey];
    const sofiaEmotion = SOFIA_EMOTIONS[sceneKey];

    const imageSrc = dudaEmotion
        ? DUDA_IMAGES[dudaEmotion]
        : (sofiaEmotion ? SOFIA_IMAGES[sofiaEmotion] : null);

    if (imageSrc) {
        npcPortraitImg.src = imageSrc;
        npcPortraitImg.style.display = 'block';
    } else {
        npcPortraitImg.style.display = 'none';
        npcPortraitImg.removeAttribute('src');
    }
}

// Enquanto os sprites da Sofia não forem enviados, evita mostrar o ícone
// de imagem quebrada no navegador caso o arquivo não exista ainda.
npcPortraitImg.addEventListener('error', () => {
    npcPortraitImg.style.display = 'none';
});

// Roda sempre que o texto da cena termina de aparecer na tela - seja
// porque a digitação terminou sozinha, seja porque o jogador clicou
// para pular. Garante que finais sejam sempre registrados corretamente.
function onDialogueReady(sceneKey, scene) {
    renderOptions(scene.options);
    if (scene.isEnding) {
        unlockEnding(sceneKey);
    }
}

function skipTyping() {
    if (!isTyping) return;
    clearTimeout(typingTimeout);
    const scene = story[playerState.currentScene];
    dialogueText.textContent = scene.text;
    isTyping = false;
    onDialogueReady(playerState.currentScene, scene);
}

function showScene(sceneKey) {
    const scene = story[sceneKey];
    playerState.currentScene = sceneKey;
    isProcessingOption = false;

    applyMoodAndEvent(sceneKey, scene);
    updatePortrait(sceneKey);

    if (scene.addToInventory) {
        addItem(scene.addToInventory);
    }
    if (scene.addToChoices) {
        playerState.choices.push(scene.addToChoices);
    }

    nameTag.textContent = scene.speaker || 'Sofia';

    typeText(scene.text, () => onDialogueReady(sceneKey, scene));

    updateInventoryTab();
}

function renderOptions(options) {
    optionsContainer.innerHTML = '';

    if (!options || options.length === 0) {
        const endMessage = document.createElement('div');
        endMessage.textContent = "Fim da história.";
        optionsContainer.appendChild(endMessage);
        return;
    }

    options.forEach(option => {
        if (option.requiredItem && !playerState.inventory.includes(option.requiredItem)) {
            return;
        }

        const btn = document.createElement('button');
        btn.classList.add(option.type === 'continue' ? 'continue-button' : 'option-button');
        btn.textContent = option.text;
        btn.onclick = () => handleOption(option);
        optionsContainer.appendChild(btn);
    });
}

function handleOption(option) {
    if (isTyping) {
        skipTyping();
        return;
    }

    // Trava contra cliques repetidos: sem isso, clicar várias vezes rápido
    // numa opção de dado disparava várias rolagens e várias trocas de cena
    // ao mesmo tempo, duplicando entradas e bagunçando o texto na tela.
    if (isProcessingOption) return;
    isProcessingOption = true;

    // Remove os botões imediatamente para que um segundo clique não tenha
    // mais em que clicar enquanto o resultado do dado ainda está na tela.
    optionsContainer.innerHTML = '';

    if (option.next === "start") {
        playerState.inventory = [];
        playerState.choices = [];
    }

    if (option.addToInventory) {
        addItem(option.addToInventory);
    }

    if (option.addToChoices) {
        playerState.choices.push(option.addToChoices);
    }

    if (option.roll) {
        const roll = rolarDado();
        const success = roll >= option.successThreshold;

        // Guarda a próxima cena; só é liberada quando o jogador clica OK.
        pendingRollNext = success ? option.successNext : option.failNext;

        dadoTitulo.textContent = `Você tentou: ${option.text}`;
        dadoNumero.innerHTML = `Número sorteado: <strong>${roll}</strong><br>Você precisava de <strong>${option.successThreshold}</strong> ou mais para conseguir.`;
        dadoVeredito.textContent = success ? ' Sucesso!' : ' Falha...';

        dadoOverlay.classList.remove('hidden');
        // isProcessingOption continua travado até o clique em OK (ver listener do dado-ok-btn)
    } else if (option.next) {
        isProcessingOption = false;
        showScene(option.next);
    } else {
        isProcessingOption = false;
    }
}

gameContainer.addEventListener('click', (e) => {
    if (anyOverlayOpen()) return;
    if (e.target.closest('.option-button, .continue-button, .corner-tab, .close-overlay, #audio-toggle')) return;
    skipTyping();
});

updateInventoryTab();
updateEndingsTab();
showScene(playerState.currentScene);
