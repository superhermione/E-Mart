//Authors: Su Youn Jeon and Xinrui Hou
// Citation for the following code is modified from the template Github repository for CS 340:
//https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/ (Code & comments were copied)
// Date: Nov, 15th, 2023

document.addEventListener('DOMContentLoaded', () => {
    // INSERT
    const insertCustomerBtn = document.getElementById('insert_customer_btn');
    const insertCustomerCancel = document.getElementById('insert_customer_cancel');
    const insertCustomerForm = document.getElementById('insert_customer_form');
  
    insertCustomerBtn.addEventListener('click', () => {
      insertCustomerForm.style.display = 'block';
    });
  
    insertCustomerCancel.addEventListener('click', () => {
      insertCustomerForm.style.display = 'none';
    });
  
    // UPDATE
    const updateCustomerBtns = document.querySelectorAll('.edit_icon'); 
    const updateCustomerCancel = document.getElementById('update_customer_cancel');
    const updateCustomerForm = document.getElementById('update_customer_form');
  
    updateCustomerBtns.forEach((btn, index) => {
      btn.addEventListener('click', (event) => {
        //Get the data and populate the form for the table
        let rowToUpdate = event.target.closest('tr');
        document.getElementById("updateCustomerID").value = rowToUpdate.getAttribute("data-value") 
        document.getElementById("updateCustomerType").value = rowToUpdate.getAttribute("data-customer-type") 
        document.getElementById("updateCustomerFirstName").value = rowToUpdate.getAttribute("data-first-name") 
        document.getElementById("updateCustomerLastName").value = rowToUpdate.getAttribute("data-last-name")
        document.getElementById("updateCustomerEmail").value = rowToUpdate.getAttribute("data-email") 
        updateCustomerForm.style.display = 'block';
      });
    });
  
    updateCustomerCancel.addEventListener('click', () => {
      updateCustomerForm.style.display = 'none';
    });
  
    // DELETE
    const deleteCustomerBtns = document.querySelectorAll('.delete_customer_icon'); 
  
    deleteCustomerBtns.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        const isConfirmed = window.confirm(
          'Click the button to confirm this delete'
        );
  
        if (isConfirmed) {
          const rowToDelete = event.target.closest('tr');
          let customerToDelete = rowToDelete.getAttribute("data-value")
          deletePerson(customerToDelete)
        }
      });
    });
  });
  
  //Use AJAX to delete
  function deletePerson(customerID) {
    let data = {
        customerID: customerID
    };
  
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-customer", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            deleteRow(customerID);
        } else if (xhttp.readyState == 4) {
            console.log("Error deleting customer.");
        }
    };
    xhttp.send(JSON.stringify(data));
}

  
  // update the HTML for the row removal
  function deleteRow(customerID){
    let table = document.getElementById("customers-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       if (table.rows[i].getAttribute("data-value") == customerID) {
            table.deleteRow(i);
            break;
       }
    }
  }
  
  // Set up default guest email and assist adding employee email in order to assist the inserting of transactions when the customer is a guest or an employee. 
  document.addEventListener('DOMContentLoaded', function() {
    var customerTypeSelect = document.getElementById('customerType');
    var emailField = document.getElementById('customerEmail');
    if (customerTypeSelect && emailField && employeeMessage) {
      customerTypeSelect.addEventListener('change', function() {
          if (this.value === 'Guest') {
              emailField.value = 'guest@example.com'; // Set a default email for guest
              employeeMessage.style.display = 'none'; // Hide the employee message
          } else if (this.value === 'Employee') {
              emailField.value = ''; 
              employeeMessage.style.display = 'block'; // Show the employee message
          } else {
              emailField.value = ''; 
              employeeMessage.style.display = 'none'; 
          }
      });
    }
});