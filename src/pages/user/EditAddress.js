import React, { Component } from 'react'
import { withRouter , Link } from 'react-router-dom'
import Name from '../../components/user/Name'
import LeftSideBar from '../../components/user/LeftSideBar'
import { Translation } from 'react-i18next'
import { auth , db } from '../../helpers/firebase'
import { AGENTS } from '../../helpers/api'
import Spinner from '../../components/layout/Spinner'

class EditAddress extends Component 
{
    _isMounted = false

    state = {
        user: auth.currentUser,
        name: '',
        addressPhone: '',
        email: '',
        home_no: '',
        street_quarter: '',
        township: '',
        regexp: /^[0-9\b]+$/,
        loading: this.props.location.state
    }

    handleOnChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleOnPhoneChange = e => {
        let telephone = e.target.value
        if(telephone === '' || this.state.regexp.test(telephone)) {
            this.setState({
                [e.target.name] : telephone
            })
        }
    }

    resetForm = () => {
        this.setState({
            name: '',
            email: '',
            addressPhone: '',
            home_no: '',
            street_quarter: '',
            township: ''
        })
    }

    handleOnSubmit = e => {
        e.preventDefault()

        this._isMounted = true

        this.setState({
            loading: true
        })
        
        const newData = {
            id: this.props.match.params.slug,
            name: this.state.name,
            email: this.state.email,
            addressPhone: this.state.addressPhone,
            home_no: this.state.home_no,
            street_quarter: this.state.street_quarter,
            township: this.state.township
        }

        db
        .ref(AGENTS+`/${this.state.user.uid}/addresses/${newData.id}`)
        .update(newData, () => {

            if(this._isMounted) {
                this.setState({
                    loading: this.props.location.state
                })
            }

            this.props.history.push('/addresses')
        })
    }

    getAddress = () => {
        const {slug} = this.props.match.params

        this._isMounted = true

        db 
        .ref(AGENTS+`/${this.state.user.uid}/addresses/${slug}`)
        .on('value' , snapshot => {
            let data = snapshot.val()

            if(this._isMounted) {
                this.setState({
                    name: data ? data.name : null,
                    email: data ? data.email : null,
                    addressPhone: data ? data.addressPhone : null,
                    home_no: data ? data.home_no : null,
                    street_quarter: data ? data.street_quarter : null,
                    township: data ? data.township : null
                })
            }
        })
    }

