import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchProducts } from '../../../store/products/actions'
import { PRODUCTS } from '../../../helpers/api'
import { db } from '../../../helpers/firebase'
import { currency } from '../../../helpers/utils'
import { addProduct , removeProduct } from '../../../store/cart/actions'
import Skeleton from 'react-loading-skeleton'
import { Translation } from 'react-i18next'
import { BsPlus } from "react-icons/bs"
import { BiMinus } from 'react-icons/bi'
import { addView } from '../../../store/view/actions'
import { IonicSafeString, IonToast } from '@ionic/react'
import { addWish , removeWish } from '../../../store/whishlist/actions'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'


const FETCHIMG = process.env.REACT_APP_FETCH_IMAGES

class Groceries extends Component 
{
    static propTypes = {
        addView: PropTypes.func.isRequired,
        fetchProducts: PropTypes.func.isRequired,
        products: PropTypes.array.isRequired,
        addProduct: PropTypes.func.isRequired,
        cartProducts: PropTypes.array.isRequired,
        newWish: PropTypes.object,
        deleteWish: PropTypes.object,
        whishlists: PropTypes.array.isRequired
    }

    state = {
        isLoading: false,
        items: [],
        showPopCart: false,
        closePopCart: false
    }

    handleFetchItems = () => {
        db 
        .ref(PRODUCTS)
        .orderByChild('category/slug')
        .equalTo('groceries')
        .on('value' , snapshot => {
            let data = []
            snapshot.forEach(snap => {
                data.push(snap.val())
            })
            const allItems = data.reverse()

            this.setState({
                items: allItems,
                isLoading: true
            })
        })
    }

    componentDidMount() {
        this.handleFetchItems()  
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
            whishlists.splice(index,1)
        }
    }

    render() {

        const { items } = this.state

        const cssName = {
            name: {
                fontSize: '0.7rem',
                whiteSpace: 'nowrap'
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
            layout: {
                width: '170px'
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
            wish: {
                borderRadius: 0,
                borderBottomLeftRadius: '1rem',
                width: '60px',
                height: '30px'
            }
        }

        const titleNameEn = items.slice(0,1).map(f => f.category.title)
        const titleNameMm = items.slice(0,1).map(f => f.category.title_mm)

        const lists = items.length ? (
            <>
                <div
                    className="d-flex mt-2 align-items-center"
                    style={{
                        padding: '0 10px'
                    }}
                >
                    <h4
                        className="my-0 pr-4 text-dark"
                        style={cssName.headName}
                    >
                        <Translation>
                            {
                                (t) => 
                                    t(
                                        'main.post.title',
                                        {
                                            title_en: titleNameEn,
                                            title_mm: titleNameMm
                                        }
                                    )
                            }
                        </Translation>
                    </h4>
                    <div
                        className="text-default ml-auto font-weight-normal text-right"
                        style={cssName.name}
                        onClick={() => this.props.history.push('/c/groceries')}
                    >
                        <Translation>
                            {(t) => <>{t('main.list.seeAll')}</>}
                        </Translation>
                    </div>
                </div>

                <div style={{...cssName.pdLayout}}>
                    <div className="d-flex flex-column">
                        {
                            items.sort((a,b) => {
                                    return a.dateFormatted > b.dateFormatted ? -1 : 1
                                }
                            ).slice(0,4).map((p,index) => {
                                p.quantity = 1

                                const inCart = this.props.cartProducts ? this.props.cartProducts.find(f => f.id === p.id) : null

                                const inWhish = this.props.whishlists ? this.props.whishlists.find(f => f.id === p.id) : null

                                return(
                                    <div style={cssName.border} key={index} className="mb-4 mt-3">
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
                                                            className="btn p-0 shadow-none border-0"
                                                            onClick={() => this.props.removeWish(p)}
                                                            style={cssName.wish}
                                                        >
                                                            <AiFillHeart size="1.5rem" className="text-custom" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn p-0 shadow-none border-0 bg-custom"
                                                            onClick={() => this.props.addWish(p)}
                                                            style={cssName.wish}
                                                        >
                                                            <AiOutlineHeart size="1.5rem" className="text-light" />
                                                        </button>
                                                    )
                                                }
                                            </div>

                                            <button
                                                tappable="true"
                                                onClick={() => {
                                                    this.props.history.push(`/product/${p.slug}`)
                                                    this.props.addView(p)
                                                }}                                      
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
                                                    tappable="true"
                                                    onClick={() => {
                                                        this.props.history.push(`/product/${p.slug}`)
                                                        this.props.addView(p)
                                                    }}                                      
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
                                                                onClick={() => {
                                                                    this.props.history.push(`/product/${p.slug}`)
                                                                    this.props.addView(p)
                                                                }}     
                                                                tappable="true"                                         
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
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </>
        ) : (
            <>
                <div
                    className="d-flex mb-3 mt-2"
                    style={{
                        padding: '0 10px'
                    }}
                >
                    <div
                        className="my-0 w-25"
                        style={cssName.headName}
                    >
                        <Skeleton height={21} />
                    </div>
                    <div
                        className="w-25 ml-auto"
                        style={cssName.name}
                    >
                        <Skeleton height={21} />
                    </div>
                </div>

                <div style={{...cssName.overflow,...cssName.pdLayout}}>
                    <div className="d-flex">
                        {
                            Array(5).fill().map((item,i) => (
                                <div style={cssName.border} key={i} className="mb-4">
                                    <div 
                                        className="bg-white overflow-hidden h-100 shadow"  
                                        style={{...cssName.borderadius,...cssName.layout}}
                                    >
                                        <Skeleton height={294} />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </>
        )

        return (
            <>
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

            </>
        )
    }
}

const mapStateToProps = state => ({
    products: state.products.products,
    cartProducts: state.cart.products,
    cartTotal: state.total.data,
    whishlists: state.whishlist.products,
    newWish: state.whishlist.productToAddWhish,
    deleteWish: state.whishlist.productToRemoveWhish
})

export default connect(
    mapStateToProps , 
    {
        fetchProducts,
        addProduct,
        addView,
        removeProduct,
        addWish,
        removeWish
    }
)(withRouter(Groceries))