const { createCanvas, Image } = require("canvas");
const fs = require("fs");

const randomInteger  = require("./src/utils/randomInt.js");
const getDirsAndFiles = require("./src/utils/getDirsAndFiles.js");

const imagesPath = './images';
const imagesPathResult = './assets';

let images = []; /// array to hold images.
let imageCount = 0; // number of loaded images;

const width = 142;
const height = 175;

const targetWidth = 746;
const targetHeight = 918;

const offsets = [
    0, -1,
    -1,  0,
    1,  0,
    0,  1,
];

const imageLayers = getDirsAndFiles(imagesPath);


function getRandomImage(imageLayers){
    const randomImage = []

    for (let i = 0; i < imageLayers.length; i++) {
        randomImage.push(imagesPath + '/' + imageLayers[i].dir + '/' + imageLayers[i].files[randomInteger(0, Object.values(imageLayers[i].files).length-1)], )
    }

    return randomImage.reverse()
}

function saveImage(name){

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

   
    for (let i = 0; i < images.length; i++) {
        context.drawImage(images[i], 0, 0); 
    }

    const bufferOriginal = canvas.toBuffer("image/png"); 
    fs.writeFileSync(imagesPathResult + "/" + name + "_original_asset.png", bufferOriginal);

    const s = 1;
    let j = 0;

    while (j < offsets.length) {
        context.drawImage(canvas, offsets[j] * s, offsets[j + 1] * s);
        j += 2;
    }
    
    context.globalCompositeOperation = "source-in";
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = "source-over";
    context.drawImage(canvas, width, height);

    for (let i = 0; i < images.length; i++) {
        context.drawImage(images[i], 0, 0); 
    }


    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(imagesPathResult + "/" + name + "_stroke_asset.png", buffer);
   

    const canvasResize = createCanvas(targetWidth, targetHeight);
    const contextResize = canvasResize.getContext("2d");

    contextResize.imageSmoothingEnabled = false;
    
    contextResize.drawImage(canvas, 0, 0, targetWidth, targetHeight); 
    
    const resizedbuffer = canvasResize.toBuffer("image/png");
    fs.writeFileSync(imagesPathResult + "/" + name + "_resized_asset.png", resizedbuffer);

}


function generate(name){

    const randomNFT = getRandomImage(imageLayers)

    randomNFT.forEach(src => {  
        const image = new Image();
    
        image.onload = () => {
            images.push(image); 
            imageCount += 1;
            if(imageCount === randomNFT.length){ 
                saveImage(name); 
            }
        }
        image.onerror = err => { throw err }
        image.src = src;
    });
}

for (let i = 0; i < 3; i++) {
    images = []
    imageCount = 0
    generate(i)
}