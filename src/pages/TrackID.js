import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import Moment from 'react-moment'
import 'moment-timezone'
import { removeOrder } from '../store/order/actions'
import { Translation } from 'react-i18next'
import { db } from '../helpers/firebase'
import { ORDERURL } from '../helpers/api'
import { IoIosSearch, IoIosClose } from 'react-icons/io'
import LeftSideBar from '../components/order/LeftSideBar'
import { auth } from '../helpers/firebase'
import { IonPage, IonContent } from '@ionic/react'
import TabLayout from '../components/layout/TabLayout'


class TrackID extends Component {
    static propTypes = {
        removeOrder: PropTypes.func.isRequired
    }

    _isMounted = false

    state = {
        orderID: '',
        orders: [],
        user: auth.currentUser
    }

    resetForm = () => {
        this.setState({
            orderID: ''
        })
    }

    handleOnChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    getOrderID = () => {
        this._isMounted = true

        const id = this.state.orderID

        db
            .ref(ORDERURL + `/${id}`)
            .on('value', snapshot => {
                const data = []
                snapshot.forEach(snap => {
                    data.push(snap.val())
                })

                if(this._isMounted) {
                    this.setState({
                        orders: data
                    })
                }
            })

    }

    componentDidMount() {
        this._isMounted = true

        auth.onAuthStateChanged((user) => {
            if (this._isMounted) {
                if (user) {
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

        this.getOrderID()
        window.scrollTo(0, 0)
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {

        const { orders } = this.state

        const { orderIDs } = this.props

        const tableTHCss = {
            borderBottom: '1px solid #f3f3f3',
            fontWeight: 'normal',
            fontSize: '0.9rem',
            lineHeight: '1.5',
            whiteSpace: 'nowrap'
        }

        const tableTDCss = {
            borderBottom: '1px solid #f3f3f3',
            fontWeight: 'normal',
            fontSize: '0.75rem',
            lineHeight: '1.6',
            color: '#000',
            whiteSpace: 'nowrap'
        }

        const ordersData = orders.filter(p => {
            return p.uuid.toLowerCase().indexOf(this.state.orderID.toLowerCase()) !== -1
        })

        const orderIDdata = orderIDs.filter(p => {
            return p.uuid.toLowerCase().indexOf(this.state.orderID.toLowerCase()) !== -1
        })

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
                    >Track <small style={{ fontSize: '12px', textTransform: 'none' }}>by</small></h4>
                </div>
            </div>

        const searchOrders =
            <div className="mb-0 pb-4">
                <div
                    className="d-flex col-12 col-lg-6 px-0"
                >
                    <div className="field-group flex-grow-1 position-relative">
                        <Translation>
                            {
                                (t) =>
                                    <input
                                        autoComplete="off"
                                        type="text"
                                        name="orderID"
                                        value={this.state.orderID}
                                        onChange={this.handleOnChange.bind(this)}
                                        className="form-control bg-transparent text-default shadow-sm px-3 font-weight-normal"
                                        style={{
                                            height: '50px',
                                            lineHeight: '2',
                                            border: '2px solid #000',
                                            borderRadius: '3px',
                                            borderTopRightRadius: '0',
                                            borderBottomRightRadius: '0',
                                            width: '100%'
                                        }}
                                        placeholder={t('main.order.number')}
                                    />
                            }
                        </Translation>

                        {
                            this.state.orderID.length >= 36 ? (
                                <div
                                    className="input-group-prepend position-absolute bg-transparent border-0 shadow-none rounded-0 p-0"
                                    style={{
                                        right: '0',
                                        top: '0',
                                        bottom: '0',
                                        zIndex: '99'
                                    }}
                                >
                                    <button
                                        className="p-0 border-0 shadow-none rounded-0 bg-transparent text-center text-danger"
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            fontSize: '30px',
                                            lineHeight: '30px'
                                        }}
                                        onClick={this.resetForm.bind(this)}
                                    >
                                        <IoIosClose />
                                    </button>
                                </div>
                            ) : null
                        }

                    </div>
                    <div className="field-group">
                        <button
                            className="btn shadow-sm text-white px-4"
                            style={{
                                height: '50px',
                                border: '2px solid #000',
                                background: '#000',
                                borderRadius: '3px',
                                borderTopLeftRadius: '0',
                                borderBottomLeftRadius: '0',
                                fontSize: '30px',
                                lineHeight: '25px'
                            }}
                            type="submit"
                            onSubmit={this.getOrderID.bind(this)}
                        >
                            <IoIosSearch />
                        </button>
                    </div>
                </div>
            </div>


        const orderLists = orderIDdata.length ? (
            <>
                <h4
                    className="font-weight-normal mb-3"
                    style={{
                        fontSize: '1.1rem',
                        lineHeight: '1.5'
                    }}
                >
                    <Translation>
                        {(t) => <>{t('main.orders')}</>}
                    </Translation>
                </h4>
                <div className="bg-white p-4 rounded-sm shadow-sm">
                    <div className="table-responsive">
                        <table
                            className="table table-borderless m-0"
                        >
                            <thead>
                                <tr className="table-light text-default">
                                    <th className="py-3" style={tableTHCss}>
                                        <Translation>
                                            {(t) => <>{t('main.orderNo')}</>}
                                        </Translation>
                                    </th>
                                    <th className="py-3" style={tableTHCss}>
                                        <Translation>
                                            {(t) => <>{t('main.orderDate')}</>}
                                        </Translation>
                                    </th>
                                    <th className="py-3" style={tableTHCss}>
                                        <Translation>
                                            {(t) => <>{t('main.addressName')}</>}
                                        </Translation>
                                    </th>
                                    <th className="py-3" style={tableTHCss}>
                                        <Translation>
                                            {(t) => <>{t('main.addressPhone')}</>}
                                        </Translation>
                                    </th>
                                    <th className="py-3" style={tableTHCss}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orderIDdata.map(p => (
                                        <tr key={p.id}>
                                            <td style={tableTDCss} className="text-default font-weight-bold">
                                                {p.uuid}
                                            </td>
                                            <td style={tableTDCss}>
                                                <Moment
                                                    fromNow
                                                >
                                                    {p.checkout.contact.dateRaw}
                                                </Moment>
                                            </td>
                                            <td style={tableTDCss}>
                                                {p.checkout.contact.name}
                                            </td>
                                            <td style={tableTDCss}>
                                                {
                                                    p.checkout.contact.phone && p.checkout.contact.phone
                                                }
                                            </td>
                                            <td style={tableTDCss} className="text-right position-relative">
                                                <button
                                                    className="btn text-custom bg-transparent p-0 rounded-0 border-0 shadow-none link-default-hover"
                                                    style={{
                                                        fontSize: '0.85rem'
                                                    }}
                                                    onClick={() => this.props.history.push(`/order/${p.uuid}`)}
                                                >
                                                    <Translation>
                                                        {(t) => <>{t('main.view')}</>}
                                                    </Translation>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        ) : null

        const noOrderLists =
            <>
                {searchOrders}

                <div className="bg-white p-4 rounded-sm shadow-sm">
                    <div className="table-responsive">
                        <table
                            className="table table-borderless m-0"
                        >
                            <thead>
                                <tr className="table-light text-default">
                                    <th className="py-3" style={tableTHCss}>
                                        <Translation>
                                            {(t) => <>{t('main.orderNo')}</>}
                                        </Translation>
                                    </th>
                                    <th className="py-3" style={tableTHCss}>
                                        <Translation>
                                            {(t) => <>{t('main.orderDate')}</>}
                                        </Translation>
                                    </th>
                                    <th className="py-3" style={tableTHCss}>
                                        <Translation>
                                            {(t) => <>{t('main.addressName')}</>}
                                        </Translation>
                                    </th>
                                    <th className="py-3" style={tableTHCss}>
                                        <Translation>
                                            {(t) => <>{t('main.addressPhone')}</>}
                                        </Translation>
                                    </th>
                                    <th className="py-3" style={tableTHCss}></th>
                                </tr>
                            </thead>
                            {
                                this.state.orderID.length >= 36 ? (
                                    <>
                                        <tbody>
                                            {
                                                ordersData.map(p => (
                                                    <tr key={p.id}>
                                                        <td style={tableTDCss} className="text-custom">
                                                            {p.uuid}
                                                        </td>
                                                        <td style={tableTDCss}>
                                                            <Moment
                                                                fromNow
                                                            >
                                                                {p.checkout.contact.dateRaw}
                                                            </Moment>
                                                        </td>
                                                        <td style={tableTDCss}>
                                                            {p.checkout.contact.name}
                                                        </td>
                                                        <td style={tableTDCss}>
                                                            {
                                                                p.checkout.contact.phone && p.checkout.contact.phone
                                                            }
                                                        </td>
                                                        <td style={tableTDCss} className="text-right position-relative">
                                                            <button
                                                                className="btn text-custom bg-transparent p-0 rounded-0 border-0 shadow-none link-default-hover"
                                                                style={{
                                                                    fontSize: '0.85rem'
                                                                }}
                                                                onClick={() => this.props.history.push(`/order/${p.uuid}`)}
                                                            >
                                                                <Translation>
                                                                    {(t) => <>{t('main.view')}</>}
                                                                </Translation>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                        <tbody>
                                            <tr style={{ height: '205px' }} />
                                        </tbody>
                                    </>
                                ) : null
                            }
                        </table>
                    </div>

                    {
                        this.state.orderID.length <= 35 &&
                        <div className="d-table w-100 h-100">
                            <div
                                className="d-table-cell align-middle text-center"
                                style={{
                                    height: '250px'
                                }}
                            >
                                <p
                                    className="mb-3 font-weight-normal text-default"
                                    style={{
                                        fontSize: '0.9rem',
                                        lineHeight: '1.5'
                                    }}
                                >
                                    <Translation>
                                        {(t) => <>{t('main.no.orders')}</>}
                                    </Translation>
                                </p>
                                <Link
                                    to="/new-products"
                                    className="d-inline-block py-2 px-4 bg-default text-white text-decoration-none shadow-sm btn-cart-hover"
                                    style={{
                                        fontSize: '0.8rem',
                                        lineHeight: '1.5',
                                        background: '#7f187f',
                                        borderRadius: '2px'
                                    }}
                                >
                                    <Translation>
                                        {(t) => <>{t('main.continueShopping')}</>}
                                    </Translation>
                                </Link>

                            </div>
                        </div>
                    }
                </div>
            </>

        return (
            <TabLayout>
                <IonPage>
                    <IonContent>

                            {trackBy}

                            <div className="bg-light-custom py-5">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-12 col-sm-4 col-lg-2 mb-4 mb-sm-0">
                                            <LeftSideBar />
                                        </div>
                                        <div className="col-12 col-sm-8 col-lg-10">
                                            {
                                                this.state.user === null ? (
                                                    <>
                                                        {
                                                            orderIDs.length ? orderLists : noOrderLists
                                                        }
                                                    </>
                                                ) : noOrderLists
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>
                    </IonContent>
                </IonPage>
            </TabLayout>
        )
    }
}

const mapStateToProps = state => ({
    orderIDs: state.order
})

export default connect(mapStateToProps, { removeOrder })(withRouter(TrackID))