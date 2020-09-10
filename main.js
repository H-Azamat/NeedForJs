const score = document.querySelector('.score'),
    bestScore = document.querySelector('.best-score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div'),
    easy = document.getElementById('easy'),
    normal = document.getElementById('normal'),
    hard = document.getElementById('hard'),
    complexity = document.querySelector('.complexity'),
    gameAudio = document.querySelector('.game-audio'),
    gameOverAudio = document.querySelector('.gameOver-audio'),
    winAudio = document.querySelector('.win-audio');

car.classList.add('car');

let bestRecord = localStorage.getItem('record') || 0;
let activeWin = false;

const enemyType = [
    './image/enemy.png',
    './image/enemy2.png',
    './image/enemy3.png',
    './image/enemy4.png'
]

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
}

const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 4
}

const getQuantityElements = heightElement => {
    return document.documentElement.clientHeight / heightElement + 1;
}

const startGame = (complexitySpeed) => {
    complexity.classList.add('hide');
    setting.speed = complexitySpeed;
    console.log('setting.speed: ', setting.speed);
    gameAudio.volume = 0.5;
    gameAudio.play();

    bestScore.textContent = `Ваш рекорд: ${bestRecord}`;

    for(let i = 0; i < getQuantityElements(100); i++){
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i*100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    for(let i = 0; i < getQuantityElements(100 * setting.traffic); i++){
        const enemy = document.createElement('div');
        let enemyImg = enemyType[Math.floor(Math.random()*enemyType.length)];
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url(${enemyImg}) no-repeat center / cover`;
        gameArea.appendChild(enemy);
    }

    setting.start = true;
    gameArea.appendChild(car);
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
};

const playGame = () => {
    if (setting.start) {
        setting.score += setting.speed; 
        score.textContent = setting.score + 'очков';

        if(setting.score > bestRecord && !activeWin){
            winAudio.play();
            activeWin = true;
        }
        moveRoad();
        moveEnemy();
        if(keys.ArrowLeft && setting.x > 0) setting.x -= setting.speed;
        if(keys.ArrowRight && setting.x < gameArea.offsetWidth - car.offsetWidth) setting.x += setting.speed;
        if(keys.ArrowDown && setting.y < gameArea.offsetHeight - car.offsetHeight) setting.y += setting.speed;
        if(keys.ArrowUp && setting.y > 0) setting.y -= setting.speed;
        
        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';

        requestAnimationFrame(playGame);
    }
}

const startRun = (event) => {
    event.preventDefault();
    keys[event.key] = true;
};

const stopRun = (event) => {
    event.preventDefault();
    keys[event.key] = false;
};

const moveRoad = () => {
    let lines = document.querySelectorAll('.line');
    
    lines.forEach(line => {
        line.y += setting.speed;
        line.style.top = line.y + 'px';
        
        if(line.y > document.documentElement.clientHeight){
            line.y = -100;
        }
    })
}   

const moveEnemy = () => {
    let enemy = document.querySelectorAll('.enemy');
    
    enemy.forEach(item => {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if(carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top){
            setting.start = false;
            if (setting.score > bestRecord) localStorage.setItem('record', setting.score);
            gameAudio.pause();
            gameOverAudio.play();

            if(setting.score > bestRecord) alert('Поздравляем, у вас новый рекорд!');

            setTimeout(() => {location.reload()}, 2000)
        }

        item.y += setting.speed / 1.5;
        item.style.top = item.y + 'px';
        
        if(item.y >= document.documentElement.clientHeight){
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
            let enemyImg = enemyType[Math.floor(Math.random()*enemyType.length)];
            item.style.background = `transparent url(${enemyImg}) no-repeat center / cover`;
        }
    })
}   

const selectComplexity = () => {
    start.classList.add('hide');
    complexity.classList.remove('hide');
}

start.addEventListener('click', selectComplexity);

easy.addEventListener('click', () => {startGame(3)});
normal.addEventListener('click', () => {startGame(5)});
hard.addEventListener('click', () => {startGame(8)});

document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);