import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import Modal from 'react-modal'
import { db } from '../../helpers/firebase'
import { PRODUCTS } from '../../helpers/api'
import { Translation } from 'react-i18next'
import { FiSearch } from 'react-icons/fi'


Modal.setAppElement('#root')

class SearchModal extends Component 
{
    state = {
        productName: '',
        products: []
    }

    handleSearchInput = e => {
        this.setState({
            productName: e.target.value
        })
    }

    handleSearchSubmit = () => {
        if(this.state.productName) {
            let text = this.state.productName
            this.setState({
                productName: ''
            })
            this.props.history.push({
                pathname: `/search/product=${text}`,
                state: {
                    productName: text
                }
            })

            this.closeSearch()
        }
    }

    handleSearchKeyUp = e => {
        e.preventDefault()

        if(e.key === "Enter" && e.keyCode === 13) {
            this.handleSearchSubmit()
        }

        document.getElementById('latest-products').style.visibility = 'visible'
        document.getElementById('latest-products').style.height = 'auto'
    }

    handleFormSubmit = e => e.preventDefault()

    closeSearch = () => {
        document.getElementById('searchID').style.top = '0'
        document.getElementById('searchID').style.bottom = '0'
        document.getElementById('searchID').style.left = '0'
        document.getElementById('searchID').style.right = '0'
        document.getElementById('searchID').style.zIndex = '-1'
        document.getElementById('searchID').style.opacity = '0'
        document.getElementById('searchID').style.transition = '0.3s ease-in-out'
    }

    getProducts = () => {
        db 
        .ref(PRODUCTS)
        .orderByChild('dateFormatted')
        .on('value' , snapshot => {
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

    showProductOnBar = () => {
        document.getElementById('latest-products').style.visibility = 'visible'
        document.getElementById('latest-products').style.height = 'auto'
    }

    closeProductsOnBar = () => {
        document.getElementById('latest-products').style.visibility = 'hidden'
        document.getElementById('latest-products').style.height = '0px'
    }

    componentDidMount() {
        this.getProducts()
    }

    render() {

        const { products } = this.state

        const latestProducts = products.length ? (
            <div
                onClick={() => {
                    this.closeProductsOnBar()
                    this.closeSearch()
                }}
                className="mt-1"
                id="latest-products"
                style={{
                    background: '#000',
                    visibility: 'hidden',
                    height: '0px'
                }}
            >
                <h4
                    className="font-weight-bold px-3 py-3 mb-0 text-light"
                    style={{
                        lineHeight: '1.5',
                        fontSize: '1rem',
                        letterSpacing: '-0.5px'
                    }}
                >
                    <Translation>
                        {(t) => <>{t('main.newproducts')}</>}
                    </Translation>
                </h4>
                {
                    products.slice(0,5).map(p => (
                        <Link
                            key={p.slug}
                            to={`/product/${p.slug}`}
                            className="d-block text-decoration-none btn-cart-hover text-light text-truncate font-weight-normal px-3 py-2"
                            style={{
                                fontSize: '0.9rem',
                                lineHeight: '1.5'
                            }}
                        >
                            <Translation>
                                {
                                    (t) =>
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
                        </Link>
                    ))
                }
            </div>
        ) : null

        return (
            <div
                className="searchID position-fixed"
                id="searchID"
                style={{
                    left: '0',
                    right: '0',
                    top: '0',
                    bottom: '0',
                    backgroundColor: '#f8f9fa',
                    backgroundImage: 'linear-gradient(to bottom, #f8f9fa, #f8f9fa 200%)',
                    zIndex: '-1',
                    opacity: '0',
                    transition: '0.3s ease-in-out'
                }}
            >                
                <div className="container position-relative">
                    <div
                        className="text-right mt-4 mb-5 pr-3"
                        style={{
                        }}
                    >
                        <button
                            onClick={() => {
                                this.closeSearch()
                                this.closeProductsOnBar()
                                this.setState({
                                    productName: ''
                                })
                            }}
                            className="btn rounded-0 border-0 shadow-none p-0 position-relative"
                            style={{
                                width: '24px',
                                height: '24px'
                            }}
                        >
                            <span
                                className="bg-dark rounded position-absolute"
                                style={{
                                    width: '24px',
                                    height: '2px',
                                    left: '0',
                                    right: '0',
                                    transform: 'rotate(45deg)',
                                    transition: 'left 0.3s ease-in-out'
                                }}
                            />
                            <span
                                className="bg-dark rounded position-absolute"
                                style={{
                                    width: '24px',
                                    height: '2px',
                                    left: '0',
                                    right: '0',
                                    transform: 'rotate(-45deg)',
                                    transition: 'left 0.3s ease-in-out'
                                }}
                            />
                        </button>
                    </div>
                    
                    <div 
                        className="col-12 col-sm-8 mx-auto my-5"
                    >                                                                
                        <form 
                            onSubmit={this.handleFormSubmit}
                            className="w-100 d-flex justify-content-between bg-white"
                            id="search-form-modal"
                            style={{
                                border: '2px solid #000'
                            }}
                        >
                            <Translation>
                                {
                                    (t) =>
                                    <input
                                        className="form-control border-0 font-weight-normal change-input-placeholder bg-transparent text-dark shadow-none px-3 py-1 rounded-0"
                                        style={{
                                            height: '50px',
                                            lineHeight: '2'
                                        }}
                                        type="text"
                                        placeholder={t('main.search.placeholder')}
                                        value={this.state.productName}
                                        onChange={this.handleSearchInput}
                                        onKeyUp={this.handleSearchKeyUp}
                                        onFocus={this.showProductOnBar}
                                    />
                                }
                            </Translation>
                            <button
                                className="btn shadow-none text-light text-center rounded-0 border-0"
                                style={{
                                    fontSize: '1.7rem',
                                    width: '80px',
                                    height: '50px',
                                    lineHeight: '0',
                                    background: '#000'
                                }}
                                onClick={this.handleSearchSubmit}
                            >
                                <FiSearch />
                            </button>                               
                        </form>

                        {latestProducts}
                    </div>
                </div>                
            </div>
        )
    }
}

export default withRouter(SearchModal)