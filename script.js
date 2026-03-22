const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const feedback = document.getElementById('feedback');
const levelDescription = document.getElementById('level-description');
const hintBox = document.getElementById('hint');
const player = document.getElementById('player');
const progressBar = document.getElementById('progress-bar');
const scoreDisplay = document.getElementById('score');
const xpDisplay = document.getElementById('xp');
const levelDisplay = document.getElementById('level');

const winSound = document.getElementById('win-sound');

let score = 0;
let xp = 0;
let currentLevelIndex = 0;
let levelCompleted = false;

const levels = [
  {description:"Crie uma lista com 3 itens usando <ul> e <li>.", hint:"Use <ul> e 3 <li>.", validator: html => /<ul>[\s\S]*<\/ul>/.test(html) && (html.match(/<li>/g)||[]).length===3, starter:""},
  {description:"Crie um link para Google.", hint:"Use <a href='https://www.google.com'>", validator: html => /<a\s+href=["']https:\/\/www\.google\.com["'].*>.*<\/a>/.test(html), starter:""},
  {description:"Adicione uma imagem.", hint:"Use <img src='https://via.placeholder.com/150'>", validator: html => /<img\s+src=["']https:\/\/via\.placeholder\.com\/150["']/.test(html), starter:""},
  {description:"Crie um <h1> com 'Bem-vindo!'", hint:"Use <h1>", validator: html => /<h1>.*Bem-vindo.*<\/h1>/.test(html), starter:""},
  {description:"Crie um parágrafo.", hint:"Use <p>", validator: html => /<p>.+<\/p>/.test(html), starter:""},
  {description:"Crie um botão <button> com o texto 'Enviar'.", hint:"Use <button>Enviar</button>", validator: html => /<button>.*Enviar.*<\/button>/.test(html), starter:""},
  {description:"Crie um input com placeholder 'Digite seu nome'.", hint:"Use <input placeholder='Digite seu nome'>", validator: html => /<input\s+[^>]*placeholder=["']Digite seu nome["']/.test(html), starter:""},
  {description:"Crie um formulário com input e botão.", hint:"O input e botão devem estar dentro do <form>", validator: html => /<form>[\s\S]*<input[\s\S]*>[\s\S]*<button[\s\S]*>[\s\S]*<\/form>/.test(html), starter:""},
  {description:"Crie uma lista ordenada <ol> com 3 itens.", hint:"Use <ol> e 3 <li>", validator: html => /<ol>[\s\S]*<\/ol>/.test(html) && (html.match(/<li>/g)||[]).length===3, starter:""},
  {description:"Crie <header>, <main> e <footer>.", hint:"Coloque algum texto dentro de cada tag", validator: html => /<header>[\s\S]*<\/header>/.test(html) && /<main>[\s\S]*<\/main>/.test(html) && /<footer>[\s\S]*<\/footer>/.test(html), starter:""}
];

function movePlayer(){
  const mapHeight = 400;
  const step = mapHeight / (levels.length);
  const newY = mapHeight - (currentLevelIndex + 1) * step;
  player.style.transform = `translateY(${newY}px)`;
  progressBar.style.height = `${((currentLevelIndex + 1)/levels.length)*100}%`;
}

function loadLevel(index){
  const level = levels[index];
  levelCompleted = false;
  levelDescription.textContent = level.description;
  hintBox.textContent = "💡 "+level.hint;
  feedback.textContent = "";
  editor.value = level.starter;
  preview.srcdoc = level.starter;
  movePlayer();
  levelDisplay.textContent = `Fase ${index+1}`;
}

function checkCode(){
  if(levelCompleted) return;
  const code = editor.value;
  preview.srcdoc = code;
  const level = levels[currentLevelIndex];
  if(level.validator(code)){
    levelCompleted = true;
    feedback.textContent = "✅ Nível completado!";
    feedback.style.color = "#00ff9c";
    score += 10;
    xp += 5;
    scoreDisplay.textContent = `💰 ${score}`;
    xpDisplay.textContent = `⭐ ${xp}`;

    setTimeout(()=>{
      currentLevelIndex++;
      if(currentLevelIndex < levels.length){
        loadLevel(currentLevelIndex);
      }else{
        levelDescription.textContent = "🎉 Parabéns! Você completou todos os níveis!";
        feedback.textContent = "";
        hintBox.textContent = "";
        editor.disabled = true;
        winSound.play();
      }
    },800);
  }else{
    feedback.textContent = "❌ Ainda não está correto.";
    feedback.style.color = "#ff4d4d";
  }
}

editor.addEventListener('input', ()=>{ setTimeout(checkCode, 300); });
function runCode(){ checkCode(); }

loadLevel(currentLevelIndex);
scoreDisplay.textContent = `💰 ${score}`;
xpDisplay.textContent = `⭐ ${xp}`;