import { 
    ADD_CONTACT,
    REMOVE_CONTACT
} from './actionTypes'

export const addContact = contact => ({
    type: ADD_CONTACT,
    payload: contact
})

export const removeContact = contact => ({
    type: REMOVE_CONTACT,
    payload: contact
})