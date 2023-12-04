const canvas = document.getElementById("game");
const space = canvas.getContext("2d");
let box = 32;
let score = 0;
let highScore= sessionStorage.getItem('high-score');
let snake = [];
let game;
let dir;
let time = 200;

const ground = new Image();
ground.src = "img/ground.png";

const foodImage = new Image();
foodImage.src = "img/dota.png";

const snakeHead = new Image();
snakeHead.src = "img/pudge.jpg"

const body = new Image();
body.src = "img/body.jpg"

const randomCoord = () => {
    return Math.floor(Math.random() * 15 + 3) * box
};

let food = {
  x: randomCoord(),
  y: randomCoord()
};

const foodCoord = (food) => {
    food.x = randomCoord();
    food.y = randomCoord();
};

snake[0] = {
    x: 15 * box,
    y: 15 * box
};

document.addEventListener("keydown", direction);

function direction(event){
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
const gameOver = (head, arr) => {
    for (let i = 0; i < snake.length; i++){
        if (head.x === arr[i].x && head.y === arr[i].y) return true;
    }
};

const handleGameOver = () => {
    clearInterval(game);
    alert('Game Over! Press OK to try again...');
    location.reload();
};

const validation = (food, snake) => {
    for (let i = 0; i < snake.length; i++){
        if (food.x === snake[i].x || food.y === snake[i].y) {
            foodCoord(food);
            validation(food, snake);
        }
    }
}

function initGame() {
    space.drawImage(ground, 0, 0);
    space.drawImage(foodImage, food.x, food.y);
    space.drawImage(snakeHead, snake[0].x, snake[0].y);

    for (let i = 1; i < snake.length; i++){
        space.drawImage(body, snake[i].x, snake[i].y);
    }
    space.fillStyle = "white";
    space.font = "25px Comic Sans MS";

    space.fillText(`Score: ${score}`, box * 2.4, box * 1.5);

    sessionStorage.setItem('high-score', highScore = score > highScore ? score : highScore);
    space.fillText(`High Score: ${highScore}`, box * 13, box * 1.5)

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;


    if(snakeX === food.x && snakeY === food.y){
        score++;
        time -= 5;
        clearInterval(game);
        game = setInterval(initGame, time);
        foodCoord(food);
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

game = setInterval(initGame, time);