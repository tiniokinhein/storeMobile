import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { currency } from '../../helpers/utils'
import { Translation } from 'react-i18next'
import { Link } from 'react-router-dom'

class OrderItems extends Component 
{
    static propTypes = {
        product: PropTypes.object.isRequired,
        changeProductQuantity: PropTypes.func.isRequired
    }

    state = {
        product: this.props.product
    }

    handleOnIncrease = () => {
        const { changeProductQuantity } = this.props
        const { product } = this.state
        product.quantity = product.quantity + 1
        changeProductQuantity(product)
    }

    handleOnDecrease = () => {
        const { changeProductQuantity } = this.props
        const { product } = this.state
        product.quantity = product.quantity - 1
        changeProductQuantity(product)
    }

    totalPrice = productTotal => {
        const { product } = this.state
        productTotal = product.price * product.quantity
        return productTotal
    }

    render() {
        const { product } = this.state

        return (
            <div
                className="py-3 bg-white shadow-none rounded-0 border-top"
            >
                <div className="d-flex">
                    <div
                        className="align-self-center flex-grow-1 pr-2"
                    >
                        <Link
                            to={`/product/${product.slug}`}
                            className="text-decoration-none text-transparent link-default-hover"
                        >
                            <h6 
                                className="mb-0 pb-0 text-default font-weight-normal"
                                style={{
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    WebkitLineClamp: '2',
                                    WebkitBoxOrient: 'vertical'
                                }}
                            >
                                <Translation>
                                    {(t) => 
                                        <>
                                            {t(
                                            'main.post.title',
                                            { 
                                                title_en: product.title,
                                                title_mm: product.title_mm
                                            }
                                            )}
                                        </>
                                    }
                                </Translation>
                            </h6>
                        </Link>

                        {
                            product.selected_color &&
                            product.selected_size &&
                                <p 
                                    className="mb-0"
                                    style={{
                                        whiteSpace: 'nowrap',
                                        fontSize: '10px',
                                        color: '#000'
                                    }}
                                >
                                    <small className="text-muted">
                                        <Translation>
                                            {(t) => <>{t('main.color')}</>}
                                        </Translation>
                                    </small>
                                    <small className="text-dark"> - {product.selected_color}</small> ၊&nbsp;
                                    <small className="text-muted">
                                        <Translation>
                                            {(t) => <>{t('main.size')}</>}
                                        </Translation>
                                    </small>
                                    <small className="text-dark"> - {product.selected_size}</small>
                                </p>
                        }
                        
                        <div
                            className="pt-2"
                        >
                            <h5 
                                className="m-0 font-weight-bold"
                                style={{
                                    fontSize: '14px'
                                }}
                            >{product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}</h5> 
                        </div>
                    </div>
                    <div
                        className="align-self-center ml-auto text-right d-flex flex-column"
                        style={{
                            minWidth: '130px'
                        }}
                    >
                        <div className="d-flex mb-2 ml-auto">
                            <button 
                                className="change-product-button border-0 change-product-button shadow-none rounded-circle text-white font-weight-bold" 
                                onClick={this.handleOnIncrease}
                                style={{
                                    width: '30px',
                                    height: '30px'
                                }}
                            >+</button>
                            <div className="flex-grow px-2 align-self-center">
                                <small
                                    className="text-dark font-weight-bold"
                                >{product.quantity}</small>
                            </div>
                            <button 
                                className="change-product-button border-0 change-product-button shadow-none rounded-circle text-white disabled-button-1 font-weight-bold" 
                                onClick={this.handleOnDecrease} 
                                disabled={product.quantity === 1 ? true : false}
                                style={{
                                    width: '30px',
                                    height: '30px'
                                }}
                            >-</button>
                        </div>
                        <div>
                            <small>
                                <Translation>
                                    {(t) => <>{t('main.subtotal')}</>}
                                </Translation> - &nbsp;
                                <strong className="text-default">{this.totalPrice().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}</strong>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default OrderItems