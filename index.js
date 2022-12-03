const MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://riddhi:riddhi03@cluster0.zrgciu5.mongodb.net/test";
const client = new MongoClient(url); 


async function main(){
     await client.connect();
     await client.db("db").command({ping: 1});
     console.log("Connected successfully to server");
}

async function insert(name, ticker) {
     const col = client.db("db").collection("equities");
     const doc = {
         name: name,
         ticker: ticker,
     }
     const result = await col.insertOne(doc);
 
 }

async function readData() {
     await main()
     var fs = require('fs'),
         path = './companies.csv';
      await fs.readFile(path, {encoding: 'utf-8'}, async function (err, data) {
         var lines = data.split("\n");
         for (let i = 1; i < lines.length; i++) {
             var data = lines[i].split(",")
             console.log(data)
             await insert(data[0], data[1])
         }
         await client.close();
 
     });
 }
 readData();