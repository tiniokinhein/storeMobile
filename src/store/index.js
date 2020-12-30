import { 
    createStore,
    applyMiddleware,
    compose
} from 'redux'
import thunk from 'redux-thunk'
import Reducers from './reducers'

export default initialState => {

    initialState = JSON.parse(window.localStorage.getItem('state')) || initialState

    const middleware = [thunk]

    const store = createStore(
        Reducers,
        initialState,
        compose(
            applyMiddleware(...middleware)
        )
    )

    store.subscribe(() => {
        const state = store.getState()
        const persist = {
            cart: state.cart,
            total: state.total,
            order: state.order,
            whishlist: state.whishlist,
            view: state.view,
            contact: state.contact,
            agentContact: state.agentContact,
            orderTemLink: state.orderTemLink,
            myKyat: state.myKyat,
            facebook: state.facebook
        }
        window.localStorage.setItem('state' , JSON.stringify(persist))
    })

    return store
    
}