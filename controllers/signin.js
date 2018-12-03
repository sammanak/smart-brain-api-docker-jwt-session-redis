const jwt = require('jsonwebtoken');
const redis = require("redis");

// Setup redis
redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignin = (db, bcrypt, req, res) => {
	const { email, password } = req.body;

	if ( !email || !password) {
		// return res.status(400).json('incorrect form submission');
		return Promise.reject('incorrect signin form submission');
	}

	return db.select('email', 'hash').from('tblogin')
		.where('email', '=', email.toLowerCase())
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				return db.select('*').from('tbusers')
					.where('email', '=', email.toLowerCase())
					.then(user => user[0])
					.catch(error => Promise.reject('Unable to get user'))
			} else {
				res.status(400).json('Wrong credential')
			}
		})
			.catch(error => Promise.reject('Error wrong credential'))
}

const getAuthTokenId = (req, res) => {
	// console.log('auth ok');
	const { authorization } = req.headers;
	redisClient.get(authorization, (err, reply) => {
		if(err || !reply) {
			return res.status(400).json('Unauthorized');
		}
		return res.json({id: reply});
	})
}

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

const signinAuthentication = (db, bcrypt) => (req, res) => {
	const { authorization } = req.headers;
	return authorization ? getAuthTokenId(req, res) : 
		handleSignin(db, bcrypt, req, res)
			.then(data => {
				return data.id && data.email ? createSessions(data) : Promise.reject(data)
			})
			.then(session => res.json(session))
			.catch(error => res.status(400).json(error))
	
}

module.exports = {
	signinAuthentication: signinAuthentication,
	redisClient: redisClient
}