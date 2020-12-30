import React, { Component } from 'react'
import { BANNERS } from '../../helpers/api'
import { db } from '../../helpers/firebase'
import Skeleton from 'react-loading-skeleton'
import Swiper from 'react-id-swiper'
import 'swiper/swiper.scss'


const FETCHIMG = process.env.REACT_APP_FETCH_BANNER

export default class Banners extends Component 
{
    _isMounted = false

    state = {
        isLoading: false,
        banners: []
    }

    getBanners = () => {
        this._isMounted = true

        db 
        .ref(BANNERS)
        .orderByChild('title')
        .on('value' , snapshot => {
            let data = []
            snapshot.forEach(snap => {
                data.push(snap.val())
            })
            const allItems = data.reverse()

            if(this._isMounted) {
                this.setState({
                    banners: allItems,
                    isLoading: true
                })
            }
        })
    }

    componentDidMount() {
        this.getBanners()
        window.scrollTo(0,0)
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {

        const { banners } = this.state

        const params = {
            loop: true,
            lazy: true,
            slidesPerView: 1,
            centeredSlides: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            effect: 'fade'
        }

        const bannerList = banners.length ? (
            <>
                <Swiper {...params}>
                    {
                        banners.slice(0,5).map((p) => (
                            <div key={p.slug}>
                                <img
                                    src={FETCHIMG+`/${p.image}`}
                                    alt={p.title}
                                    width="100%"
                                    style={{
                                        height: '260px',
                                        objectFit: 'cover',
                                        borderRadius: '1.2rem'
                                    }}                                    
                                />
                            </div>
                        ))
                    }
                </Swiper>
            </>
        ) : (
            <div className="loading-skeleton-div">
                <Skeleton height={260} style={{borderRadius: '1.2rem'}} />
            </div>
        )

        return (
            <div className="px-3 pb-4 pt-1">
                {bannerList}
            </div>
        )
    }
}
