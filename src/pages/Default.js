import React, { Component } from 'react'
import FUNNY from '../assets/images/funny.gif'
import { Translation } from 'react-i18next'

export default class Default extends Component 
{
    componentDidMount() {
        window.scrollTo(0,0)
    }

    render() {
        return (
            
                <div 
                    className="py-5"
                    style={{
                        background: 'radial-gradient(circle, #0f4c82 , #003457)'
                    }}
                >
                    <div className="container h-100">
                        <div 
                            className="d-table w-100"
                            style={{
                                height: '500px'
                            }}
                        >
                            <div className="d-table-cell align-middle text-center">
                                <p
                                    className="font-weight-normal text-light mb-3"
                                    style={{
                                        fontSize: '1.3rem',
                                        lineHeight: '1.5'
                                    }}
                                >
                                    <Translation>
                                        {(t) => <>{t('main.pageError')}</>}
                                    </Translation>
                                </p>
                                <img
                                    src={FUNNY}
                                    alt=""
                                    className="img-fluid"
                                    width="50"
                                />
                            </div>
                        </div>
                    </div>
                </div>
          
        )
    }
}
