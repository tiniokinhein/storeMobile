import React, { Component } from 'react'
import { auth , db } from '../../helpers/firebase'
import { Translation } from 'react-i18next'
import { AiOutlineUser , AiOutlineMobile } from 'react-icons/ai'
import { FaBirthdayCake , FaTransgender } from 'react-icons/fa'
import { MdMailOutline } from 'react-icons/md'
import { AGENTS } from '../../helpers/api'
import Moment from 'react-moment'
import 'moment-timezone'
import { Link } from 'react-router-dom'

class Profile extends Component 
{
    _isMounted = false

    state = {
        user: null,
        birthday: null,
        birthday_day: null,
        birthday_month: null,
        birthday_year: null,
        gender: null,
        date: null
    }

    getAgent = () => {
        this._isMounted = true

        db 
        .ref(AGENTS+`/${this.state.user.uid}`)
        .on('value' , snapshot => {
            let data = snapshot.val()
            if(this._isMounted) {
                this.setState({
                    birthday: data ? data.birthday : undefined,
                    birthday_day: data ? data.birthday_day : undefined,
                    birthday_month: data ? data.birthday_month : undefined,
                    birthday_year: data ? data.birthday_year : undefined,
                    gender: data ? data.gender : undefined,
                    date: data ? data.dateRaw : undefined
                })
            }
        })
    }

    componentDidMount() {
        this.getAgent()

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

        const { user , birthday , gender , date , birthday_day , birthday_month , birthday_year } = this.state

        const headText = {
            fontSize: '1rem',
            lineHeight: '1.5',
            color: '#000'
        }

        const pText = {
            fontSize: '12px',
            lineHeight: '1.5'
        }

        const pTextSmall = {
            fontSize: '10px',
            lineHeight: '1.5'
        }

        const pSpan = {
            marginRight: '5px',
            color: '#000',
            fontSize: '16px',
            textAlign: 'right'
        }
        
        return (
            <div className="bg-white p-4 rounded-sm shadow-sm position-relative">
                <Link
                    className="position-absolute text-decoration-none border-0 rounded-0 shadow-none py-1 px-2 text-white bg-default"
                    style={{
                        fontSize: '10px',
                        background: '#7f187f',
                        right: '0',
                        top: '0'
                    }}
                    to="/edit-profile"
                >
                    <Translation>
                        {(t) => <>{t('main.edit')}</>}
                    </Translation>
                </Link>

                <h4
                    className="mb-2 font-weight-normal text-default" style={headText}
                >
                    <Translation>
                        {(t) => <>{t('main.personal.profile')}</>}
                    </Translation>
                </h4>
                
                { 
                    user.displayName &&
                    <p className="text-secondary font-weight-normal mb-1" style={pText}>
                        <span style={pSpan}>
                            <AiOutlineUser />
                        </span>
                        {user.displayName}
                    </p>
                }

                {
                    user.email &&
                    <p className="text-secondary font-weight-normal mb-1" style={pText}>
                        <span style={pSpan}>
                            <MdMailOutline />
                        </span>
                        {user.email}
                    </p>
                }    

                {
                    user.phoneNumber &&
                    <p className="text-secondary font-weight-normal mb-1" style={pText}>
                        <span style={pSpan}>
                            <AiOutlineMobile />
                        </span>
                        {user.phoneNumber}
                    </p>
                }  

                {
                    birthday_day === 'none' ||
                    birthday_month === 'none' ||
                    birthday_year === 'none' ? 
                        <p className="text-secondary font-weight-normal mb-1" style={pText}>
                            <span style={pSpan}>
                                <FaBirthdayCake />
                            </span>
                            <Translation>
                                {(t) => <>{t('main.none')}</>}
                            </Translation>
                        </p> : (
                            <>
                                {
                                    birthday &&
                                    <p className="text-secondary font-weight-normal mb-1" style={pText}>
                                        <span style={pSpan}>
                                            <FaBirthdayCake />
                                        </span>
                                        {birthday}
                                    </p>
                                } 
                            </>
                        )
                }   

                {
                    gender &&
                    <p className="text-secondary font-weight-normal mb-1" style={pText}>
                        <span style={pSpan}>
                            <FaTransgender />
                        </span>
                        {
                            gender === 'none' ?(
                                <Translation>
                                    {(t) => <>{t('main.none')}</>}
                                </Translation>
                            ) : <>{gender}</>
                        }
                    </p>
                }  

                {
                    date &&
                    <p className="text-danger font-weight-bold mb-0 mt-3" style={pTextSmall}> 
                        <Translation>
                            {(t) => <>{t('main.managed.time')}</>}
                        </Translation> -    <Moment 
                                                format="D MMMM YYYY , h:mm a"
                                            >
                                                {date}
                                            </Moment>
                    </p>
                }       

            </div>
        )
    }
}

export default Profile