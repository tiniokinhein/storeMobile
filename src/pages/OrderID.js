import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { ORDERURL } from '../helpers/api'
import { db } from '../helpers/firebase'
import { removeOrder } from '../store/order/actions'
import { currency } from '../helpers/utils'
import Moment from 'react-moment'
import 'moment-timezone'
import { Translation } from 'react-i18next'
import { IoMdArrowBack, IoIosCheckmarkCircle, IoIosCloseCircle } from 'react-icons/io'
import { RiDeleteBinLine , RiMailOpenLine } from 'react-icons/ri'
import Skeleton from 'react-loading-skeleton'
import LeftSideBar from '../components/order/LeftSideBar'
import { BsPhone } from 'react-icons/bs'
import { TiCancel } from 'react-icons/ti'
import { MdDone } from 'react-icons/md'
import { FaTruck } from 'react-icons/fa'

const FETCHIMG = process.env.REACT_APP_FETCH_IMAGES

class OrderID extends Component 
{
    _isMounted = false

    state = {
        p: null
    }

    getOrder = () => {
        this._isMounted = true

        const id = this.props.match.params.uuid
        
        db
            .ref(ORDERURL + `/${id}`)
            .on('value', snapshot => {
                const data = snapshot.val()

                if(this._isMounted) {
                    this.setState({
                        p: data,
                        n: data ? data.uuid : null
                    })
                }
            })
    }

    openModal = () => {
        document.getElementById('delete_setting').style.right = "0%"
        document.getElementById('delete_setting').style.opacity = "1"
    }

    closeModal = () => {
        document.getElementById('delete_setting').style.right = "-100%"
        document.getElementById('delete_setting').style.opacity = "0"
    }

    componentDidMount() {
        this.getOrder()
        window.scrollTo(0, 0)
    }

