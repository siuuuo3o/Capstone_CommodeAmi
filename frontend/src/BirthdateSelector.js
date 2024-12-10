import React from 'react';
import './BirthdateSelector.css';

function BirthdateSelector({ year, month, day, handleYearChange, handleMonthChange, handleDayChange }) {

  const generateYearOptions = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1900; i--) {
      years.push(i);
    }
    return years.map(year => <option key={year} value={year}>{year}</option>);
  };

  const generateMonthOptions = () => {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      months.push(i < 10 ? `0${i}` : i);
    }
    return months.map(month => <option key={month} value={month}>{month}</option>);
  };

  const generateDayOptions = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i < 10 ? `0${i}` : i);
    }
    return days.map(day => <option key={day} value={day}>{day}</option>);
  };

  return (
    <div id="birthdate-container">
      <select name="year" value={year} onChange={handleYearChange} required>
        <option value="">년도</option>
        {generateYearOptions()}
      </select>
      <select name="month" value={month} onChange={handleMonthChange} required>
        <option value="">월</option>
        {generateMonthOptions()}
      </select>
      <select name="day" value={day} onChange={handleDayChange} required>
        <option value="">일</option>
        {generateDayOptions()}
      </select>
    </div>
  );
}

export default BirthdateSelector;
