import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { currency } from '../../helpers/utils'
import { CgTrash } from 'react-icons/cg'
import { withRouter } from 'react-router-dom'
import { Translation } from 'react-i18next'


const FETCHIMG = process.env.REACT_APP_FETCH_IMAGES

class CartProduct extends Component 
{
    static propTypes = {
        product: PropTypes.object.isRequired,
        removeProduct: PropTypes.func.isRequired,
        changeProductQuantity: PropTypes.func.isRequired
    }

    state = {
        product: this.props.product,
        isMouseOver: false
    }

    handleMouseOver = () => {
        this.setState({
            isMouseOver: true
        })
    }

    handleMouseOut = () => {
        this.setState({
            isMouseOver: false
        })
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

    removeItem = product => {
        const { removeProduct } = this.props
        removeProduct(product)
    }

    closeFloatCart = () => {
        document.getElementById('cartOpen').style.visibility = 'hidden'
        document.getElementById('cartOpen').style.height = '0'      
    }

    render() {
        const { product } = this.state

        const cssName = {
            mg: {
                marginLeft: '10px',
                marginRight: '10px'
            }
        }

        const classes = ['shelf-item rounded my-3 pr-2 d-flex bg-white shadow-sm overflow-hidden original-bg-light']

        if(!!this.state.isMouseOver) {
            classes.push('shelf-item--mouseover')
        }

        return (
            <div className={classes.join(' ')} style={cssName.mg}>
                <div className="flex-grow-1 pl-0 pr-2 align-self-center">
                    <button
                        onClick={() => {
                            this.props.history.push(`/product/${product.slug}`)
                            this.closeFloatCart()
                        }}
                        tappable="true"
                        className="btn border-0 rounded-0 shadow-none p-0 w-100 text-left d-flex"
                    >
                        <img
                            src={FETCHIMG+`/${product.image}`}
                            alt={product.title}
                            className="shelf-item__thumb align-top mx-3 align-self-center"
                            width="80"
                        />
                        <div className="flex-grow-1 d-flex flex-column align-self-center py-3">
                            <p
                                className="mb-0 text-default font-weight-normal"
                                style={{
                                    fontSize: '0.85rem',
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: '2',
                                    WebkitBoxOrient: 'vertical',
                                    lineHeight: '1.8'
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
                            </p>
                            {
                                product.selected_color &&
                                product.selected_size &&
                                <p
                                    className="mb-0 mt-1 text-dark font-weight-normal" 
                                    style={{
                                        fontSize: '0.65rem'
                                    }}
                                >
                                    <Translation>
                                        {(t) => <>{t('main.color')}</>}
                                    </Translation> - <strong>{product.selected_color}</strong> | &nbsp;
                                    <Translation>
                                        {(t) => <>{t('main.size')}</>}
                                    </Translation> - <strong>{product.selected_size}</strong>
                                </p>
                            }
                            <p
                                className="font-weight-normal text-default mb-0 mt-1"
                                style={{
                                    fontSize: '0.8rem'
                                }}    
                            >
                                {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <small className="text-muted">{currency}</small>
                            </p>
                        </div>
                    </button>
                </div>
                <div className="align-self-center py-3">
                    <div className="d-flex">
                        <button 
                            className="change-product-button shadow-none rounded-circle border-0 btn text-light p-0" 
                            onClick={this.handleOnIncrease}
                            style={{
                                width: '25px',
                                height: '25px'
                            }}
                        >+</button>
                        <div 
                            className="flex-grow px-2 align-self-center text-dark font-weight-bold"
                            style={{
                                fontSize: '0.7rem'
                            }}
                        >
                            {product.quantity}
                        </div>
                        <button 
                            className="change-product-button shadow-none rounded-circle border-0 btn text-light p-0" 
                            onClick={this.handleOnDecrease} 
                            disabled={product.quantity === 1 ? true : false}
                            style={{
                                width: '25px',
                                height: '25px'
                            }}
                        >-</button>
                    </div>
                    <div
                        onClick={this.removeItem.bind(this,product)}
                        className="text-right align-self-center mt-2"
                    >
                        <CgTrash size="1.4rem" className="text-dark" />
                    </div>
                </div>
            </div>
        )
    }                       
}

export default withRouter(CartProduct)