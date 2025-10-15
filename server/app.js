const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const cookieParser = require('cookie-parser');
const authUtils = require('./utils/authUtils');
const axios = require('axios');

require('dotenv').config();

const app = express();

const protocol = process.env.GD_WEB_USE_HTTPS === 'true' ? 'https' : 'http';

app.use((req, res, next) => {
	console.log('Origin:', req.headers.origin);
	next();
});

// see: https://github.com/expressjs/cors#configuration-options
const corsOptions = {
	origin: ['localhost', '0.0.0.0'].includes(process.env.GD_WEB_DOMAIN || '')
  ? `${protocol}://${process.env.GD_WEB_DOMAIN}:${process.env.GD_WEB_SERVER_PORT}`
  : `${protocol}://${process.env.GD_WEB_DOMAIN}`,
	credentials: true
};


app.use(cookieParser());

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req, res }) => {
		// the token is the "live" token with a short expiry time, passed along with every request in a header while
		// the user is logged in
		const token = (req.headers.authorization || '').replace('Bearer ', '');

		// try to retrieve a user with the token
		const user = authUtils.getUser(token);

		// provides the auth token to all resolvers, plus access to the original request + response objects for
		// more fine-tune stuff
		return {
			res,
			req,
			token,
			user
		};
	}
});

server.applyMiddleware({
	app,
	cors: corsOptions
});

const { XMLParser } = require('fast-xml-parser');

const EXISTDB_URL = "http://host.docker.internal:8080/exist/rest/db"
const COLLECTION = "nodejs_test"
const AUTH = {
	username: 'admin',
	password: ''
};

app.get('/healthz', (req, res) => {
	res.status(200).send("Hey Sherpa"); 
})
app.use('/upload-w2', express.raw({ type: 'application/xml' }));

// 💥 Manually handle pre-flight CORS (OPTIONS)
app.options('/upload-w2', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.sendStatus(200);
});

app.post('/upload-w2', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	try {
		const xml = req.body.toString();

		// Parse XML for debugging/logging
		const parser = new XMLParser();
		const parsedData = parser.parse(xml);
		console.log('✅ Parsed XML:', parsedData);

		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
		const DOCUMENT_NAME = `test_${timestamp}.xml`;
		const FULL_URL = `${EXISTDB_URL}/${COLLECTION}/${DOCUMENT_NAME}`

		// Upload XML to eXist-db
		const response = await axios.put(FULL_URL, xml, {
			headers: {
				'Content-Type': 'application/xml'
			},
			auth: AUTH
		});

		if ([200, 201, 204].includes(response.status)) {
			console.log("✅ XML uploaded successfully to eXist-db!");
			res.send('✅ XML parsed and uploaded to eXist-db!');
		} else {
			console.error("❌ Upload failed:", response.status, response.statusText);
			res.status(500).send("❌ Upload failed to eXist-db");
		}
	} catch (error) {
		console.error("❌ Error:", error.message);
		res.status(500).send("❌ Server error while processing XML");
	}
  });

app.listen(process.env.GD_API_SERVER_PORT, () => {
	console.log('Server started on port ' + process.env.GD_API_SERVER_PORT);
	console.log('MariaDB database host is ' + process.env.GD_MYSQL_HOST);
});
