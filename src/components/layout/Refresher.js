import { IonRefresher, IonRefresherContent } from '@ionic/react'
import React from 'react'

export default function Refresher() {

    const onRefresh = () => {
        const event = window.location.reload()
        setTimeout(() => {
            event.complete()
        }, 100);
    }

    return (
        <IonRefresher slot="fixed" onIonRefresh={onRefresh} pullFactor={0.5} pullMin={100} pullMax={200}>
            <IonRefresherContent />
        </IonRefresher>
    )
}
