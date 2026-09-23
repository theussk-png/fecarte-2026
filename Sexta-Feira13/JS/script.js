/* ================================================================
   VOCÊ SOBREVIVERIA? — CRYSTAL LAKE
   ----------------------------------------------------------------
   Arquivo principal do jogo. Organizado em seções:

   1. ÁUDIO ................ gerenciador de som e música
   2. DADOS GLOBAIS ....... finais, cenas de perseguição, estado
   3. TROFÉUS ............. persistência em localStorage
   4. INVENTÁRIO .......... adicionar/remover/usar itens
   5. HUD E MENSAGENS ..... vida, stamina, mensagens
   6. DADOS ............... dano, cura, stamina, dado
   7. TESTE DE DADO ....... animação 3D do D6
   8. ROTEIRO ............. todas as cenas e escolhas
   9. NAVEGAÇÃO ........... goToScene, restartGame
  10. INICIALIZAÇÃO ...... DOMContentLoaded e eventos
   ================================================================ */


/* ================================================================
   1. ÁUDIO
   ================================================================ */
const AudioManager = (() => {
  let muted = localStorage.getItem("crystalLakeMuted") === "true";

  const bgm = new Audio("audio/ambient.mp3");
  bgm.loop = true;
  bgm.volume = 0.75;

  const sfx = {
    fail:     new Audio("audio/fail.mp3"),
    hit:      new Audio("audio/fail.mp3"),
    item:     new Audio("audio/click.mp3"),
    click:    new Audio("audio/click.mp3"),
    dice:     new Audio("audio/dice.mp3"),
    success:  new Audio("audio/success.mp3"),
    horror:   new Audio("audio/horror.mp3"),
    piorCena: new Audio("audio/pior-cena.mp3")
  };
  Object.values(sfx).forEach(a => { a.volume = 0.6; });

  function applyMuteState() {
    bgm.muted = muted;
    Object.values(sfx).forEach(a => { a.muted = muted; });
    const btn = document.getElementById("sound-toggle");
    if (btn) {
      btn.textContent = muted ? "🔇" : "🔊";
      btn.setAttribute("aria-label", muted ? "Ativar som" : "Desativar som");
    }
  }

  function play(name) {
    const sound = sfx[name];
    if (!sound) return;
    try {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    } catch (e) { /* arquivo ausente — ignora silenciosamente */ }
  }

  function startBgm() { bgm.play().catch(() => {}); }

  function toggleMute() {
    muted = !muted;
    localStorage.setItem("crystalLakeMuted", muted);
    applyMuteState();
  }

  return { play, startBgm, toggleMute, applyMuteState };
})();


/* ================================================================
   2. DADOS GLOBAIS
   ================================================================ */

/* Finais possíveis — usados para montar a tela de troféus */
const ENDINGS = {
  ending_death:    { name: "Crystal Lake",      description: "Descobriu o destino mais sombrio.", icon: "☠️" },
  ending_good_car: { name: "Fuga pela Rodovia", description: "Escapou usando a velha Pick-Up.",   icon: "🚙" },
  ending_good_boat:{ name: "Além das Águas",    description: "Conseguiu atravessar o lago.",      icon: "🚤" },
  ending_heroic:   { name: "Resgate Estadual",  description: "Conseguiu pedir socorro.",          icon: "📻" }
};

/* Cenas de "loop de fuga": cada retorno a uma delas aproxima Jason
   e causa dano automático crescente. */
const CHASE_LOOP_SCENES = ["forest_chase", "tower_escape", "garage_escape", "lake_escape"];

/* Estado atual do jogador */
const gameState = {
  hp: 10, maxHp: 10,
  stamina: 5, maxStamina: 5,
  inventory: [], maxInventorySlots: 4,
  currentScene: "prologue",
  decisions: 0,
  isRolling: false,
  visited: new Set(),
  chaseLoops: 0
};

