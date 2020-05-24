var admin = require('firebase-admin');
var serviceAccount = require(process.env.GARAGEFIREBASESERVICEKEY)
var dbUrl = process.env.GARAGEFIREBASEDBURL

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: dbUrl
});

let firestore = admin.firestore();

const onSignIn = (user) => {
  
  let transaction = firestore.runTransaction(t => {
    var docRef = firestore.collection('users').doc(user.id);
    return t.get(docRef)
      .then(doc => {
        if(doc.exists){
          t.update(docRef, {lastSignIn: admin.firestore.FieldValue.serverTimestamp()});
          return Promise.resolve(200)
        }
        t.create(docRef,createUserProfile(user));
        return Promise.resolve(200)
    });
  }).then(result => {
    console.log('Transaction success!', result);
  }).catch(err => {
    console.log('Transaction failure:', err);
  });
}

function createUserProfile(user){
  return {
    ...user,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastSignIn: admin.firestore.FieldValue.serverTimestamp()
  }
}

const checkIfAuthorized = (req, res, next) => {
  try {
    let docRef = firestore.collection('devices').doc(req.params.device);
    docRef.get()
      .then(doc => {
        if (doc.exists && (doc.data().owner===req.query.u)) {
          console.log('Authorization check - Document data:', doc.data());
          return next();
        }
        return res.status(401).send({ error: 'Error finding device.' });
      })
      .catch(err => {
        console.log('Error getting document', err);
        return res.status(500).send({ error: 'Error finding device.' });
      });
  } catch (e) {
    console.log(e)
    return res.status(401).send({ error: 'You are not authorized to make this request' });
  }
 };


const getAuthToken = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    req.authToken = req.headers.authorization.split(' ')[1];
  } else {
    req.authToken = null;
  }
  next();
};


const checkIfAuthenticated = (req, res, next) => {
 getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      const userInfo = await admin
        .auth()
        .verifyIdToken(authToken);
      req.authId = userInfo.uid;
      return next();
    } catch (e) {
      console.log(e)
      return res
        .status(401)
        .send({ error: 'You are not authorized to make this request' });
    }
  });
};

exports.checkIfAuthenticated = checkIfAuthenticated;
exports.checkIfAuthorized = checkIfAuthorized;
exports.onSignIn = onSignIn;
exports.firestore = firestore;
exports.adminFirestore = admin.firestore;