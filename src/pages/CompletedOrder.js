import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import { Translation } from 'react-i18next'
import FUNNY from '../assets/images/funny.gif'
import { BsPhone } from 'react-icons/bs'
import { removeOrderLink } from '../store/orderTemLink/actions'
import { RiMailOpenLine } from 'react-icons/ri'
import { auth } from '../helpers/firebase'

class CompletedOrder extends Component {

    _isMounted = false
    
    static propTypes = {
        removeOrderLink: PropTypes.func.isRequired
    }

    state = {
        user: auth.currentUser
    }

    componentDidMount() {
        this._isMounted = true

        auth.onAuthStateChanged((user) => {
            if(this._isMounted) {
                if(user) {
                    this.setState({
                        user: auth.currentUser
                    })
                } else {
                    this.setState({
                        user: null
                    })
                }
            }
        })
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {

        const p = this.props.orderLink[0]

        const orderList =
            <div className="w-100" id="capture">
                {
                    p ? (
                        <div>
                            <div
                                className="text-light text-center pb-5 my-5 font-weight-normal"
                                style={{
                                    lineHeight: '1.6',
                                    fontSize: '1.3rem'
                                }}
                            >
                                <Translation>
                                    {(t) => <>{t('main.thankyouPurchasing')}</>}
                                </Translation>
                            </div>
                            <div className="row">
                                {
                                    this.state.user === null ? (
                                        <div className="col">
                                            <h4
                                                className="font-weight-normal text-light mb-4 mt-0"
                                                style={{
                                                    lineHeight: '1.6',
                                                    fontSize: '1.1rem'
                                                }}
                                            >
                                                <Translation>
                                                    {
                                                        (t) =>
                                                            <>
                                                                {t('main.order.number.is')}
                                                                <Link
                                                                    to={`/order/${p.uuid}`}
                                                                    className="text-decoration-none text-warning link-default-hover"
                                                                >
                                                                    {p.uuid} <small className="text-light link-default-hover">
                                                                                ( {t('main.see.here')} )
                                                                            </small>
                                                                </Link>
                                                            </>
                                                    }
                                                </Translation>
                                            </h4>

                                            <div className="mb-4">
                                                <h4
                                                    className="font-weight-normal mt-0 mb-2 text-light"
                                                    style={{
                                                        lineHeight: '1.5',
                                                        fontSize: '1rem'
                                                    }}
                                                >
                                                    <Translation>
                                                        {(t) => <>{t('main.shippingAddress')}</>}
                                                    </Translation> - {p.checkout.contact.name}
                                                </h4>
                                                <p
                                                    className="font-weight-normal mb-0 text-light"
                                                    style={{
                                                        fontSize: '0.85rem',
                                                        lineHeight: '1.8'
                                                    }}
                                                >
                                                    {
                                                        p.checkout.contact.phone &&
                                                        <>
                                                            <BsPhone /> {p.checkout.contact.phone}<br />
                                                        </>
                                                    }
                                                    {
                                                        p.checkout.contact.home_no && <>{p.checkout.contact.home_no} ,<br /></>
                                                    }
                                                    {
                                                        p.checkout.contact.street_quarter && <>{p.checkout.contact.street_quarter} ,<br /></>
                                                    }
                                                    {
                                                        p.checkout.contact.township && <>{p.checkout.contact.township}<br /></>
                                                    }
                                                    {
                                                        p.checkout.contact.email &&
                                                        <>
                                                            <RiMailOpenLine /> {p.checkout.contact.email}<br />
                                                        </>
                                                    }
                                                </p>
                                            </div>
                                            <div className="text-right mb-5">
                                                <button
                                                    className="btn px-5 text-white font-weight-normal shadow-lg"
                                                    style={{
                                                        background: '#fe9902',
                                                        fontSize: '0.85rem',
                                                        height: '45px',
                                                        borderRadius: '2px'
                                                    }}
                                                    onClick={() => {
                                                        this.props.history.push('/new-products')
                                                        this.props.removeOrderLink()
                                                    }}
                                                >
                                                    <Translation>
                                                        {(t) => <>{t('main.continueShopping')}</>}
                                                    </Translation>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                            <div className="col">
                                                <h4
                                                    className="font-weight-normal text-light mb-4 mt-0"
                                                    style={{
                                                        lineHeight: '1.6',
                                                        fontSize: '1.1rem'
                                                    }}
                                                >
                                                    <Translation>
                                                        {
                                                            (t) =>
                                                                <>
                                                                    {t('main.order.number.is')}
                                                                    <Link
                                                                        to={`/user-order/${p.uuid}`}
                                                                        className="text-decoration-none text-warning link-default-hover"
                                                                    >
                                                                        {p.uuid} <small className="text-light link-default-hover">
                                                                                    ( {t('main.see.here')} )
                                                                                </small>
                                                                    </Link>
                                                                </>
                                                        }
                                                    </Translation>
                                                </h4>

                                                <div className="mb-4">
                                                    <h4
                                                        className="font-weight-normal mt-0 mb-2 text-light"
                                                        style={{
                                                            lineHeight: '1.5',
                                                            fontSize: '1rem'
                                                        }}
                                                    >
                                                        <Translation>
                                                            {(t) => <>{t('main.shippingAddress')}</>}
                                                        </Translation> - {p.checkout.contact.name}
                                                    </h4>
                                                    <p
                                                        className="font-weight-normal mb-0 text-light"
                                                        style={{
                                                            fontSize: '0.85rem',
                                                            lineHeight: '1.8'
                                                        }}
                                                    >
                                                        {
                                                            p.checkout.contact.phone &&
                                                            <>
                                                                <BsPhone /> {p.checkout.contact.phone}<br />
                                                            </>
                                                        }
                                                        {
                                                            p.checkout.contact.home_no && <>{p.checkout.contact.home_no} ,<br /></>
                                                        }
                                                        {
                                                            p.checkout.contact.street_quarter && <>{p.checkout.contact.street_quarter} ,<br /></>
                                                        }
                                                        {
                                                            p.checkout.contact.township && <>{p.checkout.contact.township}<br /></>
                                                        }
                                                        {
                                                            p.checkout.contact.email &&
                                                            <>
                                                                <RiMailOpenLine /> {p.checkout.contact.email}<br />
                                                            </>
                                                        }
                                                    </p>
                                                </div>
                                                <div className="text-right mb-5">
                                                    <button
                                                        className="btn px-5 text-white font-weight-normal shadow-lg"
                                                        style={{
                                                            background: '#fe9902',
                                                            fontSize: '0.85rem',
                                                            height: '45px',
                                                            borderRadius: '2px'
                                                        }}
                                                        onClick={() => {
                                                            this.props.history.push('/new-products')
                                                            this.props.removeOrderLink()
                                                        }}
                                                    >
                                                        <Translation>
                                                            {(t) => <>{t('main.continueShopping')}</>}
                                                        </Translation>
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                }
                            </div>
                        </div>
                    ) : (
                            <div
                                className="d-table w-100"
                                style={{
                                    height: '500px'
                                }}
                            >
                                <div className="d-table-cell align-middle text-center">
                                    <p
                                        className="font-weight-normal text-light mb-3"
                                        style={{
                                            fontSize: '1.2rem',
                                            lineHeight: '1.5'
                                        }}
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.pageError')}</>}
                                        </Translation>
                                    </p>
                                    <img
                                        src={FUNNY}
                                        alt=""
                                        className="img-fluid"
                                        width="50"
                                    />
                                </div>
                            </div>
                        )
                }
            </div>

        return (
            

                <div
                    className="py-5"
                    style={{
                        background: 'radial-gradient(circle, #0f4c82 , #003457)'
                    }}
                >
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                {orderList}
                            </div>
                        </div>
                    </div>
                </div>
          
        )
    }
}

const mapStateToProps = state => ({
    orders: state.order,
    orderLink: state.orderTemLink,
    myKyat: state.myKyat
})

export default connect(mapStateToProps, { removeOrderLink })(withRouter(CompletedOrder))