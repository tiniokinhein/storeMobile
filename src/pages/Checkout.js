import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import shortId from 'shortid'
import { withRouter } from 'react-router-dom'
import { ORDERURL , AGENTS } from '../helpers/api'
import { auth, db } from '../helpers/firebase'
import { loadCart, removeProduct, changeProductQuantity } from '../store/cart/actions'
import { updateTotalCart } from '../store/total/actions'
import OrderItems from '../components/checkout/OrderItems'
import { currency } from '../helpers/utils'
import { nanoid } from 'nanoid'
import COD_IMG from '../assets/images/cod.png'
import MYKYAT_IMG from '../assets/images/myKyat.png'
import MYKYAT_LOG from '../assets/images/myKyat_log.png'
import
MYKYAT_API,
{
    PROVIDER_ID,
    SECRET_KEY,
    MERCHANT_ID,
    PRE_AUTH,
    PURCHASE_NEXT
} from '../myKyat'
import Modal from 'react-modal'
import axios from 'axios'
import { FiPlus } from 'react-icons/fi'
import { MdMail, MdArrowBack, MdArrowForward } from 'react-icons/md'
import { FaUser, FaMobile, FaMapMarkerAlt, FaRegTrashAlt } from 'react-icons/fa'
import { Translation } from 'react-i18next'
import { RiCloseLine } from 'react-icons/ri'
import { FiCheck } from 'react-icons/fi'
import FUNNY from '../assets/images/funny.gif'
import { removeContact } from '../store/contact/actions'
import ViewContact from '../components/contact/user/ViewContact'
import { agentRemoveContact, agentAddContact } from '../store/agentContact/actions'
import Loading from '../components/layout/Loading'
import { addOrder } from '../store/order/actions'
import { v4 as uuidv4 } from 'uuid'
import { addOrderLink } from '../store/orderTemLink/actions'
import { addMyKyat, removeMyKyat } from '../store/myKyat/actions'
import Skeleton from 'react-loading-skeleton'
import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/react'


Modal.setAppElement('#root')

const generateDate = () => {

    const now = new Date()

    const options = {
        day: "numeric",
        month: "long",
        year: "numeric"

    }

    const year = now.getFullYear()

    let month = now.getMonth() + 1
    if (month < 10) {
        month = `0${month}`
    }

    let day = now.getDate()
    if (day < 10) {
        day = `0${day}`
    }

    const hour = now.getHours()

    const minute = now.getMinutes()

    return {
        formatted: `${year}-${month}-${day}-${hour}-${minute}`,
        pretty: now.toLocaleDateString("en-US", options)
    }
}

class Checkout extends Component {
    static propTypes = {
        address_contact: PropTypes.array.isRequired,
        removeContact: PropTypes.func.isRequired,
        agent_address_contact: PropTypes.array.isRequired,
        agentAddContact: PropTypes.func.isRequired,
        agentRemoveContact: PropTypes.func.isRequired,
        loadCart: PropTypes.func.isRequired,
        removeProduct: PropTypes.func,
        changeProductQuantity: PropTypes.func,
        updateTotalCart: PropTypes.func.isRequired,
        cartProducts: PropTypes.array.isRequired,
        newProduct: PropTypes.object,
        productToRemove: PropTypes.object,
        productToChange: PropTypes.object,
        addOrder: PropTypes.func.isRequired,
        addOrderLink: PropTypes.func.isRequired,
        addMyKyat: PropTypes.func.isRequired,
        removeMyKyat: PropTypes.func.isRequired
    }

    _isMounted = false

    state = {
        user: auth.currentUser,
        delivery: 'ပုံမှန်ကြာချိန် (၂)ရက်',
        // delivery_fee: 0,
        delivery_fee: 2500,
        payment: auth.currentUser === null ? 'ပစ္စည်းရောက် ငွေရှင်းစနစ်' : 'MyKyat payment',
        mykyat_login: '',
        mykyat_password: '',
        show: false,
        show1: false,
        show2: false,
        show3: false,
        loadShow: false,
        encrypt_auth: '',
        decrypt_auth: '',
        encrypt_purchase: '',
        decrypt_purchase: '',
        isOpened: false,
        acc_loading: this.props.location.state,
        agent: []
    }

    getAgent = () => {
        this._isMounted = true

        if (this.state.user) {
            db
                .ref(AGENTS + `/${this.state.user.uid}/addresses`)
                .orderByChild('dateFormatted')
                .on('value', snapshot => {
                    let lists = []
                    snapshot.forEach(snap => {
                        lists.push(snap.val())
                    })

                    const data = lists.reverse()

                    if (this._isMounted) {
                        this.setState({
                            agent: data
                        })
                    }
                })
        }
    }

