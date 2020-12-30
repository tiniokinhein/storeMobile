import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Translation } from 'react-i18next'
import { PRODUCTS } from '../../helpers/api'
import { db } from '../../helpers/firebase'

class LatestPreview extends Component 
{
    _isMounted = false

    state = {
        products: []
    }

    getProducts = () => {
        this._isMounted = true

        db 
        .ref(PRODUCTS)
        .orderByChild('dateFormatted')
        .on('value' , snapshot => {
            let lists = []
            snapshot.forEach(snap => {
                lists.push(snap.val())
            })
            const data = lists.reverse()

            if(this._isMounted) {
                this.setState({
                    products: data
                })
            }
        })
    }

    closeProductsOnBar = () => {
        document.getElementById('latest-product-wrapper').style.visibility = 'hidden'
        document.getElementById('latest-product-wrapper').style.top = '-1000%'
        document.getElementById('latest-product-wrapper').style.bottom = 'auto'
    }

    closeOnHoverOut = () => {
        document.getElementById('latest-product-wrapper').onmouseleave = () => {
            this.closeProductsOnBar()
        }
    }

    componentDidMount() {
        this.getProducts()
        this.closeOnHoverOut()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {

        const { products } = this.state

        const latestProducts = products.length ? (
            <div 
                className="container"
            >
                <div
                    className="bg-default shadow-sm px-4 py-3"
                    style={{
                        borderBottomLeftRadius: '3px',
                        borderBottomRightRadius: '3px'
                    }}
                >
                    <h4
                        className="font-weight-normal pb-3 mb-0 text-light"
                        style={{
                            color: '#000',
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
                                className="d-block text-decoration-none link-default-hover text-truncate font-weight-normal py-2 text-white-50"
                                style={{
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5',
                                    color: '#000'
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
            </div>
        ) : null

        return (
            <div 
                id="latest-product-wrapper"
                className="position-fixed"
                style={{
                    top: '-1000%',
                    left: '0',
                    right: '0',
                    bottom: 'auto',
                    zIndex: '2',
                    visibility: 'hidden'
                }}
                onClick={this.closeProductsOnBar}
            >
                {latestProducts}
            </div>
        )
    }
}

export default LatestPreview