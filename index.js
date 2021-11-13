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
        const reviewCollection = client.db("nicheProduct").collection("userReview");

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
        //  user review post 
        app.post("/userReview", async (req, res) => {
            const reviewData = req.body;
            console.log(reviewData);
            const result = await reviewCollection.insertOne(reviewData);
            res.send(result);
            console.log(result);
        });

        //find product order width email
        app.get('/myOrders/:email', async (req, res) => {
            const email = req.params.email;
            const result = await purchaseOrdersCollection.find({ email: email }).toArray();
            res.send(result)
        })

        // all purchase
        app.get("/allPurchase", async (req, res) => {
            const result = await purchaseOrdersCollection.find({}).toArray();
            res.send(result);

        })

        // delete product 
        app.delete('/deleteProduct/:id', async (req, res) => {
            const id = req.params.id;
            const result = await purchaseOrdersCollection.deleteOne({ _id: ObjectId(id) })
            res.send(result);


        })
        // delete manage all products
        app.delete('/manageProductCancel/:id', async (req, res) => {

            const id = req.params.id;

            const result = await purchaseOrdersCollection.deleteOne({ _id: ObjectId(id) })
            res.send(result);
            console.log(result);

        })
        //update status bar
        app.put('/approvedProduct/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const option = { upset: true };
            const updateDoc = {
                $set: {
                    status: "Shipped"
                },
            }
            const result = await purchaseOrdersCollection.updateOne(filter, updateDoc, option);
            res.send(result)
            console.log(result);
        })

        //// post  users Data
        app.post("/usersData", async (req, res) => {
            const result = await usersCollection.insertOne(req.body);
            res.send(result);

        });

        // filter admin email
        app.get('/usersData/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const user = await usersCollection.findOne(filter);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        //up-sert google imformation
        app.put("/usersData", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);

        });

        //update admin filed
        app.put('/usersData/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = {
                $set: {
                    role: 'admin'
                }
            };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result)

        })
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
