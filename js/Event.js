// Event.js

// eslint-disable-next-line no-var
var OregonH = OregonH || {};

OregonH.Event = {};

class EventType {
  constructor(type, notification, text) {
    this.type = type;
    this.notification = notification;
    this.text = text;
  }
}

class StatChange extends EventType {
  constructor(type, notification, text, stat, value) {
    super(type, notification, text);
    this.stat = stat;
    this.value = value;
  }
}

class ShopEvent extends EventType {
  constructor(type, notification, text, products) {
    super(type, notification, text);
    this.products = products;
  }
}

function makeEvent(obj) {
  const { type, notification, text, stat, value, products} = obj
  switch(obj.type) {
    case 'STAT-CHANGE':
      return new StatChange(type, notification, text)
    case 'ATTACK':
      return new EventType(type, notification, stat, value, text)
    case 'SHOP':
      return new ShopEvent(type, notification, text, products)
  }
}


// data = [
const eventTypes = [
// OregonH.Event.eventTypes = [
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'crew',
    value: -3,
    text: 'Old candy. Crew that got stomach aches: ',
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'crew',
    value: -4,
    text: 'Bitter candy. Crew that got stomach aches: ',
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'food',
    value: -10,
    text: 'Melted candy! Candy lost: ',
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'money',
    value: -50,
    text: 'Your chocolate was stolen!',
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'carHealth',
    value: -1,
    text: 'Hit hard rock candy. Damage to wheels: ',
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: 20,
    text: 'Found a lollipop. Candy added: ',
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: 20,
    text: 'Found mints. Candy added: ',
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'carHealth',
    value: 1,
    text: 'Mechanics fix your car. Car health: ',
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found a shop',
    products: [
      { item: 'food', qty: 20, price: 50 },
      { item: 'carHealth', qty: 1, price: 200 },
      { item: 'firepower', qty: 2, price: 50 },
      { item: 'crew', qty: 5, price: 80 },
    ],
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found a shop',
    products: [
      { item: 'food', qty: 30, price: 50 },
      { item: 'carHealth', qty: 1, price: 200 },
      { item: 'firepower', qty: 2, price: 20 },
      { item: 'crew', qty: 10, price: 80 },
    ],
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'Smugglers sell various goods',
    products: [
      { item: 'food', qty: 20, price: 60 },
      { item: 'carHealth', qty: 1, price: 300 },
      { item: 'firepower', qty: 2, price: 80 },
      { item: 'crew', qty: 5, price: 60 },
    ],
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Bandits are attacking you',
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Bandits are attacking you',
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Bandits are attacking you',
  },
];

class GameEvent {
  constructor(game, eventTypes) {
    this.game = game;
    this.eventTypes = eventTypes;
  }

  generateEvent() {
    // pick random one
    const eventIndex = Math.floor(Math.random() * this.eventTypes.length);
    const eventData = this.eventTypes[eventIndex];

    // events that consist in updating a stat
    if (eventData.type === 'STAT-CHANGE') {
      this.stateChangeEvent(eventData);
    } else if (eventData.type === 'SHOP') {
      // shops
      // pause game
      this.game.pauseJourney();

      // notify user
      this.ui.notify(eventData.text, eventData.notification);

      // prepare event
      this.shopEvent(eventData);
    } else if (eventData.type === 'ATTACK') {
      // attacks
      // pause game
      this.game.pauseJourney();

      // notify user
      this.ui.notify(eventData.text, eventData.notification);

      // prepare event
      this.attackEvent(eventData);
    }
  }

  stateChangeEvent(eventData) {
    // can't have negative quantities
    if (eventData.value + this.caravan[eventData.stat] >= 0) {
      this.caravan[eventData.stat] += eventData.value;
      this.ui.notify(eventData.text + Math.abs(eventData.value), eventData.notification);
    }
  }

  shopEvent(eventData) {
    // number of products for sale
    const numProds = Math.ceil(Math.random() * 4);

    // product list
    const products = [];
    let j;
    let priceFactor;

    for (let i = 0; i < numProds; i += 1) {
      // random product
      j = Math.floor(Math.random() * eventData.products.length);

      // multiply price by random factor +-30%
      priceFactor = 0.7 + 0.6 * Math.random();

      products.push({
        item: eventData.products[j].item,
        qty: eventData.products[j].qty,
        price: Math.round(eventData.products[j].price * priceFactor),
      });
    }

    this.ui.showShop(products);
  }
  // prepare an attack event
  attackEvent() {
    const firepower = Math.round((0.7 + 0.6 * Math.random()) * OregonH.ENEMY_FIREPOWER_AVG);
    const gold = Math.round((0.7 + 0.6 * Math.random()) * OregonH.ENEMY_GOLD_AVG);
  
    this.ui.showAttack(firepower, gold);
  }
}