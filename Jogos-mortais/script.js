const interfaceTV = document.getElementById("interface");
const inicio = document.getElementById("inicio");
const menu = document.getElementById("menu");
const jogo = document.getElementById("jogo");
const nomeInput = document.getElementById("nome");
const comecar = document.getElementById("comecar");
const iniciarHistoria = document.getElementById("iniciarHistoria");
const nomeMenu = document.getElementById("nomeMenu");
const nomeHUD = document.getElementById("nomeHUD");
const texto = document.getElementById("texto");
const avancar = document.getElementById("avancar");
const escolhas = document.getElementById("escolhas");
const tituloCena = document.getElementById("tituloCena");
const capitulo = document.getElementById("capitulo");
const indicadorMensagem = document.getElementById("indicadorMensagem");
const areaHistoria = document.getElementById("areaHistoria");
const final = document.getElementById("final");
const finalTexto = document.getElementById("finalTexto");
const reiniciarFinal = document.getElementById("reiniciarFinal");
const statusCena = document.getElementById("statusCena");
const timerElement = document.getElementById("timerJogo");
const itemChave = document.getElementById("itemChave");
const itemSegredo = document.getElementById("itemSegredo");
const itemLuz = document.getElementById("itemLuz");
const tipoNarrador = document.getElementById("tipoNarrador");
const musica = document.getElementById("musica");

musica.volume = 0.3;
document.getElementById("comecar").addEventListener("click", () => {
    musica.play();
});

let nomeJogador = "";
let cenaAtual = null;
let indiceFala = 0;
let escrevendo = false;
let intervaloTexto = null;
let intervaloJogo = null;
let tempoRestante = 120;
let timerIniciado = false;
let numeroCena = 0;
let encerrado = false;

const estado = {
    temChave: false,
    temPista: false,
    luzApagada: false,
    portaAberta: false,
    segredoVisto: false
};

