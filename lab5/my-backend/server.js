const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const app = express();
app.use(cors());
app.use(express.json());

// Ініціалізація Firebase Admin SDK
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

// Middleware для перевірки токена
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Неавторизовано: токен відсутній' });
    }
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Неавторизовано: недійсний токен', error: error.message });
    }
};

// GET /api/users - Отримання всіх користувачів (для адмінських цілей)
app.get('/api/users', verifyToken, async (req, res) => {
    try {
        const snapshot = await db.collection('users').get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні користувачів', error: error.message });
    }
});

// POST /api/register - Реєстрація нового користувача
app.post('/api/register', async (req, res) => {
    const { email, password, displayName } = req.body;
    if (!email || !password || !displayName) {
        return res.status(400).json({ message: 'Відсутні обов’язкові поля' });
    }
    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName,
        });
        await db.collection('users').doc(userRecord.uid).set({
            email,
            displayName,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        res.status(201).json({ message: 'Користувач успішно зареєстрований', uid: userRecord.uid });
    } catch (error) {
        res.status(400).json({ message: 'Помилка при реєстрації', error: error.message });
    }
});

// POST /api/login - Підтвердження користувача (автентифікація завершується клієнтом)
app.post('/api/login', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Відсутній email' });
    }
    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        res.json({ message: 'Користувач підтверджений', uid: userRecord.uid });
    } catch (error) {
        res.status(401).json({ message: 'Невірний email', error: error.message });
    }
});

// POST /api/logout - Обробка виходу користувача
app.post('/api/logout', verifyToken, async (req, res) => {
    try {
        res.json({ message: 'Вихід успішний' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при виході', error: error.message });
    }
});

// GET /api/courses - Отримання всіх курсів
app.get('/api/courses', async (req, res) => {
    try {
        const snapshot = await db.collection('courses').get();
        const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні курсів', error: error.message });
    }
});

// POST /api/start-course - Початок курсу
app.post('/api/start-course', verifyToken, async (req, res) => {
    const { courseTitle } = req.body;
    if (!courseTitle) {
        return res.status(400).json({ message: 'Відсутній заголовок курсу' });
    }
    try {
        const userId = req.user.uid;
        await db.collection('users').doc(userId).collection('startedCourses').doc(courseTitle).set({
            courseTitle,
            startedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        res.status(201).json({ message: 'Курс успішно розпочато' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при початку курсу', error: error.message });
    }
});

// POST /api/reviews - Збереження відгуку
app.post('/api/reviews', verifyToken, async (req, res) => {
    const { courseId, text, rating, createdAt } = req.body;
    if (!courseId || !text || !rating || !createdAt) {
        return res.status(400).json({ message: 'Відсутні обов’язкові поля' });
    }
    try {
        await db.collection('reviews').add({
            courseId,
            userId: req.user.uid,
            text,
            rating: Number(rating),
            createdAt,
        });
        res.status(201).json({ message: 'Відгук успішно збережено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при збереженні відгуку', error: error.message });
    }
});

// GET /api/profile - Отримання даних профілю
app.get('/api/profile', verifyToken, async (req, res) => {
    try {
        const userDoc = await db.collection('users').doc(req.user.uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: 'Користувач не знайдений' });
        }
        res.json(userDoc.data());
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні профілю', error: error.message });
    }
});

// POST /api/profile - Збереження даних профілю
app.post('/api/profile', verifyToken, async (req, res) => {
    const { name, email, updatedAt } = req.body;
    if (!name || !email || !updatedAt) {
        return res.status(400).json({ message: 'Відсутні обов’язкові поля' });
    }
    try {
        await db.collection('users').doc(req.user.uid).set({
            name,
            email,
            updatedAt,
        });
        res.status(201).json({ message: 'Дані профілю збережено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при збереженні профілю', error: error.message });
    }
});

// GET /api/started-courses - Отримання розпочатих курсів
app.get('/api/started-courses', verifyToken, async (req, res) => {
    try {
        const snapshot = await db.collection('users').doc(req.user.uid).collection('startedCourses').get();
        const courses = snapshot.docs.map(doc => doc.data().courseTitle);
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні курсів', error: error.message });
    }
});

// POST /api/complete-course - Позначення курсу як завершеного
app.post('/api/complete-course', verifyToken, async (req, res) => {
    const { courseTitle } = req.body;
    if (!courseTitle) {
        return res.status(400).json({ message: 'Відсутній заголовок курсу' });
    }
    try {
        await db.collection('users').doc(req.user.uid).collection('completedCourses').doc(courseTitle).set({
            courseTitle,
            completedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        res.status(201).json({ message: 'Курс позначено як завершений' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при завершенні курсу', error: error.message });
    }
});

// DELETE /api/completed-courses - Очищення завершених курсів
app.delete('/api/completed-courses', verifyToken, async (req, res) => {
    try {
        const batch = db.batch();
        const snapshot = await db.collection('users').doc(req.user.uid).collection('completedCourses').get();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        res.json({ message: 'Завершені курси очищено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при очищенні курсів', error: error.message });
    }
});


const path = require('path');

// Роздача збілдженого React-фронтенду
app.use(express.static(path.join(__dirname, '../client/build')));

// Для всіх GET-запитів, які не є API — віддати index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Запуск сервера
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});