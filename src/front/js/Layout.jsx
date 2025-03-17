import { Navigate } from "react-router-dom";
import React, { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext, { Context } from "./store/appContext.js";
// Custom component
import { Navbar } from "./component/Navbar.jsx";
import { Footer } from "./component/Footer.jsx";
import ScrollToTop from "./component/ScrollToTop.jsx";
import { BackendURL } from "./component/BackendURL.jsx";
// Custom pages or views
import { Home } from "./pages/Home.jsx";
import { SignUp } from "./pages/SignUp.jsx";
import { Login } from "./component/Login.jsx";
import { ProductDetail } from "./pages/ProductDetails.jsx";
import { NewBlogPost } from "./pages/NewBlogPost.jsx";
import { Explore } from "./pages/Explore.jsx";
import { PostProduct } from "./pages/PostProduct.jsx";
import { UserProfile } from "./pages/UserProfile.jsx";
import { Purchases } from "./pages/Purchases.jsx";
import { Sales } from "./pages/Sales.jsx";
import { MySales, Selling } from "./pages/Selling.jsx";
import { Artists } from "./pages/Artists.jsx";
import { Alert } from "./component/Alert.jsx";
import { AboutUs } from "./pages/AboutUs.jsx";
import { ArtistProfile } from "./pages/ArtistProfile.jsx";
import { Cart } from "./pages/Cart.jsx";
import { Payment } from "./pages/Payment.jsx";
import { PaymentSuccess } from "./pages/PaymentSuccess.jsx";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentFail } from "./pages/PaymentFail.jsx";
import { EventDetail } from "./pages/EventDetails.jsx";
import { Events } from "./pages/Events.jsx";



// Create your first component
const Layout = () => {
    const { store } = useContext(Context);
    // The basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;
    const key = loadStripe(process.env.FRONTSTRIPEKEY);

    return (
        <div className="d-flex flex-column min-vh-100">
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Alert />
                    <Elements stripe={key}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/" />} />
                        <Route element={<Home />} path="/home" />
                        <Route element={<SignUp />} path="/sign-up" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<ProductDetail />} path="/product-details/:id" />
                        <Route element={<Events  />} path="/events" />
                        <Route element={<NewBlogPost />} path="/new-blog-post" />
                        <Route element={<Explore />} path="/explore" />
                        <Route element={<Artists />} path="/artists" />
                        <Route element={<PostProduct />} path="/post-product" />
                        <Route element={<UserProfile />} path="/user-profile" />
                        <Route element={<Purchases />} path="/purchases" />
                        <Route element={<Sales />} path="/sold" />
                        <Route element={<Selling />} path="/selling" />
                        <Route element={<AboutUs />} path="/about-us" />
                        <Route element={<ArtistProfile />} path='/artist/:id' />
                        <Route element={<Cart />} path="/cart" />
                        <Route element={<Payment />} path="/payment" />
                        <Route element={<PaymentSuccess />} path="/success" />
                        <Route element={<PaymentFail />} path="/fail" />                        
                        <Route element={<EventDetail />} path="/event-detail/:id" />
                        <Route element={<PaymentFail />} path="/fail" />
                        {/* <Route element={<Demo />} path="/demo" /> */}
                        {/* <Route element={<Single />} path="/single/:theid" /> */}
                        <Route element={<h1>Not    found!</h1>} path='*' />
                    </Routes>
                    </Elements>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
