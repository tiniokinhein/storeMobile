import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { addContact , removeContact } from '../../store/contact/actions'
import { Translation } from 'react-i18next'
import { GrClose } from 'react-icons/gr'

class EditContact extends Component 
{
    static propTypes = {
        addContact: PropTypes.func.isRequired,
        removeContact: PropTypes.func.isRequired,
        address_contact: PropTypes.array.isRequired
    }

    state = {
        name: this.props.address_contact.length ? this.props.address_contact.map(p => p.name) : '',
        email: this.props.address_contact.length ? this.props.address_contact.map(p => p.email) : '',
        phone: this.props.address_contact.length ? this.props.address_contact.map(p => p.phone) : '',
        home_no: this.props.address_contact.length ? this.props.address_contact.map(p => p.home_no) : '',
        street_quarter: this.props.address_contact.length ? this.props.address_contact.map(p => p.street_quarter) : '',
        township: this.props.address_contact.length ? this.props.address_contact.map(p => p.township) : '',
        regexp : /^[0-9\b]+$/
    }

    handleOnChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleOnPhoneChange = e => {
        let telephone = e.target.value
        if (telephone === '' || this.state.regexp.test(telephone)) {
            this.setState({ 
                [e.target.name]: telephone 
            })
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.address_contact !== this.props.address_contact) {
            this.setState({
                name: nextProps.address_contact.length ? nextProps.address_contact.map(p => p.name) : '',
                email: nextProps.address_contact.length ? nextProps.address_contact.map(p => p.email) : '',
                phone: nextProps.address_contact.length ? nextProps.address_contact.map(p => p.phone) : '',
                home_no: nextProps.address_contact.length ? nextProps.address_contact.map(p => p.home_no) : '',
                street_quarter: nextProps.address_contact.length ? nextProps.address_contact.map(p => p.street_quarter) : '',
                township: nextProps.address_contact.length ? nextProps.address_contact.map(p => p.township) : ''
            })
        }
    }

    resetForm = () => {
        this.setState({
            name: this.props.address_contact.length ? this.props.address_contact.map(p => p.name) : '',
            email: this.props.address_contact.length ? this.props.address_contact.map(p => p.email) : '',
            phone: this.props.address_contact.length ? this.props.address_contact.map(p => p.phone) : '',
            home_no: this.props.address_contact.length ? this.props.address_contact.map(p => p.home_no) : '',
            street_quarter: this.props.address_contact.length ? this.props.address_contact.map(p => p.street_quarter) : '',
            township: this.props.address_contact.length ? this.props.address_contact.map(p => p.township) : ''
        })
    }

    closeContact = () => {
        document.getElementById('edit_contact').style.left = '-100%'
    }

