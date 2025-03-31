document.addEventListener('DOMContentLoaded', () => {
  // Код для модального вікна (виконується лише на сторінках із модальним вікном)
  const loginBtn = document.getElementById('login-btn');
  const modal = document.getElementById('login-modal');
  const closeModal = document.getElementById('close-modal');
  const loginForm = document.getElementById('login-form');

  if (loginBtn && modal && closeModal && loginForm) {
    loginBtn.onclick = () => {
      modal.style.display = 'flex';
    };

    closeModal.onclick = () => {
      modal.style.display = 'none';
    };

    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };

    loginForm.onsubmit = (event) => {
      event.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const validEmail = '08andrey1205@gmail.com';
      const validPassword = '12345';

      if (email === '' || password === '') {
        alert('Будь ласка, заповніть усі поля!');
      } else if (!email.includes('@') || !email.includes('.')) {
        alert('Введіть коректну електронну пошту!');
      } else if (email !== validEmail || password !== validPassword) {
        alert('Неправильна електронна пошта або пароль!');
      } else {
        console.log('Email:', email, 'Password:', password);

        let confirmationDiv = document.getElementById('login-confirmation');
        if (!confirmationDiv) {
          confirmationDiv = document.createElement('div');
          confirmationDiv.id = 'login-confirmation';
          confirmationDiv.style.margin = '20px';
          confirmationDiv.style.padding = '10px';
          confirmationDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
          confirmationDiv.style.borderRadius = '10px';
          confirmationDiv.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
          document.querySelector('main').appendChild(confirmationDiv);
        }

        confirmationDiv.innerHTML = `
          <h4>Ви успішно увійшли:</h4>
          <p><strong>Електронна пошта:</strong> ${email}</p>
          <p><strong>Пароль:</strong> ${password.replace(/./g, '*')}</p>
        `;

        modal.style.display = 'none';
      }
    };
  }

  // Код для завантаження курсів (виконується лише на сторінці courses.html)
  const coursesGrid = document.getElementById('courses-grid');
  if (coursesGrid) {
    fetch('csvjson.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(courses => {
        if (!courses || courses.length === 0) {
          coursesGrid.innerHTML = '<p>Курси не знайдено.</p>';
          return;
        }

        // Використовуємо цикл for для створення карток курсів
        for (let i = 0; i < courses.length; i++) {
          const course = courses[i];
          const courseCard = document.createElement('div');
          courseCard.className = 'course-card';
          courseCard.innerHTML = `
            <h4 class="course-title">${course.course_title || 'Назва не вказана'}</h4>
            <div class="course-details" style="display: none;">
              <p><strong>Організація:</strong> ${course.course_organization || 'Н/Д'}</p>
              <p><strong>Рівень:</strong> ${course.course_difficulty || 'Н/Д'}</p>
              <p><strong>Рейтинг:</strong> ${course.course_rating || 'Н/Д'}</p>
              <p><strong>Студентів:</strong> ${course.course_students_enrolled || 'Н/Д'}</p>
            </div>
            <button class="enroll-btn">Записатися</button>
          `;
          coursesGrid.appendChild(courseCard);

          // Додаємо інтерактивність: клік на заголовок показує/ховає деталі
          const title = courseCard.querySelector('.course-title');
          const details = courseCard.querySelector('.course-details');
          title.addEventListener('click', () => {
            details.style.display = details.style.display === 'none' ? 'block' : 'none';
          });
        }
      })
      .catch(error => {
        console.error('Error loading courses:', error);
        coursesGrid.innerHTML = '<p>Помилка завантаження курсів.</p>';
      });
  }
});
