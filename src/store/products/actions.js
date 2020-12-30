import { FETCH_PRODUCTS } from './actionTypes'

export const fetchProducts = (product) => dispatch => {
    return dispatch({
        type: FETCH_PRODUCTS,
        payload: product
    })
}