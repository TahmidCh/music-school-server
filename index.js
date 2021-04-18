const express = require('express')
const app = express()

const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello music school server!')
})

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fbsgn.mongodb.net/musicschool?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const teachersCollection = client.db("musicschool").collection("teachers");
    const reviewsCollection = client.db("musicschool").collection("reviews");
    const lessonsCollection = client.db("musicschool").collection("lessons");

    app.post('/addReview', (req, res) => {
        const review = req.body;
        console.log(review);
        reviewsCollection.insertOne(review)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/addTeacher', (req, res) => {
        const teacher = req.body;
        console.log(teacher);
        teachersCollection.insertOne(teacher)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/addLesson', (req, res) => {
        const lesson = req.body;
        console.log(lesson);
        lessonsCollection.insertOne(lesson)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/reviews', (req, res) => {
        reviewsCollection.find()
            .toArray((err, items) =>{
                res.send(items)
            })
    })

    app.get('/teachers', (req, res) => {
        teachersCollection.find()
            .toArray((err, items) =>{
                res.send(items)
            })
    })

    app.get('/lessons', (req, res) => {
        lessonsCollection.find()
            .toArray((err, items) =>{
                res.send(items)
            })
    })
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})