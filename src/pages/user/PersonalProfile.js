import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { auth , db } from '../../helpers/firebase'
import { Translation } from 'react-i18next'
import Name from '../../components/user/Name'
import LeftSideBar from '../../components/user/LeftSideBar'
import { AGENTS } from '../../helpers/api'


class PersonalProfile extends Component 
{
    _isMounted = false

    state = {
        user: auth.currentUser,
        agent: null
    }

    getAgent = () => {
        this._isMounted = true

        db 
        .ref(AGENTS+`/${this.state.user.uid}`)
        .on('value' , snapshot => {
            let data = snapshot.val()

            if(this._isMounted) {
                this.setState({
                    agent: data
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

    render() {

        const { user , agent } = this.state

        const headTitle = {
            fontSize: '0.75rem',
            lineHeight: '1.5'
        }

        const paragphCss = {
            fontSize: '0.95rem',
            lineHeight: '1.5'
        }

        const paragphCssMuted = {
            fontSize: '0.95rem',
            lineHeight: '1.5',
            color: '#ddd'
        }

        const buttonCss = {
            lineHeight: '1.5',
            fontSize: '0.9rem',
            background: '#7f187f',
        }

        const nameList = 
            <div
                className="p-4 bg-white"
            >
                <h4
                    className="mb-2 font-weight-normal text-default"
                    style={headTitle}
                >
                    <Translation>
                        {(t) => <>{t('main.addressName')}</>}
                    </Translation>
                </h4>
                <p
                    className="mb-0 text-dark"
                    style={paragphCss}
                >
                    {user.displayName}
                </p>
            </div>

        const emailList =
            <div
                className="p-4 bg-white"
            >
                <h4
                    className="mb-2 font-weight-normal text-default"
                    style={headTitle}
                >
                    <Translation>
                        {(t) => <>{t('main.addressEmail')}</>}
                    </Translation>
                </h4>
                <p
                    className="mb-0 text-dark"
                    style={paragphCss}
                >
                    {user.email}
                </p>
            </div>

        const phoneList =
            <>
                {
                    agent ? (
                        <div
                            className="p-4 bg-white"
                            key={agent.uid}
                        >
                            <h4
                                className="mb-2 font-weight-normal text-default"
                                style={headTitle}
                            >
                                <Translation>
                                    {(t) => <>{t('main.addressPhone')}</>}
                                </Translation>
                            </h4>

                            {
                                agent.addressPhone ? (
                                    <p
                                        className="mb-0 text-dark"
                                        style={paragphCss}
                                    >
                                        {agent.addressPhone }
                                    </p>
                                ) : (
                                    <p
                                        className="mb-0"
                                        style={paragphCssMuted}
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.fill.phone')}</>}
                                        </Translation>
                                    </p>
                                )
                            }
                            
                        </div>
                    ) : (
                        <div
                            className="p-4 bg-white"
                        >
                            <h4
                                className="mb-2 font-weight-normal text-default"
                                style={headTitle}
                            >
                                <Translation>
                                    {(t) => <>{t('main.addressPhone')}</>}
                                </Translation>
                            </h4>
                            <p
                                className="mb-0"
                                style={paragphCssMuted}
                            >
                                <Translation>
                                    {(t) => <>{t('main.fill.phone')}</>}
                                </Translation>
                            </p>
                        </div>
                    )
                }
            </>
            

        const birthdayList =
            <>
                {
                    agent ? (
                        <div
                            className="p-4 bg-white"
                            key={agent.uid}
                        >
                            <h4
                                className="mb-2 font-weight-normal text-default"
                                style={headTitle}
                            >
                                <Translation>
                                    {(t) => <>{t('main.birthday')}</>}
                                </Translation>
                            </h4>

                            {
                                agent.birthday_day === 'none' ||
                                agent.birthday_month === 'none' ||
                                agent.birthday_year === 'none' ? 
                                    <Translation>
                                        {(t) => <>{t('main.none')}</>}
                                    </Translation> : (
                                        <>
                                            {
                                                agent.birthday ? (
                                                    <p
                                                        className="mb-0 text-dark"
                                                        style={paragphCss}
                                                    >
                                                        {agent.birthday}
                                                    </p>
                                                ) : (
                                                    <p
                                                        className="mb-0"
                                                        style={paragphCssMuted}
                                                    >
                                                        <Translation>
                                                            {(t) => <>{t('main.fill.birthday')}</>}
                                                        </Translation>
                                                    </p>
                                                )
                                            }
                                        </>
                                    )
                            }                            

                        </div>
                    ) : (
                        <div
                            className="p-4 bg-white"
                        >
                            <h4
                                className="mb-2 font-weight-normal text-default"
                                style={headTitle}
                            >
                                <Translation>
                                    {(t) => <>{t('main.birthday')}</>}
                                </Translation>
                            </h4>
                            <p
                                className="mb-0"
                                style={paragphCssMuted}
                            >
                                <Translation>
                                    {(t) => <>{t('main.fill.birthday')}</>}
                                </Translation>
                            </p>
                        </div>
                    )
                }
            </>

        const genderList =
            <>
                {
                    agent ? (
                        <div
                            className="p-4 bg-white"
                            key={agent.uid}
                        >
                            <h4
                                className="mb-2 font-weight-normal text-default"
                                style={headTitle}
                            >
                                <Translation>
                                    {(t) => <>{t('main.gender')}</>}
                                </Translation>
                            </h4>
                            
                            {
                                agent.gender ? (
                                    <p
                                        className="mb-0 text-dark"
                                        style={paragphCss}
                                    >
                                        {
                                            agent.gender === 'none' ?(
                                                <Translation>
                                                    {(t) => <>{t('main.none')}</>}
                                                </Translation>
                                            ) : agent.gender
                                        }
                                    </p>
                                ) : (
                                    <p
                                        className="mb-0"
                                        style={paragphCssMuted}
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.fill.gender')}</>}
                                        </Translation>
                                    </p>
                                )
                            }

                        </div>
                    ) : (
                        <div
                            className="p-4 bg-white"
                        >
                            <h4
                                className="mb-2 font-weight-normal text-default"
                                style={headTitle}
                            >
                                <Translation>
                                    {(t) => <>{t('main.gender')}</>}
                                </Translation>
                            </h4>
                            <p
                                className="mb-0"
                                style={paragphCssMuted}
                            >
                                <Translation>
                                    {(t) => <>{t('main.fill.gender')}</>}
                                </Translation>
                            </p>
                        </div>
                    )
                }
            </>

        return (
            <>
                <Name />                
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
                                        {(t) => <>{t('main.personal.profile')}</>}
                                    </Translation>
                                </h4>
                                <div className="mb-3">
                                    <div className="row mx-n1">
                                        <div className="px-1 col-12 col-md-6 col-lg-4 my-1">
                                            {nameList}
                                        </div>
                                        <div className="px-1 col-12 col-md-6 col-lg-4 my-1">
                                            {emailList}
                                        </div>
                                        <div className="px-1 col-12 col-md-6 col-lg-4 my-1">
                                            {phoneList}
                                        </div>
                                        <div className="px-1 col-12 col-md-6 col-lg-4 my-1">
                                            {birthdayList}
                                        </div>
                                        <div className="px-1 col-12 col-md-6 col-lg-4 my-1">
                                            {genderList}
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-0">
                                    <div className="col-12 col-md-6 col-lg-4 px-0 pr-md-1">
                                        <Link
                                            to="/edit-profile"
                                            className="d-block text-white bg-default py-2 text-decoration-none text-center btn-cart-hover"
                                            style={buttonCss}
                                        >
                                            <Translation>
                                                {(t) => <>{t('main.edit')}</>}
                                            </Translation>
                                        </Link>
                                    </div>
                                </div>

                                {
                                    this.state.user.providerData[0].providerId === "google.com" ||
                                    this.state.user.providerData[0].providerId === "facebook.com" ? null :
                                        <div className="col-12 col-md-6 col-lg-4 px-0 pr-md-1 mt-3">
                                            <Link
                                                to="/change-password"
                                                className="d-block text-white bg-custom py-2 text-decoration-none text-center btn-cart-hover"
                                                style={buttonCss}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.change.password')}</>}
                                                </Translation>
                                            </Link>
                                        </div>
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default withRouter(PersonalProfile)