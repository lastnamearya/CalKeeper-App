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
    getItems: function(){
      return data.item;
    },
    logData: function(){
      return data;
    }
  }
})();

// UI Controller

const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list'
  }

  // Public Methods
  return {
    populateItemList: function(items){
      let html = '';

      items.forEach(function(item){
         html += `
         <li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>
         `;
      });

      // Insert List Items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    }
  }

})();

// App Controller

const App = (function(ItemCtrl, UICtrl){

  // Public Methods
  return {
    init: function(){
      // Fetch Items from the State / ExternalAPI and stored it somewhere seprate
      const items = ItemCtrl.getItems();

      // Send Data to UI for rendering ~ Populate List of Items
      UICtrl.populateItemList(items);
    }
  }
})(ItemCtrl, UICtrl);

// Init App
App.init();