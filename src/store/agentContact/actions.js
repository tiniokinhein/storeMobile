import { 
    AGENT_ADD_CONTACT,
    AGENT_REMOVE_CONTACT
} from './actionTypes'

export const agentAddContact = contact => ({
    type: AGENT_ADD_CONTACT,
    payload: contact
})

export const agentRemoveContact = contact => ({
    type: AGENT_REMOVE_CONTACT,
    payload: contact
})