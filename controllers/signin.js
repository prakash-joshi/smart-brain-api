
const handleSignin = (req, res, pgdb, bcrypt) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('incorrect user credentials.')
    }
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
                console.log('here');
                res.status(400).json('wrong credentials')
            }
        })
        .catch(error => {
            console.log('there');
            res.status(400).json('wrong credentials')
        })

}
module.exports = {
    handleSignin: handleSignin
}