const cenas = {
    despertar: {
        titulo: "O DESPERTAR",
        falas: [
            "Você abre os olhos. A primeira coisa que sente é o frio do piso contra seu rosto. Assustado, você rapidamente se levanta.",
            "O lugar parece um banheiro abandonado: azulejos rachados, canos expostos e uma luminaria que falha acima da sua cabeça.",
            "Ainda atordoado, você percebe que seu tornozelo está preso a uma corrente curta. A outra ponta desaparece em um cano preso ao chão.",
            "Uma televisão antiga, do outro lado da sala, liga sozinha.",
            () => `Olá, ${nomeJogador}. Eu quero jogar um jogo.`,
            () => `${nomeJogador}, quero que preste atenção no que tenho a dizer. Alguns são tão ingratos por estarem vivos, mas você não, não mais.`,
            "Em dois minutos, o sistema de ventilação desta sala será ativado. Você não precisa entender o motivo. Precisa apenas sair. A chave, a energia e a porta fazem parte do mesmo problema. Observe antes de agir.",
            () => `Viver ou morrer, ${nomeJogador}. A escolha ainda é sua.`,
            "Que o jogo comece."
        ],
        escolhas: [
            { texto: "OBSERVAR A SALA", proxima: "ambiente" },
            { texto: "PUXAR A CORRENTE", proxima: "corrente" },
            { texto: "IR ATÉ A BANCADA", proxima: "bancada" }
        ]
    },

    ambiente: {
        titulo: "O INFERNO",
        falas: [
            "Você força os olhos a agirem mesmo contra a luz.",
            "Há uma porta metálica à esquerda, uma pia à direita e uma bancada cheia de objetos.",
            "Um pequeno quadro elétrico está preso à parede. A lâmpada pisca sempre que ele estala.",
            "No espelho quebrado existe uma mancha escura que parece esconder alguma coisa.",
            "Abaixo da pia, uma tampa de ralo está levemente deslocada.",
            "Você percebe uma coisa importante: a sala foi preparada para ser observada."
        ],
        escolhas: [
            { texto: "EXAMINAR O QUADRO ELÉTRICO", proxima: "quadro" },
            { texto: "EXAMINAR O ESPELHO", proxima: "espelho" },
            { texto: "PROCURAR ALGO NO RALO", proxima: "ralo" },
            { texto: "TESTAR A PORTA", proxima: "porta" },
            { texto: "PUXAR A CORRENTE", proxima: "corrente" }
        ]
    },

    corrente: {
        titulo: "A CORRENTE",
        falas: [
            "Você puxa a corrente até sentir o metal vibrar no cano.",
            "Nada. O encaixe foi feito para suportar muito mais força do que você consegue produzir.",
            "No cadeado existe uma pequena gravação: 13.",
            "Talvez não seja uma coincidência."
        ],
        escolhas: [
            { texto: "VOLTAR A OBSERVAR A SALA", proxima: "ambiente" },
            { texto: "IR ATÉ A BANCADA", proxima: "bancada" }
        ]
    },

    bancada: {
        titulo: "A BANCADA",
        falas: [
            "Você encontra um martelo, um pedaço de fio de cobre, uma fita isolante e um pequeno ímã.",
            "As ferramentas maiores estão gastas demais para romper a corrente.",
            "O ímã, porém, parece forte o bastante para alcançar algo preso em um lugar estreito."
        ],
        escolhas: [
            { texto: "LEVAR O ÍMÃ ATÉ O RALO", proxima: "ralo" },
            { texto: "LEVAR O FIO AO QUADRO ELÉTRICO", proxima: "quadro" },
            { texto: "VOLTAR A OBSERVAR A SALA", proxima: "ambiente" }
        ]
    },

    ralo: {
        titulo: "O RALO",
        falas: [
            "Você se ajoelha e remove a tampa enferrujada.",
            "Há algo metálico preso alguns centímetros abaixo.",
            "Usando o ímã encontrado na bancada, você puxa o objeto para fora.",
            "É uma chave pequena. No verso, há o mesmo número gravado no cadeado: 13."
        ],
        aoEntrar() {
            estado.temChave = true;
            atualizarHUD();
        },
        escolhas: [
            { texto: "TENTAR A CHAVE NO CADEADO", proxima: "correnteAberta" },
            { texto: "TESTAR A CHAVE NA PORTA", proxima: "porta" }
        ]
    },

    quadro: {
        titulo: "O QUADRO ELÉTRICO",
        falas: [
            "O quadro está quase solto da parede.",
            "Há dois disjuntores: iluminação e ventilação.",
            "Um fio foi colocado de propósito entre os dois circuitos.",
            "Você pode cortar a iluminação. A ventilação, porém, continuará funcionando.",
            "A escuridão talvez revele algo que a luz esconde."
        ],
        escolhas: [
            { texto: "DESLIGAR A ILUMINAÇÃO", proxima: "escuro" },
            { texto: "NÃO MEXER E VOLTAR", proxima: "ambiente" }
        ]
    },

    escuro: {
        titulo: "APAGÃO",
        falas: [
            "A sala mergulha no escuro.",
            "Por alguns segundos, você escuta apenas o zumbido da televisão.",
            "Então uma luz vermelha de emergência acende.",
            "No espelho aparece uma mensagem que não estava visível antes: 'A VERDADE ESTÁ ATRÁS DO VIDRO'."
        ],
        aoEntrar() {
            estado.luzApagada = true;
            atualizarHUD();
            jogo.classList.add("ambiente-escuro");
        },
        escolhas: [
            { texto: "VOLTAR AO ESPELHO", proxima: "espelho" },
            { texto: "VOLTAR AO QUADRO", proxima: "quadro" }
        ]
    },

    espelho: {
        titulo: "O ESPELHO",
        falas: [
            "Você passa a mão pelo vidro rachado.",
            "Uma das rachaduras parece esconder uma pequena aba metálica.",
            "Ao puxá-la, o espelho se desloca alguns centímetros e revela uma caixa estreita.",
            "Dentro há uma fotografia antiga e um cartão com três palavras: 'NÃO CONFIE NELE'.",
            "No verso da fotografia está escrito: SALA 13 // ARQUIVO 01."
        ],
        aoEntrar() {
            estado.temPista = true;
            estado.segredoVisto = true;
            atualizarHUD();
        },
        escolhas: [
            { texto: "ABRIR A CAIXA ESCONDIDA", proxima: "segredo" },
            { texto: "VOLTAR À SALA", proxima: "ambiente" }
        ]
    },

    segredo: {
        titulo: "ARQUIVO 13",
        falas: [
            "A fotografia mostra a mesma sala antes de ser abandonada.",
            "No canto da imagem há uma pessoa usando o mesmo símbolo que aparece no seu cadeado.",
            "Abaixo da fotografia, uma frase foi escrita à mão: 'A porta não é a saída. É o teste.'",
            "Você encontra um cartão magnético escondido atrás da foto.",
            "Talvez exista uma segunda saída."
        ],
        escolhas: [
            { texto: "PROCURAR A SEGUNDA SAÍDA", proxima: "passagem" },
            { texto: "IGNORAR E IR PARA A PORTA", proxima: "porta" }
        ]
    },

    passagem: {
        titulo: "A PASSAGEM",
        falas: [
            "Atrás da pia existe uma placa metálica quase invisível.",
            "O cartão magnético destrava a placa.",
            "Você encontra um corredor estreito, sem câmeras e sem a corrente presa ao chão.",
            "No final existe uma saída de emergência e uma última gravação.",
            "A gravação começa antes que você consiga decidir se deve ouvi-la."
        ],
        escolhas: [
            { texto: "OUVIR A GRAVAÇÃO", proxima: "gravacao" },
            { texto: "IR DIRETO PARA A SAÍDA", proxima: "final2" }
        ]
    },

    gravacao: {
        titulo: "A ÚLTIMA MENSAGEM",
        falas: [
            () => `A voz diz: "${nomeJogador}, se você chegou até aqui, descobriu o que eu queria esconder."`,
            "O homem que preparou esta sala não queria apenas testar se você sobreviveria.",
            "Ele queria descobrir se você seguiria instruções cegamente ou se procuraria uma saída por conta própria.",
            "A gravação termina. Do outro lado da porta, a rua está silenciosa.",
            "Você pode sair agora. O resto da verdade terá de ser descoberto por você."
        ],
        escolhas: [
            { texto: "SAIR E ENCERRAR O JOGO", proxima: "final3" },
            { texto: "VOLTAR PARA A SALA", proxima: "ambiente" }
        ]
    },

    porta: {
        titulo: "A PORTA",
        falas: [
            "A porta metálica tem uma fechadura antiga.",
            "Sem uma chave, ela não se move.",
            "Você percebe uma pequena abertura ao lado da maçaneta. Parece feita para uma chave muito específica."
        ],
        escolhas: [
            { texto: "VOLTAR À SALA", proxima: "ambiente" },
            { texto: "PROCURAR UMA CHAVE", proxima: "ralo" }
        ]
    },

    correnteAberta: {
        titulo: "O CADEADO",
        falas: [
            "A chave entra no cadeado.",
            "Por um instante, nada acontece.",
            "Então o mecanismo cede.",
            "A corrente cai no chão.",
            "Você está livre para chegar à porta."
        ],
        aoEntrar() {
            estado.portaAberta = true;
            atualizarHUD();
            pararTimer();
        },
        escolhas: [
            { texto: "ABRIR A PORTA E ESCAPAR", proxima: "final2" },
            { texto: "PROCURAR A VERDADE ANTES DE SAIR", proxima: "ambiente" }
        ]
    },

    final1: {
        titulo: "FIM 01 // TEMPO ESGOTADO",
        final: {
            titulo: "O RELÓGIO CHEGOU A ZERO",
            texto: "O sistema é ativado. A televisão apaga e a sala fica em silêncio. O arquivo termina antes que você encontre uma saída."
        }
    },

    final2: {
        titulo: "FIM 02 // FUGA",
        final: {
            titulo: "VOCÊ SAIU",
            texto: "A porta se abre para a rua. Você não sabe quem construiu a sala, nem por quê. Pela primeira vez desde que acordou, não há ninguém dizendo o que fazer."
        }
    },

    final3: {
        titulo: "FIM 03 // ARQUIVO 13",
        final: {
            titulo: "A VERDADE FICA PARA TRÁS",
            texto: "Você deixa o local levando apenas a fotografia e a certeza de que a sala fazia parte de algo maior. Atrás de você, a televisão continua ligada. O arquivo não terminou, apenas deixou de ser seu."
        }
    }
};

