import React from 'react'
import { withRouter, NavLink } from 'react-router-dom'
import { Translation } from 'react-i18next'
import { auth } from '../../helpers/firebase'

const LeftSideBar = (props) => {

    const headLink = {
        fontSize: '1.1rem',
        lineHeight: '1.5',
        color: '#000'
    }

    const subLink = {
        fontSize: '0.9rem',
        lineHeight: '1.5'
    }

    return(
        <div>
            <div className="mb-3">
                <NavLink 
                    to="/manage-account"
                    className="d-inline-block text-decoration-none text-default font-weight-normal mb-2 link-default-hover"
                    activeClassName="defaultColor"
                    style={headLink}
                >
                    <Translation>
                        {(t) => <>{t('main.manage.account')}</>}
                    </Translation>
                </NavLink>
                <ul
                    className="list-unstyled pl-2"
                >
                    <li>
                        <NavLink 
                            to="/personal-profile"
                            className="text-decoration-none text-secondary font-weight-normal d-inline-block mb-1 link-default-hover"
                            activeClassName="defaultColor"
                            style={subLink}
                        >
                            <Translation>
                                {(t) => <>{t('main.personal.profile')}</>}
                            </Translation>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/addresses"
                            className="text-decoration-none text-secondary font-weight-normal d-inline-block mb-1 link-default-hover"
                            activeClassName="defaultColor"
                            style={subLink}
                        >
                            <Translation>
                                {(t) => <>{t('main.addresses')}</>}
                            </Translation>
                        </NavLink>
                    </li>
                </ul>
            </div>

            <div className="mb-3">
                <NavLink 
                    to="/order-lists"
                    className="d-inline-block text-decoration-none text-default font-weight-normal mb-2 link-default-hover"
                    activeClassName="defaultColor"
                    style={headLink}
                >
                    <Translation>
                        {(t) => <>{t('main.orders')}</>}
                    </Translation>
                </NavLink>
                <ul
                    className="list-unstyled pl-2"
                >
                    <li>
                        <NavLink 
                            to="/order-cancellations"
                            className="text-decoration-none text-secondary font-weight-normal d-inline-block mb-1 link-default-hover"
                            activeClassName="defaultColor"
                            style={subLink}
                        >
                            <Translation>
                                {(t) => <>{t('main.order.cancel')}</>}
                            </Translation>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/order-completions"
                            className="text-decoration-none text-secondary font-weight-normal d-inline-block mb-1 link-default-hover"
                            activeClassName="defaultColor"
                            style={subLink}
                        >
                            <Translation>
                                {(t) => <>{t('main.order.complete')}</>}
                            </Translation>
                        </NavLink>
                    </li>
                </ul>
            </div>

            <div className="">
                <button
                    onClick={() => {
                        auth.signOut()
                        props.history.push('/home')
                    }}
                    className="btn bg-transparent font-weight-normal text-default p-0 rounded-0 border-0 shadow-none link-default-hover"
                    style={headLink}
                >
                    <Translation>
                        {(t) => <>{t('main.logout')}</>}
                    </Translation>
                </button>
            </div>
        </div>
    )
}

export default withRouter(LeftSideBar)