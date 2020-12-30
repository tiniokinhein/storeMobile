import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { auth } from '../../helpers/firebase'
import { Translation } from 'react-i18next'
import Name from '../../components/user/Name'
import { 
    IonButton,
    IonButtons, 
    IonContent, 
    IonFooter, 
    IonHeader, 
    IonItem, 
    IonLabel, 
    IonList, 
    IonMenuButton, 
    IonPage,  
    IonText,  
    IonToolbar
} from '@ionic/react'
import MenuHamburger from '../../components/layout/MenuHamburger'
import { connect } from 'react-redux'
import { FaPen, FaPowerOff, FaRegAddressCard } from 'react-icons/fa'
import { RiArrowRightSLine, RiShoppingCartLine } from 'react-icons/ri'
import { VscPackage } from 'react-icons/vsc'
import { BiStore } from 'react-icons/bi'
import { BsFilePlus, BsHeartHalf } from 'react-icons/bs'
import { CgTimelapse } from 'react-icons/cg'
import { HiOutlineBell } from 'react-icons/hi'
import {
    loadCart,
    removeProduct
} from '../../store/cart/actions'
import { updateTotalCart } from '../../store/total/actions'


class Manage extends Component 
{
    _isMounted = false

    state = {
        user: null
    }

    componentDidMount() {
        this._isMounted = true

        auth.onAuthStateChanged((user) => {
            if(this._isMounted) {
                if(user) {
                    this.setState({
                        user: auth.currentUser
                    })
                    this.props.history.push('/manage-account')
                } else {
                    this.setState({
                        user: null
                    })
                    this.props.history.push('/home')
                }
            }
        })

        const data = JSON.parse(localStorage.getItem('fbuser'))
        this.setState({
            user: data
        })
    }

    componentWillUnmount() {
        this._isMounted = false
    }

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

        const cssName = {
            bRadius: {
                borderRadius: '0.7rem'
            },
            layout: {
                paddingLeft: '10px',
                paddingRight: '10px'
            },
            listBG: {
                '--ion-background-color': 'transparent',
                '--ion-item-background': 'transparent'
            },
            iconBg: {
                background: '#e8e8e8',
                width: '40px',
                height: '40px'
            },
            labelName: {
                fontSize: '0.5rem',
                lineHeight: '2'
            },
            cartNumber : {
                fontSize: '8px',
                right: '50%',
                top: '-5px',
                lineHeight: '18px',
                display: 'inline-block',
                zIndex: '9999',
                height: '16px',
                width: '16px',
                marginRight: '-20px'
            },
            titleName: {
                fontSize: '0.9rem',
                lineHeight: '1.6'
            },
            title: {
                fontSize: '1rem',
                lineHeight: '1.6'
            }
        }

        const updateNoti = (
            <div className="mt-4">
                <h4
                    className="mt-0 mb-2 font-weight-normal text-default"
                    style={{...cssName.title,...cssName.layout}}
                >
                    <Translation>
                        {(t) => t('main.notifications')}
                    </Translation>
                </h4>

                <div
                    className=""
                    style={{
                        overflowX: 'scroll'
                    }}
                >
                    <div className="" style={cssName.layout}>
                        <IonButton 
                            routerLink="/new-products" 
                            expand="block" 
                            style={{
                                '--background': '#fff',
                                '--box-shadow': '0 .125rem .25rem rgba(0,0,0,.075)',
                                '--border-radius': '0.7rem',
                                height: 'auto'
                            }}
                        >
                            <span className="d-block py-3">
                                <BsFilePlus size="2rem" className="text-custom" />
                            </span>
                        </IonButton>
                    </div>
                </div>
            </div>
        )

        const addressLists = (
            <div className="bg-white shadow-sm mb-3 overflow-hidden" style={cssName.bRadius}>
                <IonList lines="none" style={cssName.listBG} className="p-0">
                    <IonItem routerLink="/" className="px-0">
                        <span className="mr-2 d-flex align-items-center justify-content-center bg-default" style={{...cssName.iconBg,...cssName.bRadius}}>
                            <FaRegAddressCard size="1.2rem" className="text-white" />
                        </span>
                        <IonText className="text-left text-default my-4" style={cssName.titleName}>
                            <Translation>
                                {(t) => t('main.addresses')}
                            </Translation>
                        </IonText>
                        <span className="ml-auto text-right">
                            <RiArrowRightSLine size="1.5rem" className="text-default" />
                        </span>
                    </IonItem>
                </IonList>
            </div>
        )

        const orderLists = (
            <div className="bg-white shadow-sm mb-3 overflow-hidden" style={cssName.bRadius}>
                <IonList lines="none" style={cssName.listBG} className="p-0">
                    <IonItem routerLink="/" className="px-0">
                        <span className="mr-2 d-flex align-items-center justify-content-center bg-default" style={{...cssName.iconBg,...cssName.bRadius}}>
                            <VscPackage size="1.2rem" className="text-white" />
                        </span>
                        <IonText className="text-left text-default my-4" style={cssName.titleName}>
                            <Translation>
                                {(t) => t('main.orders')}
                            </Translation>
                        </IonText>
                        <span className="ml-auto text-right">
                            <RiArrowRightSLine size="1.5rem" className="text-default" />
                        </span>
                    </IonItem>
                </IonList>
            </div>
        )