    componentDidMount() {
        this._isMounted = true

        auth.onAuthStateChanged((user) => {
            if (this._isMounted) {
                if (user) {
                    this.setState({
                        user: auth.currentUser
                    })
                } else {
                    this.setState({
                        user: null
                    })
                }
            }
        })

        this.getAgent()

        window.scrollTo(0, 0)
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.productToRemove !== this.props.productToRemove) {
            this.removeProduct(nextProps.productToRemove)
        }
        if (nextProps.productToChange !== this.props.productToChange) {
            this.changeProductQuantity(nextProps.productToChange)
        }
    }

    removeProduct = product => {
        const { cartProducts, updateTotalCart } = this.props
        const index = cartProducts.findIndex(p => p.id === product.id)
        if (index >= 0) {
            cartProducts.splice(index, 1)
            updateTotalCart(cartProducts)
        }
    }

    changeProductQuantity = changedProduct => {
        const { cartProducts, updateTotalCart } = this.props
        const product = cartProducts.find(p => p.id === changedProduct.id)
        product.quantity = changedProduct.quantity
        if (product.quantity <= 0) {
            this.removeProduct(product)
        }
        updateTotalCart(cartProducts)
    }

    resetField = () => {
        this.setState({
            delivery: 'ပုံမှန်ကြာချိန် (၂)ရက်',
            delivery_fee: 0,
            payment: 'ပစ္စည်းရောက် ငွေရှင်းစနစ်',
            mykyat_login: '',
            mykyat_password: '',
            show: false,
            show1: false,
            show2: false,
            show3: false,
            loadShow: false,
            encrypt_auth: '',
            decrypt_auth: '',
            encrypt_purchase: '',
            decrypt_purchase: '',
            isOpened: false,
            acc_loading: this.props.location.state
        })
    }

    encryptAuthLogin = e => {
        e.preventDefault()

        this.setState({
            acc_loading: true
        })

        this.loadModal()

        const merchantId = MERCHANT_ID
        const currencyId = 'MMK'
        const amount = this.allTotalPrice()
        const purchaseMessage = `${this.state.mykyat_login} purchased`
        const myKyat_loginname = this.state.mykyat_login
        const myKyat_password = this.state.mykyat_password
        const ENC = `${merchantId}~${currencyId}~${amount}~${purchaseMessage}~${myKyat_loginname}~${myKyat_password}`

        let aes = new MYKYAT_API()
        let encrypted_auth = aes.encrypt(SECRET_KEY, ENC)

        axios
            .post(
                PRE_AUTH,
                {
                    data: encrypted_auth,
                    providerId: PROVIDER_ID
                },
                {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }
            )
            .then(res => {
                const data = res.data.data

                let aes = new MYKYAT_API()
                let decrypted = aes.decrypt(SECRET_KEY, data)

                var arr = decrypted.split("~")

                // Check out state of decrypt_auth
                var mk_displayName = arr[7]
                var mk_Id = arr[5]
                var mk_fee = parseFloat(arr[4])
                var mk_transactionId = arr[1]
                // End Check out state of decrypt_auth

                // IF myKyat have discount for purchasing
                var {delivery_fee} = this.state
                var mk_discount = 3
                // End if myKyat have discount for purchasing

                var productPrice = this.props.cartTotal.totalPrice / 100 * mk_discount

                var allProductPrice = productPrice + mk_fee + delivery_fee


                this.props.addMyKyat({
                    id: mk_Id,
                    displayName: mk_displayName,
                    fee: mk_fee,
                    transactionId: mk_transactionId,
                    productPrice: allProductPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                })

                this.setState({
                    encrypt_auth: data,
                    decrypt_auth: arr,
                    acc_loading: false
                })

                if (this.state.decrypt_auth[0] === '0') {
                    this.showModal2()
                    this.closeModal()
                }

                if (this.state.decrypt_auth[1] === 'Cash is not enough!') {
                    this.showModal1()
                    this.closeModal()
                }

            })
            .catch(err => console.log(err))

    }

    encryptPurchaseContinue = e => {
        e.preventDefault()

        this.setState({
            acc_loading: true
        })

        const { encrypt_auth } = this.state
        let aes = new MYKYAT_API()
        let decrypted = aes.decrypt(SECRET_KEY, encrypt_auth)

        const merchantId = MERCHANT_ID
        const amount = this.allTotalPrice()
        const purchaseMessage = `${this.state.mykyat_login} purchased`

        var arr = decrypted.split("~")
        var decryptedCode = arr[1] + "~" + merchantId + "~" + arr[3] + "~" + amount + "~" + purchaseMessage + "~" + arr[5] + "~" + arr[6]

        let encrypted = aes.encrypt(SECRET_KEY, decryptedCode)

        axios
            .post(
                PURCHASE_NEXT,
                {
                    data: encrypted,
                    providerId: PROVIDER_ID
                },
                {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }
            )
            .then(res => {
                const data = res.data.data

                let aes = new MYKYAT_API()
                let decrypted = aes.decrypt(SECRET_KEY, data)

                var arr = decrypted.split("~")

                this.setState({
                    encrypt_purchase: data,
                    decrypt_purchase: arr,
                    acc_loading: false
                })

                if (this.state.decrypt_purchase[0] === '0') {
                    this.resetField()
                    this.showModal3()
                }

                if (this.state.decrypt_purchase[0] === '1') {
                    this.showModal3()
                }
            })
            .catch(err => console.log(err))

    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    showModal = () => {
        this.setState({
            show: true
        })
    }

    closeModal = () => {
        this.setState({
            show: false
        })
    }

    showModal1 = () => {
        this.setState({
            show1: true
        })
    }

    closeModal1 = () => {
        this.setState({
            show1: false
        })
    }

    showModal2 = () => {
        this.setState({
            show2: true
        })
    }

    closeModal2 = () => {
        this.setState({
            show2: false
        })
    }

    showModal3 = () => {
        this.setState({
            show3: true
        })
    }

    closeModal3 = () => {
        this.setState({
            show3: false
        })
    }

    loadModal = () => {
        this.setState({
            loadShow: true
        })
    }

    closeLoadModal = () => {
        this.setState({
            loadShow: false
        })
    }

    handleCODSubmit = e => {
        e.preventDefault()

        const date = generateDate()

        const invocieID = shortId.generate()

        const sID = nanoid(28)

        // const discount_price = this.props.cartTotal.totalPrice / 100 * 3

        const delivery_fee = this.state.delivery_fee

        const subtotal = this.props.cartTotal.totalPrice

        const total = this.props.cartTotal.totalPrice + delivery_fee

        const { address_contact, agent_address_contact, addOrder, addOrderLink, myKyatId, removeMyKyat } = this.props

        const orderItems = {
            checkout: {
                contact: {
                    name: address_contact[0] && address_contact[0].name,
                    email: address_contact[0] && address_contact[0].email,
                    phone: address_contact[0] && address_contact[0].phone,
                    home_no: address_contact[0] && address_contact[0].home_no,
                    street_quarter: address_contact[0] && address_contact[0].street_quarter,
                    township: address_contact[0] && address_contact[0].township,
                    dateFormatted: date.formatted,
                    datePretty: date.pretty,
                    dateRaw: new Date().toISOString()
                },
                payment: this.state.payment,
                user: 'None'
            },
            adminNotify: true,
            notify: true,
            id: sID.toLowerCase(),
            uuid: uuidv4(),
            invoice_number: 'bgstore-' + invocieID,
            status: 'Pending',
            status_mm: 'ဆိုင်းငံ့',
            products: {
                orderItems: this.props.cartProducts.map(p => {
                    const item_total = p.price * p.quantity
                    if (p.color && p.size) {
                        return {
                            id: p.id,
                            title: p.title,
                            title_mm: p.title_mm,
                            image: p.image,
                            price: p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                            color: p.selected_color,
                            size: p.selected_size,
                            quantity: p.quantity,
                            item_total: item_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        }
                    } else {
                        return {
                            id: p.id,
                            title: p.title,
                            title_mm: p.title_mm,
                            image: p.image,
                            price: p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                            quantity: p.quantity,
                            item_total: item_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        }
                    }
                }),
                delivery: this.state.delivery,
                delivery_fee: this.state.delivery_fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                discount_price: null,
                myKyat_discount: null,
                subtotal: subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                total: total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        }

        const agent_orderItems = {
            checkout: {
                contact: {
                    name: agent_address_contact[0] && agent_address_contact[0].name,
                    email: agent_address_contact[0] && agent_address_contact[0].email,
                    phone: agent_address_contact[0] && agent_address_contact[0].addressPhone,
                    home_no: agent_address_contact[0] && agent_address_contact[0].home_no,
                    street_quarter: agent_address_contact[0] && agent_address_contact[0].street_quarter,
                    township: agent_address_contact[0] && agent_address_contact[0].township,
                    dateFormatted: date.formatted,
                    datePretty: date.pretty,
                    dateRaw: new Date().toISOString()
                },
                payment: this.state.payment,
                user: {
                    name: this.state.user && this.state.user.providerData[0].displayName,
                    email: this.state.user && this.state.user.providerData[0].email,
                    id: this.state.user && this.state.user.providerData[0].uid,
                    provider: this.state.user && this.state.user.providerData[0].providerId,
                    phone: this.state.user && this.state.user.providerData[0].phoneNumber,
                    profileImg: this.state.user && this.state.user.providerData[0].photoURL
                }
            },
            agent_id: this.state.user && this.state.user.providerData[0].uid,
            adminNotify: true,
            notify: true,
            id: sID.toLowerCase(),
            uuid: uuidv4(),
            invoice_number: 'bgstore-' + invocieID,
            status: 'Pending',
            status_mm: 'ဆိုင်းငံ့',
            products: {
                orderItems: this.props.cartProducts.map(p => {
                    const item_total = p.price * p.quantity
                    if (p.color && p.size) {
                        return {
                            id: p.id,
                            title: p.title,
                            title_mm: p.title_mm,
                            image: p.image,
                            price: p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                            color: p.selected_color,
                            size: p.selected_size,
                            quantity: p.quantity,
                            item_total: item_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                    } else {
                        return {
                            id: p.id,
                            title: p.title,
                            title_mm: p.title_mm,
                            image: p.image,
                            price: p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                            quantity: p.quantity,
                            item_total: item_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                    }
                }),
                delivery: this.state.delivery,
                delivery_fee: this.state.delivery_fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                discount_price: null,
                myKyat_discount: null,
                subtotal: subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                total: total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        }

        if (address_contact.length >= 1) {
            db
                .ref(ORDERURL + `/${orderItems.uuid}`)
                .set(orderItems, () => {

                    const notify = true

                    this.props.history.push(`/completed/${orderItems.uuid}`)
                    this.removeAllProducts()
                    addOrder({ ...orderItems, notify })
                    addOrderLink(orderItems)
                })
                .catch((err) => {
                    console.log(err.message)
                })
        }

        if (agent_address_contact.length >= 1) {
            db
                .ref(ORDERURL + `/${agent_orderItems.uuid}`)
                .set(agent_orderItems, () => {
                    this.props.history.push(`/completed/${agent_orderItems.uuid}`)
                    this.removeAllProducts()
                    addOrderLink(agent_orderItems)
                    removeMyKyat(myKyatId)
                })
                .catch((err) => {
                    console.log(err.message)
                })
        }

    }

    handlePaymentApiSubmit = e => {
        e.preventDefault()

        const { address_contact, agent_address_contact } = this.props

        if (address_contact.length >= 1 || agent_address_contact.length >= 1) {
            this.showModal()
        }
    }

    handleMyKyatSubmit = e => {
        e.preventDefault()

        const date = generateDate()

        const sID = shortId.generate()

        const invocieID = nanoid(28)

        const discount_price = this.props.cartTotal.totalPrice / 100 * 3

        const delivery_fee = this.state.delivery_fee

        const subtotal = this.props.cartTotal.totalPrice

        const total = subtotal - discount_price + delivery_fee

        const { address_contact, agent_address_contact, addOrder, addOrderLink, myKyatId, removeMyKyat } = this.props

        const orderItems = {
            checkout: {
                contact: {
                    name: address_contact[0] && address_contact[0].name,
                    email: address_contact[0] && address_contact[0].email,
                    phone: address_contact[0] && address_contact[0].phone,
                    home_no: address_contact[0] && address_contact[0].home_no,
                    street_quarter: address_contact[0] && address_contact[0].street_quarter,
                    township: address_contact[0] && address_contact[0].township,
                    dateFormatted: date.formatted,
                    datePretty: date.pretty,
                    dateRaw: new Date().toISOString()
                },
                payment: this.state.payment,
                user: 'None'
            },
            adminNotify: true,
            notify: true,
            id: sID.toLowerCase(),
            uuid: uuidv4(),
            invoice_number: 'bgstore-' + invocieID,
            status: 'Pending',
            status_mm: 'ဆိုင်းငံ့',
            products: {
                orderItems: this.props.cartProducts.map(p => {
                    const item_total = p.price * p.quantity
                    if (p.color && p.size) {
                        return {
                            id: p.id,
                            title: p.title,
                            title_mm: p.title_mm,
                            image: p.image,
                            price: p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                            color: p.selected_color,
                            size: p.selected_size,
                            quantity: p.quantity,
                            item_total: item_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        }
                    } else {
                        return {
                            id: p.id,
                            title: p.title,
                            title_mm: p.title_mm,
                            image: p.image,
                            price: p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                            quantity: p.quantity,
                            item_total: item_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        }
                    }
                }),
                delivery: this.state.delivery,
                delivery_fee: this.state.delivery_fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                discount_price: discount_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                myKyat_discount: '3%',
                subtotal: subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                total: total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        }

        const agent_orderItems = {
            checkout: {
                contact: {
                    name: agent_address_contact[0] && agent_address_contact[0].name,
                    email: agent_address_contact[0] && agent_address_contact[0].email,
                    phone: agent_address_contact[0] && agent_address_contact[0].addressPhone,
                    home_no: agent_address_contact[0] && agent_address_contact[0].home_no,
                    street_quarter: agent_address_contact[0] && agent_address_contact[0].street_quarter,
                    township: agent_address_contact[0] && agent_address_contact[0].township,
                    dateFormatted: date.formatted,
                    datePretty: date.pretty,
                    dateRaw: new Date().toISOString()
                },
                payment: 'MyKyat payment',
                user: {
                    name: this.state.user && this.state.user.providerData[0].displayName,
                    email: this.state.user && this.state.user.providerData[0].email,
                    id: this.state.user && this.state.user.providerData[0].uid,
                    provider: this.state.user && this.state.user.providerData[0].providerId,
                    phone: this.state.user && this.state.user.providerData[0].phoneNumber,
                    profileImg: this.state.user && this.state.user.providerData[0].photoURL
                },
                myKyat: {
                    displayName: myKyatId[0] && myKyatId[0].displayName,
                    id: myKyatId[0] && myKyatId[0].id,
                    transactionId: myKyatId[0] && myKyatId[0].transactionId,
                    fee: myKyatId[0] && myKyatId[0].fee,
                    productPrice: myKyatId[0] && myKyatId[0].productPrice
                }
            },
            agent_id: this.state.user && this.state.user.providerData[0].uid,
            adminNotify: true,
            notify: true,
            id: sID.toLowerCase(),
            uuid: uuidv4(),
            invoice_number: 'bgstore-' + invocieID,
            status: 'Pending',
            status_mm: 'ဆိုင်းငံ့',
            products: {
                orderItems: this.props.cartProducts.map(p => {
                    const item_total = p.price * p.quantity
                    if (p.color && p.size) {
                        return {
                            id: p.id,
                            title: p.title,
                            title_mm: p.title_mm,
                            image: p.image,
                            price: p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                            color: p.selected_color,
                            size: p.selected_size,
                            quantity: p.quantity,
                            item_total: item_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                    } else {
                        return {
                            id: p.id,
                            title: p.title,
                            title_mm: p.title_mm,
                            image: p.image,
                            price: p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                            quantity: p.quantity,
                            item_total: item_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                    }
                }),
                delivery: this.state.delivery,
                delivery_fee: this.state.delivery_fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                discount_price: discount_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                myKyat_discount: '3%',
                subtotal: subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                total: total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        }

        if (address_contact.length >= 1) {
            db
                .ref(ORDERURL + `/${orderItems.uuid}`)
                .set(orderItems, () => {

                    const notify = true

                    this.props.history.push(`/completed/${orderItems.uuid}`)
                    this.removeAllProducts()
                    addOrder({ ...orderItems, notify })
                    addOrderLink(orderItems)
                })
                .catch((err) => {
                    console.log(err.message)
                })
        }

        if (agent_address_contact.length >= 1) {
            db
                .ref(ORDERURL + `/${agent_orderItems.uuid}`)
                .set(agent_orderItems, () => {
                    this.props.history.push(`/completed/${agent_orderItems.uuid}`)
                    this.removeAllProducts()
                    addOrderLink(agent_orderItems)
                    removeMyKyat(myKyatId)
                })
                .catch((err) => {
                    console.log(err.message)
                })
        }
    }

    removeAllProducts = product => {
        const { cartProducts, updateTotalCart } = this.props
        const index = cartProducts.filter(p => p === product)
        if (index >= 0) {
            cartProducts.splice(index)
            updateTotalCart(cartProducts)
        }
    }

    discountPrice = () => {
        // const { cartTotal } = this.props
        // return cartTotal.totalPrice / 100 * 3

        if(this.state.payment === 'MyKyat payment') {
            const discount = 3
            const { cartTotal } = this.props
            return cartTotal.totalPrice / 100 * discount
        }
    }

    onChangeDeliveryNormal = e => {
        this.setState({
            delivery: e.target.value,
            delivery_fee: 2500
        })
    }

    onChangeDeliveryDay1 = e => {
        this.setState({
            delivery: e.target.value,
            delivery_fee: 4000
        })
    }

    // onChangeDeliveryAtOnce = e => {
    //     this.setState({
    //         delivery: e.target.value,
    //         delivery_fee: 2000
    //     })
    // }

    allTotalPrice = () => {
        // const { cartTotal } = this.props
        // const { delivery_fee } = this.state

        // const TOTALPRICE = cartTotal.totalPrice - this.discountPrice() + delivery_fee
        // return TOTALPRICE

        if(this.state.payment === 'ပစ္စည်းရောက် ငွေရှင်းစနစ်') {
            const { cartTotal } = this.props
            const { delivery_fee } = this.state
    
            const TOTALPRICE = cartTotal.totalPrice + delivery_fee
            return TOTALPRICE
        }

        if(this.state.payment === 'MyKyat payment') {
            const { cartTotal } = this.props
            const { delivery_fee } = this.state
            const myKyat_discount = 3
    
            const withDiscount = cartTotal.totalPrice / 100 * myKyat_discount
    
            const TOTALPRICE = cartTotal.totalPrice - withDiscount + delivery_fee
            return TOTALPRICE
        }

    }

    onChangePayment = e => {
        this.setState({
            payment: e.target.value
        })
    }

    createContactOpen = () => {
        document.getElementById('create_contact').style.left = '0%'
    }

    editContactOpen = () => {
        document.getElementById('edit_contact').style.left = '0%'
    }

    render() {

        const { cartProducts, cartTotal, changeProductQuantity, agent_address_contact, myKyatId } = this.props
        const {
            delivery_fee,
            delivery,
            payment,
            show,
            show1,
            show2,
            show3,
            loadShow,
            mykyat_login,
            mykyat_password,
            decrypt_auth,
            decrypt_purchase,
            agent,
            user
        } = this.state

        const loginStyle = {
            content: {
                left: '0',
                right: '0',
                top: '0',
                bottom: '0',
                background: '#fff',
                border: '0',
                padding: '0',
                borderRadius: '0',
                position: 'fixed',
                zIndex: '9999999999'
            }
        }

        const loadingStyle = {
            content: {
                left: '0',
                right: '0',
                bottom: '0',
                top: '0',
                background: 'none',
                border: '0',
                padding: '0',
                borderRadius: '0'
            }
        }

        const cssName = {
            pd: {
                paddingLeft: '10px',
                paddingRight: '10px'
            },
            name: {
                fontSize:'1rem',
                lineHeight:'2'
            },
            ht: {
                height: '48px'
            }
        }

        const products = cartProducts.map(p => {
            return (
                <OrderItems key={p.id} product={p} changeProductQuantity={changeProductQuantity} />
            )
        })

        const deliveryTime =
            <div className="field-group mb-5">
                <h4
                    className="font-weight-normal mb-3 text-default"
                    style={{
                        lineHeight: '1.5',
                        fontSize: '1.1rem'
                    }}
                >
                    <Translation>
                        {(t) => <>{t('main.deliveryTime')}</>}
                    </Translation>
                </h4>
                <div
                    className="p-4 bg-white shadow-sm rounded-sm"
                >
                    <div className="position-relative">
                        <input
                            type="radio"
                            className="hopping-input"
                            id="delivery_normal"
                            name="delivery"
                            value='ပုံမှန်ကြာချိန် (၂)ရက်'
                            onChange={this.onChangeDeliveryNormal.bind(this)}
                            checked={this.state.delivery === 'ပုံမှန်ကြာချိန် (၂)ရက်'}
                        />
                        <label
                            className="hopping-label"
                            style={{
                                fontSize: '14px',
                                letterSpacing: '0.5px'
                            }}
                            htmlFor="delivery_normal"
                        >
                            <span></span><Translation>{(t) => <>{t('main.deliveryNormal')}</>}</Translation>
                        </label>

                        <input
                            type="radio"
                            className="hopping-input"
                            id="delivery_day1"
                            name="delivery"
                            value='ကြာချိန် (၁)ရက်'
                            onChange={this.onChangeDeliveryDay1.bind(this)}
                            checked={this.state.delivery === 'ကြာချိန် (၁)ရက်'}
                        />
                        <label
                            className="hopping-label"
                            style={{
                                fontSize: '14px',
                                letterSpacing: '0.5px'
                            }}
                            htmlFor="delivery_day1"
                        >
                            <span></span><Translation>{(t) => <>{t('main.deliveryDay1')}</>}</Translation>
                        </label>


                        {/* <input
                            type="radio"
                            className="hopping-input"
                            id="delivery_at_once"
                            name="delivery"
                            value='ချက်ချင်း (၂)နာရီအတွင်း'
                            onChange={this.onChangeDeliveryAtOnce.bind(this)}
                            checked={this.state.delivery === 'ချက်ချင်း (၂)နာရီအတွင်း'}
                        />
                        <label
                            className="hopping-label mb-0"
                            style={{
                                fontSize: '14px',
                                letterSpacing: '0.5px'
                            }}
                            htmlFor="delivery_at_once"
                        >
                            <span></span><Translation>{(t) => <>{t('main.deliveryUrgent')}</>}</Translation>
                        </label> */}

                        <div className="worm">
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                            <div className="worm__segment"></div>
                        </div>
                    </div>
                </div>
            </div>

        const paymentMethod =
            <div className="field-group mb-0">
                <h4
                    className="font-weight-normal mb-3 text-default"
                    style={{
                        lineHeight: '1.5',
                        fontSize: '1.1rem'
                    }}
                >
                    <Translation>
                        {(t) => <>{t('main.payment')}</>}
                    </Translation>
                </h4>

                <div
                    className="p-4 bg-white shadow-sm rounded-sm"
                >
                    <div className="d-flex payment-wrapper">
                        {
                            user === null ? (
                                <>
                                    <div
                                        className="mr-3"
                                        style={{
                                            width: '110px',
                                            height: '110px'
                                        }}
                                    >
                                        <input
                                            className="checkbox-payment"
                                            type="radio"
                                            name="payment"
                                            id="cash_on_delivery"
                                            value="ပစ္စည်းရောက် ငွေရှင်းစနစ်"
                                            onChange={this.onChangePayment.bind(this)}
                                            checked={payment === 'ပစ္စည်းရောက် ငွေရှင်းစနစ်'}
                                            disabled={decrypt_auth === '' ? false : true}
                                        />
                                        <label
                                            className="for-checkbox-payment cod-payment position-relative mb-0"
                                            htmlFor="cash_on_delivery"
                                        >
                                            <img
                                                src={COD_IMG}
                                                alt="Cash On Delivery"
                                                style={{
                                                    width: '100px'
                                                }}
                                            />
                                            <span
                                                style={{
                                                    lineHeight: '2',
                                                    fontSize: '10px',
                                                    background: '-webkit-linear-gradient(45deg, #333, #007bff 80%)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    display: 'inline-block',
                                                    position: 'absolute',
                                                    left: '0',
                                                    right: '0',
                                                    bottom: '20px',
                                                    textAlign: 'center',
                                                    padding: '0 5px'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.cod')}</>}
                                                </Translation>
                                            </span>
                                        </label>
                                    </div>
                                    <div
                                        className="mr-3"
                                        style={{
                                            width: '110px',
                                            height: '110px'
                                        }}
                                    >
                                        <input
                                            className="checkbox-payment"
                                            type="radio"
                                            name="payment"
                                            id="my_kyat"
                                            value="MyKyat payment"
                                            onChange={this.onChangePayment.bind(this)}
                                            checked={payment === 'MyKyat payment'}
                                        />
                                        <label
                                            className="for-checkbox-payment mk-payment position-relative mb-0"
                                            htmlFor="my_kyat"
                                        >
                                            <img
                                                src={MYKYAT_IMG}
                                                alt="MyKyat"
                                                className="p-2 bg-light"
                                                style={{
                                                    width: '100px'
                                                }}
                                            />
                                            <span
                                                style={{
                                                    lineHeight: '2',
                                                    fontSize: '10px',
                                                    display: 'inline-block',
                                                    position: 'absolute',
                                                    left: '0',
                                                    right: '0',
                                                    bottom: '10px',
                                                    textAlign: 'center',
                                                    padding: '0 5px'
                                                }}
                                                className="text-custom"
                                            >
                                                လုံခြုံ မြန်ဆန် ဒို့ပိုက်ဆံ
                                            </span>
                                        </label>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div
                                        className="mr-3"
                                        style={{
                                            width: '110px',
                                            height: '110px'
                                        }}
                                    >
                                        <input
                                            className="checkbox-payment"
                                            type="radio"
                                            name="payment"
                                            id="cash_on_delivery"
                                            value="ပစ္စည်းရောက် ငွေရှင်းစနစ်"
                                            onChange={this.onChangePayment.bind(this)}
                                            checked={payment === 'ပစ္စည်းရောက် ငွေရှင်းစနစ်'}
                                            disabled={decrypt_auth === '' ? false : true}
                                        />
                                        <label
                                            className="for-checkbox-payment cod-payment position-relative mb-0"
                                            htmlFor="cash_on_delivery"
                                        >
                                            <img
                                                src={COD_IMG}
                                                alt="Cash On Delivery"
                                                style={{
                                                    width: '100px'
                                                }}
                                            />
                                            <span
                                                style={{
                                                    lineHeight: '2',
                                                    fontSize: '10px',
                                                    background: '-webkit-linear-gradient(45deg, #333, #007bff 80%)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    display: 'inline-block',
                                                    position: 'absolute',
                                                    left: '0',
                                                    right: '0',
                                                    bottom: '20px',
                                                    textAlign: 'center',
                                                    padding: '0 5px'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.cod')}</>}
                                                </Translation>
                                            </span>
                                        </label>
                                    </div>
                                    <div
                                        className="mr-3"
                                        style={{
                                            width: '110px',
                                            height: '110px'
                                        }}
                                    >
                                        <input
                                            className="checkbox-payment"
                                            type="radio"
                                            name="payment"
                                            id="my_kyat"
                                            value="MyKyat payment"
                                            onChange={this.onChangePayment.bind(this)}
                                            checked={payment === 'MyKyat payment'}
                                        />
                                        <label
                                            className="for-checkbox-payment mk-payment position-relative mb-0"
                                            htmlFor="my_kyat"
                                        >
                                            <img
                                                src={MYKYAT_IMG}
                                                alt="MyKyat"
                                                style={{
                                                    width: '100px'
                                                }}
                                                className="p-2 bg-light"
                                            />
                                            <span
                                                style={{
                                                    lineHeight: '2',
                                                    fontSize: '10px',
                                                    display: 'inline-block',
                                                    position: 'absolute',
                                                    left: '0',
                                                    right: '0',
                                                    bottom: '10px',
                                                    textAlign: 'center',
                                                    color: '#fff',
                                                    padding: '0 5px'
                                                }}
                                                className="text-custom"
                                            >
                                                လုံခြုံ မြန်ဆန် ဒို့ပိုက်ဆံ
                                            </span>
                                        </label>
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>

            </div>

        const placeOrder =
            <div
                className="field-group"
            >
                {
                    user === null ? (
                        <>
                            {
                                this.props.address_contact <= 0 ? (
                                    <>
                                        <p
                                            className="mb-3 font-weight-normal"
                                            style={{
                                                fontSize: '1rem'
                                            }}
                                        >
                                            <small
                                                style={{
                                                    lineHeight: '1.5'
                                                }}
                                                className="text-danger"
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.complete.shippingaddress')}</>}
                                                </Translation>
                                            </small>
                                        </p>

                                        {
                                            payment === 'ပစ္စည်းရောက် ငွေရှင်းစနစ်' &&
                                            <button
                                                className="btn py-2 px-5 border-0 shadow-sm text-white"
                                                type="submit"
                                                style={{
                                                    background: '#000',
                                                    // width: '300px',
                                                    maxWidth: '100%',
                                                    borderRadius: '2px'
                                                }}
                                                disabled
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.placeOrder')}</>}
                                                </Translation>
                                            </button>
                                        }

                                        {
                                            payment === 'MyKyat payment' &&
                                            <button
                                                className="btn py-2 px-5 border-0 shadow-sm text-white"
                                                type="submit"
                                                style={{
                                                    background: '#000',
                                                    // width: '300px',
                                                    maxWidth: '100%',
                                                    borderRadius: '2px'
                                                }}
                                                disabled
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.signin.to.mykyat')}</>}
                                                </Translation>
                                            </button>
                                        }
                                    </>
                                ) : (
                                    <>
                                        {
                                            payment === 'ပစ္စည်းရောက် ငွေရှင်းစနစ်' &&
                                            <button
                                                className="btn py-2 px-5 border-0 shadow-sm bg-default text-white btn-cart-hover"
                                                type="submit"
                                                onClick={this.handleCODSubmit.bind(this)}
                                                style={{
                                                    background: '#000',
                                                    // width: '300px',
                                                    maxWidth: '100%',
                                                    borderRadius: '2px'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.placeOrder')}</>}
                                                </Translation>
                                            </button>
                                        }

                                        {
                                            decrypt_auth === '' ? (
                                                <>
                                                    {
                                                        payment === 'MyKyat payment' &&
                                                        <button
                                                            className="btn py-2 px-5 border-0 shadow-sm bg-default text-white btn-cart-hover"
                                                            type="submit"
                                                            onClick={this.handlePaymentApiSubmit.bind(this)}
                                                            style={{
                                                                background: '#000',
                                                                // width: '300px',
                                                                maxWidth: '100%',
                                                                borderRadius: '2px'
                                                            }}
                                                        >
                                                            <Translation>
                                                                {(t) => <>{t('main.signin.to.mykyat')}</>}
                                                            </Translation>
                                                        </button>
                                                    }
                                                </>
                                            ) : (
                                                    <>
                                                        {
                                                            payment === 'MyKyat payment' &&
                                                            <button
                                                                className="btn py-2 px-5 border-0 shadow-sm bg-default text-white btn-cart-hover"
                                                                type="submit"
                                                                onClick={this.encryptPurchaseContinue.bind(this)}
                                                                style={{
                                                                    background: '#000',
                                                                    // width: '300px',
                                                                    maxWidth: '100%',
                                                                    borderRadius: '2px'
                                                                }}
                                                            >
                                                                <Translation>
                                                                    {(t) => <>{t('main.pay.now')}</>}
                                                                </Translation>
                                                            </button>
                                                        }
                                                    </>
                                                )
                                        }
                                    </>
                                )
                            }
                        </>
                    ) : (
                        <>
                            {
                                agent_address_contact.length <= 0 ? (
                                    <>
                                        <p
                                            className="mb-3 font-weight-normal"
                                            style={{
                                                fontSize: '1rem'
                                            }}
                                        >
                                            <small
                                                style={{
                                                    lineHeight: '1.5'
                                                }}
                                                className="text-danger"
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.complete.agent.shippingaddress')}</>}
                                                </Translation>
                                            </small>
                                        </p>

                                        {
                                            payment === 'ပစ္စည်းရောက် ငွေရှင်းစနစ်' &&
                                            <button
                                                className="btn py-2 px-5 border-0 shadow-sm text-white"
                                                type="submit"
                                                style={{
                                                    background: '#000',
                                                    // width: '300px',
                                                    maxWidth: '100%',
                                                    borderRadius: '2px'
                                                }}
                                                disabled
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.placeOrder')}</>}
                                                </Translation>
                                            </button>
                                        }

                                        {
                                            payment === 'MyKyat payment' &&
                                            <button
                                                className="btn py-2 px-5 border-0 shadow-sm text-white"
                                                type="submit"
                                                style={{
                                                    background: '#000',
                                                    // width: '300px',
                                                    maxWidth: '100%',
                                                    borderRadius: '2px'
                                                }}
                                                disabled
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.signin.to.mykyat')}</>}
                                                </Translation>
                                            </button>
                                        }

                                    </>
                                ) : (
                                    <>
                                        {
                                            payment === 'ပစ္စည်းရောက် ငွေရှင်းစနစ်' &&
                                            <button
                                                className="btn py-2 px-5 border-0 shadow-sm bg-default text-white btn-cart-hover"
                                                type="submit"
                                                onClick={this.handleCODSubmit.bind(this)}
                                                style={{
                                                    background: '#000',
                                                    // width: '300px',
                                                    maxWidth: '100%',
                                                    borderRadius: '2px'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.placeOrder')}</>}
                                                </Translation>
                                            </button>
                                        }

                                        {
                                            decrypt_auth === '' ? (
                                                <>
                                                    {
                                                        payment === 'MyKyat payment' &&
                                                        <button
                                                            className="btn py-2 px-5 border-0 shadow-sm bg-default text-white btn-cart-hover"
                                                            type="submit"
                                                            onClick={this.handlePaymentApiSubmit.bind(this)}
                                                            style={{
                                                                background: '#000',
                                                                // width: '300px',
                                                                maxWidth: '100%',
                                                                borderRadius: '2px'
                                                            }}
                                                        >
                                                            <Translation>
                                                                {(t) => <>{t('main.signin.to.mykyat')}</>}
                                                            </Translation>
                                                        </button>
                                                    }
                                                </>
                                            ) : (
                                                <>
                                                    {
                                                        payment === 'MyKyat payment' &&
                                                        <button
                                                            className="btn py-2 px-5 border-0 shadow-sm bg-default text-white btn-cart-hover"
                                                            type="submit"
                                                            onClick={this.encryptPurchaseContinue.bind(this)}
                                                            style={{
                                                                background: '#000',
                                                                // width: '300px',
                                                                maxWidth: '100%',
                                                                borderRadius: '2px'
                                                            }}
                                                        >
                                                            <Translation>
                                                                {(t) => <>{t('main.pay.now')}</>}
                                                            </Translation>
                                                        </button>
                                                    }
                                                </>
                                            )
                                        }
                                    </>
                                )
                            }
                        </>
                    )
                }

            </div>

        const smallPlaceOrder =
            <div
                className="border-top d-flex d-md-none py-3 px-3 shadow-sm position-fixed justify-content-between bg-white"
                style={{
                    left: '0',
                    right: '0',
                    bottom: '0',
                    zIndex: '999'
                }}
            >
                <p
                    className="font-weight-light mb-0"
                    style={{
                        fontSize: '13px',
                        lineHeight: '1.5',
                        letterSpacing: '0.5px'
                    }}
                >
                    <Translation>
                        {(t) => <>{t('main.total')}</>}
                    </Translation><br />
                    <strong style={{ fontSize: '15px' }} className="font-weight-bold text-default">{this.allTotalPrice().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}</strong>
                </p>

                {
                    user === null ? (
                        <>
                            {
                                this.props.address_contact <= 0 ? (
                                    <div className="flex-grow-1 ml-5">
                                        <p
                                            className="mb-2 font-weight-normal"
                                            style={{
                                                fontSize: '0.7rem'
                                            }}
                                        >
                                            <small
                                                style={{
                                                    color: '#000',
                                                    lineHeight: '1.5'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.complete.shippingaddress')}</>}
                                                </Translation>
                                            </small>
                                        </p>

                                        {
                                            payment === 'ပစ္စည်းရောက် ငွေရှင်းစနစ်' &&
                                            <button
                                                className="btn shadow-sm py-1 text-white w-100"
                                                type="submit"
                                                style={{
                                                    background: '#000',
                                                    lineHeight: '1.5',
                                                    borderRadius: '2px'
                                                }}
                                                disabled
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.placeOrder')}</>}
                                                </Translation>
                                            </button>
                                        }

                                        {
                                            decrypt_auth === '' ? (
                                                <>
                                                    {
                                                        payment === 'MyKyat payment' &&
                                                        <button
                                                            className="btn shadow-sm py-1 text-white w-100"
                                                            type="submit"
                                                            style={{
                                                                background: '#000',
                                                                lineHeight: '1.5',
                                                                borderRadius: '2px'
                                                            }}
                                                            disabled
                                                        >
                                                            <Translation>
                                                                {(t) => <>{t('main.signin.to.mykyat')}</>}
                                                            </Translation>
                                                        </button>
                                                    }
                                                </>
                                            ) : (
                                                    <>
                                                        {
                                                            payment === 'MyKyat payment' &&
                                                            <button
                                                                className="btn shadow-sm py-1 px-5 border-0 shadow-sm text-white bg-default btn-cart-hover"
                                                                type="submit"
                                                                style={{
                                                                    background: '#000',
                                                                    lineHeight: '1.5',
                                                                    borderRadius: '2px'
                                                                }}
                                                                onClick={this.handlePaymentApiSubmit.bind(this)}
                                                            >
                                                                <Translation>
                                                                    {(t) => <>{t('main.pay.now')}</>}
                                                                </Translation>
                                                            </button>
                                                        }
                                                    </>
                                                )
                                        }
                                    </div>
                                ) : (
                                        <>
                                            {
                                                payment === 'ပစ္စည်းရောက် ငွေရှင်းစနစ်' &&
                                                <button
                                                    className="btn-cart-hover btn shadow-sm bg-default py-0 text-white flex-grow-1 ml-5"
                                                    type="submit"
                                                    onClick={this.handleCODSubmit.bind(this)}
                                                    style={{
                                                        background: '#000',
                                                        lineHeight: '1.5',
                                                        borderRadius: '2px'
                                                    }}
                                                >
                                                    <Translation>
                                                        {(t) => <>{t('main.placeOrder')}</>}
                                                    </Translation>
                                                </button>
                                            }

                                            {
                                                decrypt_auth === '' ? (
                                                    <>
                                                        {
                                                            payment === 'MyKyat payment' &&
                                                            <button
                                                                className="btn-cart-hover btn shadow-sm bg-default py-0 text-white flex-grow-1 ml-5"
                                                                type="submit"
                                                                onClick={this.handlePaymentApiSubmit.bind(this)}
                                                                style={{
                                                                    background: '#000',
                                                                    lineHeight: '1.5',
                                                                    borderRadius: '2px'
                                                                }}
                                                            >
                                                                <Translation>
                                                                    {(t) => <>{t('main.signin.to.mykyat')}</>}
                                                                </Translation>
                                                            </button>
                                                        }
                                                    </>
                                                ) : (
                                                        <>
                                                            {
                                                                payment === 'MyKyat payment' &&
                                                                <button
                                                                    className="btn-cart-hover btn shadow-sm bg-default py-0 text-white flex-grow-1 ml-5"
                                                                    type="submit"
                                                                    onClick={this.encryptPurchaseContinue.bind(this)}
                                                                    style={{
                                                                        background: '#000',
                                                                        lineHeight: '1.5',
                                                                        borderRadius: '2px'
                                                                    }}
                                                                >
                                                                    <Translation>
                                                                        {(t) => <>{t('main.pay.now')}</>}
                                                                    </Translation>
                                                                </button>
                                                            }
                                                        </>
                                                    )
                                            }
                                        </>
                                    )
                            }
                        </>
                    ) : (
                            <>
                                {
                                    agent_address_contact.length <= 0 ? (
                                        <div className="flex-grow-1 ml-5">
                                            <p
                                                className="mb-2 font-weight-normal"
                                                style={{
                                                    fontSize: '0.7rem'
                                                }}
                                            >
                                                <small
                                                    style={{
                                                        color: '#000',
                                                        lineHeight: '1.5'
                                                    }}
                                                >
                                                    <Translation>
                                                        {(t) => <>{t('main.complete.agent.shippingaddress')}</>}
                                                    </Translation>
                                                </small>
                                            </p>
                                            <button
                                                className="btn shadow-sm py-1 text-white w-100"
                                                type="submit"
                                                style={{
                                                    background: '#000',
                                                    lineHeight: '1.5',
                                                    borderRadius: '2px'
                                                }}
                                                disabled
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.signin.to.mykyat')}</>}
                                                </Translation>
                                            </button>
                                        </div>
                                    ) : (
                                            <>
                                                {
                                                    decrypt_auth === '' ? (
                                                        <>
                                                            {
                                                                payment === 'MyKyat payment' &&
                                                                <button
                                                                    className="btn shadow-sm py-0 text-white flex-grow-1 ml-5"
                                                                    type="submit"
                                                                    style={{
                                                                        background: '#000',
                                                                        lineHeight: '1.5',
                                                                        borderRadius: '2px'
                                                                    }}
                                                                    disabled
                                                                >
                                                                    <Translation>
                                                                        {(t) => <>{t('main.signin.to.mykyat')}</>}
                                                                    </Translation>
                                                                </button>
                                                            }
                                                        </>
                                                    ) : (
                                                            <>
                                                                {
                                                                    payment === 'MyKyat payment' &&
                                                                    <button
                                                                        className="btn-cart-hover btn shadow-sm bg-default py-0 text-white flex-grow-1 ml-5"
                                                                        type="submit"
                                                                        onClick={this.encryptPurchaseContinue.bind(this)}
                                                                        style={{
                                                                            background: '#000',
                                                                            lineHeight: '1.5',
                                                                            borderRadius: '2px'
                                                                        }}
                                                                    >
                                                                        <Translation>
                                                                            {(t) => <>{t('main.pay.now')}</>}
                                                                        </Translation>
                                                                    </button>
                                                                }
                                                            </>
                                                        )
                                                }
                                            </>
                                        )
                                }
                            </>
                        )
                }
            </div>

        const orderItemLists =
            <div className="field-group">
                <h4
                    className="font-weight-normal mb-3 text-default"
                    style={{
                        lineHeight: '1.5',
                        fontSize: '1.1rem'
                    }}
                >
                    <Translation>
                        {(t) => <>{t('main.purchaseOrders')}</>}
                    </Translation>
                </h4>

                <div className="bg-white px-4 pt-4 pb-2 mb-3 shadow-sm rounded-sm">
                    <div className="d-flex mb-3 align-items-center justify-content-between">
                        <small className="d-inline-block text-default">
                            <strong>
                                ( {cartTotal.productQuantity}&nbsp;
                                <Translation>
                                    {(t) => <>{t('main.items')}</>}
                                </Translation> )
                        </strong>
                        </small>
                        <button
                            className="btn bg-transparent text-default link-default-hover py-0 shadow-none border-0 rounded-0"
                            onClick={this.removeAllProducts}
                        >
                            <FaRegTrashAlt />
                        </button>
                    </div>

                    {products}
                </div>

                <div
                    className="d-flex bg-white px-4 py-4 shadow-sm rounded-sm"
                    style={{
                        // borderLeft: '5px solid #6fbd0c',
                        lineHeight: '2'
                    }}
                >
                    <div>
                        <p
                            className="font-weight-light mb-2"
                            style={{
                                fontSize: '14px',
                                lineHeight: '1.5'
                            }}
                        >
                            <Translation>
                                {(t) => <>{t('main.subtotal')}</>}
                            </Translation>
                        </p>
                        {
                            payment === 'MyKyat payment' &&
                            <p
                                className="font-weight-normal mb-2"
                                style={{
                                    fontSize: '14px',
                                    lineHeight: '1.5'
                                }}
                            >
                                3% Off (<small className="font-weight-bold text-custom">myKyatအကောင့် အသုံးပြုသူ</small>)
                            </p>
                        }
                        <p
                            className="font-weight-normal mb-2"
                            style={{
                                fontSize: '14px',
                                lineHeight: '1.5'
                            }}
                        >
                            <Translation>
                                {(t) => <>{t('main.deliveryFee')}</>}
                            </Translation> (<small className="font-weight-bold text-custom">{delivery}</small>)
                        </p>

                        {/* <p
                            className="font-weight-light mb-2"
                            style={{
                                fontSize: '14px',
                                lineHeight: '1.5'
                            }}
                        >
                            <Translation>
                                {(t) => <>{t('main.discount')}</>}
                            </Translation> <small className="font-weight-bold">(3%)</small>
                        </p> */}

                        
                        <p
                            className="font-weight-bold mb-0 mt-2 text-default"
                            style={{
                                fontSize: '16px',
                                lineHeight: '1.5',
                                letterSpacing: '0.5px'
                            }}
                        >
                            <Translation>
                                {(t) => <>{t('main.total')}</>}
                            </Translation>
                        </p>
                    </div>
                    <div className="ml-auto text-right">
                        <p
                            className="font-weight-light mb-2"
                            style={{
                                fontSize: '14px',
                                lineHeight: '1.5'
                            }}
                            >
                            {cartTotal.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}
                        </p>
                        {
                            payment === 'MyKyat payment' &&
                            <p
                                className="font-weight-light mb-2"
                                style={{
                                    fontSize: '14px',
                                    lineHeight: '1.5'
                                }}
                            >
                                <small>( - )</small> {this.discountPrice().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}
                            </p>
                        }
                        <p
                            className="font-weight-light mb-2"
                            style={{
                                fontSize: '14px',
                                lineHeight: '1.5'
                            }}
                        >
                            {
                                delivery_fee === 0 ? (
                                    <>
                                        <Translation>
                                            {(t) => <>{t('main.deliveryFreeShipping')}</>}
                                        </Translation>
                                    </>
                                ) : (
                                        <><small>( + )</small> {delivery_fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}</>
                                    )
                            }
                        </p>
                        {/* <p
                            className="font-weight-light mb-2"
                            style={{
                                fontSize: '14px',
                                lineHeight: '1.5'
                            }}
                        >
                            <small>( - )</small> {this.discountPrice().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}
                        </p> */}
                        <p
                            className="font-weight-bold mb-0 mt-2 text-default"
                            style={{
                                fontSize: '16px',
                                lineHeight: '1.5',
                                letterSpacing: '0.5px'
                            }}
                        >
                            {this.allTotalPrice().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}
                        </p>
                    </div>
                </div>
            </div>

        const modal1 =
            <>
                <Modal
                    isOpen={show}
                    contentLabel="MyKyat အကောင့်ဝင်ရန်"
                    onRequestClose={this.closeModal}
                    style={loginStyle}
                    overlayClassName="payment-modal-wrapper"
                >
                    <div className="col-12 col-lg-6 mx-auto h-100 px-0">

                        <button
                            className="btn shadow-sm border-0 rounded-circle position-absolute text-default p-0 btn-cart-hover"
                            style={{
                                left: '15px',
                                top: '1.5rem',
                                zIndex: '9999999999',
                                fontSize: '30px',
                                width: '50px',
                                height: '50px',
                                lineHeight: '30px',
                                background: '#fff',
                            }}
                            onClick={() => {
                                this.closeModal()
                                this.setState({
                                    mykyat_login: '',
                                    mykyat_password: ''
                                })
                            }}
                        >
                            <MdArrowBack />
                        </button>

                        <div
                            className="d-table w-100 h-100 px-3 position-relative"
                        >
                            <div
                                className="d-table-cell align-middle py-3"
                            >

                                <form
                                    autoComplete="off"
                                    className="mx-auto"
                                    style={{
                                        width: '320px',
                                        maxWidth: '100%'
                                    }}
                                    onSubmit={this.encryptAuthLogin.bind(this)}
                                >
                                    <p
                                        className="text-center mb-4"
                                    >
                                        <img
                                            src={MYKYAT_LOG || <Skeleton width={100} height={100} />}
                                            alt="MyKyat"
                                            style={{
                                                width: '100px'
                                            }}
                                        />
                                    </p>
                                    <div className="form-group mb-4">
                                        <Translation>
                                            {
                                                (t) =>
                                                    <>
                                                        <label
                                                            htmlFor="mykyat_login"
                                                            className="text-default text-uppercase"
                                                        >
                                                            {t('main.username')}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="mykyat_login"
                                                            name="mykyat_login"
                                                            value={mykyat_login}
                                                            onChange={this.handleChange.bind(this)}
                                                            className="form-control w-100 bg-transparent border-dark shadow-none text-default"
                                                            style={{
                                                                height: '45px',
                                                                borderRadius: '2px',
                                                                borderWidth: '2px'
                                                            }}
                                                            required
                                                        />
                                                    </>
                                            }
                                        </Translation>

                                        {
                                            decrypt_auth[1] === "Customer is invalid" ? (
                                                <span
                                                    className="d-inline-block float-left pt-1 text-danger"
                                                    style={{
                                                        fontSize: '11px'
                                                    }}
                                                >{decrypt_auth[1]}</span>
                                            ) : null
                                        }
                                    </div>
                                    <div className="form-group mb-5">
                                        <Translation>
                                            {
                                                (t) =>
                                                    <>
                                                        <label
                                                            htmlFor="mykyat_login"
                                                            className="text-default text-uppercase"
                                                        >
                                                            {t('main.password')}
                                                        </label>
                                                        <input
                                                            type="password"
                                                            id="mykyat_password"
                                                            name="mykyat_password"
                                                            value={mykyat_password}
                                                            onChange={this.handleChange.bind(this)}
                                                            className="form-control w-100 bg-transparent border-dark shadow-none text-default"
                                                            style={{
                                                                height: '45px',
                                                                borderRadius: '2px',
                                                                borderWidth: '2px'
                                                            }}
                                                            required
                                                        />
                                                    </>
                                            }
                                        </Translation>

                                        {
                                            decrypt_auth[1] === "Wrong Password" ? (
                                                <span
                                                    className="d-inline-block float-left pt-1 text-danger"
                                                    style={{
                                                        fontSize: '11px'
                                                    }}
                                                >{decrypt_auth[1]}</span>
                                            ) : null
                                        }
                                    </div>
                                    <div className="form-group mb-0">
                                        <button
                                            className="border-0 bg-default shadow-none text-white py-2 btn-cart-hover w-100"
                                            style={{
                                                lineHeight: '2',
                                                fontSize: '1rem',
                                                background: '#fff',
                                                borderRadius: '2px'
                                            }}
                                            type="submit"
                                        // onClick={this.encryptAuthLogin}
                                        >
                                            <Translation>
                                                {(t) => <>{t('main.mykyat.signin')}</>}
                                            </Translation>
                                        </button>
                                    </div>

                                </form>

                            </div>
                        </div>

                    </div>
                </Modal>
            </>

        const modal2 =
            <>
                {
                    decrypt_auth[1] === 'Cash is not enough!' ? (
                        <Modal
                            isOpen={show1}
                            onRequestClose={this.closeModal1}
                            contentLabel="MyKyat အကောင့်ထွက်ရန်"
                            style={loginStyle}
                            overlayClassName="payment-modal-wrapper"
                        >
                            <div className="col-12 col-lg-6 mx-auto h-100 px-0">
                                <button
                                    className="btn shadow-sm border-0 rounded-circle position-absolute text-default p-0 btn-cart-hover"
                                    style={{
                                        left: '15px',
                                        top: '1.5rem',
                                        zIndex: '9999999999',
                                        fontSize: '30px',
                                        width: '50px',
                                        height: '50px',
                                        lineHeight: '30px',
                                        background: '#fff',
                                    }}
                                    onClick={() => {
                                        this.closeModal1()
                                        this.setState({
                                            mykyat_login: '',
                                            mykyat_password: '',
                                            decrypt_auth: ''
                                        })
                                    }}
                                >
                                    <MdArrowBack />
                                </button>

                                <div
                                    className="d-table w-100 h-100 px-4 position-relative"
                                >
                                    <div
                                        className="d-table-cell align-middle py-3"
                                        style={{
                                            paddingBottom: '5rem'
                                        }}
                                    >
                                        <p
                                            className="text-center mb-4"
                                        >
                                            <img
                                                src={MYKYAT_LOG}
                                                alt="MyKyat"
                                                style={{
                                                    width: '100px'
                                                }}
                                            />
                                        </p>
                                        <p
                                            className="mb-0 text-default text-center"
                                            style={{
                                                fontSize: '0.9rem',
                                                lineHeight: '2'
                                            }}
                                        >
                                            <Translation>
                                                {(t) => <>{t('main.mykyat.purchaseTotalAmount')}</>}
                                            </Translation> - <strong className="text-custom">{this.allTotalPrice().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}</strong><br />
                                            <Translation>
                                                {(t) => <>{t('main.mykyat.amountNotEnough')}</>}
                                            </Translation> <br />
                                            <Translation>
                                                {(t) => <>{t('main.mykyat.amountCharge')}</>}
                                            </Translation>&nbsp;
                                            <Translation>
                                                {(t) => <>{t('main.mykyat.tryAgain')}</>}
                                            </Translation>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    ) : (
                            <Modal
                                isOpen={show2}
                                onRequestClose={this.closeModal2}
                                contentLabel="MyKyat အကောင့်ထွက်ရန်"
                                style={loginStyle}
                                overlayClassName="payment-modal-wrapper"
                            >
                                <div className="col-12 col-lg-6 mx-auto h-100 px-0">
                                    <button
                                        className="btn shadow-sm border-0 rounded-circle position-absolute text-default p-0 btn-cart-hover"
                                        style={{
                                            left: '15px',
                                            top: '1.5rem',
                                            zIndex: '9999999999',
                                            fontSize: '30px',
                                            width: '50px',
                                            height: '50px',
                                            lineHeight: '30px',
                                            background: '#fff',
                                        }}
                                        onClick={() => {
                                            this.closeModal2()
                                            this.setState({
                                                mykyat_login: '',
                                                mykyat_password: ''
                                            })
                                        }}
                                    >
                                        <MdArrowBack />
                                    </button>

                                    <div
                                        className="d-table w-100 h-100 px-4 position-relative"
                                    >
                                        <div
                                            className="d-table-cell align-middle py-3 text-center"
                                            style={{
                                                paddingBottom: '5rem'
                                            }}
                                        >
                                            <p
                                                className="text-center mb-4"
                                            >
                                                <img
                                                    src={MYKYAT_LOG}
                                                    alt="MyKyat"
                                                    style={{
                                                        width: '100px'
                                                    }}
                                                />
                                            </p>
                                            <div
                                                className="mb-5 text-left mx-auto"
                                            >
                                                <div className="row">
                                                    <div className="col-sm-6 mb-3 mb-sm-0">
                                                        <ul className="list-group rounded-sm shadow-sm mb-3 list-group-horizontal">
                                                            <li className="list-group-item px-3 py-2 bg-default w-50">
                                                                <p
                                                                    className="mb-0 text-light font-weight-normal"
                                                                    style={{
                                                                        fontSize: '0.8rem',
                                                                        lineHeight: '1.5'
                                                                    }}
                                                                >
                                                                    Display Name
                                                                </p>
                                                            </li>
                                                            <li className="list-group-item px-3 py-2 w-50">
                                                                <p
                                                                    className="mb-0 font-weight-normal text-custom"
                                                                    style={{
                                                                        fontSize: '0.9rem',
                                                                        lineHeight: '1.5'
                                                                    }}
                                                                >
                                                                    {myKyatId[0] && myKyatId[0].displayName}
                                                                </p>
                                                            </li>
                                                        </ul>
                                                        <ul className="list-group rounded-sm shadow-sm mb-3 list-group-horizontal">
                                                            <li className="list-group-item px-3 py-2 bg-default w-50">
                                                                <p
                                                                    className="mb-0 text-light font-weight-normal"
                                                                    style={{
                                                                        fontSize: '0.8rem',
                                                                        lineHeight: '1.5'
                                                                    }}
                                                                >
                                                                    myKyat ID
                                                                </p>
                                                            </li>
                                                            <li className="list-group-item px-3 py-2 w-50">
                                                                <p
                                                                    className="mb-0 font-weight-normal text-custom"
                                                                    style={{
                                                                        fontSize: '0.9rem',
                                                                        lineHeight: '1.5'
                                                                    }}
                                                                >
                                                                    {myKyatId[0] && myKyatId[0].id}
                                                                </p>
                                                            </li>
                                                        </ul>
                                                        <ul className="list-group rounded-sm shadow-sm mb-3 list-group-horizontal">
                                                            <li className="list-group-item px-3 py-2 bg-default w-50">
                                                                <p
                                                                    className="mb-0 text-light font-weight-normal"
                                                                    style={{
                                                                        fontSize: '0.8rem',
                                                                        lineHeight: '1.5'
                                                                    }}
                                                                >
                                                                    Transaction ID
                                                                </p>
                                                            </li>
                                                            <li className="list-group-item px-3 py-2 w-50">
                                                                <p
                                                                    className="mb-0 font-weight-normal text-custom"
                                                                    style={{
                                                                        fontSize: '0.9rem',
                                                                        lineHeight: '1.5'
                                                                    }}
                                                                >
                                                                    {myKyatId[0] && myKyatId[0].transactionId}
                                                                </p>
                                                            </li>
                                                        </ul>
                                                        <ul className="list-group rounded-sm shadow-sm list-group-horizontal">
                                                            <li className="list-group-item px-3 py-2 bg-default w-50">
                                                                <p
                                                                    className="mb-0 text-light font-weight-normal"
                                                                    style={{
                                                                        fontSize: '0.8rem',
                                                                        lineHeight: '1.5'
                                                                    }}
                                                                >
                                                                    <Translation>
                                                                        {(t) => <>{t('main.charge.fee')}</>}
                                                                    </Translation>
                                                                </p>
                                                            </li>
                                                            <li className="list-group-item px-3 py-2 w-50">
                                                                <p
                                                                    className="mb-0 font-weight-normal text-custom"
                                                                    style={{
                                                                        fontSize: '0.9rem',
                                                                        lineHeight: '1.5'
                                                                    }}
                                                                >
                                                                    {myKyatId[0] && myKyatId[0].fee} {currency}
                                                                </p>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <div className="col-sm-6 mb-3 mb-sm-0">
                                                        <ul className="list-group rounded-sm shadow-sm mb-3">
                                                            <li className="list-group-item px-3 py-2 bg-default">
                                                                <p
                                                                    className="mb-0 text-light font-weight-normal"
                                                                    style={{
                                                                        fontSize: '0.8rem',
                                                                        lineHeight: '1.5'
                                                                    }}
                                                                >
                                                                    <Translation>
                                                                        {(t) => <>{t('main.purchase.cost')}</>}
                                                                    </Translation>
                                                                </p>
                                                            </li>
                                                            <li className="list-group-item px-3 py-2">
                                                                <p
                                                                    className="mb-0 font-weight-normal text-custom"
                                                                    style={{
                                                                        fontSize: '1rem',
                                                                        lineHeight: '1.5'
                                                                    }}
                                                                >
                                                                    {cartTotal.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}
                                                                </p>
                                                            </li>
                                                        </ul>
                                                        <ul className="list-group rounded-sm shadow-sm">
                                                            <li className="list-group-item px-3 py-2 bg-default">
                                                                <p
                                                                    className="mb-0 text-light font-weight-normal"
                                                                    style={{
                                                                        fontSize: '0.8rem',
                                                                        lineHeight: '1.5'
                                                                    }}
                                                                >
                                                                    <Translation>
                                                                        {(t) => <>{t('main.total.cost')}</>}
                                                                    </Translation>
                                                                </p>
                                                            </li>
                                                            <li className="list-group-item px-3 py-2">
                                                                <p
                                                                    className="mb-0 font-weight-normal text-custom"
                                                                    style={{
                                                                        fontSize: '1rem',
                                                                        lineHeight: '1.5'
                                                                    }}
                                                                >
                                                                    {myKyatId[0] && myKyatId[0].productPrice} {currency}
                                                                </p>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                            </div>

                                            <p
                                                className="mb-3 text-default font-weight-normal"
                                                style={{
                                                    fontSize: '0.9rem',
                                                    lineHeight: '2'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.mykyat.toBuy')}</>}
                                                </Translation>&nbsp;
                                                <Translation>
                                                    {(t) => <>{t('main.mykyat.amountEnough')}</>}
                                                </Translation>
                                            </p>

                                            <button
                                                className="border-0 shadow-sm bg-default text-white py-2 px-5 btn-cart-hover"
                                                style={{
                                                    lineHeight: '1.8',
                                                    fontSize: '1rem',
                                                    background: '#fff',
                                                    borderRadius: '2px'
                                                }}
                                                onClick={this.encryptPurchaseContinue.bind(this)}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.mykyat.payConfirm')}</>}
                                                </Translation>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Modal>
                        )
                }
            </>

        const modal3 =
            <>
                {
                    decrypt_purchase[0] === '1' ? (
                        <Modal
                            isOpen={show3}
                            onRequestClose={this.closeModal3}
                            contentLabel="MyKyat အကောင့်ထွက်ရန်"
                            style={loginStyle}
                            overlayClassName="payment-modal-wrapper"
                        >
                            <div className="col-12 col-lg-6 mx-auto h-100 px-0">
                                <button
                                    className="btn shadow-sm border-0 rounded-circle position-absolute text-dark p-0 btn-cart-hover"
                                    style={{
                                        left: '15px',
                                        top: '1.5rem',
                                        zIndex: '9999999999',
                                        fontSize: '30px',
                                        width: '50px',
                                        height: '50px',
                                        lineHeight: '30px',
                                        background: '#fff',
                                    }}
                                    onClick={() => {
                                        this.closeModal3()
                                        this.closeModal2()
                                        this.closeModal1()
                                        this.setState({
                                            mykyat_login: '',
                                            mykyat_password: '',
                                            decrypt_auth: '',
                                            decrypt_purchase: '',
                                            encrypt_auth: '',
                                            encrypt_purchase: ''
                                        })
                                    }}
                                >
                                    <MdArrowBack />
                                </button>

                                <div
                                    className="d-table w-100 h-100 px-4 position-relative"
                                >
                                    <div
                                        className="d-table-cell align-middle py-3"
                                        style={{
                                            paddingBottom: '5rem'
                                        }}
                                    >
                                        <p
                                            className="text-center mb-4"
                                        >
                                            <img
                                                src={MYKYAT_LOG}
                                                alt="MyKyat"
                                                className=""
                                                style={{
                                                    width: '100px'
                                                }}
                                            />
                                        </p>
                                        <p
                                            className="mb-0 text-custom text-center"
                                            style={{
                                                fontSize: '1rem',
                                                lineHeight: '2'
                                            }}
                                        >
                                            <Translation>
                                                {(t) => <>{t('main.mykyat.error')}</>}
                                            </Translation>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    ) : (
                            <Modal
                                isOpen={show3}
                                // onRequestClose={() => {}}
                                contentLabel="MyKyat အကောင့်ကို အောင်မြင်စွာ လုပ်ဆောင်နိုင်ပါပီ"
                                style={loginStyle}
                                overlayClassName="payment-modal-wrapper"
                            >
                                <div className="col-12 col-lg-6 mx-auto h-100 px-0">
                                    <button
                                        className="btn shadow-sm border-0 rounded-circle position-absolute text-default p-0 btn-cart-hover"
                                        style={{
                                            right: '15px',
                                            top: '1.5rem',
                                            zIndex: '9999999999',
                                            fontSize: '30px',
                                            width: '50px',
                                            height: '50px',
                                            lineHeight: '30px',
                                            background: '#fff',
                                        }}
                                        onClick={this.handleMyKyatSubmit.bind(this)}
                                    >
                                        <MdArrowForward />
                                    </button>

                                    <div
                                        className="d-table w-100 h-100 px-4 position-relative"
                                    >
                                        <div
                                            className="d-table-cell align-middle py-3 text-center"
                                            style={{
                                                paddingBottom: '5rem'
                                            }}
                                        >
                                            <p
                                                className="text-center mb-5"
                                            >
                                                <img
                                                    src={MYKYAT_LOG}
                                                    alt="MyKyat"
                                                    className=""
                                                    style={{
                                                        width: '100px'
                                                    }}
                                                />
                                            </p>
                                            <span
                                                className="d-inline-block mb-4 border-0 text-white bg-custom rounded-circle shadow-sm"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    lineHeight: '50px',
                                                    fontSize: '30px',
                                                    background: '#0a55a6'
                                                }}
                                            >
                                                <FiCheck />
                                            </span>
                                            <p
                                                className="mb-2 text-default font-weight-normal"
                                                style={{
                                                    fontSize: '0.9rem',
                                                    lineHeight: '2'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.mykyat.success')}</>}
                                                </Translation>
                                            </p>
                                            <p
                                                className="mb-4 text-default font-weight-normal"
                                                style={{
                                                    fontSize: '0.9rem',
                                                    lineHeight: '2'
                                                }}
                                            >
                                                {/* Transaction ID - <strong>{decrypt_purchase[1]}</strong><br /> */}
                                                <Translation>
                                                    {(t) => <>{t('main.mykyat.pItemTotalAmount')}</>}
                                                </Translation> - <strong className="text-custom">{myKyatId[0] && myKyatId[0].productPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {currency}</strong>
                                            </p>
                                            <button
                                                className="border-0 shadow-sm bg-default text-white py-2 px-5 btn-cart-hover"
                                                style={{
                                                    lineHeight: '2',
                                                    fontSize: '1rem',
                                                    background: '#fff',
                                                    borderRadius: '2px'
                                                }}
                                                onClick={this.handleMyKyatSubmit.bind(this)}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.mykyat.checkIDList')}</>}
                                                </Translation>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Modal>
                        )
                }
            </>

        const contactList =
            <>
                {
                    this.state.user === null ? (
                        <>
                            {
                                this.props.address_contact.length <= 0 ? (
                                    <div className="mb-5">
                                        <h4
                                            className="font-weight-normal mb-3 text-default"
                                            style={{
                                                lineHeight: '1.5',
                                                fontSize: '1.1rem'
                                            }}
                                        >
                                            <Translation>
                                                {(t) => <>{t('main.shippingAddress')}</>}
                                            </Translation>
                                        </h4>
                                        <div
                                            className="circle-link-hover shadow-sm rounded-sm d-flex align-items-center justify-content-center px-3"
                                            style={{
                                                width: '200px',
                                                maxWidth: '100%',
                                                height: '100px',
                                                cursor: 'pointer',
                                                fontSize: '24px',
                                                color: '#000',
                                                background: '#fff'
                                            }}
                                            onClick={this.createContactOpen.bind(this)}
                                        >
                                            <FiPlus />
                                            <span style={{ fontSize: '0.9rem' }} className="d-inline-block pl-2">
                                                <Translation>
                                                    {(t) => <>{t('main.add.new.address')}</>}
                                                </Translation>
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                        <div className="mb-5">
                                            <h4
                                                className="font-weight-normal mb-3 text-default"
                                                style={{
                                                    lineHeight: '1.5',
                                                    fontSize: '1.1rem'
                                                }}
                                            >
                                                <Translation>
                                                    {(t) => <>{t('main.shippingAddress')}</>}
                                                </Translation>
                                            </h4>

                                            <div
                                                className="bg-white position-relative shadow-sm rounded-sm"
                                            >
                                                {
                                                    this.props.address_contact.map((a, index) => (
                                                        <div className="p-4" key={index}>
                                                            <p
                                                                className="mb-2 font-weight-normal text-muted pb-2 border-bottom"
                                                                style={{
                                                                    lineHeight: '1.6',
                                                                    fontSize: '0.85rem'
                                                                }}
                                                            >
                                                                <span
                                                                    className="pr-1 d-inline-block text-dark"
                                                                    style={{
                                                                        lineHeight: '0',
                                                                        fontSize: '1rem'
                                                                    }}
                                                                ><FaUser /></span> {a.name}
                                                            </p>
                                                            <p
                                                                className="mb-2 font-weight-normal text-muted pb-2 border-bottom"
                                                                style={{
                                                                    lineHeight: '1.6',
                                                                    fontSize: '0.85rem'
                                                                }}
                                                            >
                                                                <span
                                                                    className="pr-1 d-inline-block text-dark"
                                                                    style={{
                                                                        lineHeight: '0',
                                                                        fontSize: '1rem'
                                                                    }}
                                                                ><FaMobile /></span> {a.phone}
                                                            </p>
                                                            <p
                                                                className="mb-2 font-weight-normal text-muted pb-2 border-bottom"
                                                                style={{
                                                                    lineHeight: '1.6',
                                                                    fontSize: '0.85rem'
                                                                }}
                                                            >
                                                                <span
                                                                    className="pr-1 d-inline-block text-dark"
                                                                    style={{
                                                                        lineHeight: '0',
                                                                        fontSize: '1rem'
                                                                    }}
                                                                ><MdMail /></span> {a.email}
                                                            </p>
                                                            <div className="d-flex">
                                                                <div className="pr-1">
                                                                    <span
                                                                        className="d-inline-block text-dark"
                                                                        style={{
                                                                            lineHeight: '0',
                                                                            fontSize: '1rem'
                                                                        }}
                                                                    >
                                                                        <FaMapMarkerAlt />
                                                                    </span>
                                                                </div>
                                                                <div className="flex-grow-1 font-weight-normal text-muted">
                                                                    <p
                                                                        className="mb-1"
                                                                        style={{
                                                                            lineHeight: '1.6',
                                                                            fontSize: '0.85rem'
                                                                        }}
                                                                    >
                                                                        {a.home_no} , {a.street_quarter}
                                                                    </p>
                                                                    <p
                                                                        className="mb-0"
                                                                        style={{
                                                                            lineHeight: '1.6',
                                                                            fontSize: '0.85rem'
                                                                        }}
                                                                    >
                                                                        {a.township}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                                <div
                                                    className="position-absolute"
                                                    style={{
                                                        right: '0',
                                                        top: '0'
                                                    }}
                                                >
                                                    <button
                                                        className="text-light btn bg-default rounded-0 shadow-none border-0 py-2 px-2 btn-cart-hover"
                                                        style={{
                                                            transition: '0.3s ease-in-out',
                                                            fontSize: '10px',
                                                            background: '#7f187f'
                                                        }}
                                                        onClick={() => {
                                                            this.editContactOpen()
                                                        }}
                                                    >
                                                        <Translation>
                                                            {(t) => <>{t('main.edit')}</>}
                                                        </Translation>
                                                    </button>
                                                    <button
                                                        className="text-light btn btn-danger rounded-0 shadow-none border-0 py-2 px-2 btn-cart-hover"
                                                        style={{
                                                            transition: '0.3s ease-in-out',
                                                            fontSize: '10px'
                                                        }}
                                                        onClick={this.props.removeContact.bind(this)}
                                                    >
                                                        <Translation>
                                                            {(t) => <>{t('main.addressDelete')}</>}
                                                        </Translation>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                            }
                        </>
                    ) : (
                            <div className="mb-5">
                                <h4
                                    className="font-weight-normal mb-3 text-default"
                                    style={{
                                        lineHeight: '1.5',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    <Translation>
                                        {(t) => <>{t('main.shippingAddress')}</>}
                                    </Translation>
                                </h4>

                                <div
                                    className="bg-white py-3 shadow-sm rounded-sm"
                                >
                                    <ViewContact
                                        agent={agent}
                                        agentAddContact={this.props.agentAddContact}
                                        agentRemoveContact={this.props.agentRemoveContact}
                                    />

                                    {
                                        agent_address_contact.length >= 1 &&
                                        <div
                                            className="mx-3 p-4 mt-3 position-relative rounded-sm"
                                            style={{
                                                background: '#003457'
                                            }}
                                        >
                                            <p
                                                className="mb-2 font-weight-normal text-light pb-2 border-bottom"
                                                style={{
                                                    lineHeight: '1.6',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                <span
                                                    className="pr-1 d-inline-block text-white"
                                                    style={{
                                                        lineHeight: '0',
                                                        fontSize: '1rem'
                                                    }}
                                                ><FaUser /></span> {agent_address_contact[0].name}
                                            </p>

                                            {
                                                agent_address_contact[0].addressPhone &&
                                                <p
                                                    className="mb-2 font-weight-normal text-light pb-2 border-bottom"
                                                    style={{
                                                        lineHeight: '1.6',
                                                        fontSize: '0.85rem'
                                                    }}
                                                >
                                                    <span
                                                        className="pr-1 d-inline-block text-white"
                                                        style={{
                                                            lineHeight: '0',
                                                            fontSize: '1rem'
                                                        }}
                                                    ><FaMobile /></span> {agent_address_contact[0].addressPhone}
                                                </p>
                                            }

                                            {
                                                agent_address_contact[0].email &&
                                                <p
                                                    className="mb-2 font-weight-normal text-light pb-2 border-bottom"
                                                    style={{
                                                        lineHeight: '1.6',
                                                        fontSize: '0.85rem'
                                                    }}
                                                >
                                                    <span
                                                        className="pr-1 d-inline-block text-white"
                                                        style={{
                                                            lineHeight: '0',
                                                            fontSize: '1rem'
                                                        }}
                                                    ><MdMail /></span> {agent_address_contact[0].email}
                                                </p>
                                            }

                                            <div className="d-flex">
                                                <div className="pr-1">
                                                    <span
                                                        className="d-inline-block text-white"
                                                        style={{
                                                            lineHeight: '0',
                                                            fontSize: '1rem'
                                                        }}
                                                    >
                                                        <FaMapMarkerAlt />
                                                    </span>
                                                </div>
                                                <div className="flex-grow-1 font-weight-normal text-light">
                                                    <p
                                                        className="mb-1"
                                                        style={{
                                                            lineHeight: '1.6',
                                                            fontSize: '0.85rem'
                                                        }}
                                                    >
                                                        {
                                                            agent_address_contact[0].home_no &&
                                                            <>{agent_address_contact[0].home_no} , </>
                                                        }
                                                        {agent_address_contact[0].street_quarter && agent_address_contact[0].street_quarter}
                                                    </p>
                                                    <p
                                                        className="mb-0"
                                                        style={{
                                                            lineHeight: '1.6',
                                                            fontSize: '0.85rem'
                                                        }}
                                                    >
                                                        {agent_address_contact[0].township && agent_address_contact[0].township}
                                                    </p>
                                                </div>
                                            </div>

                                            <div
                                                className="position-absolute"
                                                style={{
                                                    right: '0',
                                                    top: '0'
                                                }}
                                            >
                                                <button
                                                    className="text-white btn rounded-0 shadow-none border-0 py-2 px-3"
                                                    style={{
                                                        transition: '0.3s ease-in-out',
                                                        fontSize: '1.8rem',
                                                        lineHeight: '0'
                                                    }}
                                                    onClick={this.props.agentRemoveContact.bind(this)}
                                                >
                                                    <RiCloseLine />
                                                </button>
                                            </div>
                                        </div>
                                    }
                                </div>

                            </div>
                        )
                }
            </>

        const loadingModal =
            <Modal
                isOpen={loadShow}
                contentLabel="Loading"
                onRequestClose={this.closeLoadModal}
                overlayClassName="payment-modal-wrapper loading-payment-modal"
                style={loadingStyle}
            >
                <Loading />
            </Modal>

        return (
            <IonPage>

                <IonHeader className="ion-no-border">
                    <IonToolbar className="original-bg">
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/home" className="text-default" />
                        </IonButtons>
                        <IonTitle className="text-center" size="small" style={cssName.pd}>
                            <IonLabel style={cssName.name} className="text-default font-weight-normal">
                                <Translation>
                                    {(t) => <>{t('main.checkout')}</>}
                                </Translation> 
                            </IonLabel>
                        </IonTitle>
                        <IonButtons slot="end">
                            <IonButton 
                                style={{
                                    width:'48px', 
                                    height: '48px' 
                                }} 
                            />
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent fullscreen={true} className="ion-no-border original-bg">
                    {
                        cartProducts.length <= 0 ? (
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
                                                    {(t) => <>{t('main.pageAccessDenied')}</>}
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
                        ) : (
                            <>
                                <div
                                    className="py-4"
                                    style={{
                                        background: 'radial-gradient(circle, #0f4c82 , #003457)'
                                    }}
                                >
                                    <div className="container">
                                        <h4
                                            className="font-weight-normal mb-0 text-light"
                                            style={{
                                                lineHeight: '1.5',
                                                fontSize: '1.3rem'
                                            }}
                                        >
                                            <Translation>
                                                {(t) => <>{t('main.checkout.step')}</>}
                                            </Translation>
                                        </h4>
                                    </div>
                                </div>

                                <div className="bg-light-custom py-5">

                                    <div className="container">

                                        {this.state.acc_loading === true ? <>{loadingModal}</> : null}

                                        {modal1}

                                        {modal2}

                                        {modal3}

                                        <div className="row">
                                            <div className="col-12 col-md-6 col-lg-8">

                                                {contactList}

                                                {deliveryTime}

                                                {paymentMethod}

                                            </div>
                                            <div className="col-12 col-md-6 col-lg-4 mt-5 mt-md-0">

                                                {orderItemLists}

                                            </div>
                                            <div className="col-12 col-md-6 col-lg-8 d-none d-md-block my-md-5">

                                                {placeOrder}

                                            </div>
                                        </div>
                                    </div>

                                    {smallPlaceOrder}

                                </div>
                            </>
                        )
                    }
                </IonContent>

                <IonFooter>

                </IonFooter>

            </IonPage>
        )
    }
}

const mapStateToProps = state => ({
    cartProducts: state.cart.products,
    cartTotal: state.total.data,
    productToRemove: state.cart.productToRemove,
    productToChange: state.cart.productToChange,
    newProduct: state.cart.productToAdd,
    address_contact: state.contact,
    agent_address_contact: state.agentContact,
    myKyatId: state.myKyat
})

export default connect(
    mapStateToProps,
    {
        loadCart,
        updateTotalCart,
        removeProduct,
        changeProductQuantity,
        removeContact,
        agentAddContact,
        agentRemoveContact,
        addOrder,
        addOrderLink,
        addMyKyat,
        removeMyKyat
    }
)(withRouter(Checkout))