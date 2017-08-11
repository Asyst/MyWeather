import React from 'react';
import PropTypes from 'prop-types';

export const Date = ({ initialData }) => {
  const { date, day, month, year } = initialData;

  return (
    <div className="Date weather-info__date">
      <div className="date">{ date }</div>
      <div className="day">{ day }</div>
      <div className="month">{ month }</div>
      <div className="year">{ year }</div>
    </div>
  );
}
