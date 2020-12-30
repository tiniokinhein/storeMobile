import React, { Component } from 'react'

export default class MenuHamburger extends Component {
    render() {
        const menuBlock = {
            height: '2px',
        }

        const blockWrap = {
            width: '20px'
        }

        return (
            <div style={blockWrap}>
                <div className="row mx-0 flex-column">
                    <div className="rounded-sm bg-dark mb-1 w-100" style={menuBlock} />
                    <div className="rounded-sm bg-dark w-50" style={menuBlock} />
                </div>
            </div>
        )
    }
}
