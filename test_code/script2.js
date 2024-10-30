const imageElement = document.getElementById("animated");

const images = 
[
    "C:/Users/fatei/.vscode/cse310 team/Pomodoro-Tamagotchi-main/test_code/pet/dogimage1.png",
    "C:/Users/fatei/.vscode/cse310 team/Pomodoro-Tamagotchi-main/test_code/pet/dogimage2.png",
    "C:/Users/fatei/.vscode/cse310 team/Pomodoro-Tamagotchi-main/test_code/pet/dogimage3.png",
    "C:/Users/fatei/.vscode/cse310 team/Pomodoro-Tamagotchi-main/test_code/pet/dogimage4.png",
];

// const images =
// [
//     "test_code/pet/dogimage1.png",
//     "test_code/pet/dogimage2.png",
//     "test_code/pet/dogimage3.png",
//     "test_code/pet/dogimage4.png",
// ];

let currIndex = 0;

function animateImages()
{
    imageElement.src = images[currIndex]

    currIndex = (currIndex + 1) % images.length;
}

setInterval(animateImages, 1000);

{/* <body>
<div id="animation">
<img id="animatedImage" src="image1.jpg" alt="Animation Frame" width="300" height="300">
</div>

<script src="script2.js"></script> */}