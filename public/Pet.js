import petBusiness from "../pet.business.js";
console.log('accessed pet.js')
// import { setEmotion } from "./pet_anim_canvas.js"; // unneeded; in fact, breaks code
class Pet {
  constructor(name) {
    this.init()

    const savedState = JSON.parse(localStorage.getItem("petState"));
    if (savedState) {
      this.satiated = savedState.satiated;
      this.food = savedState.food;
    }

    this.feedPet = this.feedPet.bind(this);
    this.showStatus = this.showStatus.bind(this);
    this.addFood = this.addFood.bind(this);
    this.playWithPet = this.playWithPet.bind(this);

    document.addEventListener("DOMContentLoaded", () => {
      this.initEventListeners();
    });

    Pet.instance = this;
    // return this;
  }

  async init(){

    var userPet = undefined;
    
    try{
      // var userPet = this.getPet();
      userPet = await petBusiness.getPet()
      
    } catch{
      console.log('no pet exists')
    }

    if (userPet) {
      if (userPet.name == null) {
        this.name = "MISSINGNO.";
      } else {
        // userPet.name = this.name;
        this.name = userPet.name;
      }
      this.satiated = userPet.satiated;
      this.food = userPet.food;
      if (Math.random() > 0.45) setEmotion("sleepy"); // random chance that the pre-existing pet starts asleep
    } else {
      this.name = name || "MISSINGNO.";
      this.satiated = 50;
      this.food = 50; //change to 0

      userPet = {
        name: this.name,
        satiated: this.satiated,
        food: this.food,
      };
      await petBusiness.createPet(userPet);
    }
   
  }
  async getPet(){
    return await petBusiness.getPet();
  }

  saveState() {
    const state = {
      satiated: this.satiated,
      food: this.food,
    };
    document.getElementById("displayFood").textContent = this.food;
    document.getElementById("displaySat").textContent = this.satiated;
    localStorage.setItem("petState", JSON.stringify(state));
  }

  feedPet() {
    if (this.food > 0) {
      this.food--;
      this.satiated += 10;
      if (this.satiated > 100) this.satiated = 100;
      this.updateStatus(
        `${this.name} has been fed! Satiation is now ${this.satiated}.`
      );
      this.saveState();
      setEmotion("idle"); // idle bc why not
    } else {
      this.updateStatus(`No food left to feed ${this.name}!`);
      setEmotion("sad"); // sad bc no food
    }
  }

  showStatus() {
    this.updateStatus(
      `${this.name}'s satiation: ${this.satiated}<br>Food supply: ${this.food}`
    );
  }

  addFood() {
    this.food += 1;
    console.log(`You added 1 bowl of feed. Total bowls: ${this.food}`);
    this.saveState();
  }

  playWithPet() {
    if (this.satiated > 10) {
      this.satiated -= 10;
      this.updateStatus(
        `${this.name} enjoyed playing! Satiation decreased to ${this.satiated}.`
      );
      setEmotion("happy"); // happy bc played with
      this.saveState();
    } else {
      this.updateStatus(`${this.name} is too hungry to play!`);
      setEmotion("sleepy"); // sleepy bc no energy bc hungry
    }
  }

  getName() {
    return this.name;
  }

  updateStatus(message) {
    const statusDiv = document.getElementById("status");
    statusDiv.innerHTML = message;
  }

  initEventListeners() {
    document.getElementById("feedBtn").addEventListener("click", this.feedPet);
    document
      .getElementById("statusBtn")
      .addEventListener("click", this.showStatus);
    document
      .getElementById("playBtn")
      .addEventListener("click", this.playWithPet);
  }
}

const pet = new Pet("Roxy Biloxi the Pomodoro Tomogotchi"); //change to create new instance of Pet class with the name given by the user
export default pet;
