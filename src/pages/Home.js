import React, { Component } from 'react'
import GridBrand from '../components/brands/GridBrand'
import NewProducts from '../components/products/NewProducts'
import TwoGrids from '../components/feature/TwoGrids'
import { IonPage, IonContent, IonMenuButton, IonButtons, IonTitle } from '@ionic/react'
import Header from '../components/layout/Header'
import Categories from '../components/products/Categories'
import MenuHamburger from '../components/layout/MenuHamburger'
import SearchForm from '../components/layout/SearchForm'
import TabLayout from '../components/layout/TabLayout'
import Babies from '../components/products/category/Babies'
import Groceries from '../components/products/category/Groceries'
import HealthBeauty from '../components/products/category/HealthBeauty'
import MenFashion from '../components/products/category/MenFashion'
import Refresher from '../components/layout/Refresher'

class Home extends Component 
{
    render() {

        const cssName = {
            titlePD: {
                padding: '0 5px 0 10px'
            }
        }

        return (
            <TabLayout>
                <IonPage>
                    <Header>
                        <IonButtons slot="start">
                            <IonMenuButton autoHide={false} >
                                <MenuHamburger />
                            </IonMenuButton>
                        </IonButtons>
                        <IonTitle size="small" style={cssName.titlePD}>
                            <SearchForm />
                        </IonTitle>
                    </Header>

                    <IonContent fullscreen={true} className="original-bg">

                        <Refresher />

                        <Categories />                            
                        <NewProducts />
                        <GridBrand />
                        <Babies />
                        <Groceries />
                        <HealthBeauty />
                        <MenFashion />
                        <TwoGrids />

                    </IonContent>     
                          
                </IonPage>
            </TabLayout>
        )
    }
}


export default Home