/* Rotação de cada face do dado 3D */
const faceRotations = {
  1: { x: 0, y: 0 },
  2: { x: -90, y: 0 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  5: { x: 90, y: 0 },
  6: { x: 0, y: 180 }
};


/* ================================================================
   3. TROFÉUS (persistência em localStorage)
   ================================================================ */
const trophyData = () => JSON.parse(localStorage.getItem("crystalLakeEndings") || "[]");

function saveTrophy(sceneKey) {
  const unlocked = trophyData();
  if (ENDINGS[sceneKey] && !unlocked.includes(sceneKey)) {
    unlocked.push(sceneKey);
    localStorage.setItem("crystalLakeEndings", JSON.stringify(unlocked));
    updateTrophyUI();
    showMessage(`🏆 Novo final descoberto: ${ENDINGS[sceneKey].name}`);
  }
}

function updateTrophyUI() {
  const unlocked = trophyData();
  const count = unlocked.length;
  document.getElementById("trophy-count").innerText = count;
  document.getElementById("modal-trophy-count").innerText = count;

  const list = document.getElementById("trophy-list");
  if (!list) return;

  list.innerHTML = Object.entries(ENDINGS).map(([key, ending]) => {
    const got = unlocked.includes(key);
    return `<div class="trophy ${got ? "" : "locked"}">
      <div class="trophy-medal">${got ? ending.icon : "🔒"}</div>
      <div>
        <div class="trophy-name">${got ? ending.name : "Final desconhecido"}</div>
        <div class="trophy-desc">${got ? ending.description : "Alcance este final para revelar o troféu."}</div>
      </div>
      <span class="trophy-state">${got ? "DESBLOQUEADO" : "BLOQUEADO"}</span>
    </div>`;
  }).join("");
}


/* ================================================================
   4. INVENTÁRIO
   ================================================================ */
function addItem(itemName) {
  if (gameState.inventory.includes(itemName)) return true;
  if (gameState.inventory.length >= gameState.maxInventorySlots) {
    showMessage("Sua mochila está cheia. Você precisa deixar algum item para trás.");
    return false;
  }
  gameState.inventory.push(itemName);
  updateHUD();
  AudioManager.play("item");
  showMessage(`Item obtido: ${itemName}.`);
  return true;
}

function removeItem(itemName) {
  const i = gameState.inventory.indexOf(itemName);
  if (i >= 0) { gameState.inventory.splice(i, 1); updateHUD(); }
}

function hasItem(itemName) {
  return gameState.inventory.includes(itemName);
}

function useConsumableItem(itemName) {
  if (itemName === "Kit Médico") {
    if (gameState.hp >= gameState.maxHp) return showMessage("Você ainda não precisa usar o Kit Médico.");
    restoreHp(4);
    removeItem(itemName);
    showMessage("Kit Médico usado: +4 VIDA.");
  } else {
    showMessage(`${itemName} só pode ser usado em uma situação específica.`);
  }
}


/* ================================================================
   5. HUD E MENSAGENS
   ================================================================ */
function showMessage(msg) {
  const banner = document.getElementById("dice-banner");
  document.getElementById("dice-banner-text").innerText = msg;
  banner.classList.remove("hidden");
}

function hideMessage() {
  document.getElementById("dice-banner").classList.add("hidden");
}

function updateHUD() {
  document.getElementById("hp-display").innerText = `${gameState.hp}/${gameState.maxHp}`;
  document.getElementById("hp-bar").style.width = `${gameState.hp / gameState.maxHp * 100}%`;

  document.getElementById("stamina-display").innerText = `${gameState.stamina}/${gameState.maxStamina}`;
  document.getElementById("stamina-bar").style.width = `${gameState.stamina / gameState.maxStamina * 100}%`;

  const oldInv = document.querySelector(".inventory-slots");
  if (oldInv) oldInv.innerHTML = gameState.inventory.map(item => `<span class="item-chip">${item}</span>`).join("");

  document.getElementById("progress-text").innerText = `Decisões: ${gameState.decisions}`;
}


/* ================================================================
   6. DADOS (vida, stamina, dado)
   ================================================================ */
function takeDamage(amount) {
  gameState.hp = Math.max(0, gameState.hp - amount);
  updateHUD();
  if (amount > 0) AudioManager.play("hit");
  if (gameState.hp <= 0) setTimeout(() => goToScene("ending_death"), 650);
}

function restoreHp(amount) {
  gameState.hp = Math.min(gameState.maxHp, gameState.hp + amount);
  updateHUD();
}

function useStamina(amount) {
  gameState.stamina = Math.max(0, gameState.stamina - amount);
  updateHUD();
}

function recoverStamina(amount = 1) {
  gameState.stamina = Math.min(gameState.maxStamina, gameState.stamina + amount);
  updateHUD();
}

function rollD6Value() {
  return Math.floor(Math.random() * 6) + 1;
}


/* ================================================================
   7. TESTE DE DADO (animação 3D)
   ================================================================ */
function handleDiceTest({ bonus = 0, target, statusMsg, onSuccess, onFail }) {
  if (gameState.isRolling) return;
  gameState.isRolling = true;

  const stage       = document.getElementById("dice-stage");
  const cube        = document.getElementById("cube");
  const status      = document.getElementById("dice-status");
  const hint        = document.getElementById("dice-hint");
  const continueBtn = document.getElementById("dice-continue");

  status.innerText = statusMsg || "O DADO ESTÁ ROLANDO...";

  /* Reseta visibilidade da dica e do botão para o momento do giro */
  if (hint) hint.classList.remove("hidden");
  if (continueBtn) continueBtn.classList.add("hidden");

  stage.classList.remove("hidden");
  cube.classList.add("rolling");
  AudioManager.play("dice");

  const roll    = rollD6Value();
  const total   = roll + bonus;
  const success = total >= target;

  setTimeout(() => {
    cube.classList.remove("rolling");
    const r = faceRotations[roll];
    cube.style.transform = `rotateX(${r.x + 720}deg) rotateY(${r.y + 720}deg)`;
    status.innerText = `DADO: ${roll}${bonus ? ` + ${bonus}` : ""}  •  TOTAL: ${total}  •  ${success ? "SUCESSO" : "FALHA"}`;
    AudioManager.play(success ? "success" : "fail");

    /* Oculta a dica e revela o botão para o jogador decidir quando prosseguir */
    if (hint) hint.classList.add("hidden");
    if (continueBtn) {
      continueBtn.classList.remove("hidden");
      continueBtn.focus();
    }

    const finishRoll = () => {
      stage.classList.add("hidden");
      gameState.isRolling = false;
      showMessage(success
        ? `Teste bem-sucedido! Você tirou ${roll}.`
        : `Teste falhou. Você tirou ${roll}.`
      );

      if (continueBtn) continueBtn.removeEventListener("click", finishRoll);
      document.removeEventListener("keydown", handleEnter);

      if (success) onSuccess?.();
      else onFail?.();
    };

    const handleEnter = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        finishRoll();
      }
    };

    if (continueBtn) continueBtn.addEventListener("click", finishRoll);
    document.addEventListener("keydown", handleEnter);

  }, 1900);
}


