import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { routerActions } from 'react-router-redux';
import * as actions from '../actions/';

import { withRouter, Link } from 'react-router-dom';

class Search extends React.Component {
  constructor( props ) {
    super( props );

    this.name = 'Search';
  }

  componentDidUpdate() {
    this.props.history.push("/");
  }

  render() {
    const { data, cityName } = this.props;

    return (
      <div className={ classNames({
            'Search': true,
            'visible' : !data
          }) }>

        <h2>Enter city name</h2>

        <div className="search-block">
          <form className="ui form" onSubmit={ (e) => this.props.actions.onSearch(e) }>
            <div className="field">
              <label>Search</label>
              <input className="search-field" type="text" name="search" placeholder="Enter city name" />
            </div>
          </form>
        </div>

        { data && cityName && <Link to="/" className="ui primary button">{ `prev search: ${cityName}` }</Link> }
      </div>
    );
  }
}

Search.propTypes = {
  search: PropTypes.func
};

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
    actions: bindActionCreators( actions, dispatch ),
    routerActions: bindActionCreators( routerActions, dispatch )
  };
}

export default withRouter(connect( mapStateToProps, mapDispatchToProps )( Search ));