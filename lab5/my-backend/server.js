const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.listen(5000, () => {
    console.log('Server started on port 5000...');
})

const admin = require('firebase-admin');
const serviceAccount = require("serviceAccountKey.json");
admin.initializeApp({ credential: admin.credential.cert((serviceAccount)) });
const db = admin.firestore();

app.get("/api/users", async (req, res) => {
    const snapshot = await
db.collection("users").get();
    const users = [];
    snapshot.forEach((doc) => {
        users.push({ id: doc.id , ...doc.data() });
    });
    res.json(users);
});

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split("Bearer")[1];
    if(!token){
        return res.status(401).json({ message: "Unauthorized"});
    }
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();

    app.get("/api/protected", verifyToken, (req, res) => {
       res.json({ message: "You have accessed a protected route!", user: req.user});
    });
}

