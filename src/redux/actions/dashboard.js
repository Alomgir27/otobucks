import { getUpcomingBookings, getDashboardStats, getTransactionStatistics, getTotalOfEarning } from '../../Api/dashboard'
import { actionTypes } from '../types';

export const getBookings = () => async dispatch => {
    const response = await getUpcomingBookings()
    dispatch({type : actionTypes.SET_UPCOMING_BOOKINGS, payload: response?.result })
};

export const getDashboardStatistics = () => async dispatch => {
  const response = await getDashboardStats()
  dispatch({type : actionTypes.SET_DASHBOARD_STATS, payload: response?.result })
};

export const getTransactionStats = (graph, startDate, endDate, setLoadingGraph) => async dispatch => {
  const response = await getTransactionStatistics(graph, startDate, endDate, setLoadingGraph)
  graph === "earning" ? dispatch({type : actionTypes.SET_EARNING_STATS , payload: response?.result })
  : dispatch({type : actionTypes.SET_SERVICE_PERFORMANCE_STATS , payload: response?.result })
};

export const getTotalEarning = () => async dispatch => {
  const response = await getTotalOfEarning()
  dispatch({type : actionTypes.SET_TOTAL_EARNING, payload: response?.result?.totalEarning })
}
