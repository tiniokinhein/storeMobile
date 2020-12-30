import { ADD_FB , REMOVE_FB } from './actionTypes'

export const add_fb = fb => ({
    type: ADD_FB,
    payload: fb
})

export const remove_fb = fb => ({
    type: REMOVE_FB,
    payload: fb
})