const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let authBooks = []
  if (author) {
    for(var i in books){
        if (books[i].author === author) {
            authBooks.push(books[i]);
        }
    }    
    if (authBooks.length > 0) {
       res.send(JSON.stringify(authBooks,null,4));
    } else {
        return res.status(300).json({message: "Author not found"});
    }

  } else {
    return res.status(300).json({message: "Author not provided"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let titleBooks = []
    if (title) {
      for(var i in books){
          if (books[i].title === title) {
            titleBooks.push(books[i]);
          }
      }    
      if (titleBooks.length > 0) {
         res.send(JSON.stringify(titleBooks,null,4));
      } else {
          return res.status(300).json({message: "Title not found"});
      }
  
    } else {
      return res.status(300).json({message: "Title not provided"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (isbn) {
        res.send(JSON.stringify(books[isbn].reviews,null,4));
    } else {
        return res.status(300).json({message: "ISBN not provided"});
    }

});

module.exports.general = public_users;
