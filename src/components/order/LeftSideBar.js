import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Translation } from 'react-i18next'

export default class LeftSideBar extends Component {
    render() {

        const headLink = {
            fontSize: '1.1rem',
            lineHeight: '1.5',
            color: '#000'
        }

        return (
            <NavLink
                to="/track"
                className="d-inline-block text-decoration-none text-default font-weight-normal mb-2 link-default-hover"
                activeClassName="defaultColor"
                style={headLink}
            >
                <Translation>
                    {(t) => <>{t('main.orders')}</>}
                </Translation>
            </NavLink>
        )
    }
}
