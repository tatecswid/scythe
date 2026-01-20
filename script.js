/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");


// FPS
let FPS = 30;
let interval = 1000 / FPS;

// map properties
const MAP_WIDTH = 16;
const MAP_HEIGHT = 16;
const SCREEN_WIDTH = 300;
const SCREEN_HEIGHT = 200;
const WORLD_MAP = [
    [1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1],
    [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 3, 2, 0, 0, 0, 0, 0, 1],
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

// player properties
let posX = 9.7, posY = 5;
let dirX = -1, dirY = 0;
let planeX = 0, planeY = 0.66;
let moveSpeed = 0.1;
let rotSpeed = 0.03;

const controls = {
    w : false,
    a : false,
    s : false,
    d : false,
}


// player controls
window.addEventListener("keydown", (e) => { if(e.key in controls) { controls[e.key] = true } });

window.addEventListener("keyup", (e) => { if(e.key in controls) { controls[e.key] = false } });


// game loop
function update() {
    drawScreen();
    updatePlayer();
    raycast();

    setTimeout(update, interval)
}
window.onload = () => { update(); }

var img = new Image(64,64);
img.src = "background.png"

function drawScreen() {
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

function updatePlayer() {
    let oldDirX, oldPlaneX;
    
    if(controls.w) {
        if(WORLD_MAP[Math.floor(posX+dirX*moveSpeed)][Math.floor(posY)] == 0) posX += dirX * moveSpeed;
        if(WORLD_MAP[Math.floor(posX)][Math.floor(posY + dirY * moveSpeed)] == 0) posY += dirY * moveSpeed;
    }
    if(controls.s) {
        if(WORLD_MAP[Math.floor(posX-dirX*moveSpeed)][Math.floor(posY)] == 0) posX -= dirX * moveSpeed;
        if(WORLD_MAP[Math.floor(posX)][Math.floor(posY - dirY * moveSpeed)] == 0) posY -= dirY * moveSpeed;
    }
    if(controls.d) {
        oldDirX = dirX;
        dirX = dirX * Math.cos(-rotSpeed) - dirY * Math.sin(-rotSpeed);
        dirY = oldDirX * Math.sin(-rotSpeed) + dirY * Math.cos(-rotSpeed);
        oldPlaneX = planeX;
        planeX = planeX * Math.cos(-rotSpeed) - planeY * Math.sin(-rotSpeed);
        planeY = oldPlaneX * Math.sin(-rotSpeed) + planeY * Math.cos(-rotSpeed);
    }
    if(controls.a) {
        oldDirX = dirX;
        dirX = dirX * Math.cos(rotSpeed) - dirY * Math.sin(rotSpeed);
        dirY = oldDirX * Math.sin(rotSpeed) + dirY * Math.cos(rotSpeed);
        oldPlaneX = planeX;
        planeX = planeX * Math.cos(rotSpeed) - planeY * Math.sin(rotSpeed);
        planeY = oldPlaneX * Math.sin(rotSpeed) + planeY * Math.cos(rotSpeed);
    }
}

function raycast() {
    for(let ray = 0; ray < SCREEN_WIDTH; ray++) {
        let cameraX = 2 * ray / SCREEN_WIDTH - 1;
        let rayDirX = dirX + planeX * cameraX;
        let rayDirY = dirY + planeY * cameraX;

        let mapX = parseInt(posX);
        let mapY = parseInt(posY);

        let sideDistX, sideDistY;
        
        let deltaDistX = Math.abs(1 / rayDirX);
        let deltaDistY = Math.abs(1 / rayDirY);
        let perpWallDist;

        let stepX;
        let stepY;

        let hit = 0;
        let side;

        if(rayDirX < 0) {
            stepX = -1;
            sideDistX = (posX - mapX) * deltaDistX;
        }
        else {
            stepX = 1
            sideDistX = (mapX + 1.0 - posX) * deltaDistX;
        }
        if(rayDirY < 0) {
            stepY = -1;
            sideDistY = (posY - mapY) * deltaDistY;
        }
        else {
            stepY = 1
            sideDistY = (mapY + 1.0 - posY) * deltaDistY;
        }

        while (hit == 0) {
            if(sideDistX < sideDistY) {
                sideDistX += deltaDistX;
                mapX += stepX;
                side = 0;
            }
            else {
                sideDistY += deltaDistY;
                mapY += stepY;
                side = 1;
            }
            if(WORLD_MAP[mapX][mapY] > 0) hit = 1;
        }

        perpWallDist = (side == 0) ? (sideDistX - deltaDistX) : (sideDistY - deltaDistY);

        let lineHeight = Math.floor(SCREEN_HEIGHT / perpWallDist)

        let drawStart = -lineHeight / 2 + SCREEN_HEIGHT / 2;
        if(drawStart < 0) drawStart = 0;
        let drawEnd = lineHeight / 2 + SCREEN_HEIGHT / 2;
        if(drawEnd >= SCREEN_HEIGHT) drawEnd = SCREEN_HEIGHT;

        let color = 'white';

        switch(WORLD_MAP[mapX][mapY]) {
            case 1:
                color = 'red';
                break;
            case 2:
                color = 'green';
                break;
            case 3:
                color = 'orange';
                break;
        }

        if(side == 1) color = 'dark' + color
        ctx.fillStyle = color;
        ctx.fillRect(ray, drawStart, 1, drawEnd-drawStart)
    }
}