        const favouriteLists = (
            <div className="bg-white shadow-sm mb-3 overflow-hidden" style={cssName.bRadius}>
                <IonList lines="none" style={cssName.listBG} className="p-0">
                    <IonItem routerLink='/favourite-list' className="px-0">
                        <span className="mr-2 d-flex align-items-center justify-content-center bg-default" style={{...cssName.iconBg,...cssName.bRadius}}>
                            <BsHeartHalf size="1.2rem" className="text-white" />
                        </span>
                        <IonText className="text-left text-default my-4" style={cssName.titleName}>
                            <Translation>
                                {(t) => t('main.favourite.product.list')}
                            </Translation>
                        </IonText>
                        <span className="ml-auto text-right">
                            <RiArrowRightSLine size="1.5rem" className="text-default" />
                        </span>
                    </IonItem>
                </IonList>
            </div>
        )

        const viewLists = (
            <div className="bg-white shadow-sm mb-3 overflow-hidden" style={cssName.bRadius}>
                <IonList lines="none" style={cssName.listBG} className="p-0">
                    <IonItem routerLink='/view' className="px-0">
                        <span className="mr-2 d-flex align-items-center justify-content-center bg-default" style={{...cssName.iconBg,...cssName.bRadius}}>
                            <CgTimelapse size="1.2rem" className="text-white" />
                        </span>
                        <IonText className="text-left text-default my-4" style={cssName.titleName}>
                            <Translation>
                                {(t) => t('main.recently.views')}
                            </Translation>
                        </IonText>
                        <span className="ml-auto text-right">
                            <RiArrowRightSLine size="1.5rem" className="text-default" />
                        </span>
                    </IonItem>
                </IonList>
            </div>
        )

        const outField = (
            <div className="bg-white shadow-sm overflow-hidden" style={cssName.bRadius}>
                <IonList lines="none" style={cssName.listBG} className="p-0">
                    <IonItem onClick={() => auth.signOut()} className="px-0">
                        <span className="mr-2 d-flex align-items-center justify-content-center bg-custom" style={{...cssName.iconBg,...cssName.bRadius}}>
                            <FaPowerOff size="1.2rem" className="text-light" />
                        </span>
                        <IonText className="text-left text-default my-4" style={cssName.titleName}>
                            <Translation>
                                {(t) => t('main.logout')}
                            </Translation>
                        </IonText>
                    </IonItem>
                </IonList>
            </div>
        )

        return (

            <IonPage>
                <IonHeader className="ion-no-border">
                    <IonToolbar style={{'--background':'transparent'}}>
                        <IonButtons slot="start">
                            <IonMenuButton autoHide={false} >
                                <IonButton className="rounded-lg bg-custom-transparent mx-0">
                                    <MenuHamburger />
                                </IonButton>
                            </IonMenuButton>
                        </IonButtons>
                        <IonButtons slot="end">
                            <IonButton className="rounded-lg bg-custom-transparent mr-1" routerLink="/edit-profile">
                                <FaPen size="1rem" className="text-dark" />
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                
                <IonContent fullscreen={true} className="original-bg">
                    
                    <Name user={this.state.user} />  

                    {updateNoti} 

                    <div style={cssName.layout} className="py-5">
                        {favouriteLists}
                        {viewLists}
                        {addressLists}
                        {orderLists}
                        {outField}
                    </div>  

                </IonContent>

                <IonFooter className="ion-no-border shadow">
                    <IonToolbar className="original-tab-bg" style={{height:'50px'}}>
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
                                onClick={() => this.props.history.push("/home")}
                                tappable="true"
                                className="btn d-flex flex-column p-0 shadow-none rounded-0 border-0 w-100 align-items-center text-default position-relative"
                            >
                                <HiOutlineBell size="1rem" />
                                <IonLabel className="mb-0 mt-0 font-weight-normal px-2" style={cssName.labelName}>
                                    <Translation>
                                        {(t) => <>{t('main.notifications')}</>}
                                    </Translation>
                                </IonLabel>

                                {
                                    this.props.cartProducts.length ? (
                                        <span
                                            style={cssName.cartNumber}
                                            className="font-weight-bold position-absolute rounded-circle bg-custom text-light"
                                        >
                                            <span
                                                className="d-inline-block"
                                            >{this.props.cartProducts.length}</span>
                                        </span>
                                    ) : (
                                        <></>
                                    )
                                }

                            </button>
                            <button 
                                onClick={() => this.props.history.push("/cart")}
                                tappable="true"
                                className="btn d-flex flex-column p-0 shadow-none rounded-0 border-0 w-100 align-items-center text-default position-relative"
                            >
                                <RiShoppingCartLine size="1rem" />
                                <IonLabel className="mb-0 mt-0 font-weight-normal px-2" style={cssName.labelName}>
                                    <Translation>
                                        {(t) => <>{t('main.cartIcon')}</>}
                                    </Translation>
                                </IonLabel>

                                {
                                    this.props.cartProducts.length ? (
                                        <span
                                            style={cssName.cartNumber}
                                            className="font-weight-bold position-absolute rounded-circle bg-custom text-light"
                                        >
                                            <span
                                                className="d-inline-block"
                                            >{this.props.cartProducts.length}</span>
                                        </span>
                                    ) : (
                                        <></>
                                    )
                                }

                            </button>
                        </IonButtons>
                    </IonToolbar>
                </IonFooter>

            </IonPage>

        )
    }
}

const mapStateToProps = state => ({
    facebook: state.facebook,
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
)(withRouter(Manage))