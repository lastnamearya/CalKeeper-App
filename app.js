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
    items: [
      // {id: 0, name: 'Steak Dinner', calories: 1200},
      // {id: 1, name: 'Cookies', calories: 400},
      // {id: 2, name: 'Eggs', calories: 300}
    ],
    // When I click the update button, then it'll reset to currentItem
    currentItem: null,
    totalCalories: 0
  } 

  // Public Methods
  return {
    getItems: function(){
      return data.items;
    },
    addItem: function(name, calories){
      let ID;
      // Create ID
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to Number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);

      // Adding New Item to our Data Structure ~ State of our App
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id){
      let found = null;
      
      // Loop thorugh items
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    getTotalCalories: function() {
      let total = 0;

      // Loop thorugh Data items and add calls
      data.items.forEach(function(item){
        total += item.calories;

        // Set total cal in the data structure
        data.totalCalories = total;
      });
      // Return total
      return data.totalCalories;
    },
    logData: function(){
      return data;
    }
  }
})();

// ************************************************************************************* //

// UI Controller

const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
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
    },
    getItemInput: function(){
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item){
      // Show the List 
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create Li Element
      const li = document.createElement('li');
      // Add Class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `
      <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
      `;
      // Insert HTML
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    // Clear the <ul> element on resetting the data / deleting all items
    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories){
       document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function(){
      // Step 1: Clear Input Fields
      UICtrl.clearInput();
      // Step 2: Hide all those button except Add button, make it inline
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    getSelectors: function(){
      return UISelectors;
    }
  }

})();

// ************************************************************************************* //

// App Controller

const App = (function(ItemCtrl, UICtrl){
  // Load event Listeners
  const loadEventListeners = function() {
    // Get uI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Edit Icon Click Event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);
  }

  // add item submit
  const itemAddSubmit = function(e){
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calorie input
    if(input.name !== "" && input.calories !== ""){
      // Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add Item to UI List
      UICtrl.addListItem(newItem);

      // Get Total Calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Render total Calories Value in the UI
      UICtrl.showTotalCalories(totalCalories);

      // Clear Inputs fields
      UICtrl.clearInput();
    }
    
    e.preventDefault();
  }

  // Update Item Submit
  const itemUpdateSubmit = function(e){
    if(e.target.classList.contains('edit-item')){
      // Get List item id (item-0, item-1) of the collection list item ~ Now It's clear why Event Delegation is necassary here
      const listId = e.target.parentNode.parentNode.id;
      
      // Break into an array
      const listIdArr = listId.split('-');

      // Get the Actual id, We get two values after parsing, 0 -> item 1 -> actual ID
      const id = parseInt(listIdArr[1]);

      // Get Item, sending the id to our State of the App ~ getItemById
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current Item
      ItemCtrl.setCurrentItem(itemToEdit);
    }

    e.preventDefault();
  }

  

  // Public Methods
  return {
    init: function(){
      // Clear Edit State / Set Initial State
      UICtrl.clearEditState();

      // Fetch Items from the State / ExternalAPI and stored it somewhere seprate
      const items = ItemCtrl.getItems();

      // Check if any items
      if(items.length === 0){
        UICtrl.hideList();
      } else {
        // Send Data to UI for rendering ~ Populate List of Items
        UICtrl.populateItemList(items);
      }

      // Total Calories are also initialized while loading our App

      // Get Total Calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Render total Calories Value in the UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl);

// ************************************************************************************* //

// Init App
App.init();
