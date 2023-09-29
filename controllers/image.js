
const handleImage = (req, res, pgdb) => {
    const { id } = req.body;

    pgdb('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(error => res.status(400).json('unable to get entries'))

}

module.exports = {
    handleImage: handleImage
}