import _ from 'lodash';
import React from 'react';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/';
import { withRouter, Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import WeatherInfo from '../components/WeatherInfo';
import Forecast from '../components/Forecast';
import Search from '../components/Search';

class MainContainer extends React.Component {
  constructor( props ) {
    super( props );

    this.name = "MainContainer";

  }

  render() {
    const { data, showSearch } = this.props;

    return (
      <div>
          
        <div className={ classNames({
          'ui active centered inline loader': true,
          'hidden' : data || showSearch
        }) }></div>

        <div className="main-container">
          <Route exact path="/" component={ WeatherInfo }/>
          <Route path="/search" component={ Search } />
          <Route path="/forecast" component={ Forecast } />
        </div>

      </div>
    );
  }
}

function mapStateToProps( state ) {
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

export default withRouter(connect( mapStateToProps, mapDispatchToProps )( MainContainer ));