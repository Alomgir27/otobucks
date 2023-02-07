import { actionTypes } from '../types'

const initialState = {}
const purchaseProducts = (state = initialState, action) => {
  switch(action.type){
    case actionTypes.SET_ALL_STORES:
      return {
        ...state, stores : action.payload,
      }
      case actionTypes.SET_CART_DATA:
        return {
          ...state, cart : action.payload
        }
        case actionTypes.SET_SUBCATEGORIES:
          return {
            ...state, subCategories : action.payload
          }
          case actionTypes.SET_PRODUCTS:
            return {
              ...state, products : action.payload
            }
            case actionTypes.SET_STORE_ID:
              return {
                ...state, storeId : action.payload
              }
      default:
      return state;
  }
}

export default purchaseProducts