const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');

// https://knexjs.org/
const db = knex({
  client: 'pg',
  // connection: {
  //   host : process.env.POSTGRES_HOST,
  //   user : process.env.POSTGRES_USER,
  //   // port: 5432,
  //   password : process.env.POSTGRES_PASSWORD,
  //   database : process.env.POSTGRES_DB
  // }
  connection: process.env.POSTGRES_URI
});

const app = express();
// console.log('running!Yes!');
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));

app.get('/', (req, res) => {
  // db.select('*').from('tbusers').then(data => res.send(data));
  res.send('It is Working');
})

// SIGN IN
// app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/signin', signin.signinAuthentication(db, bcrypt))

// REGISTER
// app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.post('/register', register.rigisterAuthentication(db, bcrypt))

// PROFILE # auth.requireAuth for Authorization Middleware
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleGetProfile(req, res, db) })
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db) })

// ENTRIES
app.put('/image', auth.requireAuth, (req, res) => { image.imageEntriesUpdate(req, res, db) })

// API CALL
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) })

// app.set('port', (process.env.PORT || 3001));
// const PORT = app.get('port');

// app.listen(PORT, () => {
// 	console.log('app is running on port', PORT);
// })

app.listen(3001, () => {
	console.log('app is running on port 3001');
})

/*
// PLAN
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/