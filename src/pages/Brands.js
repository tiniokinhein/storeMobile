import { IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonLabel, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react'
import React, { Component } from 'react'
import { Translation } from 'react-i18next'
import { BiStore } from 'react-icons/bi'
import { CgDisplayGrid } from 'react-icons/cg'
import { MdAutorenew } from 'react-icons/md'
import { withRouter } from 'react-router-dom'
import Header from '../components/layout/Header'
import MenuHamburger from '../components/layout/MenuHamburger'
import { BRANDS } from '../helpers/api'
import { db } from '../helpers/firebase'


const FETCHIMG = process.env.REACT_APP_FETCH_BRAND

class Brands extends Component {

    state = {
        items: []
    }

    getItems = () => {
        db 
        .ref(BRANDS)
        .on('value', snapshot => {
            const lists = []
            snapshot.forEach(snap => {
                lists.push(snap.val())
            })
            const data = lists

            this.setState({
                items: data
            })
        })
    }

    componentDidMount() {
        this.getItems()
    }

    render() {

        const { items } = this.state

        const cssName = {
            titlePD: {
                padding: '0 5px 0 10px'
            },
            name: {
                fontSize:'1rem',
                lineHeight:'2'
            },
            borderadius: {
                borderRadius: '1rem'
            },
            titleName: {
                fontSize: '0.85rem',
                lineHeight: '1.5'
            },
            labelName: {
                fontSize: '0.5rem',
                lineHeight: '2'
            }
        }

        const lists = items.length ? (
            <div className="">
                <IonGrid>
                    <IonRow>
                        {
                            items.map((p) => (
                                <IonCol key={p.slug} size="6">
                                    <button
                                        onClick={() => this.props.history.push(`/brand/${p.slug}`)}
                                        className="btn d-flex w-100 align-items-center overflow-hidden p-0 border-0 shadow-none bg-white"
                                        style={cssName.borderadius}
                                        tappable="true"
                                    >
                                        <img
                                            src={FETCHIMG+`/${p.image}`}
                                            alt={p.name}
                                            width="60"
                                            className="m-2 p-2"
                                            style={{
                                                ...cssName.borderadius,
                                                backgroundColor: '#fff4e2'
                                            }}
                                        />
                                        <p
                                            className="m-0 font-weight-bold text-default py-2 pl-1 pr-2"
                                            style={cssName.titleName}
                                        >
                                            {p.name}
                                        </p>
                                    </button>
                                </IonCol>
                            ))
                        }
                    </IonRow>
                </IonGrid>
            </div>
        ) : null

        return (
            <IonPage>
                <Header>
                    <IonButtons slot="start">
                        <IonMenuButton autoHide={false}>
                            <MenuHamburger />
                        </IonMenuButton>
                    </IonButtons>
                    <IonTitle size="small" style={cssName.titlePD} className="text-center">
                        <IonLabel style={cssName.name} className="text-default">
                            <Translation>
                                {(t) => <>{t('main.brands.explore')}</>}
                            </Translation>
                        </IonLabel>
                    </IonTitle>
                </Header>

                <IonContent fullscreen={true} className="original-bg">
                    {lists}
                </IonContent>

                <IonFooter className="ion-no-border shadow">
                    <IonToolbar className="original-tab-bg">
                        <IonButtons>
                            <button 
                                onClick={() => this.props.history.push("/home")}
                                tappable="true"
                                className="btn d-flex flex-column p-0 shadow-none rounded-0 border-0 w-100 align-items-center text-default"
                            >
                                <BiStore size="1rem" />
                                <IonLabel className="mb-0 mt-0 font-weight-normal px-2" style={cssName.labelName}>
                                    <Translation>
                                        {(t) => <>{t('main.home')}</>}
                                    </Translation>
                                </IonLabel>
                            </button>

                            <button 
                                onClick={() => this.props.history.push("/new-products")}
                                className="btn d-flex flex-column p-0 shadow-none rounded-0 border-0 w-100 align-items-center text-default"
                            >
                                <MdAutorenew size="1rem" />
                                <IonLabel className="mb-0 mt-0 font-weight-normal px-2" style={cssName.labelName}>
                                    <Translation>
                                        {(t) => <>{t('main.newproducts')}</>}
                                    </Translation>
                                </IonLabel>
                            </button>
                            
                            <button 
                                onClick={() => this.props.history.push("/product-categories")}
                                className="btn d-flex flex-column p-0 shadow-none rounded-0 border-0 w-100 align-items-center text-default"
                            >
                                <CgDisplayGrid size="1rem" />
                                <IonLabel className="mb-0 mt-0 font-weight-normal px-2" style={cssName.labelName}>
                                    <Translation>
                                        {(t) => <>{t('main.menu.categories')}</>}
                                    </Translation>
                                </IonLabel>
                            </button>
                        </IonButtons>
                    </IonToolbar>
                </IonFooter>
                
            </IonPage>
        )
    }
}

export default withRouter(Brands)