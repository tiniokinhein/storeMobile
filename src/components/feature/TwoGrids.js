import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import MK_PROMO_GIRL from '../../assets/images/mk_promo_g.png'
import MK_PROMO_BOY from '../../assets/images/mk_promo_b.png'
import ANDROID from '../../assets/images/playstore.png'

class TwoGrids extends Component 
{
    render() {

        const headTitle = {
            fontSize: '1.3rem',
            lineHeight: '1.2'
        }

        const paragh = {
            fontSize: '1rem',
            lineHeight: '1.8'
        }

        const cssName = {
            rounded: {
                borderRadius: '1.5rem'
            },
            pdLayout: {
                paddingLeft: '10px',
                paddingRight: '10px'
            }
        }

        return (
            <div className="pt-3 pb-4">
                <div 
                    style={cssName.pdLayout}
                >

                    <div className="row">

                        <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                            <div 
                                className="d-flex flex-column flex-md-row align-items-center p-4 bg-img-slide"
                            >
                                <div className="pr-md-5">
                                    <img
                                        src={MK_PROMO_GIRL}
                                        alt=""
                                        className="img-fluid w-50 image-left-animate"
                                    />
                                </div>
                                <div className="text-center text-md-left overflow-hidden">
                                    <h4
                                        className="text-custom font-weight-normal mb-3"
                                        style={headTitle}
                                    >
                                        သင်သိပါသလား ?
                                    </h4>
                                    <p
                                        className="text-default mb-0 font-weight-normal"
                                        style={paragh}
                                    >
                                        <strong>myKyat</strong> ငွေပေးချေစနစ် နှင့် ကုန်ပစ္စည်းဝယ်ယူတိုင်း
                                    </p>
                                    <p
                                        className="text-default mb-0 font-weight-normal"
                                        style={paragh}
                                    >
                                        <strong className="text-custom">(၃)</strong> ရာခိုင်နှုန်း စျေးလျော့ချနေပီဆိုတာ ...
                                    </p>
                                    <p
                                        className="text-default mb-0 font-weight-normal mt-4"
                                        style={paragh}
                                    >
                                        <strong>myKyat</strong> App ကို  <a 
                                                                            href="https://play.google.com/store/apps/details?id=com.FTP.myKyat_sun_2015&hl=en" 
                                                                            className="text-custom"
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"                                                
                                                                        >ဒီမှာ</a> ဒေါင်းယူလိုက်မယ်
                                    </p>
                                    <div
                                        className="mt-3"
                                    >
                                        <a
                                            href="https://play.google.com/store/apps/details?id=com.FTP.myKyat_sun_2015&hl=en"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-decoration-none"
                                        >
                                            <img
                                                src={ANDROID}
                                                alt="Android App"
                                                width="135"                                            
                                                className="rounded-lg"
                                                style={{
                                                    background: '#000',
                                                    border: '1px solid #fff'
                                                }}
                                            />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-6 h-100">
                            <div 
                                className="d-flex flex-column flex-md-row align-items-center p-4 h-100 bg-img-slide"
                            >
                                <div className="text-center text-md-right mb-4 mb-md-0 overflow-hidden">
                                    <h4
                                        className="text-custom font-weight-normal mb-3"
                                        style={headTitle}
                                    >
                                        မမေ့နဲ့ဦးနော် 
                                    </h4>
                                    <p
                                        className="text-default mb-0 font-weight-normal"
                                        style={paragh}
                                    >
                                        <strong>myKyat</strong> App ကို သုံးပြီး အကောင့်မှတ်ပုံတင်ထားဖို့
                                    </p>
                                </div>
                                <div className="pl-md-5">
                                    <img
                                        src={MK_PROMO_BOY}
                                        alt=""
                                        className="img-fluid w-50 image-right-animate"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(TwoGrids)