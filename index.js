//user: nicheUser

// pass: GOw1G5OvJ6CdU7F9
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.udlsf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log('database connected successfull niche ');
        const productsCollection = client.db("nicheProduct").collection("products");
        const usersCollection = client.db("nicheProduct").collection("users");
        const purchaseOrdersCollection = client.db("nicheProduct").collection("purchaseOrders");

        // add Products post
        app.post("/addToProducts", async (req, res) => {
            const productsData = req.body;
            const result = await productsCollection.insertOne(productsData);
            res.send(result);
        });

        //get  limited  products 
        app.get("/limitProducts", async (req, res) => {
            const result = await productsCollection.find({}).limit(6).toArray();
            res.send(result);

        })
        //get  all products 
        app.get("/exploreProducts", async (req, res) => {
            const result = await productsCollection.find({}).toArray();
            res.send(result);

        })

        // single product detaile database
        app.get("/singleProduct/:id", async (req, res) => {
            const id = req.params.id;
            const result = await productsCollection.find({ _id: ObjectId(id) }).toArray();
            res.send(result[0]);
            console.log(result[0]);
        })
        // /addProductOrder
        app.post("/addProductOrder", async (req, res) => {
            const productsData = req.body;
            const result = await purchaseOrdersCollection.insertOne(productsData);
            res.send(result);
        });

    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('niche watche hitt!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