function obterFala() {
    const cena = cenas[cenaAtual];
    if (!cena || !cena.falas || indiceFala >= cena.falas.length) return "";
    const fala = cena.falas[indiceFala];
    return typeof fala === "function" ? fala() : fala;
}

function iniciarJogo() {
    const nome = nomeInput.value.trim();
    if (!nome) {
        nomeInput.classList.remove("erro");
        void nomeInput.offsetWidth;
        nomeInput.classList.add("erro");
        nomeInput.focus();
        return;
    }

    nomeJogador = nome;
    nomeMenu.textContent = nomeJogador;
    nomeHUD.textContent = nomeJogador.toUpperCase();
    inicio.classList.add("escondida");
    menu.classList.remove("escondida");
}

function iniciarHistoriaJogo() {
    pararTimer();
    timerIniciado = false;
    tempoRestante = 120;
    encerrado = false;
    resetarEstado();

    menu.classList.add("escondida");
    jogo.classList.remove("escondida");
    interfaceTV.classList.add("modo-historia");
    jogo.classList.remove("ambiente-escuro", "ambiente-tensao");

    cenaAtual = "despertar";
    indiceFala = 0;
    numeroCena = 1;
    escrevendo = false;

    final.classList.add("escondida");
    areaHistoria.classList.remove("escondida");
    escolhas.classList.add("escondida");
    escolhas.innerHTML = "";
    tituloCena.textContent = cenas[cenaAtual].titulo;
    atualizarHUD();
    atualizarTimerVisual();
    atualizarCabecalho();
    avancar.disabled = false;
    mostrarMensagem();
}

