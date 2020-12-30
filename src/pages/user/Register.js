import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Translation } from 'react-i18next'
import { signup } from '../../helpers/auth'
import { auth, googleProvider } from '../../helpers/firebase'
import Spinner from '../../components/layout/Spinner'
import {  
    IonButton, 
    IonButtons, 
    IonCol, 
    IonContent, 
    IonGrid, 
    IonInput, 
    IonLabel,
    IonPage, 
    IonRow, 
    IonText 
} from '@ionic/react'
import { GrFacebookOption } from 'react-icons/gr'
import { IoLogoGoogle } from 'react-icons/io'
import { Plugins } from '@capacitor/core'
import { BiStore } from 'react-icons/bi'
import { add_fb } from '../../store/facebook/actions'


class Register extends Component 
{
    _isMounted = false

    state = {
        email: '',
        password: '',
        displayName: '',
        error: null,
        loading: this.props.location.state,
        user: null
    }

    handleOnChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    async handleSubmit(e) {
        e.preventDefault()
        this.setState({
            error: '',
            loading: true
        })

        try {
            await signup(this.state.email , this.state.password)

            var user = auth.currentUser
            user.updateProfile({
                displayName: this.state.displayName
            })

            auth.signOut()

            this.props.history.push('/login')
            
        } catch (error) {
            this.setState({
                error: error.message,
                loading: this.props.location.state
            })
        }
    }
    
    async googleSignIn() {
        let googleUser = await Plugins.GoogleAuth.signIn()
        const credential = googleProvider.credential(googleUser.authentication.idToken)

        auth.signInWithCredential(credential)

        this.props.history.push('/manage-account')
    }
    
