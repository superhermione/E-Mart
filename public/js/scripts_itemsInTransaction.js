//Authors: Su Youn Jeon and Xinrui Hou
// Citation for the following code is modified from the template Github repository for CS 340:
//https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/ (Code & comments were copied)
// Handle bar helper function is cited seperately from StackOverflow:
// https://stackoverflow.com/questions/15411833/using-moment-js-to-convert-date-to-string-mm-dd-yyyy 
// Date: Nov, 15th, 2023

document.addEventListener('DOMContentLoaded', () => {
    // INSERT
    const insertItemsInTransactionBtn = document.getElementById('insert_itemsInTransaction_btn');
    const insertItemsInTransactionCancel = document.getElementById('insert_itemsInTransaction_cancel');
    const insertItemsInTransactionForm = document.getElementById('insert_itemsInTransaction_form');
  
    insertItemsInTransactionBtn.addEventListener('click', () => {
      insertItemsInTransactionForm.style.display = 'block';
    });
  
    insertItemsInTransactionCancel.addEventListener('click', () => {
      insertItemsInTransactionForm.style.display = 'none';
    });
  
    // UPDATE
    const updateItemsInTransactionBtns = document.querySelectorAll('.edit_itemsInTransaction_icon'); 
    const updateItemsInTransactionCancel = document.getElementById('update_itemsInTransaction_cancel');
    const updateItemsInTransactionForm = document.getElementById('update_itemsInTransaction_form');
  
    updateItemsInTransactionBtns.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        // Get the data and populate the form for the table
        let rowToUpdate = event.target.closest('tr');
        document.getElementById("updateItemID").value = rowToUpdate.getAttribute("data-value");
        document.getElementById("updateTransactionID").value = rowToUpdate.getAttribute("data-transaction-id");
        document.getElementById("updateProductName").value = rowToUpdate.getAttribute("data-product-name");
        document.getElementById("updateQuantity").value = rowToUpdate.getAttribute("data-quantity");
        document.getElementById("updateAmount").value = rowToUpdate.getAttribute("data-amount");
        
        updateItemsInTransactionForm.style.display = 'block';
      });
    });
  
    updateItemsInTransactionCancel.addEventListener('click', () => {
      updateItemsInTransactionForm.style.display = 'none';
    });

  
  // DELETE
  const deleteTransactionDetailBtns = document.querySelectorAll('.delete_transactionDetail_icon'); 
  
  deleteTransactionDetailBtns.forEach((btn) => {
    btn.addEventListener('click', (event) => {
        console.log("Delete button clicked", event.target);
      const isConfirmed = window.confirm(
        'Click the button to confirm this delete'
      );

      if (isConfirmed) {
        const rowToDelete = event.target.closest('tr');
        let transactionDetailToDelete = rowToDelete.getAttribute("data-value")
        deleteTransactionDetail(transactionDetailToDelete)
      }
    });
  });
});

//Use AJAX to delete
function deleteTransactionDetail(itemID) {
  let data = {
      itemID: itemID
  };

  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete-transactionDetail", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 204) {
          deleteRow(itemID);
      } else if (xhttp.readyState == 4) {
          console.log("Error deleting transaction detail.");
      }
  };
  xhttp.send(JSON.stringify(data));
}


// update the HTML for the row removal
function deleteRow(itemID){
  let table = document.getElementById("itemsInTransaction-table");
  for (let i = 0, row; row = table.rows[i]; i++) {
     //iterate through rows
     if (table.rows[i].getAttribute("data-value") == itemID) {
          table.deleteRow(i);
          break;
     }
  }
}




   