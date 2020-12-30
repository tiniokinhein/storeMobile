import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { CATEGORIES } from '../../helpers/api'
import { db } from '../../helpers/firebase'
import { 
    IonMenu, 
    IonContent, 
    IonList, 
    IonItem, 
    IonListHeader, 
    IonImg, 
    IonLabel, 
    IonMenuToggle, 
    IonToggle, IonAlert, IonFooter
} from '@ionic/react'
import LOGO from '../../assets/images/logo.png'
import { Translation } from 'react-i18next'
import { HiOutlineViewGrid } from 'react-icons/hi'
import { GiTrade } from 'react-icons/gi'
import { BsHeartHalf, BsMoon } from 'react-icons/bs'
import { FaLanguage, FaUserCircle } from 'react-icons/fa'
import { MdAutorenew } from 'react-icons/md'
import { CgTimelapse } from 'react-icons/cg'
import { auth } from '../../helpers/firebase'
import { remove_fb } from '../../store/facebook/actions'
import { Plugins } from '@capacitor/core'


class Sidebar extends Component 
{
    _isMounted = false

    static propTypes = {
        facebook: PropTypes.array.isRequired,
        remove_fb: PropTypes.func.isRequired
    }

    state = {
        items: [],
        showAlert: false,
        user: auth.currentUser
    }

    getItems = () => {
        this._isMounted = true

        db 
        .ref(CATEGORIES)
        .orderByChild('dateFormatted')
        .on('value', snapshot => {
            const lists = []
            snapshot.forEach(snap => {
                lists.push(snap.val())
            })
            const data = lists.reverse()

            if(this._isMounted) {
                this.setState({
                    items: data
                })
            }
        })
    }

    handleSignOutFB = async () => {
        await Plugins.FacebookLogin.logout()

        this.props.remove_fb()

        this.props.history.push('/home')
    }

