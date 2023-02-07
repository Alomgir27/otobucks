import { combineReducers } from 'redux'
import auth from './authReducer'
import profile from './profileReducer'
import dashboard from './dashboardReducer'
import purchaseProducts from './purchaseProductsReducer'
import others from './othersReducer'

export default combineReducers({
  auth, profile, dashboard, purchaseProducts, others
})
