import React from 'react';

export class List extends React.Component {
  constructor( props ) {
    super( props );

    this.name = 'List';

    this.state = {
      listItems: []
    }

    this._arrItems = [];

    this._selectCity = this._selectCity.bind(this);
    this._removeItem = this._removeItem.bind(this);
    this._closeList = this._closeList.bind(this);

  }

  _addItemsToList() {
    if ( localStorage.length ) {
      let dataLength = localStorage.length;

      for (let i = 0; i < dataLength; i++) {
        // console.log( 'localStorage key: ', localStorage.key(i) );
        this._arrItems.push( localStorage.getItem( localStorage.key(i) ) );
      }

      this.setState({
        listItems: this._arrItems
      });

      this.props.loadItems( this._arrItems );
    }
    else {
      this._arrItems = this.props.items.map(( cityName ) => {
        return cityName;
      })

      this.setState({
        listItems: this._arrItems
      });

      this.props.loadItems( this._arrItems );
    }
  }

  _saveList() {
    if ( this.state.listItems.length > 0 ) {
      this.state.listItems.map(( cityName, idx ) => {
        localStorage.setItem(`${cityName}`, cityName);
      });
    }
    else {
      this.props.items.map(( cityName, idx ) => {
        localStorage.setItem(`${cityName}`, cityName);
      });
    }
  }

  // ========================
  // Events
  // ========================

  // start /_selectCity/
  _selectCity( e ) {
    let cityName = e.target.firstChild.nodeValue;

    this.props.onClick( cityName );
  }
  // end /_selectCity/

  // start /_removeItem/
  _removeItem( e ) {
    //e.target.parentNode.remove();
    let cityWillRemove = e.target.parentNode.firstChild.innerHTML;
    let listItems = this.state.listItems;
    let editedList = listItems.filter(( cityName ) => {
      return cityName !== cityWillRemove;
    });

    localStorage.removeItem(cityWillRemove);

    this.setState({
      listItems: editedList
    });

    this.props.loadItems( editedList );
  }
  // end /_removeItem/

  _closeList( e ) {
    document.querySelector('.list').classList.remove('list--opened');
  }

  componentDidMount() {
    this._addItemsToList();
  }

  componentWillUpdate() {

  }

  componentDidUpdate() {
    this._saveList();
  }

  render() {

    return (
      <div className="right-block list">
        <div className="close-list">
          <i className="fa fa-times" aria-hidden="true" onClick={ this._closeList }></i>
        </div>
        <div className="list__title">Your List</div>
        <ul className="list__cities">
          {
            this.props.items &&
            this.props.items.map(( cityName, idx ) => {
              if ( cityName === this.props.active ) {
                return (
                  <li className="list__city list__city--active" key={ cityName }>
                    <span onClick={ this._selectCity }>{ cityName }</span>
                    <i className="fa fa-times" aria-hidden="true" onClick={ this._removeItem }></i>
                  </li>
                );
              }
              else {
                return (
                  <li className="list__city" key={ cityName }>
                    <span onClick={ this._selectCity }>{ cityName }</span>
                    <i className="fa fa-times" aria-hidden="true" onClick={ this._removeItem }></i>
                  </li>
                );
              }

            })
          }
        </ul>

      </div>
    );
  }
}

List.propTypes = {
  items: React.PropTypes.array,
  loadItems: React.PropTypes.func,
  onClick: React.PropTypes.func,
  active: React.PropTypes.string
};