/* ================================================================
   8. ROTEIRO — todas as cenas e escolhas
   ================================================================ */
const scenes = {
  prologue: {
    chapter: "PRÓLOGO",
    title: "A estrada para Crystal Lake",
    image: "img/prologue-road.mp4",
    text: "É sexta-feira, 13 de julho de 1984. Uma tempestade derruba a visibilidade enquanto seu carro para numa estrada isolada.\n\nUm letreiro enferrujado indica Crystal Lake. O acampamento deveria estar fechado há décadas, mas uma luz aparece entre as árvores.\n\nÀ esquerda, um posto abandonado. À frente, os portões do acampamento.",
    choices: [
      { text: "Investigar o posto em busca de recursos", action: () => handleDiceTest({ target: 3, statusMsg: "VASCULHANDO O POSTO ABANDONADO...", onSuccess: () => { addItem("Lanterna"); goToScene("gas_station"); }, onFail: () => { takeDamage(1); goToScene("gas_station"); } }) },
      { text: "Deixar o carro e seguir direto para o acampamento", action: () => goToScene("arrival") }
    ]
  },

  gas_station: {
    chapter: "PRÓLOGO",
    title: "Sombra no posto",
    image: "img/gas_station.jpg",
    text: "A oficina cheira a combustível velho. Enquanto você procura uma saída, ouve passos pesados do lado de fora.\n\nUm vulto passa pela janela. Não é hora de ficar parado.",
    choices: [
      { text: "Forçar o porta-malas do carro abandonado", tag: "TESTE DE FORÇA", action: () => handleDiceTest({ target: 4, bonus: gameState.stamina >= 3 ? 1 : 0, statusMsg: "FORÇANDO A TRAVA...", onSuccess: () => { addItem("Pé de Cabra"); goToScene("arrival"); }, onFail: () => { useStamina(1); goToScene("arrival"); } }) },
      { text: "Sair em silêncio e seguir para os portões", tag: "FURTIVIDADE", action: () => goToScene("arrival") }
    ]
  },

  arrival: {
    chapter: "CAPÍTULO I",
    title: "Os portões de Crystal Lake",
    image: "img/camp_gates.mp4",
    text: "Os portões estão abertos. A corrente foi cortada recentemente. No pátio existem cabanas, uma trilha para a torre de vigia e outra para o lago.\n\nVocê escuta um barulho metálico vindo de uma das cabanas.",
    choices: [
      { reqItem: "Pé de Cabra", text: "Usar o Pé de Cabra para entrar na cabana principal", tag: "ITEM", action: () => goToScene("cabin_inside") },
      { text: "Entrar na cabana pela força", tag: "TESTE DE FORÇA", action: () => handleDiceTest({ target: 4, statusMsg: "FORÇANDO A PORTA...", onSuccess: () => goToScene("cabin_inside"), onFail: () => { takeDamage(3); recoverStamina(1); goToScene("arrival"); } }) },
      { text: "Seguir pela trilha até a torre de vigia", action: () => goToScene("watchtower_path") },
      { text: "Descer até o cais do lago", action: () => goToScene("lake_trail") }
    ]
  },

  cabin_inside: {
    chapter: "CAPÍTULO II",
    title: "O despertar",
    image: "img/cabin-inside.mp4",
    sting: "horror",
    text: "Dentro da cabana, tudo parece abandonado. Sobre uma prateleira há um Kit Médico. Então a porta dos fundos se rompe.\n\nUma figura enorme surge no vão: máscara de hóquei, roupa encharcada e um facão. Jason está diante de você.\n\nVocê tem poucos segundos para decidir.",
    choices: [
      { showIf: () => !hasItem("Kit Médico"), text: "Pegar o Kit Médico e correr", action: () => { if (addItem("Kit Médico")) goToScene("forest_chase"); } },
      { reqItem: "Lanterna", text: "Apontar a Lanterna e ganhar tempo para fugir", tag: "ITEM", action: () => { removeItem("Lanterna"); goToScene("forest_chase"); } },
      { text: "Subir para o sótão", action: () => goToScene("cabin_attic") },
      { text: "Tentar escapar pela porta da frente", tag: "TESTE DE AGILIDADE", action: () => handleDiceTest({ target: 4, statusMsg: "ESCAPANDO DA CABANA...", onSuccess: () => goToScene("forest_chase"), onFail: () => { takeDamage(3); goToScene("forest_chase"); } }) }
    ]
  },

  cabin_attic: {
    chapter: "CAPÍTULO II",
    title: "O sótão",
    image: "img/cabin_attic.png",
    sting: "piorCena",
    text: "Você se esconde no sótão. Caixas antigas ocupam o espaço. Uma delas contém um sinalizador de emergência.\n\nAs tábuas abaixo começam a ranger. Jason está subindo.",
    choices: [
      { showIf: () => !hasItem("Sinalizador"), text: "Abrir a caixa metálica", tag: "TESTE DE HABILIDADE", action: () => handleDiceTest({ target: 3, statusMsg: "ABRINDO O FECHO...", onSuccess: () => { addItem("Sinalizador"); goToScene("forest_chase"); }, onFail: () => { takeDamage(3); goToScene("forest_chase"); } }) },
      { text: "Saltar pela janela para a mata", tag: "TESTE DE AGILIDADE", action: () => handleDiceTest({ target: 4, statusMsg: "SALTANDO PELA JANELA...", onSuccess: () => goToScene("forest_chase"), onFail: () => { takeDamage(3); goToScene("forest_chase"); } }) }
    ]
  },

  forest_chase: {
    chapter: "CAPÍTULO III",
    title: "A perseguição",
    image: "img/forest-chase.mp4",
    sting: "piorCena",
    text: "Você atravessa a floresta sob a chuva. Os passos atrás de você não diminuem.\n\nÀ frente, três caminhos oferecem uma chance de fuga: a garagem, a torre de vigia e o cais.",
    choices: [
      { text: "Correr para a garagem", action: () => goToScene("garage_scene") },
      { text: "Subir até a torre de vigia", action: () => goToScene("watchtower_path") },
      { text: "Descer para o cais", action: () => goToScene("lake_trail") }
    ]
  },

  garage_scene: {
    chapter: "CAPÍTULO IV",
    title: "O galpão dos veículos",
    image: "img/garage.mp4",
    sting: "piorCena",
    text: () => hasItem("Chave da Pick-Up")
      ? "A Pick-Up de resgate ainda está na garagem. Você encontrou a chave no quadro da oficina.\n\nJason está cada vez mais perto. Agora basta ligar o veículo e fugir."
      : "A garagem está escura. Uma Pick-Up de resgate ainda parece utilizável, mas a chave não está no contato.\n\nJason se aproxima pelo corredor. Você precisa decidir se procura a chave ou tenta ligar o veículo por conta própria.",
    choices: [
      { reqItem: "Chave da Pick-Up", text: "Usar a chave e ligar a Pick-Up", tag: "ITEM", action: () => goToScene("ending_good_car") },
      { showIf: () => !hasItem("Chave da Pick-Up"), text: "Procurar a chave no quadro da oficina", tag: "TESTE DE SORTE", action: () => handleDiceTest({ target: 3, statusMsg: "PROCURANDO A CHAVE...", onSuccess: () => { if (addItem("Chave da Pick-Up")) goToScene("garage_scene"); else goToScene("garage_escape"); }, onFail: () => { useStamina(1); takeDamage(1); goToScene("garage_escape"); } }) },
      { showIf: () => !hasItem("Chave da Pick-Up"), text: "Tentar ligar a Pick-Up sem a chave", tag: "TESTE DE HABILIDADE", action: () => handleDiceTest({ target: 5, statusMsg: "TENTANDO DAR PARTIDA...", onSuccess: () => goToScene("ending_good_car"), onFail: () => { takeDamage(3); goToScene("garage_escape"); } }) }
    ]
  },

  garage_escape: {
    chapter: "CAPÍTULO IV",
    title: "Sem tempo para tentar de novo",
    image: "img/forest-chase.mp4",
    sting: "piorCena",
    text: "O barulho chamou atenção. Jason já está entrando na garagem. A Pick-Up não é mais uma opção segura, mas talvez dê pra voltar mais tarde.\n\nVocê corre por uma porta lateral e volta para a trilha.",
    choices: [
      { text: "Voltar e arriscar a garagem de novo", tag: "TESTE DE SORTE", action: () => handleDiceTest({ target: 4, statusMsg: "ESPERANDO UMA BRECHA...", onSuccess: () => goToScene("garage_scene"), onFail: () => { takeDamage(2); goToScene("watchtower_path"); } }) },
      { text: "Correr para a torre de vigia", action: () => goToScene("watchtower_path") },
      { text: "Correr para o lago", action: () => goToScene("lake_trail") }
    ]
  },

  watchtower_path: {
    chapter: "CAPÍTULO IV",
    title: "A torre de vigia",
    image: "img/watchtower.mp4",
    text: "No alto da torre existe um rádio de emergência. A energia está instável, mas a antena ainda aponta para a estrada estadual.\n\nUm sinalizador também poderia chamar atenção de quem estiver passando pela região.",
    choices: [
      { text: "Tentar transmitir um pedido de socorro", tag: "TESTE DE HABILIDADE", action: () => handleDiceTest({ target: 4, statusMsg: "BUSCANDO A FREQUÊNCIA...", onSuccess: () => goToScene("ending_heroic"), onFail: () => { takeDamage(2); goToScene("tower_escape"); } }) },
      { reqItem: "Sinalizador", text: "Disparar o sinalizador para a estrada", tag: "ITEM", action: () => { removeItem("Sinalizador"); goToScene("ending_heroic"); } },
      { text: "Descer para a garagem", action: () => goToScene("garage_scene") },
      { text: "Descer e procurar o lago", action: () => goToScene("lake_trail") }
    ]
  },

  tower_escape: {
    chapter: "CAPÍTULO IV",
    title: "A torre não é segura",
    image: "img/forest-chase.mp4",
    sting: "piorCena",
    text: "O rádio falha e um estrondo faz a torre tremer. Ficar aqui seria um erro.\n\nVocê desce antes que seja tarde demais.",
    choices: [
      { text: "Ir para o cais", action: () => goToScene("lake_trail") },
      { text: "Voltar para a garagem", action: () => goToScene("garage_escape") }
    ]
  },

  lake_trail: {
    chapter: "CAPÍTULO IV",
    title: "As águas de Crystal Lake",
    image: "img/lake.mp4",
    text: "O cais está escorregadio e a chuva transforma o lago em uma massa escura. Uma pequena lancha de manutenção está presa à margem.\n\nVocê ouve passos atrás de si. Não há muito tempo.",
    choices: [
      { text: "Tentar ligar o motor da lancha", tag: "TESTE DE AGILIDADE", action: () => handleDiceTest({ target: 4, statusMsg: "PUXANDO O MOTOR...", onSuccess: () => goToScene("ending_good_boat"), onFail: () => { takeDamage(3); goToScene("lake_escape"); } }) },
      { reqItem: "Sinalizador", text: "Usar o sinalizador para chamar ajuda", tag: "ITEM", action: () => { removeItem("Sinalizador"); goToScene("ending_heroic"); } },
      { text: "Correr para a garagem", action: () => goToScene("garage_scene") },
      { text: "Abandonar o cais e procurar a torre", action: () => goToScene("watchtower_path") }
    ]
  },

  lake_escape: {
    chapter: "CAPÍTULO IV",
    title: "O cais ficou para trás",
    image: "img/forest-chase.mp4",
    sting: "piorCena",
    text: "O motor não pegou. Você recua antes que alguém alcance o cais. A mata parece ser a única saída restante.",
    choices: [
      { text: "Subir até a torre de vigia", action: () => goToScene("watchtower_path") },
      { text: "Correr para a garagem", action: () => goToScene("garage_escape") }
    ]
  },

  /* ---------- FINAIS ---------- */
  ending_death: {
    chapter: "FIM DE JOGO",
    image: "img/ending_death.png",
    sting: "piorCena",
    title: "Crystal Lake venceu",
    text: "A perseguição termina na escuridão. Crystal Lake guarda mais um segredo, e sua história chega ao fim.\n\nVocê não sobreviveu desta vez — mas talvez outra escolha mude o resultado.",
    ending: true,
    choices: [{ text: "Tentar novamente", action: () => restartGame() }]
  },
  ending_good_car: {
    chapter: "FINAL",
    image: "img/ending_car.png",
    title: "Fuga pela rodovia",
    text: "A Pick-Up finalmente pega. Você atravessa os portões e acelera pela estrada, deixando Crystal Lake para trás.\n\nVocê sobreviveu.",
    ending: true,
    choices: [{ text: "Jogar novamente", action: () => restartGame() }]
  },
  ending_good_boat: {
    chapter: "FINAL",
    image: "img/ending-boat.mp4",
    title: "Além das águas",
    text: "O motor da lancha responde. Você cruza o lago e alcança a margem oposta antes que a perseguição possa continuar.\n\nVocê sobreviveu.",
    ending: true,
    choices: [{ text: "Jogar novamente", action: () => restartGame() }]
  },
  ending_heroic: {
    chapter: "FINAL",
    image: "img/ending_rescue.png",
    title: "Resgate estadual",
    text: "Seu pedido de socorro é ouvido. Sirenes aparecem na estrada e a equipe de resgate chega ao acampamento.\n\nVocê sobreviveu — e Crystal Lake terá de explicar o que aconteceu aqui.",
    ending: true,
    choices: [{ text: "Jogar novamente", action: () => restartGame() }]
  }
};


