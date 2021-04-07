const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kbnje.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  console.log("connection error", err);
  const bookCollection = client.db("BookShop").collection("books");
  const ordersCollection = client.db("BookShop").collection("orders");

  app.get('/books',(req,res) =>{
    bookCollection.find()
    .toArray((err , books) =>{
      res.send(books)
    })
  })
  app.get('/book/:id',(req,res)=>{
     bookCollection.find({_id: ObjectId(req.params.id)})
     .toArray((err, book)=>{
       res.send(book[0])
     })
  })

  app.post("/addBook", (req, res) => {
    const newBook = req.body;
    console.log("adding new book: ", newBook);
    bookCollection.insertOne(newBook)
    .then(result =>{
      console.log('inserted count',result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  });
  
  app.post("/orders",(req,res) =>{
    const newOrder = req.body;
    ordersCollection.insertOne(newOrder)
    .then(result => {
      res.send(result.insertedCount > 0)
    }) 
  })

  app.get("/orders",(req,res) =>{
    ordersCollection.find()
    .toArray((err, books) =>{
      res.send(books)
    })
  })

  app.delete('/deleteBook/:id',(req,res)=>{
    bookCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      console.log(result);
    })
  })
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
