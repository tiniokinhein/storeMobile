import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { SUBCATEGORIES } from '../../../helpers/api'
import { db } from '../../../helpers/firebase'
import { Translation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import { RiArrowDropRightLine } from 'react-icons/ri'


const FETCHIMG = process.env.REACT_APP_FETCH_SUBCATEGORY

class GridSubCategory extends Component 
{
    _isMounted = false

    state = {
        items: []
    }

    getItems = () => {
        this._isMounted = true

        db
            .ref(SUBCATEGORIES)
            .orderByChild('title')
            .on('value', snapshot => {
                const lists = []
                snapshot.forEach(snap => {
                    lists.push(snap.val())
                })
                const data = lists

                if(this._isMounted) {
                    this.setState({
                        items: data.slice(0, 10)
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
                className="row"
            >
                {
                    items.map((p) => (
                        <div
                            key={p.slug}
                            className="col-4 col-sm-3 col-md-2 col-lg-custom-10 my-3"
                        >
                            <Link
                                to={`/category/${p.slug}`}
                                className="text-decoration-none text-transparent d-block cat-link-hover link-default-hover"
                            >
                                <img
                                    src={FETCHIMG + `/${p.image}`}
                                    alt={p.name}
                                    className="bg-white rounded-circle p-1 w-100"
                                />
                                <h4
                                    className="mb-0 mt-3 font-weight-light text-default text-center"
                                    style={{
                                        fontSize: '0.8rem',
                                        lineHeight: '1.5em'
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
                            </Link>
                        </div>
                    ))
                }
            </div>
        ) : (
                <div
                    className="row"
                >
                    {
                        Array(10).fill().map((item, index) => (
                            <div
                                className="col-4 col-sm-3 col-md-2 col-lg-custom-10 my-3 text-center"
                                key={index}
                            >
                                <Skeleton width={90} height={90} circle={true} />
                                <div className="mt-3">
                                    <Skeleton height={37} />
                                </div>
                            </div>
                        ))
                    }
                </div>
            )

        return (
            <div
                className="py-5"
            >
                <div className="container">
                    <div
                        className="d-flex mb-3"
                    >
                        <h4
                            className="mb-0 font-weight-normal text-default pr-4"
                            style={{
                                fontSize: '1.1rem',
                                lineHeight: '1.5em'
                            }}
                        >
                            <Translation>
                                {(t) => <>{t('main.explore.more.products.categories')}</>}
                            </Translation>
                        </h4>
                        <div
                            className="text-default ml-auto align-self-end link-default-hover font-weight-normal text-right"
                            style={{
                                lineHeight: '2',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                minWidth: '130px'
                            }}
                            onClick={() => this.props.history.push('/product-categories')}
                        >
                            <Translation>
                                {(t) => <>{t('main.list.seeAll')}</>}
                            </Translation> <RiArrowDropRightLine />
                        </div>
                    </div>
                    {lists}
                </div>
            </div>
        )
    }
}

export default withRouter(GridSubCategory)