import { ADD_MYKYAT , REMOVE_MYKYAT } from './actionTypes'

const initialState = []

export default function (state=initialState , action) {
    switch (action.type) {
        case ADD_MYKYAT:
            let addArrays = state.slice()
            addArrays.splice(action.index, 1 , action.payload)
            return addArrays

        case REMOVE_MYKYAT:
            let removeArrays = state.slice()
            removeArrays.splice(action.index, 1)
            return removeArrays
    
        default:
            return state
    }
}