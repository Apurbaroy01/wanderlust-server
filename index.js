const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const app = express()
dotenv.config()

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;

const port = process.env.PORT || 5000



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {

        const destinationCollection = client.db("wanderlust").collection("destinations");

        app.post('/destinations', async (req, res) => {
            console.log(req.body);
            try {
                const destination = req.body;
                const result = await destinationCollection.insertOne(destination);
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        app.get('/destinations', async (req, res) => {
            try {
                const result = await destinationCollection.find().toArray();
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });




        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB✅!");
    } catch (error) {
        console.error("Error connecting to MongoDB:❌", error);
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
