import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Translation } from 'react-i18next'
import { db } from '../helpers/firebase'
import { PRODUCTS } from '../helpers/api'
import Skeleton from 'react-loading-skeleton'
import { currency } from '../helpers/utils'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { FaTruck } from 'react-icons/fa'
import { updateTotalCart } from '../store/total/actions'
import {
    loadCart,
    addProduct,
    removeProduct,
    changeProductQuantity
} from '../store/cart/actions'
import { TiStarburst } from 'react-icons/ti'
import { addView } from '../store/view/actions'
import { BsPlus, BsBoxArrowUp, BsBoxArrowDown } from "react-icons/bs"
import { IonContent, IonPage, IonBackButton, IonButtons, IonTitle, IonRippleEffect, IonFooter, IonToast, IonicSafeString, IonToolbar } from '@ionic/react'
import Header from '../components/layout/Header'
import SearchForm from '../components/layout/SearchForm'
import { BiMinus } from 'react-icons/bi'
import { addWish , removeWish } from '../store/whishlist/actions'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'


const FETCHIMG = process.env.REACT_APP_FETCH_IMAGES
const FETCHMOREIMG = process.env.REACT_APP_FETCH_MOREIMAGES

class Product extends Component {
    static propTypes = {
        addView: PropTypes.func.isRequired,
        addProduct: PropTypes.func.isRequired,
        cartProducts: PropTypes.array.isRequired,
        newProduct: PropTypes.object,
        productToRemove: PropTypes.object,
        newWish: PropTypes.object,
        deleteWish: PropTypes.object,
        whishlists: PropTypes.array.isRequired
    }

    state = {
        p: null,
        selected_size: '',
        selected_color: '',
        products: [],
        showBtn: false,
        showPopCart: false,
        closePopCart: false
    }

    getP = () => {
        const slug = this.props.match.params.slug

        db
            .ref(PRODUCTS + `/${slug}`)
            .on('value', snapshot => {
                const data = snapshot.val()
                this.setState({
                    p: {
                        ...data,
                        quantity: 1
                    },
                    selected_color: data ? ( data.color && data.color[0]) : '',
                    selected_size: data ? ( data.size && data.size[0]) : ''
                })
            })
    }

    getProducts = () => {
        db
            .ref(PRODUCTS)
            .orderByChild('dateFormatted')
            .on('value', snapshot => {
                let lists = []
                snapshot.forEach(snap => {
                    lists.push(snap.val())
                })
                const data = lists.reverse()

                this.setState({
                    products: data
                })
            })
    }

    handleOnChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentDidMount() {
        this.getP()
        this.getProducts()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.slug !== this.props.match.params.slug) {
            this.getP()
            this.getProducts()

            // this.setState({
            //     selected_size: '',
            //     selected_color: '',
            // })

            this.openBtn()
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.slug !== this.props.match.params.slug) {
            this.getP()
            this.getProducts()

            // this.setState({
            //     selected_size: '',
            //     selected_color: '',
            // })

            // this.openBtn()
        }

        if (nextProps.newProduct !== this.props.newProduct) {
            this.addProduct(nextProps.newProduct)
        }
        if (nextProps.productToRemove !== this.props.productToRemove) {
            this.removeProduct(nextProps.productToRemove)
        }

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

    addProduct = p => {
        const { cartProducts } = this.props
        const index = cartProducts.findIndex(pd => pd.id === p.id)
        if (index >= 0) {
            cartProducts.push()
        }

        this.setState({
            // selected_size: '',
            // selected_color: '',
            showPopCart: true
        })

        // this.closeBtn()
    }

    removeProduct = p => {
        const { cartProducts } = this.props
        const index = cartProducts.findIndex(pd => pd.id === p.id)
        if (index >= 0) {
            cartProducts.splice(index)
        }

        this.setState({
            closePopCart: true
        })
    }

    closeBtn = () => {
        document.getElementById('pullCart').classList.add('close-btn')
        document.getElementById('pullCart').style.bottom = '-115px'
        document.getElementById('pullCart').style.transition = '0.3s ease-in-out'

        this.setState({
            showBtn: true
        })
    }

    openBtn = () => {
        document.getElementById('pullCart').classList.remove('close-btn')
        document.getElementById('pullCart').style.bottom = '50px'
        document.getElementById('pullCart').style.transition = '0.3s ease-in-out'

        this.setState({
            showBtn: false
        })
    }