    componentDidMount() {
        this.getItems()

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

    changeLanguage = code => e => {
        localStorage.setItem('language', code);
        window.location.reload();
    }

    changeTheme = () => {
        document.body.classList.toggle('dark')
    }

    handleOnClick = () => {
        this.setState({
            showAlert: !this.state.showAlert
        })
    }

    render() {

        const cssName = {
            siteName: {
                letterSpacing: '-0.5px',
                fontSize: '1.5rem',
                fontFamily: "Roboto, sans-serif",
                fontWeight: '900'
            },
            listBG: {
                '--ion-background-color': 'transparent',
                '--ion-item-background': 'transparent'
            },
            title: {
                fontSize: '1rem',
                lineHeight: '1.6'
            }
        }

        const logOutField = (
            this.state.user === null ? (
                this.props.facebook.length >= 1 ? (
                    this.props.facebook.map((p) => (
                        <IonFooter className="ion-no-border" key={p.id}>
                            <IonMenuToggle>
                                <IonList lines="none" style={cssName.listBG} className="p-0">
                                    <IonItem 
                                        className="text-default font-weight-normal px-0 py-0 original-bg" 
                                        onClick={this.handleSignOutFB}
                                        style={cssName.title}
                                    >
                                        <div
                                            className="mr-3 my-3 align-self-center justify-content-center align-items-center d-flex"
                                            style={{
                                                fontSize: '20px',
                                                height: '40px'
                                            }}
                                        >
                                            {
                                                p.picture &&
                                                p.picture.data &&
                                                    <img
                                                        src={p.picture.data.url}
                                                        alt={p.name}
                                                        className="rounded-circle"
                                                        style={{
                                                            width: '40px',
                                                            height: '40px'
                                                        }}
                                                    />
                                            }
                                        </div>
                                        <Translation>
                                            {(t) => t('main.logout')}
                                        </Translation>
                                    </IonItem>
                                </IonList>
                            </IonMenuToggle>
                        </IonFooter>
                    ))
                ) : null
            ) : (
                <IonFooter className="ion-no-border">
                    <IonMenuToggle>
                        <IonList lines="none" style={cssName.listBG} className="p-0">
                            <IonItem 
                                className="text-default font-weight-normal px-0 py-0 original-bg" 
                                onClick={() => auth.signOut()}
                                style={cssName.title}
                            >
                                {
                                    this.state.user.providerData[0].providerId === "google.com" ||
                                    this.state.user.providerData[0].providerId === "facebook.com" ?
                                        <>
                                            <div
                                                className="mr-3 my-3 align-self-center justify-content-center align-items-center d-flex"
                                                style={{
                                                    fontSize: '20px',
                                                    height: '40px'
                                                }}
                                            >
                                                <img
                                                    src={this.state.user.photoURL}
                                                    alt={this.state.user.displayName}
                                                    className="rounded-circle"
                                                    style={{
                                                        width: '40px',
                                                        height: '40px'
                                                    }}
                                                />
                                            </div>
                                            <Translation>
                                                {(t) => t('main.logout')}
                                            </Translation>
                                        </>
                                    :
                                        <>
                                            <div
                                                className="mr-3 my-3 align-self-center justify-content-center align-items-center d-flex"
                                                style={{
                                                    height: '40px'
                                                }}
                                            >
                                                <FaUserCircle size="2rem" />
                                            </div>
                                            <Translation>
                                                {(t) => t('main.logout')}
                                            </Translation>
                                        </>
                                }
                            </IonItem>
                        </IonList>
                    </IonMenuToggle>
                </IonFooter>
            )
        )

        return (
            <IonMenu 
                contentId="main"
            >
                <IonContent 
                    className="ion-no-border original-bg"
                >
                    <IonMenuToggle>
                        <IonListHeader className="px-3 pt-4 pb-5">
                            <IonImg
                                src={LOGO}
                                onClick={e => {
                                    e.preventDefault()
                                    this.props.history.push('/home')
                                }}
                                className="w-25"
                            /> 
                            <IonLabel 
                                className="pl-3 my-0 d-flex align-self-center"
                                onClick={e => {
                                    e.preventDefault()
                                    this.props.history.push('/home')
                                }}
                            >
                                <span
                                    className="text-uppercase text-default"
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
                        </IonListHeader>

                        <IonList lines="none" style={cssName.listBG}> 
                            <IonItem 
                                className="text-default font-weight-normal" 
                                onClick={() => this.props.history.push('/new-products')}
                                style={cssName.title}
                            >
                                <MdAutorenew size="1.2rem" className="mr-3 text-muted" />
                                <Translation>
                                    {(t) => <>{t('main.newproducts')}</>}
                                </Translation>
                            </IonItem>
                            <IonItem 
                                className="text-default font-weight-normal" 
                                onClick={() => this.props.history.push('/product-categories')}
                                style={cssName.title}
                            >
                                <HiOutlineViewGrid size="1.2rem" className="mr-3 text-muted" />
                                <Translation>
                                    {(t) => <>{t('main.menu.categories')}</>}
                                </Translation>
                            </IonItem>
                            <IonItem 
                                className="text-default font-weight-normal" 
                                onClick={() => this.props.history.push('/brands')}
                                style={cssName.title}
                            >
                                <GiTrade size="1.2rem" className="mr-3 text-muted" />
                                <Translation>
                                    {(t) => <>{t('main.brands.explore')}</>}
                                </Translation>
                            </IonItem>
                            <IonItem 
                                className="text-default font-weight-normal" 
                                onClick={() => this.props.history.push('/favourite-list')}
                                style={cssName.title}
                            >
                                <BsHeartHalf size="1.2rem" className="mr-3 text-muted" />
                                <Translation>
                                    {(t) => <>{t('main.favourite.product.list')}</>}
                                </Translation>
                            </IonItem>
                            <IonItem 
                                className="text-default font-weight-normal pr-3" 
                                onClick={() => this.props.history.push('/view')}
                                style={cssName.title}
                                lines="inset"
                            >
                                <IonLabel className="pb-4">
                                    <CgTimelapse size="1.2rem" className="mr-3 text-muted" />
                                    <Translation>
                                        {(t) => <>{t('main.recently.views')}</>}
                                    </Translation>
                                </IonLabel>
                            </IonItem>
                        </IonList>
                    </IonMenuToggle>

                    <IonList lines="none" style={cssName.listBG}>
                        <IonItem 
                            className="text-default font-weight-normal pt-3" 
                            onClick={() => this.props.history.push('/home')}
                            style={cssName.title}
                        >
                            <BsMoon size="1.2rem" className="mr-3 text-muted" />
                                Dark Mode
                            <IonToggle slot="end" name="darkTheme" onIonChange={this.changeTheme} />
                        </IonItem>
                        <IonItem 
                            className="text-default font-weight-normal" 
                            onClick={() => {
                                this.props.history.push('/home')
                                this.handleOnClick()
                            }}
                            style={cssName.title}
                        >
                            <FaLanguage size="1.2rem" className="mr-3 text-muted" />
                            <Translation>
                                {(t) => <>{t('main.languages')}</>}
                            </Translation>
                        </IonItem>
                    </IonList>

                    <Translation>
                        {
                            (t) => (
                                <IonAlert
                                    isOpen={this.state.showAlert}
                                    onDidDismiss={this.handleOnClick}
                                    cssClass='lang-alert-btn'
                                    header={t('main.languages')}
                                    buttons={[
                                        {
                                            text: t('main.language.mm'),
                                            handler: () => {
                                                document.addEventListener('click',this.changeLanguage('mm'))
                                            }
                                        },
                                        {
                                            text: t('main.language.en'),
                                            handler: () => {
                                                document.addEventListener('click',this.changeLanguage('en'))
                                            }
                                        }
                                    ]}
                                />
                            )                        
                        }
                    </Translation>
                    
                </IonContent>

                {logOutField}
                
            </IonMenu>
        )
    }
}

const mapStateToProps = state => ({
    facebook: state.facebook
})

export default connect(
    mapStateToProps,
    {remove_fb}
)(withRouter(Sidebar))