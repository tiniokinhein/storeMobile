import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
    IonButton,
    IonButtons,
    IonContent,
    IonFooter,
    IonHeader,
    IonLabel,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react'
import { MdAutorenew, MdDeleteSweep } from 'react-icons/md'
import ShoppingCartProducts from '../components/shoppingCart/ShoppingCartProducts'
import {
    loadCart,
    removeProduct,
    changeProductQuantity
} from '../store/cart/actions'
import { updateTotalCart } from '../store/total/actions'
import { Translation } from 'react-i18next'
import { currency } from '../helpers/utils'
import { GiTrade } from 'react-icons/gi'
import { CgDisplayGrid } from 'react-icons/cg'
import { BsFilePlus } from 'react-icons/bs'
import { BiStore } from 'react-icons/bi'
import MenuHamburger from '../components/layout/MenuHamburger'



class Cart extends Component {
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
        if (nextProps.newProduct !== this.props.newProduct) {
            this.addProduct(nextProps.newProduct)
        }
        if (nextProps.productToRemove !== this.props.productToRemove) {
            this.removeProduct(nextProps.productToRemove)
        }
        if (nextProps.productToChange !== this.props.productToChange) {
            this.changeProductQuantity(nextProps.productToChange)
        }
    }

    addProduct = product => {
        const { cartProducts, updateTotalCart } = this.props
        let productAlreadyInCart = false
        cartProducts.forEach(cp => {
            if (cp.id === product.id) {
                cp.quantity = product.quantity
                cp.selected_color = product.selected_color
                cp.selected_size = product.selected_size
                productAlreadyInCart = true
            }
        })
        if (!productAlreadyInCart) {
            cartProducts.push(product)
        }
        updateTotalCart(cartProducts)
    }

    removeProduct = product => {
        const { cartProducts, updateTotalCart } = this.props
        const index = cartProducts.findIndex(p => p.id === product.id)
        if (index >= 0) {
            cartProducts.splice(index, 1)
            updateTotalCart(cartProducts)
        }
    }

    changeProductQuantity = changedProduct => {
        const { cartProducts, updateTotalCart } = this.props
        const product = cartProducts.find(p => p.id === changedProduct.id)
        product.quantity = changedProduct.quantity
        if (product.quantity <= 0) {
            this.removeProduct(product)
        }
        updateTotalCart(cartProducts)
    }

    proceedToCheckout = () => {
        const { productQuantity } = this.props.cartTotal
        if (!productQuantity) {
            alert('Add some product in the cart!')
        } else {
            this.props.history.push('/checkout')
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
        const { cartProducts, updateTotalCart } = this.props
        const index = cartProducts.filter(p => p === product)
        if (index >= 0) {
            cartProducts.splice(index)
            updateTotalCart(cartProducts)
        }
    }

    render() {

        const { cartProducts, removeProduct, changeProductQuantity } = this.props

        const products = cartProducts.map(p => {
            return (
                <ShoppingCartProducts key={p.id} product={p} removeProduct={removeProduct} changeProductQuantity={changeProductQuantity} />
            )
        })

        const cssName = {
            pd: {
                paddingLeft: '10px',
                paddingRight: '10px'
            },
            name: {
                fontSize: '1rem',
                lineHeight: '1.6'
            },
            ht: {
                height: '48px'
            },
            layout: {
                paddingLeft: '10px',
                paddingRight: '10px'
            },
            roundedLt: {
                borderRadius: '1rem'
            },
            btnInner: {
                height: '60px'
            },
            cartBtnName: {
                fontSize: '0.95rem',
                lineHeight: '1.5'
            },
            catName: {
                fontSize: '0.6rem',
                lineHeight: '1.6'
            },
            secName: {
                fontSize: '0.7rem',
                lineHeight: '1.5'
            },
            labelName: {
                fontSize: '0.5rem',
                lineHeight: '2'
            }
        }

        const productLists = (
            <div className="d-table w-100 h-100">
                <div className="d-table-cell align-middle text-center">
                    <button
                        className="btn border-0 rounded-0 shadow-none"
                        onClick={() => this.props.history.push('/new-products')}
                        tappable="true"
                    >
                        <BsFilePlus size="3rem" className="text-custom" />
                    </button>
                </div>
            </div>
        )

        const totalPrice = (
            <div style={cssName.layout}>
                <h6
                    className="my-0 font-weight-normal text-black-50"
                    style={cssName.catName}
                >
                    <Translation>
                        {(t) => <>{t('main.total')}</>}
                    </Translation>
                </h6>
                <h4
                    className="m-0 text-custom"
                    style={cssName.name}
                >
                    {this.allTotalPrice().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <span style={cssName.secName} className="font-weight-normal text-black-50">{currency}</span>
                </h4>
            </div>
        )

        const checkoutList = (
            <button
                className="btn bg-custom border-0 shadow-none px-5 py-0 text-light font-weight-normal position-relative"
                style={{
                    ...cssName.cartBtnName,
                    ...cssName.btnInner,
                    borderRadius: 0,
                    borderTopLeftRadius: '1.3rem'
                }}
                onClick={() => this.proceedToCheckout()}
                tappable="true"
            >
                <div 
                    className="cart-btn-bg-border position-absolute"
                    style={{
                        left: '-30px',
                        bottom: '-1px',
                        zIndex: '1',
                        width: '30px',
                        height: '30px',
                        borderBottomRightRadius: '1.3rem'
                    }}
                />
                <div 
                    className="bg-custom position-absolute"
                    style={{
                        left: '-29px',
                        bottom: '0',
                        zIndex: '-1',
                        width: '30px',
                        height: '28px'
                    }}
                />
                <Translation>
                    {(t) => <>{t('main.checkout')}</>}
                </Translation>
            </button>
        )

        const priceCheckout = (
            <>
                <IonButtons slot="start">
                    {totalPrice}
                </IonButtons>

                <IonButtons slot="end" className="mr-0">
                    {checkoutList}
                </IonButtons>
            </>
        )

        const noCheckout = (
            <IonButtons>
                <button 
                    onClick={() => this.props.history.push("/home")}
                    tappable="true"
                    className="btn d-flex flex-column p-0 shadow-none rounded-0 border-0 w-100 align-items-center text-default"
                >
                    <BiStore size="1rem" />
                    <IonLabel className="mb-0 mt-0 font-weight-normal px-2" style={cssName.labelName}>
                        <Translation>
                            {(t) => <>{t('main.home')}</>}
                        </Translation>
                    </IonLabel>
                </button>
                
                <button 
                    onClick={() => this.props.history.push("/new-products")}
                    tappable="true"
                    className="btn d-flex flex-column p-0 shadow-none rounded-0 border-0 w-100 align-items-center text-default"
                >
                    <MdAutorenew size="1rem" />
                    <IonLabel className="mb-0 mt-0 font-weight-normal px-2" style={cssName.labelName}>
                        <Translation>
                            {(t) => <>{t('main.newproducts')}</>}
                        </Translation>
                    </IonLabel>
                </button>
                <button 
                    onClick={() => this.props.history.push("/brands")}
                    tappable="true"
                    className="btn d-flex flex-column p-0 shadow-none rounded-0 border-0 w-100 align-items-center text-default"
                >
                    <GiTrade size="1rem" />
                    <IonLabel className="mb-0 mt-0 font-weight-normal px-2" style={cssName.labelName}>
                        <Translation>
                            {(t) => <>{t('main.brands.explore')}</>}
                        </Translation>
                    </IonLabel>
                </button>
                
                <button 
                    onClick={() => this.props.history.push("/product-categories")}
                    tappable="true"
                    className="btn d-flex flex-column p-0 shadow-none rounded-0 border-0 w-100 align-items-center text-default"
                >
                    <CgDisplayGrid size="1rem" />
                    <IonLabel className="mb-0 mt-0 font-weight-normal px-2" style={cssName.labelName}>
                        <Translation>
                            {(t) => <>{t('main.menu.categories')}</>}
                        </Translation>
                    </IonLabel>
                </button>
            </IonButtons>
        )

        return (         
            <IonPage>
                <IonHeader className="ion-no-border">
                    <IonToolbar className="original-bg">
                        <IonButtons slot="start">
                            <IonMenuButton autoHide={false}>
                                <MenuHamburger />
                            </IonMenuButton>
                        </IonButtons>

                        <IonTitle className="text-center" size="small" style={cssName.pd}>
                            <IonLabel style={cssName.name} className="text-default font-weight-normal">
                                <Translation>
                                    {(t) => <>{t('main.shoppingCart')}</>}
                                </Translation>
                            </IonLabel>
                        </IonTitle>

                        {
                            cartProducts.length ? (
                                <IonButtons slot="end">
                                    <IonButton
                                        onClick={() => this.removeAllProducts()}
                                        style={cssName.ht}
                                    >
                                        <MdDeleteSweep size="1.6rem" className="text-danger" />
                                    </IonButton>
                                </IonButtons>
                            ) : (
                                    <IonButtons slot="end">
                                        <IonButton style={{ ...cssName.ht, width: '48px' }} />
                                    </IonButtons>
                                )
                        }

                    </IonToolbar>
                </IonHeader>

                <IonContent fullscreen={true} className="ion-no-border original-bg">
                    {
                        products.length <= 0 ? productLists : (
                            <>
                                {
                                    cartProducts.length ? (
                                        <h4
                                            className="mb-0 mt-3 font-weight-normal text-default"
                                            style={{
                                                ...cssName.cartBtnName,
                                                ...cssName.pd
                                            }}
                                        >
                                            <Translation>
                                                    {(t) => <>{t('main.product')}</>}
                                            </Translation>
                                            <small className="d-inline-block ml-2 font-weight-bold text-custom">
                                                ( {cartProducts.length} )&nbsp;
                                                <Translation>
                                                    {(t) => <>{t('main.items')}</>}
                                                </Translation>
                                            </small>
                                        </h4>
                                    ) : null
                                }
                            
                                {products}
                            </>
                        )
                    }
                </IonContent>

                <IonFooter className="ion-no-border shadow">
                    {
                        products.length <= 0 ? (
                            <IonToolbar className="original-tab-bg">
                                {noCheckout}
                            </IonToolbar>
                        ) : (
                            <IonToolbar className="original-tab-bg" style={cssName.btnInner}>
                                {priceCheckout}
                            </IonToolbar>
                        )
                    }
                </IonFooter>
            </IonPage>
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
    { loadCart, removeProduct, changeProductQuantity, updateTotalCart }
)(withRouter(Cart))