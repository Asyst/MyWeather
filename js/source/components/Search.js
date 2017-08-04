import React from 'react';

export class Search extends React.Component {
  constructor( props ) {
    super( props );

    this.name = 'Search';

    this._onSearch = this._onSearch.bind(this);
  }

  _onSearch( e ) {
    e.preventDefault();
    let cityName = document.forms[0].elements[0].value;

    this.props.search( cityName );
  }

  render() {
    return (
      <div className="search-block">
        <form className="ui form" onSubmit={ this._onSearch }>
          <div className="field">
            <label>Search</label>
            <input className="search-field" type="text" name="search" placeholder="Enter city name" />
          </div>
        </form>
      </div>
    );
  }
}

Search.propTypes = {
  search: React.PropTypes.func
};
