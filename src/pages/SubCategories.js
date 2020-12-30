import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchProducts } from '../store/products/actions'
import { addProduct , removeProduct } from '../store/cart/actions'
import { Translation } from 'react-i18next'
import { db } from '../helpers/firebase'
import { SUBCATEGORIES , PRODUCTS , CATEGORIES } from '../helpers/api'
import { currency } from '../helpers/utils'
import Skeleton from 'react-loading-skeleton'
import { addView } from '../store/view/actions'
import { 
    IonBackButton, 
    IonButton, 
    IonButtons, 
    IonCol, 
    IonContent, 
    IonFooter, 
    IonGrid, 
    IonicSafeString, 
    IonLabel, 
    IonPage, 
    IonRow, 
    IonSearchbar, 
    IonSelect, 
    IonSelectOption, 
    IonTitle, 
    IonToast, 
    IonToolbar 
} from '@ionic/react'
import Header from '../components/layout/Header'
import { HiViewGrid } from 'react-icons/hi'
import { BiMinus, BiStore } from 'react-icons/bi'
import { MdFormatListBulleted } from 'react-icons/md'
import { BsPlus, BsViewList } from "react-icons/bs"
import { addWish , removeWish } from '../store/whishlist/actions'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'


const FETCHIMG = process.env.REACT_APP_FETCH_IMAGES

