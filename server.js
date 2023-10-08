const express = require('express');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const bcrypt = require('bcrypt');
const saltRounds = 10; // used to set number of encryption rounds for hashing
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(cors());

const pgdb = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'pwd@123',
        database: 'smart-brain',
    }
});

app.get('/', (req, res) => { res.send(database.users) });

app.post('/signin', (req, res) => { signin.handleSignin(req, res, pgdb, bcrypt) });

app.post('/register', (req, res) => { register.handleRegister(req, res, pgdb, bcrypt, saltRounds) });

app.get('/profile/:id', (req, res) => { profile.handleGetProfile(req, res, pgdb) });

app.put('/image', (req, res) => { image.handleImage(req, res, pgdb) });

app.listen(PORT, () => { console.log(`app is running on http://localhost:${PORT}.`); })

