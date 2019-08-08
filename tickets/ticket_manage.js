const express = require('express');
const { Client } = require('pg')
const app = express();
const port = 7878;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({exended : false}));
app.use((req,res,next)=>{
	res.set('Access-Control-Allow-Origin', '*');
	res.set('Access-Control-Allow-Headers','content-type');
	return next();
});

const client = new Client({
    user: 'bosmanwillem94',
    host: 'localhost',
    database: 'fixit',
    password: 'mieper',
    port: 5432,
})

client.connect()

app.get('/api/v1/tickets', (req, expressres) => {
    client.query('SELECT * FROM tickets', (err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          console.log("sending data");
          out =
          {
              success: 'true',
              rows: res.rows
          };
          expressres.status(200).send(out);
        }
      })
});

app.post('/api/v1/tickets', (req, expressres) => {
    const query = {
        text: 'INSERT INTO tickets (customer_name, assigned_technician, device_model, device_status, device_notes) VALUES($1, $2, $3, $4, $5)',
        values: [req.body.customer_name,
        req.body.assigned_technician, req.body.device_model,
        req.body.device_status, req.body.device_notes],
    }
    
    client.query(query, (err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          console.log("values inserted");
          out ={success: 'true'};
          expressres.status(200).send(out);
        }
      })


});


app.listen(port, () => {console.log("Database Server listening on port ..." + port)})

