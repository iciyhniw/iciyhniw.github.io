import { useState } from 'react';

function Home() {
  const [reviewsVisible, setReviewsVisible] = useState(false);

  const toggleReviews = () => {
    setReviewsVisible(!reviewsVisible);
  };

  const benefits = [
    { text: 'Персональний коуч, який буде вести вас від початку до кінця.', hoverText: 'Індивідуальна підтримка від професіонала!' },
    { text: 'Зручна подача інформації, яка підходить для будь-якої людини. Включає текстову інформацію, відео-ролики та онлайн зустрічі.' },
    { text: 'Гнучкий графік навчання — обирайте зручний час для занять.' },
    { text: 'Доступ до матеріалів курсу навіть після його завершення.' },
    { text: 'Регулярна підтримка і консультації на всіх етапах навчання.' },
    { text: 'Міжнародний доступ — навчайтеся з будь-якої точки світу.' },
    { text: 'Ми надаємо гарантію повернення коштів протягом перших 14 днів, якщо курс не відповідає вашим очікуванням.' },
  ];

  return (
    <main>
      <section className="about-us">
        <div className="section-content">
          <div className="section-text">
            <h3>Про нас:</h3>
            <p>Ми пропонуємо інноваційне рішення, яке підходить для всіх — від школярів до людей будь-якого віку, які прагнуть розвиватися та освоювати нові навички. Наші курси допомагають отримати корисні знання для особистого і професійного зростання, сприяючи самовдосконаленню та відкриттю нових можливостей у житті.</p>
          </div>
          <img src="/images/paper.png" alt="EduWay Logo" className="section-logo" />
        </div>
      </section>

      <section className="benefits">
        <div className="section-content">
          <div className="section-text">
            <h3>Наші переваги:</h3>
            <ul className="benefits-list">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  onMouseOver={(e) => {
                    if (benefit.hoverText) e.target.textContent = benefit.hoverText;
                    else e.target.style.color = '#4caf50';
                  }}
                  onMouseOut={(e) => {
                    e.target.textContent = benefit.text;
                    e.target.style.color = '#424242';
                  }}
                >
                  {benefit.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="section-content">
          <div className="section-text">
            <h3>Як це працює:</h3>
            <ol>
              <li>Реєструєтесь на платформі та обираєте курс.</li>
              <li>Отримуєте доступ до навчальних матеріалів: текстів, відео, вправ.</li>
              <li>Працюєте над завданнями та отримуєте зворотній зв'язок від нашого коуча.</li>
              <li>Після завершення курсу отримуєте сертифікат про проходження.</li>
            </ol>
          </div>
          <img src="/images/left-arrow.png" alt="How It Works Icon" className="section-logo" />
        </div>
      </section>

      <section className="reviews">
        <div className="section-content">
          <div className="section-text">
            <div className="reviews-header" onClick={toggleReviews}>
              <h3>Відгуки наших учнів:</h3>
              <span className={`toggle-arrow ${reviewsVisible ? 'active' : ''}`}>▼</span>
            </div>
            <div className="reviews-content" style={{ display: reviewsVisible ? 'block' : 'none' }}>
              <blockquote>
                <p>Цей курс допоміг мені освоїти нові навички, які змінили моє професійне життя. Персональний коуч був дуже підтримуючим, а матеріали курсу легкі для сприйняття.</p>
                <footer className="reviews">- Олена, випускниця курсу</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section className="prices-and-payment">
        <div className="section-content">
          <div className="section-text">
            <h3>Ціни та оплата</h3>
            <p>Наші курси доступні за доступною ціною. Ми пропонуємо варіанти одноразових платежів або помісячних підписок. Для групових реєстрацій діють спеціальні знижки.</p>
          </div>
          <img src="/images/tag.png" alt="Prices Icon" className="section-logo" />
        </div>
      </section>
    </main>
  );
}

export default Home;
