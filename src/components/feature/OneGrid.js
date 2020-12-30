import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import IMG from '../../assets/images/ios-new.jpg'
import { Translation } from 'react-i18next'

class OneGrid extends Component 
{
    render() {
        return (
            <div className="pt-0 pb-5">
                <div className="container">
                    <Link
                        to="/"
                        className="text-decoration-none text-transparent link-default-hover"
                    >
                        <div
                            className="px-4"
                            style={{
                                background: "transparent url("+ IMG +") no-repeat center / cover",
                                paddingTop: '6rem',
                                paddingBottom: '6rem'
                            }}
                        >
                            <div
                                className="col-12 col-sm-8 col-md-6 col-lg-4"
                            >
                                <h4
                                    className="mb-3 font-weight-normal"
                                    style={{
                                        fontSize: '1.8rem',
                                        lineHeight: '1.35',
                                        color: '#fe9902'
                                    }}
                                >
                                    <Translation>
                                        {(t) => <>{t('main.ios')}</>}
                                    </Translation>
                                </h4>
                                <p
                                    className="mb-4 font-weight-normal text-light"
                                    style={{
                                        fontSize: '0.9rem',
                                        lineHeight: '1.5'
                                    }}
                                >
                                    <Translation>
                                        {(t) => <>{t('main.fitness.p')}</>}
                                    </Translation>
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        )
    }
}

export default withRouter(OneGrid)