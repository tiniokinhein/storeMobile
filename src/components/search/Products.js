import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Translation } from 'react-i18next'
import { currency } from '../../helpers/utils'
import { IonCol, IonGrid, IonRow } from '@ionic/react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { addWish , removeWish } from '../../store/whishlist/actions'


const FETCHIMG = process.env.REACT_APP_FETCH_IMAGES

class Products extends React.Component {

    static propTypes = {
        newWish: PropTypes.object,
        deleteWish: PropTypes.object,
        whishlists: PropTypes.array.isRequired
    }

    UNSAFE_componentWillReceiveProps(nextProps) {        
        if(nextProps.newWish !== this.props.newWish) {
            this.addWish(nextProps.newWish)
        }

        if(nextProps.deleteWish !== this.props.deleteWish) {
            this.removeWish(nextProps.deleteWish)
        }
    }

    addWish = p => {
        const { whishlists } = this.props
        let productInWish = false
        whishlists.forEach(c => {
            if(c.id === p.id) {
                productInWish = true
            }
        })
        if(!productInWish) {
            whishlists.push(p)
        }
    }

    removeWish = p => {
        const { whishlists } = this.props
        const index = whishlists.findIndex(f => f.id === p.id)
        if(index >= 0) {
            whishlists.splice(index,1)
        }
    }

    render() {
        const cssName = {
            name: {
                fontSize: '0.7rem',
                whiteSpace: 'nowrap'
            },
            titleName: {
                fontSize: '0.9rem',
                lineHeight: '2'
            },
            overflow: {
                overflowX: 'scroll'
            },
            pdLayout: {
                paddingLeft: '5px',
                paddingRight: '5px'
            },
            headName: {
                fontSize: '1rem',
                lineHeight: '1.7em'
            },
            borderadius: {
                borderRadius: '1rem'
            },
            border: {
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent'
            },
            lineLimit: {
                fontSize: '0.9rem',
                lineHeight: '1.6em',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical'
            },
            catName: {
                fontSize: '0.6rem',
                lineHeight: '1.6em'
            },
            wish: {
                borderRadius: 0,
                borderBottomLeftRadius: '1rem',
                width: '60px'
            }
        }

        return(
            <IonGrid>
                <IonRow>
                    {
                        this.props.products.map(p => {

                            const inWhish = this.props.whishlists ? this.props.whishlists.find(f => f.id === p.id) : null

                            return(
                                <IonCol key={p.slug} size="12" sizeMd="6">
                                    <div 
                                        className="bg-white overflow-hidden shadow d-flex align-items-center h-100 position-relative"
                                        style={{...cssName.borderadius}}
                                    >
                                        <div
                                            className="position-absolute"
                                            style={{
                                                right: 0,
                                                top: 0,
                                                zIndex: 1
                                            }}
                                        >
                                            {
                                                inWhish ? (
                                                    <button
                                                        className="btn p-0 shadow-none border-0"
                                                        onClick={() => this.props.removeWish(p)}
                                                        style={{
                                                            ...cssName.wish,
                                                            width: '60px',
                                                            height: '30px'
                                                        }}
                                                    >
                                                        <AiFillHeart size="1.5rem" className="text-custom" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn p-0 shadow-none border-0 bg-custom"
                                                        onClick={() => this.props.addWish(p)}
                                                        style={{
                                                            ...cssName.wish,
                                                            width: '60px',
                                                            height: '30px'
                                                        }}
                                                    >
                                                        <AiOutlineHeart size="1.5rem" className="text-light" />
                                                    </button>
                                                )
                                            }
                                        </div>

                                        <button
                                            onClick={() => {
                                                this.props.history.push(`/product/${p.slug}`)
                                                this.props.addView(p)
                                            }}   
                                            tappable="true"                                   
                                            className="btn text-transparent p-0 border-0 rounded-0 shadow-none h-100"
                                        >
                                            <img 
                                                src={FETCHIMG+`/${p.image}`} 
                                                alt={p.title} 
                                                style={{
                                                    width: '110px',
                                                    backgroundColor: '#fff4e2',
                                                    ...cssName.borderadius
                                                }}
                                                className="m-2"
                                            />  
                                        </button>

                                        <button
                                            onClick={() => {
                                                this.props.history.push(`/product/${p.slug}`)
                                                this.props.addView(p)
                                            }}    
                                            tappable="true"                                 
                                            className="btn text-left text-transparent w-100 pl-4 pr-2 py-2 border-0 rounded-0 shadow-none"
                                        >  
                                            <h4 
                                                className="mt-0 mb-2 text-black-50 font-weight-normal"
                                                style={cssName.catName}
                                            >                                                   
                                                <Translation>
                                                    {(t) => 
                                                        <>
                                                            {
                                                                t(
                                                                    'main.post.title',
                                                                    { 
                                                                        title_en: p.subcategory.title,
                                                                        title_mm: p.subcategory.title_mm
                                                                    }
                                                                )
                                                            }
                                                        </>
                                                    }
                                                </Translation>
                                            </h4>
                                            <h4 
                                                className="m-0 text-default"
                                                style={cssName.lineLimit}
                                            >                                                   
                                                <Translation>
                                                    {(t) => 
                                                        <>
                                                            {
                                                                t(
                                                                    'main.post.title',
                                                                    { 
                                                                        title_en: p.title,
                                                                        title_mm: p.title_mm
                                                                    }
                                                                )
                                                            }
                                                        </>
                                                    }
                                                </Translation>
                                            </h4>
                                            <div
                                                className="font-weight-bold text-custom text-left mt-2"
                                                style={{            
                                                    lineHeight: '1.6',
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                {p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <span className="text-muted font-weight-normal">{currency}</span>
                                            </div>
                                        </button> 
                                    </div>
                                </IonCol>
                            )
                        })
                    }
                </IonRow>
            </IonGrid>
        )
    }
}

const mapStateToProps = state => ({
    whishlists: state.whishlist.products,
    newWish: state.whishlist.productToAddWhish,
    deleteWish: state.whishlist.productToRemoveWhish
})

export default connect(
    mapStateToProps , 
    {
        addWish,
        removeWish
    }
)(withRouter(Products))