const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()

// Middleware
app.use(cors());
app.use(express.json());

// DATABASE SETUPS AND GET , POST METHODS

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zrnlv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        // Database name and Connecting With database and various collection
        await client.connect();
        const database = client.db("travel")
        const destination = database.collection('destinations');
        const orderCollection = database.collection('orders');
        // GET PRODUCTS API

        // Getting Destinations on the UI From the Database
        app.get('/destinations',async (req,res) =>{
            const cursor = destination.find({});
            const destinations = await cursor.toArray();
            res.send(destinations);
        })

        // Getting Single Destinations Details From Database
        app.get('/destinations/:id' , async (req , res)=>{
            const id = req.params.id;
            // console.log('Getting Specific ID ' , id)
            const query = {_id: ObjectId(id)}
            const service = await destination.findOne(query);
            res.json(service);
        } )
        // Add New ITEM TO Destination 
        app.post('/destinations', async (req,res)=>{
            const order = req.body;
            const result = await destination.insertOne(order)
            console.log(result)
            res.json(result)
        })

        // POST Orders API
        app.post('/orders', async (req,res)=>{
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            console.log(result)
            res.json(result)
        })
        // GET ORDERS API

        app.get('/orders', async(req , res)=>{
        const cursor = orderCollection.find({});
        const orders = await cursor.toArray();
        res.send(orders);
    })
     // DELETE PRODUCT FROM ORDER API
   // DELETE API
   app.delete('/orders/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await orderCollection.deleteOne(query);
    res.json(result);
})


// Getting Single Orders from Orders
    app.get('/orders/:id' , async (req , res)=>{
        const id = req.params.id;
        console.log('Getting Specific ID ' , id)
        const query = {_id: ObjectId(id)}
        const order = await orderCollection.findOne(query);
        res.json(order);
    } )

   
    
    }
    finally{
        // client.close()
    }
}
run().catch(console.dir)

app.get('/', (req,res)=>{
    res.send('Travel Server is running')
})

app.listen(port, ()=>{
    console.log('Server is running on ', port);
})