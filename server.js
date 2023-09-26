const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(cors());
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

// pgdb.select('*').from('users')
//     .then(data => console.log(data))


const database = {
    users: [
        {
            id: '101',
            name: 'Ramesh',
            email: 'ramesh@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date(),
        },
        {
            id: '102',
            name: 'Suresh',
            email: 'suresh@gmail.com',
            password: 'cakes',
            entries: 0,
            joined: new Date(),
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users)
});

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email
        && req.body.password === database.users[0].password) {
        res.json(database.users[0])
    } else {
        res.status(400).json('error logging in');
    }
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    pgdb('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
        })
        .then(user => { res.json(user[0]) })
        .catch(error => res.status(400).json('unable to register'))
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

