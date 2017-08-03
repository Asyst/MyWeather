import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import AnimatedNumber from 'react-animated-number';
import { List } from './components/List.js';

let apiKey = 'c285797738b3abb8c244d8be0159116c';


class WeatherInfo extends React.Component {
  constructor( props ) {
    super( props );

    this.state = {
      data: null,
      position: null,
      listItems: [],
      date: null
    };

    this.name = "WeatherInfo";

    this._onSearch = this._onSearch.bind(this);
    this._addToList = this._addToList.bind(this);
    this._selectCity = this._selectCity.bind(this);
    this._loadItems = this._loadItems.bind(this);
    this._localWeather = this._localWeather.bind(this);
    this._succes = this._succes.bind(this);
    this._error = this._error.bind(this);
    this._parseWeatherData = this._parseWeatherData.bind(this);
    this._loadFromAPI = this._loadFromAPI.bind(this);
    this._parseDate = this._parseDate.bind(this);
    this._openList = this._openList.bind(this);
    this._getForecast = this._getForecast.bind(this);

  }

  // start /_loadFromAPI/
  // Args:
  //  options: Object - city name or coords
  _loadFromAPI( options ) {
    if ( options.cityName ) {
      let url = `http://api.openweathermap.org/data/2.5/find?q=${ options.cityName }&type=accurate&units=metric&appid=${ apiKey }`;

      fetch( url )
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        this._parseWeatherData( JSON.parse( data ) );
      });
    }
    else {
      fetch( `http://api.openweathermap.org/data/2.5/weather?lat=${options.lat}&lon=${options.lng}&units=metric&appid=${ apiKey }` )
        .then((response) => {
          return response.text();
        })
        .then((data) => {
          this._parseWeatherData( JSON.parse( data ) );
        });
    }
  }
  // end /_loadFromAPI/

  _getForecast( cityName ) {
    let url = `http://api.openweathermap.org/data/2.5/forecast?q=${ cityName }&type=accurate&units=metric&appid=${ apiKey }`;
      fetch( url )
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        this._renderChart( JSON.parse( data ).list );
      });
  }

  _succes( position ) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    this.setState({ position: pos });

    if ( this.state.position ) {
      this._loadFromAPI({
        lat: this.state.position.lat,
        lng: this.state.position.lng
      });
    }
  };

  _error() {
    this._loadWeather();
  };

  // start /_selectCity/
  // Args:
  //  items - list of cities name
  _selectCity( cityName ) {
    this._loadFromAPI( { cityName: cityName } );
  }
  // end /_selectCity/

  // start /_loadItems/
  // Args:
  //  items - list of cities name
  _loadItems( items ) {
    let cities = items;

    this.setState({
      listItems: cities
    });
  }
  // end /_loadItems/

  // start /_loadWeather/
  // load weather from localStorage
  _loadWeather() {
    let cityName = this.state.listItems[0];

    this._loadFromAPI( { cityName: cityName } );
  }
  // end /_loadWeather/

  // start /_localWeather/
  // load weather from geolocation
  _localWeather() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( this._succes, this._error );
    }
  }
  // end /_localWeather/

  // start /_parseWeatherData/
  // Args:
  //  data - data from api
  _parseWeatherData( data ) {

    let newData = data.list === undefined ? data : data.list[0];
    let dataList = data.list !== undefined && data.list;

    this.setState({
      data: newData,
    });

    this._parseDate( newData );

    this._getForecast( newData.name );

  }
  // end /_parseWeatherData/

  _parseDate( data ) {
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

    this.setState({
      date: dateObj
    });
  }

  _renderChart( dataList ) {
    let
      obj = {},
      arrData = [];

    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let cityName = this.state.data && this.state.data.name;

    let filtered = dataList && dataList.reduce(( prev, curr, index, array ) => {

      let currDate = new Date( curr.dt * 1000 );

      obj[ currDate.getDate() ] = curr;

      return obj;

    });

    arrData = _.toArray(filtered);

    let arrTemp = arrData && arrData.map(( item ) => {
      return item.main.temp;
    });

    let arrDays = arrData && arrData.map(( item ) => {
      let date = new Date( item.dt * 1000 );
      return days[ date.getDay() ];
    });

    Highcharts.chart('weather-chart', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Monthly Average Temperature'
        },
        xAxis: {
            categories: arrDays
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: cityName,
            data: arrTemp
        }]
    });
  }

  // ========================
  // Events
  // ========================
  _onSearch( e ) {
    e.preventDefault();

    let cityName = document.forms[0].elements[0].value;

    this._loadFromAPI( { cityName: cityName } );
  }

  _addToList( e ) {
    e.preventDefault();

    let listItems = this.state.listItems || [];

    let cityName = e.currentTarget.getAttribute('href');

    if ( listItems.indexOf( cityName ) !== -1 ) {
      alert( 'This city already exists in your list' );
    }
    else {
      listItems.push(cityName);
    }

    this.setState({
      listItems: listItems
    });
  }

  _openList( e ) {
    !document.querySelector('.list').classList.contains('list--opened')
      ? document.querySelector('.list').classList.add('list--opened')
      : document.querySelector('.list').classList.remove('list--opened');
  }

  // Lifecycles
  componentDidMount() {
    this._localWeather();
  }

  render() {
    return (
      <div>
        <div className="ui active centered inline loader" data-show={ this.state.data !== null ? `hidden` : `visible` }></div>

        <div
          className="main-container" data-show={ this.state.data !== null ? `visible` : `hidden` }>

          <div className="main-block">
            <div className="list-trigger" onClick={ this._openList } title="open list">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="weather-info">

              <div className="weather-info__left">
                <div className="search-block">
                  <form className="ui form" onSubmit={ this._onSearch }>
                    <div className="field">
                      <label>Search</label>
                      <input className="search-field" type="text" name="search" placeholder="Enter city name" />
                    </div>
                  </form>
                </div>

                { this.state.date !== null &&
                  <div className="weather-info__date">
                    <div className="date">{ this.state.date.date }</div>
                    <div className="day">{ this.state.date.day }</div>
                    <div className="month">{ this.state.date.month }</div>
                    <div className="year">{ this.state.date.year }</div>
                  </div>
                }
                <h1 className="city">
                  { this.state.data !== null ? this.state.data.name : null }
                  <a onClick={ this._addToList } href={ this.state.data !== null ? this.state.data.name : null } title="add to list"><i className="fa fa-plus" aria-hidden="true"></i></a>
                </h1>
                <div className="weather-info__item tempreature">
                  <div data-img={ this.state.data !== null ? `${this.state.data.weather[0].main}` : null }></div>
                  { this.state.data !== null
                    ? (
                      <span>{ `${ this.state.data.main.temp.toFixed(0) } °C` }</span>
                    )
                    : null }
                </div>

                <div id="weather-chart"></div>
              </div>
              <div className="weather-info__right">
                <div className="weather-info__item clouds">
                  <div className="icon">
                    <i className="fa fa-cloud" aria-hidden="true"></i>
                  </div>
                  { this.state.data !== null
                    ? (
                      <AnimatedNumber value={this.state.data.clouds.all}
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
                    : null }
                </div>
                <div className="weather-info__item humidity">
                  <div className="icon">
                    <i className="fa fa-tint" aria-hidden="true"></i>
                  </div>
                  { this.state.data !== null
                    ? (
                      <AnimatedNumber value={this.state.data.main.humidity}
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
                    : null }
                </div>
                <div className="weather-info__item wind">{ this.state.data !== null
                  ? (
                    <AnimatedNumber value={this.state.data.wind.speed}
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
                  : null }</div>
              </div>
            </div>
          </div>
          <List
            items={ this.state.listItems }
            loadItems={ this._loadItems }
            onClick={ this._selectCity }
            active={ this.state.data !== null ? this.state.data.name : null } />
        </div>
      </div>
    );
  }
}

class MyWeather extends React.Component {
  render() {
    return (
      <div>
        <WeatherInfo />
      </div>
    );
  }
}

// Render
ReactDOM.render(
  <MyWeather />,
  document.getElementById('app')
);
