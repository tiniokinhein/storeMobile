import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { removeView } from '../store/view/actions'
import {  
    IonButton, 
    IonButtons, 
    IonCol, 
    IonContent, 
    IonFooter, 
    IonGrid, 
    IonHeader, 
    IonicSafeString, 
    IonLabel, 
    IonMenuButton, 
    IonPage, 
    IonRow, 
    IonTitle, 
    IonToast, 
    IonToolbar 
} from '@ionic/react'
import { Translation } from 'react-i18next'
import { MdAutorenew, MdDeleteSweep } from 'react-icons/md'
import { currency } from '../helpers/utils'
import { BiMinus, BiStore } from 'react-icons/bi'
import { BsFilePlus, BsPlus } from "react-icons/bs"
import { addProduct , removeProduct } from '../store/cart/actions'
import { GiTrade } from 'react-icons/gi'
import { CgDisplayGrid } from 'react-icons/cg'
import { addWish, removeWish } from '../store/whishlist/actions'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import MenuHamburger from '../components/layout/MenuHamburger'


const FETCHIMG = process.env.REACT_APP_FETCH_IMAGES

class View extends Component {

    static propTypes = {
        removeView: PropTypes.func.isRequired,
        whishlists: PropTypes.array.isRequired,
        newWish: PropTypes.object,
        deleteWish: PropTypes.object
    }

