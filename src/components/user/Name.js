import React, { Component } from 'react'
import PROFILE from '../../assets/images/profile.jpg'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import BG from '../../assets/images/user-bg.jpg'

class Name extends Component 
{
    render() {

        const { user } = this.props

        return (
            <div
                className="py-5 px-2 position-relative"
                style={{
                    marginTop: '-56px',
                    background: "url("+ BG +") no-repeat left top",
                    backgroundSize: 'cover'
                }}
            >
                {
                    user === null ? (
                        this.props.facebook.map((p) => (
                            <div key={p.name} className="d-flex flex-column justify-content-center align-items-center">
                                {
                                    p.picture &&
                                    p.picture.data &&
                                        <img
                                            src={p.picture.data.url}
                                            alt=""
                                            className="mb-2 rounded-circle shadow"
                                            style={{
                                                width: '80px',
                                                height: '80px'
                                            }}
                                        />
                                }
                                <h4
                                    className="font-weight-normal my-0 text-light text-center"
                                    style={{
                                        lineHeight: '1.5', 
                                        fontSize: '1rem'
                                    }}
                                >
                                    {p.name}<br />
                                    <small className="text-muted">{user.email}</small>
                                </h4>
                            </div>
                        ))
                    ) : (
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            {
                                user.photoURL === null ? 
                                    <img
                                        src={PROFILE}
                                        alt={user.displayName}
                                        className="mb-2 rounded-circle shadow"
                                        style={{
                                            width: '80px',
                                            height: '80px'
                                        }}
                                    />
                                    :
                                    <img
                                        src={user.photoURL}
                                        alt={user.displayName}
                                        className="mb-2 rounded-circle shadow"
                                        style={{
                                            width: '80px',
                                            height: '80px'
                                        }}
                                    />
                            }
                        
                            <h4
                                className="font-weight-normal my-0 text-light text-center"
                                style={{
                                    lineHeight: '1.5', 
                                    fontSize: '1rem'
                                }}
                            >
                                {
                                    user.displayName && (
                                        <>{user.displayName}<br /></>
                                    )
                                }
                                <small className="text-white-50">{user.email}</small>
                            </h4>
                        </div>
                    )
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    facebook: state.facebook
})

export default connect(
    mapStateToProps
)(withRouter(Name))