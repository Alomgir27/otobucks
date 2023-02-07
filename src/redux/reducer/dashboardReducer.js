import { actionTypes } from '../types'

const initialState = {}
const dashboard = (state = initialState, action) => {
  switch(action.type){
    case actionTypes.SET_UPCOMING_BOOKINGS:
      return {
        ...state, upComingBookings : action.payload
      }
      case actionTypes.SET_DASHBOARD_STATS:
        return {
          ...state, stats : action.payload
        }
        case actionTypes.SET_EARNING_STATS:
          return {
            ...state, earningStats : action.payload 
          }
          case actionTypes.SET_SERVICE_PERFORMANCE_STATS:
            return {
              ...state, servicePerformanceStats : action.payload
            }
            case actionTypes.SET_TOTAL_EARNING:
              return {
                ...state, totalEarning : action.payload
              }
      default:
      return state;
  }
}

export default dashboard