import { useState } from 'react';
import { getAuth } from 'firebase/auth';

const formatDate = (dateString) => {
    if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return 'Н/Д';
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
};

function CourseCard({ course, isStarted, onStart, isLoggedIn }) {
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);

    const durationDisplay = course.course_duration && course.course_duration.start && course.course_duration.end
        ? `${course.course_duration.start.toLocaleString()} - ${course.course_duration.end.toLocaleString()}`
        : 'Н/Д';

    const toggleDetails = () => {
        if (isLoggedIn) {
            setDetailsVisible(!detailsVisible);
        } else {
            alert('Увійдіть, щоб переглянути деталі курсу.');
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            alert('Увійдіть, щоб залишити відгук.');
            return;
        }
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                throw new Error('Користувач не автентифікований');
            }
            const token = await user.getIdToken();
            const response = await fetch('https://iciyhniw-github-io.onrender.com/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    courseId: course.course_title,
                    text: reviewText,
                    rating: reviewRating,
                    createdAt: new Date().toISOString(),
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Помилка при збереженні відгуку');
            }
            alert('Відгук успішно збережено!');
            setReviewText('');
            setReviewRating(5);
        } catch (error) {
            alert('Помилка при збереженні відгуку: ' + error.message);
        }
    };

    return (
        <div className="course-card">
            <h4
                className="course-title"
                onClick={toggleDetails}
            >
                {course.course_title || 'Назва не вказана'}
            </h4>
            {isLoggedIn && detailsVisible && (
                <div className="course-details">
                    <p><strong>Організація:</strong> {course.course_organization || 'Н/Д'}</p>
                    <p><strong>Рівень:</strong> {course.course_difficulty || 'Н/Д'}</p>
                    <p><strong>Рейтинг:</strong> {course.course_rating || 'Н/Д'}</p>
                    <p><strong>Студентів:</strong> {course.course_students_enrolled || 'Н/Д'}</p>
                    <p><strong>Тривалість:</strong> {durationDisplay}</p>
                    <p><strong>Тривалість (тижні):</strong> {course.duration_weeks ? `${course.duration_weeks} тижнів` : 'Н/Д'}</p>
                    <form className="review-form" onSubmit={handleSubmitReview}>
                        <h5>Залишити відгук</h5>
                        <label htmlFor={`review-text-${course.course_title}`}>Ваш відгук:</label>
                        <textarea
                            id={`review-text-${course.course_title}`}
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Введіть ваш відгук"
                            required
                        />
                        <label htmlFor={`review-rating-${course.course_title}`}>Оцінка (1-5):</label>
                        <input
                            type="number"
                            id={`review-rating-${course.course_title}`}
                            value={reviewRating}
                            onChange={(e) => setReviewRating(Number(e.target.value))}
                            min="1"
                            max="5"
                            required
                        />
                        <button type="submit">Надіслати відгук</button>
                    </form>
                </div>
            )}
            <div className="course-buttons">
                <button
                    className="start-btn"
                    disabled={isStarted}
                    onClick={onStart}
                >
                    {isStarted ? 'Розпочато' : 'Розпочати курс'}
                </button>
            </div>
        </div>
    );
}

export default CourseCard;