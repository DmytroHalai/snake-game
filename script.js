const canvas = document.getElementById("game");
const space = canvas.getContext("2d");
const box = 32;
let score = 0;
let highScore= localStorage.getItem('high-score');
let snake = [];
let game;
let historyText = document.getElementById("historyInfo");
let dir;
let time = localStorage.getItem('time') || 100;
const snakeSpan = 15 * box;
let music = document.getElementById("music");
const audio = document.getElementById("audio");
const scoreCord = {
    x: box * 2.4,
    y: box * 1.5
};

const highScoreCord = {
    x: box * 13,
    y: box * 1.5
};

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
}; // food cords initialization

const foodCord = (food) => {
    food.x = randomCord();
    food.y = randomCord();
}; // food cords spawn

snake[0] = {
    x: snakeSpan,
    y: snakeSpan
}; // snake cords initialization

const reload = () => {
    clearInterval(game);
    location.reload();
}; // game reload

const played = () => {
    music.play();
}; // background music control

const paused = () => {
    music.pause();
}; // background music control

const speedChange = (num) => {
    clearInterval(game);
    timeCheck(num);
    game = setInterval(initGame, time);
}; // changes speed

const lowSpeed = () => speedChange(200);

const highSpeed = () => speedChange(70);

const mediumSpeed = () => speedChange(100);

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
} // listens events to detect the direction

document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        reload();
    }
}); // reloads game if 'enter' clicked

historyText.innerText = localStorage.getItem("historyText") || "No history yet";

const history = () => {
    const historyString = `Your last try: ${score}`;
    historyText.innerText = historyString;
    localStorage.setItem("historyText", historyString);
}; // sets new history in the storage

const gameOver = (head, arr) => {
    for (let i = 0; i < snake.length; i++){
        if (head.x === arr[i].x && head.y === arr[i].y) return true;
    }
}; // returns true if snake's head attacked snake's tail (or body)

const handleGameOver = () => {
    history();
    clearInterval(game);
    alert(`  You have lost😢\n  Try again😊\n  Your best score is ${highScore}!`);
    reload();
}; // alerts positive text when the game is over

const validation = (food, snake) => {
    for (let i = 0; i < snake.length; i++){
        if (food.x === snake[i].x || food.y === snake[i].y) {
            foodCord(food);
            validation(food, snake);
        }
    }
}; // checks if food cords are spawned not under snake's body

const timeCheck = (num) => {
    localStorage.setItem('time', time = time === null ? 100 : num);
}; // checks time speed (needed only when the game starts at the first time)

function initGame() {
    music.volume = 0.1;
    audio.volume = 0.3;
    space.drawImage(ground, 0, 0);
    space.drawImage(foodImage, food.x, food.y);
    space.drawImage(snakeHead, snake[0].x, snake[0].y);
    timeCheck(time);

    for (let i = 1; i < snake.length; i++){
        space.drawImage(body, snake[i].x, snake[i].y);
    } // draws snake
    space.fillStyle = "white";
    space.font = "25px Comic Sans MS";

    space.fillText(`Score: ${score}`, scoreCord.x, scoreCord.y);

    localStorage.setItem('high-score', highScore = highScore === null ? score : score > highScore ? score : highScore);
    space.fillText(`High Score: ${highScore}`, highScoreCord.x, highScoreCord.y)

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;


    if(snakeX === food.x && snakeY === food.y){
        audio.play();
        score++;
        foodCord(food);
        validation(food, snake); // adds score and spawn new food when snake eats food
    } else snake.pop(); // moves snake

    if(snakeX < box || snakeX > box * 17 || snakeY < 3 * box || snakeY > box * 17) handleGameOver();
    // stops game when snake's head attacked 'wall'

    if (dir === "left") snakeX -= box;
    if (dir === "right") snakeX += box;
    if (dir === "up") snakeY -= box;
    if (dir === "down") snakeY += box;

    let head = {
        x: snakeX,
        y: snakeY
    };

    if (gameOver(head, snake)) handleGameOver(); // stops game if function gameOver() returns true

    snake.unshift(head); // moves snake
} // game controls

game = setInterval(initGame, time); // game initialization