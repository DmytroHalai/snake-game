const canvas = document.getElementById("game");
const space = canvas.getContext("2d");
const box = 32;
let score = 0;
let highScore= sessionStorage.getItem('high-score');
let snake = [];
let game;
let historyText = document.getElementById("historyInfo");
let dir;
let time = sessionStorage.getItem('time');
const snakeSpan = 15 * box;
const scoreCord = {
    x: box * 2.4,
    y: box * 1.5
}

const highScoreCord = {
    x: box * 13,
    y: box * 1.5
}

const ground = new Image();
ground.src = "img/ground.png";
const foodImage = new Image();
foodImage.src = "img/dota.png";
const snakeHead = new Image();
snakeHead.src = "img/pudge.jpg"
const body = new Image();
body.src = "img/body.jpg"

const randomCord = () => {
    return Math.floor(Math.random() * 15 + 3) * box
};

let food = {
  x: randomCord(),
  y: randomCord()
};

const foodCord = (food) => {
    food.x = randomCord();
    food.y = randomCord();
};

snake[0] = {
    x: snakeSpan,
    y: snakeSpan
};

const reload = () => {
    clearInterval(game);
    location.reload();
};

const lowSpeed = () => {
    clearInterval(game);
    timeCheck(200);
    game = setInterval(initGame, time);
}

const highSpeed = () => {
    clearInterval(game);
    timeCheck(70);
    game = setInterval(initGame, time);
}

const mediumSpeed = () => {
    clearInterval(game);
    timeCheck(100);
    game = setInterval(initGame, time);
}

document.addEventListener("keydown", direction)
function direction (event) {
    if (event.keyCode === 37 && dir !== "right"){
        dir = "left"
    } else if (event.keyCode === 38 && dir !== "down"){
        dir = "up"
    } else if (event.keyCode === 39 && dir !== "left"){
        dir = "right"
    } else if (event.keyCode === 40 && dir !== "up"){
        dir = "down"
    }
}

document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        reload();
    }
});

historyText.innerText = localStorage.getItem("historyText") || "No history yet";

const history = () => {
    const historyString = `Your last try: ${score}`;
    historyText.innerText = historyString;
    localStorage.setItem("historyText", historyString);
};

const gameOver = (head, arr) => {
    for (let i = 0; i < snake.length; i++){
        if (head.x === arr[i].x && head.y === arr[i].y) return true;
    }
};

const handleGameOver = () => {
    history();
    clearInterval(game);
    alert(`  You have lost😢\n  Try again😊\n  Your best score is ${highScore}!`);
    reload();
};

const validation = (food, snake) => {
    for (let i = 0; i < snake.length; i++){
        if (food.x === snake[i].x || food.y === snake[i].y) {
            foodCord(food);
            validation(food, snake);
        }
    }
};

const timeCheck = (num) => {
    sessionStorage.setItem('time', time = time === undefined || time === null ? 100 : num);
}

function initGame() {
    space.drawImage(ground, 0, 0);
    space.drawImage(foodImage, food.x, food.y);
    space.drawImage(snakeHead, snake[0].x, snake[0].y);
    timeCheck(time);

    for (let i = 1; i < snake.length; i++){
        space.drawImage(body, snake[i].x, snake[i].y);
    }
    space.fillStyle = "white";
    space.font = "25px Comic Sans MS";

    space.fillText(`Score: ${score}`, scoreCord.x, scoreCord.y);

    sessionStorage.setItem('high-score', highScore = score > highScore ? score : highScore);
    space.fillText(`High Score: ${highScore}`, highScoreCord.x, highScoreCord.y)

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;


    if(snakeX === food.x && snakeY === food.y){
        score++;
        foodCord(food);
        validation(food, snake);
    } else snake.pop();

    if(snakeX < box || snakeX > box * 17 || snakeY < 3 * box || snakeY > box * 17) handleGameOver();

    if (dir === "left") snakeX -= box;
    if (dir === "right") snakeX += box;
    if (dir === "up") snakeY -= box;
    if (dir === "down") snakeY += box;

    let head = {
        x: snakeX,
        y: snakeY
    };

    if (gameOver(head, snake)) handleGameOver();

    snake.unshift(head);
}

game = setInterval(initGame, 100);