/* ================================================================
   9. NAVEGAÇÃO — goToScene e restartGame
   ================================================================ */

/**
 * Controla a visibilidade dos botões do HUD conforme a cena.
 *  - 🏠 Início   → SEMPRE visível
 *  - ⟲ Reiniciar → visível FORA do prólogo E FORA dos finais
 */
function updateHUDButtons(sceneKey, isEnding) {
  const isPrologue = sceneKey === "prologue";

  // 🏠 Início: sempre visível
  document.getElementById("home-button")?.classList.remove("hidden-restart");

  // ⟲ Reiniciar: escondido no prólogo e nas telas de final
  document.getElementById("restart-button")?.classList.toggle("hidden-restart", isPrologue || isEnding);
}

function goToScene(sceneKey) {
  const scene = scenes[sceneKey];
  if (!scene) return console.error("Cena não encontrada:", sceneKey);

  gameState.currentScene = sceneKey;
  gameState.visited.add(sceneKey);

  if (scene.ending) saveTrophy(sceneKey);
  if (scene.sting) AudioManager.play(scene.sting);

  /* Alterna botões do HUD: Início sempre visível, Reiniciar só durante o jogo */
  updateHUDButtons(sceneKey, Boolean(scene.ending));

  /* Pressão de perseguição: cada retorno a uma cena de loop de fuga
     aproxima Jason e causa dano automático crescente. */
  if (!scene.ending && CHASE_LOOP_SCENES.includes(sceneKey)) {
    gameState.chaseLoops++;
    if (gameState.chaseLoops > 1) {
      const pressureDamage = Math.min(1 + Math.floor(gameState.chaseLoops / 3), 3);
      takeDamage(pressureDamage);
      if (gameState.hp > 0) showMessage("Jason está cada vez mais perto...");
    }
  }

  /* Atualiza textos da cena */
  document.getElementById("chapter-badge").innerText = scene.chapter;
  document.getElementById("scene-title").innerText = scene.title;
  document.getElementById("scene-text").innerText =
    typeof scene.text === "function" ? scene.text() : scene.text;

  /* Atualiza mídia (imagem ou vídeo) */
  const img = document.getElementById("scene-image");
  const video = document.getElementById("scene-video");
  const placeholder = document.getElementById("image-placeholder");
  const isVideo = /\.(mp4|webm|mov)$/i.test(scene.image || "");

  video.pause();
  img.classList.add("hidden");
  video.classList.add("hidden");

  if (scene.image && isVideo) {
    video.style.opacity = "0";
    video.oncanplay = () => {
      video.classList.remove("hidden");
      placeholder.classList.add("hidden");
      video.play().catch(() => {});
      requestAnimationFrame(() => { video.style.opacity = "1"; });
    };
    video.onerror = () => { video.classList.add("hidden"); placeholder.classList.remove("hidden"); };
    video.src = scene.image;
    video.load();
  } else if (scene.image) {
    img.style.opacity = "0";
    img.onload = () => {
      img.classList.remove("hidden");
      placeholder.classList.add("hidden");
      img.style.animation = "none";
      void img.offsetWidth;
      img.style.animation = "";
      requestAnimationFrame(() => { img.style.opacity = "1"; });
    };
    img.onerror = () => { img.classList.add("hidden"); placeholder.classList.remove("hidden"); };
    img.src = scene.image;
    img.alt = scene.title;
  } else {
    placeholder.classList.remove("hidden");
  }

  /* Monta os botões de escolha */
  const container = document.getElementById("choices-container");
  container.innerHTML = "";

  scene.choices
    ?.filter(choice => !choice.showIf || choice.showIf())
    .forEach((choice, index) => {
      const btn = document.createElement("button");
      btn.className = "btn-choice";

      const disabled = Boolean(choice.reqItem && !hasItem(choice.reqItem));
      btn.disabled = disabled;

      let tag = "";
      if (choice.reqItem) {
        tag = `<span class="btn-tag ${disabled ? "btn-tag-disabled" : "btn-tag-item"}">${disabled ? `REQUER: ${choice.reqItem}` : `USAR: ${choice.reqItem}`}</span>`;
      } else if (choice.tag) {
        tag = `<span class="btn-tag">${choice.tag}</span>`;
      }

      btn.innerHTML = `<span class="choice-number">${index + 1}</span><span class="choice-content">${choice.text}</span>${tag}`;

      btn.onclick = () => {
        if (gameState.isRolling) return;
        hideMessage();
        gameState.decisions++;
        updateHUD();
        AudioManager.play("click");
        choice.action?.();
      };

      container.appendChild(btn);
    });

  document.getElementById("narrative-box").scrollTop = 0;
  updateHUD();
}

