const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: 'e3b723a2fa82470780279e33a25d646e'
});

const handleApiCall = (req, res) => {
	app.models
		.predict( Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then( data => res.json(data))
		.catch(error => res.status(400).json('Error API'))
}

const imageEntriesUpdate = (req, res, db) => {
	const { id } = req.body;
	db('tbusers').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			// console.log(entries);
			if (entries.length) {
				res.json(entries[0]);
			} else {
				res.status(400).json('Update Failed')
			}
		})
		.catch(error => res.status(400).json('Error update entries'))
}

module.exports = {
	imageEntriesUpdate: imageEntriesUpdate,
	handleApiCall: handleApiCall
}