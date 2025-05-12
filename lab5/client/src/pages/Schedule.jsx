import { useState, useEffect } from 'react';

function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const maxUpdates = 5;
  const updateInterval = 10000;

  const updateSchedule = () => {
    const currentTime = new Date().toLocaleTimeString();
    setSchedule([
      { title: 'Веб-розробка', time: 'Щовівторка та щочетверга, 18:00 - 20:00 (з 15.03.2025)', updated: currentTime },
      { title: 'Основи програмування', time: 'Щопонеділка, 19:00 - 21:00 (з 20.03.2025)', updated: currentTime },
      { title: 'Англійська для IT', time: 'Щосуботи, 10:00 - 12:00 (з 25.03.2025)', updated: currentTime },
    ]);
  };

  useEffect(() => {
    updateSchedule();
    let updateCount = 0;
    const intervalId = setInterval(() => {
      if (updateCount < maxUpdates - 1) {
        updateSchedule();
        updateCount++;
        console.log(`Розклад оновлено ${updateCount + 1} раз(ів)`);
      } else {
        clearInterval(intervalId);
      }
    }, updateInterval);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <main>
      <section className="schedule">
        <div className="schedule-content">
          <h3>Розклад занять</h3>
          <ul className="schedule-list">
            {schedule.map((item, index) => (
              <li key={index} style={{ backgroundColor: '#e8f5e9', padding: '5px' }}>
                <strong>{item.title}:</strong> {item.time} [Оновлено: {item.updated}]
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default Schedule;
