const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;


let serviceAccount;


if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        if (!serviceAccount.project_id) {
            throw new Error('Service account object must contain a "project_id" property');
        }
    } catch (error) {
        console.error('Помилка ініціалізації Firebase Admin SDK із змінної середовища:', error.message);
        process.exit(1);
    }
} else {

    try {
        serviceAccount = require('./serviceAccountKey.json');
        if (!serviceAccount.project_id) {
            throw new Error('Service account object must contain a "project_id" property');
        }
    } catch (error) {
        console.error('Помилка ініціалізації Firebase Admin SDK із локального файлу:', error.message);
        process.exit(1);
    }
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();


app.use(express.json());

// Перевірка наявності папки build
const buildPath = path.join(__dirname, 'build');
if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));
    console.log('Папка build знайдена, статичні файли підключені');
} else {
    console.warn('Папка build відсутня. Статичні файли не будуть обслуговуватися');
}


const authenticate = async (req, res, next) => {
    console.log('Запит до:', req.path); // Дебаг маршрутів
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Токен автентифікації відсутній' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = { uid: decodedToken.uid };
        next();
    } catch (error) {
        console.error('Помилка перевірки токену:', error);
        res.status(401).json({ error: 'Недійсний токен автентифікації' });
    }
};


app.post('/api/user', authenticate, async (req, res) => {
    const { name, email } = req.body;
    const userId = req.user.uid;

    if (!name || !email) {
        return res.status(400).json({ error: 'Ім’я та email обов’язкові' });
    }

    try {
        await db.collection('users').doc(userId).set({
            name,
            email,
            updatedAt: new Date().toISOString(),
        });
        res.status(200).json({ message: 'Дані успішно збережено' });
    } catch (error) {
        console.error('Помилка при збереженні даних користувача:', error);
        res.status(500).json({ error: 'Помилка при збереженні даних' });
    }
});


app.get('/api/user', authenticate, async (req, res) => {
    const userId = req.user.uid;

    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) { // Змінено userDoc.exists на userDoc.exists()
            res.status(200).json(userDoc.data());
        } else {
            res.status(200).json({ name: '', email: '' });
        }
    } catch (error) {
        console.error('Помилка при отриманні даних користувача:', error);
        res.status(500).json({ error: 'Помилка при отриманні даних' });
    }
});


app.get('/api/courses', async (req, res) => {
    try {
        const querySnapshot = await db.collection('courses').get();
        const courses = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.status(200).json(courses);
    } catch (error) {
        console.error('Помилка при отриманні курсів:', error);
        res.status(500).json({ error: 'Не вдалося завантажити курси' });
    }
});


app.post('/api/reviews', authenticate, async (req, res) => {
    const { courseId, text, rating } = req.body;
    const userId = req.user.uid;

    if (!courseId || !text || !rating) {
        return res.status(400).json({ error: 'Усі поля обов’язкові' });
    }

    try {
        await db.collection('reviews').add({
            courseId,
            userId,
            text,
            rating,
            createdAt: new Date().toISOString(),
        });
        res.status(201).json({ message: 'Відгук успішно збережено' });
    } catch (error) {
        console.error('Помилка при збереженні відгуку:', error);
        res.status(500).json({ error: 'Помилка при збереженні відгуку' });
    }
});


app.post('/api/login', async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ error: 'Токен автентифікації обов’язковий' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        res.status(200).json({ message: 'Успішний вхід', uid: decodedToken.uid });
    } catch (error) {
        console.error('Помилка входу:', error);
        res.status(401).json({ error: 'Недійсний токен автентифікації' });
    }
});


app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Електронна пошта та пароль обов’язкові' });
    }

    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
        });
        const idToken = await admin.auth().createCustomToken(userRecord.uid);
        res.status(201).json({ message: 'Користувача створено', uid: userRecord.uid, idToken });
    } catch (error) {
        console.error('Помилка реєстрації:', error);
        res.status(400).json({ error: error.message });
    }
});


app.post('/api/logout', (req, res) => {
    res.status(200).json({ message: 'Вихід успішний' });
});

// Обслуговування React-додатку для всіх інших маршрутів
app.get('/', (req, res) => {
    console.log('Обробка маршруту:', req.path); // Дебаг для перевірки маршрутів
    if (fs.existsSync(buildPath)) {
        res.sendFile(path.join(buildPath, 'index.html'));
    } else {
        res.status(404).json({ error: 'Папка build відсутня, React-додаток недоступний' });
    }
});


app.get('/api/reviews/:courseId', async (req, res) => {
    const { courseId } = req.params;

    try {
        const querySnapshot = await db
            .collection('reviews')
            .where('courseId', '==', courseId)
            .get();

        const reviews = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const createdAt = new Date(data.createdAt);
            const dateFormatted = createdAt.toLocaleDateString('uk-UA', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            return {
                id: doc.id,
                ...data,
                dateFormatted,
            };
        });


        reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Помилка при отриманні відгуків:', error);
        res.status(500).json({ error: 'Не вдалося отримати відгуки' });
    }
});


// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущено на порту ${port}`);
});