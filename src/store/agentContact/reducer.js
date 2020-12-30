import { 
    AGENT_ADD_CONTACT,
    AGENT_REMOVE_CONTACT
} from './actionTypes'

const initialState = []

export default function(state=initialState , action) {
    switch (action.type) {
        case AGENT_ADD_CONTACT:
            let agentNewArray = state.slice()
            agentNewArray.splice(action.index, 1, action.payload)
            return agentNewArray

        case AGENT_REMOVE_CONTACT:
            let agentRemoveArray = state.slice()
            agentRemoveArray.splice(action.index, 1)
            return agentRemoveArray
    
        default:
            return state
    }
}