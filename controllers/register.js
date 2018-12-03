const jwt = require('jsonwebtoken');
const redis = require("redis");

// Setup redis
redisClient = redis.createClient(process.env.REDIS_URI);

const capitalizeEachWords = (str) => str.toLowerCase().replace(/^\w|\s\w/g, (letter) => letter.toUpperCase())

const signToken = (email) => {
	const jwtPayload = { email };
	return jwt.sign(jwtPayload, 'JWT_SECRET', { expiresIn: '2 days' });
}

const setToken = (key, value) => {
	return Promise.resolve(redisClient.set(key, value))
}

const createSessions = (user) => {
	// JWT Token, return users data
	const { email, id } = user;
	const token = signToken(email);
	return setToken(token, id)
		.then(() => {
			return { success: 'true', userId: id, token }
		})
		.catch(console.log)
}

const handleRegister = (db, bcrypt, req, res) => {
	const { email, name, password } = req.body;

	if ( !email || !name || !password) {
		return Promise.reject('incorrect register form submission');
	}

	var hash = bcrypt.hashSync(password);
	// console.log(hash)
	return db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email.toLowerCase()
		})
		.into('tblogin')
		.returning('email')
		.then(loginEmail => {
			return trx('tbusers')
				.returning('*')
				.insert({
					name: capitalizeEachWords(name),
					email: loginEmail[0].toLowerCase(),
					joined: new Date()
				})
				.then(user => user[0])
				.catch(error => Promise.reject('There is problem to register user'))
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(error => res.status(400).json('unable to register'));
}

const rigisterAuthentication = (db, bcrypt) => (req, res) => {
	const { authorization } = req.headers;
	return authorization ? getAuthTokenId(req, res) : 
		handleRegister(db, bcrypt, req, res)
			.then(data => {
				return createSessions(data);
			})
			.then(session => res.json(session))
			.catch(error => res.status(400).json(error))
	
}

module.exports = {
	rigisterAuthentication: rigisterAuthentication,
	redisClient: redisClient
}