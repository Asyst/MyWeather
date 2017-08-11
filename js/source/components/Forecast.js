import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/';

import { withRouter, Link, Redirect } from 'react-router-dom';

class Forecast extends React.Component {
    constructor( props ) {
        super( props );
    }

    _renderChart( forecast ) {

        Highcharts.chart('weather-chart', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Monthly Average Temperature'
            },
            xAxis: {
                categories: forecast.arrDays
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
                name: forecast.cityName,
                data: forecast.arrTemp
            }]
        });
    }

    componentWillReceiveProps( nextProps ) {
        this._renderChart( nextProps.forecast );
    }

    componentDidMount() {
        this._renderChart( this.props.forecast );
    }

    render() {
        const { forecast } = this.props;

        return (
            <div className="Forecast">
                { !forecast && <Redirect to="/"/> }
                <Link to="/" className="ui primary button">Back</Link>
                <Link to="/Search" className="ui primary button">Search</Link>
                <div id="weather-chart"></div>
            </div>
        );
    }
}

function mapStateToProps( state ) {
  return {
    forecast: state.reducer.forecast,
  };
}

function mapDispatchToProps( dispatch ) {
  return {
    actions: bindActionCreators( actions, dispatch )
  };
}

export default withRouter(connect( mapStateToProps, mapDispatchToProps )( Forecast ));