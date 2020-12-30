import { 
    ADD_VIEW,
    REMOVE_VIEW
} from './actionTypes'

const initialState = []

export default function(state=initialState , action) {
    switch (action.type) {
        case ADD_VIEW:
            let newArray = state.slice()
            newArray.splice(action.index, 0, action.payload)
            return newArray

        case REMOVE_VIEW:
            let removeArray = state.slice()
            // removeArray.splice(action.index, 1)
            removeArray.splice(action.index)
            return removeArray
    
        default:
            return state
    }
}