    render() {

        const { p, products, selected_color, selected_size } = this.state

        const cssName = {
            overflow: {
                overflowX: 'scroll'
            },
            pdLayout: {
                paddingLeft: '5px',
                paddingRight: '5px'
            },
            titlePD: {
                padding: '0 5px 0 10px'
            },
            layout: {
                paddingLeft: '10px',
                paddingRight: '10px'
            },
            headTitleName: {
                fontSize: '1.2rem',
                lineHeight: '1.6'
            },
            headName: {
                fontSize: '1rem',
                lineHeight: '1.5em',
                color: '#000'
            },
            borderadius: {
                borderRadius: '1rem'
            },
            layoutCard: {
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
            secName: {
                fontSize: '0.7rem',
                lineHeight: '1.5'
            },
            name: {
                fontSize: '1rem',
                lineHeight: '1.5'
            },
            titleName: {
                fontSize: '1rem',
                lineHeight: '1.5'
            },
            btnInner: {
                height: '60px'
            },
            relateName: {
                fontSize: '1rem',
                lineHeight: '1.7'
            },
            bdTop: {
                borderTopLeftRadius: '1.6rem',
                borderTopRightRadius: '1.6rem'
            },
            toggleBtn: {
                left: '50%',
                top: '-25px',
                width: '50px',
                height: '50px',
                marginLeft: '-25px'
            },
            toggleBtnDiv: {
                width: '50px',
                height: '50px',
                lineHeight: '50px'
            },
            cartBtnName: {
                fontSize: '0.8rem',
                lineHeight: '1.5'
            },
            wish: {
                borderRadius: 0,
                borderBottomLeftRadius: '1rem',
                width: '60px'
            }
        }

        const inCart = this.props.cartProducts.length ? this.props.cartProducts.find(f =>
            f.id === (p ? p.id : null)
        ) : null
        
        const inWhishField = this.props.whishlists ? this.props.whishlists.find(f => f.id === (p ? p.id : null)) : null

        const mediumZoomImg = p ? (
            p.more_images ? (
                <div
                    style={{
                        overflowX: 'scroll'
                    }}
                >
                    <div className="d-flex">
                        <Zoom wrapStyle={{display:'flex'}} key={p.id}>
                            <picture>
                                <source
                                    media="(max-width: 800px)"
                                    srcSet={FETCHIMG + `/${p.image}`}
                                />
                                <img
                                    alt=""
                                    src={FETCHIMG + `/${p.image}`}
                                    width="350px"
                                    style={{
                                        maxWidth: 'none'
                                    }}
                                />
                            </picture>
                        </Zoom>
                        {
                            p.more_images.map((m,index) => (
                                <Zoom wrapStyle={{display:'flex'}} key={index}>
                                    <picture>
                                        <source
                                            media="(max-width: 800px)"
                                            srcSet={FETCHMOREIMG + `/${m}`}
                                        />
                                        <img
                                            alt=""
                                            src={FETCHMOREIMG + `/${m}`}
                                            width="350px"
                                            style={{
                                                maxWidth: 'none'
                                            }}
                                        />
                                    </picture>
                                </Zoom>
                            ))
                        }
                    </div>
                </div>
            ) : (
                <Zoom wrapStyle={{display:'flex'}} key={p.slug}>
                    <picture>
                        <source
                            media="(max-width: 800px)"
                            srcSet={FETCHIMG + `/${p.image}`}
                        />
                        <img
                            alt=""
                            src={FETCHIMG + `/${p.image}`}
                            width="100%"
                        />
                    </picture>
                </Zoom>
            )
        ) : (
            <Skeleton height={350} />
        )
        
        const whishHeart = p ? (
            <div 
                className="position-absolute"
                style={{
                    left: 0,
                    top: '60px',
                    zIndex: 1
                }}
                key={p.id}
            >
                {
                    inWhishField ? (
                        <button
                            className="btn p-0 shadow-none border-0"
                            onClick={() => this.props.removeWish(p)}
                            style={cssName.wish}
                        >
                            <AiFillHeart size="2rem" className="text-custom" />
                        </button>
                    ) : (
                        <button
                            className="btn p-0 shadow-none border-0"
                            onClick={() => this.props.addWish(p)}
                            style={cssName.wish}
                        >
                            <AiOutlineHeart size="2rem" className="text-custom" />
                        </button>
                    )
                }
            </div>
        ) : null

        const relatedProducts = products.length ? (
            <>
                {
                    products
                        .filter(f =>
                            (p ? p.subcategory.slug : null) === f.subcategory.slug &&
                            (p ? p.id : null) !== f.id
                        ).length ? (
                            <div className="my-5 pb-5">
                                <div
                                    className="d-flex"
                                    style={cssName.layout}
                                >
                                    <h4
                                        className="my-0 font-weight-normal text-default text-truncate"
                                        style={cssName.relateName}
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.related')}</>}
                                        </Translation>&nbsp;
                                    <Translation>
                                            {
                                                (t) =>
                                                    <>
                                                        {
                                                            t(
                                                                'main.post.title',
                                                                {
                                                                    title_en: p ? p.subcategory.title : null,
                                                                    title_mm: p ? p.subcategory.title_mm : null
                                                                }
                                                            )
                                                        }
                                                    </>
                                            }
                                        </Translation>
                                    </h4>
                                    <button
                                        className="btn bg-transparent border-0 rounded-0 shadow-none p-0 text-default ml-auto font-weight-normal text-right"
                                        style={cssName.secName}
                                        tappable="true"
                                        onClick={() => this.props.history.push(`/category/${p ? p.subcategory.slug : null}`)}
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.list.seeAll')}</>}
                                        </Translation>
                                    </button>
                                </div>
                                <div style={{ ...cssName.overflow, ...cssName.pdLayout }}>
                                    <div className="d-flex">
                                        {
                                            products
                                                .filter(f =>
                                                    (p ? p.subcategory.slug : null) === f.subcategory.slug &&
                                                    (p ? p.id : null) !== f.id
                                                ).map((p, index) => {
                                                    p.quantity = 1

                                                    const inRelatedCart = this.props.cartProducts ? this.props.cartProducts.find(f => f.id === p.id) : null

                                                    const inWhish = this.props.whishlists ? this.props.whishlists.find(f => f.id === p.id) : null

                                                    return (
                                                        <div style={cssName.border} key={index} className="mb-4 mt-3">
                                                            <div
                                                                className="bg-white overflow-hidden h-100 shadow position-relative"
                                                                style={{ ...cssName.borderadius, ...cssName.layoutCard }}
                                                            >
                                                                <div
                                                                    className="position-absolute"
                                                                    style={{
                                                                        right: 0,
                                                                        top: 0
                                                                    }}
                                                                >
                                                                    {
                                                                        inWhish ? (
                                                                            <button
                                                                                className="btn px-2 py-1 shadow-none border-0 bg-default"
                                                                                onClick={() => this.props.removeWish(p)}
                                                                                style={cssName.wish}
                                                                            >
                                                                                <AiFillHeart size="2rem" className="text-white" />
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                className="btn px-2 py-1 shadow-none border-0 bg-custom"
                                                                                onClick={() => this.props.addWish(p)}
                                                                                style={cssName.wish}
                                                                            >
                                                                                <AiOutlineHeart size="2rem" className="text-light" />
                                                                            </button>
                                                                        )
                                                                    }
                                                                </div>

                                                                <button
                                                                    onClick={e => {
                                                                        e.preventDefault()
                                                                        this.props.history.push(`/product/${p.slug}`)
                                                                        this.props.addView(p)
                                                                    }}
                                                                    tappable="true"
                                                                    className="btn text-transparent d-block p-0 border-0 rounded-0 shadow-none"
                                                                >
                                                                    <img
                                                                        src={FETCHIMG + `/${p.image}`}
                                                                        alt={p.title}
                                                                        className="w-100"
                                                                    />
                                                                    <IonRippleEffect />
                                                                </button>
                                                                <button
                                                                    onClick={e => {
                                                                        e.preventDefault()
                                                                        this.props.history.push(`/product/${p.slug}`)
                                                                        this.props.addView(p)
                                                                    }}
                                                                    tappable="true"
                                                                    className="btn text-left text-transparent link-default-hover link-scale-hover d-block w-100 p-0 border-0 rounded-0 shadow-none"
                                                                >
                                                                    <div
                                                                        className="px-3 pt-3 pb-4 font-weight-normal"
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
                                                                            className="m-0 text-dark"
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
                                                                        inRelatedCart ? (
                                                                            <button
                                                                                className="btn p-0 border-0 text-center d-flex rounded-0 shadow-none font-weight-light w-100 overflow-hidden"
                                                                                onClick={() => this.props.removeProduct(p)}
                                                                            >
                                                                                <div
                                                                                    className="flex-grow-1 font-weight-bold text-dark text-left pl-3 py-2"
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
                                                                                    className="flex-grow-1 font-weight-bold text-dark text-left pl-3 py-2"
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
                                                                        inRelatedCart ? (
                                                                            <button
                                                                                className="btn p-0 border-0 text-center d-flex rounded-0 shadow-none font-weight-light w-100 overflow-hidden"
                                                                                onClick={() => this.props.removeProduct(p)}
                                                                            >
                                                                                <div
                                                                                    className="flex-grow-1 font-weight-bold text-dark text-left pl-3 py-2"
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
                                                                                    // style={cssName.bgGradient} 
                                                                                    onClick={() => this.props.addProduct(p)}
                                                                                >
                                                                                    <div
                                                                                        className="flex-grow-1 font-weight-bold text-dark text-left pl-3 py-2"
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
                                                    )
                                                })
                                        }
                                    </div>
                                </div>
                            </div>
                        ) : null
                }
            </>
        ) : (
                <div className="my-5 pb-3">
                    <div
                        className="d-flex"
                        style={cssName.layout}
                    >
                        <div
                            className=""
                        >
                            <Skeleton width={150} height={25} />
                        </div>
                        <div
                            className="ml-auto"
                        >
                            <Skeleton width={108} height={25} />
                        </div>
                    </div>
                    <div style={{ ...cssName.overflow, ...cssName.pdLayout }}>
                        <div className="d-flex">
                            {
                                Array(10).fill().map((item, i) => (
                                    <div style={cssName.border} key={i} className="mb-4 mt-3">
                                        <div
                                            className="bg-white overflow-hidden h-100 shadow"
                                            style={{ ...cssName.borderadius, ...cssName.layoutCard }}
                                        >
                                            <Skeleton height={311} />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )

        const addCart = p ? (
            p.color &&
            p.size && (
                <div
                    id="pullCart"
                    className="position-fixed"
                    style={{
                        bottom: '50px',
                        left: 0,
                        right: 0,
                    }}
                >
                    <div className="w-100 bg-white pb-3 pt-4 shadow-lg position-relative" key={p.id} style={{ ...cssName.layout, ...cssName.bdTop }}>

                        <div
                            className="position-absolute bg-white text-center rounded-circle"
                            style={cssName.toggleBtn}
                            onClick={this.state.showBtn === false ? this.closeBtn : this.openBtn}
                        >
                            <div className="aid-btn" style={cssName.toggleBtnDiv}>
                                <BsBoxArrowDown
                                    size="1.5rem"
                                    style={{
                                        width: '50px',
                                        height: '30px'
                                    }}
                                    className="text-default"
                                />
                            </div>
                            <div className="aiu-btn" style={cssName.toggleBtnDiv}>
                                <BsBoxArrowUp
                                    size="1.5rem"
                                    style={{
                                        width: '50px',
                                        height: '30px'
                                    }}
                                    className="text-default"
                                />
                            </div>
                        </div>

                        <div className="pt-1">
                            <div className="mb-3">
                                <div className="d-flex align-items-center">
                                    <h4
                                        className="m-0 text-muted font-weight-normal"
                                        style={{
                                            fontSize: '1rem',
                                            lineHeight: '1.6'
                                        }}
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.color')}</>}
                                        </Translation> :
                                        </h4>
                                    {
                                        this.state.selected_color === '' ? (
                                            <p
                                                className="ml-3 mb-0 text-custom font-weight-normal"
                                                style={{
                                                    fontSize: '0.8rem',
                                                    lineHeight: '1.5'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.choose')}</>}
                                                </Translation>
                                            </p>
                                        ) : (
                                                <p
                                                    className="font-weight-normal mb-0 ml-3"
                                                    style={{
                                                        fontSize: '0.8rem',
                                                        color: '#fe9902',
                                                        lineHeight: '1.5'
                                                    }}
                                                >{this.state.selected_color}</p>
                                            )
                                    }
                                </div>

                                <div className="custom-checkbox font-weight-normal">
                                    {
                                        p.color.map((n, index) => (
                                            <span
                                                key={index}
                                                style={{
                                                    width: '55px',
                                                    height: '24px'
                                                }}
                                                className="d-inline-block list-unstyled p-0"
                                            >
                                                <input
                                                    name="selected_color"
                                                    id={n}
                                                    type="radio"
                                                    value={n}
                                                    onChange={this.handleOnChange.bind(this)}
                                                    checked={this.state.selected_color === n}
                                                />
                                                <label
                                                    htmlFor={n}
                                                    className=""
                                                    style={{
                                                        fontSize: '0.6rem',
                                                        borderRadius: '2px'
                                                    }}
                                                >
                                                    {n}
                                                </label>
                                            </span>
                                        ))
                                    }
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="d-flex align-items-center">
                                    <h4
                                        className="m-0 text-muted font-weight-normal"
                                        style={{
                                            fontSize: '1rem',
                                            lineHeight: '1.6'
                                        }}
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.size')}</>}
                                        </Translation> :
                                        </h4>
                                    {
                                        this.state.selected_size === '' ? (
                                            <p
                                                className="text-custom font-weight-normal mb-0 ml-3"
                                                style={{
                                                    fontSize: '0.8rem',
                                                    lineHeight: '1.5'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.choose')}</>}
                                                </Translation>
                                            </p>
                                        ) : (
                                                <p
                                                    className="font-weight-normal mb-0 ml-3"
                                                    style={{
                                                        fontSize: '0.8rem',
                                                        color: '#fe9902',
                                                        lineHeight: '1.5'
                                                    }}
                                                >{this.state.selected_size}</p>
                                            )
                                    }
                                </div>

                                <div className="custom-checkbox font-weight-normal">
                                    {
                                        p.size.map((n, index) => (
                                            <span
                                                key={index}
                                                style={{
                                                    width: '34px',
                                                    height: '34px'
                                                }}
                                                className="d-inline-block list-unstyled p-0"
                                            >
                                                <input
                                                    name="selected_size"
                                                    id={n}
                                                    type="radio"
                                                    value={n}
                                                    onChange={this.handleOnChange.bind(this)}
                                                    checked={this.state.selected_size === n}
                                                />
                                                <label
                                                    htmlFor={n}
                                                >
                                                    {n}
                                                </label>
                                            </span>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        ) : null


        const cartPayNow = p ? (
            p.color || p.size ? (
                <>
                    {
                        !selected_color || !selected_size ? (
                            inCart ? (
                                <div className="d-flex">
                                    <button
                                        className="position-relative flex-grow-1 bg-custom d-block btn border-0 shadow-none px-3 py-0 text-light font-weight-normal"
                                        style={{
                                            ...cssName.cartBtnName,
                                            ...cssName.btnInner,
                                            borderRadius: 0,
                                            borderTopLeftRadius: '1.3rem',
                                            borderBottomRightRadius: '1.3rem'
                                        }}
                                        onClick={() => {
                                            this.props.removeProduct(p)
                                            this.openBtn()
                                        }}
                                    >
                                        <div 
                                            className="bg-default position-absolute"
                                            style={{
                                                right: '-1px',
                                                bottom: 0,
                                                zIndex: '-1',
                                                width: '20px',
                                                height: '20px'
                                            }}
                                        />
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
                                            {(t) => <>{t('main.list.removeToCart')}</>}
                                        </Translation>
                                    </button>
                                    <button
                                        className="position-relative d-block btn bg-default border-0 shadow-none px-3 py-0 text-white font-weight-normal"
                                        style={{
                                            ...cssName.cartBtnName,
                                            ...cssName.btnInner,
                                            borderRadius: 0,
                                            borderTopLeftRadius: '1.3rem'
                                        }}
                                        onClick={() => {
                                            this.props.addProduct({ ...p, selected_color, selected_size })
                                            this.props.history.push('/checkout')
                                        }} //// ADD State to Redux Props (new)
                                        tappable="true"
                                    >
                                        <div 
                                            className="bg-custom position-absolute"
                                            style={{
                                                left: '-1px',
                                                top: 0,
                                                zIndex: '-1',
                                                width: '20px',
                                                height: '20px'
                                            }}
                                        />
                                        <Translation>
                                            {(t) => <>{t('main.shop.now')}</>}
                                        </Translation>
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className="d-flex bg-secondary"
                                    style={{
                                        borderTopLeftRadius: '1.3rem'
                                    }}
                                >
                                    <button
                                        className="flex-grow-1 d-block btn border-0 shadow-none px-3 py-0 text-white font-weight-normal"
                                        style={{
                                            ...cssName.cartBtnName,
                                            ...cssName.btnInner  
                                        }}
                                        disabled
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.list.addToCart')}</>}
                                        </Translation>
                                    </button>
                                    <button
                                        className="d-block btn border-0 shadow-none px-3 py-0 text-white font-weight-normal"
                                        style={{
                                            ...cssName.cartBtnName,
                                            ...cssName.btnInner
                                        }}
                                        disabled
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.shop.now')}</>}
                                        </Translation>
                                    </button>
                                </div>
                            )
                        ) : (
                            inCart ? (
                                <div className="d-flex">
                                    <button
                                        className="position-relative flex-grow-1 bg-custom d-block btn border-0 shadow-none px-3 py-0 text-light font-weight-normal"
                                        style={{
                                            ...cssName.cartBtnName,
                                            ...cssName.btnInner,
                                            borderRadius: 0,
                                            borderTopLeftRadius: '1.3rem',
                                            borderBottomRightRadius: '1.3rem'
                                        }}
                                        onClick={() => {
                                            this.props.removeProduct(p)
                                            this.openBtn()
                                        }}
                                    >
                                        <div 
                                            className="bg-default position-absolute"
                                            style={{
                                                right: '-1px',
                                                bottom: 0,
                                                zIndex: '-1',
                                                width: '20px',
                                                height: '20px'
                                            }}
                                        />
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
                                            {(t) => <>{t('main.list.removeToCart')}</>}
                                        </Translation>
                                    </button>
                                    <button
                                        className="position-relative d-block btn bg-default border-0 shadow-none px-3 py-0 text-white font-weight-normal"
                                        style={{
                                            ...cssName.cartBtnName,
                                            ...cssName.btnInner,
                                            borderRadius: 0,
                                            borderTopLeftRadius: '1.3rem'
                                        }}
                                        onClick={() => {
                                            // this.props.addProduct({ ...p, selected_color, selected_size })
                                            this.props.history.push('/checkout')
                                        }} //// ADD State to Redux Props (new)
                                        tappable="true"
                                    >
                                        <div 
                                            className="bg-custom position-absolute"
                                            style={{
                                                left: '-1px',
                                                top: 0,
                                                zIndex: '-1',
                                                width: '20px',
                                                height: '20px'
                                            }}
                                        />
                                        <Translation>
                                            {(t) => <>{t('main.shop.now')}</>}
                                        </Translation>
                                    </button>
                                </div>
                            ) : (
                                <div className="d-flex">
                                    <button
                                        className="position-relative flex-grow-1 bg-custom d-block btn border-0 shadow-none px-3 py-0 text-light font-weight-normal"
                                        style={{
                                            ...cssName.cartBtnName,
                                            ...cssName.btnInner,
                                            borderRadius: 0,
                                            borderTopLeftRadius: '1.3rem',
                                            borderBottomRightRadius: '1.3rem'
                                        }}
                                        onClick={() => {
                                            this.props.addProduct({ ...p, selected_color, selected_size })
                                            this.closeBtn()
                                        }} //// ADD State to Redux Props (new)
                                    >
                                        <div 
                                            className="bg-default position-absolute"
                                            style={{
                                                right: '-1px',
                                                bottom: 0,
                                                zIndex: '-1',
                                                width: '20px',
                                                height: '20px'
                                            }}
                                        />
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
                                            {(t) => <>{t('main.list.addToCart')}</>}
                                        </Translation>
                                    </button>
                                    <button
                                        className="position-relative d-block btn bg-default border-0 shadow-none px-3 py-0 text-white font-weight-normal"
                                        style={{
                                            ...cssName.cartBtnName,
                                            ...cssName.btnInner,
                                            borderRadius: 0,
                                            borderTopLeftRadius: '1.3rem'
                                        }}
                                        onClick={() => {
                                            this.props.addProduct({ ...p, selected_color, selected_size })
                                            this.props.history.push('/checkout')
                                        }} //// ADD State to Redux Props (new)
                                        tappable="true"
                                    >
                                        <div 
                                            className="bg-custom position-absolute"
                                            style={{
                                                left: '-1px',
                                                top: 0,
                                                zIndex: '-1',
                                                width: '20px',
                                                height: '20px'
                                            }}
                                        />
                                        <Translation>
                                            {(t) => <>{t('main.shop.now')}</>}
                                        </Translation>
                                    </button>
                                </div>
                            )
                        )
                    }
                </>
            ) : (
                inCart ? (
                    <div className="d-flex">
                        <button
                            className="position-relative flex-grow-1 bg-custom d-block btn border-0 shadow-none px-3 py-0 text-light font-weight-normal"
                            style={{
                                ...cssName.cartBtnName,
                                ...cssName.btnInner,
                                borderRadius: 0,
                                borderTopLeftRadius: '1.3rem',
                                borderBottomRightRadius: '1.3rem'
                            }}
                            onClick={() => this.props.removeProduct(p)}
                        >
                            <div 
                                className="bg-default position-absolute"
                                style={{
                                    right: '-1px',
                                    bottom: 0,
                                    zIndex: '-1',
                                    width: '20px',
                                    height: '20px'
                                }}
                            />
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
                                {(t) => <>{t('main.list.removeToCart')}</>}
                            </Translation>
                        </button>
                        <button
                            className="position-relative d-block btn bg-default border-0 shadow-none px-3 py-0 text-white font-weight-normal"
                            style={{
                                ...cssName.cartBtnName,
                                ...cssName.btnInner,
                                borderRadius: 0,
                                borderTopLeftRadius: '1.3rem'
                            }}
                            onClick={() => {
                                this.props.history.push('/checkout')
                            }}
                            tappable="true"
                        >
                            <div 
                                className="bg-custom position-absolute"
                                style={{
                                    left: '-1px',
                                    top: 0,
                                    zIndex: '-1',
                                    width: '20px',
                                    height: '20px'
                                }}
                            />
                            <Translation>
                                {(t) => <>{t('main.shop.now')}</>}
                            </Translation>
                        </button>
                    </div>
                ) : (
                    <div className="d-flex">
                        <button
                            className="position-relative flex-grow-1 d-block btn border-0 bg-custom shadow-none px-3 py-0 text-light font-weight-normal"
                            style={{
                                ...cssName.cartBtnName,
                                ...cssName.btnInner,
                                borderRadius: 0,
                                borderTopLeftRadius: '1.3rem',
                                borderBottomRightRadius: '1.3rem'
                            }}
                            onClick={() => {
                                this.props.addProduct(p)
                            }} //// ADD State to Redux Props (new)

                        >
                            <div 
                                className="bg-default position-absolute"
                                style={{
                                    right: '-1px',
                                    bottom: 0,
                                    zIndex: '-1',
                                    width: '20px',
                                    height: '20px'
                                }}
                            />
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
                                {(t) => <>{t('main.list.addToCart')}</>}
                            </Translation>
                        </button>
                        <button
                            className="position-relative d-block btn border-0 bg-default shadow-none px-3 py-0 text-white font-weight-normal"
                            style={{
                                ...cssName.cartBtnName,
                                ...cssName.btnInner,
                                borderRadius: 0,
                                borderTopLeftRadius: '1.3rem'
                            }}
                            onClick={() => {
                                this.props.addProduct(p)
                                this.props.history.push('/checkout')
                            }} //// ADD State to Redux Props (new)
                            tappable="true"
                        >
                            <div 
                                className="bg-custom position-absolute"
                                style={{
                                    left: '-1px',
                                    top: 0,
                                    zIndex: '-1',
                                    width: '20px',
                                    height: '20px'
                                }}
                            />
                            <Translation>
                                {(t) => <>{t('main.shop.now')}</>}
                            </Translation>
                        </button>
                    </div>
                )
            )
        ) : null

        const price = p ? (
            <div style={cssName.layout}>
                <h6
                    className="my-0 font-weight-normal text-black-50"
                    style={cssName.catName}
                >
                    <Translation>
                        {(t) => <>{t('main.itemPrice')}</>}
                    </Translation>
                </h6>
                <h4
                    className="mb-0 mt-1 text-custom text-truncate"
                    style={cssName.name}
                >
                    {p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <span style={cssName.secName} className="font-weight-normal text-black-50">{currency}</span>
                </h4>
            </div>
        ) : (
                <div style={cssName.layout}>
                    <div
                        className="mb-1"
                    >
                        <Skeleton height={16} width={'25%'} />
                    </div>
                    <Skeleton height={27} />
                </div>
            )

        return (
            <IonPage>
                <Header>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home" className="text-default" />
                    </IonButtons>
                    <IonTitle size="small" style={cssName.titlePD} >
                        <SearchForm />
                    </IonTitle>
                </Header>

                <IonContent fullscreen={true} className="original-bg">
                    
                    {mediumZoomImg}
                    
                    {whishHeart}
                    
                    {
                        p ? (
                            <div style={cssName.layout} key={p.title}>
                                <div
                                    className="my-3"
                                >
                                    <h4
                                        className="my-0 font-weight-normal text-dark"
                                        style={cssName.headTitleName}
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
                                    <div
                                        className="d-flex align-self-baseline text-custom"
                                    >
                                        <button
                                            className="btn bg-transparent text-default font-weight-normal text-truncate border-0 rounded-0 shadow-none p-0"
                                            onClick={() => this.props.history.push(`/c/${p.category.slug}`)}
                                            style={cssName.secName}
                                            tappable="true"
                                        >
                                            <Translation>
                                                {
                                                    (t) =>
                                                        <>
                                                            {
                                                                t(
                                                                    'main.post.title',
                                                                    {
                                                                        title_en: p.category.title,
                                                                        title_mm: p.category.title_mm
                                                                    }
                                                                )
                                                            }
                                                        </>
                                                }
                                            </Translation>
                                        </button>&nbsp; &bull; &nbsp;
                                        <button
                                            className="btn bg-transparent text-default font-weight-normal text-truncate border-0 rounded-0 shadow-none p-0"
                                            onClick={() => this.props.history.push(`/category/${p.subcategory.slug}`)}
                                            style={cssName.secName}
                                            tappable="true"
                                        >
                                            <Translation>
                                                {
                                                    (t) =>
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
                                        </button>
                                    </div>
                                </div>

                                {
                                    p.brand && (
                                        <div className="py-3">
                                            <h6
                                                className="my-0 font-weight-normal text-black-50"
                                                style={cssName.titleName}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.brand')}</>}
                                                </Translation>
                                            </h6>
                                            <h4
                                                className="my-0"
                                                style={cssName.name}
                                            >
                                                <button
                                                    className="btn bg-transparent text-uppercase text-custom font-weight-bold border-0 rounded-0 shadow-none p-0"
                                                    onClick={() => this.props.history.push(`/brand/${p.brand_slug}`)}
                                                    tappable="true"
                                                >
                                                    {p.brand}
                                                </button>
                                            </h4>
                                        </div>
                                    )
                                }

                                {
                                    p.description &&
                                    <div className="pt-3">
                                        <p
                                            className="mb-0 text-secondary"
                                            style={cssName.name}
                                        >
                                            {p.description}
                                        </p>
                                    </div>
                                }

                                <div className="delivery-notice py-3 mt-5">
                                    <div className="d-flex justify-content-between">
                                        <span
                                            className="mr-3 align-self-center text-default"
                                            style={{
                                                color: '#fe9902',
                                                fontSize: '2rem'
                                            }}
                                        >
                                            <FaTruck />
                                        </span>
                                        <span
                                            className="mr-3 align-self-center text-dark font-weight-normal"
                                            style={cssName.cartBtnName}
                                        >
                                            <TiStarburst className="mr-1" />
                                            <Translation>
                                                {(t) => <>{t('main.deliveryNormalE')}</>}
                                            </Translation>
                                        </span>
                                        <span
                                            className="mr-0 align-self-center text-primary font-weight-normal"
                                            style={cssName.cartBtnName}
                                        >
                                            <TiStarburst className="mr-1" />
                                            <Translation>
                                                {(t) => <>{t('main.deliveryDay1E')}</>}
                                            </Translation>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={cssName.layout}>
                                <div
                                    className="my-3"
                                >
                                    <div
                                        className="mb-2"
                                    >
                                        <Skeleton height={30} />
                                    </div>
                                    <div>
                                        <Skeleton height={20} width={'75%'} />
                                    </div>
                                </div>
                                <div className="py-3">
                                    <div
                                        className="mb-1"
                                    >
                                        <Skeleton height={16} width={'25%'} />
                                    </div>
                                    <Skeleton height={25} />
                                </div>
                                <div className="py-1 my-3">
                                    <Skeleton height={35} />
                                </div>
                                <div className="mt-5">
                                    <Skeleton height={82} />
                                </div>
                            </div>
                        )
                    }

                    {relatedProducts}

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
                                                src='/images/check-success.gif' 
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

                    {addCart}
                </IonContent>

                <IonFooter
                    className="ion-no-border shadow"
                >
                    <IonToolbar className="original-tab-bg" style={cssName.btnInner}>
                        <IonButtons slot="start" style={{zIndex:'999'}}>
                            {price}
                        </IonButtons>

                        <IonButtons slot="end" className="mr-0">
                            {cartPayNow}
                        </IonButtons>
                    </IonToolbar>
                </IonFooter>
            </IonPage>
        )
    }
}

const mapStateToProps = state => ({
    cartProducts: state.cart.products,
    newProduct: state.cart.productToAdd,
    productToRemove: state.cart.productToRemove,
    whishlists: state.whishlist.products,
    newWish: state.whishlist.productToAddWhish,
    deleteWish: state.whishlist.productToRemoveWhish
})

export default connect(
    mapStateToProps,
    {
        addProduct,
        updateTotalCart,
        loadCart,
        removeProduct,
        changeProductQuantity,
        addView,
        addWish,
        removeWish
    }
)(withRouter(Product))