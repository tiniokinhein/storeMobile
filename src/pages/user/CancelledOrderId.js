import React, { Component } from 'react'
import Name from '../../components/user/Name'
import { Translation } from 'react-i18next'
import LeftSideBar from '../../components/user/LeftSideBar'
import { db } from '../../helpers/firebase'
import { ORDERURL } from '../../helpers/api'
import Moment from 'react-moment'
import 'moment-timezone'
import { BsPhone } from 'react-icons/bs'
import { RiMailOpenLine } from 'react-icons/ri'
import { currency } from '../../helpers/utils'
import { IoMdArrowBack } from 'react-icons/io'
import { Link, withRouter } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import { TiCancel } from 'react-icons/ti'


const FETCHIMG = process.env.REACT_APP_FETCH_IMAGES

class CancelledOrderId extends Component {
    _isMounted = false

    state = {
        p: null
    }

    getP = () => {
        this._isMounted = true

        const id = this.props.match.params.uuid

        db
            .ref(ORDERURL + `/${id}`)
            .on('value', snapshot => {
                const data = snapshot.val()

                if (this._isMounted) {
                    this.setState({
                        p: data
                    })
                }
            })
    }

    componentDidMount() {
        this.getP()
        window.scrollTo(0, 0)
    }

    componentWillUnmount() {
        this._isMounted = false
    }


    render() {

        const { p } = this.state

        const listID = p ? p.uuid : null

        const lists = p ? (
            <div className="row">
                <div className="col-lg-6 mb-5 mb-lg-0">
                    <h4
                        className="font-weight-normal mb-3 mt-0 text-custom"
                        style={{
                            lineHeight: '1.5',
                            fontSize: '1rem'
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
                <div className="col-lg-6">
                    <h4
                        className="font-weight-normal mb-3 mt-0 text-custom"
                        style={{
                            lineHeight: '1.5',
                            fontSize: '1rem'
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
                                                    <div className="col-4 col-md-3 px-2">
                                                        <img
                                                            src={FETCHIMG + `/${po.image}`}
                                                            alt={po.title}
                                                            className="rounded-0 w-100"
                                                            style={{
                                                                maxWidth: '100%'
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-8 col-md-9 px-2">
                                                        <div className="row mx-n2">
                                                            <div className="col-md-7 mb-3 mb-md-0 px-2">
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
                                                            <div className="col-md-5 px-2 text-left text-md-right">
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
                                    p.status === 'Cancelled' && <>{p.status_mm} <span className="text-danger"><TiCancel /></span></>
                                }
                            </span>
                        </p>
                    </div>
                </div>
            </div >
        ) : (
                <div className="row">
                    <div className="col-lg-6 mb-5 mb-lg-0">
                        <div
                            className="mb-3 mt-0"
                            style={{
                                lineHeight: '1.5'
                            }}
                        >
                            <Skeleton height={28} />
                        </div>
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
                                        {
                                            Array(2).fill().map((item, index) => (
                                                <td
                                                    className="align-middle px-3"
                                                    key={index}
                                                >
                                                    <Skeleton height={21} />
                                                </td>
                                            ))
                                        }
                                    </tr>
                                    <tr
                                        style={{
                                            height: '60px'
                                        }}
                                    >
                                        {
                                            Array(2).fill().map((item, index) => (
                                                <td
                                                    className="align-middle px-3"
                                                    key={index}
                                                >
                                                    <Skeleton height={21} />
                                                </td>
                                            ))
                                        }
                                    </tr>
                                    <tr
                                        style={{
                                            height: '60px'
                                        }}
                                    >
                                        {
                                            Array(2).fill().map((item, index) => (
                                                <td
                                                    className="align-middle px-3"
                                                    key={index}
                                                >
                                                    <Skeleton height={21} />
                                                </td>
                                            ))
                                        }
                                    </tr>
                                    <tr
                                        style={{
                                            height: '60px'
                                        }}
                                    >
                                        {
                                            Array(2).fill().map((item, index) => (
                                                <td
                                                    className="align-middle px-3"
                                                    key={index}
                                                >
                                                    <Skeleton height={21} />
                                                </td>
                                            ))
                                        }
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
                                            <div className="mt-1">
                                                {
                                                    Array(6).fill().map((item, index) => (
                                                        <div className="mb-1" key={index}>
                                                            <Skeleton height={20} width={'50%'} />
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div
                            className="mb-3 mt-0"
                            style={{
                                lineHeight: '1.5'
                            }}
                        >
                            <Skeleton height={28} />
                        </div>
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <tbody
                                    style={{
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {
                                        Array(2).fill().map((item, index) => (
                                            <tr key={index}>
                                                <td
                                                    className="p-3"
                                                    style={{
                                                        lineHeight: '2'
                                                    }}
                                                >
                                                    <div className="row mx-n2">
                                                        <div className="col-4 col-md-3 px-2">
                                                            <Skeleton width={84} height={84} />
                                                        </div>
                                                        <div className="col-8 col-md-9 px-2">
                                                            <Skeleton height={84} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>


                        <div className="pt-5 pt-lg-3">
                            <div
                                className="mb-3 mt-0"
                                style={{
                                    lineHeight: '1.5'
                                }}
                            >
                                <Skeleton height={28} />
                            </div>
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <tbody
                                        style={{
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        <tr>
                                            <td>
                                                <div className="row mx-n2">
                                                    <div className="col-3 col-md-2 px-2">
                                                        <Skeleton width={52} height={52} circle={true} />
                                                    </div>
                                                    <div className="col-9 col-md-10 px-2 align-self-center">
                                                        <Skeleton width={100} height={16} />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div >
            )

        // const cancelledID = p ? p.status === 'Cancelled' : null

        return (
            <>
                <Name />

                <div className="py-5 bg-light-custom">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-sm-5 col-lg-3 mb-5 mb-sm-0">
                                <LeftSideBar />
                            </div>
                            <div className="col-12 col-sm-7 col-lg-9 overflow-hidden">
                                <h4
                                    className="mb-4 font-weight-bold text-uppercase"
                                    style={{
                                        fontSize: '1.2rem',
                                        lineHeight: '1.5',
                                        letterSpacing: '-0.5px'
                                    }}
                                >Track <small style={{ fontSize: '14px', textTransform: 'none' }}>by <span className="text-custom" style={{ whiteSpace: 'nowrap' }}>{listID}</span></small></h4>
                                <div className="">
                                    <div
                                        className="mb-4 position-relative"
                                    >
                                        <Link
                                            to="/order-cancellations"
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
                                    </div>
                                    {lists}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default withRouter(CancelledOrderId)