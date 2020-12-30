import {
    ADD_WISH,
    REMOVE_WISH,
    DELETE_ALL_WISH
} from './actionTypes'

const initialState = {
    products: []
}

export default function(state=initialState , action) {
    switch (action.type) {
        case ADD_WISH:
            return {
                ...state,
                productToAddWhish: Object.assign({}, action.payload)
            }
        
        case REMOVE_WISH:
            return {
                ...state,
                productToRemoveWhish: Object.assign({} , action.payload)
            }

        case DELETE_ALL_WISH:
            return {
                ...state,
                productToDeleteAll: Object.assign({}, action.payload)
            }
    
        default:
            return state
    }
}