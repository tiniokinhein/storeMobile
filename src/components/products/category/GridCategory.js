import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { CATEGORIES } from '../../../helpers/api'
import { db } from '../../../helpers/firebase'
import { Translation } from 'react-i18next'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'


const FETCHIMG = process.env.REACT_APP_FETCH_CATEGORY

class GridCategory extends Component 
{
    _isMounted = false

    state = {
        items: []
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
                const data = lists

                if(this._isMounted) {
                    this.setState({
                        items: data
                    })
                }
            })
    }

    componentDidMount() {
        this.getItems()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {

        const { items } = this.state

        const lists = items.length ? (
            <div
                className="d-flex"
            >
                {
                    items.map((p) => (
                        <div
                            key={p.slug}
                            className="cat-block-wrapper"
                        >
                            <div
                                style={{
                                    border: '5px solid transparent'
                                }}
                            >
                                <Link
                                    to={`/c/${p.slug}`}
                                    className="text-decoration-none text-transparent d-block link-block-hover"
                                    style={{
                                        height: '240px',
                                        width: '210px'
                                    }}
                                >
                                    <div
                                        className="shadow-sm px-3 py-3 h-100 link-block-bg"
                                        style={{
                                            background: "url(" + FETCHIMG + '/' + p.image + ") no-repeat",
                                            backgroundSize: '150px',
                                            backgroundPosition: 'center 90%',
                                            borderRadius: '1.2rem'
                                        }}
                                    >
                                        <h4
                                            className="mb-0 font-weight-normal"
                                            style={{
                                                fontSize: '0.9rem',
                                                lineHeight: '1.5em',
                                                wordBreak: 'keep-all',
                                                color: '#fff'
                                            }}
                                        >
                                            <Translation>
                                                {
                                                    (t) =>
                                                        <>
                                                            {t(
                                                                'main.post.title',
                                                                {
                                                                    title_en: p.title,
                                                                    title_mm: p.title_mm
                                                                }
                                                            )}
                                                        </>
                                                }
                                            </Translation>
                                        </h4>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))
                }
            </div>
        ) : (
                <div
                    className="d-flex"
                >
                    {
                        Array(5).fill().map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    border: '15px solid transparent'
                                }}
                            >
                                <SkeletonTheme highlightColor="#d8d8d8">
                                    <Skeleton width={210} height={240} />
                                </SkeletonTheme>
                            </div>
                        ))
                    }
                </div>
            )

        return (
            <div
                className="position-relative"
            >
                <div
                    className="w-100 overlay-x-flow"
                    style={{
                        overflowX: 'scroll',
                        cursor: 'e-resize',
                        padding: '0 10px'
                    }}
                >
                    {lists}
                </div>
            </div>
        )
    }
}

export default withRouter(GridCategory)