class SubCategories extends Component 
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
        posts: [],
        n: null,
        cats: [],
        isOpen: false,
        showPopCart: false,
        closePopCart: false,
        changeLayout: false,
        searchText: '',
        showPopHover: false
    }

    handleOnSearch = e => {
        this.setState({
            searchText: e.target.value
        })
    }

    getPosts = () => {
        const slug = this.props.match.params.slug

        db
        .ref(PRODUCTS)
        .orderByChild('subcategory/slug')
        .equalTo(`${slug}`)
        .on('value' , snapshot => {
            const data = []
            snapshot.forEach(snap => {
                data.push(snap.val())
            })

            this.setState({
                posts: data,
                isLoading: true
            })
        
        })
    }

    getTitle = () => {
        const slug = this.props.match.params.slug

        db
        .ref(SUBCATEGORIES+`/${slug}`)
        .on('value' , snapshot => {
            const data = snapshot.val()

            this.setState({
                n: data
            })
        
        })
    }

    getCat = () => {

        db
        .ref(CATEGORIES)
        .on('value' , snapshot => {
            const data = []
            snapshot.forEach(snap => {
                data.push(snap.val())
            })

            this.setState({
                cats: data
            })
        })
    }

    sortPrice = type => {

        const compare = {
            lower: (a, b) => {
              if (a.price < b.price) return -1
              if (a.price > b.price) return 1
              return 0
            },
            higher: (a, b) => {
              if (a.price > b.price) return -1
              if (a.price < b.price) return 1
              return 0
            },
            normal: (a, b) => {
              if (a.dateFormatted > b.dateFormatted) return a.dateFormatted > b.dateFormatted ? -1 : 1
              if (a.dateFormatted < b.dateFormatted) return a.dateFormatted < b.dateFormatted ? 1 : -1
              return 0
            }
        }
        const sortProperty = compare[type]
        const sorted = this.state.posts.sort(sortProperty)
        this.setState({
            posts: sorted
        })
    }

    componentDidMount() {
        this.getPosts()
        this.getTitle()
        this.getCat()
    }

    componentDidUpdate(prevProps) {
        if(prevProps.match.params.slug !== this.props.match.params.slug) {
            this.getPosts()
            this.getTitle()
            this.getCat()
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.match.params.slug !== this.props.match.params.slug) {
            this.getPosts()
            this.getTitle()
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

    render() {

        const { posts , n } = this.state

        const cssName = {
            name: {
                fontSize: '0.7rem',
                whiteSpace: 'nowrap'
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
            wish: {
                borderRadius: 0,
                borderBottomLeftRadius: '1rem',
                width: '60px'
            }
        }

        const titleHeadName = n ? (
            <Translation key={n.slug}>
                {
                    (t) =>
                    <>
                        {
                            t(
                                'main.post.title',
                                {
                                    title_en: n.title,
                                    title_mm: n.title_mm
                                }
                            )
                        }
                    </>
                }
            </Translation>
        ) : null

        const gridLists = posts.length ? (
            <div className="px-2">
                <div className="row mx-n1">
                    {
                        posts.filter(fl =>
                            fl.title.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                            fl.title_mm.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                            fl.brand.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                            fl.price.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                            fl.category.title.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                            fl.category.title_mm.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                            fl.subcategory.title.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                            fl.subcategory.title_mm.toLowerCase().includes(this.state.searchText.toLowerCase())
                        ).map(p => {
                            
                            p.quantity = 1

                            const inCart = this.props.cartProducts ? this.props.cartProducts.find(f => f.id === p.id) : null

                            const inWhish = this.props.whishlists ? this.props.whishlists.find(f => f.id === p.id) : null

                            return(
                                <div key={p.slug} className="col-6 col-md-4 col-lg-3 my-1 px-1">
                                    <div 
                                        className="bg-white overflow-hidden h-100 shadow position-relative" 
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
                                                        style={cssName.wish}
                                                    >
                                                        <AiFillHeart size="2rem" className="text-custom" />
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
                                            onClick={() => {
                                                this.props.history.push(`/product/${p.slug}`)
                                                this.props.addView(p)
                                            }}     
                                            tappable="true"                                 
                                            className="btn text-transparent d-block p-0 border-0 rounded-0 shadow-none"
                                        >
                                            <img 
                                                src={FETCHIMG+`/${p.image}`} 
                                                alt={p.title} 
                                                className="w-100"
                                            />  
                                        </button>
                                        <button
                                            onClick={() => {
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
                            )
                        })
                    }
                </div>
            </div>
        ) : (
            <div className="px-2">
                <div className="row mx-n1">
                    {
                        Array(10).fill().map((item,index) => (
                            <div className="col-6 col-md-4 col-lg-3 my-1 px-1" key={index}>
                                <Skeleton height={335} style={cssName.borderadius} />
                            </div>
                        ))
                    }
                </div>
            </div>
        )

        const rowLists = posts.length ? (
            <div className="px-2">
                <div className="row mx-n1">
                {
                    posts.filter(fl =>
                        fl.title.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                        fl.title_mm.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                        fl.brand.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                        fl.price.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                        fl.category.title.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                        fl.category.title_mm.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                        fl.subcategory.title.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                        fl.subcategory.title_mm.toLowerCase().includes(this.state.searchText.toLowerCase())
                    ).map(p => {
                        
                        p.quantity = 1

                        const inCart = this.props.cartProducts ? this.props.cartProducts.find(f => f.id === p.id) : null

                        const inWhish = this.props.whishlists ? this.props.whishlists.find(f => f.id === p.id) : null

                        return(
                            <div key={p.slug} className="col-12 col-sm-6 my-1 px-1">
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
                                                    style={{
                                                        ...cssName.wish,
                                                        width: '60px',
                                                        height: '30px'
                                                    }}
                                                >
                                                    <AiFillHeart size="1.5rem" className="text-custom" />
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn p-0 shadow-none border-0 bg-custom"
                                                    onClick={() => this.props.addWish(p)}
                                                    style={{
                                                        ...cssName.wish,
                                                        width: '60px',
                                                        height: '30px'
                                                    }}
                                                >
                                                    <AiOutlineHeart size="1.5rem" className="text-light" />
                                                </button>
                                            )
                                        }
                                    </div>
                                    
                                    <button
                                        onClick={() => {
                                            this.props.history.push(`/product/${p.slug}`)
                                            this.props.addView(p)
                                        }}     
                                        tappable="true"                                 
                                        className="btn text-transparent p-0 border-0 rounded-0 shadow-none h-100"
                                    >
                                        <img 
                                            src={FETCHIMG+`/${p.image}`} 
                                            alt={p.title} 
                                            style={{
                                                width: '200px',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />  
                                    </button>
                                    <div className="w-100 h-100">
                                    <button
                                        onClick={() => {
                                            this.props.history.push(`/product/${p.slug}`)
                                            this.props.addView(p)
                                        }}      
                                        tappable="true"                                
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
        ) : (
            <div className="px-2">
                <div className="row mx-n1">
                    {
                        Array(10).fill().map((item,index) => (
                            <div className="col-12 col-sm-6 my-1 px-1" key={index}>
                                <Skeleton height={141} style={cssName.borderadius} />
                            </div>
                        ))
                    }
                </div>
            </div>
        )

        return (
            <IonPage>
                <Header>
                    <IonButtons slot="start"> 
                        <IonBackButton defaultHref="/home" className="text-default" />
                    </IonButtons>

                    <IonTitle size="small" style={cssName.titlePD} className="text-center">
                        <IonLabel style={cssName.titleName} className="text-default">
                            {titleHeadName}
                        </IonLabel>
                    </IonTitle>

                </Header>

                <IonContent fullscreen={true} className="original-bg">

                    <IonSearchbar 
                        animated={true} 
                        placeholder=''
                        style={{
                            '--border-radius': '0.5rem',
                            '--box-shadow': 'unset'
                        }}
                        value={this.state.searchText}
                        onIonChange={this.handleOnSearch.bind(this)}
                    />

                    <div className="px-2 mt-4 mb-2">
                        <h4
                            className="m-0 font-weight-normal text-default"
                            style={cssName.headName}
                        >
                            <Translation>
                                {(t) => <>{t('main.product')}</>}
                            </Translation> 
                            <span className="mx-1">
                                ( <strong>
                                    {
                                        posts.filter(fl => 
                                            fl.title.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                            fl.title_mm.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                            fl.brand.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                            fl.price.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                            fl.category.title.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                            fl.category.title_mm.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                            fl.subcategory.title.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                            fl.subcategory.title_mm.toLowerCase().includes(this.state.searchText.toLowerCase())
                                        ) &&

                                        posts.filter(fl => 
                                            fl.title.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                            fl.title_mm.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                            fl.brand.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                            fl.price.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                            fl.category.title.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                            fl.category.title_mm.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                            fl.subcategory.title.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                            fl.subcategory.title_mm.toLowerCase().includes(this.state.searchText.toLowerCase())
                                        ).length
                                    }
                                </strong> )
                            </span>
                            {
                                posts.filter(fl => 
                                    fl.title.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                    fl.title_mm.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                    fl.brand.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                    fl.price.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                    fl.category.title.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                    fl.category.title_mm.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                    fl.subcategory.title.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
                                    fl.subcategory.title_mm.toLowerCase().includes(this.state.searchText.toLowerCase())
                                ).length <= 1 ? (
                                    <Translation>
                                        {(t) => <>{t('main.item')}</>}
                                    </Translation>
                                ) : (
                                    <Translation>
                                        {(t) => <>{t('main.items')}</>}
                                    </Translation>
                                )
                            }
                        </h4>
                    </div>                   

                    <div className="mb-5">
                        {!this.state.changeLayout ? gridLists : rowLists}
                    </div>

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
                    <IonToolbar className="original-tab-bg" style={{height:'50px'}}>
                        <IonButtons>
                            <IonGrid className="py-0" style={{height:'50px'}}>
                                <IonRow>
                                    <IonCol className="px-0 text-center">
                                        <IonButton 
                                            shape="round"
                                            onClick={() => this.props.history.push('/home')}
                                        >
                                            <BiStore
                                                size="1.1rem" 
                                                className="text-default"
                                            />
                                        </IonButton>
                                    </IonCol>

                                    <IonCol className="px-0 text-center">
                                        <IonButton 
                                            shape="round"
                                            onClick={() => {
                                                this.setState({
                                                    changeLayout: false
                                                })
                                            }}
                                        >
                                            <HiViewGrid 
                                                size="1.2rem" 
                                                className={this.state.changeLayout ? "text-default" : "text-custom"}
                                            />
                                        </IonButton>
                                    </IonCol>

                                    <IonCol className="px-0 text-center">
                                        <div className="d-flex h-100 justify-content-center align-items-center">                                           
                                            <MdFormatListBulleted size="1.2rem" className="text-default" />

                                            <Translation>
                                                {
                                                    (t) =>
                                                    <IonSelect
                                                        onIonChange={(e) => {
                                                            this.sortPrice(e.target.value)
                                                        }}
                                                        interface="alert"
                                                        className="filter-pop position-absolute"
                                                        okText={t('main.okText')}
                                                        cancelText={t('main.cancelText')}
                                                    >
                                                        <IonSelectOption value="normal">{t('main.newest')}</IonSelectOption>
                                                        <IonSelectOption value="higher">{t('main.highest')}</IonSelectOption>
                                                        <IonSelectOption value="lower">{t('main.lowest')}</IonSelectOption>
                                                    </IonSelect>
                                                }
                                            </Translation>

                                        </div>
                                    </IonCol>

                                    <IonCol className="px-0 text-center">
                                        <IonButton 
                                            shape="round"
                                            onClick={() => {
                                                this.setState({
                                                    changeLayout: true
                                                })
                                            }}
                                        >                                           
                                            <BsViewList 
                                                size="1.2rem" 
                                                className={this.state.changeLayout ? "text-custom" : "text-default"}
                                            />
                                        </IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonButtons>
                    </IonToolbar>
                </IonFooter>

            </IonPage>
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
)(withRouter(SubCategories))