import React, { Component } from 'react'
import { Translation } from 'react-i18next'
import { withRouter , Link } from 'react-router-dom'
import { auth , db } from '../../helpers/firebase'
import { AGENTS } from '../../helpers/api'
import { FaRegAddressCard } from 'react-icons/fa'
import Skeleton from 'react-loading-skeleton'
import { GoPlus } from 'react-icons/go'

class Address extends Component 
{
    _isMounted = false

    state = {
        user: auth.currentUser,
        address: []
    }

    getAddress = () => {
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
                    address: data.slice(0,5)
                })
            }
        })
    }

    componentDidMount() {
        this.getAddress()

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

        const { address } = this.state

        const headText = {
            fontSize: '1rem',
            lineHeight: '1.5',
            color: '#000'
        }

        const pText = {
            fontSize: '12px',
            lineHeight: '1.5'
        }

        const pSpan = {
            marginRight: '5px',
            color: '#000',
            fontSize: '16px',
            textAlign: 'right'
        }

        const noAddress = 
            <div className="d-table w-100 h-75">
                <div className="d-table-cell align-middle">
                    <p
                        className="mb-0 font-weight-normal text-danger"
                        style={pText}
                    >
                        <Translation>
                            {(t) => <>{t('main.no.add.shipping.address')}</>}
                        </Translation>
                    </p>
                </div>
            </div>

        const addressList = address.length ? (
            <>
                {
                    address.map(p => (
                        <p className="text-secondary font-weight-normal mb-1" style={pText} key={p.id}>
                            <Link
                                to={`/edit-address/${p.id}`}
                                className="text-default link-default-hover text-decoration-none"
                            >
                                <span style={pSpan}>
                                    <FaRegAddressCard />
                                </span>
                                {p.name}
                            </Link>
                        </p>
                    ))
                }
            </>
        ) : (
            <>
                <div className="mb-1">
                    <Skeleton height={24} />
                </div>
                <div className="mb-1">
                    <Skeleton height={24} />
                </div>
                <div className="mb-1">
                    <Skeleton height={24} />
                </div>
                <div className="mb-1">
                    <Skeleton height={24} />
                </div>
                <div className="mb-1">
                    <Skeleton height={24} />
                </div>
            </>
        )

        return (
            <div className="bg-white p-4 rounded-sm shadow-sm position-relative h-100">
                <button
                    className="btn position-absolute border-0 rounded-0 shadow-none py-1 px-2 text-light bg-default"
                    style={{
                        fontSize: '10px',
                        background: '#7f187f',
                        right: '0',
                        top: '0'
                    }}
                    onClick={() => this.props.history.push('/add-address')}
                >
                    <GoPlus /> <Translation>
                                        {(t) => <>{t('main.add.new')}</>}
                                    </Translation>
                </button>

                <h4
                    className="mb-2 font-weight-normal text-default" style={headText}
                >
                    <Translation>
                        {(t) => <>{t('main.addresses')}</>}
                    </Translation>
                </h4>

                {address.length ? addressList : noAddress}
                
            </div>
        )
    }
}

export default withRouter(Address)