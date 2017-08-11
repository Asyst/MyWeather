import React from 'react';
import PropTypes from 'prop-types';
import AnimatedNumber from 'react-animated-number';

export const Details = ({ initialData }) => {
  const { clouds, main, wind } = initialData;

  return (
      <div className="Details weather-info__right">
        <div className="weather-info__item clouds">
          <div className="icon">
            <i className="fa fa-cloud" aria-hidden="true"></i>
          </div>
          { clouds
            ? (
              <AnimatedNumber value={ clouds.all }
                style={{
                    transition: '1s ease-out',
                    fontSize: 28,
                    transitionProperty:
                        'background-color, color, opacity'
                }}
                stepPrecision={0}
                frameStyle={perc => (
                    perc === 100 ? {} : {backgroundColor: 'transparent'}
                )}
                duration={1000}
                formatValue={n => `${n} %`}/>
            )
            : 'clouds' }
        </div>
        <div className="weather-info__item humidity">
          <div className="icon">
            <i className="fa fa-tint" aria-hidden="true"></i>
          </div>
          { main
            ? (
              <AnimatedNumber value={ main.humidity }
                style={{
                    transition: '1s ease-out',
                    fontSize: 28,
                    transitionProperty:
                        'background-color, color, opacity'
                }}
                stepPrecision={0}
                frameStyle={perc => (
                    perc === 100 ? {} : {backgroundColor: 'transparent'}
                )}
                duration={1000}
                formatValue={n => `${n} %`}/>
            )
            : 'humidity' }
        </div>
        <div className="weather-info__item wind">
          { wind
            ? (
              <AnimatedNumber value={ wind.speed }
                style={{
                    transition: '1s ease-out',
                    fontSize: 28,
                    transitionProperty:
                        'background-color, color, opacity'
                }}
                stepPrecision={0}
                frameStyle={perc => (
                    perc === 100 ? {} : {backgroundColor: 'transparent'}
                )}
                duration={1000}
                formatValue={n => `${n} m/s`}/>
            )
            : ( 'wind speed' ) }
        </div>
      </div>
    );
}
