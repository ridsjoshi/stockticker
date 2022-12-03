var http = require('http');
var fs = require('fs');
var qs = require('querystring');
const MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://riddhi:riddhi03@cluster0.zrgciu5.mongodb.net/test";
const client = new MongoClient(url); 
var port = process.env.PORT || 3000;

http.createServer(async function (req, res) {
    if (req.url === "/process") {

        await client.connect();
        await client.db("db").command({ping: 1});

        
        fs.readFile('finalpage.html', async function (err, text) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(text);
            user_input = "";
            req.on('data', input => {
                user_input += input.toString();
            });
 
            req.on('end', () => {
                user_input = qs.parse(user_input);
                company_name = user_input['user_text'];
                company_radio = user_input['choice'] == "company";

                const equities = client.db("db").collection("equities");

                equities.find(company_radio ? {"name": company_name} : {"ticker": company_name + "\r"}).toArray().then((result, err) => {
                  if (result.length === 0) {
                        res.write("No results. Inputted data: " + company_name)
                    }
                    client.close().then(() => {
                    for (let i = 0; i < result.length; i++) {
                        let n = i;
                        res.write("<br>")
                        res.write("Company " + ++n);
                        res.write("<br>" + "Name: " + result[i].name);
                        res.write("<br>" + "Ticker: " + result[i].ticker);
                        res.write("<br>")
                    }
                    res.end();
                    })
                    
                })                
            });
        });
 
 
     } else {
         fs.readFile('index.html', function (err, txt) {
             res.writeHead(200, {'Content-Type': 'text/html'});
             res.write(txt);
             res.end();
         });
     }
 
 
 }).listen(port);
