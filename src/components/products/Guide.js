import React, { Component } from 'react'
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'

export default class Guide extends Component {
    state = {
        show: false
    }

    openGuide = () => {
        document.getElementsByClassName('open-guide')[0].style.bottom = '0'
        document.getElementsByClassName('open-guide')[0].classList.add('close-guide')
        this.setState({
            show: true
        })
    }

    closeGuide = () => {
        document.getElementsByClassName('close-guide')[0].style.bottom = '-215.46px'
        document.getElementsByClassName('open-guide')[0].classList.remove('close-guide')
        this.setState({
            show: false
        })
    }

    render() {

        const openGuideCss = {
            right: '50%',
            bottom: '-215.46px',
            zIndex: '99',
            transition: 'bottom 0.15s ease-in-out'
        }

        const innerDivCss = {
            width: '260px',
            maxWidth: '100%',
            marginTop: '-37px',
            borderTopRightRadius: '3px',
            borderTopLeftRadius: '3px'
        }

        const buttonHelpCss = {
            fontSize: '0.9rem',
            height: '37px',
            lineHeight: '1.5',
            borderRadius: '0',
            borderTopRightRadius: '3px',
            borderTopLeftRadius: '3px'
        }

        const pCss = {
            fontSize: '0.8rem',
            lineHeight: '2',
            borderBottom: '1px solid #003457'
        }

        const nCss = {
            fontSize: '0.7rem',
            lineHeight: '1.5'
        }

        const helpText =
            <div
                className=""
                style={{
                    background: '#002f55'
                }}
            > 
                <p className="px-4 mb-0 py-2 text-light" style={pCss}>
                    အရောင် နှင့် အရွယ်အစားကို ရွေးပါ၊
                </p>
                <p className="px-4 py-2 mb-0 text-light" style={pCss}>
                    စျေးခြင်းထဲ ထည့်မည်၊<br />
                    <small className="text-white">(သို့မဟုတ်)</small><br />
                    ဝယ်ယူမည်၊
                </p>
            </div>

        const helpNoti =
            <div className="px-4 py-2 bg-default">
                <small className="text-light d-inline-block" style={nCss}>
                    အရောင် နှင့် အရွယ်အစားကို မရွေးထားပါက စျေးခြင်းထဲ ထည့်လို့ မရပါ၊ ဝယ်ယူလို့ မရပါ၊
                </small>
            </div>

        return (
            <div className="d-none d-sm-block position-fixed open-guide" style={openGuideCss}>
                <div className="mx-3 shadow-lg" style={innerDivCss}>
                    <button
                        className="btn bg-default w-100 text-left text-white px-4 py-2 shadow-none border-0 position-relative"
                        style={buttonHelpCss}
                        onClick={this.state.show === false ? this.openGuide : this.closeGuide}
                    >
                        အကူအညီ
                            <span
                                className="d-inline-block float-right position-absolute"
                                style={{
                                    right: '1.5rem',
                                    top: '-17.45px'
                                }}
                            >
                            <span className="arr-up text-light px-2 bg-default rounded-top">
                                <IoIosArrowUp />
                            </span>
                            <span className="arr-down text-light px-2 bg-default rounded-top">
                                <IoIosArrowDown />
                            </span>
                        </span>
                    </button>
                    {helpText}
                    {helpNoti}
                </div>
            </div>
        )
    }
}