    render() {

        const {  addContact , removeContact } = this.props

        return (
            <div 
                id="edit_contact"
                className="position-fixed"
                style={{
                    left: '-100%',
                    top: '0',
                    bottom: '0',
                    width: '100%',
                    zIndex: '9999999999',
                    transition: 'left 0.3s cubic-bezier(0.6, 0.04, 0.8, 0.43)'
                }}
            >
                <div className="row h-100 mx-0">
                    <div
                        className="col-12 col-md-6 col-lg-4 bg-white shadow-none overlay-y-flow h-100 p-5 position-relative"
                        style={{
                            overflowY: 'scroll'
                        }}
                    >
                        <div 
                            className="position-absolute"
                            style={{
                                right: '9px',
                                top: '5px'
                            }}
                        >
                            <button
                                className="btn btn-transparent p-0 rounded-0 border-0 shadow-none text-center"
                                style={{
                                    fontSize: '1.6rem',
                                    width: '40px',
                                    height: '40px',
                                    lineHeight: '0',
                                    color: '#000'
                                }}
                                onClick={() => {
                                    this.closeContact()
                                    this.resetForm()
                                }}
                            >
                                <GrClose />
                            </button>
                        </div>

                        <div className="mb-4">
                            <h4
                                className="font-weight-normal mb-0 text-default"
                                style={{
                                    fontSize: '1.25rem',
                                    lineHeight: '1.5',
                                    color: '#000'
                                }}
                            >
                                <Translation>
                                    {(t) => <>{t('main.shipping.address.update')}</>}
                                </Translation>
                            </h4>
                            <small
                                className="d-inline-block text-muted font-italic"
                                style={{
                                    lineHeight: '1.5',
                                    fontSize: '0.7rem'
                                }}
                            >
                                <Translation>
                                    {(t) => <>{t('main.update.contact.info')}</>}
                                </Translation>
                            </small>
                        </div>                    

                        <div 
                            className="pt-1"
                        >
                            <div className="form-group mb-4">
                                <Translation>
                                    {
                                        (t) => 
                                            <input
                                                type="text"
                                                name="phone"
                                                value={this.state.phone}
                                                onChange={this.handleOnPhoneChange.bind(this)}
                                                className="form-control bg-transparent shadow-sm px-3"
                                                required
                                                style={{
                                                    height: '45px',
                                                    border: '2px solid #000',
                                                    color: '#000',
                                                    borderRadius: '2px',
                                                    fontSize: '0.85rem'
                                                }}
                                                placeholder={'* ' + t('main.addressPhone')}
                                            />
                                    }
                                </Translation>                                
                            </div>
                            <div className="form-group mb-4">
                                <Translation>
                                    {
                                        (t) => 
                                            <input
                                                type="text"
                                                name="name"
                                                value={this.state.name}
                                                onChange={this.handleOnChange.bind(this)}
                                                className="form-control bg-transparent shadow-sm px-3"
                                                style={{
                                                    height: '45px',
                                                    border: '2px solid #000',
                                                    color: '#000',
                                                    borderRadius: '2px',
                                                    fontSize: '0.85rem'
                                                }}
                                                required
                                                placeholder={'* ' + t('main.addressName')}
                                            />
                                    }
                                </Translation>                                
                            </div>
                            <div className="form-group mb-4">
                                <Translation>
                                    {
                                        (t) => 
                                            <input
                                                type="email"
                                                name="email"
                                                value={this.state.email}
                                                onChange={this.handleOnChange.bind(this)}
                                                className="form-control bg-transparent shadow-sm px-3"
                                                style={{
                                                    height: '45px',
                                                    border: '2px solid #000',
                                                    color: '#000',
                                                    borderRadius: '2px',
                                                    fontSize: '0.85rem'
                                                }}
                                                placeholder={t('main.addressEmail')}
                                            />
                                    }
                                </Translation>                                
                            </div>                            
                            <div className="form-group mb-4">
                                <Translation>
                                    {
                                        (t) => 
                                            <input
                                                type="text"
                                                name="home_no"
                                                value={this.state.home_no}
                                                onChange={this.handleOnChange.bind(this)}
                                                className="form-control bg-transparent shadow-sm px-3"
                                                style={{
                                                    height: '45px',
                                                    border: '2px solid #000',
                                                    color: '#000',
                                                    borderRadius: '2px',
                                                    fontSize: '0.85rem'
                                                }}
                                                placeholder={'* ' + t('main.home.no')}
                                                required
                                            />
                                    }
                                </Translation>
                            </div>
                            <div className="form-group mb-4">
                                <Translation>
                                    {
                                        (t) => 
                                            <input
                                                type="text"
                                                name="street_quarter"
                                                value={this.state.street_quarter}
                                                onChange={this.handleOnChange.bind(this)}
                                                className="form-control bg-transparent shadow-sm px-3"
                                                style={{
                                                    height: '45px',
                                                    border: '2px solid #000',
                                                    color: '#000',
                                                    borderRadius: '2px',
                                                    fontSize: '0.85rem'
                                                }}
                                                placeholder={'* ' + t('main.street.quarter')}
                                                required
                                            />
                                    }
                                </Translation>
                            </div>
                            <div className="form-group mb-4">
                                <Translation>
                                    {
                                        (t) => 
                                            <input
                                                type="text"
                                                name="township"
                                                value={this.state.township}
                                                onChange={this.handleOnChange.bind(this)}
                                                className="form-control bg-transparent shadow-sm px-3"
                                                style={{
                                                    height: '45px',
                                                    border: '2px solid #000',
                                                    color: '#000',
                                                    borderRadius: '2px',
                                                    fontSize: '0.85rem'
                                                }}
                                                placeholder={'* ' + t('main.township')}
                                                required
                                            />
                                    }
                                </Translation>
                            </div>
                                                        
                            <div className="form-group mb-0">
                                {
                                    !this.state.phone ||
                                    !this.state.name ||
                                    !this.state.home_no ||
                                    !this.state.street_quarter ||
                                    !this.state.township ? (
                                        <button
                                            className="btn w-100 shadow-none border-0 rounded-0 text-light py-2 btn-cart-hover"
                                            style={{
                                                background: '#000',
                                                lineHeight: '2',
                                                fontSize: '1rem'
                                            }}
                                            disabled
                                        >
                                            <Translation>
                                                {(t) => <>{t('main.addressSave')}</>}
                                            </Translation>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                addContact({...this.state})
                                                this.closeContact()
                                                this.resetForm()
                                            }}
                                            className="btn bg-default w-100 shadow-none border-0 text-light py-2 btn-cart-hover"
                                            style={{
                                                background: '#000',
                                                lineHeight: '2',
                                                fontSize: '1rem',
                                                borderRadius: '2px'
                                            }}
                                        >
                                            <Translation>
                                                {(t) => <>{t('main.addressSave')}</>}
                                            </Translation>
                                        </button>
                                    )
                                }                                
                            </div>
                            <div className="form-group mb-0 mt-2">
                                <button
                                    onClick={() => {
                                        removeContact()
                                        this.closeContact()
                                        this.setState({
                                            name: '',
                                            email: '',
                                            phone: '',
                                            home_no: '',
                                            street_quarter: '',
                                            township: ''
                                        })
                                    }}
                                    className="btn w-100 shadow-sm border-0 text-light py-2 btn-danger"
                                    style={{
                                        lineHeight: '2',
                                        fontSize: '1rem',
                                        borderRadius: '2px'
                                    }}
                                >
                                    <Translation>
                                        {(t) => <>{t('main.addressDelete')}</>}
                                    </Translation>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div 
                        className="col-12 col-md-6 col-lg-8 d-none d-sm-flex h-100 px-0"
                        style={{
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            this.closeContact()
                            this.resetForm()
                        }}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    address_contact: state.contact
})

export default connect(mapStateToProps, {addContact,removeContact})(withRouter(EditContact))