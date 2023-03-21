const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4))
});
//task 10 using async callback function
public_users.get('/books',function (req, res) {

    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });

      get_books.then(() => console.log("Promise for Task 10 resolved"));

  });
  //task 11 get ISBN using promises
public_users.get('/isbn/:isbn',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
    const isbn = req.params.isbn;
        res.send(books[isbn])
        setTimeout(() => {
            resolve("Promise resolved")
        },6000)})

        myPromise.then((successMessage) => {
            console.log("Promise for call ISBN for a book resolved " + successMessage)
        })
 });
//Task 12 using callback functions or promises
public_users.get('/author/:author',function (req, res) {
    const get_author = new Promise((resolve, reject) => {
        const author = req.params.author;
        var filtered_book;
        let i = 1;
        while(books[i]){
            if (books[i]["author"]===author) {
                filtered_book = books[i];
                break;
            }
            i++;
        }
        res.send(filtered_book)
        setTimeout(() => {
            resolve("Promise resolved")
        },5000)})
        get_author.then(() => console.log("Search by author resolved")
        );  
    })
//Task 13 search by title using callback functions and promises
public_users.get('/title/:title',function (req, res) {
    const get_title = new Promise((resolve, reject) => {
        const title = req.params.title;
        var filtered_book;
            let i = 1;
            while(books[i]){
                if (books[i]["title"]===title) {
                    filtered_book = books[i];
                    break;
                }
                i++;
            }
            res.send(filtered_book)
            setTimeout(() => {
                resolve("Promise resolved")
            },5000)})
            get_title.then(() => console.log("Search by title resolved")
        );  
    });

    public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]["reviews"])
});

module.exports.general = public_users;
