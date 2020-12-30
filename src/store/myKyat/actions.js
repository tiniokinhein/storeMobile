import { ADD_MYKYAT , REMOVE_MYKYAT } from './actionTypes'

export const addMyKyat = mykyat => ({
    type: ADD_MYKYAT,
    payload: mykyat
})

export const removeMyKyat = mykyat => ({
    type: REMOVE_MYKYAT,
    payload: mykyat
})