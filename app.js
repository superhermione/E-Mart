// App.js
// Jeon and Xinrui
// This code is a modification from the Github template for CS340 repository

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 46857;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector')

// app.js
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

/*
    ROUTES
*/
app.get('/', function(req, res)
    {
        res.render('index');                    
    });                                         

app.get('/index.html', function(req, res)
    {
        res.render('index');                
    });  

    // show categories
app.get('/categories', function(req, res)                 // This is the basic syntax for what is called a 'route'
    {
        // Define our queries
        let queryCategories = "SELECT * FROM Categories;";  
        db.pool.query(queryCategories, function(error, rows, fields){    // Execute the query
            res.render('categories', {data: rows});                 
        })                                                     
    });  

    // show employees
app.get('/employees.html', function(req, res) {
        // Define our query
        let queryEmployeeSelect = "SELECT employeeID, firstName, lastName, email, position, customerID FROM Employees;";
        
        // Execute the query and render the template with the results
        db.pool.query(queryEmployeeSelect, function(error, rows, fields) {
            if (error) {
                // Handle the error
                console.error(error);
                res.sendStatus(500); // Internal Server Error
            } else {
                // Render the 'employees' template with the data retrieved from the database
                res.render('employees', { data: rows });
            }
        });
    });
          

app.get('/products', function(req, res)                 // This is the basic syntax for what is called a 'route'
    {
        res.render('products')                                                  
    });  

app.get('/customers', function(req, res)                 // This is the basic syntax for what is called a 'route'
    {
        res.render('customers')                                                  
    }); 


app.get('/transactions', function(req, res)                 // This is the basic syntax for what is called a 'route'
    {
        res.render('transactions')                                                  
    }); 

app.get('/itemsInTransaction', function(req, res)                 // This is the basic syntax for what is called a 'route'
    {
        res.render('itemsInTransaction')                                                  
    }); 


/* POST */

// add categories
app.post('/add-category', function(req, res){
    // Get the incoming data
    let data = req.body;

    // Query database with this data
    queryCategoriesInsert = `INSERT INTO Categories (categoryName) VALUES ('${data.categoryName}')`;
    db.pool.query(queryCategoriesInsert, function(error, rows, fields){

        if (error) {
            // Send 400 Bad Request if there is an error
            console.log(error)
            res.sendStatus(400);
        }
        // If there is no error, render the page again (with the new data)
        else
        {
            res.send(rows);
        }
    })
})

// add employees
app.post('/add-employee', function(req, res) {
    let data = req.body;
    let customerID = data['employeeCustomerID'] ? parseInt(data['employeeCustomerID'], 10) : null;
    // Parameterized query to prevent SQL injection
    let queryEmployeesInsert = `INSERT INTO Employees (firstName, lastName, email, position, customerID) VALUES (?, ?, ?, ?, ?);`;
    let queryParams = [data['employeeFirstName'], data['employeeLastName'], data['employeeEmail'], data['employeePosition'], customerID];
    
    db.pool.query(queryEmployeesInsert, queryParams, function(error, results, fields) {
        if (error) {
            // Send 400 Bad Request if there is an error
            console.error(error);
            res.status(400).send('Error adding new employee');
        } else {
            // If there is no error, redirect to the employees page to show the updated list
            res.redirect('/employees.html');
        }
    });
});

/* UPDATE */

//update categories
app.put('/put-category', function(req,res,next){
    let data = req.body;

    let categoryID = parseInt(data.categoryID);

    let updateCategory = `UPDATE Categories SET categoryName = '${data.categoryName}' WHERE categoryID = ?`

        db.pool.query(updateCategory, [categoryID], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                res.send(rows);
            
            }
})});


// update employee
app.post('/update-employee', function(req, res) {
    let data = req.body;

    let employeeID = parseInt(data['updateEmployeeID'], 10);  
    let customerID = data['updateEmployeeCustomerID'] ? parseInt(data['updateEmployeeCustomerID'], 10) : null;

    // Check if employeeID is not a number (NaN), which would indicate a parsing error
    if (isNaN(employeeID)) {
        return res.status(400).send('Invalid employee ID');
    }
    
    // customerID can be null if the input is empty, which is fine if the field is optional
    if (data['updateEmployeeCustomerID'] !== '' && isNaN(customerID)) {
        return res.status(400).send('Invalid customer ID');
    }

    let queryUpdateEmployees = `UPDATE Employees SET firstName = ?, lastName = ?, email = ?, position = ?, customerID = ? WHERE employeeID = ?;`;
    let queryParams = [
        data['updateEmployeeFirstName'],  
        data['updateEmployeeLastName'],  
        data['updateEmployeeEmail'],      
        data['updateEmployeePosition'],  
        customerID,
        employeeID
    ];

    // Log queryParams to check their values before the query
    console.log(queryParams);

    db.pool.query(queryUpdateEmployees, queryParams, function(error, results, fields) {
        if (error) {
            console.error('Database error:', error);
            res.status(400).send('Error updating employee information');
        } else {
            res.redirect('/employees.html');
        }
    });
});


/* DELETE */

// delete categories
app.delete('/delete-category/', function(req,res,next){
    let data = req.body;
    let categoryID = parseInt(data.categoryID);
    let deleteCategory = `DELETE FROM Categories WHERE categoryID = ?`;
  
          // Run the 1st query
          db.pool.query(deleteCategory, [categoryID], function(error, rows, fields){
              if (error) {
  
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
              }
  
              else
              {
                res.sendStatus(204);
              }
  })});


// delete employee
app.delete('/delete-employee', function(req, res, next){
    let data = req.body;
    let employeeID = parseInt(data.employeeID); 
    let queryDeleteEmployee = `DELETE FROM Employees WHERE employeeID = ?`;

    // Run the query
    db.pool.query(queryDeleteEmployee, [employeeID], function(error, results, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204); 
        }
    });
});


app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});