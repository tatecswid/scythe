/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// screen properties
const SCREEN_WIDTH = 300;
const SCREEN_HEIGHT = 200;
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
const buffer = new Uint32Array(SCREEN_WIDTH * SCREEN_HEIGHT);

// FPS
let FPS = 30;
let interval = 1000 / FPS;

// map properties
const MAP_WIDTH = 16;
const MAP_HEIGHT = 16;
const WORLD_MAP = [
    [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// player properties
let posX = 9.7, posY = 5;
let dirX = -1, dirY = 0;
let planeX = 0, planeY = 0.66;
let moveSpeed = 0.05;
let rotSpeed = 0.03;

// player controls
const controls = {
    w : false,
    a : false,
    s : false,
    d : false,
}
window.addEventListener("keydown", (e) => { if(e.key in controls) { controls[e.key] = true } });
window.addEventListener("keyup", (e) => { if(e.key in controls) { controls[e.key] = false } });

// texturing
let textureImages = [
    "wall.png",
    "5005.png",
];
const TEX_WIDTH = 64;
const TEX_HEIGHT = 64;

const texture = [];

var tempCanvas = document.getElementById("temp-canvas");
var tempContext = tempCanvas.getContext("2d");

textureImages.forEach((imageURL, textureIndex) => {
    texture[textureIndex] = new Uint32Array(TEX_WIDTH * TEX_HEIGHT);

    const img = new Image(TEX_WIDTH, TEX_HEIGHT);
    img.src = imageURL;

    img.onload = () => {
        tempContext.clearRect(0, 0, TEX_WIDTH, TEX_HEIGHT);
        tempContext.drawImage(img, 0, 0, TEX_WIDTH, TEX_HEIGHT)

        const pixels = tempContext.getImageData(0,0,TEX_WIDTH,TEX_HEIGHT).data;

        for(let rgbaIndex = 0; rgbaIndex < pixels.length; rgbaIndex+=4) {
            texture[textureIndex][rgbaIndex/4] = pixels[rgbaIndex] << 16 | pixels[rgbaIndex + 1] << 8 | pixels[rgbaIndex + 2];
        }        
    }
});
    

// game loop
function update() {
    updatePlayer();
    raycast();

    setTimeout(update, interval)
}
window.onload = () => { update(); }

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
    buffer.fill(0);

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

        let drawStart = Math.round(-lineHeight / 2 + SCREEN_HEIGHT / 2);
        if(drawStart < 0) drawStart = 0;
        let drawEnd = Math.round(lineHeight / 2 + SCREEN_HEIGHT / 2) - 1;
        if(drawEnd >= SCREEN_HEIGHT) drawEnd = SCREEN_HEIGHT;


        // textured raycaster
        let texNum = WORLD_MAP[mapX][mapY] - 1;
        let wallX;
        if (side === 0) {
            wallX = posY + perpWallDist * rayDirY;
        } else {
            wallX = posX + perpWallDist * rayDirX;
        }
        wallX -= Math.floor(wallX);

        let texX = Math.floor(wallX * parseFloat(TEX_WIDTH))
        if(side == 0 && rayDirX > 0) texX = TEX_WIDTH - texX - 1;
        if(side == 1 && rayDirY < 0) texX = TEX_WIDTH - texX - 1;

        let step = 1.0 * TEX_HEIGHT / lineHeight;
        let texPos = (drawStart - SCREEN_HEIGHT / 2 + lineHeight / 2) * step;
        for(let y = drawStart; y <= drawEnd; y++) {
            let texY = Math.floor(texPos) & (TEX_HEIGHT - 1);
            if(texY < 0) texY = 0;
            if(texY >= TEX_HEIGHT) texY = TEX_HEIGHT - 1;

            texPos += step;
            let pixel = texture[texNum][TEX_HEIGHT * texY + texX];

            if(side == 1) pixel = pixel >> 1 & 8355711;
            buffer[y * SCREEN_WIDTH + ray] = pixel;
        }

        /* untextured raycaster
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
        */
    }

    drawBuffer();
}


const imageData = ctx.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT);
const data = imageData.data;
function drawBuffer() {
    for (let i = 0; i < buffer.length; i++) {
        const color = buffer[i];

        const index = i * 4;
        data[index + 0] = (color >> 16) & 255; // R
        data[index + 1] = (color >> 8) & 255;  // G
        data[index + 2] = color & 255;         // B
        data[index + 3] = 255;                 // A
    }

    ctx.putImageData(imageData, 0, 0);
}