    async fbSignIn() {
        const result = await Plugins.FacebookLogin.login(['public_profile', 'email'])

        if(result && result.accessToken) {

            const response = await fetch(`https://graph.facebook.com/me?fields=id,name,gender,link,picture&type=large&access_token=${result.accessToken.token}`)

            const data = await response.json()

            this.props.add_fb(data)

            this.props.history.push('/manage-account')
        }
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
                '--background': '#fff'
            },
            topBg: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                topInner: {
                    height: '300px',
                    width: '300px',
                    right: '-200px',
                    top: '-200px',
                    zIndex: '1'
                },
                bottomInner: {
                    height: '600px',
                    width: '600px',
                    right: '50%',
                    marginRight: '-200px',
                    bottom: '-550px',
                    zIndex: '1'
                }
            },
            content: {
                zIndex: '99999',
                padding: {
                    padding: '0 10px',
                },
                head: {
                    fontSize: '1.5rem',
                    lineHeight: '2'
                }
            }
        }

        const backGround = (
            <>
                <div
                    className="position-absolute rounded-circle"
                    style={{
                        ...cssName.topBg.topInner,
                        backgroundColor: '#fe9902'
                    }}
                />
                <div
                    className="position-absolute rounded-circle"
                    style={{
                        ...cssName.topBg.bottomInner,
                        backgroundColor: '#f3f3f4'
                    }}
                />
            </>
        )

        const siteTitle = (
            <div style={cssName.content.padding} className="mb-4 mt-5">
                <IonLabel> 
                    <h4 className="text-custom font-weight-normal my-0 text-center" style={cssName.content.head}>
                        <Translation>
                            {(t) => <>{t('main.register')}</>}
                        </Translation>
                    </h4>
                </IonLabel>
            </div>
        )

        const formList = (
            <div className="px-4" style={{zIndex:5}}>
                <form
                    onSubmit={this.handleSubmit.bind(this)}
                    autoComplete="off"
                    className="mb-4"
                >
                    <IonGrid className="w-100">
                        <IonRow>
                            <Translation>
                                {
                                    (t) => (
                                        <IonCol size="12">
                                            <IonLabel 
                                                color="dark"
                                                style={{
                                                    lineHeight: '2',
                                                    fontSize: '0.9rem'
                                                }}
                                            >{t('main.addressName')}</IonLabel>
                                            <IonInput
                                                name="displayName"
                                                value={this.state.displayName}
                                                onIonChange={this.handleOnChange.bind(this)}
                                                color="dark"
                                                size="text"
                                                className="rounded-lg px-2 py-0 mb-2 mt-1"
                                                style={{
                                                    '--background': '#f3f3f4'
                                                }}
                                                required
                                            ></IonInput>
                                        </IonCol>
                                    )
                                }
                            </Translation>
                            <Translation>
                                {
                                    (t) => (
                                        <IonCol size="12">
                                            <IonLabel 
                                                color="dark"
                                                style={{
                                                    lineHeight: '2',
                                                    fontSize: '0.9rem'
                                                }}
                                            >{t('main.addressEmail')}</IonLabel>
                                            <IonInput
                                                type="email"
                                                name="email"
                                                value={this.state.email}
                                                onIonChange={this.handleOnChange.bind(this)}
                                                color="dark"
                                                size="email"
                                                className="rounded-lg px-2 py-0 mb-2 mt-1"
                                                style={{
                                                    '--background': '#f3f3f4'
                                                }}
                                                required
                                            ></IonInput>
                                        </IonCol>
                                    )
                                }
                            </Translation>
                            <Translation>
                                {
                                    (t) => (
                                        <IonCol size="12">
                                            <IonLabel 
                                                color="dark"
                                                style={{
                                                    lineHeight: '2',
                                                    fontSize: '0.9rem'
                                                }}
                                            >{t('main.password')}</IonLabel>
                                            <IonInput
                                                type="password"
                                                name="password"
                                                value={this.state.password}
                                                onIonChange={this.handleOnChange.bind(this)}
                                                color="dark"
                                                size="password"
                                                className="rounded-lg px-2 py-0 mb-2 mt-1"
                                                style={{
                                                    '--background': '#f3f3f4'
                                                }}
                                                required
                                            ></IonInput>
                                        </IonCol>
                                    )
                                }
                            </Translation>
                            { 
                                this.state.error ? (
                                    <IonCol size="12">
                                        <IonText
                                            className="font-weight-normal mb-4"
                                            style={{
                                                fontSize: '12px'
                                            }}
                                            color="danger"
                                        >
                                            {this.state.error}
                                        </IonText> 
                                    </IonCol>
                                ) : null 
                            }
                            <Translation>
                                {
                                    (t) => (
                                        <IonCol size="12" className="mt-3">
                                            <IonButton
                                                type="submit"
                                                size="large"
                                                expand="block"
                                                style={{
                                                    '--background': '#fe9902',
                                                    '--box-shadow': '0',
                                                    fontSize: '0.95rem',
                                                    lineHeight: '2'
                                                }}
                                                className="font-weight-normal text-capitalize"
                                            >
                                                {t('main.signup')}
                                            </IonButton>
                                        </IonCol>
                                    )
                                }
                            </Translation>
                        </IonRow>
                    </IonGrid>
                </form>
            </div>
        )

        const signSocial =
            <div
                className="text-center px-4 mb-3" 
                style={{
                    zIndex:5
                }}
            >    
                <h4
                    className="mb-4 mt-0 font-weight-normal text-lowercase"
                    style={{
                        fontSize: '0.7rem',
                        color: '#000'
                    }}
                >
                    <span
                        className="d-inline-block mr-1"
                        style={{
                            width: '80px',
                            height: '1px',
                            background: '#333',
                            marginBottom: '2px'
                        }}
                    />
                    <Translation>
                        {(t) => <>{t('main.or')}</>}
                    </Translation>
                    <span
                        className="d-inline-block ml-1"
                        style={{
                            width: '80px',
                            height: '1px',
                            background: '#333',
                            marginBottom: '2px'
                        }}
                    />
                </h4>        

                <IonGrid>
                    <IonRow>
                        <IonCol size="12">
                            <button
                                type="button"
                                onClick={() => this.fbSignIn()}
                                className="w-100 p-0 overflow-hidden text-light font-weight-normal border-0 shadow-none"
                                style={{
                                    background: '#4064ad',
                                    fontSize: '0.9rem',
                                    borderRadius: '4px'
                                }}
                            >
                                <div className="d-flex justify-content-between">
                                    <div 
                                        className="d-flex align-items-center px-3"
                                        style={{
                                            background: '#325190'
                                        }}
                                    >
                                        <GrFacebookOption size="1.6rem" />
                                    </div>
                                    <div className="flex-grow-1 align-self-center py-3">Facebook</div>
                                </div>
                            </button>
                        </IonCol>

                        <IonCol size="12">
                            <button
                                type="button"
                                onClick={() => this.googleSignIn()}
                                className="w-100 p-0 overflow-hidden text-light font-weight-normal border-0 shadow-none"
                                style={{
                                    background: '#e44134',
                                    fontSize: '0.9rem',
                                    borderRadius: '4px'
                                }}
                            >
                                <div className="d-flex justify-content-between">
                                    <div 
                                        className="d-flex align-items-center px-3"
                                        style={{
                                            background: '#c7271b'
                                        }}
                                    >
                                        <IoLogoGoogle size="1.6rem" />
                                    </div>
                                    <div className="flex-grow-1 align-self-center py-3">Google</div>
                                </div>
                            </button>
                        </IonCol>
                    </IonRow>
                </IonGrid>    
            </div>

        
        const doNotHave = (
            <div className="px-4 text-center mb-3" style={{zIndex:5}}>
                <p
                    style={{
                        fontSize: '0.85rem',
                        lineHeight: '2',
                        color: '#929292'
                    }}
                    className="m-0"
                >
                    <Translation>
                        {(t) => <>{t('main.already.have.account')}</>}
                    </Translation>
                    &nbsp;
                    <IonText
                        style={{
                            color: '#fe9902'
                        }}
                        onClick={() => this.props.history.push('/login')}
                        tappable="true"
                    >
                        <Translation>
                            {(t) => <>{t('main.signin')}</>}
                        </Translation>
                    </IonText>
                </p>
            </div>
        )

        return (
            <IonPage>
                <IonContent 
                    fullscreen={true}
                    className="ion-no-border"
                    style={{
                        '--background': '#fff'
                    }}
                >
                    <div 
                        slot="fixed" className="d-flex flex-column w-100 h-100"
                    >
                        <div 
                            style={{
                                overflowY: 'scroll'
                            }}
                            className="h-100"
                        >
                            <IonButtons 
                                slot="end"
                                className="position-fixed"
                                style={{
                                    zIndex: '99999',
                                    margin: '5px',
                                    right: 0,
                                    top: 0
                                }}
                            > 
                                <button 
                                    className="btn text-light shadow-none rounded-0 border-0" 
                                    onClick={() => this.props.history.push('/home')}
                                >
                                    <BiStore size="1.6rem" />
                                </button>
                            </IonButtons>

                            {backGround}

                            <div style={cssName.content} className="w-100 h-100 d-flex flex-column justify-content-between">
                                
                                {this.state.loading === true ? <Spinner /> : null}

                                {siteTitle}
                                
                                {formList}  

                                {signSocial}

                                {doNotHave}
                                
                            </div>
                        </div>
                    </div>

                </IonContent>
            </IonPage>
        )
    }
}

export default connect(
    null,
    {add_fb}
)(withRouter(Register))