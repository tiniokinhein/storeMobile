import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Translation } from 'react-i18next'
import { GrClose } from 'react-icons/gr'
import 'react-phone-number-input/style.css'
import { nanoid } from 'nanoid'
import { auth , db } from '../../../helpers/firebase'
import { AGENTS } from '../../../helpers/api'



const generateDate = () => {

    const now = new Date()

    const options = {
        day: "numeric",
        month: "long",
        year: "numeric"

    }

    const year = now.getFullYear()

    let month = now.getMonth() + 1
    if(month < 10) {
        month = `0${month}`
    }

    let day = now.getDate()
    if(day < 10) {
        day = `0${day}`
    }

    const hour = now.getHours()

    const minute = now.getMinutes()

    return {
        formatted: `${year}-${month}-${day}-${hour}-${minute}`,
        pretty: now.toLocaleDateString("en-US" , options)
    }
}

class AddContactPopUp extends Component 
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
        regexp: /^[0-9\b]+$/
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

        const date = generateDate()

        const sID = nanoid(10)
        
        const newData = {
            id: sID,
            name: this.state.name,
            email: this.state.email,
            addressPhone: this.state.addressPhone,
            home_no: this.state.home_no,
            street_quarter: this.state.street_quarter,
            township: this.state.township,
            dateFormatted: date.formatted,
            datePretty: date.pretty,
            dateRaw: Date(Date.now()).toString()
        }

        db
        .ref(AGENTS+`/${this.state.user.uid}/addresses/${newData.id}`)
        .set(newData, () => {
            this.closeContact()
            this.resetForm()
        })
    }

    closeContact = () => {
        document.getElementById('agent_create_contact').style.left = '-100%'
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

        return (
            <div 
                id="agent_create_contact"
                className="position-fixed"
                style={{
                    left: '-100%',
                    top: '0',
                    bottom: '0',
                    width: '100%',
                    zIndex: '9999999999',
                    transition: 'left 0.3s cubic-bezier(0.6, 0.04, 0.8, 0.43)'
                }}
            >
                <div className="row h-100 mx-0">
                    <div
                        className="col-12 col-md-6 col-lg-4 bg-white shadow-none overlay-y-flow h-100 p-5 position-relative"
                        style={{
                            overflowY: 'scroll'
                        }}
                    >
                        <div 
                            className="position-absolute"
                            style={{
                                right: '9px',
                                top: '5px'
                            }}
                        >
                            <button
                                className="btn btn-transparent p-0 rounded-0 border-0 shadow-none text-center"
                                style={{
                                    fontSize: '1.6rem',
                                    width: '40px',
                                    height: '40px',
                                    lineHeight: '0',
                                    color: '#000'
                                }}
                                onClick={() => {
                                    this.closeContact()
                                    this.resetForm()
                                }}
                            >
                                <GrClose />
                            </button>
                        </div>

                        <div className="mb-4">
                            <h4
                                className="font-weight-normal mb-0"
                                style={{
                                    fontSize: '1.25rem',
                                    lineHeight: '1.5',
                                    color: '#000'
                                }}
                            >
                                <Translation>
                                    {(t) => <>{t('main.add.new.address')}</>}
                                </Translation>
                            </h4>
                        </div>                    

                        <div 
                            className="pt-1"
                        >
                            <div className="form-group mb-4">
                                <Translation>
                                    {
                                        (t) => 
                                            <input
                                                type="tel"
                                                name="addressPhone"
                                                value={this.state.addressPhone}
                                                onChange={this.handleOnPhoneChange.bind(this)}
                                                className="form-control bg-transparent shadow-sm px-3"
                                                placeholder={'* ' + t('main.addressPhone')}
                                                style={{
                                                    height: '45px',
                                                    border: '2px solid #000',
                                                    color: '#000',
                                                    borderRadius: '2px',
                                                    fontSize: '0.85rem'
                                                }}
                                                required
                                            />
                                    }
                                </Translation>                                
                            </div>
                            <div className="form-group mb-4">
                                <Translation>
                                    {
                                        (t) => 
                                            <input
                                                type="text"
                                                name="name"
                                                value={this.state.name}
                                                onChange={this.handleOnChange.bind(this)}
                                                className="form-control bg-transparent shadow-sm px-3"
                                                style={{
                                                    height: '45px',
                                                    border: '2px solid #000',
                                                    color: '#000',
                                                    borderRadius: '2px',
                                                    fontSize: '0.85rem'
                                                }}
                                                placeholder={'* ' + t('main.addressName')}
                                                required
                                            />
                                    }
                                </Translation>                                
                            </div>
                            <div className="form-group mb-4">
                                <Translation>
                                    {
                                        (t) => 
                                            <input
                                                type="email"
                                                name="email"
                                                value={this.state.email}
                                                onChange={this.handleOnChange.bind(this)}
                                                className="form-control bg-transparent shadow-sm px-3"
                                                style={{
                                                    height: '45px',
                                                    border: '2px solid #000',
                                                    color: '#000',
                                                    borderRadius: '2px',
                                                    fontSize: '0.85rem'
                                                }}
                                                placeholder={t('main.addressEmail')}
                                            />
                                    }
                                </Translation>                                
                            </div>                            
                            <div className="form-group mb-4">
                                <Translation>
                                    {
                                        (t) => 
                                            <input
                                                type="text"
                                                name="home_no"
                                                value={this.state.home_no}
                                                onChange={this.handleOnChange.bind(this)}
                                                className="form-control bg-transparent shadow-sm px-3"
                                                style={{
                                                    height: '45px',
                                                    border: '2px solid #000',
                                                    color: '#000',
                                                    borderRadius: '2px',
                                                    fontSize: '0.85rem'
                                                }}
                                                placeholder={'* ' + t('main.home.no')}
                                                required
                                            />
                                    }
                                </Translation>
                            </div>
                            <div className="form-group mb-4">
                                <Translation>
                                    {
                                        (t) => 
                                            <input
                                                type="text"
                                                name="street_quarter"
                                                value={this.state.street_quarter}
                                                onChange={this.handleOnChange.bind(this)}
                                                className="form-control bg-transparent shadow-sm px-3"
                                                style={{
                                                    height: '45px',
                                                    border: '2px solid #000',
                                                    color: '#000',
                                                    borderRadius: '2px',
                                                    fontSize: '0.85rem'
                                                }}
                                                placeholder={'* ' + t('main.street.quarter')}
                                                required
                                            />
                                    }
                                </Translation>
                            </div>
                            <div className="form-group mb-4">
                                <Translation>
                                    {
                                        (t) => 
                                            <input
                                                type="text"
                                                name="township"
                                                value={this.state.township}
                                                onChange={this.handleOnChange.bind(this)}
                                                className="form-control bg-transparent shadow-sm px-3"
                                                style={{
                                                    height: '45px',
                                                    border: '2px solid #000',
                                                    color: '#000',
                                                    borderRadius: '2px',
                                                    fontSize: '0.85rem'
                                                }}
                                                placeholder={'* ' + t('main.township')}
                                                required
                                            />
                                    }
                                </Translation>
                            </div>
                            <div className="form-group mb-0">
                                {
                                    !this.state.addressPhone ||
                                    !this.state.name ||
                                    !this.state.home_no ||
                                    !this.state.street_quarter ||
                                    !this.state.township ? (
                                        <button
                                            className="btn w-100 shadow-sm border-0 text-light py-2"
                                            style={{
                                                background: '#000',
                                                lineHeight: '2',
                                                fontSize: '1rem',
                                                borderRadius: '2px'
                                            }}
                                            disabled
                                        >
                                            <Translation>
                                                {(t) => <>{t('main.addressSave')}</>}
                                            </Translation>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={this.handleOnSubmit.bind(this)}
                                            className="btn bg-default w-100 shadow-sm border-0 text-light py-2 btn-cart-hover"
                                            style={{
                                                background: '#000',
                                                lineHeight: '2',
                                                fontSize: '1rem',
                                                borderRadius: '2px'
                                            }}
                                        >
                                            <Translation>
                                                {(t) => <>{t('main.addressSave')}</>}
                                            </Translation>
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <div 
                        className="col-12 col-md-6 col-lg-8 d-none d-sm-flex h-100 px-0"
                        style={{
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            this.resetForm()
                            this.closeContact()
                        }}
                    />
                </div>
            </div>
        )
    }
}

export default withRouter(AddContactPopUp)