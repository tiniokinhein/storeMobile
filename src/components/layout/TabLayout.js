import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { IonTabs , IonTabBar, IonTabButton, IonLabel, IonRouterOutlet } from '@ionic/react'
import { BiStore } from 'react-icons/bi'
import { AiOutlineFileSearch } from 'react-icons/ai'
import { FaRegUserCircle, FaUserCircle } from 'react-icons/fa'
import { HiOutlineBell } from 'react-icons/hi'
import { Translation } from 'react-i18next'
import { auth } from '../../helpers/firebase'


class TabLayout extends Component {
    _isMounted = false

    static propTypes = {
        facebook: PropTypes.array.isRequired
    }

    state = {
        user: auth.currentUser
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

        const btnColor = {
            '--color-focused': '#fe9902',
            '--color-selected': '#fe9902'
        }

        const tabBarCss = {
            '--border': '0',
            height: '50px'
        }

        const labelName = {
            fontSize: '0.5rem',
            lineHeight: '1.5'
        }

        return (
            <IonTabs>
                <IonRouterOutlet>
                    <React.Fragment>
                        {this.props.children}
                    </React.Fragment>
                </IonRouterOutlet>

                <IonTabBar 
                    slot="bottom" 
                    style={tabBarCss}
                    className="shadow toolbar-bar original-tab-bg"
                >
                    <IonTabButton tab="home" href="/home" style={btnColor} className="original-tab-btn">
                        <BiStore size="1.1rem" />
                        <IonLabel className="m-0 font-weight-normal" style={labelName}>
                            <Translation>
                                {(t) => <>{t('main.home')}</>}
                            </Translation>
                        </IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="track" href="/track" style={btnColor} className="original-tab-btn">
                        <AiOutlineFileSearch size="1.1rem"/>
                        <IonLabel className="m-0 font-weight-normal" style={labelName}>
                            <Translation>
                                {(t) => <>{t('main.records')}</>}
                            </Translation>
                        </IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="notifications" href="/notifications" style={btnColor} className="original-tab-btn">
                        <HiOutlineBell size="1.1rem"/>
                        <IonLabel className="m-0 font-weight-normal" style={labelName}>
                            <Translation>
                                {(t) => <>{t('main.notifications')}</>}
                            </Translation>
                        </IonLabel>
                    </IonTabButton>
                    {
                        this.state.user === null ? (
                            this.props.facebook.length <= 0 ? (
                                <IonTabButton tab="account" href="/account" style={btnColor} className="original-tab-btn">
                                    <FaRegUserCircle size="1.1rem"/>
                                    <IonLabel className="m-0 font-weight-normal" style={labelName}>
                                        <Translation>
                                            {(t) => <>{t('main.account')}</>}
                                        </Translation>
                                    </IonLabel>
                                </IonTabButton>
                            ) : (
                                this.props.facebook.map((p) => (
                                    <IonTabButton tab="account" href="/manage-account" style={btnColor} className="original-tab-btn" key={p.id}>
                                        {
                                            p.picture &&
                                            p.picture.data &&
                                            <img
                                                src={p.picture.data.url}
                                                alt={p.name}
                                                className="rounded-circle"
                                                style={{
                                                    width: '17.6px',
                                                    height: '17.6px'
                                                }}
                                            />
                                        }
                                        <IonLabel className="m-0 font-weight-normal" style={labelName}>
                                            {p.name}
                                        </IonLabel>
                                    </IonTabButton>
                                ))
                            )
                        ) : (
                            this.state.user.providerData[0].providerId === "google.com" ||
                            this.state.user.providerData[0].providerId === "facebook.com" ? (
                                <IonTabButton tab="account" href="/manage-account" style={btnColor} className="original-tab-btn">
                                    <img
                                        src={this.state.user.photoURL}
                                        alt={this.state.user.displayName}
                                        className="rounded-circle"
                                        style={{
                                            width: '17.6px',
                                            height: '17.6px'
                                        }}
                                    />
                                    <IonLabel className="m-0 font-weight-normal" style={labelName}>
                                        {this.state.user.displayName}
                                    </IonLabel>
                                </IonTabButton>
                            ) : (
                                <IonTabButton tab="account" href="/manage-account" style={btnColor} className="original-tab-btn">
                                    <FaUserCircle size="1.1rem" />
                                    <IonLabel className="m-0 font-weight-normal" style={labelName}>
                                        {this.state.user.displayName}
                                    </IonLabel>
                                </IonTabButton>
                            )

                        )
                    }
                </IonTabBar> 
            </IonTabs>
        )
    }
}

const mapStateToProps = state => ({
    facebook: state.facebook
})

export default connect(mapStateToProps)(TabLayout)