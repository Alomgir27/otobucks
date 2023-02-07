import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducer'
import logger from 'redux-logger'

const initialState = {}

const middleware = [thunk]


const ReduxDevTool = window.__REDUX_DEVTOOLS_EXTENSION__
  ? window.__REDUX_DEVTOOLS_EXTENSION__()
  : (f) => f;

let environment = process.env.REACT_APP_NODE_ENV

const store = createStore(
  rootReducer,
  initialState,
  compose(
      applyMiddleware(...middleware, logger)
  )
)

export default store
