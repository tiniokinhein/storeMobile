import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { RiShoppingCartLine } from 'react-icons/ri'
import {
    loadCart,
    removeProduct
} from '../../store/cart/actions'
import { updateTotalCart } from '../../store/total/actions'

class CartIcon extends Component {

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.newProduct !== this.props.newProduct) {
            this.addProduct(nextProps.newProduct)
        }
        if(nextProps.productToRemove !== this.props.productToRemove) {
            this.removeProduct(nextProps.productToRemove)
        }
    }

    addProduct = () => {
        const { cartProducts , updateTotalCart } = this.props
        updateTotalCart(cartProducts)
    }

    removeProduct = () => {
        const { cartProducts , updateTotalCart } = this.props
        updateTotalCart(cartProducts)
    }

    render() {

        const { cartProducts } = this.props

        const cartNumber = {
            fontSize: '8px',
            right: '0',
            top: '-5px',
            lineHeight: '16px',
            display: 'inline-block',
            zIndex: '9999',
            height: '16px',
            width: '16px'
        }

        const cartIcon = {
            fontSize: '1.2rem'
        }

        const divWrapper = {
            width: '40px'
        }

        return (
            <div
                className="position-relative"
                style={divWrapper}
            >
                <button
                    className="d-flex btn rounded-0 border-0 shadow-none"
                    id="hover-cart"
                    onClick={() => this.props.history.push('/cart')}
                    tappable="true"
                >
                    <div
                        className="mx-auto align-self-center justify-content-center align-items-center mb-0 d-flex flex-column text-dark"
                        style={cartIcon}
                    >
                        <RiShoppingCartLine />
                    </div>

                    {
                        cartProducts.length ? (
                            <span
                                style={cartNumber}
                                className="font-weight-bold position-absolute rounded-circle bg-custom text-light"
                            >
                                <span
                                    className="d-inline-block"
                                >{cartProducts.length}</span>
                            </span>
                        ) : (
                            <></>
                        )
                    }

                </button>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    cartProducts: state.cart.products,
    newProduct: state.cart.productToAdd,
    productToRemove: state.cart.productToRemove,
    cartTotal: state.total.data
})

export default connect(
    mapStateToProps,
    {
        loadCart, removeProduct , updateTotalCart
    }
)(withRouter(CartIcon))
