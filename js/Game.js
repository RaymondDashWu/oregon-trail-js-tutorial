// Game.js

// eslint-disable-next-line no-var

class Game {
  constructor() {
    this.init()
  }
  // initiate the game
  init() {
    // reference ui
    this.ui = new UI(this);
    // reference event manager
    this.eventManager = new GameEvent(this, eventTypes);
    // setup caravan
    this.caravan = new Caravan(this);
    
    // constants
    this.WEIGHT_PER_OX = 20;
    this.WEIGHT_PER_PERSON = 2;
    this.FOOD_WEIGHT = 0.6;
    this.FIREPOWER_WEIGHT = 5;
    this.GAME_SPEED = 800;
    this.DAY_PER_STEP = 0.2;
    this.FOOD_PER_PERSON = 0.02;
    this.FULL_SPEED = 5;
    this.SLOW_SPEED = 3;
    this.FINAL_DISTANCE = 1000;
    this.EVENT_PROBABILITY = 0.15;
    this.ENEMY_FIREPOWER_AVG = 5;
    this.ENEMY_GOLD_AVG = 50;

    this.caravan.init({
      day: 0,
      distance: 0,
      crew: 30,
      food: 80,
      carHealth: 2,
      money: 300,
      firepower: 2,
    });

    // pass references
    this.caravan.ui = this.ui;
    this.caravan.eventManager = this.eventManager;

    this.ui.game = this;

    this.ui.caravan = this.caravan;
    this.ui.eventManager = this.eventManager;

    this.eventManager.game = this;
    this.eventManager.caravan = this.caravan;
    this.eventManager.ui = this.ui;

    // begin adventure!
    this.startJourney();
  }

  // start the journey and time starts running
  startJourney() {
    this.gameActive = true;
    this.previousTime = null;
    this.ui.notify('A great adventure begins', 'positive');
  
    this.step();
  }

  // game loop
  step(timestamp) {
    // starting, setup the previous time for the first time
    if (!this.previousTime) {
      this.previousTime = timestamp;
      this.updateGame();
    }

    // time difference
    const progress = timestamp - this.previousTime;

    // game update
    if (progress >= this.GAME_SPEED) {
      this.previousTime = timestamp;
      this.updateGame();
    }

    // we use "bind" so that we can refer to the context "this" inside of the step method
    if (this.gameActive) window.requestAnimationFrame(this.step.bind(this));
  }

  // update game stats
  updateGame() {
    // day update
    this.caravan.day += this.DAY_PER_STEP;

    // food consumption
    this.caravan.consumeFood();

    // game over no food
    if (this.caravan.food === 0) {
      this.ui.notify('Your caravan starved to death', 'negative');
      this.gameActive = false;
      return;
    }

    // update weight
    this.caravan.updateWeight();

    // update progress
    this.caravan.updateDistance();

    // show stats
    this.ui.refreshStats();

    // check if everyone died
    if (this.caravan.crew <= 0) {
      this.caravan.crew = 0;
      this.ui.notify('Everyone died', 'negative');
      this.gameActive = false;
      return;
    }

    // check win game
    if (this.caravan.distance >= this.FINAL_DISTANCE) {
      this.ui.notify('You have returned home!', 'positive');
      this.gameActive = false;
      return;
    }

    // random events
    if (Math.random() <= this.EVENT_PROBABILITY) {
      this.eventManager.generateEvent();
    }
  }

  // pause the journey
  pauseJourney() {
    this.gameActive = false;
  }

  // resume the journey
  resumeJourney() {
    this.gameActive = true;
    this.step();
  }
}

new Game();
