import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translation } from 'react-i18next'
import { RiCloseLine } from 'react-icons/ri'
import { TiBell } from 'react-icons/ti'
import Moment from 'react-moment'
import { addOrder , removeOrder } from '../../store/order/actions'
import { withRouter } from 'react-router-dom'


class FreeUserNoti extends Component {

    closeNoti = () => {
        document.getElementById('free-noti-open').style.right = '-100%'
        document.getElementById('free-noti-open').style.transition = 'right 0.1s ease-out'
    }

    render() {

        const { orderUpdate } = this.props

        const fixedCss = {
            right: '-100%',
            bottom: '0',
            top: '0',
            zIndex: '999999999'
        }

        const offBlockCss = {
            cursor: 'pointer'
        }

        const top66Css = {
            height: '66px'
        }

        const headTitleCss = {
            fontSize: '1rem',
            lineHeight: '1.5',
            marginLeft: '-60px',
            zIndex: '1'
        }

        const headIconCss = {
            height: '66px',
            width: '60px',
            lineHeight: '0',
            fontSize: '1.6rem',
            zIndex: '2'
        }

        const headNotiCss = {
            fontSize: '0.9rem',
            lineHeight: '1.5'
        }

        const buttonLinkCss = {
            background: '#f0f8ff',
            transition: '0.3s ease-in-out'
        }

        const iconOrderCss = {
            width: '40px',
            height: '40px',
            minWidth: '40px',
            minHeight: '40px',
            lineHeight: '35px',
            fontSize: '20px'
        }

        const paraCss = {
            fontSize: '0.75rem',
            lineHeight: '1.5',
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical'
        }

        const smallDateCss = {
            fontSize: '0.6rem'
        }

        const lists =
            <>
                {
                    orderUpdate.length <= 0 ? null : (
                        <>
                            <div className="">
                                <h4
                                    className="px-3 py-2 border-bottom mb-0 font-weight-normal text-default"
                                    style={headNotiCss}
                                >
                                    <Translation>
                                        {(t) => <>{t('main.latest')}</>}
                                    </Translation>
                                </h4>

                                {
                                    orderUpdate.filter(fl => fl.notify === true).length ? (
                                        <>
                                            {
                                                orderUpdate.filter(fl => fl.notify === true).map(p => (
                                                    <div key={p.id} className="border-bottom">
                                                        <button
                                                            className="btn text-dark shadow-none rounded-0 border-0 text-left w-100 py-2 px-3 btn-link-light"
                                                            style={buttonLinkCss}
                                                            onClick={() => {
                                                                this.props.removeOrder()
                                                                this.props.addOrder({...p, notify:false})
                                                                this.closeNoti()
                                                                this.props.history.push(`/order/${p.uuid}`)
                                                            }}
                                                        >
                                                            <div className="d-flex align-items-center">
                                                                <span className="text-light bg-custom rounded-circle text-center" style={iconOrderCss}>
                                                                    <TiBell />
                                                                </span>
                                                                <div className="flex-grow-1">
                                                                    <div className="pl-3">
                                                                        <p
                                                                            className="mb-1 font-weight-normal text-secondary"
                                                                            style={paraCss}
                                                                        >
                                                                            <strong className="text-dark">
                                                                                {p.checkout.contact.name}
                                                                            </strong> လိပ်စာ နှင့် ကုန်ပစ္စည်း ({p.products.orderItems.length})မျိုး&nbsp;

                                                                            {
                                                                                p.checkout.payment === "ပစ္စည်းရောက် ငွေရှင်းစနစ်" &&
                                                                                <>အော်ဒါ တင်ထားသည်</>
                                                                            }

                                                                            {
                                                                                p.checkout.payment === "MyKyat payment" &&
                                                                                <>ငွေပေးချေထားသည်</>
                                                                            }
                                                                        </p>
                                                                        <h6 className="text-default font-weight-normal" style={smallDateCss}>
                                                                            <Moment fromNow>
                                                                                {p.checkout.contact.dateRaw}
                                                                            </Moment>
                                                                        </h6>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </button>
                                                    </div>
                                                    )
                                                )
                                            }
                                        </>
                                    ) : (
                                        <div className="p-3 border-bottom">
                                            <button
                                                className="btn text-custom p-0 border-0 shadow-none rounded-0 font-weight-normal"
                                                style={{
                                                    fontSize: '1rem',
                                                    lineHeight: '1.8'
                                                }}
                                                onClick={() => {
                                                    this.props.history.push('/register')
                                                    this.closeNoti()
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.register')}</>}
                                                </Translation>
                                            </button>
                                        </div>
                                    )
                                }
                                        
                            </div>

                            <div className="">
                                <h4
                                    className="px-3 py-2 border-bottom mb-0 font-weight-normal text-default"
                                    style={headNotiCss}
                                >
                                    <Translation>
                                        {(t) => <>{t('main.earlier')}</>}
                                    </Translation>
                                </h4>

                                {
                                    orderUpdate.filter(fl => fl.notify === false).map(p => (
                                        <div key={p.id} className="border-bottom">
                                            <button
                                                className="btn text-dark shadow-none bg-transparent rounded-0 border-0 text-left w-100 py-2 px-3 btn-link-light"
                                                style={buttonLinkCss}
                                                onClick={() => {
                                                    this.closeNoti()
                                                    this.props.history.push(`/order/${p.uuid}`)
                                                }}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <span className="text-light bg-custom rounded-circle text-center" style={iconOrderCss}>
                                                        <TiBell />
                                                    </span>
                                                    <div className="flex-grow-1">
                                                        <div className="pl-3">
                                                            <p
                                                                className="mb-1 font-weight-normal text-secondary"
                                                                style={paraCss}
                                                            >
                                                                <strong className="text-dark">
                                                                    {p.checkout.contact.name}
                                                                </strong> လိပ်စာ နှင့် ကုန်ပစ္စည်း ({p.products.orderItems.length})မျိုး&nbsp;

                                                                {
                                                                    p.checkout.payment === "ပစ္စည်းရောက် ငွေရှင်းစနစ်" &&
                                                                    <>အော်ဒါ တင်ထားသည်</>
                                                                }

                                                                {
                                                                    p.checkout.payment === "MyKyat payment" &&
                                                                    <>ငွေပေးချေထားသည်</>
                                                                }
                                                            </p>
                                                            <h6 className="text-default font-weight-normal" style={smallDateCss}>
                                                                <Moment fromNow>
                                                                    {p.checkout.contact.dateRaw}
                                                                </Moment>
                                                            </h6>
                                                        </div>
                                                    </div>
                                                </div>

                                            </button>
                                        </div>
                                        )
                                    )
                                }
                            </div>
                        </>
                    )
                }
            </>

        return (
            <div
                className="position-fixed w-100"
                style={fixedCss}
                id="free-noti-open"
            >
                <div className="row mx-0 h-100">
                    <div
                        className="col-sm-5 col-md-6 col-lg-8 col-xl-9 d-none d-sm-flex px-0"
                        style={offBlockCss}
                        onClick={this.closeNoti}
                    />
                    <div className="col-sm-7 col-md-6 col-lg-4 col-xl-3 px-0 h-100 bg-white shadow-none">
                        <div className="d-flex align-items-center justify-content-between bg-default" style={top66Css}>
                            <button
                                className="btn rounded-0 border-0 bg-default p-0 text-white shadow-none link-default-hover"
                                style={headIconCss}
                                onClick={this.closeNoti}
                            >
                                <RiCloseLine />
                            </button>
                            <h4 className="mb-0 px-4 py-3 font-weight-normal flex-grow-1 text-center text-white" style={headTitleCss}>
                                <Translation>
                                    {(t) => <>{t('main.notifications')}</>}
                                </Translation>
                            </h4>
                        </div>

                        <div className="">
                            {lists}
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    orderUpdate: state.order
})

export default connect(mapStateToProps, {addOrder,removeOrder})(withRouter(FreeUserNoti))