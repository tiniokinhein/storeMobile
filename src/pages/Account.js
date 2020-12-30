import { 
    IonBackButton, 
    IonButton, 
    IonButtons, 
    IonContent, 
    IonLabel, 
    IonPage, 
    IonText
} from '@ionic/react'
import React, { Component } from 'react'
import { Translation } from 'react-i18next'
import { withRouter } from 'react-router-dom'
import { auth } from '../helpers/firebase'

class Account extends Component {

    _isMounted = false

    state = {
        user: null
    }

    componentDidMount() {
        this._isMounted = true

        auth.onAuthStateChanged((user) => {
            if(this._isMounted) {
                if(user) {
                    this.setState({
                        user: auth.currentUser
                    })
                    this.props.history.push('/manage-account')
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

        const cssName = {
            bg: {
                '--background': '#003457'
            },
            topBg: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                topInner: {
                    height: '550px',
                    width: '550px',
                    left: '-50%',
                    top: '-10%',
                    zIndex: '9999'
                },
                bottomInner: {
                    height: '400px',
                    width: '400px',
                    right: '-50%',
                    bottom: '-25%',
                    zIndex: '9999'
                }
            },
            content: {
                zIndex: '99999',
                padding: '0 10px',
                head: {
                    fontSize: '1.2rem',
                    lineHeight: '2'
                }
            },
            siteName: {
                letterSpacing: '-0.5px',
                fontSize: '2.2rem',
                fontFamily: "Roboto, sans-serif",
                fontWeight: '900'
            }
        }

        const backGround = (
            <>
                <div
                    className="position-absolute rounded-circle"
                    style={{
                        ...cssName.topBg.topInner,
                        backgroundColor: '#0b2f48'
                    }}
                />
                <div
                    className="position-absolute rounded-circle"
                    style={{
                        ...cssName.topBg.bottomInner,
                        backgroundColor: '#0b2f48'
                    }}
                />
            </>
        )

        const siteTitle = (
            <div className="mt-3 mb-3">
                <IonLabel>
                    <span
                        className="text-uppercase text-light"
                        style={cssName.siteName}
                    >
                        Bagan
                    </span>&nbsp;&nbsp;
                    <span
                        className="text-uppercase text-custom"
                        style={cssName.siteName}
                    >
                        Store
                    </span>
                </IonLabel>

                <h4 className="text-light font-weight-normal my-0" style={cssName.content.head}>
                    <Translation>
                        {(t) => <>{t('main.welcome.bgstore')}</>}
                    </Translation>
                </h4>
            </div>
        )

        const accounts = (
            <div className="mt-3 mb-4">
                <IonButton 
                    expand="block" 
                    className="mb-4 font-weight-normal text-capitalize" 
                    size="large" 
                    style={{
                        '--background': '#fe9902',
                        '--box-shadow': '0',
                        fontSize: '1rem',
                        lineHeight: '2',
                        letterSpacing: '-0.2px'
                    }}
                    routerLink="/register"
                >
                    <Translation>
                        {(t) => <>{t('main.register')}</>}
                    </Translation>
                </IonButton>
                <IonButton 
                    expand="block" 
                    className="mb-3 font-weight-normal text-capitalize" 
                    size="large" 
                    style={{
                        '--background': '#fe9902',
                        '--box-shadow': '0',
                        fontSize: '1rem',
                        lineHeight: '2',
                        letterSpacing: '-0.2px'
                    }}
                    routerLink="/login"
                >
                    <Translation>
                        {(t) => <>{t('main.signin')}</>}
                    </Translation>
                </IonButton>
                <p 
                    className="text-center text-white-50 font-weight-normal mb-0 mt-4 px-4"
                    style={{
                        fontSize: '0.8rem',
                        lineHeight: '1.6'
                    }}
                >
                    By using Bagan Store's app, you accept the <IonText onClick={() => this.props.history.push("/home")} color="light">Terms of Service</IonText> and <IonText onClick={() => this.props.history.push("/home")} color="light">Privacy Policy</IonText>
                </p>
            </div>
        )

        const detailList = (
            <div className="">
                <h4 className="my-0 text-light font-weight-normal">
                    
                </h4>
            </div>
        )

        return (
            <IonPage>

                <IonContent 
                    fullscreen={true}
                    className="ion-no-border"
                    style={{
                        '--background': '#003457'
                    }}
                >

                    <div slot="fixed" className="d-flex flex-column h-100 w-100 justify-content-between">
                        
                        <IonButtons 
                            slot="start"
                            style={{
                                zIndex: '99999',
                                margin: '5px'
                            }}
                        >
                            <IonBackButton defaultHref="/home" className="text-light" />
                        </IonButtons>
                        

                        {backGround}

                        <div style={cssName.content} className="w-100 flex-grow-1 d-flex flex-column justify-content-between">
                            {siteTitle}
                            {detailList}
                            {accounts}
                        </div>
                        
                    </div>
                </IonContent>

            </IonPage>
        )
    }
}


export default withRouter(Account)