const express = require('express')
const bodyParser=require('body-parser')
const cors=require('cors')
require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 5000

app.get('/',(req,res) => {
    res.send('Hello from ema-john')
})

const MongoClient = require('mongodb').MongoClient;
const { ResumeToken } = require('mongodb')
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER}@cluster0.rbrep.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("emaJohn").collection("products");
  const orderCollection = client.db("emaJohn").collection("order");
    app.post('/addProducts',(req,res)=>{
        const products=req.body
        collection.insertOne(products)  
        .then(result=>{
            console.log(result.insertedCount)
            res.send(result.insertedCount)
        })
    })
    app.get('/products',(req,res)=>{
        collection.find({})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })
    app.get('/product/:key',(req,res)=>{
        collection.find({key:req.params.key})
        .toArray((err,documents)=>{
            res.send(documents[0])
        })
    })
    app.post('/productsByKeys',(req,res)=>{
        const productsKeys=req.body
        collection.find({key:{$in:productsKeys}})
        .toArray((err,documents)=>{
            res.send(documents)
        })

    })
    app.post('/addOrder',(req,res)=>{
        const order=req.body
        orderCollection.insertOne(order)  
        .then(result=>{
            res.send(result.insertedCount>0)
        })
    })
});


app.listen(process.env.PORT || port)