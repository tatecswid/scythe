/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// screen properties
const SCREEN_WIDTH = 300;
const SCREEN_HEIGHT = 200;
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
const buffer = new Uint32Array(SCREEN_WIDTH * SCREEN_HEIGHT);
const bufferImgData = ctx.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT);
const imgData = bufferImgData.data;

// FPS
let FPS = 30;
let interval = 1000 / FPS;

// map properties
const MAP_WIDTH = 16;
const MAP_HEIGHT = 16;
const WORLD_MAP = [
    [1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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
const FLOOR_MAP = [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,6,6,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,6,6,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,6,6,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

const CEILING_MAP = [
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
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
};
window.addEventListener("keydown", (e) => { if(e.key in controls) { controls[e.key] = true } });
window.addEventListener("keyup", (e) => { if(e.key in controls) { controls[e.key] = false } });

// texturing
let textureImages = [
    "textures/wall.png",
    "textures/brick.png",
    "textures/floor.png",
    "textures/ceiling.png",

    // seat sprites
    "textures/seat_sprite0.png",
    "textures/seat_sprite315.png",
    "textures/seat_sprite270.png",
    "textures/seat_sprite225.png",
    "textures/seat_sprite180.png",
    "textures/seat_sprite135.png",
    "textures/seat_sprite90.png",
    "textures/seat_sprite45.png",
    
    
    
    
    
    


    "textures/bowling_pin.png",    
    "textures/trash_can.png",
    "textures/bowling_lane_floor.png",
];
const TEX_WIDTH = 256;
const TEX_HEIGHT = 256;
const texture = [];

// sprite components:
class Sprite {
    constructor(x, y, texture) {
        this.x = x;
        this.y = y;
        this.texture = texture;
    }
}

var sprites = [
    new Sprite(6, 6, 4),
    new Sprite(6, 8, 4),
];

// 1D Buffer
let ZBuffer = [];

let spriteOrder = [];
let spriteDistance = [];


// on start
function onStart() {
    textureSetup();
    update();
} window.onload = () => onStart();

// game loop
function update() {
    updatePlayer();
    raycast();

    setTimeout(update, interval)
}

function textureSetup() {   

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
                let a = pixels[rgbaIndex + 3];
                texture[textureIndex][rgbaIndex/4] = a < 128 ? 0 : pixels[rgbaIndex] << 16 | pixels[rgbaIndex + 1] << 8 | pixels[rgbaIndex + 2];
            }        
        }
    });
}


// update player position and rotation, collide with wall
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
    floorCast();
    wallCast();
    spriteCast();
    drawBuffer();
}

// raycast the floor
function floorCast() {
    for(let y = 0; y < SCREEN_HEIGHT; y++) {
        let rayDirX0 = dirX - planeX;
        let rayDirY0 = dirY - planeY;
        let rayDirX1 = dirX + planeX;
        let rayDirY1 = dirY + planeY;

        let p = y - SCREEN_HEIGHT / 2;

        let posZ = 0.5 * SCREEN_HEIGHT;

        let rowDistance = posZ / p;

        let floorStepX = rowDistance * (rayDirX1 - rayDirX0) / SCREEN_WIDTH;
        let floorStepY = rowDistance * (rayDirY1 - rayDirY0) / SCREEN_WIDTH;

        let floorX = posX + rowDistance * rayDirX0;
        let floorY = posY + rowDistance * rayDirY0;

        for(let x = 0; x < SCREEN_WIDTH; ++x) {
            let cellX = Math.floor(floorX)
            let cellY = Math.floor(floorY)

            let tx = Math.floor(TEX_WIDTH * (floorX - cellX)) & (TEX_WIDTH - 1);
            let ty = Math.floor(TEX_HEIGHT * (floorY - cellY)) & (TEX_HEIGHT - 1);

            floorX += floorStepX;
            floorY += floorStepY;

            let floorTexture = 2;
            let ceilingTexture = 3;

            if(cellX >= 0 && cellX < MAP_WIDTH && cellY >= 0 && cellY < MAP_HEIGHT) {
                floorTexture = FLOOR_MAP[cellX][cellY];
                ceilingTexture = CEILING_MAP[cellX][cellY];
            }

            let pixel;

            pixel = texture[floorTexture][TEX_WIDTH * ty + tx];
            buffer[y * SCREEN_WIDTH + x] = pixel;

            pixel = texture[ceilingTexture][TEX_WIDTH * ty + tx];
            buffer[(SCREEN_HEIGHT-y-1) * SCREEN_WIDTH + x] = pixel;
        }
    }

    
}

// raycast the wall
function wallCast() {
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

        let lineHeight = Math.floor(SCREEN_HEIGHT / perpWallDist * 1.02);

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
       ZBuffer[ray] = perpWallDist;
    }
}

