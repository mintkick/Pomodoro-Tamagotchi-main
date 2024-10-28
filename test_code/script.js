// const pet = document.getElementById("pet");
// const feedButton = document.getElementById("feed");

// feedButton.addEventListener("click", () => {
//   pet.style.transform = "scale(1.1)"; // Grow the pet
//   setTimeout(() => {
//     pet.style.transform = "scale(1)"; // Return to original size
//   }, 500);
// });

// let frame = 0;
// const totalFrames = 2; // Number of frames in the sprite

// function animate() {
//   pet.style.backgroundPosition = `-${frame * 128}px 0`; // Adjust based on sprite size
//   frame = (frame + 1) % totalFrames;
// }

// setInterval(animate, 200); // Change frame every 100 ms

const petElement = document.getElementById("pet");

function animatePet(state) {
  petElement.className = ""; // Reset classes
  switch (state) {
    case "idle":
      petElement.classList.add("idle"); // add this to the element's tags
      break;
    case "happy":
      petElement.classList.add("happy");
      break;
    case "sad":
      petElement.classList.add("sad");
      break;
    // Add more cases for different states
  }
}

// Example usage:
animatePet("idle"); // Start the 'X' animation
