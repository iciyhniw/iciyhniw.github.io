document.addEventListener('DOMContentLoaded', () => {
  // Завдання 1 ЛР2:
  // 1. Виділення всіх зображень із класом section-logo
  const sectionImages = document.querySelectorAll('.section-logo');
  sectionImages.forEach(img => {
    console.log('Зображення:', img.alt);
  });


  // 3. If-else для зміни стилю пройдених курсів
  const courseItems = document.querySelectorAll('.profile-section ul li');
  for (let i = 0; i < courseItems.length; i++) {
    if (courseItems[i].querySelector('.complete-btn')?.disabled) {
      courseItems[i].style.color = '#2e7d32'; // Зелений для завершених курсів
    } else {
      courseItems[i].style.color = '#0288d1'; // Синій для незавершених курсів
    }
  }

  // 4. Динамічна зміна стилю навігаційних кнопок
  const navButtonsStyle = document.querySelectorAll('.buttons button');
  navButtonsStyle.forEach(button => {
    button.addEventListener('click', () => {
      button.style.backgroundColor = '#4caf50';
      button.style.transform = 'scale(1.1)';
      setTimeout(() => {
        button.style.backgroundColor = '#0288d1';
        button.style.transform = 'scale(1)';
      }, 200);
    });
  });

  //Завдання 2 ЛР 2
  // 1 & 2: Кнопка для "відгуків" з логікою if-else
  const reviewsHeader = document.querySelector('.reviews-header');
  const reviewsContent = document.querySelector('.reviews-content');
  const toggleArrow = document.querySelector('.toggle-arrow');

  if (reviewsHeader && reviewsContent && toggleArrow) {
    reviewsHeader.addEventListener('click', () => {
      if (reviewsContent.style.display === 'none' || reviewsContent.style.display === '') {
        reviewsContent.style.display = 'block';
        toggleArrow.classList.add('active');
      } else {
        reviewsContent.style.display = 'none';
        toggleArrow.classList.remove('active');
      }
    });
  }


  // 4: Ефект наведення для "Наші переваги"
  const benefitsItems = document.querySelectorAll('.benefits-list li');
  benefitsItems.forEach(item => {
    const originalText = item.textContent;
    item.addEventListener('mouseover', () => {
      if (item.textContent.includes('Персональний коуч')) {
        item.textContent = 'Індивідуальна підтримка від професіонала!';
      } else {
        item.style.color = '#4caf50';
      }
    });
    item.addEventListener('mouseout', () => {
      item.textContent = originalText;
      item.style.color = '#424242';
    });
  });

  // Завдання 3 ЛР2
  const modal = document.getElementById('login-modal');
  const closeModal = document.getElementById('close-modal');
  const loginForm = document.getElementById('login-form');

  if (modal && closeModal && loginForm) {
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

      if (email !== validEmail || password !== validPassword) {
        alert('Неправильна електронна пошта або пароль!');
      } else {
        console.log('Email:', email, 'Password:', password);

        // Встановлюємо стан авторизації
        localStorage.setItem('isLoggedIn', 'true');
        updateNavButtons(true);

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


  // Ініціалізація localStorage, якщо ще не існує
  if (!localStorage.getItem('startedCourses')) {
    localStorage.setItem('startedCourses', JSON.stringify([]));
  }
  if (!localStorage.getItem('completedCourses')) {
    localStorage.setItem('completedCourses', JSON.stringify([]));
  }

  const coursesGrid = document.getElementById('courses-grid');
  if (coursesGrid) {
    fetch('csvjson.json')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(courses => {
        if (!courses || courses.length === 0) {
          coursesGrid.innerHTML = '<p>Курси не знайдено.</p>';
          return;
        }

        const startedCourses = JSON.parse(localStorage.getItem('startedCourses'));
        for (let i = 0; i < courses.length; i++) {
          const course = courses[i];
          const courseCard = document.createElement('div');
          courseCard.className = 'course-card';
          const isStarted = startedCourses.includes(course.course_title);
          courseCard.innerHTML = `
            <h4 class="course-title">${course.course_title || 'Назва не вказана'}</h4>
            <div class="course-details" style="display: none;">
              <p><strong>Організація:</strong> ${course.course_organization || 'Н/Д'}</p>
              <p><strong>Рівень:</strong> ${course.course_difficulty || 'Н/Д'}</p>
              <p><strong>Рейтинг:</strong> ${course.course_rating || 'Н/Д'}</p>
              <p><strong>Студентів:</strong> ${course.course_students_enrolled || 'Н/Д'}</p>
            </div>
            <div class="course-buttons">
              <button class="start-btn" ${isStarted ? 'disabled' : ''}>${isStarted ? 'Розпочато' : 'Розпочати курс'}</button>
            </div>
          `;
          coursesGrid.appendChild(courseCard);

          const title = courseCard.querySelector('.course-title');
          const details = courseCard.querySelector('.course-details');
          const startBtn = courseCard.querySelector('.start-btn');

          title.addEventListener('click', () => {
            details.style.display = details.style.display === 'none' ? 'block' : 'none';
          });

          startBtn.addEventListener('click', () => {
            if (!isStarted) {
              const startedCourses = JSON.parse(localStorage.getItem('startedCourses'));
              startedCourses.push(course.course_title);
              localStorage.setItem('startedCourses', JSON.stringify(startedCourses));
              startBtn.textContent = 'Розпочато';
              startBtn.disabled = true;
              startBtn.style.backgroundColor = '#4caf50';
            }
          });
        }
      })
      .catch(error => {
        console.error('Error loading courses:', error);
        coursesGrid.innerHTML = '<p>Помилка завантаження курсів.</p>';
      });
  }

  // Логіка для профілю
  const profileSection = document.getElementById('started-courses');
  if (profileSection) {
    const courseList = document.getElementById('course-list');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const clearCompletedBtn = document.getElementById('clear-completed');

    function updateProgress() {
      const startedCourses = JSON.parse(localStorage.getItem('startedCourses'));
      const completedCourses = JSON.parse(localStorage.getItem('completedCourses'));
      const startedCount = startedCourses.length;
      const completedCount = completedCourses.length;
      const progress = startedCount === 0 ? 0 : Math.round((completedCount / startedCount) * 100);

      progressBar.style.width = `${progress}%`;
      progressText.textContent = `Прогрес: ${progress}% (${completedCount} з ${startedCount} завершено)`;

      courseList.innerHTML = '';
      startedCourses.forEach(course => {
        const li = document.createElement('li');
        const isCompleted = completedCourses.includes(course);
        li.innerHTML = `
          ${course}
          <button class="complete-btn" ${isCompleted ? 'disabled' : ''}>
            ${isCompleted ? 'Завершено' : 'Завершити курс'}
          </button>
        `;
        courseList.appendChild(li);

        const completeBtn = li.querySelector('.complete-btn');
        if (!isCompleted) {
          completeBtn.addEventListener('click', () => {
            const completedCourses = JSON.parse(localStorage.getItem('completedCourses'));
            completedCourses.push(course);
            localStorage.setItem('completedCourses', JSON.stringify(completedCourses));
            completeBtn.textContent = 'Завершено';
            completeBtn.disabled = true;
            completeBtn.style.backgroundColor = '#2e7d32';
            updateProgress();
          });
        }
      });
    }

    // Очищення завершених курсів
    clearCompletedBtn.addEventListener('click', () => {
      localStorage.setItem('completedCourses', JSON.stringify([]));
      updateProgress();
    });

    updateProgress();
  }

  // Оновлення розкладу лише на сторінці schedule.html
  if (document.location.pathname.includes('schedule.html')) {
    const scheduleList = document.querySelector('.schedule-list');
    if (scheduleList) {
      let updateCount = 0;
      const maxUpdates = 5;
      const updateInterval = 10000;

      const updateSchedule = () => {
        const currentTime = new Date().toLocaleTimeString();
        scheduleList.innerHTML = `
          <li><strong>Веб-розробка:</strong> Щовівторка та щочетверга, 18:00 - 20:00 (з 15.03.2025) [Оновлено: ${currentTime}]</li>
          <li><strong>Основи програмування:</strong> Щопонеділка, 19:00 - 21:00 (з 20.03.2025) [Оновлено: ${currentTime}]</li>
          <li><strong>Англійська для IT:</strong> Щосуботи, 10:00 - 12:00 (з 25.03.2025) [Оновлено: ${currentTime}]</li>
        `;
        console.log(`Розклад оновлено ${updateCount + 1} раз(ів)`);
        const updatedItems = document.querySelectorAll('.schedule-list li');
        updatedItems.forEach(item => {
          item.style.backgroundColor = '#e8f5e9';
          item.style.padding = '5px';
        });
      };

      // Початкове заповнення розкладу
      updateSchedule();

      // Періодичне оновлення з do...while
      const intervalId = setInterval(() => {
        do {
          updateSchedule();
          updateCount++;
          if (updateCount >= maxUpdates) {
            clearInterval(intervalId);
          }
        } while (updateCount < maxUpdates && false); // false для одноразового виконання
      }, updateInterval);
    }
  }

  // Функція для оновлення навігаційних кнопок
  function updateNavButtons(isLoggedIn) {
    const buttonsUl = document.querySelector('.buttons');
    if (!buttonsUl) return;

    // Очищаємо поточні кнопки "Увійти"/"Вийти" і "Мій кабінет"
    const loginBtnLi = buttonsUl.querySelector('#login-btn')?.parentElement;
    const profileBtnLi = buttonsUl.querySelector('a[href="profile.html"]')?.parentElement;
    const logoutBtnLi = buttonsUl.querySelector('#logout-btn')?.parentElement;

    if (loginBtnLi) loginBtnLi.remove();
    if (profileBtnLi) profileBtnLi.remove();
    if (logoutBtnLi) logoutBtnLi.remove();

    if (isLoggedIn) {
      // Додаємо "Мій кабінет"
      const profileLi = document.createElement('li');
      profileLi.innerHTML = '<a href="profile.html" class="button"><button>Мій кабінет</button></a>';
      buttonsUl.appendChild(profileLi);

      // Додаємо "Вийти"
      const logoutLi = document.createElement('li');
      logoutLi.innerHTML = '<button id="logout-btn">Вийти</button>';
      buttonsUl.appendChild(logoutLi);

      // Додаємо обробник для кнопки "Вийти"
      const logoutBtn = document.querySelector('#logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          localStorage.removeItem('isLoggedIn');
          updateNavButtons(false);
          // Перенаправлення на головну сторінку
          window.location.href = 'index.html';
        });
      }
    } else {
      // Додаємо "Розклад занять" і "Курси" (якщо їх немає)
      if (!buttonsUl.querySelector('a[href="schedule.html"]')) {
        const scheduleLi = document.createElement('li');
        scheduleLi.innerHTML = '<a href="schedule.html" class="button"><button>Розклад занять</button></a>';
        buttonsUl.appendChild(scheduleLi);
      }
      if (!buttonsUl.querySelector('a[href="courses.html"]')) {
        const coursesLi = document.createElement('li');
        coursesLi.innerHTML = '<a href="courses.html" class="button"><button>Курси</button></a>';
        buttonsUl.appendChild(coursesLi);
      }
      // Додаємо "Увійти"
      const loginLi = document.createElement('li');
      loginLi.innerHTML = '<button id="login-btn">Увійти</button>';
      buttonsUl.appendChild(loginLi);

      // Додаємо обробник для кнопки "Увійти"
      const loginBtn = document.querySelector('#login-btn');
      if (loginBtn) {
        loginBtn.addEventListener('click', () => {
          const modal = document.getElementById('login-modal');
          if (modal) modal.style.display = 'flex';
        });
      }
    }
  }

  // Перевіряємо стан авторизації при завантаженні сторінки
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  updateNavButtons(isLoggedIn);


});
