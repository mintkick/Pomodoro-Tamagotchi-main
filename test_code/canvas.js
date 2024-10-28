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
spriteSheet.src = "pet/duck.png";
// spriteSheet.src = "test_code/pet/duck.png";

let frameX = 0; // what frame/sprite/section of img we're pulling from--the X position of the img source
let frameWidth = 14;
let frameHeight = 14;
const totalFrames = 4; // Number of frames to use in the sprite sheet
const frameSpeed = 50;
const edgeOffset = 2; // pixels from left edge of img to sprite
let betweenOffset = 1; // pixels between sprite frames
let frameCount = 0;

function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(
    spriteSheet,
    edgeOffset + frameWidth * frameX, // pix from img + sprWidth * animFrame
    3,
    frameWidth, // inside source
    frameHeight,
    0,
    0,
    frameWidth * 16, // outside destination
    frameHeight * 16
  ); // (image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  betweenOffset += 1;
  if (frameCount++ > frameSpeed) {
    frameX = ((frameX + 1) % totalFrames) + betweenOffset;
    frameCount = 0;
    betweenOffset %= totalFrames;
  }
  betweenOffset %= totalFrames;
  //   frameX = (frameX + 15 / frameSpeed) % totalFrames;
  //   frameX = (1 * frameWidth) % frameSpeed;
  requestAnimationFrame(animate);
}

spriteSheet.onload = animate;
