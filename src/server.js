// import 3rd party libraries
const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const cors = require("cors");

// Mongo connection URL
const MONGODB_URI = "mongodb://localhost:27017/Chart";

const app = express();
app.use(cors());
// Middleware to parse incoming requests
app.use(express.json({ limit: '100mb' }));

// Function to connect to MongoDB and return the database object
async function connectToDatabase() {
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return client.db();
}

// Define the route for posting data to MongoDB
app.post("/api/data", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const chartDetails = req.body;
    // insert the into the DB
    const result = await db.collection("ChartCollection").insertOne(chartDetails);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error saving data to MongoDB:", error);
    res.status(500).json({ error: "Failed to save data to MongoDB." });
  }
});

app.get('/api/chartData', async (req, res) => {
    try {
      const db = await connectToDatabase();
      // Assuming you have a collection named 'your_collection_name' in your MongoDB
      const chartAllData = await db.collection('ChartCollection').find({}).toArray();
  
      res.status(200).json({ chart : chartAllData });
    } catch (error) {
      console.error('Error fetching chart data:', error);
      res.status(500).json({ error: 'Failed to fetch Chart Details.' });
    }
});


const PORT = 3008; // You can change this port number if needed
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
