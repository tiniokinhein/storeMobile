import { 
    ADD_CONTACT,
    REMOVE_CONTACT
} from './actionTypes'

const initialState = []

export default function(state=initialState , action) {
    switch (action.type) {
        case ADD_CONTACT:
            let newArray = state.slice()
            newArray.splice(action.index, 1, action.payload)
            return newArray

        case REMOVE_CONTACT:
            let removeArray = state.slice()
            removeArray.splice(action.index, 1)
            return removeArray
    
        default:
            return state
    }
}