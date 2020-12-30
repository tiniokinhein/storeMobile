import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Translation } from 'react-i18next'
import { CATEGORIES } from '../helpers/api'
import { db } from '../helpers/firebase'
import Header from '../components/layout/Header'
import { IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonLabel, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react'
import { MdAutorenew } from 'react-icons/md'
import { GiTrade } from 'react-icons/gi'
import MenuHamburger from '../components/layout/MenuHamburger'
import { BiStore } from 'react-icons/bi'


const FETCHCATIMG = process.env.REACT_APP_FETCH_CATEGORY

class ProductCategories extends Component {
    state = {
        items: []
    }

    getItems = () => {
        db
        .ref(CATEGORIES)
        .on('value', snapshot => {
            let lists = []
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
            rounded: {
                borderRadius: '1rem'
            },
            titleName: {
                fontSize: '0.6rem',
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
                                <IonCol size="4" key={p.slug} className="align-self-start h-100">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            this.props.history.push(`/c/${p.slug}`)
                                        }}
                                        tappable="true"
                                        className="btn bg-custom border-0 p-0 shadow overflow-hidden w-100 h-100"
                                        style={cssName.rounded}
                                    >
                                        <img
                                            src={FETCHCATIMG + `/${p.image}`}
                                            alt={p.title}
                                            className="img-fluid p-4"
                                        />
                                        <h4
                                            className="m-0 font-weight-normal text-default bg-white px-2 d-flex align-items-center justify-content-center"
                                            style={{
                                                ...cssName.titleName,
                                                borderRadius: '1rem 1rem 0 0',
                                                height: '40px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            <Translation>
                                                {
                                                    (t) =>
                                                        <>
                                                            {
                                                                t(
                                                                    'main.post.title',
                                                                    {
                                                                        title_en: p.title,
                                                                        title_mm: p.title_mm
                                                                    }
                                                                )
                                                            }
                                                        </>
                                                }
                                            </Translation>
                                        </h4>
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
                                {(t) => <>{t('main.menu.categories')}</>}
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
                                tappable="true"
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
                                onClick={() => this.props.history.push("/brands")}
                                tappable="true"
                                className="btn d-flex flex-column p-0 shadow-none rounded-0 border-0 w-100 align-items-center text-default"
                            >
                                <GiTrade size="1rem" /> 
                                <IonLabel className="mb-0 mt-0 font-weight-normal px-2" style={cssName.labelName}>
                                    <Translation>
                                        {(t) => <>{t('main.brands.explore')}</>}
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

export default withRouter(ProductCategories)