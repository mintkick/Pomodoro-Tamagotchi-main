const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d"); // 2D rendering context

// // guide

const spriteImage = new Image();
spriteImage.src = "pet/duck.png";

// spriteImage.onload = function () {
//   context.drawImage(spriteImage, 2, 3, 14, 14, 100, 100, 64, 64); // s=src, d=dest (image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
// };

// Clear the canvas
context.clearRect(0, 0, canvas.width, canvas.height);

// Draw a rectangle
context.fillStyle = "blue";
context.fillRect(50, 50, 200, 100); // (x, y, width, height)

// Draw a circle
context.beginPath();
context.arc(300, 200, 50, 0, Math.PI * 2); // (x, y, radius, startAngle, endAngle)
context.fillStyle = "red";
context.fill();

// animate the blue rectangle
let x = 0;
const speed = 2;

function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Update position
  x += speed;
  if (x > canvas.width) x = 0; // Loop back

  // Draw the rectangle
  context.fillStyle = "blue";
  context.fillRect(x, 100, 100, 50);

  requestAnimationFrame(animate); // Call animate again, optimized for smooth animations
}

// animate(); // Start the animation

// // full

// VARIABLED
// const spriteSheet = new Image();
// spriteSheet.src = 'pet/duck.png';

// let frameX = 0;
// const totalFrames = 4; // Number of frames in the sprite sheet

// function animate() {
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     context.drawImage(spriteSheet, frameX * frameWidth, 0, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
//     frameX = (frameX + 1) % totalFrames;
//     requestAnimationFrame(animate);
// }

const spriteSheet = new Image();
spriteSheet.src = "pet/000.png";
// spriteSheet.src = "test_code/pet/duck.png";
context.imageSmoothingEnabled = false;

let frameX = 0; // what frame/sprite/section of img we're pulling from--the X position of the img source
let frameWidth = 16;
let frameHeight = 16;
const totalFrames = 4; // Number of frames to use in the sprite sheet
const frameSpeed = 20; // larger number = slower speed
const edgeOffset = 0; // pixels from left edge of img to sprite
let betweenOffset = 0; // pixels between sprite frames
let frameCount = 0;

// stripped down to use a much simpler sprite sheet
function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(
    // (image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) s-OURCE d-ESTINATION
    spriteSheet,
    frameX, // pix from img + sprWidth * animFrame
    0,
    frameWidth, // inside/source
    frameHeight,
    0,
    0,
    frameWidth * 16, // outside/destination
    frameHeight * 16
  );
  //   betweenOffset += 1;
  if (frameCount++ > frameSpeed) {
    frameX = (frameX + frameWidth) % (totalFrames * frameWidth); // + betweenOffset;
    frameCount %= totalFrames; // frameCount = 0;
    // betweenOffset %= totalFrames; // ?
  }
  //   betweenOffset %= totalFrames; // ?
  //   frameX = (frameX + 15 / frameSpeed) % totalFrames;
  //   frameX = (1 * frameWidth) % frameSpeed;
  requestAnimationFrame(animate);
}

spriteSheet.onload = animate;
