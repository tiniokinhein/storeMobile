import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.scss'
import { withRouter } from 'react-router-dom'
import { CATEGORIES } from '../../helpers/api'
import { db } from '../../helpers/firebase'
import { Translation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'



const FETCHSUBIMG = process.env.REACT_APP_FETCH_SUBCATEGORY

class Categories extends Component {

    _isMounted = false

    state = {
        items: [],
        tabIndex: 0
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
        window.scrollTo(0,0)
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {

        const { items } = this.state

        const cssName = {
            name: {
                fontSize: '0.85rem',
                lineHeight: '1.6em',
                width: 'auto',
                wordBreak: 'keep-all',
                whiteSpace: 'nowrap',
                borderRadius: '0.7rem',
                borderTopRightRadius: '0',
                borderBottomLeftRadius: '0'
            },
            overflow: {
                overflowX: 'scroll'
            },
            pdx5px_woverflow: {
                overflowX: 'scroll',
                paddingLeft: '5px',
                paddingRight: '5px'
            },
            border5: {
                border: '5px solid transparent'
            },
            catName: {
                fontSize: '0.95rem',
                lineHeight: '1.5em',
                wordBreak: 'keep-all'
            },
            btnLink: {
                height: '200px',
                width: '170px'
            }
        }

        const tabLists = (
            <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({tabIndex})}>
                <TabList className="w-100 d-flex list-unstyled m-0 py-0" style={cssName.pdx5px_woverflow}>
                    {
                        items.length ? (
                            items.map((p) => (
                                <Tab key={p.slug} className="cat-block-wrapper d-block border-0 p-0" selectedClassName="tabSelected">
                                    <div 
                                        style={cssName.border5}
                                    >
                                        <h4
                                            className="my-0 font-weight-normal px-3 py-2 text-dark bg-transparent"
                                            style={cssName.name}
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
                                </Tab>
                            ))
                        ) : (
                            <>
                                {
                                    Array(10).fill().map((item,i) => (
                                        <Tab key={i} className="cat-block-wrapper d-block border-0 p-0" selectedClassName="tabSelected">
                                            <div 
                                                style={cssName.border5}
                                            >
                                                <div
                                                    className="my-0 font-weight-normal"
                                                    style={cssName.name}
                                                >
                                                    <Skeleton width={150} height={36} />
                                                </div>
                                            </div>
                                        </Tab>
                                    ))
                                }
                            </>
                        )
                    }
                
                  
                </TabList>

                {
                    items.length ? (
                        items.map((p) => (
                            <TabPanel
                                key={p.slug}
                                style={cssName.pdx5px_woverflow}
                                className="react-tabs__tab-panel d-flex"
                            >
                                {
                                    p.subcategory.map((m) => (    
                                        <div className="cat-block-wrapper pb-4" key={m.slug}>                                
                                            <div
                                                style={cssName.border5}
                                            >
                                                <button
                                                    onClick={() => this.props.history.push(`/category/${m.slug}`)}
                                                    className="btn p-0 m-0 shadow-none border-0 text-left d-block"
                                                    style={cssName.btnLink}
                                                    tappable="true"
                                                >
                                                    <div
                                                        className="px-3 py-3 h-100 position-relative bg-white shadow"
                                                        style={{
                                                            borderRadius: '0.7rem'
                                                        }}
                                                    >
                                                        <h4
                                                            className="my-0 font-weight-normal text-default"
                                                            style={cssName.catName}
                                                        >
                                                            <Translation>
                                                                {
                                                                    (t) =>
                                                                        <>
                                                                            {t(
                                                                                'main.post.title',
                                                                                {
                                                                                    title_en: m.title,
                                                                                    title_mm: m.title_mm
                                                                                }
                                                                            )}
                                                                        </>
                                                                }
                                                            </Translation>
                                                        </h4>
                                                        <div
                                                            className="position-absolute"
                                                            style={{
                                                                background: "url(" + FETCHSUBIMG + '/' + m.image + ") no-repeat",
                                                                backgroundSize: '120px',
                                                                backgroundPosition: 'bottom right',
                                                                left: '15px',
                                                                top: '30px',
                                                                right: '15px',
                                                                bottom: '15px'
                                                            }}
                                                        />
                                                    </div>
                                                </button>
                                            </div>
                                        </div>    
                                    ))
                                }
                            </TabPanel>
                        ))
                    ) : (
                        <>
                            {
                                Array(10).fill().map((item,i) => (
                                    <TabPanel
                                        key={i}
                                        style={cssName.pdx5px_woverflow}
                                        className="react-tabs__tab-panel d-flex"
                                    >  
                                        {
                                            Array(10).fill().map((item,n) => (
                                                <div 
                                                    className="cat-block-wrapper pb-4"
                                                    key={n}
                                                >                                
                                                    <div
                                                        style={cssName.border5}
                                                    >
                                                        <Skeleton 
                                                            height={200} 
                                                            width={170}  
                                                            style={{
                                                                borderRadius: '0.7rem'
                                                            }} 
                                                        />
                                                    </div>
                                                </div>    
                                            ))
                                        } 
                                    </TabPanel>
                                ))
                            }
                        </>
                    )
                }
            </Tabs>
        )
        
        return (
            <div
                className="position-relative"
            >
                <div
                    className="w-100 pt-4"
                >
                    {tabLists}
                </div>
            </div>
        )
    }
}

export default withRouter(Categories)