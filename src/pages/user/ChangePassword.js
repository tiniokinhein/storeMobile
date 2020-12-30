import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { auth , custom_firebase } from '../../helpers/firebase'
import { Translation } from 'react-i18next'
import Name from '../../components/user/Name'
import LeftSideBar from '../../components/user/LeftSideBar'
import Spinner from '../../components/layout/Spinner'

class ChangePassword extends Component 
{
    state = {
        user: auth.currentUser,
        currentPassword: '',
        newPassword_1: '',
        newPassword: '',
        error: null,
        loading: this.props.location.state,
        status: false
    }

    componentDidMount() {
        window.scrollTo(0,0)
    }

    handleChange = e => {
        this.setState({
            [e.target.name] : e.target.value,
            error: null
        })
    }

    resetForm = () => {
        this.setState({
            currentPassword: '',
            newPassword_1: '',
            newPassword: '',
            error: null,
            loading: this.props.location.state
        })
    }

    reauthenticate = (currentPassword) => {
        var user = auth.currentUser
        var cred = custom_firebase.EmailAuthProvider.credential(user.email, currentPassword)
        return user.reauthenticateWithCredential(cred)
    }

    changePassword = e => {  
        e.preventDefault()

        this.setState({
            loading: true
        })

        if(this.state.newPassword_1 === this.state.newPassword) {
            this.reauthenticate(this.state.currentPassword)
            .then(() => {
                var user = auth.currentUser
                user
                .updatePassword(this.state.newPassword)
                .then(() => {
                    console.log("Password updated!")
                    this.resetForm()
                    this.setState({
                        status: true
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
            })
            .catch((error) => {
                console.log(error)
            })
        } else {
            this.setState({
                error: "Not match",
                newPassword: '',
                loading: this.props.location.state,
                status: false
            })
        }
    }

    render() {

        const headTitle = {
            fontSize: '0.75rem',
            lineHeight: '1.5'
        }

        const buttonCss = {
            lineHeight: '1.5',
            fontSize: '0.9rem',
            background: '#003457',
        }

        const matchPassword = () => {
            if(this.state.newPassword_1 === this.state.newPassword) {
                return  <small className="text-success pt-2 d-inline-block" style={{fontSize:'10px'}}>
                            <Translation>
                                {(t) => <>{t('main.password.match')}</>}
                            </Translation>
                        </small>
            } else {
                return  <small className="text-danger pt-2 d-inline-block" style={{fontSize:'10px'}}>
                            <Translation>
                                {(t) => <>{t('main.password.no.match')}</>}
                            </Translation>
                        </small>
            }
        }

        const formList =
            <form
                onSubmit={this.changePassword.bind(this)}
                autoComplete="off"
            >
                <div className="form-group mb-4">
                    <Translation>
                        {
                            (t) =>
                            <>
                                <label
                                    className="mb-2 text-default"
                                    htmlFor="currentPassword"
                                    style={headTitle}
                                >
                                    {t('main.current.password')}
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={this.state.currentPassword}
                                    onChange={this.handleChange.bind(this)}
                                    className="form-control shadow-none rounded-sm px-3 bg-transparent"
                                    style={{
                                        height: '45px',
                                        border: '2px solid #ddd'
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
                                    htmlFor="newPassword_1"
                                    style={headTitle}
                                >
                                    {t('main.new.password')}
                                </label>
                                <input
                                    type="password"
                                    name="newPassword_1"
                                    value={this.state.newPassword_1}
                                    onChange={this.handleChange.bind(this)}
                                    className="form-control shadow-none rounded-sm px-3 bg-transparent"
                                    style={{
                                        height: '45px',
                                        border: '2px solid #ddd'
                                    }}
                                />
                            </>
                        }
                    </Translation>                                    
                </div>
                {
                    this.state.newPassword_1.length >= 6 ?
                        <div className="form-group mb-4">
                            <Translation>
                                {
                                    (t) =>
                                    <>
                                        <label
                                            className="mb-2 text-default"
                                            htmlFor="newPassword"
                                            style={headTitle}
                                        >
                                            {t('main.confirm.new.password')}
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={this.state.newPassword}
                                            onChange={this.handleChange.bind(this)}
                                            className="form-control shadow-none rounded-sm px-3 bg-transparent"
                                            style={{
                                                height: '45px',
                                                border: '2px solid #ddd'
                                            }}
                                        />

                                        {
                                            this.state.newPassword_1.length >= 6 &&
                                            this.state.newPassword.length >= 6 &&
                                                <>
                                                    {matchPassword ? matchPassword() : null}
                                                </>
                                        }

                                    </>
                                }
                            </Translation>                                    
                        </div> : 
                        <div className="form-group mb-4">
                            <Translation>
                                {
                                    (t) =>
                                    <>
                                        <label
                                            className="mb-2 text-default"
                                            htmlFor="newPassword"
                                            style={headTitle}
                                        >
                                            {t('main.confirm.new.password')}
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={this.state.newPassword}
                                            onChange={this.handleChange.bind(this)}
                                            className="form-control shadow-none rounded-sm px-3"
                                            style={{
                                                height: '45px',
                                                border: '2px solid #ddd',
                                                background: '#ddd'
                                            }}
                                            disabled
                                        />
                                    </>
                                }
                            </Translation>                                   
                        </div>
                }
                
                <div className="form-group mb-0">  
                    {
                        this.state.error === "Not match" ?
                        <p>
                            <small className="text-danger d-inline-block" style={{fontSize:'12px'}}>
                                <Translation>
                                    {(t) => <>{t('main.password.no.match')}</>}
                                </Translation>
                            </small>
                        </p> : null
                    }                    

                    {
                        this.state.currentPassword.length >= 6 &&
                        this.state.newPassword_1.length >= 6 &&
                        this.state.newPassword.length >= 6 ?
                            <button
                                type="submit"
                                className="btn rounded-sm w-100 py-2 text-light shadow-sm btn-cart-hover"
                                style={buttonCss}
                            >
                                <Translation>
                                    {(t) => <>{t('main.addressSave')}</>}
                                </Translation>
                            </button> :
                            <button
                                type="submit"
                                className="btn rounded-sm w-100 py-2 text-light shadow-sm"
                                style={buttonCss}
                                disabled
                            >
                                <Translation>
                                    {(t) => <>{t('main.addressSave')}</>}
                                </Translation>
                            </button>
                    }
                    
                </div>
            </form>

        const passwordSuccess = 
            <p
                className="font-weight-normal text-success my-3"
                style={{
                    fontSize: '1rem',
                    lineHeight: '1.5'
                }}
            >
                <Translation>
                    {(t) => <>{t('main.change.password.success')}</>}
                </Translation>
            </p>

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
                                        {(t) => <>{t('main.change.password')}</>}
                                    </Translation>
                                </h4>
                                <div className="bg-white p-4 shadow-sm rounded-sm">
                                    <div className="col-12 col-sm-10 col-md-6 px-0">
                                        {
                                            this.state.status === true ? passwordSuccess : formList
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default withRouter(ChangePassword)