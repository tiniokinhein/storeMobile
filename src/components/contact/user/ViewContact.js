import React , { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { GoPlus } from 'react-icons/go'
import { Translation } from 'react-i18next'
import { agentAddContact } from '../../../store/agentContact/actions'

const ViewContact = ({agent , agentAddContact }) => {

    // This is onClick with Dynamics
    const [ clicked , setClicked ] = useState(-1)

    const ref = useRef()

    useEffect(() => {
        ref.current = clicked
    }, [clicked])

    const handleClick = (e , i) => {
        setClicked(ref.current === i ? -1 : i)
    }
    // End This is onClick with Dynamics -- See button onClick(), className

    const nameCss = {
        fontSize: '0.9rem',
        color: '#000',
        lineHeight: '1.5',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    }

    const addressCss = {
        fontSize: '0.7rem',
        lineHeight: '1.5',
    }

    const agentCreateContactOpen = () => {
        document.getElementById('agent_create_contact').style.left = '0%'
    }

    return (
        <div className="d-flex">
            {
                agent.length ? (
                    <>
                    <div className="col-6 col-sm-8 col-lg-9 pl-2 pr-1">
                        
                            {
                                agent.map(p => (
                                    <div 
                                        key={p.id}
                                        className=""
                                    >
                                        <button
                                            className={`btn w-100 h-100 rounded-0 border-0 shadow-none p-0 text-left btn-contact-hover ${p.id === clicked ? 'onClicked' : ''}`}
                                            onClick={e => {
                                                agentAddContact(p)
                                                handleClick(e , p.id)
                                            }}
                                        >
                                            <div className="bg-light rounded-sm p-3 h-100 btn-div-hover mx-2">
                                                {
                                                    p.name &&
                                                        <h4
                                                            className="mb-1 font-weight-normal"
                                                            style={nameCss}
                                                        >
                                                            {p.name}
                                                        </h4>
                                                }
                                                {
                                                    p.addressPhone &&
                                                        <p
                                                            className="mb-1 text-muted font-weight-bold"
                                                            style={addressCss}
                                                        >
                                                            {p.addressPhone}
                                                        </p>
                                                }
                                                <p
                                                    className="mb-0 text-muted font-weight-normal"
                                                    style={addressCss}
                                                >
                                                    {
                                                        p.home_no &&
                                                            <>{p.home_no}<br /></>
                                                    }
                                                    {
                                                        p.street_quarter &&
                                                            <>{p.street_quarter}<br /></>
                                                    }
                                                    {
                                                        p.township &&
                                                            <>{p.township}<br /></>
                                                    }
                                                </p>                                    
                                            </div>
                                        </button>
                                    </div>
                                ))
                            }
                       
                    </div>
                    <div 
                        className="col-6 col-sm-4 col-lg-3 pr-3 pl-1"
                    >
                        <button
                            className="btn bg-light rounded-sm border-0 shadow-none d-flex btn-cart-hover h-100 w-100"
                            style={{
                                color: '#000'
                            }}
                            onClick={agentCreateContactOpen.bind(this)}
                        >
                            <div className="p-3 w-100 align-self-center">
                                <GoPlus />  
                                <span style={{fontSize:'0.6rem'}} className="d-block mt-1">
                                    <Translation>
                                        {(t) => <>{t('main.add.new.address')}</>}
                                    </Translation>
                                </span>
                            </div>
                        </button>
                    </div>
                    </>
                    // <>
                    //     {
                    //         agent.slice(0,3).map(p => (
                    //             <div 
                    //                 key={p.id}
                    //                 className="col-6 col-sm-4 col-lg-3 my-1 px-1"
                    //             >
                    //                 <button
                    //                     className={`btn w-100 h-100 rounded-0 border-0 shadow-none p-0 text-left btn-cart-hover ${p.id === clicked ? 'onClicked' : ''}`}
                    //                     onClick={e => {
                    //                         agentAddContact(p)
                    //                         handleClick(e , p.id)
                    //                     }}
                    //                 >
                    //                     <div className="bg-light p-3 h-100 btn-div-hover">
                    //                         {
                    //                             p.name &&
                    //                                 <h4
                    //                                     className="mb-1 font-weight-normal"
                    //                                     style={nameCss}
                    //                                 >
                    //                                     {p.name}
                    //                                 </h4>
                    //                         }
                    //                         {
                    //                             p.addressPhone &&
                    //                                 <p
                    //                                     className="mb-1 text-muted font-weight-bold"
                    //                                     style={addressCss}
                    //                                 >
                    //                                     {p.addressPhone}
                    //                                 </p>
                    //                         }
                    //                         <p
                    //                             className="mb-0 text-muted font-weight-normal"
                    //                             style={addressCss}
                    //                         >
                    //                             {
                    //                                 p.home_no &&
                    //                                     <>{p.home_no}<br /></>
                    //                             }
                    //                             {
                    //                                 p.street_quarter &&
                    //                                     <>{p.street_quarter}<br /></>
                    //                             }
                    //                             {
                    //                                 p.township &&
                    //                                     <>{p.township}<br /></>
                    //                             }
                    //                         </p>                                    
                    //                     </div>
                    //                 </button>
                    //             </div>
                    //         ))
                    //     }
                    //     <div 
                    //         className="col-6 col-sm-4 col-lg-3 my-1 px-1"
                    //     >
                    //         <Link
                    //             to="/add-address"
                    //             className="d-flex bg-light text-decoration-none text-center btn-cart-hover h-100 w-100"
                    //             style={{
                    //                 color: '#000',
                    //             }}
                    //         >
                    //             <div className="p-3 w-100 align-self-center">
                    //                 <GoPlus />  
                    //                 <span style={{fontSize:'0.6rem'}} className="d-block mt-1">
                    //                     <Translation>
                    //                         {(t) => <>{t('main.add.new.address')}</>}
                    //                     </Translation>
                    //                 </span>
                    //             </div>
                    //         </Link>
                    //     </div>
                    // </>
                ) : (
                    <div 
                        className="col-6 col-sm-4 col-lg-3 pl-3 pr-0"
                    >
                        <button
                            className="btn bg-light p-0 rounded-sm border-0 shadow-none btn-cart-hover w-100"
                            style={{
                                color: '#000',
                                height: '128px'
                            }}
                            onClick={agentCreateContactOpen}
                        >
                            <div className="p-3 w-100 align-self-center">
                                <GoPlus />  
                                <span style={{fontSize:'0.6rem'}} className="d-block mt-1">
                                    <Translation>
                                        {(t) => <>{t('main.add.new.address')}</>}
                                    </Translation>
                                </span>
                            </div>
                        </button>
                    </div>
                )
            }
                        
        </div>
    )
}

ViewContact.propTypes = {
    agentAddContact: PropTypes.func.isRequired
}

export default connect(null, {agentAddContact})(ViewContact)