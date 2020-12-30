import React, { Component } from 'react'
import { 
    IonBackButton, 
    IonButton, 
    IonButtons, 
    IonContent, 
    IonHeader, 
    IonInput, 
    IonItem, 
    IonLabel, 
    IonPage, 
    IonSelect, 
    IonSelectOption, 
    IonTitle, 
    IonToolbar 
} from '@ionic/react'
import { withRouter } from 'react-router-dom'
import { auth , db } from '../../helpers/firebase'
import { Translation } from 'react-i18next'
import { AGENTS } from '../../helpers/api'
import Spinner from '../../components/layout/Spinner'
import PROFILE from '../../assets/images/profile.jpg'

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

class EditProfile extends Component 
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
            photoURL: this.state.user.photoURL === null ? null : this.state.user.photoURL,
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
        .update(newData, () => {
            
            auth.currentUser.updateProfile({
                displayName: this.state.name
            })

            if(this._isMounted) {
                this.setState({
                    loading: this.props.location.state
                })
            }

            this.props.history.push('/manage-account')
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
        // var max = new Date().getDay()
        var days = []

        for(var i = 1; i <= 31; i++) {
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

        const { name , addressPhone , birthday_day , birthday_month , birthday_year , gender , user } = this.state

        const cssName = {
            titlePD: {
                padding: '0 5px 0 10px'
            },
            name: {
                fontSize:'1rem',
                lineHeight:'2'
            },
            inputField: {
                lineHeight: '2',
                fontSize: '1rem'
            },
            inputOnly: {
                fontSize: '1rem'
            },
            layout: {
                paddingLeft: '10px',
                paddingRight: '10px'
            }
        }

        const imageField = (
            <div className="py-3" style={cssName.layout}>
                {
                    user.photoURL === null ? 
                        <img
                            src={PROFILE}
                            alt={user.displayName}
                            className="rounded-circle shadow"
                            style={{
                                width: '100px',
                                height: '100px'
                            }}
                        />
                        :
                        <img
                            src={user.photoURL}
                            alt={user.displayName}
                            className="rounded-circle shadow"
                            style={{
                                width: '100px',
                                height: '100px'
                            }}
                        />
                }
            </div>
        )

        const formList = (
            <Translation>
                {
                    (t) => 

                    <form
                        onSubmit={this.handleOnSubmit.bind(this)}
                        autoComplete="off"
                    >
                        <IonItem lines="inset" className="original-bg mb-3 mr-3" style={{'--inner-padding-end':0}}>
                            <IonLabel position="stacked" className="mb-1 text-default" style={cssName.name}>{t('main.addressName')}</IonLabel>
                            <IonInput 
                                type="text"
                                clearInput={true}
                                name="name"
                                value={name}
                                onIonChange={this.handleOnChange.bind(this)}
                                className="text-custom"
                                style={cssName.inputOnly}
                            ></IonInput>
                        </IonItem>
                        <IonItem lines="inset" className="original-bg mb-3 mr-3" style={{'--inner-padding-end':0}}>
                            <IonLabel position="stacked" className="mb-1 text-default" style={cssName.name}>{t('main.addressPhone')}</IonLabel>
                            <IonInput 
                                type="tel"
                                inputMode="tel"
                                clearInput={true}
                                name="addressPhone"
                                value={addressPhone}
                                onIonChange={this.handleOnChange.bind(this)}
                                className="text-custom"
                                placeholder="09 "
                                style={cssName.inputOnly}
                            ></IonInput>
                        </IonItem>
                        <IonItem lines="inset" className="original-bg mb-3 mr-3" style={{'--inner-padding-end':0}}>
                            <IonLabel position="stacked" className="mb-1 text-default" style={cssName.name}>{t('main.gender')}</IonLabel>
                            <IonSelect 
                                value={gender}  
                                onIonChange={(e) => this.setState({
                                    gender: e.target.value
                                })}
                                name="gender"
                                placeholder={t('main.choose')}
                                okText={t('main.okText')}
                                cancelText={t('main.cancelText')}
                                selectedText={gender}
                                className="text-custom showSelect pb-0"
                                interface="action-sheet"
                                style={cssName.inputField}
                            >
                                <IonSelectOption value={t('main.male')}>{t('main.male')}</IonSelectOption>
                                <IonSelectOption value={t('main.female')}>{t('main.female')}</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem lines="inset" className="original-bg mb-3 mr-3" style={{'--inner-padding-end':0}}>
                            <IonLabel position="stacked" className="mb-1 text-default" style={cssName.name}>{t('main.birthday')}</IonLabel>
                            <IonSelect 
                                value={birthday_day}  
                                onIonChange={(e) => this.setState({
                                    birthday_day: e.target.value
                                })}
                                name="birthday_day"
                                placeholder={t('main.birthday.day')}
                                okText={t('main.okText')}
                                cancelText={t('main.cancelText')}
                                selectedText={birthday_day}
                                className="text-custom showSelect pb-0"
                                style={cssName.inputField}
                            >
                                {
                                    this.getDays().map((n,i) =>
                                        <IonSelectOption key={i} value={n}>{n}</IonSelectOption>
                                    )
                                }
                            </IonSelect>
                            <IonSelect 
                                value={birthday_month}  
                                onIonChange={(e) => this.setState({
                                    birthday_month: e.target.value
                                })}
                                name="birthday_month"
                                placeholder={t('main.birthday.month')}
                                okText={t('main.okText')}
                                cancelText={t('main.cancelText')}
                                selectedText={birthday_month}
                                className="text-custom showSelect pb-0"
                                style={cssName.inputField}
                            >
                                <IonSelectOption value={t('main.jan')}>{t('main.jan')}</IonSelectOption>
                                <IonSelectOption value={t('main.feb')}>{t('main.feb')}</IonSelectOption>
                                <IonSelectOption value={t('main.mar')}>{t('main.mar')}</IonSelectOption>
                                <IonSelectOption value={t('main.apr')}>{t('main.apr')}</IonSelectOption>
                                <IonSelectOption value={t('main.may')}>{t('main.may')}</IonSelectOption>
                                <IonSelectOption value={t('main.jun')}>{t('main.jun')}</IonSelectOption>
                                <IonSelectOption value={t('main.jul')}>{t('main.jul')}</IonSelectOption>
                                <IonSelectOption value={t('main.aug')}>{t('main.aug')}</IonSelectOption>
                                <IonSelectOption value={t('main.sep')}>{t('main.sep')}</IonSelectOption>
                                <IonSelectOption value={t('main.oct')}>{t('main.oct')}</IonSelectOption>
                                <IonSelectOption value={t('main.nov')}>{t('main.nov')}</IonSelectOption>
                                <IonSelectOption value={t('main.dec')}>{t('main.dec')}</IonSelectOption>
                            </IonSelect>
                            <IonSelect 
                                value={birthday_year}  
                                onIonChange={(e) => this.setState({
                                    birthday_year: e.target.value
                                })}
                                name="birthday_year"
                                placeholder={t('main.birthday.year')}
                                okText={t('main.okText')}
                                cancelText={t('main.cancelText')}
                                selectedText={birthday_year}
                                className="text-custom showSelect pb-0"
                                style={cssName.inputField}
                            >
                                {
                                    this.getYears().map((n,i) =>
                                        <IonSelectOption key={i} value={n}>{n}</IonSelectOption>
                                    )
                                }
                            </IonSelect>
                        </IonItem>

                        <IonButton
                            type="button"
                            expand="block"
                            className="font-weight-normal text-light"
                            style={{
                                height: '46px',
                                fontSize: '0.9rem',
                                lineHeight: '1.6',
                                '--background': '#003457',
                                '--box-shadow': '0',
                                '--border-radius': '0.7rem',
                                margin: '3rem 5rem'
                            }}
                        >
                            <Translation>
                                {(t) => <>{t('main.addressSave')}</>}
                            </Translation>
                        </IonButton>

                    </form>
                }
            </Translation>
        )

        return (
            <IonPage>
                <IonHeader className="ion-no-border">
                    <IonToolbar className="original-bg">
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/manage-account" className="text-default" />
                        </IonButtons>

                        <IonTitle size="small" style={cssName.titlePD} className="text-center">
                            <IonLabel style={cssName.name} className="text-default">
                                <Translation>
                                    {(t) => <>{t('main.edit.profile')}</>}
                                </Translation>
                            </IonLabel>
                        </IonTitle>

                        <IonButtons slot="end">
                            <IonButton style={{width: '48px'}} />
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent fullscreen={true} className="original-bg">

                    {this.state.loading === true ? <Spinner /> : null}

                    {imageField}

                    {formList}

                </IonContent>
            </IonPage>
        )
    }
}

export default withRouter(EditProfile)