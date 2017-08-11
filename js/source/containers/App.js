import _ from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { List } from 'immutable';
import configureStore from '../store/configureStore';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import MainContainer from './MainContainer';

export const history = createHistory();

const storageData = [];

// load from localStorage
if ( localStorage.length ) {
  let dataLength = localStorage.length;

  for (let i = 0; i < dataLength; i++) {
    storageData.push( localStorage.getItem( localStorage.key(i) ) );
  }
}

const initialState = {
  reducer: {
    data: null,
    citiesList: List(storageData),
    cityName: _.toArray(List(storageData))[0],
    showSearch: true
  }
};

export const store = configureStore(initialState, history);

export class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Provider store={ store }>
          <BrowserRouter history={ history }>
              <MainContainer />
          </BrowserRouter>
        </Provider>
      </div>
    );
  }
}