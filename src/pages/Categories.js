import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Translation } from 'react-i18next'
import { db } from '../helpers/firebase'
import { CATEGORIES , PRODUCTS } from '../helpers/api'
import { addView } from '../store/view/actions'
import { 
    IonBackButton, 
    IonButtons, 
    IonCol, 
    IonContent, 
    IonFooter, 
    IonGrid, 
    IonLabel, 
    IonPage, 
    IonRow, 
    IonTitle, 
    IonToolbar 
} from '@ionic/react'
import Header from '../components/layout/Header'
import { MdAutorenew } from 'react-icons/md'
import { GiTrade } from 'react-icons/gi'
import { BiStore } from 'react-icons/bi'


const FETCHSUBIMG = process.env.REACT_APP_FETCH_SUBCATEGORY

class Categories extends Component 
{

    static propTypes = {
        addView: PropTypes.func.isRequired
    }

    state = {
        product: null,
        posts: [],
        showPopCart: false,
        closePopCart: false
    }

    getItem = () => {
        const slug = this.props.match.params.slug

        db
        .ref(CATEGORIES+`/${slug}`)
        .on('value' , snapshot => {
            const data = snapshot.val()

            this.setState({
                product: data
            })
        })
    }

    getProduct = () => {
        const slug = this.props.match.params.slug

        db
        .ref(PRODUCTS)   
        .orderByChild('category/slug')
        .equalTo(`${slug}`)
        .on('value' , snapshot => {
            const allLists = []
            snapshot.forEach(snap => {
                allLists.push(snap.val())
            })
            const data = allLists.reverse()

            this.setState({
                posts: data
            })
        })
    }

    componentDidMount() {
        this.getItem()
        this.getProduct()
    }

    componentDidUpdate(prevProps) {
        if(prevProps.match.params.slug !== this.props.match.params.slug) {
            this.getItem()
            this.getProduct()
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.match.params.slug !== this.props.match.params.slug) {
            this.getItem()
        }
    }

    render() {

        const { product } = this.state

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
            overflow: {
                overflowX: 'scroll'
            },
            headName: {
                fontSize: '1rem',
                lineHeight: '1.7em'
            },
            pdLayout: {
                paddingLeft: '5px',
                paddingRight: '5px'
            },
            border: {
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent'
            },
            borderadius: {
                borderRadius: '1rem'
            },
            lineLimit: {
                fontSize: '0.9rem',
                lineHeight: '1.6em',
                height: '42px',
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical'
            },
            catName: {
                fontSize: '0.6rem',
                lineHeight: '1.6em'
            },
            layout: {
                width: '170px'
            },
            labelName: {
                fontSize: '0.5rem',
                lineHeight: '2'
            }
        }

        const headTitle = product ? (
            <Translation key={product.slug}>
                {
                    (t) => 
                    <>
                        {t(
                            'main.post.title',
                            {
                                title_en: product.title,
                                title_mm: product.title_mm
                            }
                        )}
                    </>
                }
            </Translation>
        ) : null

        const lists = product ? (            
            <div className="" key={product.slug}>
                <IonGrid>
                    <IonRow>
                        {
                            product.subcategory.map((l) => (
                                <IonCol size="12" sizeMd="6" key={l.slug} className="align-self-start h-100">
                                    <button
                                        onClick={() => this.props.history.push(`/category/${l.slug}`)}
                                        tappable="true"
                                        className="btn bg-white border-0 p-0 shadow overflow-hidden w-100 h-100 d-flex align-items-center"
                                        style={cssName.rounded}
                                    >
                                        <img
                                            src={FETCHSUBIMG + `/${l.image}`}
                                            alt={l.title}
                                            className="img-fluid p-3 m-2"
                                            style={{
                                                ...cssName.rounded,
                                                backgroundColor: '#fff4e2',
                                                width: '80px'
                                            }}
                                        />
                                        <h4
                                            className="m-0 font-weight-normal text-left text-default pl-2 pr-3 py-2 d-flex align-items-center justify-content-center"
                                            style={{
                                                ...cssName.headName
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
                                                                        title_en: l.title,
                                                                        title_mm: l.title_mm
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
                        <IonBackButton defaultHref="/home" className="text-default" />
                    </IonButtons>

                    <IonTitle size="small" style={cssName.titlePD} className="text-center">
                        <IonLabel style={cssName.name} className="text-default">
                            {headTitle}
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

export default connect(
    null , 
    {
        addView
    }
)(withRouter(Categories))