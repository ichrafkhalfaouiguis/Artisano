import React from 'react';
import ReactDOM from 'react-dom/client';

import './assets/styles/bootstrap.custom.css';


import './assets/styles/index.css';
 //import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrderListScreen from './screens/admin/OrderListScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import UserListScreen from './screens/admin/UserListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';
import CategoryScreen from './screens/CategoryScreen';
import AboutUsScreen from './screens/AboutUsScreen'
import Activation from './components/Activation';
import ProductListScreenn from './screens/ProductListScreenn'
import UpdatePassword from './screens/UpdatePassword';
import AboutEditScreen from './screens/admin/AboutEditScreen';
import AboutListScreen from './screens/admin/AboutListScreen';
import Email from './components/Email';
import store from './store';
import { Provider } from 'react-redux';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/search/:keyword' element={<ProductListScreenn />} />
          <Route path='/page/:pageNumber' element={<ProductListScreenn />} />
          <Route path="/product" element={<ProductListScreenn />} />
          <Route path='/search/:keyword/page/:pageNumber' element={<ProductListScreenn />} />

          <Route path='/aboutus' element={<AboutUsScreen />} />
          
      
      <Route path='category/:category' element={<CategoryScreen />} />
      <Route path="/verify/:activationCode" element={<Activation />} />
      <Route path="/updatepsw/:token" element={<UpdatePassword />} />
      <Route path="/email" element={<Email />} />




      <Route path='/product/:id' element={<ProductScreen />} />
      <Route path='/cart' element={<CartScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      {/* Registered users */}
      <Route path='' element={<PrivateRoute />}>
        <Route path='/shipping' element={<ShippingScreen />} />
        <Route path='/payment' element={<PaymentScreen />} />
        <Route path='/placeorder' element={<PlaceOrderScreen />} />
        <Route path='/order/:id' element={<OrderScreen />} />
        <Route path='/profile' element={<ProfileScreen />} />
      </Route>
      {/* Admin users */}
      <Route path='' element={<AdminRoute />}>
        <Route path='/admin/orderlist' element={<OrderListScreen />} />
        <Route path='/productlist' element={<ProductListScreen />} />
        <Route path='/admin/about/edit' element={<AboutEditScreen/>} />
        <Route path="/about-list" element={<AboutListScreen />} />
        

      
        <Route
          path='/admin/productlist/:pageNumber'
          
          element={<ProductListScreen />}
        /> 
        <Route path='/admin/userlist' element={<UserListScreen />} />
        <Route path='/admin/product/:id/edit' element={<ProductEditScreen />} />
       
        <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true}>
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
   
  </React.StrictMode>
);

reportWebVitals();