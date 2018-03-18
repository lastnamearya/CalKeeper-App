// Storage Controller - LocalStorage
const StorageCtrl = (function(){
   
  // Public Methods
  return {
    storeItem: function(item){
      let items;
      
      // Check if any items in LocalStorage
      if(localStorage.getItem('items') === null){
        items = [];
        // Push new item
        items.push(item);
        // Set Local Storage
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // Get Data from Local Storage
        items = JSON.parse(localStorage.getItem('items'));

        // Push new item 
        items.push(item);

        // Re-setting Data in Local Storage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromLocalStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    }
  }
})();

// ************************************************************************************* //

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
    // items: [
    //   // {id: 0, name: 'Steak Dinner', calories: 1200},
    //   // {id: 1, name: 'Cookies', calories: 400},
    //   // {id: 2, name: 'Eggs', calories: 300}
    // ],
    items: StorageCtrl.getItemsFromLocalStorage(),
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
    updateItem: function(name, calories){
      // Calories to number, as it coming from form
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item){
        // Here's the trick, the edit item goes into the currentItem, but it's id is not going to change, only user is going to mutate name and calories value.
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    deleteItem: function(id){
       // Get ids, it'll return an array with all the ids
       const ids = data.items.map(function(item){
        return item.id;
       });

       // Get index
       const index = ids.indexOf(id);

       // Remove Item
       data.items.splice(index, 1);
    },
    clearAllItems: function(){
      data.items = [];
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    getCurrentItem: function(){
      return data.currentItem;
    },
    getTotalCalories: function() {
      let total = 0;

      // Loop thorugh Data items and add calls
      data.items.forEach(function(item){
        total += item.calories;
      });

      // Set total cal in the data structure
      data.totalCalories = total;

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
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
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
    updateListItem: function(item){
      // It'll give us a Node List
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node List into array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          `;
        }
      }); 
    },
    deleteListItem(id){
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();

    // After Deleting, now calculate the mutated Total Calories

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Render total Calories Value in the UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node List into an Array
      listItems = Array.from(listItems);

      listItems.forEach(function(item){
        item.remove();
      });
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
    showEditState: function(){
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors: function(){
      return UISelectors;
    }
  }

})();

// ************************************************************************************* //

// App Controller

const App = (function(ItemCtrl, StorageCtrl, UICtrl, ){

  // Load event Listeners
  const loadEventListeners = function() {
    // Get uI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter ~ it creates problem in edit / update
    document.addEventListener('keypress', function(e){
      // Enter key's code is 13 but some old browser don't support keyCode so we can also use .which with .keyCode
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });

    // Edit Icon Click Event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update Button event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Delete button event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    // Clear Items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
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

      // Store in localStorage
      StorageCtrl.storeItem(newItem);

      // Clear Inputs fields
      UICtrl.clearInput();
    }
    
    e.preventDefault();
  }

  // Item Edit Click

  const itemEditClick = function(e){

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

      // Add Item to form, we don't need to pass the item, because it's now saved in the currentItem
      UICtrl.addItemToForm();

    }

    e.preventDefault();
  }

  // Update Item Submit

  const itemUpdateSubmit = function(e){
    // Get item input
    const input = UICtrl.getItemInput();

    // Update Item, Recalling assignments happens from right to left in JavaScript
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI with the new Updated Item ~ successfully added to our Data Strucutre
    UICtrl.updateListItem(updatedItem);

    // After updating, now calculate the mutated Total Calories

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Render total Calories Value in the UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  // On Deleting
  const itemDeleteSubmit = function(e){
    // Get Current Item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from Data Structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from List Item
    UICtrl.deleteListItem(currentItem.id);

    e.preventDefault();
  }

  // Clear Items event
  const clearAllItemsClick = function(){
    // Delete all Items from Data Structure
    ItemCtrl.clearAllItems();

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Render total Calories Value in the UI
    UICtrl.showTotalCalories(totalCalories);

    // Remove from UI
    UICtrl.removeItems();

    // Hide <ul>
    UICtrl.hideList();
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
})(ItemCtrl, StorageCtrl, UICtrl);

// ************************************************************************************* //

// Init App
App.init();
