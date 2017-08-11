import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link, Redirect  } from 'react-router-dom';

const List = ({ data, citiesList, active, selectCity, deleteCity }) => {

  let citiesAmount = citiesList.length;

  return (
      <div className="List">
        <div className="close-list">
          <i className="fa fa-times" aria-hidden="true"></i>
        </div>
        <div className="list__title">Your List: <span className="citiesAmount">{ citiesAmount }</span></div>
        <ul className="list__cities">
          {
            citiesList &&
            citiesList.map(( cityName, idx ) => {
              if ( cityName === active && data ) {
                return (
                  <li className="list__city list__city--active" key={ cityName }>
                    <span onClick={ (e) => selectCity(e) }>{ cityName }</span>
                    <i className="fa fa-times" aria-hidden="true" onClick={ (e) => deleteCity(e) }></i>
                  </li>
                );
              }
              else {
                return (
                  <li className="list__city" key={ cityName }>
                    <span onClick={ (e) => selectCity(e) }>{ cityName }</span>
                    <i className="fa fa-times" aria-hidden="true" onClick={ (e) => deleteCity(e) }></i>
                  </li>
                );
              }

            })
          }
        </ul>
      </div>
    );
}

List.propTypes = {
  items: PropTypes.array,
  loadItems: PropTypes.func,
  onClick: PropTypes.func,
  active: PropTypes.string
};

function mapStateToProps( state ) {

  return {
    data: state.reducer.data,
  };
}

export default connect( mapStateToProps )( List );