    componentDidMount() {
        this.getAddress()
        
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

    deleteAddress = () => {
        const {slug} = this.props.match.params

        db 
        .ref(AGENTS+`/${this.state.user.uid}/addresses/${slug}`)
        .remove()

        this.props.history.push('/addresses')
    }

    render() {

        const { name , addressPhone , email , home_no , street_quarter , township } = this.state

        const headTitle = {
            fontSize: '0.75rem',
            lineHeight: '1.5'
        }

        const buttonCss = {
            lineHeight: '1.5',
            fontSize: '0.9rem',
            background: '#7f187f',
            height: '40px'
        }

        const cancelBtnCss = {
            fontSize: '0.9rem',
            lineHeight: '40px',
            height: '40px'
        }

        const formList =
            <form
                onSubmit={this.handleOnSubmit.bind(this)}
                autoComplete="off"
            >
                <div className="row small-placeholder">
                    <div className="col-12 col-md-6 mb-3 mb-md-0">
                        <div className="form-group mb-4">
                            <Translation>
                                {
                                    (t) =>
                                    <>
                                        <label
                                            className="mb-2 text-default"
                                            htmlFor="name"
                                            style={headTitle}
                                        >
                                            {t('main.addressName')}
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={name}
                                            placeholder={'* ' + t('main.full.name')}
                                            onChange={this.handleOnChange.bind(this)}
                                            className="form-control shadow-none rounded-0 px-3 bg-transparent text-dark border"
                                            style={{
                                                height: '45px'
                                            }}
                                            required
                                        />
                                    </>
                                }
                            </Translation>                                    
                        </div>
                        <div className="form-group mb-4">
                            <Translation>
                                {
                                    (t) =>
                                    <>
                                        <label
                                            className="mb-2 text-default"
                                            htmlFor="addressPhone"
                                            style={headTitle}
                                        >
                                            {t('main.addressPhone')}
                                        </label>
                                        <input
                                            type="tel"
                                            name="addressPhone"
                                            value={addressPhone}
                                            placeholder={'* ' + t('main.add.addressphone')}
                                            onChange={this.handleOnPhoneChange.bind(this)}
                                            className="form-control shadow-none rounded-0 px-3 bg-transparent text-dark border"
                                            style={{
                                                height: '45px'
                                            }}
                                            required
                                        />
                                    </>
                                }
                            </Translation>                                    
                        </div>
                        <div className="form-group mb-2">
                            <Translation>
                                {
                                    (t) =>
                                    <>
                                        <label
                                            className="mb-2 text-default"
                                            htmlFor="email"
                                            style={headTitle}
                                        >
                                            {t('main.addressEmail')}
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={email}
                                            placeholder={t('main.add.email')}
                                            onChange={this.handleOnChange.bind(this)}
                                            className="form-control shadow-none rounded-0 px-3 bg-transparent text-dark border"
                                            style={{
                                                height: '45px'
                                            }}
                                        />
                                    </>
                                }
                            </Translation>                                    
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group mb-4">
                            <Translation>
                                {
                                    (t) =>
                                    <>
                                        <label
                                            className="mb-2 text-default"
                                            htmlFor="home_no"
                                            style={headTitle}
                                        >
                                            {t('main.home.no')}
                                        </label>
                                        <input
                                            type="text"
                                            name="home_no"
                                            value={home_no}
                                            placeholder={t('main.add.home.no')}
                                            onChange={this.handleOnChange.bind(this)}
                                            className="form-control shadow-none rounded-0 px-3 bg-transparent text-dark border"
                                            style={{
                                                height: '45px'
                                            }}
                                        />
                                    </>
                                }
                            </Translation>                                    
                        </div>
                        <div className="form-group mb-4">
                            <Translation>
                                {
                                    (t) =>
                                    <>
                                        <label
                                            className="mb-2 text-default"
                                            htmlFor="street_quarter"
                                            style={headTitle}
                                        >
                                            {t('main.street.quarter')}
                                        </label>
                                        <input
                                            type="text"
                                            name="street_quarter"
                                            value={street_quarter}
                                            placeholder={t('main.add.street.quarter')}
                                            onChange={this.handleOnChange.bind(this)}
                                            className="form-control shadow-none rounded-0 px-3 bg-transparent text-dark border"
                                            style={{
                                                height: '45px'
                                            }}
                                        />
                                    </>
                                }
                            </Translation>                                    
                        </div>
                        <div className="form-group mb-2">
                            <Translation>
                                {
                                    (t) =>
                                    <>
                                        <label
                                            className="mb-2 text-default"
                                            htmlFor="township"
                                            style={headTitle}
                                        >
                                            {t('main.township')}
                                        </label>
                                        <input
                                            type="text"
                                            name="township"
                                            value={township}
                                            placeholder={t('main.add.township')}
                                            onChange={this.handleOnChange.bind(this)}
                                            className="form-control shadow-none rounded-0 px-3 bg-transparent text-dark border"
                                            style={{
                                                height: '45px'
                                            }}
                                        />
                                    </>
                                }
                            </Translation>                                    
                        </div>
                    </div>               
                    <div className="col-12 col-md-4">
                        <div className="form-group mb-0 mt-4">  
                            <button
                                type="submit"
                                className="btn rounded-0 w-100 text-white bg-default shadow-none btn-cart-hover"
                                style={buttonCss}
                            >
                                <Translation>
                                    {(t) => <>{t('main.addressSave')}</>}
                                </Translation>
                            </button>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="form-group mb-0 mt-4">  
                            <Link
                                className="d-inline-block text-center text-decoration-none w-100 text-white bg-secondary btn-cart-hover"
                                style={cancelBtnCss}
                                to="/addresses"
                            >
                                <Translation>
                                    {(t) => <>{t('main.cancel')}</>}
                                </Translation>
                            </Link>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="form-group mb-0 mt-4">  
                            <button
                                className="w-100 text-white bg-danger rounded-0 border-0 shadow-none btn-cart-hover"
                                style={cancelBtnCss}
                                onClick={this.deleteAddress}
                            >
                                <Translation>
                                    {(t) => <>{t('main.addressDelete')}</>}
                                </Translation>
                            </button>
                        </div>
                    </div>
                </div>
            </form>

        return (
            <>
                <Name />

                {this.state.loading === true ? <Spinner /> : null}

                <div className="py-5 bg-light-custom">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-sm-5 col-lg-3 mb-4 mb-sm-0">
                                <LeftSideBar />
                            </div>
                            <div className="col-12 col-sm-7 col-lg-9">
                                <h4
                                    className="font-weight-normal mb-3 text-custom"
                                    style={{
                                        fontSize: '1.1rem',
                                        lineHeight: '1.5'
                                    }}
                                >
                                    <Translation>
                                        {(t) => <>{t('main.edit.address')}</>}
                                    </Translation>
                                </h4>

                                <div className="bg-white p-4 shadow-sm rounded-sm">
                                    {formList}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default withRouter(EditAddress)
