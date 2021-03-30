const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pizzd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
client.connect((err) => {
	console.log(err);
	const EventCollection = client.db("Volunteer").collection("Events");
	// perform actions on the collection object
	console.log("Database connected");

	app.post("/addEvent", (req, res) => {
		const eventData = req.body;
		console.log(eventData);
		EventCollection.insertOne(eventData).then((result) => {
			res.send(result.insertedCount > 0);
		});
	});

	app.get("/runningEvents", (req, res) => {
		EventCollection.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});

	// client.close();
});

app.listen(port);
