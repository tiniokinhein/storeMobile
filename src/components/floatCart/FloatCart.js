import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    loadCart,
    removeProduct,
    changeProductQuantity
} from '../../store/cart/actions'
import { updateTotalCart } from '../../store/total/actions'
import CartProduct from './CartProduct'
import { withRouter } from 'react-router-dom'
import { currency } from '../../helpers/utils'
import { Translation } from 'react-i18next'
import { IonButtons, IonButton, IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel } from '@ionic/react'
import { FiArrowLeft } from 'react-icons/fi'
import { MdDeleteSweep } from 'react-icons/md'


class FloatCart extends Component 
{
    static propTypes = {
        loadCart: PropTypes.func.isRequired,
        removeProduct: PropTypes.func,
        changeProductQuantity: PropTypes.func,
        updateTotalCart: PropTypes.func.isRequired,
        cartProducts: PropTypes.array.isRequired,
        newProduct: PropTypes.object,
        productToRemove: PropTypes.object,
        productToChange: PropTypes.object
    }

    state = {
        isOpen: false
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.newProduct !== this.props.newProduct) {
            this.addProduct(nextProps.newProduct)
        }
        if(nextProps.productToRemove !== this.props.productToRemove) {
            this.removeProduct(nextProps.productToRemove)
        }
        if(nextProps.productToChange !== this.props.productToChange) {
            this.changeProductQuantity(nextProps.productToChange)
        }
    }

    openFloatCart = () => {
        document.getElementById('cartOpen').style.visibility = 'visible'
        document.getElementById('cartOpen').style.right = '0%'

        // setTimeout(() => {
        //     document.getElementById('cartOpen').style.visibility = 'hidden'
        //     document.getElementById('cartOpen').style.right = '-100%'
        // }, 8000)
    }

    closeFloatCart = () => {  
        document.getElementById('cartOpen').style.visibility = 'hidden'
        document.getElementById('cartOpen').style.right = '-100%'   
    }

    addProduct = product => {
        const { cartProducts , updateTotalCart } = this.props
        let productAlreadyInCart = false
        cartProducts.forEach(cp => {
            if(cp.id === product.id) {
                cp.quantity += product.quantity
                productAlreadyInCart = true
            }
        })
        if(!productAlreadyInCart) {
            cartProducts.push(product)
        }
        updateTotalCart(cartProducts)
        // this.openFloatCart()
    }

    removeProduct = product => {
        const { cartProducts , updateTotalCart } = this.props
        const index = cartProducts.findIndex(p => p.id === product.id)
        if(index >= 0) {
            cartProducts.splice(index,1)
            updateTotalCart(cartProducts)
        }
    }

    changeProductQuantity = changedProduct => {
        const { cartProducts , updateTotalCart } = this.props
        const product = cartProducts.find(p => p.id === changedProduct.id)
        product.quantity = changedProduct.quantity
        if(product.quantity <= 0) {
            this.removeProduct(product)
        }
        updateTotalCart(cartProducts)
    }

    proceedToCheckout = () => {
        const { productQuantity } = this.props.cartTotal
        if(!productQuantity) {
            alert('Add some product in the cart!')
        } else {
            this.props.history.push('/checkout')
            this.closeFloatCart()
        }
    }

    // discountPrice = () => {
    //     const { cartTotal } = this.props
    //     return cartTotal.totalPrice / 100 * 3
    // }

    allTotalPrice = () => {
        // const { cartTotal } = this.props
        // const TOTALPRICE = cartTotal.totalPrice - this.discountPrice()
        // return TOTALPRICE
        
        const { cartTotal } = this.props
        const TOTALPRICE = cartTotal.totalPrice
        return TOTALPRICE        
    }

    removeAllProducts = product => {
        const { cartProducts , updateTotalCart } = this.props
        const index = cartProducts.filter(p => p === product)
        if(index >= 0) {
            cartProducts.splice(index)
            updateTotalCart(cartProducts)
        }
    }

    render() {

        const { cartProducts , removeProduct , changeProductQuantity , cartTotal } = this.props

        const cssName = {
            innerBG: {
                marginBottom: '100px'
            },
            pd: {
                paddingLeft: '10px',
                paddingRight: '10px'
            },
            titlePD: {
                padding: '0 5px 0 10px'
            },
            name: {
                fontSize:'1rem',
                lineHeight:'2'
            }
        }

        const products = cartProducts.map(p => {
            return(
                <CartProduct key={p.id} product={p} removeProduct={removeProduct} changeProductQuantity={changeProductQuantity} />
            )
        })

        let classes = ['float-cart']

        if(!!this.state.isOpen) {
            classes.push('float-cart--open')
        }

        return (
            <div 
                className={classes.join(' ')} 
                id="cartOpen"
            >
                <IonPage>
                    <IonHeader className="ion-no-border">
                        <IonToolbar className="original-bg">
                            <IonButtons slot="start">
                                <button
                                    type="button"
                                    className="btn py-0 px-2 rounded-0 border-0 ion-activatable ripple-parent"
                                    onClick={() => this.closeFloatCart()}
                                    style={{
                                        height: '48px'
                                    }}
                                >
                                    <FiArrowLeft size="1.6rem" className="text-dark" />
                                </button>
                            </IonButtons>

                            <IonTitle className="text-center" size="small" style={cssName.pd}>
                                <IonLabel style={cssName.name} className="text-default">
                                    <Translation>
                                        {(t) => <>{t('main.shoppingCart')}</>}
                                    </Translation> 
                                    {
                                        products.length ? (
                                            <small className="d-inline-block ml-2 font-weight-bold text-dark">
                                                ( {products.length} )&nbsp;
                                                    <Translation>
                                                        {(t) => <>{t('main.items')}</>}
                                                    </Translation>
                                            </small>
                                        ) : null
                                    }
                                </IonLabel>
                            </IonTitle>

                            {
                                products.length ? (
                                    <IonButtons slot="end">
                                        <IonButton  
                                            onClick={() => this.removeAllProducts()}
                                        >
                                            <MdDeleteSweep size="1.6rem" className="text-danger" />
                                        </IonButton>
                                    </IonButtons>
                                ) : null
                            }

                        </IonToolbar>
                    </IonHeader>

                    <IonContent fullscreen={true} className="original-bg-light">
                        <div 
                            className="float-cart__content" 
                            id="hover-cart-show"
                            style={cssName.innerBG}
                        >
                
                            {
                                products.length <= 0 ? (
                                    <div 
                                        className="d-table w-100 px-3 position-relative"
                                        style={{
                                            marginTop: '100px'
                                        }}
                                    >
                                        <div className="d-table-cell align-middle">
                                            <p 
                                                className="shelf-empty text-center text-custom mb-0 font-weight-normal"
                                                style={{
                                                    lineHeight: '2',
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.noItemsInCart')}</>}
                                                </Translation>
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div 
                                            className="float-cart__shelf-container"
                                        >
                                            {products}
                                        </div>

                                        <div 
                                            className="float-cart__footer p-0 position-fixed bg-white shadow"
                                            style={{
                                                left: '0',
                                                right: '0',
                                                bottom: '80px'
                                            }}
                                        >
                                            <div className="py-3" style={cssName.pd}>
                                                <div 
                                                    className="d-flex mb-1"
                                                >
                                                    <div 
                                                        className="flex-grow-1 align-self-center text-dark font-weight-normal" 
                                                        style={{
                                                            lineHeight:'1.5',
                                                            fontSize: '0.8rem'
                                                        }}
                                                    >
                                                        <small>
                                                            <Translation>
                                                                {(t) => <>{t('main.subtotal')}</>}
                                                            </Translation>
                                                        </small>
                                                    </div>
                                                    <div 
                                                        className="text-right align-self-center text-dark font-weight-normal" 
                                                        style={{
                                                            lineHeight:'1.5',
                                                            fontSize: '0.8rem'
                                                        }}
                                                    >
                                                        <small>
                                                            {cartTotal.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}
                                                        </small>
                                                    </div>
                                                </div>
                                                <div 
                                                    className="d-flex"
                                                >
                                                    <div 
                                                        className="flex-grow-1 align-self-center text-default font-weight-normal" 
                                                        style={{
                                                            lineHeight:'2',
                                                            fontSize: '0.9rem'
                                                        }}
                                                    >
                                                        <Translation>
                                                            {(t) => <>{t('main.total')}</>}
                                                        </Translation>
                                                    </div>
                                                    <div 
                                                        className="text-right align-self-center text-default font-weight-normal" 
                                                        style={{
                                                            lineHeight:'2',
                                                            fontSize: '0.9rem'
                                                        }}
                                                    >
                                                        {this.allTotalPrice().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )
                            }

                        </div>
                    </IonContent>

                    <IonFooter className="ion-no-border">
                        <IonButtons className="py-3 bg-white" style={cssName.pd}>
                            <div 
                                className="d-flex w-100 overflow-hidden"
                                style={{
                                    height: '48px'
                                }}
                            >
                                {
                                    products.length <= 0 ? (
                                            <button
                                                onClick={() => this.closeFloatCart()}
                                                className="btn px-3 py-0 border-0 rounded-pill bg-default text-white shadow-none w-100"
                                                style={{
                                                    lineHeight: '2',
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.continueShopping')}</>}
                                                </Translation>
                                            </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => {
                                                    this.props.history.push('/cart')
                                                    this.closeFloatCart()
                                                }}
                                                tappable="true"
                                                className="flex-grow-1 btn px-3 py-0 mr-2 font-weight-normal border-0 rounded-pill text-white bg-default shadow-none"
                                                style={{
                                                    lineHeight: '2',
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.goToCart')}</>}
                                                </Translation>
                                            </button>
                                            <button
                                                onClick={() => this.proceedToCheckout()}
                                                tappable="true"
                                                className="btn px-3 py-0 font-weight-normal border-0 rounded-pill text-light bg-custom shadow-none"
                                                style={{
                                                    lineHeight: '2',
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.checkout')}</>}
                                                </Translation>
                                            </button>
                                        </>
                                    )
                                }
                            </div>
                        </IonButtons>
                    </IonFooter>
                </IonPage>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    cartProducts: state.cart.products,
    newProduct: state.cart.productToAdd,
    productToRemove: state.cart.productToRemove,
    productToChange: state.cart.productToChange,
    cartTotal: state.total.data
})

export default connect(
    mapStateToProps,
    {
        loadCart, removeProduct , changeProductQuantity , updateTotalCart
    }
)(withRouter(FloatCart))