function resetarEstado() {
    estado.temChave = false;
    estado.temPista = false;
    estado.luzApagada = false;
    estado.portaAberta = false;
    estado.segredoVisto = false;
    atualizarHUD();
}

function atualizarHUD() {
    itemChave.classList.toggle("ativo", estado.temChave);
    itemChave.querySelector("b").textContent = estado.temChave ? "OK" : "—";
    itemSegredo.classList.toggle("ativo", estado.temPista);
    itemSegredo.querySelector("b").textContent = estado.temPista ? "OK" : "—";
    itemLuz.classList.toggle("ativo", !estado.luzApagada);
    itemLuz.querySelector("b").textContent = estado.luzApagada ? "OFF" : "ON";
}

function atualizarTimerVisual() {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;
    timerElement.textContent = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
    timerElement.classList.toggle("timer-critico", timerIniciado && tempoRestante <= 20);
}

function iniciarTimer() {
    if (timerIniciado || encerrado) return;

    timerIniciado = true;
    tempoRestante = 120;
    atualizarTimerVisual();
    statusCena.textContent = "PROTOCOLO ATIVO";
    jogo.classList.add("ambiente-tensao");

    intervaloJogo = setInterval(() => {
        tempoRestante--;
        atualizarTimerVisual();

        if (tempoRestante <= 0) {
            pararTimer();
            encerrado = true;
            cenaAtual = "final1";
            numeroCena++;
            tituloCena.textContent = cenas.final1.titulo;
            mostrarFinal(cenas.final1.final);
        }
    }, 1000);
}

function pararTimer() {
    clearInterval(intervaloJogo);
    intervaloJogo = null;
    if (!encerrado) statusCena.textContent = "PROTOCOLO ENCERRADO";
}

function iniciarCena(cena) {
    if (typeof cena.aoEntrar === "function") cena.aoEntrar();
}

function atualizarCabecalho() {
    capitulo.textContent = `ARQUIVO 01 // ${String(numeroCena).padStart(2, "0")}`;
    indicadorMensagem.textContent = String(indiceFala + 1).padStart(2, "0");
}

function mostrarMensagem() {
    const cena = cenas[cenaAtual];
    if (!cena) return;

    if (indiceFala >= cena.falas.length) {
        mostrarEscolhasOuFinal();
        return;
    }

    indicadorMensagem.textContent = String(indiceFala + 1).padStart(2, "0");
    tipoNarrador.textContent = cenaAtual === "despertar" && indiceFala >= 3 ? "TRANSMISSÃO" : "NARRADOR";
    escreverMensagem(obterFala());
}

function verificarInicioTimer() {
    if (cenaAtual === "despertar" && indiceFala === cenas.despertar.falas.length - 1 && !timerIniciado) {
        iniciarTimer();
    }
}

