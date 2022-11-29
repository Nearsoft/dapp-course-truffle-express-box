const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const Web3 = require('web3');
const truffle_connect = require('./connection/app2.js');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/', express.static('public_static'));

app.get('/getAccounts', (req, res) => {
  console.log("**** GET /getAccounts ****");
  truffle_connect.start(function (answer) {
    console.log('answer ', answer);
    res.send(answer);
  })
});

app.post('/newWritter', async (req, res) => {
  console.log("**** POST /newWritter ****");
  const { writterSign, userId } = req.body;
  console.log('body: ', { writterSign, userId });
  try {
    const response = await truffle_connect.newWritter(writterSign, userId);
    const message = `The transaction to add a new writter was Successful. TX ID: ${response}`;
    console.log({ message });
    res.send(message);
  } catch (err) {
    res.send('Error on transaction ' + err);
  }
});

app.post('/validateWritter', async (req, res) => {
  console.log("**** POST /validateWritter ****");
  const { writterSign, writterId } = req.body;
  console.log('body: ', { writterSign, writterId });
  try {
    const response = await truffle_connect.validateWritter(writterSign, writterId);
    const message = `The writter is: ${response ? 'Valid' : 'Invalid'}`;
    console.log('response ', response);
    console.log({ message });
    res.send({ message, valid: response });
  } catch (err) {
    throw new Error('Error on transaction ' + err);
  }
});

app.post('/newCertificate', async (req, res) => {
  console.log("**** POST /newCertificate ****");
  const { writterId, writterSign, certificate, studentId } = req.body;
  console.log('body: ', req.body);
  try {
    const response = await truffle_connect.newCertificate(writterId, writterSign, certificate, studentId);
    const message = `The transaction to add a new certificate was Successful. TX ID: ${response}`;
    console.log({ message });
    res.send(message);
  } catch (err) {
    throw new Error('Error on transaction ' + err);
  }
});

app.post('/validateCertificate', async (req, res) => {
  console.log("**** POST /validateCertificate ****");
  const { certificate, studentId } = req.body;
  console.log('body: ', req.body);
  try {
    const response = await truffle_connect.validateCertificate(certificate, studentId);
    const message = `The certificate is: ${response ? 'Valid' : 'Invalid'}`;
    console.log({ message });
    res.send({ message, valid: response });
  } catch (err) {
    throw new Error('Error on transaction ' + err);
  }
});

app.listen(port, () => {
  truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  console.log("Express Listening at http://localhost:" + port);
});
