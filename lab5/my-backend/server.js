const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend (якщо React-білд всередині папки client/)
app.use(express.static(path.join(__dirname, 'client', 'build')));

// --- API route для додавання відгуків ---
app.post('/api/reviews', async (req, res) => {
    const { courseId, userId, text, rating } = req.body;

    if (!courseId || !userId || !text || !rating) {
        return res.status(400).json({ error: 'Неповні дані для відгуку' });
    }

    try {
        const admin = require('firebase-admin');

        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(require('./firebase-admin.json')), // Ти маєш згенерувати цей файл вручну
            });
        }

        const db = admin.firestore();

        await db.collection('reviews').add({
            courseId,
            userId,
            text,
            rating,
            createdAt: new Date().toISOString(),
        });

        res.status(200).json({ message: 'Відгук збережено' });
    } catch (err) {
        console.error('Помилка при збереженні відгуку:', err);
        res.status(500).json({ error: 'Серверна помилка' });
    }
});

// Catch-all: React Routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Сервер працює на порту ${PORT}`);
});
