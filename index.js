const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.obwta.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try{
        await client.connect();

        const database = client.db('HostelDB');
        const Student = database.collection('Student');
        const FoodItem = database.collection('FooodItem');
        const Distribution =  database.collection('Distribution')

        app.post('/foodpost', async (req, res) => {
            const data = req.body;
            const result = await FoodItem.insertOne(data)
            res.json(result)
        })

        app.get('/getfooditem', async (req, res) => {
            const cursor = FoodItem.find({})
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let result;
            const count = await cursor.count()
            if(page)
            {
                 result = await cursor.skip(page * size).limit(size).toArray()
            }
            else{
                result = await cursor.toArray();
            }
            res.send({
                result,
                count
            })
        })
        app.delete('/deletefooditem/:id', async (req, res) => {
            const id = req.params.id
            const query = {_id : ObjectId(id)};
            const result = await FoodItem.deleteOne(query);
            res.send(result)
        })
        app.get('/getEditItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await FoodItem.findOne(query)
            res.send(result)
        })
        app.put('/putEditItem/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const item = req.body;
            console.log(item)
            const filter = {_id: ObjectId(id)};
            const option = {upser: true}
            const updatedoc = {
                $set:{
                    name: item.name,
                    price: item.price
                } 
            }
            const result = await FoodItem.updateOne(filter, updatedoc, option)
            res.send(result)
        })

        app.post('/studentpost', async (req, res) => {
            const data = req.body;
            const result = await Student.insertOne(data)
            res.json(result)
        })
        app.get('/getStudents', async (req, res) => {
            const cursor = Student.find({})
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let result;
            const count = await cursor.count()
            if(page)
            {
                 result = await cursor.skip(page * size).limit(size).toArray()
            }
            else{
                result = await cursor.toArray();
            }
            res.send({
                result,
                count
            })
        })
        app.delete('/deleteStudent/:id', async (req, res) => {
            const id = req.params.id
            const query = {_id : ObjectId(id)};
            const result = await Student.deleteOne(query);
            res.send(result)
        })
        app.get('/getEditStudent/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await Student.findOne(query)
            res.send(result)
        })
        app.put('/putEditStudent/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const item = req.body;

            const filter = {_id: ObjectId(id)};
            const option = {upser: true}
            const updatedoc = {
                $set:{
                    fullName: item.fullName,
                    roll: item.roll,
                    age: item.age,
                    class: item.class,
                    hall: item.hall,
                    status: item.status,
                } 
            }
            const result = await Student.updateOne(filter, updatedoc, option)
            res.send(result)
        })

        app.put('/changeStatus', async (req, res) => {
            const dataarr = req.body;
            let result ;
            for(data of dataarr){
                if(data.status === 'active'){
                    const filter = { roll: data.roll};
                    const updateDoc = {
                      $set: {
                        status: 'inActive'
                      },
                    };
                     result = await Student.updateMany(filter, updateDoc);
                    
                }
                else{
                    const filter = { roll: data.roll };
                    const updateDoc = {
                      $set: {
                        status: 'active'
                      },
                    };
                     result = await Student.updateMany(filter, updateDoc); 
                }
            }
            res.json(result)
        })

        app.post('/foodlistpost', async (req, res) => {
            const data = req.body
            const result = await Distribution.insertOne(data)
            res.json(result)
        })
        app.get('/getAllstudent', async (req, res) => {
            const cursor = Distribution.find({})
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/getSearchStudent/:roll', async (req, res) => {
            const roll = req.params.roll;
            const query = {roll: roll}
            const result = await Student.findOne(query)
            res.send(result)
        })
        app.get('/getfoodList', async (req, res) => {
            const cursor = FoodItem.find({})
            const result = await cursor.toArray();
            res.send(result)
        })
    }  
    finally{
        
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hostel server is connected');
})
app.listen(port, (req, res) => {
    console.log("Hostel server port is", port)
})