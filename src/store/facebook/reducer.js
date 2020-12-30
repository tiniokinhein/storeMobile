import { ADD_FB , REMOVE_FB } from './actionTypes'

const initialState = []

export default function(state=initialState , action) {
    switch (action.type) {
        case ADD_FB:
            let addArray = state.slice()
            addArray.splice(action.index, 1 , action.payload)
            return addArray

        case REMOVE_FB:
            let removeArray = state.slice()
            removeArray.splice(action.index)
            return removeArray
    
        default:
            return state
    }
}