    state = {
        showPopCart: false,
        closePopCart: false
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.newWish !== this.props.newWish) {
            this.addWish(nextProps.newWish)
        }
        if(nextProps.deleteWish !== this.props.deleteWish) {
            this.removeWish(nextProps.deleteWish)
        }
    }

    addWish = p => {
        const { whishlists } = this.props
        let productInWish = false
        whishlists.forEach(c => {
            if(c.id === p.id) {
                productInWish = true
            }
        })
        if(!productInWish) {
            whishlists.push(p)
        }
    }

    removeWish = p => {
        const { whishlists } = this.props
        const index = whishlists.findIndex(f => f.id === p.id)
        if(index >= 0) {
            whishlists.splice(index, 1)
        }
    }

    render() {

        const { views } = this.props

        const cssName = {
            titlePD: {
                padding: '0 5px 0 10px'
            },
            name: {
                fontSize:'1rem',
                lineHeight:'2'
            },
            ht: {
                height: '48px'
            },
            titleName: {
                fontSize: '0.9rem',
                lineHeight: '2'
            },
            overflow: {
                overflowX: 'scroll'
            },
            pdLayout: {
                paddingLeft: '5px',
                paddingRight: '5px'
            },
            headName: {
                fontSize: '1rem',
                lineHeight: '1.7em'
            },
            borderadius: {
                borderRadius: '1rem'
            },
            border: {
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent'
            },
            lineLimit: {
                fontSize: '0.9rem',
                lineHeight: '1.6em',
                height: '42px',
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical'
            },
            catName: {
                fontSize: '0.6rem',
                lineHeight: '1.6em'
            },
            pd: {
                paddingLeft: '10px',
                paddingRight: '10px'
            },
            labelName: {
                fontSize: '0.5rem',
                lineHeight: '2'
            }
        }

        const lists = views.length <= 0 ? (
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
        ) : (
            <>
                <h4
                    className="mb-0 mt-2 font-weight-normal text-default"
                    style={{
                        ...cssName.headName,
                        ...cssName.pd
                    }}
                >
                    <Translation>
                            {(t) => <>{t('main.product')}</>}
                    </Translation>
                    <small className="d-inline-block ml-2 font-weight-bold text-custom">
                        ( {
                                views
                                .reduce((ac,current) => {
                                    const x = ac.find(f => f.id === current.id)
                                    if(!x) {
                                        return ac.concat([current])
                                    } else {
                                        return ac
                                    }
                                },[])
                                .length
                        } )&nbsp;
                        <Translation>
                            {(t) => <>{t('main.items')}</>}
                        </Translation>
                    </small>
                </h4>

                <IonGrid>
                    <IonRow>
                        {
                            views.reduce((ac,current) => {
                                const x = ac.find(f => f.id === current.id)
                                if(!x) {
                                    return ac.concat([current])
                                } else {
                                    return ac
                                }
                            },[]).map((p,index) => {

                                p.quantity = 1

                                const inCart = this.props.cartProducts ? this.props.cartProducts.find(f => f.id === p.id) : null

                                const inWhish = this.props.whishlists ? this.props.whishlists.find(f => f.id === p.id) : null

                                return (
                                    <IonCol size="12" sizeMd="6" key={index}>
                                        <div 
                                            className="bg-white overflow-hidden shadow d-flex h-100 position-relative"    
                                            style={{...cssName.borderadius}}
                                        >
                                            <div
                                                className="position-absolute"
                                                style={{
                                                    right: 0,
                                                    top: 0,
                                                    zIndex: 1
                                                }}
                                            >
                                                {
                                                    inWhish ? (
                                                        <button
                                                            className="btn px-2 py-1 shadow-none border-0"
                                                            onClick={() => this.props.removeWish(p)}
                                                            style={{
                                                                ...cssName.wish,
                                                                width: '60px'
                                                            }}
                                                        >
                                                            <AiFillHeart size="2rem" className="text-custom" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn px-2 py-1 shadow-none border-0 bg-custom"
                                                            onClick={() => this.props.addWish(p)}
                                                            style={{
                                                                ...cssName.wish,
                                                                width: '60px',
                                                                borderRadius: '0px 0px 0px 1rem'
                                                            }}
                                                        >
                                                            <AiOutlineHeart size="2rem" className="text-light" />
                                                        </button>
                                                    )
                                                }
                                            </div>

                                            <button
                                                onClick={() => this.props.history.push(`/product/${p.slug}`)}                                      
                                                className="btn text-transparent p-0 border-0 rounded-0 shadow-none h-100"
                                            >
                                                <img 
                                                    src={FETCHIMG+`/${p.image}`} 
                                                    alt={p.title} 
                                                    style={{
                                                        width: '150px',
                                                        backgroundColor: '#fff4e2',
                                                        ...cssName.borderadius
                                                    }}
                                                    className="m-2"
                                                />  
                                            </button>
                                            <div className="w-100 h-100 pl-2">
                                                <button
                                                    onClick={() => this.props.history.push(`/product/${p.slug}`)}                                      
                                                    className="btn text-left text-transparent link-default-hover link-scale-hover d-block w-100 p-0 border-0 rounded-0 shadow-none"
                                                >
                                                    <div 
                                                        className="px-3 pt-3 pb-3 font-weight-normal"
                                                    >
                                                        <h4 
                                                            className="mt-0 mb-1 text-black-50"
                                                            style={cssName.catName}
                                                        >                                                   
                                                            <Translation>
                                                                {(t) => 
                                                                    <>
                                                                        {
                                                                            t(
                                                                                'main.post.title',
                                                                                { 
                                                                                    title_en: p.subcategory.title,
                                                                                    title_mm: p.subcategory.title_mm
                                                                                }
                                                                            )
                                                                        }
                                                                    </>
                                                                }
                                                            </Translation>
                                                        </h4>
                                                        <h4 
                                                            className="m-0 text-default"
                                                            style={cssName.lineLimit}
                                                        >                                                   
                                                            <Translation>
                                                                {(t) => 
                                                                    <>
                                                                        {
                                                                            t(
                                                                                'main.post.title',
                                                                                { 
                                                                                    title_en: p.title,
                                                                                    title_mm: p.title_mm
                                                                                }
                                                                            )
                                                                        }
                                                                    </>
                                                                }
                                                            </Translation>
                                                        </h4>
                                                    </div>
                                                </button> 

                                                {
                                                    p.color && p.size ? (
                                                        inCart ? (
                                                            <button
                                                                className="btn p-0 border-0 text-center d-flex rounded-0 shadow-none font-weight-light w-100 overflow-hidden"  
                                                                onClick={() => {
                                                                    this.props.removeProduct(p)
                                                                    this.setState({
                                                                        closePopCart: true
                                                                    })
                                                                }}                                              
                                                            >
                                                                <div
                                                                    className="flex-grow-1 font-weight-bold text-custom text-left pl-3 py-2"
                                                                    style={{                                                                                                   
                                                                        height: '40px',
                                                                        lineHeight: '1.6',
                                                                        fontSize: '0.8rem'
                                                                    }}
                                                                >
                                                                    {p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <span className="text-muted font-weight-normal">{currency}</span>
                                                                </div>
                                                                <div
                                                                    className="ml-auto bg-default"
                                                                    style={{
                                                                        width: '60px',
                                                                        height: '40px',
                                                                        lineHeight: '40px',
                                                                        fontSize: '1.5rem',
                                                                        borderTopLeftRadius: '1rem'
                                                                    }}                                                        
                                                                >
                                                                    <BiMinus className="text-white" />
                                                                </div>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn p-0 border-0 text-center d-flex rounded-0 shadow-none font-weight-light w-100 overflow-hidden"  
                                                                onClick={() => this.props.history.push(`/product/${p.slug}`)}                                              
                                                            >
                                                                <div
                                                                    className="flex-grow-1 font-weight-bold text-custom text-left pl-3 py-2"
                                                                    style={{                                                                                                   
                                                                        height: '40px',
                                                                        lineHeight: '1.6',
                                                                        fontSize: '0.8rem'
                                                                    }}
                                                                >
                                                                    {p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <span className="text-muted font-weight-normal">{currency}</span>
                                                                </div>
                                                                <div
                                                                    className="text-light ml-auto bg-custom"
                                                                    style={{
                                                                        width: '60px',
                                                                        height: '40px',
                                                                        lineHeight: '40px',
                                                                        fontSize: '1.5rem',
                                                                        borderTopLeftRadius: '1rem'
                                                                    }}                                                        
                                                                >
                                                                    <BsPlus />
                                                                </div>
                                                            </button>
                                                        )
                                                    ) : (
                                                        inCart ? (
                                                            <button
                                                                className="btn p-0 border-0 text-center d-flex rounded-0 shadow-none font-weight-light w-100 overflow-hidden"
                                                                onClick={() => {
                                                                    this.props.removeProduct(p)
                                                                    this.setState({
                                                                        closePopCart: true
                                                                    })
                                                                }}
                                                            >
                                                                <div
                                                                    className="flex-grow-1 font-weight-bold text-custom text-left pl-3 py-2"
                                                                    style={{                                                                                                   
                                                                        height: '40px',
                                                                        lineHeight: '1.6',
                                                                        fontSize: '0.8rem'
                                                                    }}
                                                                >
                                                                    {p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <span className="text-muted font-weight-normal">{currency}</span>
                                                                </div>
                                                                <div
                                                                    className="ml-auto bg-default"
                                                                    style={{
                                                                        width: '60px',
                                                                        height: '40px',
                                                                        lineHeight: '40px',
                                                                        fontSize: '1.5rem',
                                                                        borderTopLeftRadius: '1rem'
                                                                    }} 
                                                                >
                                                                    <BiMinus className="text-white" />
                                                                </div> 
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn p-0 border-0 text-center d-flex rounded-0 shadow-none font-weight-light w-100 overflow-hidden"
                                                                onClick={() => {
                                                                    this.props.addProduct(p)
                                                                    this.setState({
                                                                        showPopCart: true
                                                                    })
                                                                }}
                                                            >
                                                                <div
                                                                    className="flex-grow-1 font-weight-bold text-custom text-left pl-3 py-2"
                                                                    style={{                                                                                                   
                                                                        height: '40px',
                                                                        lineHeight: '1.6',
                                                                        fontSize: '0.8rem'
                                                                    }}
                                                                >
                                                                    {p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <span className="text-muted font-weight-normal">{currency}</span>
                                                                </div>
                                                                <div
                                                                    className="text-light ml-auto bg-custom"
                                                                    style={{
                                                                        width: '60px',
                                                                        height: '40px',
                                                                        lineHeight: '40px',
                                                                        fontSize: '1.5rem',
                                                                        borderTopLeftRadius: '1rem'
                                                                    }} 
                                                                >
                                                                    <BsPlus />
                                                                </div> 
                                                            </button>
                                                        )
                                                    )
                                                }    
                                            </div>
                                        </div>
                                    </IonCol>
                                )
                            })
                        }
                    </IonRow>
                </IonGrid>
            </>
        )

        return (
            <IonPage>
                <IonHeader className="ion-no-border">
                    <IonToolbar className="original-bg">
                        <IonButtons slot="start">
                            <IonMenuButton autoHide={false} >
                                <MenuHamburger />
                            </IonMenuButton>
                        </IonButtons>

                        <IonTitle size="small" style={cssName.titlePD} className="text-center">
                            <IonLabel style={cssName.name} className="text-default">
                                <Translation>
                                    {(t) => <>{t('main.recently.views')}</>}
                                </Translation>
                            </IonLabel>
                        </IonTitle>

                        <IonButtons slot="end">
                            {
                                views.length <= 0 ? (
                                    <IonButton
                                        style={{
                                            width: '48px',
                                            height: '48px'
                                        }}
                                    />
                                ) : (
                                    <IonButton
                                        onClick={() => this.props.removeView()}
                                        style={cssName.ht}
                                    >
                                        <MdDeleteSweep size="1.6rem" className="text-danger" />     
                                    </IonButton>
                                )
                            }
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent fullscreen={true} className="original-bg">
                    {lists}

                    <Translation>
                        {(t) => 
                            <IonToast
                                isOpen={this.state.showPopCart}
                                onDidDismiss={() => this.setState({
                                    showPopCart: !this.state.showPopCart
                                })}
                                position="middle"
                                keyboardClose={true}
                                duration={1500}
                                cssClass="cart-success-toast shadow-lg"
                                message={new IonicSafeString(
                                    `
                                        <div style='display:flex;flex-direction:column;padding:15px'>
                                            <img 
                                                src='/images/check-success.gif' 
                                                alt='' 
                                                width='100' 
                                                style="margin:0 auto;display:block;"
                                            />
                                            <p 
                                                style="text-align:center;color:#fe9902;font-size:0.95rem;line-height:2;margin:15px 0 10px;"
                                            >` 
                                                +
                                                    t('main.added.cart.success') 
                                                + 
                                            `</p>
                                        </div>
                                    `
                                )}
                            />
                        }
                    </Translation>

                    <Translation>
                        {(t) => 
                            <IonToast
                                isOpen={this.state.closePopCart}
                                onDidDismiss={() => this.setState({
                                    closePopCart: !this.state.closePopCart
                                })}
                                position="middle"
                                keyboardClose={true}
                                duration={1500}
                                cssClass="cart-remove-toast shadow-lg"
                                message={new IonicSafeString(
                                    `
                                        <div style='display:flex;flex-direction:column;padding:15px'>
                                            <img 
                                                src='/images/check-remove.gif' 
                                                alt='' 
                                                width='100' 
                                                style="margin:0 auto;display:block;"
                                            />
                                            <p 
                                                style="text-align:center;color:#6c757d;font-size:0.95rem;line-height:2;margin:15px 0 10px;"
                                            >` 
                                                +
                                                    t('main.remove.cart.success') 
                                                + 
                                            `</p>
                                        </div>
                                    `
                                )}
                            />
                        }
                    </Translation>

                </IonContent>

                <IonFooter className="ion-no-border shadow">
                    <IonToolbar className="original-tab-bg">
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
                    </IonToolbar>
                </IonFooter>

            </IonPage>
        )
    }
}

const mapStateToProps = state => ({
    views: state.view,
    cartProducts: state.cart.products,
    whishlists: state.whishlist.products,
    newWish: state.whishlist.productToAddWhish,
    deleteWish: state.whishlist.productToRemoveWhish
})

export default connect(
    mapStateToProps,
    {
        removeView,
        addProduct,
        removeProduct,
        removeWish,
        addWish
    }
)(withRouter(View))