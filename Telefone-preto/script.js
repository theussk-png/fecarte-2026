const historia = {
  prologo: {
    text: "O ano é 1978, no subúrbio do Colorado. A cidade vive sob o terror de um assassino em série apelidado de 'O Sequestrador' (The Grabber), que captura crianças deixando apenas balões pretos para trás. Você é Finney Shaw, um garoto de 13 anos, inteligente mas tímido, que sofre bullying na escola. Sua única aliada é sua irmã caçula, Gwen, que tem sonhos premonitórios inexplicáveis. A tensão na cidade é alta: vários garotos já sumiram, incluindo seu melhor amigo, Robin.",
    choices: [
      { text: "Começar", to: "capitulo1" }
    ]
  },
  capitulo1: {
    text: "",
    choices: []
  },
  capitulo2: {
    text: "",
    choices: []
  },
  capitulo3: {
    text: "",
    choices: []
  },
};

const textoFaseEl = document.getElementById("fase");
const botoesEl = document.getElementById("botoes");

function goTo(id) {
  const node = historia[id];
  render(node);
}

function render(node) {
  textoFaseEl.textContent = node.text;

  botoesEl.innerHTML = "";

  node.choices.forEach(function (choice) {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = function () {
      goTo(choice.to);
    };
    botoesEl.appendChild(btn);
  });
}

goTo("prologo");