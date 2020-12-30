import React, { Component } from 'react'
import { IonToolbar, IonHeader, IonButtons, IonButton } from '@ionic/react'
import CartIcon from './CartIcon'
import { withRouter } from 'react-router-dom'


class Header extends Component {

    render() {

        return (
            <IonHeader className="ion-no-border">
                <IonToolbar className="original-bg">
                    
                    {this.props.children}

                    <IonButtons slot="end">
                        <IonButton style={{height:'48px'}}>
                            <CartIcon />
                        </IonButton>
                    </IonButtons>

                </IonToolbar>
            </IonHeader>
        )
    }
}

export default withRouter(Header)