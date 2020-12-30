import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { PRODUCTS } from '../helpers/api'
import { db } from '../helpers/firebase'
import Products from '../components/search/Products'
import { fetchProducts } from '../store/products/actions'
import { addView } from '../store/view/actions'
import { Translation } from 'react-i18next'
import {  
    IonButtons, 
    IonCol, 
    IonContent, 
    IonFooter, 
    IonGrid, 
    IonLabel, 
    IonMenuButton, 
    IonPage, 
    IonRow, 
    IonSkeletonText, 
    IonTitle, 
    IonToolbar 
} from '@ionic/react'
import Header from '../components/layout/Header'
import SearchForm from '../components/layout/SearchForm'
import { CgDisplayGrid } from 'react-icons/cg'
import { GiTrade } from 'react-icons/gi'
import { MdAutorenew } from 'react-icons/md'
import MenuHamburger from '../components/layout/MenuHamburger'
import { BiStore } from 'react-icons/bi'
import { BsFilePlus } from 'react-icons/bs'


class Search extends Component 
{
    static propTypes = {
        addView: PropTypes.func.isRequired,
        fetchProducts: PropTypes.func.isRequired,
        products: PropTypes.array.isRequired,
        cartProducts: PropTypes.array.isRequired
    }

    state = {
        products: [],
        productName: '',
        isLoading: true
    }

    getItems = () => {     
        if(this.props.location.state) { 
            let productName = this.props.location.state.productName
            
            db 
            .ref(PRODUCTS)
            .on('value' , snapshot => {
                const allLists = []
                snapshot.forEach(snap => {
                    allLists.push(snap.val())
                })
                const data = allLists

                const results = data.filter(p => 
                                                p.title.toLowerCase().includes(productName.toLowerCase()) ||
                                                p.title_mm.toLowerCase().includes(productName.toLowerCase()) ||
                                                p.brand.toLowerCase().includes(productName.toLowerCase()) ||
                                                p.price.toLowerCase().includes(productName.toLowerCase()) ||
                                                p.category.title.toLowerCase().includes(productName.toLowerCase()) ||
                                                p.category.title_mm.toLowerCase().includes(productName.toLowerCase()) ||
                                                p.subcategory.title.toLowerCase().includes(productName.toLowerCase()) ||
                                                p.subcategory.title_mm.toLowerCase().includes(productName.toLowerCase())
                                            )

                this.setState({
                    products: results,
                    productName: productName,
                    isLoading: false
                })
            })
        }
    }

    componentDidMount() {
        this.getItems()
    }

    componentDidUpdate(prevProps) {
        let prevSearch = prevProps.location.state && prevProps.location.state.productName
        let newSearch = this.props.location.state && this.props.location.state.productName 
        if (prevSearch !== newSearch) {
            this.getItems()
        }
    }

    render() {

        const { products , isLoading } = this.state

        const cssName = {
            titlePD: {
                padding: '0 5px 0 10px'
            },
            labelName: {
                fontSize: '0.5rem',
                lineHeight: '2'
            }
        }

        let searchResults = isLoading ? (
            <IonGrid>
                <IonRow>
                    {
                        Array(10).fill().map((item,i) => (
                            <IonCol key={i} size="12" sizeMd="6">
                                <IonSkeletonText
                                    animated
                                    style={{
                                        height: '109px',
                                        borderRadius: '1rem'
                                    }}
                                />
                            </IonCol>
                        ))
                    }
                </IonRow>
            </IonGrid>
        ) : (
            products.length ? (
                <Products 
                    products={this.state.products} 
                    addView={this.props.addView} 
                />
            ) : (
                <div className="d-table w-100 h-75">
                    <div className="d-table-cell align-middle text-center">
                        <button
                            className="btn border-0 rounded-0 shadow-none"
                            onClick={() => this.props.history.push('/new-products')}
                            tappable="true"
                        >
                            <BsFilePlus size="3rem" className="text-custom" />
                        </button>
                    </div>
                </div>
            )
        )

        const topTitle = (
            <div 
                className="px-2 pt-3 pb-2"
            >
                <h4
                    className="text-default font-weight-normal m-0"
                    style={{
                        fontSize: '1.2rem',
                        lineHeight: '1.5'
                    }}
                >
                    <strong className="text-custom">" {this.state.productName} "</strong> ,&nbsp;
                    <small 
                        style={{
                            fontSize:'0.8rem'
                        }}
                    >
                        <Translation>
                            {(t) => <>{t('main.result.for')}</>}
                        </Translation> ( {products.length} ) <Translation>{(t) => <>{t('main.items')}</>}</Translation>
                    </small>
                </h4>
            </div>
        )


        return (
            
            <IonPage>
                <Header>
                    <IonButtons slot="start">
                        <IonMenuButton autoHide={false}>
                            <MenuHamburger />
                        </IonMenuButton>
                    </IonButtons>

                    <IonTitle size="small" style={cssName.titlePD}>
                        <SearchForm />
                    </IonTitle>
                </Header>

                <IonContent fullscreen={true} className="original-bg">
                    {topTitle}
                    {searchResults}
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
                            <button 
                                onClick={() => this.props.history.push("/product-categories")}
                                tappable="true"
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

const mapStateToProps = state => ({
    products: state.products.products,
    cartProducts: state.cart.products,
    cartTotal: state.total.data
})

export default connect(
    mapStateToProps , 
    {
        fetchProducts,
        addView
    }
)(withRouter(Search))