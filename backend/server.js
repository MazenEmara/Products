const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const product_routes = require("./controllers/productControllers");
const bodyParser = require("body-parser");
const productRouter = require("./routes/Products");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;


const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
console.log("MongoDB database connection established successfully");
})
app.use(cors());
app.use(bodyParser.json());
app.use(productRouter);


app.use(express.json());
app.listen(port, () => {
console.log(`Server is running on port: ${port}`);
});

//app.patch('/products/inventory');
////////////////////////////////////

var cron = require('node-cron');
const fs = require("fs");
const mongodb = require("mongodb").MongoClient;
const fastcsv = require("fast-csv");
// let url = "mongodb://username:password@localhost:27017/";
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let url = "mongodb+srv://ELsheikh:ELsheikh@cluster0.hehgw.mongodb.net/cluster0?retryWrites=true&w=majority";
let post_url = "http://localhost:3000/products/add"
let stream = fs.createReadStream("./csvin/csvfileim.csv");
let csvData = [];
var task = cron.schedule('* * * * *', () =>  {
    let csvStream = fastcsv
    .parse()
    .on("data", function(data) {
        csvData.push({
            Product_name: data[0],
            Price: data[1],
            weight: data[2],
            description: data[3],
            image: data[4],
            category: data[5],
            quantity : data[6]
        });
    })
    .on("end", function() {
            // remove the first line: header
        csvData.shift();
        for (var i=0;i<csvData.length;i++){
                //console.log(csvData[i])
            let xhr = new XMLHttpRequest();
            xhr.open("POST", post_url);
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
                // xhr.onload = () => console.log(xhr.responseText);
            xhr.send(JSON.stringify(csvData[i]));
        }
    });
        stream.pipe(csvStream);
});
task.start();
setTimeout(function(){
    task.stop();
}, 1000*61);