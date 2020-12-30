import { combineReducers } from 'redux'
import foodReducer from './foods/reducer'
import cartReducer from './cart/reducer'
import totalReducer from './total/reducer'
import orderReducer from './order/reducer'
import whishlistReducer from './whishlist/reducer'
import productReducer from './products/reducer'
import viewReducer from './view/reducer'
import contactReducer from './contact/reducer'
import agentContactReducer from './agentContact/reducer'
import orderTemLinkReducer from './orderTemLink/reducer'
import myKyatReducer from './myKyat/reducer'
import fbReducer from './facebook/reducer'

const Reducers = combineReducers({
    foods: foodReducer,
    cart: cartReducer,
    total: totalReducer,
    order: orderReducer,
    whishlist: whishlistReducer,
    products: productReducer,
    view: viewReducer,
    contact: contactReducer,
    agentContact: agentContactReducer,
    orderTemLink: orderTemLinkReducer,
    myKyat: myKyatReducer,
    facebook: fbReducer
})

export default Reducers