import { List, Map } from 'immutable';
import { 
  GET_WEATHER_REQUEST, 
  GET_WEATHER_SUCCESS,
  ON_SEARCH,
  ADD_ITEM,
  DELETE_ITEM,
  NOT_SELECTED,
  FORECAST_SUCCESS } from '../constants';

const rootReducer = ( state = {}, action ) => {

  switch ( action.type ) {
    case GET_WEATHER_REQUEST:
      return { ...state, 
        data: action.data, 
        fetching: true };
      break;
    case GET_WEATHER_SUCCESS:
      return {...state, 
        data: action.dataList, 
        cityName: action.cityName,
        date: action.date,
        showSearch: action.showSearch,
        fetching: false};
      break;
    case FORECAST_SUCCESS:
      return {...state, 
        forecast: action.forecast };
      break;
    case NOT_SELECTED:
      return { ...state, 
        showSearch:action.showSearch }
      break;
    case ADD_ITEM:
      if ( !state.citiesList.includes(action.cityName) ) {
        return { ...state, citiesList: state.citiesList.push(action.cityName) };
      }
      else {
        console.log('this city already exist: ', action.cityName);
        return state;
      }
      break;
    case DELETE_ITEM:
       return { ...state, citiesList: state.citiesList.filter(( cityName ) => {
            return cityName !== action.cityWillRemove;
          })
        }
      break;
    default:
      return state;
  }
}

export default rootReducer;