    componentDidUpdate(prevProps) {
        if(prevProps.match.params.uuid !== this.props.match.params.uuid) {
            this.getOrder()
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {

        const { p } = this.state

        const trackBy =
            <div
                style={{
                    background: 'radial-gradient(circle, #0f4c82 , #003457)'
                }}
            >
                <div className="container py-4">
                    <h4
                        className="mb-0 align-self-center font-weight-bold text-uppercase text-light"
                        style={{
                            fontSize: '1.8rem',
                            lineHeight: '2',
                            letterSpacing: '-0.5px'
                        }}
                    >Track <small style={{ fontSize: '12px', textTransform: 'none' }} className="text-white-50">by <span className="text-white">{this.state.n}</span></small></h4>
                </div>
            </div>

        const lists = p ? (
            <div className="row">
                <div className="col-lg-5 mb-5 mb-lg-0">
                    <h4
                        className="font-weight-normal mb-3 mt-0 text-default"
                        style={{
                            lineHeight: '2',
                            fontSize: '1.1rem'
                        }}
                    >
                        <Translation>
                            {(t) => <>{t('main.summaryDetails')}</>}
                        </Translation>
                    </h4>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <tbody
                                style={{
                                    fontSize: '0.9rem'
                                }}
                            >
                                <tr
                                    style={{
                                        height: '60px'
                                    }}
                                >
                                    <td
                                        className="align-middle px-3"
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.orderDate')}</>}
                                        </Translation>
                                    </td>
                                    <td
                                        className="align-middle px-3"
                                    >
                                        <small className="text-dark font-weight-bold">
                                            <Moment format="D MMMM YYYY, h:mm a">
                                                {p.checkout.contact.dateRaw}
                                            </Moment>
                                        </small>
                                    </td>
                                </tr>
                                <tr
                                    style={{
                                        height: '60px'
                                    }}
                                >
                                    <td
                                        className="align-middle px-3"
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.orderNo')}</>}
                                        </Translation>
                                    </td>
                                    <td
                                        className="align-middle px-3"
                                        style={{
                                            fontSize: '12px'
                                        }}
                                    >
                                        <small className="text-default font-weight-bold">{p.uuid}</small>
                                    </td>
                                </tr>
                                <tr
                                    style={{
                                        height: '60px'
                                    }}
                                >
                                    <td
                                        className="align-middle px-3"
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.payment')}</>}
                                        </Translation>
                                    </td>
                                    <td
                                        className="align-middle px-3"
                                    >
                                        <small className="text-dark font-weight-bold">{p.checkout.payment}</small>
                                    </td>
                                </tr>
                                <tr
                                    style={{
                                        height: '60px'
                                    }}
                                >
                                    <td
                                        className="align-middle px-3"
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.deliveryTime')}</>}
                                        </Translation>
                                    </td>
                                    <td
                                        className="align-middle px-3"
                                    >
                                        <small className="text-dark font-weight-bold">
                                            {p.products.delivery}<br />
                                            <span style={{ fontSize: '9px' }}>
                                                (
                                                    <Moment
                                                        format="D MMMM YYYY , h:mm a"
                                                    >
                                                        {p.checkout.contact.dateRaw}
                                                    </Moment>
                                                )
                                            </span>
                                        </small>
                                    </td>
                                </tr>
                                <tr
                                >
                                    <td
                                        className="align-middle px-3 py-4"
                                        colSpan="2"
                                        style={{
                                            lineHeight: '2'
                                        }}
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.addressDetails')}</>}
                                        </Translation><br />
                                        <small className="text-dark font-weight-bold d-inline-block mt-1">
                                            {
                                                p.checkout.contact.name &&
                                                <>{p.checkout.contact.name}<br /></>
                                            }
                                            {
                                                p.checkout.contact.email &&
                                                <><RiMailOpenLine /> {p.checkout.contact.email}<br /></>
                                            }
                                            {
                                                p.checkout.contact.phone &&
                                                <><BsPhone /> {p.checkout.contact.phone}<br /></>
                                            }
                                            {
                                                p.checkout.contact.home_no &&
                                                <>{p.checkout.contact.home_no}<br /></>
                                            }
                                            {
                                                p.checkout.contact.street_quarter &&
                                                <>{p.checkout.contact.street_quarter}<br /></>
                                            }
                                            {
                                                p.checkout.contact.township &&
                                                <>{p.checkout.contact.township}</>
                                            }
                                        </small>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-lg-7">
                    <h4
                        className="font-weight-normal mb-3 mt-0 text-default"
                        style={{
                            lineHeight: '2',
                            fontSize: '1.1rem'
                        }}
                    >
                        <Translation>
                            {(t) => <>{t('main.purchaseOrders')}</>}
                        </Translation>
                    </h4>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <tbody
                                style={{
                                    fontSize: '0.9rem'
                                }}
                            >
                                {
                                    p.products.orderItems.map((po, index) => (
                                        <tr
                                            key={index}
                                        >
                                            <td
                                                className="p-3"
                                                style={{
                                                    lineHeight: '2'
                                                }}
                                            >
                                                <div className="row mx-n2">
                                                    <div className="col-3 col-md-2 px-2">
                                                        <img
                                                            src={FETCHIMG + `/${po.image}`}
                                                            alt={po.title}
                                                            className="rounded-0 w-100"
                                                            style={{
                                                                maxWidth: '100%'
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-9 col-md-10 px-2">
                                                        <div className="row mx-n2">
                                                            <div className="col-md-8 mb-3 mb-md-0 px-2">
                                                                <h6
                                                                    className="m-0 text-dark font-weight-bold"
                                                                    style={{
                                                                        fontSize: '14px'
                                                                    }}
                                                                >
                                                                    <Translation>
                                                                        {(t) =>
                                                                            <>
                                                                                {t(
                                                                                    'main.post.title',
                                                                                    {
                                                                                        title_en: po.title,
                                                                                        title_mm: po.title_mm
                                                                                    }
                                                                                )}
                                                                            </>
                                                                        }
                                                                    </Translation>
                                                                </h6>
                                                                {
                                                                    po.color &&
                                                                    po.size &&
                                                                    <>
                                                                        <p
                                                                            className="mb-1 mt-2"
                                                                            style={{
                                                                                lineHeight: '1'
                                                                            }}
                                                                        >
                                                                            <small
                                                                                className="font-weight-normal"
                                                                                style={{ fontSize: '10px' }}
                                                                            >
                                                                                <Translation>
                                                                                    {(t) => <>{t('main.color')}</>}
                                                                                </Translation> - <strong className="font-weight-bold">{po.color}</strong>
                                                                            </small>
                                                                        </p>
                                                                        <p
                                                                            className="mb-0"
                                                                            style={{
                                                                                lineHeight: '1'
                                                                            }}
                                                                        >
                                                                            <small
                                                                                className="font-weight-normal"
                                                                                style={{ fontSize: '10px' }}
                                                                            >
                                                                                <Translation>
                                                                                    {(t) => <>{t('main.size')}</>}
                                                                                </Translation> - <strong className="font-weight-bold">{po.size}</strong>
                                                                            </small>
                                                                        </p>
                                                                    </>
                                                                }
                                                                <div
                                                                    className="pt-2"
                                                                >
                                                                    <h5
                                                                        className="m-0 font-weight-bold text-custom"
                                                                        style={{
                                                                            fontSize: '12px'
                                                                        }}
                                                                    >{po.price} {currency}</h5>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4 px-2 text-left text-md-right">
                                                                <div
                                                                    className="font-weight-light mb-2"
                                                                    style={{
                                                                        fontSize: '10px',
                                                                        lineHeight: '1.5'
                                                                    }}
                                                                >
                                                                    <small
                                                                        style={{
                                                                            fontSize: '10px'
                                                                        }}
                                                                    >
                                                                        <Translation>
                                                                            {(t) => <>{t('main.itemQuantity')}</>}
                                                                        </Translation> -
                                                                    </small> <strong className="font-weight-bold text-custom">( {po.quantity} )</strong>
                                                                </div>
                                                                <div
                                                                    className="font-weight-light"
                                                                    style={{
                                                                        fontSize: '12px',
                                                                        lineHeight: '1.5'
                                                                    }}
                                                                >
                                                                    <small
                                                                        style={{
                                                                            fontSize: '10px'
                                                                        }}
                                                                    >
                                                                        <Translation>
                                                                            {(t) => <>{t('main.subtotal')}</>}
                                                                        </Translation> -
                                                                    </small> <strong className="font-weight-bold text-custom">{po.item_total} {currency}</strong>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                                <tr>
                                    <td
                                        className="py-4 px-3"
                                        style={{
                                            lineHeight: '2'
                                        }}
                                    >
                                        <div
                                            className="d-flex"
                                            style={{
                                                lineHeight: '2'
                                            }}
                                        >
                                            <div className="text-dark">
                                                <p
                                                    className="font-weight-light mb-0"
                                                    style={{
                                                        fontSize: '14px',
                                                        lineHeight: '2'
                                                    }}
                                                >
                                                    <Translation>
                                                        {(t) => <>{t('main.subtotal')}</>}
                                                    </Translation>
                                                </p>

                                                {
                                                    p.products.myKyat_discount &&
                                                    <p
                                                        className="font-weight-light mb-0"
                                                        style={{
                                                            fontSize: '14px',
                                                            lineHeight: '2'
                                                        }}
                                                    >
                                                        <Translation>
                                                            {(t) => <>{t('main.discount')}</>}
                                                        </Translation> <small className="font-weight-bold">(3%)</small>
                                                    </p>
                                                }

                                                <p
                                                    className="font-weight-light mb-0"
                                                    style={{
                                                        fontSize: '14px',
                                                        lineHeight: '2'
                                                    }}
                                                >
                                                    <Translation>
                                                        {(t) => <>{t('main.deliveryFee')}</>}
                                                    </Translation> <small className="font-weight-bold">( {p.products.delivery} )</small>
                                                </p>
                                                
                                                <p
                                                    className="font-weight-bold mb-0 mt-2"
                                                    style={{
                                                        fontSize: '16px',
                                                        lineHeight: '2',
                                                        letterSpacing: '0.5px'
                                                    }}
                                                >
                                                    <Translation>
                                                        {(t) => <>{t('main.total')}</>}
                                                    </Translation>
                                                </p>
                                            </div>
                                            <div className="ml-auto text-right text-dark">
                                                <p
                                                    className="font-weight-light mb-0 text-custom"
                                                    style={{
                                                        fontSize: '14px',
                                                        lineHeight: '2'
                                                    }}
                                                >
                                                    {p.products.subtotal} {currency}
                                                </p>

                                                {
                                                    p.products.myKyat_discount &&
                                                    <p
                                                        className="font-weight-light mb-0 text-custom"
                                                        style={{
                                                            fontSize: '14px',
                                                            lineHeight: '2'
                                                        }}
                                                    >
                                                        <small>( - )</small> {p.products.discount_price} {currency}
                                                    </p>
                                                }

                                                <p
                                                    className="font-weight-light mb-0"
                                                    style={{
                                                        fontSize: '14px',
                                                        lineHeight: '2'
                                                    }}
                                                >
                                                    {
                                                        p.products.delivery_fee === '0' ? (
                                                            <>
                                                                <Translation>
                                                                    {(t) => <>{t('main.deliveryFreeShipping')}</>}
                                                                </Translation>
                                                            </>
                                                        ) : (
                                                                <><small>( + )</small> {p.products.delivery_fee} {currency}</>
                                                            )
                                                    }
                                                </p>
                                                <p
                                                    className="font-weight-bold mb-0 mt-2"
                                                    style={{
                                                        fontSize: '16px',
                                                        lineHeight: '2',
                                                        letterSpacing: '0.5px'
                                                    }}
                                                >
                                                    {p.products.total} {currency}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div> 
                </div>
                
                <div className="col">
                    <div className="pt-5 pt-lg-3">
                        <h4
                            className="font-weight-normal mb-3 mt-0 text-custom"
                            style={{
                                lineHeight: '1.5',
                                fontSize: '1rem'
                            }}
                        >
                            <Translation>
                                {(t) => <>{t('main.status')}</>}
                            </Translation>
                        </h4>
                        <p
                            className="mb-0 text-default font-weight-normal"
                            style={{
                                fontSize: '1.5rem'
                            }}
                        >
                            <span
                                style={{
                                    background: '-webkit-linear-gradient(0deg, #003457, rgb(15, 76, 130))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                {
                                    p.status === 'Pending' && <>{p.status_mm} <span className="spinner-border" style={{fontSize:'0.2rem'}} /></>
                                }
                                {
                                    p.status === 'Cancelled' && <>{p.status_mm} <span className="text-danger"><TiCancel /></span></>
                                }
                                {
                                    p.status === 'Completed' && <>{p.status_mm} <span className="text-success"><MdDone /></span></>
                                }
                                {
                                    p.status === 'Delivering' && <>{p.status_mm} <span className="text-custom">.. <FaTruck /></span></>
                                }
                            </span>
                        </p>
                    </div>
                </div>
            </div >
        ) : (
                <>
                    <div className="row">
                        <div className="col-lg-5 mb-5 mb-lg-0">
                            <Skeleton width={'100%'} height={500} />
                        </div>
                        <div className="col-lg-7">
                            <Skeleton width={'100%'} height={500} />
                        </div>
                    </div>
                </>
            )

        const deleteCss = {
            right: '-100%',
            top: '36px',
            opacity: '0',
            transition: 'all 0.3s ease-in-out',
            zIndex: '1'
        }

        const deleteModal =
            <div className="position-absolute" id="delete_setting" style={deleteCss}>
                <div className="p-1 bg-white shadow rounded-lg">
                    <button
                        className="btn border-0 rounded-0 shadow-none text-default p-0"
                        style={{
                            lineHeight: '0',
                            fontSize: '2rem',
                            width: '35px',
                            height: '35px'
                        }}
                        onClick={() => {
                            this.props.removeOrder()
                            this.props.history.push('/track')
                            this.closeModal()
                        }}
                    >
                        <IoIosCheckmarkCircle />
                    </button>
                    <button
                        className="btn border-0 rounded-0 shadow-none text-danger p-0"
                        style={{
                            lineHeight: '0',
                            fontSize: '2rem',
                            width: '35px',
                            height: '35px'
                        }}
                        onClick={this.closeModal}
                    >
                        <IoIosCloseCircle />
                    </button>
                </div>
            </div>

        return (
            <>

                {trackBy}

                <div className="bg-light-custom py-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-sm-4 col-lg-2 mb-4 mb-sm-0">
                                <LeftSideBar />
                            </div>
                            <div className="col-12 col-sm-8 col-lg-10 overflow-hidden">
                                <div
                                    className="mb-4 position-relative"
                                >
                                    <Link
                                        to="/track"
                                        className="text-decoration-none d-inline-block w-48-btn-hover text-center"
                                        style={{
                                            fontSize: '1.6rem',
                                            width: '50px',
                                            height: '35px',
                                            lineHeight: '29px',
                                            border: '2px solid #003457',
                                            borderRadius: '2px',
                                            color: '#003457'
                                        }}
                                    >
                                        <IoMdArrowBack />
                                    </Link>

                                    {
                                        this.props.orderIDs.length >= 1 ? (
                                            <>
                                                <button
                                                    onClick={this.openModal}
                                                    className="btn float-right d-inline-block text-center p-0 shadow-none w-48-btn-hover"
                                                    style={{
                                                        width: '50px',
                                                        height: '35px',
                                                        border: '2px solid #003457',
                                                        borderRadius: '2px',
                                                        color: '#003457'
                                                    }}
                                                >
                                                    <RiDeleteBinLine
                                                        style={{
                                                            fontSize: '1.1rem'
                                                        }}
                                                    />
                                                </button>

                                                {deleteModal}
                                            </>
                                        ) : null
                                    }

                                </div>
                                {lists}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    orderIDs: state.order
})

export default connect(mapStateToProps, { removeOrder })(withRouter(OrderID))