function escreverMensagem(mensagem) {
    clearInterval(intervaloTexto);
    texto.textContent = "";
    escrevendo = true;
    avancar.disabled = false;

    let i = 0;
    intervaloTexto = setInterval(() => {
        texto.textContent += mensagem.charAt(i);
        i++;

        if (i >= mensagem.length) {
            clearInterval(intervaloTexto);
            intervaloTexto = null;
            escrevendo = false;
            verificarInicioTimer();
        }
    }, 22);
}

function completarMensagem() {
    if (!escrevendo) return;
    clearInterval(intervaloTexto);
    intervaloTexto = null;
    texto.textContent = obterFala();
    escrevendo = false;
    verificarInicioTimer();
}

function proximaMensagem() {
    if (!cenaAtual || encerrado) return;

    if (escrevendo) {
        completarMensagem();
        return;
    }

    const cena = cenas[cenaAtual];
    if (!cena || !Array.isArray(cena.falas)) return;

    indiceFala++;

    if (indiceFala < cena.falas.length) {
        atualizarCabecalho();
        mostrarMensagem();
    } else {
        mostrarEscolhasOuFinal();
    }
}

function mostrarEscolhasOuFinal() {
    const cena = cenas[cenaAtual];
    if (!cena) return;

    clearInterval(intervaloTexto);
    escrevendo = false;
    avancar.disabled = true;

    if (cena.final) {
        mostrarFinal(cena.final);
        return;
    }

    if (!Array.isArray(cena.escolhas) || cena.escolhas.length === 0) return;

    areaHistoria.classList.add("escondida");
    escolhas.classList.remove("escondida");
    escolhas.innerHTML = "";

    cena.escolhas.forEach((escolha, indice) => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "escolha";
        botao.innerHTML = `<span>${String(indice + 1).padStart(2, "0")}</span>${escolha.texto}`;
        botao.addEventListener("click", () => escolher(escolha.proxima));
        escolhas.appendChild(botao);
    });
}

function escolher(proximaCena) {
    if (encerrado || !cenas[proximaCena]) {
        console.error("Transição inválida:", proximaCena);
        return;
    }

    clearInterval(intervaloTexto);
    cenaAtual = proximaCena;
    numeroCena++;
    indiceFala = 0;
    escrevendo = false;

    escolhas.innerHTML = "";
    escolhas.classList.add("escondida");
    areaHistoria.classList.remove("escondida");
    tituloCena.textContent = cenas[cenaAtual].titulo;
    atualizarCabecalho();
    iniciarCena(cenas[cenaAtual]);

    if (cenas[cenaAtual].final) {
        mostrarFinal(cenas[cenaAtual].final);
        return;
    }

    avancar.disabled = false;
    mostrarMensagem();
}

function mostrarFinal(dadosFinal) {
    pararTimer();
    encerrado = true;
    clearInterval(intervaloTexto);
    escrevendo = false;
    areaHistoria.classList.add("escondida");
    escolhas.classList.add("escondida");
    final.classList.remove("escondida");
    finalTexto.innerHTML = `<strong>${dadosFinal.titulo}</strong><br><br>${dadosFinal.texto}`;
    avancar.disabled = true;
    statusCena.textContent = "ARQUIVO ENCERRADO";
}

function reiniciar() {
    clearInterval(intervaloTexto);
    pararTimer();
    timerIniciado = false;
    encerrado = false;
    cenaAtual = null;
    indiceFala = 0;
    numeroCena = 0;
    escrevendo = false;
    texto.textContent = "";
    finalTexto.textContent = "";
    escolhas.innerHTML = "";
    final.classList.add("escondida");
    escolhas.classList.add("escondida");
    areaHistoria.classList.remove("escondida");
    jogo.className = "tela-cena escondida";
    interfaceTV.classList.remove("modo-historia");
    menu.classList.remove("escondida");
    inicio.classList.add("escondida");
    nomeInput.focus();
    tempoRestante = 120;
    atualizarTimerVisual();
}

comecar.addEventListener("click", iniciarJogo);
iniciarHistoria.addEventListener("click", iniciarHistoriaJogo);
avancar.addEventListener("click", proximaMensagem);
reiniciarFinal.addEventListener("click", reiniciar);
nomeInput.addEventListener("keydown", event => {
    if (event.key === "Enter") iniciarJogo();
});
