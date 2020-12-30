import React, { Component } from 'react'
import IMG from '../../assets/images/mk_loading.gif'

export default class Loading extends Component {
    render() {
        return (
            <div
                className="position-fixed"
                style={{
                    left: '0',
                    top: '0',
                    right: '0',
                    bottom: '0',
                    background: 'rgb(27 26 32 / 90%)',
                    zIndex: '999999999999'
                }}
            >
                <div 
                    className="d-table w-100 h-100"
                >
                    <div 
                        className="d-table-cell align-middle text-center"
                    >
                        <img 
                            src={IMG}
                            alt=""
                            style={{
                                width: '60px'
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
