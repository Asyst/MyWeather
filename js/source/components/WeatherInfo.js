import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import * as actions from '../actions/';
import { Date } from './Date.js';
import { Details } from './Details.js';
import List from './List';

import { withRouter, Link, Redirect  } from 'react-router-dom';

class WeatherInfo extends React.Component {
  constructor( props ) {
    super( props );

    this.name = "WeatherInfo";

  }

  _success(position) {
    const pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    this.props.actions.loadWeather(pos);
  }

  _error() {
    this.props.actions.loadWeather();
    console.log( 'Error geolocation...' );
  }

  // Lifecycles
  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => this._success(position),
        () => this._error()
      );
    }
    else {
      // this.props.actions.loadWeather();
    }
  }

  render() {

    const { data, date, forecast, showSearch } = this.props;

    return (
      <div className={ classNames({
            'WeatherInfo': true
          }) }>

          <div className={ classNames({
            'ui active centered inline loader': true,
            'hidden' : data || showSearch
          }) }></div>

          <h1 className={ classNames({
            'welcome-title': true,
            'hidden' : !showSearch }) } >Welcome to &laquo;My Weathe App&raquo;</h1>

          <div className={ classNames({
            'buttons': true,
            'loaded' : !showSearch }) } >
            <Link to="/search" className="ui primary button search-link">Seach</Link>
            <Link to="/forecast" className="ui primary button forecast-link">Forecast</Link>
          </div>
        
        <div className={ classNames({
            'weather-info': true
          }) }>
            <div className="main-block">

              <div className={ classNames({
                  'weather-info__left': true,
                  'visible' : data
                }) }>

                { date &&
                <Date initialData={ date } /> }

                { data &&
                  <div>
                    <h1 className={ classNames({
                        'city': true,
                        'loaded' : data }) }>
                      { data.name }
                      <a onClick={ (e) => this.props.actions.addItem(e) } href={ data.name } title="add to list">
                        <i className="fa fa-plus" aria-hidden="true"></i>
                      </a>
                    </h1>
                    <div className="weather-info__item tempreature">
                      <div data-img={ `${data.weather[0].main}` }></div>
                      <span className={ classNames({
                        'temp': true,
                        'loaded' : data }) }>
                        { `${ data.main.temp.toFixed(0) } °C` }
                      </span>
                    </div>
                    
                  </div>
                }

              </div>

              { data && 
              <Details initialData={ data } /> }

            </div>

            <List
              citiesList={ this.props.citiesList }
              active={ this.props.cityName }
              selectCity={ this.props.actions.selectCity }
              deleteCity={ this.props.actions.deleteItem }/>
          </div>

      </div>
    );
  }
}

function mapStateToProps( state, ownProps ) {

  return {
    data: state.reducer.data,
    cityName: state.reducer.cityName,
    citiesList: _.toArray(state.reducer.citiesList),
    date: state.reducer.date,
    showSearch: state.reducer.showSearch || false
  };
}

function mapDispatchToProps( dispatch ) {
  return {
    actions: bindActionCreators( actions, dispatch )
  };
}

export default withRouter(connect( mapStateToProps, mapDispatchToProps )( WeatherInfo ));
