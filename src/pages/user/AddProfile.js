import React, { Component } from 'react'
import { withRouter , Link } from 'react-router-dom'
import { auth , db } from '../../helpers/firebase'
import { Translation } from 'react-i18next'
import LeftSideBar from '../../components/user/LeftSideBar'
import { AGENTS } from '../../helpers/api'
import Name from '../../components/user/Name'
import Spinner from '../../components/layout/Spinner'


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

class AddProfile extends Component 
{
    _isMounted = false

    state = {
        user: auth.currentUser,
        agent: null,
        name: auth.currentUser.displayName,
        addressPhone: '',
        birthday_day: '',
        birthday_month: '',
        birthday_year: '',
        gender: '',
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
        if (telephone === '' || this.state.regexp.test(telephone)) {
            this.setState({ 
                [e.target.name]: telephone 
            })
        }
    }

    handleOnSubmit = e => {
        e.preventDefault()
        
        this._isMounted = true

        this.setState({
            loading: true
        })

        const date = generateDate()
        
        const newData = {
            name: this.state.name,
            id: this.state.user.uid,
            email: this.state.user.email,
            providerId: this.state.user.providerData[0].providerId,
            photoURL: this.state.user.photoURL,
            addressPhone: this.state.addressPhone,
            gender: this.state.gender,
            birthday_day: this.state.birthday_day,
            birthday_month: this.state.birthday_month,
            birthday_year: this.state.birthday_year,
            birthday: this.state.birthday_day + '.' + this.state.birthday_month + '.' + this.state.birthday_year,
            dateFormatted: date.formatted,
            datePretty: date.pretty,
            dateRaw: new Date().toISOString()
        }

        db
        .ref(AGENTS+`/${newData.id}`)
        .set(newData, () => {
            
            auth.currentUser.updateProfile({
                displayName: this.state.name
            })

            if(this._isMounted) {
                this.setState({
                    loading: this.props.location.state
                })
            }

            this.props.history.push('/personal-profile')
        })
    }

    getAgent = () => {
        this._isMounted = true

        db 
        .ref(AGENTS+`/${this.state.user.uid}`)
        .on('value' , snapshot => {
            let data = snapshot.val()

            if(this._isMounted) {
                this.setState({
                    agent: data,
                    addressPhone: data ? data.addressPhone : undefined,
                    gender: data ? data.gender : undefined,
                    birthday_day: data ? data.birthday_day : undefined,
                    birthday_month: data ? data.birthday_month : undefined,
                    birthday_year: data ? data.birthday_year : undefined
                })
            }
        })
    }

