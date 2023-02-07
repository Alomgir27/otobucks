import './App.scss';
import './css/App.scss';
import 'react-calendar/dist/Calendar.css';

import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import { Modal } from 'antd';

import About from './Pages/WebsitePages/About';
import Categories from './Pages/Categories';
import Chat from './Pages/Chat/Chat';
import Contact from './Pages/WebsitePages/Contact';
import CustomerEstimation from './Pages/CustomerEstimation';
import Dashboard from './Pages/Dashboard';
import Disputes from './Pages/Disputes';
import EstimationInvoice from './Pages/CustomerEstimation/EstimationInvoice';
import EstimationSettings from './Pages/CustomerEstimation/EstimationSettings';
import ServiceBookings from './Pages/ServiceBookings/index';
import ForgetPassword from './Pages/ForgetPassword';
import InviteFriends from './Pages/InviteFriends';
import Jobs from './Pages/JobsManagement';
import Login from './Pages/Login';
import MyWallet from './Pages/MyWallet';
import Notifications from './Pages/Notifications';
import OfferForm from './Pages/Offers/OfferForm';
import Offers from './Pages/Offers';
import OffersBookings from './Pages/OffersBooking';
import PrivacyPolicy from './Pages/WebsitePages/PrivacyPolicy';
import ProductCategories from './Pages/ProductCategories';
import Products from './Pages/Products';
import MyOrders from './Pages/MyOrders/index';
import ProductsForm from './Pages/Products/ProductForm';
import Profile from './Pages/Profile';
import Promotions from './Pages/Promotions';
import ProtectedRoute from './services/ProtectedRoutes';
import { Provider } from 'react-redux';
import PurchaseProduct from './Pages/PurchaseProduct';
import Rating from './Pages/Rating';
import Register from './Pages/Register';
import ServiceForm from './Pages/Services/ServiceForm';
import Services from './Pages/Services';
import SiderLayout from './Components/Sider';
import TermsCondition from './Pages/WebsitePages/TermsCondition';
import TransactionHistory from './Pages/TransactionHistory';
import store from './redux/store';
import { onMessageListener } from './firebase';
import UpdatePassword from './Pages/UpdatePassword/UpdatePassword';
import { useEffect } from 'react';
import { useState } from 'react';
import Staff from './Pages/Staff';
// import './services/FCMNotification';
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem('token');

  const handleAllow = () => {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        setIsModalOpen(false);
        new Notification('Notifications are on!');
      } else {
        setIsModalOpen(false);
        alert(permission);
      }
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  onMessageListener();
  useEffect(() => {
    if (Notification.permission === 'denied') {
      setIsModalOpen(true);
    }
  }, []);

  return (
    <>
      {' '}
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path='/'>
              {token ? <Redirect to='/home' /> : <Login />}
            </Route>
            <Route exact path='/login'>
              {token ? <Redirect to='/home' /> : <Login />}
            </Route>
            <Route exact path='/forget-password'>
              {token ? <Redirect to='/home' /> : <ForgetPassword />}
            </Route>
            <Route exact path='/register'>
              {token ? <Redirect to='/home' /> : <Register />}
            </Route>
            <SiderLayout>
              <ProtectedRoute exact path='/home' component={Dashboard} />
              <ProtectedRoute exact path='/categories' component={Categories} />
              <ProtectedRoute exact path='/services' component={Services} />
              <ProtectedRoute
                exact
                path='/purchase-product'
                component={PurchaseProduct}
              />
              <ProtectedRoute
                exact
                path='/invite-friends'
                component={InviteFriends}
              />
              <ProtectedRoute exact path='/my-wallet' component={MyWallet} />
              <ProtectedRoute
                exact
                path='/service-form'
                component={ServiceForm}
              />
              <ProtectedRoute
                exact
                path='/product-categories'
                component={ProductCategories}
              />
              <ProtectedRoute exact path='/products' component={Products} />
              <ProtectedRoute exact path='/my-orders' component={MyOrders} />
              <ProtectedRoute
                exact
                path='/product-form'
                component={ProductsForm}
              />
              <ProtectedRoute exact path='/rating' component={Rating} />
              <ProtectedRoute exact path='/jobs' component={Jobs} />
              <ProtectedRoute exact path='/promotions' component={Promotions} />
              <ProtectedRoute exact path='/offers' component={Offers} />
              <ProtectedRoute
                exact
                path='/offers-bookings'
                component={OffersBookings}
              />
              <ProtectedRoute exact path='/offerform' component={OfferForm} />
              <ProtectedRoute
                exact
                path='/notifications'
                component={Notifications}
              />
              {/* <ProtectedRoute exact path="/chat" component={Chat} /> */}
              <ProtectedRoute
                exact
                path='/transaction-history'
                component={TransactionHistory}
              />
              <ProtectedRoute
                exact
                path='/serviceBookings'
                component={ServiceBookings}
                // component={CustomerEstimation}
              />
              <ProtectedRoute
                exact
                path='/customer-estimation'
                component={ServiceBookings}
                // component={CustomerEstimation}
              />
              <ProtectedRoute
                exact
                path='/customer-estimation'
                component={CustomerEstimation}
              />
              <ProtectedRoute
                exact
                path='/EstimationSettings'
                component={EstimationSettings}
              />
              <ProtectedRoute
                exact
                path='/EstimationInvoice'
                component={EstimationInvoice}
              />
              <ProtectedRoute exact path='/about' component={About} />
              <ProtectedRoute exact path='/contact' component={Contact} />
              <ProtectedRoute exact path='/terms' component={TermsCondition} />
              <ProtectedRoute
                exact
                path='/privacy-policy'
                component={PrivacyPolicy}
              />
              <ProtectedRoute exact path='/disputes' component={Disputes} />
              <ProtectedRoute exact path='/profile' component={Profile} />
              <ProtectedRoute exact path='/staff' component={Staff} />
              <ProtectedRoute path='/staff/edit/:id' component={Staff} />
              <ProtectedRoute
                exact
                path='/updatePassword'
                component={UpdatePassword}
              />
            </SiderLayout>
          </Switch>
        </Router>
      </Provider>
      <Modal
        title='Allow Notifications'
        visible={isModalOpen}
        onOk={handleAllow}
        onCancel={handleCancel}
      >
        <p>Please allow notifications to receive updates</p>
      </Modal>
    </>
  );
}

export default App;
