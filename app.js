// Storage Controller - LocalStorage

// Item Controller - State of our Application

const ItemCtrl = (function(){
  // Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const data = {
    item: [
      {id: 0, name: 'Steak Dinner', calories: 1200},
      {id: 1, name: 'Cookies', calories: 400},
      {id: 2, name: 'Eggs', calories: 300}
    ],
    // When I click the update button, then it'll reset to currentItem
    currentItem: null,
    totalCalories: 0
  } 

  // Public Methods
  return {
    logData: function(){
      return data;
    }
  }
})();

// UI Controller

const UICtrl = (function(){

  // Public Methods
  return {

  }

})();

// App Controller

const App = (function(ItemCtrl, UICtrl){

  // Public Methods
  return {
    init: function(){
      console.log('Initializing App....');
    }
  }
})(ItemCtrl, UICtrl);

// Init App
App.init();