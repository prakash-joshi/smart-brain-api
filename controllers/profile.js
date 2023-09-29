const handleGetProfile = (req, res, pgdb) => {
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
}


module.exports = {
    handleGetProfile: handleGetProfile
}