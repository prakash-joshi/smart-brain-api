const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(cors());
const bcrypt = require('bcrypt');
const saltRounds = 10;
const knex = require('knex');

const pgdb = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'pwd@123',
        database: 'smart-brain',
    }
});

app.get('/', (req, res) => {
    res.send(database.users)
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    pgdb.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash)
            if (isValid) {
                return pgdb.select('*')
                    .from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(error => {
                        res.status(400).json('unable to get user')
                    })
            }
            else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(error => {
            res.status(400).json('wrong credentials')
        })
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password, saltRounds);
    pgdb.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date()
                    })
                    .then(user => { res.json(user[0]) })
                    .catch(error => res.status(400).json('unable to register'))
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    pgdb.select('*').from('users')
        .where({
            id: id
        })
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            }
            else {
                res.status(400).json('user not found');
            }
        })
        .catch(error => res.status(400).json('error getting user'))
});

app.put('/image', (req, res) => {
    const { id } = req.body;

    pgdb('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(error => res.status(400).json('unable to get entries'))

})

app.listen(PORT, () => {
    console.log(`app is running on http://localhost:${PORT}.`);
})

