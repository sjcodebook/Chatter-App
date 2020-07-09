const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require('./keys/admin.json')),
});

const express = require('express');
const app = express();

app.get('/getChirps', async (req, res) => {
  await admin
    .firestore()
    .collection('chirps')
    .get()
    .then((data) => {
      let chirps = [];
      data.forEach((doc) => {
        chirps.push(doc.data());
      });
      return res.json(chirps);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post('/createChirp', async (req, res) => {
  const newChirp = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  };

  await admin
    .firestore()
    .collection('chirps')
    .add(newChirp)
    .then((doc) => {
      res.json({ message: `document with ${doc.id} is created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: 'Something went wrong' });
      console.log(err);
    });
});

exports.api = functions.https.onRequest(app);
