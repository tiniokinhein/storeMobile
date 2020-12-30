import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter , Link } from 'react-router-dom'
import { ORDERURL } from '../helpers/api'
import { db } from '../helpers/firebase'
import { currency } from '../helpers/utils'
import Moment from 'react-moment'
import 'moment-timezone'
import { Translation } from 'react-i18next'
import { IoMdArrowBack } from 'react-icons/io'
import ReactToPrint from 'react-to-print'
import LOGO from '../assets/images/logo-print.png'
import { MdEmail , MdLocalPrintshop , MdPictureAsPdf } from 'react-icons/md'
import { GiPhone } from 'react-icons/gi'
import Skeleton from 'react-loading-skeleton'


const FETCHIMG = process.env.REACT_APP_FETCH_IMAGES

class InvoiceID extends Component 
{
    state = {
        p: null
    }

    getOrder = () => {
        const id = this.props.match.params.id
        db 
        .ref(ORDERURL+`/${id}`)
        .on('value', snapshot => {
            const data = snapshot.val()
            this.setState({
                p: data
            })
        })
    }

    componentDidMount() {
        this.getOrder()
        window.scrollTo(0,0)
    }

    render() {

        const { p } = this.state

        const lists = p ? (
            <div className="row">
                <div className="col-12 col-lg-6 mb-5 mb-lg-0">
                    <h4
                        className="font-weight-bold mb-3 mt-0"
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
                                            {(t) => <>{t('main.invoiceNo')}</>}
                                        </Translation>
                                    </td>
                                    <td
                                        className="align-middle px-3"
                                    >
                                        <small className="text-success font-weight-bold">{p.invoice_number}</small>
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
                                            <span style={{fontSize:'9px'}}>
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
                                        <small className="text-dark font-weight-bold d-inline-block mt-2">
                                            {
                                                p.checkout.contact.name &&
                                                <>{p.checkout.contact.name}<br /></>
                                            }
                                            {
                                                p.checkout.contact.email &&
                                                <>{p.checkout.contact.email}<br /></>
                                            }
                                            {
                                                p.checkout.contact.phone &&
                                                <>{p.checkout.contact.phone}<br /></>
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
                <div className="col-12 col-lg-6 mb-5 mb-lg-0">
                    <h4
                        className="font-weight-bold mb-3 mt-0"
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
                                                <div className="d-flex">
                                                    <div className="pr-2">
                                                        <img
                                                            src={FETCHIMG+`/${po.image}`}
                                                            alt={po.title}
                                                            className="rounded-0"
                                                            style={{
                                                                width: '80px'
                                                            }}

                                                        />
                                                    </div>
                                                    <div
                                                        className="align-self-center flex-grow-1"
                                                    >
                                                        <h6 
                                                            className="m-0 pb-0 text-dark font-weight-bold"
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
                                                            po.color && po.size &&
                                                            <>
                                                                <p 
                                                                    className="mb-0 mt-1"
                                                                    style={{
                                                                        lineHeight: '1'
                                                                    }}
                                                                >
                                                                    <small 
                                                                        className="font-weight-normal" 
                                                                        style={{fontSize:'10px'}}
                                                                    >
                                                                        <Translation>
                                                                            {(t) => <>{t('main.color')}</>}
                                                                        </Translation> - <strong className="font-weight-bold">{po.color}</strong>
                                                                    </small>
                                                                </p>
                                                                <p 
                                                                    className="mb-2"
                                                                    style={{
                                                                        lineHeight: '1'
                                                                    }}
                                                                >
                                                                    <small 
                                                                        className="font-weight-normal" 
                                                                        style={{fontSize:'10px'}}
                                                                    >
                                                                        <Translation>
                                                                            {(t) => <>{t('main.size')}</>}
                                                                        </Translation> - <strong className="font-weight-bold">{po.size}</strong>
                                                                    </small>
                                                                </p>
                                                            </>
                                                        }
                                                        <div
                                                            className="pt-0"
                                                        >
                                                            <h5 
                                                                className="m-0 font-weight-bold"
                                                                style={{
                                                                    fontSize: '14px'
                                                                }}
                                                            >{po.price} {currency}</h5> 
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="align-self-center ml-auto text-right"
                                                    >
                                                        <div>
                                                            <p className="mb-0">
                                                                <small
                                                                    className="font-weight-light"
                                                                    style={{fontSize:'10px'}}
                                                                >
                                                                    <Translation>
                                                                        {(t) => <>{t('main.itemQuantity')}</>}
                                                                    </Translation> - <strong className="font-weight-bold">( {po.quantity} )</strong>
                                                                </small>
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <small className="font-weight-light">
                                                                <Translation>
                                                                    {(t) => <>{t('main.itemPrice')}</>}
                                                                </Translation> - <strong className="font-weight-bold">{po.price} {currency}</strong>
                                                            </small>
                                                        </div>
                                                        <div>
                                                            <small className="font-weight-light">
                                                                <Translation>
                                                                    {(t) => <>{t('main.subtotal')}</>}
                                                                </Translation> - <strong className="font-weight-bold">{po.item_total} {currency}</strong>
                                                            </small>
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
                                                    className="font-weight-light mb-0"
                                                    style={{
                                                        fontSize: '14px',
                                                        lineHeight: '2'
                                                    }}
                                                >
                                                    {p.products.subtotal} {currency}
                                                </p>
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
                                                    className="font-weight-light mb-0"
                                                    style={{
                                                        fontSize: '14px',
                                                        lineHeight: '2'
                                                    }}
                                                >
                                                    <small>( - )</small> {p.products.discount_price} {currency}
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
                                <tr>
                                    <td
                                        className="py-5 px-3 border-0"
                                    >
                                        <div 
                                            className="text-center my-5"
                                        >
                                            <h6 
                                                className="m-0 text-dark font-weight-bold text-uppercase text-secondary"
                                                style={{
                                                    fontSize: '25px'
                                                }}
                                            >
                                                Invoice
                                            </h6>
                                            <strong style={{fontSize:'18px',color:'#000'}}>{p.products.total} {currency}</strong>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        ) : null

        const printList = 
            <>
                {
                    p ? (
                        <div 
                            key={p.id}
                            className="row"
                        >
                            <div
                                className="col-6"
                            >
                                <img
                                    src={LOGO}
                                    alt="Bagan Zay"
                                    width="120"
                                />
                                <h4
                                    className="font-weight-bold mb-4 text-dark"
                                >Bagan Store</h4>
                                <h5
                                    className="mb-2"
                                ><MdEmail className="text-dark" /> baganbusinessgroup.store@gmail.com</h5>
                                <h5
                                    className="mb-2"
                                ><GiPhone className="text-dark" /> 09123456789</h5>
                            </div>
                            <div
                                className="col-6 text-right"
                            >
                                <h1
                                    className="text-uppercase font-weight-bold display-4 mb-4"
                                    style={{
                                        color: '#000'
                                    }}
                                >Invoice</h1>
                                <table className="ml-auto">
                                    <tbody>
                                        <tr className="text-right">
                                            <td className="px-3 py-3 border"><h5 className="m-0">INVOICE NO.</h5></td>
                                            <td className="text-left border px-3 py-3"><h5 className="m-0"><strong>{p.invoice_number}</strong></h5></td>
                                        </tr>
                                        <tr className="text-right">
                                            <td className="px-3 py-3 border"><h5 className="m-0">DATE</h5></td>
                                            <td className="text-left border px-3 py-3">
                                                {
                                                    p.products.delivery === 'ပုံမှန်ကြာချိန် (၂)ရက်' &&
                                                    <h5 className="m-0">
                                                        <strong>
                                                            <Moment 
                                                                add={{ days:2 }}
                                                                format="dddd, D.MM.YYYY"
                                                            >
                                                                {p.checkout.contact.dateRaw}
                                                            </Moment>
                                                        </strong>
                                                    </h5>
                                                }
                                                {
                                                    p.products.delivery === 'ကြာချိန် (၁)ရက်' &&
                                                    <h5 className="m-0">
                                                        <strong>
                                                            <Moment 
                                                                add={{ days:1 }}
                                                                format="dddd, D.MM.YYYY"
                                                            >
                                                                {p.checkout.contact.dateRaw}
                                                            </Moment>
                                                        </strong>
                                                    </h5>
                                                }
                                                {
                                                    p.products.delivery === 'ချက်ချင်း (၂)နာရီအတွင်း' &&
                                                    <h5 className="m-0">
                                                        <strong>
                                                            <Moment 
                                                                add={{ hours:2 }}
                                                                format="dddd, D.MM.YYYY"
                                                            >
                                                                {p.checkout.contact.dateRaw}
                                                            </Moment>
                                                        </strong>
                                                    </h5>
                                                }
                                            </td>
                                        </tr>
                                        <tr className="text-right">
                                            <td className="px-3 py-3 border"><h5 className="m-0">DELIVERY</h5></td>
                                            <td className="text-left border px-3 py-3">
                                                {
                                                    p.products.delivery === 'ပုံမှန်ကြာချိန် (၂)ရက်' &&
                                                    <h5 className="m-0">
                                                        <strong>
                                                            <Moment 
                                                                add={{ days:2 }}
                                                                format="D.MM.YYYY"
                                                            >
                                                                {p.checkout.contact.dateRaw}
                                                            </Moment>
                                                        </strong>
                                                    </h5>
                                                }
                                                {
                                                    p.products.delivery === 'ကြာချိန် (၁)ရက်' &&
                                                    <h5 className="m-0">
                                                        <strong>
                                                            <Moment 
                                                                add={{ days:1 }}
                                                                format="D.MM.YYYY"
                                                            >
                                                                {p.checkout.contact.dateRaw}
                                                            </Moment>
                                                        </strong>
                                                    </h5>
                                                }
                                                {
                                                    p.products.delivery === 'ချက်ချင်း (၂)နာရီအတွင်း' &&
                                                    <h5 className="m-0">
                                                        <strong>
                                                            <Moment 
                                                                add={{ hours:2 }}
                                                                format="D.MM.YYYY"
                                                            >
                                                                {p.checkout.contact.dateRaw}
                                                            </Moment>
                                                        </strong>
                                                    </h5>
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div
                                className="col-12 my-5 py-4"
                            >
                                <h4
                                    className="font-weight-bold mb-3 text-secondary"
                                >
                                    <Translation>
                                        {(t) => <>{t('main.shippingAddress')}</>}
                                    </Translation>
                                </h4>
                                <h5
                                    className="mb-2"
                                >{p.checkout.contact.name}</h5>
                                <h5
                                    className="mb-2"
                                >{p.checkout.contact.email}</h5>
                                <h5
                                    className="mb-2"
                                >{p.checkout.contact.phone}</h5>
                                <h5
                                    className="mb-2"
                                >{p.checkout.contact.home_no}</h5>
                                <h5
                                    className="mb-2"
                                >{p.checkout.contact.street_quarter}</h5>
                                <h5
                                    className="mb-2"
                                >{p.checkout.contact.township}</h5>
                            </div>
                            <div
                                className="col-12 mb-5"
                            >
                                <h4
                                    className="font-weight-bold mb-4 text-secondary"
                                >
                                    <Translation>
                                        {(t) => <>{t('main.purchaseOrders')}</>}
                                    </Translation>
                                </h4>
                                <table className="table">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th scope="col">
                                                <h5 className="m-0">
                                                    <strong>
                                                        <Translation>
                                                            {(t) => <>{t('main.i-items')}</>}
                                                        </Translation>
                                                    </strong>
                                                </h5>
                                            </th>
                                            <th scope="col">
                                                <h5 className="m-0">
                                                    <strong>
                                                        <Translation>
                                                            {(t) => <>{t('main.itemPrice')}</>}
                                                        </Translation>
                                                    </strong>
                                                </h5>
                                            </th>
                                            <th scope="col">
                                                <h5 className="m-0">
                                                    <strong>
                                                        <Translation>
                                                            {(t) => <>{t('main.itemQuantity')}</>}
                                                        </Translation>
                                                    </strong>
                                                </h5>
                                            </th>
                                            <th scope="col">
                                                <h5 className="m-0">
                                                    <strong>
                                                        <Translation>
                                                            {(t) => <>{t('main.subtotal')}</>}
                                                        </Translation>
                                                    </strong>
                                                </h5>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            p.products.orderItems.map(p => (
                                                <tr key={p.id}>
                                                    <td>
                                                        <h5 className="m-0">
                                                            <Translation>
                                                                {(t) => 
                                                                    <>
                                                                        {t(
                                                                        'main.post.title',
                                                                        { 
                                                                            title_en: p.title,
                                                                            title_mm: p.title_mm
                                                                        }
                                                                        )}
                                                                    </>
                                                                }
                                                            </Translation> 
                                                        </h5>
                                                        {
                                                            p.color && p.size &&
                                                            <>
                                                                <p 
                                                                    className="mb-1 mt-2"
                                                                    style={{
                                                                        lineHeight: '1'
                                                                    }}
                                                                >
                                                                    <small 
                                                                        className="font-weight-normal" 
                                                                        style={{fontSize:'12px'}}
                                                                    >
                                                                        <Translation>
                                                                            {(t) => <>{t('main.color')}</>}
                                                                        </Translation> - <strong className="font-weight-bold">{p.color}</strong>
                                                                    </small>
                                                                </p>
                                                                <p 
                                                                    className="mb-1"
                                                                    style={{
                                                                        lineHeight: '1'
                                                                    }}
                                                                >
                                                                    <small 
                                                                        className="font-weight-normal" 
                                                                        style={{fontSize:'12px'}}
                                                                    >
                                                                        <Translation>
                                                                            {(t) => <>{t('main.size')}</>}
                                                                        </Translation> - <strong className="font-weight-bold">{p.size}</strong>
                                                                    </small>
                                                                </p>
                                                            </>
                                                        }
                                                    </td>
                                                    <td><h5 className="m-0">{p.price} {currency}</h5></td>
                                                    <td><h5 className="m-0">{p.quantity}</h5></td>
                                                    <td><h5 className="m-0">{p.item_total} {currency}</h5></td>
                                                </tr>
                                            ))
                                        }

                                        <tr>
                                            <td colSpan="2" className="py-4 text-center align-middle">
                                                <h1
                                                    className="text-uppercase font-weight-bold mb-1"
                                                ><strong>Invoice</strong></h1>
                                                <h4
                                                    className="font-weight-bold mb-0"
                                                    style={{
                                                        color: '#000'
                                                    }}
                                                >
                                                    {p.products.total} {currency}
                                                </h4>
                                            </td>
                                            <td colSpan="2" className="py-4">
                                                <table className="tabel table-borderless w-100">
                                                    <tbody>
                                                        <tr>
                                                            <td className="text-left px-0"><h5 className="m-0"><strong><Translation>{(t) => <>{t('main.subtotal')}</>}</Translation></strong></h5></td>
                                                            <td className="px-0"><h5 className="m-0"><strong>{p.products.subtotal} {currency}</strong></h5></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-left px-0">
                                                                <h5 className="m-0">
                                                                    <strong>
                                                                        <Translation>
                                                                            {(t) => <>{t('main.deliveryFee')}</>}
                                                                        </Translation>
                                                                    </strong>
                                                                </h5>
                                                            </td>
                                                            {
                                                                p.products.delivery_fee === '0' ? (
                                                                    <td className="px-0">
                                                                        <h5 className="m-0">
                                                                            <strong>
                                                                                <Translation>
                                                                                    {(t) => <>{t('main.deliveryFreeShipping')}</>}
                                                                                </Translation>
                                                                            </strong>
                                                                        </h5>
                                                                    </td>
                                                                ) : (
                                                                    <td className="px-0">
                                                                        <h5 className="m-0">
                                                                            <strong>{p.products.delivery_fee} {currency}</strong>
                                                                        </h5>
                                                                    </td>
                                                                )
                                                            }
                                                        </tr>
                                                        <tr>
                                                            <td className="text-left px-0">
                                                                <h5 className="m-0">
                                                                    <strong><Translation>{(t) => <>{t('main.discount')}</>}</Translation> <small>( {p.products.discount} )</small></strong>
                                                                </h5>
                                                            </td>
                                                            <td className="px-0"><h5 className="m-0"><strong>{p.products.discount_price} {currency}</strong></h5></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-left px-0"><h5 className="m-0"><strong><Translation>{(t) => <>{t('main.total')}</>}</Translation></strong></h5></td>
                                                            <td className="px-0"><h5 className="m-0"><strong>{p.products.total} {currency}</strong></h5></td>
                                                        </tr>
                                                       
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div 
                                className="col-12 position-absolute"
                                style={{
                                    bottom: '3rem',
                                    left: '3rem',
                                    right: '3rem',
                                    zIndex: '9'
                                }}
                            >
                                <p
                                    className="mb-0"
                                    style={{
                                        color: '#000'
                                    }}
                                >
                                    <strong>
                                        <i>
                                            <Translation>
                                                {(t) => <>{t('main.thankyou')}</>}
                                            </Translation>
                                        </i>
                                    </strong>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="row">
                                <div className="col-12 col-lg-6 mb-5 mb-lg-0">
                                    <Skeleton width={'100%'} height={500} />
                                </div>
                                <div className="col-12 col-lg-6 mb-5 mb-lg-0">
                                    <Skeleton width={'100%'} height={500} />
                                </div>
                            </div>
                        </>
                    )
                }
            </>

        return (
            <>
                <div 
                    className="py-4"
                    style={{
                        background: '#7f187f'
                    }}
                >
                    <div className="container">
                        <Link
                            to="/track"
                            className="text-decoration-none d-inline-block w-48-btn-hover rounded-0 text-center border-light bg-transparent"
                            style={{
                                fontSize: '1.6rem',
                                width: '60px',
                                height: '40px',
                                lineHeight: '34px',
                                border: '2px solid #000',
                                color: '#fff'
                            }}
                        >
                            <IoMdArrowBack />
                        </Link>

                        <ReactToPrint
                            trigger={() =>
                                <button
                                    className="float-right d-inline-block rounded-0 text-center btn p-0 shadow-none border-light bg-transparent"
                                    style={{
                                        width: '90px',
                                        height: '40px',
                                        border: '2px solid #000',
                                        color: '#fff'
                                    }}
                                >
                                    <MdLocalPrintshop
                                        style={{
                                            fontSize:'1.1rem'
                                        }}
                                    /> &nbsp;+&nbsp;&nbsp;
                                    <MdPictureAsPdf
                                        style={{
                                            fontSize:'1.1rem'
                                        }}
                                    />
                                </button>
                            }
                            content={() => this.componentRef}
                        />
                    </div>
                </div>

                <div className="bg-light py-5">
                    <div className="container">
                        {lists}

                        <div
                            className="pt-5 text-center"
                        >
                            <p
                                className="mb-3"
                                style={{
                                    color: '#333',
                                    lineHeight: '2'
                                }}
                            >
                                <small className="font-weight-bold">
                                    <Translation>
                                        {(t) => <>{t('main.thankyou')}</>}
                                    </Translation>
                                </small>
                            </p>
                        </div>

                        <div
                            className="d-none p-5 printPage"
                            ref={el => (this.componentRef = el)}
                        >
                            {printList}
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

export default connect(mapStateToProps)(withRouter(InvoiceID))