const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const feedback = document.getElementById('feedback');
const levelDescription = document.getElementById('level-description');
const hintBox = document.getElementById('hint');
const player = document.getElementById('player');
const map = document.querySelector('.map');
const scoreDisplay = document.getElementById('score');

const coinSound = document.getElementById('coin-sound');
const winSound = document.getElementById('win-sound');

let score = 0;
let currentLevelIndex = 0;

const levels = [
  {
    description: "Nível 1: Crie uma lista com 3 itens usando <ul> e <li>.",
    hint: "Use <ul> como container e <li> para cada item.",
    validator: html => {
      const ul = html.match(/<ul>[\s\S]*<\/ul>/);
      const li = html.match(/<li>.*<\/li>/g);
      return ul && li && li.length === 3;
    },
    starter: "<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ul>"
  },
  {
    description: "Nível 2: Adicione um link para https://www.google.com usando <a>.",
    hint: "A tag <a> precisa do atributo href com o link.",
    validator: html => /<a\s+href=["']https:\/\/www\.google\.com["'].*>.*<\/a>/.test(html),
    starter: "<a href=\"https://www.google.com\">Clique aqui</a>"
  },
  {
    description: "Nível 3: Insira uma imagem usando <img> (src https://via.placeholder.com/150).",
    hint: "Não esqueça o atributo alt.",
    validator: html => /<img\s+src=["']https:\/\/via\.placeholder\.com\/150["'].*>/.test(html),
    starter: "<img src=\"https://via.placeholder.com/150\" alt=\"Placeholder\">"
  },
  {
    description: "Nível 4: Crie um cabeçalho <h1> com o texto 'Bem-vindo!'.",
    hint: "A tag <h1> é para títulos principais.",
    validator: html => /<h1>.*Bem-vindo.*<\/h1>/.test(html),
    starter: "<h1>Bem-vindo!</h1>"
  },
  {
    description: "Nível 5: Crie um parágrafo <p> com algum texto.",
    hint: "Use <p> para parágrafos de texto.",
    validator: html => /<p>.+<\/p>/.test(html),
    starter: "<p>Este é um parágrafo de exemplo.</p>"
  },
  {
    description: "Nível 6: Crie um botão <button> com o texto 'Enviar'.",
    hint: "Use <button> e coloque o texto dentro.",
    validator: html => /<button>.*Enviar.*<\/button>/.test(html),
    starter: "<button>Enviar</button>"
  },
  {
    description: "Nível 7: Crie um input de texto <input> com placeholder 'Digite seu nome'.",
    hint: "Use o atributo placeholder.",
    validator: html => /<input\s+[^>]*placeholder=["']Digite seu nome["']/.test(html),
    starter: "<input type=\"text\" placeholder=\"Digite seu nome\">"
  },
  {
    description: "Nível 8: Crie um formulário <form> com um input e um botão.",
    hint: "O input e o botão devem estar dentro do <form>.",
    validator: html => /<form>[\s\S]*<input[\s\S]*>[\s\S]*<button[\s\S]*>[\s\S]*<\/form>/.test(html),
    starter: "<form>\n  <input type=\"text\" placeholder=\"Nome\">\n  <button>Enviar</button>\n</form>"
  },
  {
    description: "Nível 9: Crie uma lista ordenada <ol> com 3 itens.",
    hint: "Use <ol> como container e <li> para cada item.",
    validator: html => {
      const ol = html.match(/<ol>[\s\S]*<\/ol>/);
      const li = html.match(/<li>.*<\/li>/g);
      return ol && li && li.length === 3;
    },
    starter: "<ol>\n  <li>Primeiro</li>\n  <li>Segundo</li>\n  <li>Terceiro</li>\n</ol>"
  },
  {
    description: "Nível 10: Crie uma estrutura básica com <header>, <main> e <footer>.",
    hint: "Coloque algum texto dentro de cada tag.",
    validator: html => /<header>[\s\S]*<\/header>/.test(html) &&
                        /<main>[\s\S]*<\/main>/.test(html) &&
                        /<footer>[\s\S]*<\/footer>/.test(html),
    starter: "<header>Cabeçalho</header>\n<main>Conteúdo principal</main>\n<footer>Rodapé</footer>"
  }
];

function spawnCoinsAndObstacles() {
  map.querySelectorAll('.coin, .obstacle').forEach(el => el.remove());

  // Moedas aleatórias
  for(let i=0;i<3;i++){
    const coin = document.createElement('div');
    coin.className='coin';
    coin.textContent='💰';
    coin.style.left=`${Math.random()*(map.offsetWidth-30)}px`;
    coin.style.bottom=`${Math.random()*(map.offsetHeight-30)}px`;
    map.appendChild(coin);
  }

  // Obstáculos aleatórios
  for(let i=0;i<2;i++){
    const obs = document.createElement('div');
    obs.className='obstacle';
    obs.style.left=`${Math.random()*(map.offsetWidth-40)}px`;
    obs.style.bottom=`${Math.random()*(map.offsetHeight-40)}px`;
    map.appendChild(obs);
  }
}

function collectCoins() {
  map.querySelectorAll('.coin').forEach(coin => {
    const coinRect = coin.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    if(!(coinRect.right<playerRect.left || coinRect.left>playerRect.right ||
        coinRect.bottom<playerRect.top || coinRect.top>playerRect.bottom)){
      coin.remove();
      score += 10;
      scoreDisplay.textContent = `💰 ${score}`;
      coinSound.play();
    }
  });
}

function movePlayer() {
  const mapWidth = map.offsetWidth;
  const step = mapWidth / (levels.length + 1);
  player.style.left = `${(currentLevelIndex + 1) * step}px`;

  collectCoins();
}

function loadLevel(index) {
  const level = levels[index];
  levelDescription.textContent = level.description;
  editor.value = level.starter;
  preview.srcdoc = level.starter;
  feedback.textContent = "";
  hintBox.textContent = "💡 Dica: " + level.hint;
  player.style.left="10px";
  spawnCoinsAndObstacles();
}

editor.addEventListener('input',()=>{
  const code = editor.value;
  preview.srcdoc=code;
  const level = levels[currentLevelIndex];
  if(level.validator(code)){
    feedback.textContent="✅ Nível completado!";
    movePlayer();
    setTimeout(()=>{
      currentLevelIndex++;
      if(currentLevelIndex<levels.length){
        loadLevel(currentLevelIndex);
      }else{
        levelDescription.textContent="🎉 Parabéns! Você completou todos os níveis!";
        feedback.textContent="";
        hintBox.textContent="";
        editor.disabled=true;
        winSound.play();
      }
    },1000);
  }else{
    feedback.textContent="❌ Ainda não está correto. Tente novamente!";
  }
});

// Inicializa o jogo
loadLevel(currentLevelIndex);
scoreDisplay.textContent=`💰 ${score}`;
