import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Name from '../../components/user/Name'
import LeftSideBar from '../../components/user/LeftSideBar'
import { Translation } from 'react-i18next'
import { auth , db } from '../../helpers/firebase'
import { AGENTS } from '../../helpers/api'
import Skeleton from 'react-loading-skeleton'
import { GoPlus } from 'react-icons/go'

class Addresses extends Component 
{
    _isMounted = false

    state = {
        user: auth.currentUser,
        agents: []
    }

    getAgents = () => {
        this._isMounted = true

        db 
        .ref(AGENTS+`/${this.state.user.uid}/addresses`)
        .orderByChild('dateFormatted')
        .on('value' , snapshot => {
            let lists = []
            snapshot.forEach(snap => {
                lists.push(snap.val())
            })

            const data = lists.reverse()

            if(this._isMounted) {
                this.setState({
                    agents: data
                })
            }
        })
    }

    componentDidMount() {
        this.getAgents()
        
        
        this._isMounted = true

        auth.onAuthStateChanged((user) => {
            if(this._isMounted) {
                if(user) {
                    this.setState({
                        user: auth.currentUser
                    })
                } else {
                    this.setState({
                        user: null
                    })
                }
            }
        })
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {

        const { agents } = this.state

        const tableTHCss = {
            borderBottom: '1px solid #f3f3f3',
            fontWeight: 'normal',
            fontSize: '0.9rem',
            lineHeight: '1.5',
            whiteSpace: 'nowrap'
        }

        const tableTDCss = {
            borderBottom: '1px solid #f3f3f3',
            fontWeight: 'normal',
            fontSize: '0.75rem',
            lineHeight: '1.6',
            color: '#000',
            whiteSpace: 'nowrap'
        }

        const addLink = 
            <Link
                to="/add-address"
                className="d-inline-block py-2 px-4 text-white bg-default text-decoration-none btn-cart-hover"
                style={{
                    fontSize: '0.8rem',
                    background: '#7f187f'
                }}
            >
                <span className="pr-1">
                    <GoPlus />
                </span> <Translation>
                            {(t) => <>{t('main.add.new.address')}</>}
                        </Translation>
            </Link>

        const noAddressList = 
            <div className="d-table w-100 h-100">
                <div 
                    className="d-table-cell align-middle text-center"
                    style={{
                        height: '250px'
                    }}
                >
                    <p
                        className="mb-3 font-weight-normal text-default"
                        style={{
                            fontSize: '0.9rem',
                            lineHeight: '1.5'
                        }}
                    >
                        <Translation>
                            {(t) => <>{t('main.no.address')}</>}
                        </Translation>
                    </p>
                    <Link
                        to="/add-address"
                        className="d-inline-block py-2 px-4 text-white bg-default text-decoration-none btn-cart-hover"
                        style={{
                            fontSize: '0.8rem',
                            lineHeight: '1.5',
                            background: '#7f187f'
                        }}
                    >
                        <span className="pr-1">
                            <GoPlus />
                        </span> <Translation>
                                    {(t) => <>{t('main.add.new.address')}</>}
                                </Translation>
                    </Link>

                </div>
            </div>


        const agentLists = 
            <>
                {
                    agents.length ? (
                        <div className="table-responsive">
                            <table
                                className="table table-borderless m-0"
                            >
                                <thead>
                                    <tr className="table-light text-default">
                                        <th className="py-3" style={tableTHCss}>
                                            <Translation>
                                                {(t) => <>{t('main.addressName')}</>}
                                            </Translation>
                                        </th>
                                        <th className="py-3" style={tableTHCss}>
                                            <Translation>
                                                {(t) => <>{t('main.addressPhone')}</>}
                                            </Translation>
                                        </th>
                                        <th className="py-3" style={tableTHCss}>
                                            <Translation>
                                                {(t) => <>{t('main.addressAddress')}</>}
                                            </Translation>
                                        </th>
                                        <th className="py-3" style={tableTHCss}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        agents.map(p => (
                                            <tr key={p.id}>
                                                <td style={tableTDCss}>
                                                    {p.name}
                                                </td>
                                                <td style={tableTDCss}>
                                                    {p.addressPhone}
                                                </td>
                                                <td style={tableTDCss}>
                                                    {
                                                        p.home_no &&
                                                            <>{p.home_no} , </>
                                                    }
                                                    {
                                                        p.street_quarter &&
                                                            <>{p.street_quarter} , </>
                                                    }
                                                    {
                                                        p.township &&
                                                            <>{p.township}</>
                                                    }                           
                                                </td>
                                                <td style={tableTDCss} className="text-right position-relative">
                                                    <button
                                                        className="btn text-default bg-transparent p-0 rounded-0 border-0 shadow-none link-default-hover mr-1"
                                                        style={{
                                                            fontSize: '0.85rem'
                                                        }}
                                                        onClick={() => this.props.history.push(`/edit-address/${p.id}`)}
                                                    >
                                                        <Translation>
                                                            {(t) => <>{t('main.edit')}</>}
                                                        </Translation>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            <div className="mt-3">
                                {addLink}
                            </div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table
                                className="table table-borderless m-0"
                            >
                                <thead>
                                    <tr className="table-light text-default">
                                        <th className="py-3" style={tableTHCss}>
                                            <Skeleton height={21} />
                                        </th>
                                        <th className="py-3" style={tableTHCss}>
                                            <Skeleton height={21} />
                                        </th>
                                        <th className="py-3" style={tableTHCss}>
                                            <Skeleton height={21} />
                                        </th>
                                        <th className="py-3" style={tableTHCss}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={tableTDCss}>
                                            <Skeleton height={21} />
                                        </td>
                                        <td style={tableTDCss}>
                                            <Skeleton height={21} />
                                        </td>
                                        <td style={tableTDCss}>
                                            <Skeleton height={21} />                          
                                        </td>
                                        <td style={tableTDCss}>
                                            <Skeleton height={21} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="mt-3">
                                <Skeleton width={172} height={35} />
                            </div>
                        </div>                        
                    )
                }
            </>

        return (
            <>
                <Name />

                <div className="py-5 bg-light-custom">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-sm-5 col-lg-3 mb-4 mb-sm-0">
                                <LeftSideBar />
                            </div>
                            <div className="col-12 col-sm-7 col-lg-9">
                                <h4
                                    className="font-weight-normal mb-3 text-custom"
                                    style={{
                                        fontSize: '1.1rem',
                                        lineHeight: '1.5'
                                    }}
                                >
                                    <Translation>
                                        {(t) => <>{t('main.addresses')}</>}
                                    </Translation>
                                </h4>

                                <div className="bg-white p-4 shadow-sm rounded-sm">
                                    {
                                        agents.length ? <>{agentLists}</> : <>{noAddressList}</>                           
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Addresses