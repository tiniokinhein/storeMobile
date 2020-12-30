import {
    ADD_WISH,
    DELETE_ALL_WISH,
    REMOVE_WISH
} from './actionTypes'

export const addWish = whishlist => ({
    type: ADD_WISH,
    payload: whishlist
})

export const removeWish = whishlist => ({
    type: REMOVE_WISH,
    payload: whishlist
})

export const deleteAllWish = whishlist => ({
    type: DELETE_ALL_WISH,
    payload: whishlist
})