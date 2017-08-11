import axios from 'axios';
import { store } from '../containers/App.js';
import { push, replace, go, goBack, goForward } from 'react-router-redux';
import { 
  API_KEY, 
  GET_WEATHER_REQUEST, 
  GET_WEATHER_SUCCESS,
  ON_SEARCH,
  ADD_ITEM,
  DELETE_ITEM,
  NOT_SELECTED,
  FORECAST_SUCCESS } from '../constants';

export function loadWeather( position = undefined ) {

  if ( position ) {
    return (dispatch) => {
      dispatch({
        type: GET_WEATHER_REQUEST,
        data: null
      });

      let url = `http://api.openweathermap.org/data/2.5/weather?lat=${position.lat}&lon=${position.lng}&units=metric&appid=${ API_KEY }`;

      axios.get( url )
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        const dataList = data.list ? data.list[0] : data;

        const date =  _parseDate( dataList );

        dispatch({
          type: GET_WEATHER_SUCCESS,
          dataList,
          cityName: dataList.name,
          date
        });
      });
    };
  }
  else {
    return (dispatch, getState) => {
      dispatch({
        type: GET_WEATHER_REQUEST,
        payload: null
      })

      const cityName = getState().reducer.cityName;

      let url = `http://api.openweathermap.org/data/2.5/find?q=${ cityName }&type=accurate&units=metric&appid=${ API_KEY }`;

      if ( cityName ) {
        axios.get( url )
        .then((response) => {
          return response.data;
        })
        .then((data) => {

          const dataList = data.list ? data.list[0] : data;

          const date =  _parseDate( dataList );

          _getForecast( getState().reducer.cityName ).then((forecast) => {
            dispatch({
              type: FORECAST_SUCCESS,
              forecast
            });
          });

          dispatch({
            type: GET_WEATHER_SUCCESS,
            dataList,
            cityName,
            date
          });
        })
        .catch(( error ) => {
          console.log('Error: ', error);
        });
      }
      else {
        dispatch({
          type: NOT_SELECTED,
          showSearch: true
        });
      }
    };
  }
}

// Events
export function onSearch( e ) {
  e.preventDefault();

  return (dispatch, getState) => {
    dispatch({
      type: GET_WEATHER_REQUEST,
      payload: null
    })

    const cityName = document.forms[0].elements[0].value;

    let url = `http://api.openweathermap.org/data/2.5/find?q=${ cityName }&type=accurate&units=metric&appid=${ API_KEY }`;

    axios.get( url )
    .then((response) => {
      return response.data;
    })
    .then((data) => {
      const dataList = data.list ? data.list[0] : data;

      const date =  _parseDate( dataList );

      _getForecast( cityName ).then((forecast) => {
        
        dispatch({
          type: FORECAST_SUCCESS,
          forecast
        });
      });

      dispatch({
        type: GET_WEATHER_SUCCESS,
        dataList,
        cityName,
        date
      });

      dispatch(push("/"));

    });
  };
}

// start /_selectCity/
export function selectCity( e ) {
 
  return (dispatch, getState) => {
    dispatch({
      type: GET_WEATHER_REQUEST,
      payload: null
    })

    const cityName = e.currentTarget.firstChild.nodeValue;

    let url = `http://api.openweathermap.org/data/2.5/find?q=${ cityName }&type=accurate&units=metric&appid=${ API_KEY }`;

    axios.get( url )
    .then((response) => {
      return response.data;
    })
    .then((data) => {

      const dataList = data.list ? data.list[0] : data;

      _getForecast( cityName ).then((forecast) => {
        dispatch({
          type: FORECAST_SUCCESS,
          forecast
        });
      });

      dispatch({
        type: GET_WEATHER_SUCCESS,
        dataList,
        cityName,
        showSearch: false
      });

      // dispatch(push("/info"));
    })
    .catch(( error ) => {
      console.log('Error: ', error);
    });
  };
}
// end /_selectCity/

export function addItem ( e ) {
  e.preventDefault();

  let cityName = e.currentTarget.getAttribute('href');


  localStorage.setItem(`${cityName}`, cityName);

  return {
    type: ADD_ITEM,
    cityName
  };
}

// start /_removeItem/
export function deleteItem ( e ) {
  //e.target.parentNode.remove();
  let cityWillRemove = e.target.parentNode.firstChild.innerHTML;

  localStorage.removeItem(cityWillRemove);

  return {
    type: DELETE_ITEM,
    cityWillRemove
  };
}
// end /_removeItem/

// helper functions
function _parseDate( data ) {
  let
    date = new Date( data.dt * 1000 ),
    days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    month = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec' ],
    dateObj = {
      day: days[ date.getDay() ],
      date: date.getDate(),
      month: month[ date.getMonth() ],
      year: date.getFullYear()
    };

  return dateObj;
}

function _getForecast( cityName ) {

  const url = `http://api.openweathermap.org/data/2.5/forecast?q=${ cityName }&type=accurate&units=metric&appid=${ API_KEY }`;

  return axios.get( url )
  .then((response) => {
    return response.data;
  })
  .then((data) => {

    const obj = {};

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const filtered = data.list && data.list.reduce(( prev, curr, index, array ) => {

      let currDate = new Date( curr.dt * 1000 );

      obj[ currDate.getDate() ] = curr;

      return obj;

    });

    const arrData = _.toArray(filtered);

    const arrTemp = arrData.map(( item ) => {
      return item.main.temp;
    });

    const arrDays = arrData.map(( item ) => {
      let date = new Date( item.dt * 1000 );
      return days[ date.getDay() ];
    });

    return {
      cityName,
      arrDays,
      arrTemp
    }
  });

  // return forecast;

}