import { ADD_ORDER_LINK , REMOVE_ORDER_LINK } from './actionTypes'

const initialState = []

export default function (state=initialState , action) {
    switch (action.type) {
        case ADD_ORDER_LINK:
            let addArray = state.slice()
            addArray.splice(action.index, 1, action.payload)
            return addArray

        case REMOVE_ORDER_LINK:
            let removeArray = state.slice()
            removeArray.splice(action.index, 1)
            return removeArray
    
        default:
            return state
    }
}   