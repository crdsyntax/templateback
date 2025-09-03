const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secret = process.env.JWT_SECRET_KEY;
const sub = process.env.JWT_SUB;
const username = process.env.JWT_USERNAME;
const password = process.env.JWT_PASSWORD;

if (!secret) {
  throw new Error('Falta la variable JWT_SECRET en tu .env');
}

const payload = {
  sub: sub,
  username: username,
  password: password,
};
const token = jwt.sign(payload, secret, { expiresIn: '10h' });
console.log('Bearer ' + token);
