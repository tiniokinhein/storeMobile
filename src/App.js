import React from 'react'
import {
  Plugins,
  StatusBarStyle
} from '@capacitor/core'
import { IonApp, IonRouterOutlet } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { Route, Redirect } from 'react-router-dom'
import Home from './pages/Home'
import Cart from './pages/Cart'
import FloatCart from './components/floatCart/FloatCart'
import Checkout from './pages/Checkout'
import CompletedOrder from './pages/CompletedOrder'
import Categories from './pages/Categories'
import TrackID from './pages/TrackID'
import OrderID from './pages/OrderID'
import InvoiceID from './pages/InvoiceID'
import Sidebar from './components/layout/Sidebar'
import Default from './pages/Default'
import Product from './pages/Product'
import SubCategories from './pages/SubCategories'
import Search from './pages/Search'
import SearchModal from './components/search/SearchModal'
import NewProduct from './pages/NewProduct'
import ProductCategories from './pages/ProductCategories'
import CreateContact from './components/contact/CreateContact'
import EditContact from './components/contact/EditContact'
import Brands from './pages/Brands'
import Brand from './pages/Brand'
import { auth } from './helpers/firebase'
import Spinner from './components/layout/Spinner'
import Register from './pages/user/Register'
import SignIn from './pages/user/SignIn'
import PasswordReset from './pages/user/PasswordReset'
import EditProfile from './pages/user/EditProfile'
import Manage from './pages/user/Manage'
import PersonalProfile from './pages/user/PersonalProfile'
import ChangePassword from './pages/user/ChangePassword'
import AddAddress from './pages/user/AddAddress'
import Addresses from './pages/user/Addresses'
import EditAddress from './pages/user/EditAddress'
import AddProfile from './pages/user/AddProfile'
import Orders from './pages/user/Orders'
import Cancellation from './pages/user/Cancellation'
import Completion from './pages/user/Completion'
import AddContactPopUp from './components/contact/user/AddContactPopUp'
import OrderIds from './pages/user/OrderIds'
import CancelledOrderId from './pages/user/CancelledOrderId'
import CompletedOrderId from './pages/user/CompletedOrderId'
import FreeUserNoti from './components/notification/FreeUserNoti'
import AuthUserNoti from './components/notification/AuthUserNoti'
import View from './pages/View'
import Whishlist from './pages/Whishlist'
import Account from './pages/Account'



const { StatusBar } = Plugins

class App extends React.Component {

  isStatusBarLight = true

  state = {
    loading: true,
    authenticated: false
  }

  componentDidMount() {

    auth.onAuthStateChanged((user) => {
        if (user) {
          this.setState({
            authenticated: true,
            loading: false
          })
        } else {
          this.setState({
            authenticated: false,
            loading: false
          })
        }
    })

    ////////////////////////////////////////
    StatusBar.setStyle({
      style: this.isStatusBarLight ? StatusBarStyle.Dark : StatusBarStyle.Light
    })
    this.isStatusBarLight = !this.isStatusBarLight

    // Display content under transparent status bar (Android only)
    // StatusBar.setOverlaysWebView({
    //   overlay: true
    // })
    //////////////////////////////////////

  }

  render() {

    return this.state.loading === true ? <Spinner /> : (

      <IonApp>

        <IonReactRouter>

          <Sidebar />

          <SearchModal />

          <CreateContact />

          <EditContact />

          <AddContactPopUp />

          <FloatCart />

          <FreeUserNoti />

          <AuthUserNoti />

          <IonRouterOutlet id="main">

            <Route path="/c/:slug" component={Categories} />
            <Route path="/category/:slug" component={SubCategories} />
            <Route path="/brand/:slug" component={Brand} />
            <Route path='/product/:slug' component={Product} />
            <Route path="/invoice/:id" component={InvoiceID} />
            <Route path="/order/:uuid" component={OrderID} />
            <Route path="/completed/:uuid" component={CompletedOrder} />
            <Route path="/search/product=:text" component={Search} />

            <Route 
              exact={true}
              path="/edit-address/:slug" 
              render={() => this.state.authenticated === true ? <EditAddress /> : <Redirect to="/login" />} 
            />

            <Route 
              exact={true}
              path="/user-order/:uuid" 
              render={() => this.state.authenticated === true ? <OrderIds /> : <Redirect to="/login" />}
            />

            <Route 
              exact={true}
              path="/cancelled-order/:uuid" 
              render={() => this.state.authenticated === true ? <CancelledOrderId /> : <Redirect to="/login" />} 
            />

            <Route
              exact={true}
              path="/completed-order/:uuid" 
              render={() => this.state.authenticated === true ? <CompletedOrderId /> : <Redirect to="/login" />}
            />

            <Route exact={true} path="/home" component={Home} />
            <Route exact={true} path="/" render={() => <Redirect to="/home" />} />

            <Route path='/track' component={TrackID} />
            <Route path='/notifications' component={TrackID} />

            <Route 
              exact={true}
              path="/add-profile" 
              render={() => this.state.authenticated === true ? <AddProfile /> : <Redirect to="/login" />}
            />

            <Route 
              exact={true}
              path="/edit-profile" 
              render={() => this.state.authenticated === true ? <EditProfile /> : <Redirect to="/login" />} 
            />

            <Route 
              exact={true}
              path="/manage-account" 
              render={() => this.state.authenticated === true ? <Manage /> : <Redirect to="/login" />}
            />

            <Route 
              exact={true}
              path="/personal-profile" 
              render={() => this.state.authenticated === true ? <PersonalProfile /> : <Redirect to="/login" />}
            />
            <Route 
              exact={true}
              path="/change-password"  
              render={() => this.state.authenticated === true ? <ChangePassword /> : <Redirect to="/login" />}
            />
            <Route 
              exact={true}
              path="/add-address" 
              render={() => this.state.authenticated === true ? <AddAddress /> : <Redirect to="/login" />}
            />
            <Route 
              exact={true}
              path="/addresses" 
              render={() => this.state.authenticated === true ? <Addresses /> : <Redirect to="/login" />}
            />
            <Route 
              exact={true}
              path="/order-lists" 
              render={() => this.state.authenticated === true ? <Orders /> : <Redirect to="/login" />}
            />
            <Route 
              exact={true}
              path="/order-cancellations"  
              render={() => this.state.authenticated === true ? <Cancellation /> : <Redirect to="/login" />}
            />
            <Route 
              exact={true}
              path="/order-completions" 
              render={() => this.state.authenticated === true ? <Completion /> : <Redirect to="/login" />}
            />

            <Route path="/brands" component={Brands} />
            <Route path="/product-categories" component={ProductCategories} />
            <Route path="/new-products" component={NewProduct} />
            <Route path="/cart" component={Cart} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/track" component={TrackID} />
            <Route path="/view" component={View} />
            <Route path="/favourite-list" component={Whishlist} />

            <Route 
              exact={true}
              path="/account"
              render={() => this.state.authenticated === true ? <Redirect to="/manage-account" /> : <Account />}
            />

            <Route 
              exact={true}
              path="/login"
              render={() => this.state.authenticated === true ? <Redirect to="/manage-account" /> : <SignIn />}
            />

            <Route 
              exact={true}
              path="/register"
              render={() => this.state.authenticated === true ? <Redirect to="/manage-account" /> : <Register />}
            />

            <Route 
              exact={true}
              path="/password-reset"
              render={() => this.state.authenticated === true ? <Redirect to="/manage-account" /> : <PasswordReset />}
            />

            <Route component={Default} />

          </IonRouterOutlet>

        </IonReactRouter>

      </IonApp>
    )
  }
}

export default App
