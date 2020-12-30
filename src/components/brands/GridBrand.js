import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { BRANDS } from '../../helpers/api'
import { db } from '../../helpers/firebase'
import { Translation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'


const FETCHIMG = process.env.REACT_APP_FETCH_BRAND

class GridBrand extends Component 
{
    _isMounted = false

    state = {
        items: []
    }

    getItems = () => {
        this._isMounted = true

        db 
        .ref(BRANDS)
        .on('value', snapshot => {
            const lists = []
            snapshot.forEach(snap => {
                lists.push(snap.val())
            })
            const data = lists.reverse()

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

        const cssName = {
            name: {
                fontSize: '0.7rem',
                whiteSpace: 'nowrap'
            },
            overflow: {
                overflowX: 'auto'
            },
            pdLayout: {
                paddingLeft: '5px',
                paddingRight: '5px'
            },
            pd10 : {
                paddingLeft: '10px',
                paddingRight: '10px'
            },
            headName: {
                fontSize: '1rem',
                lineHeight: '2em',
            },
            borderadius: {
                borderRadius: '1rem'
            }
        }

        const lists = items.length ? (
            <div style={{...cssName.overflow,...cssName.pdLayout}}>
                <div className="d-flex">
                    {
                        items.map((p) => (
                            <div 
                                key={p.slug}
                                style={{
                                    border: '5px solid transparent'
                                }}
                                className="mb-4 mt-2"
                            >
                                <div 
                                    className="bg-white overflow-hidden shadow"
                                    style={cssName.borderadius}
                                >
                                    <button
                                        tappable="true"
                                        onClick={() => this.props.history.push(`/brand/${p.slug}`)}
                                        className="btn d-flex w-100 align-items-center p-0 border-0 rounded-0 shadow-none bg-transparent"
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
                                            className="m-0 font-weight-bold text-default py-2 pl-1 pr-3"
                                            style={cssName.titleName}
                                        >
                                            {p.name}
                                        </p>
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        ) : (
            <div style={{...cssName.overflow,...cssName.pdLayout}}>
                <div 
                    className="d-flex"
                >
                    {
                        Array(10).fill().map((item,i) => (
                            <div
                                key={i}
                                style={{
                                    border: '5px solid transparent'
                                }}
                                className="mb-4 mt-2"
                            >
                                <Skeleton 
                                    width={170}
                                    height={76}
                                    style={cssName.borderadius}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
        )

        return (
            <div
                className=""
            >       
                <div
                    className="d-flex mt-3 align-items-center"
                    style={{
                        padding: '0 10px'
                    }}
                >
                    <h4
                        className="my-0 text-dark"
                        style={{
                            ...cssName.headName
                        }}
                    >
                        <Translation>
                            {(t) => <>{t('main.brands.explore')}</>}
                        </Translation>
                    </h4>
                    <div
                        className="text-default ml-auto font-weight-normal text-right"
                        style={cssName.name}
                        onClick={() => this.props.history.push('/brands')}
                    >
                        <Translation>
                            {(t) => <>{t('main.list.seeAll')}</>}
                        </Translation>
                    </div>
                </div>
                {lists}
            </div>
        )
    }
}

export default withRouter(GridBrand)