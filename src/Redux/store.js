import { applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import selectNumberReducer from './Housie/Reducers'

const store = createStore(selectNumberReducer, applyMiddleware(logger, thunk))

export default store;