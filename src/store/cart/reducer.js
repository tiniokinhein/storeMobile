import {
    ADD_PRODUCT,
    REMOVE_PRODUCT,
    CHANGE_PRODUCT_QUANTITY,
    LOAD_CART,
    UPDATE_CART
} from './actionTypes'

const initialState = {
    products: []
}

export default function(state=initialState , action) {
    switch(action.type) {
        case LOAD_CART:
            return {
                ...state,
                products: action.payload
            }
        case ADD_PRODUCT:
            return {
                ...state,
                productToAdd: Object.assign({} , action.payload)
            }
        case REMOVE_PRODUCT:
            return {
                ...state,
                productToRemove: Object.assign({} , action.payload) 
            }
        case CHANGE_PRODUCT_QUANTITY:
            return {
                ...state,
                productToChange: Object.assign({} , action.payload) 
            }
        case UPDATE_CART:
            return {
                ...state,
                productToUpdate: Object.assign({} , action.payload) 
            }
        default:
            return state
    }
}