import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import MenuButton from './MenuButton'
import CartIcon from './CartIcon'
import { RiSearchLine, RiUser3Line, RiLogoutBoxLine, RiUserSettingsLine, RiShoppingBag3Line } from 'react-icons/ri'
import { Translation } from 'react-i18next'
import { auth , db } from '../../helpers/firebase'
import { FaUserCircle, FaRegUserCircle } from 'react-icons/fa'
import { signout } from '../../helpers/auth'
import { agentRemoveContact } from '../../store/agentContact/actions'
import { FaBell } from 'react-icons/fa'
import { ORDERURL } from '../../helpers/api'


class MenuBar extends Component {
    _isMounted = false

    static propTypes = {
        agentRemoveContact: PropTypes.func.isRequired
    }

    state = {
        productName: '',
        user: auth.currentUser,
        userOrders: []
    }

    getUserOrders = () => {
        this._isMounted = true

        db
            .ref(ORDERURL)
            .on('value', snapshot => {
                let lists = []
                snapshot.forEach(snap => {
                    lists.push(snap.val())
                })

                const data = lists.reverse()

                if (this._isMounted) {
                    this.setState({
                        userOrders: data.filter(f => f.agent_id === (this.state.user ? this.state.user.providerData[0].uid : null))
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

        this.getUserOrders()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleSignOut = () => {
        this.props.agentRemoveContact()
        signout()
        this.setState({
            user: null
        })
    }

    handleSearchInput = e => {
        this.setState({
            productName: e.target.value
        })
    }

    handleSearchSubmit = () => {
        if (this.state.productName) {
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
        }
    }

    handleSearchKeyUp = e => {
        e.preventDefault()

        if (e.key === 'Enter' && e.keyCode === 13) {
            this.handleSearchSubmit()
        }

        document.getElementById('latest-product-wrapper').style.visibility = 'visible'
        document.getElementById('latest-product-wrapper').style.top = '66px'
        document.getElementById('latest-product-wrapper').style.bottom = '0px'
    }

    handleFormSubmit = e => e.preventDefault()

    changeLanguage = code => e => {
        localStorage.setItem('language', code);
        window.location.reload(false);
    }

    showSearch = () => {
        document.getElementById('searchID').style.top = '0%'
        document.getElementById('searchID').style.bottom = '0%'
        document.getElementById('searchID').style.left = '0%'
        document.getElementById('searchID').style.right = '0%'
        document.getElementById('searchID').style.zIndex = '9999999999'
        document.getElementById('searchID').style.opacity = '1'
        document.getElementById('searchID').style.transition = '0.5s ease-in-out'
    }

    showProductOnBar = () => {
        document.getElementById('latest-product-wrapper').style.visibility = 'visible'
        document.getElementById('latest-product-wrapper').style.top = '66px'
        document.getElementById('latest-product-wrapper').style.bottom = '0px'
    }

    closeProductOnBar = () => {
        document.getElementById('latest-product-wrapper').style.visibility = 'hidden'
        document.getElementById('latest-product-wrapper').style.top = '-1000%'
        document.getElementById('latest-product-wrapper').style.bottom = 'auto'
    }

    showTopBarBG = () => {
        document.getElementById('top-bar-click').style.visibility = 'visible'
        document.getElementById('top-bar-click').style.opacity = '1'
    }

    closeTopBarBG = () => {
        document.getElementById('top-bar-click').style.visibility = 'hidden'
        document.getElementById('top-bar-click').style.opacity = '0'
    }

    openNoti = () => {
        document.getElementById('free-noti-open').style.right = '0%'
        document.getElementById('free-noti-open').style.transition = 'right 0.3s ease-in-out'
    }

    openUserNoti = () => {
        document.getElementById('agent-noti-open').style.right = '0%'
        document.getElementById('agent-noti-open').style.transition = 'right 0.3s ease-in-out'
    }

    render() {

        const agentAccount =
            <>
                {
                    this.state.user === null ? (
                        <div
                            className="align-self-center pl-1"
                        >
                            <div className="dropdown position-relative drop-center">
                                <button
                                    className="btn btn-transparent dropdown-toggle text-light link-default-hover p-0 shadow-none rounded-0 border-0"
                                    type="button"
                                    id="dropdownMenuButton"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                    data-offset="0,7"
                                    style={{
                                        fontSize: '24px',
                                    }}
                                    onFocus={this.showTopBarBG}
                                    onBlur={this.closeTopBarBG}
                                >
                                    <div
                                        className="mx-auto align-self-center justify-content-center align-items-center mb-0 d-flex flex-column text-light"
                                        style={{
                                            fontSize: '20px',
                                            height: '48px'
                                        }}
                                    >
                                        <RiUser3Line />
                                        <small
                                            style={{
                                                fontSize: '10px',
                                                lineHeight: '1.6',
                                                width: '45px'
                                            }}
                                            className="text-white font-weight-normal text-center"
                                        >
                                            <Translation>
                                                {(t) => <>{t('main.agent')}</>}
                                            </Translation>
                                        </small>
                                    </div>
                                </button>
                                <div
                                    className="dropdown-menu dropdown-menu-right mr-n5 rounded-lg shadow rounded-0 border-0 px-3 py-2 flex-column"
                                    aria-labelledby="dropdownMenuButton"
                                    style={{
                                        borderRadius: '0px',
                                        minWidth: 'max-content',
                                        background: '#0f4c82'
                                    }}
                                >
                                    <Link
                                        to="/register"
                                        className="text-decoration-none text-white p-0 link-default-hover font-weight-normal"
                                        style={{
                                            fontSize: '14px',
                                            lineHeight: '2'
                                        }}
                                    >
                                        <FaRegUserCircle />
                                        <span className="ml-1">
                                            <Translation>
                                                {(t) => <>{t('main.register')}</>}
                                            </Translation>
                                        </span>
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="text-decoration-none text-white p-0 link-default-hover font-weight-normal"
                                        style={{
                                            fontSize: '14px',
                                            lineHeight: '2'
                                        }}
                                    >
                                        <FaUserCircle />
                                        <span className="ml-1">
                                            <Translation>
                                                {(t) => <>{t('main.signin')}</>}
                                            </Translation>
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                            <div
                                className="align-self-center pl-1"
                            >
                                <div className="dropdown position-relative drop-center">
                                    <button
                                        className="btn btn-transparent dropdown-toggle text-light link-default-hover p-0 shadow-none rounded-0 border-0"
                                        type="button"
                                        id="dropdownMenuButton"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        data-offset="0,7"
                                        style={{
                                            fontSize: '24px',
                                        }}
                                        onFocus={this.showTopBarBG}
                                        onBlur={this.closeTopBarBG}
                                    >
                                        {
                                            this.state.user === null ?
                                                <div
                                                    className="mx-auto align-self-center justify-content-center align-items-center mb-0 d-flex flex-column text-light"
                                                    style={{
                                                        fontSize: '20px',
                                                        height: '48px'
                                                    }}
                                                >
                                                    <FaUserCircle />
                                                    <small
                                                        style={{
                                                            fontSize: '10px',
                                                            lineHeight: '1.6',
                                                            width: '45px'
                                                        }}
                                                        className="text-white font-weight-normal text-center"
                                                    >
                                                        <Translation>
                                                            {(t) => <>{t('main.account')}</>}
                                                        </Translation>
                                                    </small>
                                                </div>
                                                :
                                                <>
                                                    {
                                                        this.state.user.providerData[0].providerId === "google.com" ||
                                                            this.state.user.providerData[0].providerId === "facebook.com" ?
                                                            <div
                                                                className="mx-auto align-self-center justify-content-center align-items-center mb-0 d-flex flex-column text-light"
                                                                style={{
                                                                    fontSize: '20px',
                                                                    height: '48px'
                                                                }}
                                                            >
                                                                <img
                                                                    src={this.state.user.photoURL}
                                                                    alt={this.state.user.displayName}
                                                                    className="rounded-circle"
                                                                    style={{
                                                                        width: '20px',
                                                                        height: '20px'
                                                                    }}
                                                                />
                                                                <small
                                                                    style={{
                                                                        fontSize: '10px',
                                                                        lineHeight: '1.6',
                                                                        width: '45px'
                                                                    }}
                                                                    className="text-white font-weight-normal text-center overflow-hidden"
                                                                >
                                                                    {this.state.user.displayName}
                                                                </small>
                                                            </div>
                                                            :
                                                            <div
                                                                className="mx-auto align-self-center justify-content-center align-items-center mb-0 d-flex flex-column text-light"
                                                                style={{
                                                                    fontSize: '20px',
                                                                    height: '48px'
                                                                }}
                                                            >
                                                                <FaUserCircle />
                                                                <small
                                                                    style={{
                                                                        fontSize: '10px',
                                                                        lineHeight: '1.6',
                                                                        width: '45px'
                                                                    }}
                                                                    className="text-white font-weight-normal text-center overflow-hidden"
                                                                >
                                                                    {this.state.user.displayName}
                                                                </small>
                                                            </div>
                                                    }
                                                </>
                                        }

                                    </button>
                                    <div
                                        className="dropdown-menu dropdown-menu-right mr-n5 border-0 rounded-0 shadow px-3 py-2 flex-column"
                                        aria-labelledby="dropdownMenuButton"
                                        style={{
                                            background: '#0f4c82'
                                        }}
                                    >
                                        <Link
                                            to="/manage-account"
                                            className="text-decoration-none text-white p-0 link-default-hover font-weight-normal"
                                            style={{
                                                fontSize: '14px',
                                                lineHeight: '2'
                                            }}
                                        >
                                            <RiUserSettingsLine />
                                            <span className="ml-1">
                                                <Translation>
                                                    {(t) => <>{t('main.manage.account')}</>}
                                                </Translation>
                                            </span>
                                        </Link>
                                        <Link
                                            to="/order-lists"
                                            className="text-decoration-none text-white p-0 link-default-hover font-weight-normal"
                                            style={{
                                                fontSize: '14px',
                                                lineHeight: '2'
                                            }}
                                        >
                                            <RiShoppingBag3Line />
                                            <span className="ml-1">
                                                <Translation>
                                                    {(t) => <>{t('main.orders')}</>}
                                                </Translation>
                                            </span>
                                        </Link>
                                        <button
                                            onClick={this.handleSignOut.bind(this)}
                                            className="btn text-white p-0 link-default-hover font-weight-normal shadow-none border-0 text-left"
                                            style={{
                                                fontSize: '14px',
                                                lineHeight: '2'
                                            }}
                                        >
                                            <RiLogoutBoxLine />
                                            <span className="ml-1">
                                                <Translation>
                                                    {(t) => <>{t('main.logout')}</>}
                                                </Translation>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                }
            </>

        const notification = 
            <>  
                {
                    this.state.user !== null &&
                    <>
                        {
                            this.state.userOrders.length <= 0 ? null : (
                                <>
                                    {
                                        this.state.userOrders.find(f => f.notify === true) ? (
                                            <div
                                                className="align-self-center"
                                            >
                                                <button
                                                    className="btn btn-transparent text-light link-default-hover p-0 shadow-none rounded-0 border-0"
                                                    type="button"
                                                    style={{
                                                        fontSize: '24px',
                                                    }}
                                                    onClick={this.openUserNoti}
                                                >
                                                    <div
                                                        className="mx-auto align-self-center justify-content-center align-items-center mb-0 d-flex flex-column text-light position-relative"
                                                        style={{
                                                            fontSize: '20px',
                                                            height: '48px'
                                                        }}
                                                    >
                                                        <FaBell />
                                                        <small
                                                            style={{
                                                                fontSize: '10px',
                                                                lineHeight: '1.6',
                                                                width: '45px'
                                                            }}
                                                            className="text-white font-weight-normal text-center overflow-hidden"
                                                        >
                                                            <Translation>
                                                                {(t) => <>{t('main.notifications')}</>}
                                                            </Translation>
                                                        </small>

                                                        <span
                                                            style={{
                                                                fontSize: '8px',
                                                                color: '#000',
                                                                right: '0',
                                                                top: '-2px',
                                                                lineHeight: '20px',
                                                                display: 'inline-block',
                                                                zIndex: '9999',
                                                                height: '20px',
                                                                width: '20px'
                                                            }}
                                                            className="font-weight-bold position-absolute rounded-circle bg-custom text-white"
                                                        >
                                                            <span
                                                                className="d-inline-block"
                                                            >
                                                                {this.state.userOrders.filter(f => f.notify === true).length}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                className="align-self-center"
                                            >
                                                <button
                                                    className="btn btn-transparent text-light link-default-hover p-0 shadow-none rounded-0 border-0"
                                                    type="button"
                                                    style={{
                                                        fontSize: '24px',
                                                    }}
                                                    onClick={this.openUserNoti}
                                                >
                                                    <div
                                                        className="mx-auto align-self-center justify-content-center align-items-center mb-0 d-flex flex-column text-light position-relative"
                                                        style={{
                                                            fontSize: '20px',
                                                            height: '48px'
                                                        }}
                                                    >
                                                        <FaBell />
                                                        <small
                                                            style={{
                                                                fontSize: '10px',
                                                                lineHeight: '1.6',
                                                                width: '45px'
                                                            }}
                                                            className="text-white font-weight-normal text-center overflow-hidden"
                                                        >
                                                            <Translation>
                                                                {(t) => <>{t('main.notifications')}</>}
                                                            </Translation>
                                                        </small>
                                                    </div>
                                                </button>
                                            </div>
                                        )
                                    }
                                </>
                            )
                        }
                    </>
                }
            </>

        const freeNotification = 
            <>
                {
                    this.props.orders.length <= 0 ? null : (
                        <>
                            {
                                this.props.orders.find(f => f.notify === true) ? (
                                    <div
                                        className="align-self-center"
                                    >
                                        <button
                                            className="btn btn-transparent text-light link-default-hover p-0 shadow-none rounded-0 border-0"
                                            type="button"
                                            style={{
                                                fontSize: '24px',
                                            }}
                                            onClick={this.openNoti}
                                        >
                                            <div
                                                className="mx-auto align-self-center justify-content-center align-items-center mb-0 d-flex flex-column text-light position-relative"
                                                style={{
                                                    fontSize: '20px',
                                                    height: '48px'
                                                }}
                                            >
                                                <FaBell />
                                                <small
                                                    style={{
                                                        fontSize: '10px',
                                                        lineHeight: '1.6',
                                                        width: '45px'
                                                    }}
                                                    className="text-white font-weight-normal text-center overflow-hidden"
                                                >
                                                    <Translation>
                                                        {(t) => <>{t('main.notifications')}</>}
                                                    </Translation>
                                                </small>

                                                <span
                                                    style={{
                                                        fontSize: '8px',
                                                        color: '#000',
                                                        right: '0',
                                                        top: '-2px',
                                                        lineHeight: '20px',
                                                        display: 'inline-block',
                                                        zIndex: '9999',
                                                        height: '20px',
                                                        width: '20px'
                                                    }}
                                                    className="font-weight-bold position-absolute rounded-circle bg-custom text-white"
                                                >
                                                    <span
                                                        className="d-inline-block"
                                                    >
                                                        {this.props.orders.filter(f => f.notify === true).length}
                                                    </span>
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className="align-self-center"
                                    >
                                        <button
                                            className="btn btn-transparent text-light link-default-hover p-0 shadow-none rounded-0 border-0"
                                            type="button"
                                            style={{
                                                fontSize: '24px',
                                            }}
                                            onClick={this.openNoti}
                                        >
                                            <div
                                                className="mx-auto align-self-center justify-content-center align-items-center mb-0 d-flex flex-column text-light position-relative"
                                                style={{
                                                    fontSize: '20px',
                                                    height: '48px'
                                                }}
                                            >
                                                <FaBell />
                                                <small
                                                    style={{
                                                        fontSize: '10px',
                                                        lineHeight: '1.6',
                                                        width: '45px'
                                                    }}
                                                    className="text-white font-weight-normal text-center overflow-hidden"
                                                >
                                                    <Translation>
                                                        {(t) => <>{t('main.notifications')}</>}
                                                    </Translation>
                                                </small>
                                            </div>
                                        </button>
                                    </div>
                                )
                            }
                        </>
                    )
                }
            </>

        return (
            <div
                className="py-2 af-sticky"
                style={{
                    height: '66px',
                    background: 'transparent',
                }}
            >
                <div className="container">
                    <div className="d-flex justify-content-between">
                        <div
                            className="align-self-center d-flex mr-0 pr-0 mr-lg-5 pr-lg-5"
                        >
                            <MenuButton />
                            <Link
                                to="/"
                                className="text-decoration-none logo-title d-none d-sm-block"
                                style={{
                                    fontSize: '25px'
                                }}
                            >
                                <span
                                    style={{
                                        color: '#fe9902',
                                        fontFamily: "'Roboto', sans-serif",
                                        fontWeight: '900',
                                        letterSpacing: '-1.5px',
                                        lineHeight: '2',
                                        display: 'inline-block'
                                    }}
                                >BAGAN</span>&nbsp;
                                <span
                                    style={{
                                        color: '#fff',
                                        lineHeight: '2',
                                        display: 'inline-block',
                                        fontFamily: "'Roboto', sans-serif",
                                        fontWeight: '900',
                                        letterSpacing: '-1.5px',
                                    }}
                                >STORE</span>
                            </Link>
                        </div>
                        <div
                            className="align-self-center flex-grow-1 d-none d-md-flex ml-0 ml-md-5 mr-0 mr-md-2"
                        >
                            <form
                                onSubmit={this.handleFormSubmit}
                                className="w-100 d-none d-sm-flex position-relative"
                                id="search-form"
                            >
                                <Translation>
                                    {
                                        (t) =>
                                            <input
                                                className="form-control font-weight-normal change-input-placeholder border-0 text-dark shadow-none px-3 py-1"
                                                style={{
                                                    height: '42px',
                                                    lineHeight: '2',
                                                    borderRadius: '0',
                                                    borderTopLeftRadius: '2px',
                                                    borderBottomLeftRadius: '2px',
                                                    background: '#f8f9fa'
                                                }}
                                                type="text"
                                                placeholder={t('main.search.placeholder')}
                                                value={this.state.productName}
                                                onChange={this.handleSearchInput}
                                                onKeyUp={this.handleSearchKeyUp}
                                                onFocus={() => {
                                                    this.showProductOnBar()
                                                    this.showTopBarBG()
                                                }}
                                                onBlur={this.closeTopBarBG}
                                            />
                                    }
                                </Translation>
                                <button
                                    className="btn shadow-none pl-2 py-0 pr-0 text-secondary text-left"
                                    style={{
                                        fontSize: '16px',
                                        width: '50px',
                                        height: '42px',
                                        lineHeight: '0',
                                        border: '0',
                                        borderRadius: '0',
                                        borderTopRightRadius: '2px',
                                        borderBottomRightRadius: '2px',
                                        background: '#f8f9fa'
                                    }}
                                    onClick={this.handleSearchSubmit}
                                >
                                    <RiSearchLine />
                                </button>
                            </form>
                        </div>
                        <div
                            className="align-self-center d-flex"
                        >
                            <div
                                className="mx-auto align-self-center justify-content-center align-items-center mb-0 d-md-none d-flex flex-column text-light"
                                style={{
                                    fontSize: '20px',
                                    height: '48px'
                                }}
                                onClick={this.showSearch}
                            >
                                <RiSearchLine />
                                <small
                                    style={{
                                        fontSize: '10px',
                                        lineHeight: '1.6',
                                        width: '45px',
                                        cursor: 'pointer'
                                    }}
                                    className="text-white font-weight-normal text-center"
                                >
                                    <Translation>
                                        {(t) => <>{t('main.search.placeholder')}</>}
                                    </Translation>
                                </small>
                            </div>

                            {freeNotification}

                            {notification}

                            {agentAccount}

                            <CartIcon />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    orders: state.order
})

export default connect(mapStateToProps, { agentRemoveContact })(withRouter(MenuBar))