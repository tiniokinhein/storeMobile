import { 
    ADD_VIEW,
    REMOVE_VIEW
} from './actionTypes'

export const addView = view => ({
    type: ADD_VIEW,
    payload: view
})

export const removeView = view => ({
    type: REMOVE_VIEW,
    payload: view
})