    componentDidMount() {
        this.getAgent()
        
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

    getDays = () => {
        var max = new Date().getDay()
        var days = []

        for(var i = max; i <= 31; i++) {
            days.push(i)
        }

        return days
    }

    getYears = () => {
        var max = new Date().getFullYear()
        var min = max - 80
        var years = []

        for(var i = max; i >= min; i--) {
            years.push(i)
        }

        return years
    }

    render() {

        const { name , addressPhone , birthday_day , birthday_month , birthday_year , gender } = this.state

        const headTitle = {
            fontSize: '0.75rem',
            lineHeight: '1.5'
        }

        const buttonCss = {
            lineHeight: '1.5',
            background: '#7f187f',
        }

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
                                        {(t) => <>{t('main.edit.profile')}</>}
                                    </Translation>
                                </h4>
                                
                                <div className="mb-3">
                                    <form
                                        onSubmit={this.handleOnSubmit.bind(this)}
                                        autoComplete="off"
                                    >
                                        <div className="row mx-n1 mb-3">
                                            <div className="px-1 col-12 col-md-6 col-lg-4 my-1">
                                                <div className="form-group mb-0 p-4 bg-white">
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
                                                                    onChange={this.handleOnChange.bind(this)}
                                                                    className="form-control shadow-none rounded-0 px-3 bg-transparent text-dark"
                                                                    style={{
                                                                        height: '40px'
                                                                    }}
                                                                />
                                                            </>
                                                        }
                                                    </Translation>                                    
                                                </div>
                                            </div>
                                            <div className="px-1 col-12 col-md-6 col-lg-4 my-1">
                                                <div className="form-group mb-0 p-4 bg-white">
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
                                                                    placeholder="09"
                                                                    onChange={this.handleOnPhoneChange.bind(this)}
                                                                    className="form-control shadow-none rounded-0 px-3 bg-transparent text-dark"
                                                                    style={{
                                                                        height: '40px'
                                                                    }}
                                                                />
                                                            </>
                                                        }
                                                    </Translation>                                    
                                                </div>
                                            </div>
                                            <div className="px-1 col-12 col-md-6 col-lg-4 my-1">
                                                <div className="form-group mb-0 p-4 bg-white">
                                                    <Translation>
                                                        {
                                                            (t) =>     
                                                            <>        
                                                                <label
                                                                    className="mb-2 text-default"
                                                                    htmlFor="gender"
                                                                    style={headTitle}
                                                                >
                                                                    {t('main.gender')}
                                                                </label>                               
                                                                <select
                                                                    name="gender"
                                                                    value={gender}
                                                                    onChange={this.handleOnChange.bind(this)}
                                                                    className="custom-select shadow-none rounded-0 px-3 bg-transparent text-dark"
                                                                    style={{
                                                                        height: '40px'
                                                                    }}
                                                                >
                                                                    <option value="none">{t('main.choose')}</option>
                                                                    <option value={t('main.male')}>{t('main.male')}</option>
                                                                    <option value={t('main.female')}>{t('main.female')}</option>
                                                                </select>
                                                            </>
                                                        }
                                                    </Translation>                                    
                                                </div>
                                            </div>
                                            <div className="px-1 col-12 col-lg-8 my-1">
                                                <div className="form-group mb-0 p-4 bg-white">
                                                    <label
                                                        className="mb-2 text-default"
                                                        htmlFor="birthday"
                                                        style={headTitle}
                                                    >
                                                        <Translation>
                                                            {(t) => <>{t('main.birthday')}</>}
                                                        </Translation>
                                                    </label> 
                                                    <div 
                                                        className="d-flex justify-content-between"
                                                        style={{
                                                            border: '1px solid #ddd'
                                                        }}
                                                    >
                                                        <div className="form-group w-100 mb-0">
                                                            <Translation>
                                                                {
                                                                    (t) =>                                            
                                                                    <select
                                                                        name="birthday_day"
                                                                        value={birthday_day}
                                                                        onChange={this.handleOnChange.bind(this)}
                                                                        className="custom-select shadow-none rounded-0 border-0 px-3 bg-transparent text-dark"
                                                                        style={{
                                                                            height: '40px',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                    >
                                                                        <option value="none">{t('main.birthday.day')}</option>
                                                                        {
                                                                            this.getDays().map((n,i) =>
                                                                                <option key={i} value={n}>{n}</option>
                                                                            )
                                                                        }
                                                                    </select>
                                                                }
                                                            </Translation>
                                                        </div>
                                                        <div className="form-group w-100 mb-0">
                                                            <Translation>
                                                                {
                                                                    (t) =>                                            
                                                                    <select
                                                                        name="birthday_month"
                                                                        value={birthday_month}
                                                                        onChange={this.handleOnChange.bind(this)}
                                                                        className="custom-select shadow-none rounded-0 px-3 bg-transparent text-dark"
                                                                        style={{
                                                                            height: '40px',
                                                                            border: '1px solid #ddd',
                                                                            borderTop: '0',
                                                                            borderBottom: '0',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                    >
                                                                        <option value="none">{t('main.birthday.month')}</option>
                                                                        <option value={t('main.jan')}>{t('main.jan')}</option>
                                                                        <option value={t('main.feb')}>{t('main.feb')}</option>
                                                                        <option value={t('main.mar')}>{t('main.mar')}</option>
                                                                        <option value={t('main.apr')}>{t('main.apr')}</option>
                                                                        <option value={t('main.may')}>{t('main.may')}</option>
                                                                        <option value={t('main.jun')}>{t('main.jun')}</option>
                                                                        <option value={t('main.jul')}>{t('main.jul')}</option>
                                                                        <option value={t('main.aug')}>{t('main.aug')}</option>
                                                                        <option value={t('main.sep')}>{t('main.sep')}</option>
                                                                        <option value={t('main.oct')}>{t('main.oct')}</option>
                                                                        <option value={t('main.nov')}>{t('main.nov')}</option>
                                                                        <option value={t('main.dec')}>{t('main.dec')}</option>
                                                                    </select>
                                                                }
                                                            </Translation> 
                                                        </div>
                                                        <div className="form-group w-100 mb-0">
                                                            <Translation>
                                                                {
                                                                    (t) =>                                            
                                                                    <select
                                                                        name="birthday_year"
                                                                        value={birthday_year}
                                                                        onChange={this.handleOnChange.bind(this)}
                                                                        className="custom-select shadow-none rounded-0 border-0 px-3 bg-transparent text-dark"
                                                                        style={{
                                                                            height: '40px',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                    >
                                                                        <option value="none">{t('main.birthday.year')}</option>
                                                                        {
                                                                            this.getYears().map((n,i) =>
                                                                                <option key={i} value={n}>{n}</option>
                                                                            )
                                                                        }
                                                                    </select>
                                                                }
                                                            </Translation> 
                                                        </div>
                                                    </div>                                                                        
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mx-n1">
                                            <div className="col-12 col-md-6 col-lg-4 px-1 mb-3 mb-md-0">
                                                <div className="form-group mb-0 h-100">  
                                                    <Link
                                                        className="d-inline-block h-100 text-decoration-none rounded-0 w-100 py-2 bg-secondary text-white text-center shadow-none btn-cart-hover"
                                                        style={buttonCss}
                                                        to="/personal-profile"
                                                    >
                                                        <Translation>
                                                            {(t) => <>{t('main.cancel')}</>}
                                                        </Translation>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6 col-lg-4 px-1">
                                                <div className="form-group mb-0">  
                                                    <button
                                                        type="submit"
                                                        className="btn rounded-0 w-100 py-2 text-white bg-default shadow-none btn-cart-hover"
                                                        style={buttonCss}
                                                    >
                                                        <Translation>
                                                            {(t) => <>{t('main.addressSave')}</>}
                                                        </Translation>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default withRouter(AddProfile)