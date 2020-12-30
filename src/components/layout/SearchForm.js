import React, { Component } from 'react'
import { RiSearchLine } from 'react-icons/ri'
import { Translation } from 'react-i18next'
import { withRouter } from 'react-router-dom'

class SearchForm extends Component {

    state = {
        productName: ''
    }

    handleSearchInput = e => {
        this.setState({
            productName: e.target.value
        })
    }

    handleSearchSubmit = () => {
        if(this.state.productName) {
            let text = this.state.productName

            this.setState({
                productName: ''
            })

            this.props.history.push({
                pathname: `/search/product=${text}`,
                state: {
                    productName: text
                }
            })
        }
    }

    handleSearchKeyUp = e => {
        e.preventDefault()

        if(e.key === 'Enter' && e.keyCode === 13) {
            this.handleSearchSubmit()
        }
    }

    handleFormSubmit = e => e.preventDefault()

    render() {

        return (
            <form
                onSubmit={this.handleFormSubmit}
                className="w-100 d-flex position-relative border-0 bg-white rounded-lg"
                // id="search-form"
            >
                <Translation>
                    {
                        (t) =>
                            <input
                                className="form-control bg-transparent font-weight-normal change-input-placeholder border-0 rounded-0 text-custom shadow-none px-3 py-1"
                                style={{
                                    height: '40px',
                                    lineHeight: '1.6em',
                                    fontSize: '1rem'
                                }}
                                type="text"
                                placeholder={t('main.search.placeholder')}
                                value={this.state.productName}
                                onChange={this.handleSearchInput}
                                onKeyUp={this.handleSearchKeyUp}
                                // onFocus={() => {
                                //     this.showProductOnBar()
                                //     this.showTopBarBG()
                                // }}
                                // onBlur={this.closeTopBarBG}
                            />
                    }
                </Translation>
                <button
                    className="btn bg-transparent shadow-none py-0 px-0 text-custom border-0 rounded-0"
                    style={{
                        fontSize: '16px',
                        width: '40px',
                        height: '40px',
                        lineHeight: '0'
                    }}
                    onClick={this.handleSearchSubmit}
                    tappable="true"
                >
                    <RiSearchLine />
                </button>
            </form>
        )
    }
}

export default withRouter(SearchForm)