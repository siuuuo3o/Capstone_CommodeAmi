import React from 'react';

function FilterSection({ birthYearOptions, selectedGender, setSelectedGender, setSelectedBirthYear, applyFilter }) {
  return (
    <div className="filter-section">
      <div className="gender-filter">
        <button className={`gender-button ${selectedGender === 'male' ? 'selected' : ''}`} onClick={() => setSelectedGender('male')}>남성</button>
        <button className={`gender-button ${selectedGender === 'female' ? 'selected' : ''}`} onClick={() => setSelectedGender('female')}>여성</button>
      </div>
      <div className="year-filter">
        <label htmlFor="birth-year">태어난 연도</label>
        <select id="birth-year" onChange={(e) => setSelectedBirthYear(e.target.value)}>
          <option value="">선택하세요</option>
          {birthYearOptions.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <button className="save-button" onClick={applyFilter}>저장</button>
    </div>
  );
}

export default FilterSection;