function spriteCast() {
    for(let i = 0; i < sprites.length; i++) {
        spriteOrder[i] = i;
        spriteDistance[i] = ((posX - sprites[i].x) * (posX - sprites[i].x) + (posY - sprites[i].y) * (posY - sprites[i].y));
    }
    sortSprites(spriteOrder, spriteDistance, sprites.length);

    for(let i = 0; i < sprites.length; i++) {
        //translate sprite position to relative to camera
        let spriteX = sprites[spriteOrder[i]].x - posX;
        let spriteY = sprites[spriteOrder[i]].y - posY;

        
        //transform sprite with the inverse camera matrix
        // [ planeX   dirX ] -1                                       [ dirY      -dirX ]
        // [               ]       =  1/(planeX*dirY-dirX*planeY) *   [                 ]
        // [ planeY   dirY ]                                          [ -planeY  planeX ]

        let invDet = 1.0 / (planeX * dirY - dirX * planeY); //required for correct matrix multiplication

        let transformX = invDet * (dirY * spriteX - dirX * spriteY);
        let transformY = invDet * (-planeY * spriteX + planeX * spriteY); //this is actually the depth inside the screen, that what Z is in 3D

        let spriteScreenX = Math.floor((SCREEN_WIDTH / 2) * (1 + transformX / transformY));

        //calculate height of the sprite on screen
        let spriteHeight = Math.abs(Math.floor(SCREEN_HEIGHT / (transformY))); //using 'transformY' instead of the real distance prevents fisheye
        //calculate lowest and highest pixel to fill in current stripe
        let drawStartY = Math.floor(-spriteHeight / 2 + SCREEN_HEIGHT / 2);
        if(drawStartY < 0) drawStartY = 0;
        let drawEndY = Math.floor(spriteHeight / 2 + SCREEN_HEIGHT / 2);
        if(drawEndY >= SCREEN_HEIGHT) drawEndY = SCREEN_HEIGHT - 1;

        //calculate width of the sprite
        let spriteWidth = Math.abs( Math.floor(SCREEN_HEIGHT / (transformY)));
        let drawStartX = Math.floor(-spriteWidth / 2 + spriteScreenX);
        if(drawStartX < 0) drawStartX = 0;
        let drawEndX = Math.floor(spriteWidth / 2 + spriteScreenX);
        if(drawEndX >= SCREEN_WIDTH) drawEndX = SCREEN_WIDTH - 1;

        let dx = posX - sprites[spriteOrder[i]].x;
        let dy = posY - sprites[spriteOrder[i]].y;

        // angle from sprite to player
        let angle = Math.atan2(dy, dx);

        // normalize
        angle = (angle + Math.PI * 2) % (Math.PI * 2);

        // convert to 8 directions
        let direction = Math.floor((angle + Math.PI / 8) / (Math.PI / 4)) % 8;

        let texIndex = sprites[spriteOrder[i]].texture + direction;


        for(let stripe = drawStartX; stripe <= drawEndX; stripe++) {
            let texX = Math.floor((stripe - (-spriteWidth / 2 + spriteScreenX)) * TEX_WIDTH / spriteWidth );;

            if (texX < 0) texX = 0;
            if (texX >= TEX_WIDTH) texX = TEX_WIDTH - 1;

            if(transformY > 0 && stripe >= 0 && stripe < SCREEN_WIDTH && transformY < ZBuffer[stripe]) {
                for(let y = drawStartY; y <= drawEndY; y++) {
                    let d = (y) * 256 - SCREEN_HEIGHT * 128 + spriteHeight * 128;
                    let texY = Math.floor(((d * TEX_HEIGHT) / spriteHeight) / 256);
                    if (texY < 0) texY = 0;
                    if (texY >= TEX_HEIGHT) texY = TEX_HEIGHT - 1;

                    let pixel = texture[texIndex][TEX_WIDTH * texY + texX];
                    
                    if(pixel > 0) {
                        buffer[y * SCREEN_WIDTH + stripe] = pixel;
                    }
                }
            }
        }
    }
}

function sortSprites(spriteOrder, spriteDistance, numOfSprites) {
    let spritesVector = [];
    for(let i = 0; i < numOfSprites; i++) {
        spritesVector.push({ spriteDistance: spriteDistance[i], spriteOrder: spriteOrder[i] });
    }

    spritesVector.sort((a,b) => b.spriteDistance - a.spriteDistance);

    for (let i = 0; i < numOfSprites; i++) {
        spriteDistance[i] = spritesVector[i].spriteDistance;
        spriteOrder[i] = spritesVector[i].spriteOrder;
    }
}


function drawBuffer() {
    for (let i = 0; i < buffer.length; i++) {
        const color = buffer[i];

        const index = i * 4;
        imgData[index + 0] = (color >> 16) & 255; // R
        imgData[index + 1] = (color >> 8) & 255;  // G
        imgData[index + 2] = color & 255;         // B
        imgData[index + 3] = 255;                 // A
    }

    ctx.putImageData(bufferImgData, 0, 0);
}
