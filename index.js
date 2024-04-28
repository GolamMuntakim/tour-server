const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
// middlewre
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ajfjwu7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)



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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const placeCollection = client.db('placeDB').collection('place');
    const countryCollection = client.db('placeDB').collection('CountryDB')
    app.get('/country', async(req,res)=>{
        const country = countryCollection.find()
        const result = await country.toArray();
        console.log(result)
        res.send(result)
    })
    app.get('/viewdetail/:countryname',async(req, res)=>{
        console.log(req.params.countryname)
        const result= await placeCollection.find({countryname:req.params.countryname}).toArray()
        console.log(result)
        res.send(result)
    })
    app.get('/details/:id',async(req, res)=>{
        console.log(req.params.id)
        const result= await placeCollection.findOne({_id:new ObjectId(req.params.id)})
        console.log(result)
        res.send(result)
    })
    app.get('/places',async(req, res)=>{
        const cursor = placeCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })
    app.post('/places',async(req,res)=>{
        const newPlaces = req.body;
        // console.log(newPlaces)
        const result = await placeCollection.insertOne(newPlaces)
        res.send(result);
    })
    //user related apis
    app.get("/mylist/:usermail",async(req,res)=>{
        console.log(req.params.usermail)
        const result = await placeCollection.find({usermail:req.params.usermail}).toArray()
        res.send(result)
     })
     app.get("/singleplace/:id", async(req,res)=>{
        console.log(req.params.id)
        const result = await placeCollection.findOne({_id:new ObjectId(req.params.id)})
        console.log(result)
        res.send(result)
     })
     app.put("/update/:id", async(req, res)=>{
        console.log(req.params.id)
        const query = {_id:new ObjectId(req.params.id)};
        const data={
            $set:{
                name : req.body.name,
                image: req.body.image,
                countryname:req.body.countryname,
                cost:req.body.cost,
                time:req.body.time,
                email:req.body.email,
                spotname:req.body.spotname,
                location : req.body.location,
                season:req.body.season,
                visitor: req.body.visitor,
                description:req.body.description,

            }
        }
        const result= await placeCollection.updateOne(query,data);
        console.log(result);
        res.send(result)
     })
     app.delete("/delete/:id",async(req,res)=>{
        const result = await placeCollection.deleteOne({_id:new ObjectId(req.params.id)})
        console.log(result)
        res.send(result)
     })
   

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('server is running');
})
app.listen(port,()=>{
    console.log(`server is running on port:${port}`)
})