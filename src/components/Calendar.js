import React, { useState } from 'react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // 달력을 구성하는 날짜 배열 생성
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    // console.log(year, month, firstDay, lastDay);
    // console.log(currentDate)
    // console.log(selectedDate)

    const days = [];
    for (let i = 1; i <= lastDay; i++) {
      days.push(i);
    }

    const emptyDays = Array(firstDay).fill(null);
    const filledDays = [...emptyDays, ...days];
    const remainingDays = 42 - filledDays.length;
    const calendarDays = filledDays.concat(Array(remainingDays).fill(null));

    return calendarDays;
  };

  // 이전 달로 이동
  const goToPrevMonth = () => {
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    setCurrentDate(prevMonth);
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    setCurrentDate(nextMonth);
  };

  return (
    <div className="w-max-md mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <button className="text-midgray hover:text-darkgray" onClick={goToPrevMonth}>
          Prev
        </button>
        <h2 className="text-h2 font-bold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button className="text-midgray hover:text-darkgray" onClick={goToNextMonth}>
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-h7 text-midgray">
            {day}
          </div>
        ))}
        {getCalendarDays().map((day, index) => (
          <div
            key={index}
            className={`text-center text-black font-bold ${
              day ? 'cursor-pointer hover:bg-main_mid' : ''
            } rounded p-2`}
            onClick={() => setSelectedDate(day)}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="mt-4">
        Selected Date: {selectedDate ? selectedDate : 'None'}
      </div>
    </div>
  );
};

export default Calendar;
