import { Routes, Route, Router } from "react-router-dom";
import Home from "./pages/customer-view/Home";
import Blog from "./pages/customer-view/Blog"; 
import ClientLayout from './components/customer-view/common/Layout'
import AdminLayout from "./components/admin-view/common/Layout";
import DisplayOldFullEvent from "./pages/customer-view/DisplayOldFullEvent";
import DisplayOldFullEventAdmin from "./pages/admin-view/oldEvent/DisplayOldFullEvent";
import WelcomePage from "./components/Welcome";
import Login from "./components/auth-view/views/Login";
import Signup from "./components/auth-view/views/Signup";
import Forgotpassword from "./components/auth-view/views/Forgotpassword";
import AdminDashboard from "./components/admin-view/userManagement/AdminDashboard";
import DeleteUser from "./components/admin-view/userManagement/DeletUser";
import OTP from "./components/auth-view/views/OTP";
import AddAdmin from "./components/admin-view/userManagement/AddAdmin";
import Profile from "./components/admin-view/userManagement/ViewProfile";
import ProfileUpdate from "./components/admin-view/userManagement/Updateprofile";
import Layout from "./components/auth-view/Common/Layout";
import UploadPage from "./pages/admin-view/galleryPage/UploadPage";
import Stock from "./pages/admin-view/cartPage/Stock";
import Gallery from "./pages/admin-view/galleryPage/Gallery";
import ListForm from "./pages/admin-view/cartPage/ListForm";
import ItemList from "./pages/admin-view/cartPage/ItemList";
import OGcart from "./pages/admin-view/cartPage/OGcart";
import OldEventUploadPage from "./pages/admin-view/oldEvent/OldEventUpload";
import DisplayOldEvents from "./pages/admin-view/oldEvent/DisplayOldEvents";
import UpComingEvent from "./pages/admin-view/bookingsPage/UpcomingEvents";
import EventBooking from "./pages/admin-view/bookingsPage/EventBookings";
import Design from "./pages/customer-view/order/Design";
import Terms from "./pages/customer-view/order/Terms";
import Payment from "./pages/customer-view/order/Payment";
import PreviewOrder from "./pages/customer-view/order/PreviewOrder";
import MyOrders from "./pages/customer-view/order/MyOrders";
import PlacedOrders from "./pages/admin-view/order/PlacedOrders";
import DeletedOrders from "./pages/admin-view/order/DeletedOrder";
import DetailedMyOrders from "./pages/customer-view/order/DetailedMyOrders";
import DetailedOrderPage from "./pages/admin-view/order/DetailedOrderPage";
import NotFound from "./pages/NotFound";
import UnauthPage from "./pages/UnAuthPage";
import RouteGuard from "./components/auth-view/Common/RouterGuard";
import FeedBack from "./pages/customer-view/FeedBack";
import DeliveryMethodPage from "./pages/customer-view/Delivery";
import AdminDeliveryPage from "./pages/admin-view/AdminDeliveryPage";
import FeedbackList from "./pages/admin-view/customer-relationship/Feedbacks";
import ClientFAQ from "./pages/customer-view/FAQ";
import AdminFAQPage from "./pages/admin-view/customer-relationship/FAQ";
import AddPackages from "./components/admin-view/dashboard/AddPackages";
import Packages from "./components/customer-view/home/Packages";
import DeletePackages from "./components/admin-view/dashboard/deletePackages";
import MyBookings from "./components/customer-view/home/MyBookings";
import ColorSetUp from "./components/customer-view/common/ColorSetUp";
import AdminviewProfile from"./components/admin-view/userManagement/AdminViewUser";
import ChangePassword from "./components/admin-view/userManagement/ChangePassword";


function App() {
    return (
        <>
            <RouteGuard />
           <Routes>
                <Route path='/' element={<WelcomePage />} />

                <Route path="/auth" element={<Layout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="sign-up" element={<Signup />} />
                    <Route path="forgot-password" element={<Forgotpassword />} />
                    <Route path="otp" element={<OTP />} />
                </Route>

                <Route path='/client' element={<ClientLayout />}>
                    <Route path='home' element={<Home />} />
                    <Route path='blog' element={<Blog />} />
                    <Route path='products' element={<ItemList />} />
                    <Route path='contact' element={<FeedBack />} />
                    <Route path='package' element={<Packages />} />
                </Route>
                <Route path='/client' element={<ColorSetUp />}>
                    <Route path='/client/DisplayOldFullEvent/:id' element={<DisplayOldFullEvent />} />
                    <Route path="/client/cart" element={<OGcart />} /> 
                    <Route path="/client/design" element={<Design />} />
                    <Route path="/client/terms" element={<Terms />} />
                    <Route path="/client/payment" element={<Payment />} />
                    <Route path="/client/preview-order" element={<PreviewOrder />} />
                    <Route path="/client/my-orders" element={<MyOrders />} />
                    <Route path="/client/detailedMyOrders/:id" element={<DetailedMyOrders />} />
                    <Route path="/client/profile" element={<Profile />} />
                    <Route path="/client/feedback" element={<FeedBack />} />
                    <Route path="/client/updateprofile" element={<ProfileUpdate />} />
                    <Route path="/client/faq" element={<ClientFAQ />} />
                    <Route path="/client/delivery" element={<DeliveryMethodPage />} />
                    <Route path="/client/myBookings" element={<MyBookings />} /> 
                    <Route path="/client/changepassword" element={<ChangePassword />} />
                </Route>
                

 
                <Route path='/admin' element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />


                    {/*  Blog Management Routes  */}
                    <Route path='oldEventUpload' element={<OldEventUploadPage />} />
                    <Route path='oldEventDelete' element={<DisplayOldEvents />} />


                    {/*  Booking Management Routes  */}
                    <Route path="upcomingEvents" element={<UpComingEvent />} />
                    <Route path="eventBookings" element={<EventBooking />} />

                    {/* Package Management Routes */}
                    <Route path="newPackages" element={<AddPackages />} />
                    <Route path="deletePackages" element={<DeletePackages />} />


                    {/*  User Management Routes  */}
                    <Route path="delet-user" element={<DeleteUser />} />
                    <Route path="adddAdmin" element={<AddAdmin />} />
                    <Route path="profile" element={<Profile/>}/>
                    <Route path="updateprofile" element={<ProfileUpdate/>}/>
                    <Route path="/admin/userdetails/:id" element={<AdminviewProfile />} />


                    {/*  Gallery Page Routes  */}
                    <Route path='gallery' element={<Gallery />} />
                    <Route path="uploadPage" element={<UploadPage />} />



                    {/*  Inventory Management Routes  */}
                    <Route path="inventory" element={<Stock />} />
                    <Route path="create-product" element={<ListForm />} />{" "}
                    <Route path="product-list" element={<ItemList />} />{" "}



                    {/*  Order Management Routes  */}
                    <Route path="placedOrders" element={<PlacedOrders />} />
                    <Route path="deletedOrders" element={<DeletedOrders />} />


                    <Route path="delivery" element={<AdminDeliveryPage />} />
                    <Route path="feedback" element={<FeedbackList />} /> 
                    <Route path="faq" element={<AdminFAQPage />} />
                    
                </Route>
                <Route path='/admin/DisplayOldFullEvent/:id' element={<DisplayOldFullEventAdmin />} />
                <Route path="/admin/detailedOrder/:id" element={<DetailedOrderPage />} />


                <Route path="*" element={<NotFound />} />
                <Route path="/unauth-page" element={<UnauthPage />} />
            </Routes>
        </>
    )
}

export default App;