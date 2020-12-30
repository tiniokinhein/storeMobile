import React, { Suspense } from "react"
import ReactDOM from "react-dom"
import App from "./App"
import '@ionic/core/css/core.css'
import '@ionic/core/css/ionic.bundle.css'

import "./assets/scss/style.scss"
import "./assets/scss/media.scss"
import "./assets/scss/darktheme.scss"

import * as serviceWorker from "./serviceWorker"
import Spinner from "./components/layout/Spinner"

import "@codetrix-studio/capacitor-google-auth"

import "./helpers/i18n";

import { Provider } from "react-redux";
import store from "./store";

const rootElement = document.getElementById("root");
const initialState = {};

ReactDOM.render(
  <Provider store={store(initialState)}>
    <Suspense fallback={<Spinner />}>
      <App useSuspense={true} />
    </Suspense>
  </Provider>,
  rootElement
);

serviceWorker.unregister()
