/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// screen properties
const WIDTH = 640, HALF_WIDTH = WIDTH / 2;
const HEIGHT = 400, HALF_HEIGHT = HEIGHT / 2;

// fps information
const FPS = 30;
const interval = Math.floor(1000 / FPS);

// map properties
const MAP_SIZE = 16;
const MAP_SCALE = 10;
const MAP_RANGE = MAP_SCALE * MAP_SIZE;
const MAP_SPEED =  (MAP_SCALE / 2) / 5;
var map = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];
var mapOffsetX;
var mapOffsetY;

// player properties
var playerX = MAP_SCALE + 20;
var playerY = MAP_SCALE + 20;
var playerMapX, playerMapY;
var playerAngle = Math.PI / 3;
var playerMoveX = 0, playerMoveY = 0;
var playerMoveAngle = 0;
var playerOffsetX, playerOffsetY;

// handle user input
window.addEventListener("keydown", e => {
    switch(e.key) {
        case "w":
            playerMoveX = playerMoveY = 1;
            break;
        case "s":
            playerMoveX = playerMoveY = -1;
            break;
        case "a":
            playerMoveAngle = -1;
            break;
        case "d":
            playerMoveAngle = 1;
            break;
    }
})

window.addEventListener("keyup", e => {
    switch(e.key) {
        case "w":
            playerMoveX = playerMoveY = 0;
            break;
        case "s":
            playerMoveX = playerMoveY = 0;
            break;
        case "a":
            playerMoveAngle = 0;
            break;
        case "d":
            playerMoveAngle = 0;
            break;
    }
})

// camera properties
const DOUBLE_PI = Math.PI * 2;
const FOV = Math.PI / 3;
const HALF_FOV = FOV / 2;
const STEP_ANGLE = FOV / WIDTH;

// main update loop
function updateLoop() {
    drawCanvas();
    updatePlayerPosition();
    drawMap();
    drawPlayer();
    raycast();

    // update each interval
    setTimeout(updateLoop, interval);
}
window.onload = () => { updateLoop(); }

function drawCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(canvas.width / 2 - HALF_WIDTH, canvas.height / 2 - HALF_HEIGHT, WIDTH, HEIGHT);
}

function drawMap() {
    mapOffsetX = Math.floor(canvas.width / 2 - MAP_RANGE / 2);
    mapOffsetY = Math.floor(canvas.height / 2 - MAP_RANGE / 2);

    for(row = 0; row < MAP_SIZE; row++) {
        for(col = 0; col < MAP_SIZE; col++) {
            var sqaure = row * MAP_SIZE + col;
            if(map[sqaure] == 1) {
                ctx.fillStyle = "grey";

            }
            else {
                ctx.fillStyle = "#afa";
                
            }
            ctx.fillRect(mapOffsetX + col * MAP_SCALE, mapOffsetY + row * MAP_SCALE, MAP_SCALE, MAP_SCALE);
        }
    }
}

function updatePlayerPosition() {
    playerOffsetX = Math.sin(playerAngle) * MAP_SPEED;
    playerOffsetY = Math.cos(playerAngle) * MAP_SPEED;

    // checking colision: (making the "2d" array "1d")
    var mapTargetX = Math.floor(playerY / MAP_SCALE) * MAP_SIZE + Math.floor((playerX + playerOffsetX) / MAP_SCALE);
    var mapTargetY = Math.floor((playerY + playerOffsetY * playerMoveY) / MAP_SCALE) * MAP_SIZE + Math.floor(playerX / MAP_SCALE);

    if(playerMoveX != 0 && map[mapTargetX] == 0) { playerX += playerOffsetX * playerMoveX }
    if(playerMoveY != 0 && map[mapTargetY] == 0) { playerY += playerOffsetY * playerMoveY }
    if(playerMoveAngle != 0) { playerAngle += -playerMoveAngle * 0.1 }
}

function drawPlayer() {
    // draw the player
    playerMapX = playerX + mapOffsetX;
    playerMapY = playerY + mapOffsetY;
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(playerMapX, playerMapY, 3, 0, 2 * DOUBLE_PI);
}

// I basically don't actually know how this works
function raycast() {
    var currentAngle = playerAngle + HALF_FOV;
    var rayStartX = Math.floor(playerX / MAP_SCALE) * MAP_SCALE;
    var rayStartY = Math.floor(playerY / MAP_SCALE) * MAP_SCALE;

    for(var ray = 0; ray < WIDTH; ray++) {
        var currentSin = Math.sin(currentAngle); currentSin = currentSin ? currentSin : 0.000001;
        var currentCos = Math.cos(currentAngle); currentCos = currentCos ? currentCos : 0.000001;


        // intersecting vertical lines
        var rayEndX, rayEndY, rayDirectionX, verticalDepth;
        if(currentSin > 0) { rayEndX = rayStartX + MAP_SCALE; rayDirectionX = 1; }
        else { rayEndX = rayStartX; rayDirectionX = -1 }

        for(var offset = 0; offset < MAP_RANGE; offset += MAP_SCALE) {
            verticalDepth = (rayEndX - playerX) / currentSin;
            rayEndY = playerY + verticalDepth * currentCos;
            var mapTargetX = Math.floor(rayEndX / MAP_SCALE);
            var mapTargetY = Math.floor(rayEndY / MAP_SCALE);
            if(currentSin <= 0) mapTargetX += rayDirectionX;
            var targetSquare = mapTargetY * MAP_SIZE + mapTargetX;
            if(targetSquare < 0 || targetSquare > map.length - 1) break;
            if(map[targetSquare] != 0) break;
            rayEndX += rayDirectionX * MAP_SCALE;
        }
        var tempX = rayEndX, tempY = rayEndY;

        // intersecting horizontal lines
        var rayEndY, rayEndX, rayDirectionY, horizontalDepth;
        if(currentCos > 0) { rayEndY = rayStartY + MAP_SCALE; rayDirectionY = 1; }
        else { rayEndY = rayStartY; rayDirectionY = -1 }

        for(var offset = 0; offset < MAP_RANGE; offset += MAP_SCALE) {
            horizontalDepth = (rayEndY - playerY) / currentCos;
            rayEndX = playerX + horizontalDepth * currentSin;
            var mapTargetX = Math.floor(rayEndX / MAP_SCALE);
            var mapTargetY = Math.floor(rayEndY / MAP_SCALE);
            if(currentCos <= 0) mapTargetY += rayDirectionY;
            var targetSquare = mapTargetY * MAP_SIZE + mapTargetX;
            if(targetSquare < 0 || targetSquare > map.length - 1) break;
            if(map[targetSquare] != 0) break;
            rayEndY += rayDirectionY * MAP_SCALE;
        }

        var endX = verticalDepth < horizontalDepth ? tempX : rayEndX;
        var endY = verticalDepth < horizontalDepth ? tempY : rayEndY;

        /* draw ray
        ctx.fill();
        ctx.strokeStyle = "lime";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(playerMapX, playerMapY);
        ctx.lineTo(endX + mapOffsetX, endY + mapOffsetY);
        ctx.stroke(); */

        // Render 3D projection



        currentAngle -= STEP_ANGLE;
    }
}