function restartGame() {
  gameState.hp = gameState.maxHp;
  gameState.stamina = gameState.maxStamina;
  gameState.inventory = [];
  gameState.decisions = 0;
  gameState.isRolling = false;
  gameState.visited.clear();
  gameState.chaseLoops = 0;
  hideMessage();
  goToScene("prologue");
}


/* ================================================================
   10. INICIALIZAÇÃO & EVENTOS
   ================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  AudioManager.applyMuteState();

  /* Inicia a música após a primeira interação do usuário (política dos navegadores) */
  const startInteraction = () => {
    AudioManager.startBgm();
    document.removeEventListener("click", startInteraction);
    document.removeEventListener("keydown", startInteraction);
  };
  document.addEventListener("click", startInteraction, { once: true });
  document.addEventListener("keydown", startInteraction, { once: true });

  /* Botão de som */
  document.getElementById("sound-toggle")?.addEventListener("click", () => AudioManager.toggleMute());

  /* Botão de reiniciar */
  document.getElementById("restart-button")?.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja recomeçar sua jornada em Crystal Lake? Seu progresso atual será perdido.")) {
      restartGame();
    }
  });

  /* Botão de início (volta à tela principal do site) */
  document.getElementById("home-button")?.addEventListener("click", () => {
    window.location.href = "https://fecarte-2026.vercel.app/";
  });

  /* Modal de troféus */
  const trophyModal = document.getElementById("trophy-modal");
  document.getElementById("trophy-button")?.addEventListener("click", () => {
    updateTrophyUI();
    trophyModal.classList.remove("hidden");
  });
  document.getElementById("close-trophy")?.addEventListener("click", () => trophyModal.classList.add("hidden"));
  trophyModal?.addEventListener("click", e => {
    if (e.target === trophyModal) trophyModal.classList.add("hidden");
  });

  updateTrophyUI();
  restartGame();
});
