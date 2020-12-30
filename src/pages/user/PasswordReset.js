import React, { useState } from 'react'
import { Translation } from 'react-i18next'
import { resetemail } from '../../helpers/auth'
// import Spinner from '../../components/layout/Spinner'
import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonInput, IonLabel, IonLoading, IonPage, IonRow, IonText } from '@ionic/react'
import { withRouter } from 'react-router-dom'

const PasswordReset = (props) => {
    const [email, setEmail] = useState("")
    const [emailHasBeenSent, setEmailHasBeenSent] = useState(false)
    const [error, setError] = useState(null)
    // const [loading, setLoading] = useState(false)
    const [customLoading, setCustomLoading] = useState(false)

    const onHandleChange = e => {
        const { name , value } = e.currentTarget
        if(name === "userEmail") {
            setEmail(value)
        }
    }

    const sentResetEmail = e => {
        e.preventDefault()

        // setLoading(true)

        setCustomLoading(true)

        resetemail(email)
        .then(() => {
            setEmailHasBeenSent(true)
            // setLoading(false)
            setTimeout(() => {
                setEmailHasBeenSent(false)
                setCustomLoading(false)
            }, 8000)
        })
        .catch(() => {
            setError(<Translation>{(t) => <>{t('main.error.reset.password')}</>}</Translation>)
            // setLoading(false)
            setCustomLoading(false)
        })
    }

    const cssName = {
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

    const siteTitle = (
        <div style={cssName.content.padding} className="mt-5 mb-3">
            <IonLabel> 
                <h4 className="text-light font-weight-normal my-0 text-center" style={cssName.content.head}>
                    <Translation>
                        {(t) => <>{t('main.reset.password')}</>}
                    </Translation>
                </h4>
            </IonLabel>
        </div>
    )

    const logIn = (
        <div className="px-4 text-center my-5" style={{zIndex:5}}>
            <p
                style={{
                    fontSize: '1rem',
                    lineHeight: '2',
                    color: '#000'
                }}
                className="m-0"
            >
                <IonText
                    onClick={() => props.history.push('/login')}
                    tappable="true"
                >
                    <Translation>
                        {(t) => <>{t('main.signin')}</>}
                    </Translation>
                </IonText>
            </p>
        </div>
    )

    const formList = (
        <div className="px-4" style={{zIndex:5}}>
            <form
                onSubmit={sentResetEmail}
                autoComplete="off"
            >
                <IonGrid className="w-100">
                    <IonRow>
                        <Translation>
                            {
                                (t) => (
                                    <IonCol size="12">
                                        <IonInput
                                            type="email"
                                            name="userEmail"
                                            onIonChange={onHandleChange}
                                            placeholder={t('main.addressEmail')}
                                            color="dark"
                                            size="email"
                                            className="rounded-sm px-2 py-0 my-0 text-center"
                                            style={{
                                                '--background': '#fff',
                                                color: '#fe9902'
                                            }}
                                            required
                                        ></IonInput>
                                    </IonCol>
                                )
                            }
                        </Translation> 

                        { 
                            emailHasBeenSent && (
                                <IonCol size="12">
                                    <IonText
                                        className="font-weight-normal my-2"
                                        style={{
                                            fontSize: '12px'
                                        }}
                                        color="dark"
                                    >
                                        <Translation>
                                            {(t) => <>{t('main.emailHasBeenSent')}</>}
                                        </Translation>
                                    </IonText> 
                                </IonCol>
                            )
                        }

                        { 
                            error !== null && (
                                <IonCol size="12">
                                    <IonText
                                        className="font-weight-normal my-2"
                                        style={{
                                            fontSize: '12px'
                                        }}
                                        color="dark"
                                    >
                                        {error}
                                    </IonText> 
                                </IonCol>
                            )
                        }

                        <Translation>
                            {
                                (t) => (
                                    <IonCol size="12" className="my-0">
                                        <IonButton
                                            type="submit"
                                            size="large"
                                            expand="block"
                                            fill="outline"
                                            color="light"
                                            style={{
                                                '--box-shadow': '0',
                                                fontSize: '0.95rem',
                                                lineHeight: '2'
                                            }}
                                            className="rounded-sm font-weight-normal text-capitalize mt-2"
                                        >
                                            {t('main.reset')}
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

    return(
        <IonPage>
            <IonContent 
                fullscreen={true}
                className="ion-no-border"
                style={{
                    '--background': 'linear-gradient(180deg, #fab246, #f58428)'
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
                            slot="start"
                            className="position-fixed"
                            style={{
                                zIndex: '99999',
                                margin: '5px',
                                left: 0,
                                top: 0
                            }}
                        >
                            <IonBackButton 
                                defaultHref="/home" 
                                style={{
                                    color:'#fff'
                                }} 
                            />
                        </IonButtons>

                        <div style={cssName.content} className="w-100 h-100 d-flex flex-column justify-content-center">
                            
                            {/* {loading === true ? <Spinner /> : null} */}
                            
                            {siteTitle}

                            {formList}

                            {logIn}
 
                        </div>
                    </div>
                </div>

                <Translation>
                    {
                        (t) => 
                        <IonLoading
                            cssClass='reset-loading'
                            isOpen={customLoading}
                            onDidDismiss={() => setCustomLoading(false)}
                            message={t('main.site.loading')}
                            duration={5000}
                        />
                    }
                </Translation>

            </IonContent>
        </IonPage>
    )
}

export default withRouter(PasswordReset)