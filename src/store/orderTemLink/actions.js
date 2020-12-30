import { ADD_ORDER_LINK , REMOVE_ORDER_LINK } from './actionTypes'

export const addOrderLink = payload => ({
    type: ADD_ORDER_LINK,
    payload
})

export const removeOrderLink = payload => ({
    type: REMOVE_ORDER_LINK,
    payload
})