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
  res.set('Access-Control-Allow-Methods','GET, POST, DELETE');
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

app.delete('/api/v1/tickets/:ticket_id', (req, expressres)=>{
    const query = {text: 'DELETE FROM tickets WHERE ticket_id = $1',
          values: [req.params.ticket_id]};
          client.query(query, (err, res) => {
            if (err) {
              console.log(err.stack)
            } 
            else {
              console.log(res);
              console.log("values deleted");
              out ={success: 'true'};
              expressres.status(200).send(out);
            }
          })      
    
});


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


app.post('/api/v1/tickets/editticket', (req, expressres) =>{
    const query = {
      text: 'UPDATE tickets SET customer_name = $1, assigned_technician = $2, device_model = $3, device_notes = $4, device_status = $5 WHERE ticket_id = $6',
      values: [req.body.customer_name, req.body.assigned_technician,
      req.body.device_model, req.body.device_notes, req.body.device_status,
      req.body.ticket_id]
    };
    client.query(query, (err, res) => {
        if(err){
          console.log(err.stack)
        }
        else{
          console.log("updating info");
          expressres.status(200).send({success: "true"});  
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


