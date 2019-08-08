const express = require('express');
const { Client } = require('pg')
const app = express();
const port = 6969;
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

var username = "";
var password = "";

app.post('/dbapi/v1/fixitlogin', (req, expressres) =>{
  console.log(req.body);
  console.log(req.header.toString);
	if(!req.body.username || !req.body.password){
		return expressres.send(400).send({
			success: 'false',
			message: 'your json sucks brah'
		});
	}
	else{
        const text = 'SELECT * FROM users WHERE user_email = $1 AND user_password = crypt($2, user_password)';
        username = req.body.username;
        password = req.body.password;
        const values =[username,password]
        console.log("boutta query...");
         client.query(text, values, (err, res) => {
            if (err) {
              console.log(err.stack)
            } else {
            if(res.rows.length === 1){
              console.log("login successful");
              return expressres.status(201).send({
                success: 'true'
                })
              }
            else{
              console.log("invalid login");
              return expressres.status(401).send({
                success: 'false',
                message: 'invalid login'
              })
            }  
            }
          })	 
	}
});

app.listen(port, () => {console.log("Login Server listening on port ..." + port)})