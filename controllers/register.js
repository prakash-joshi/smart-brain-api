const handleRegister = (req, res, pgdb, bcrypt, saltRounds) => {
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
}

module.exports = {
    handleRegister: handleRegister
}