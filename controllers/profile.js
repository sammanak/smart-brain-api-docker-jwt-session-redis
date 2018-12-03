const handleGetProfile = (req, res, db) => {
	const { id } = req.params;
	db.select('*').from('tbusers').where({ id: id })
		.then(user => {
			// console.log(user); // [] --> empty array
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json('Not Found')
			}
		})
		.catch(error => res.status(400).json('Error getting users'));
}

const handleProfileUpdate = (req, res, db) => {
	const { id } = req.params;
	const { name, age, pet } = req.body.formInput;
	db('tbusers')
		.where({ id })
		.update({ name, age, pet })
		.then(users => {
			// console.log(user); // [] --> empty array
			if(users) {
				res.json('Success')
			} else {
				res.status(400).json('Unable to update')
			}
		})
		.catch(error => res.status(400).json('Error updating users'))
}

module.exports = {
	handleGetProfile,
	handleProfileUpdate
}