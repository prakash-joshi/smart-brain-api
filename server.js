const express = require('express');
const cors = require('cors')
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(cors());

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
    database.users.push({
        id: '103',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date(),
    });
    res.json(database.users[database.users.length - 1])
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user)
        }
    });
    if (!found) {
        res.status(400).json('no such user')
    }
})

app.post('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries)
        }
    });
    if (!found) {
        res.status(400).json('no such user')
    }
})

app.listen(PORT, () => {
    console.log(`app is running on http://localhost:${PORT}.`);
})

