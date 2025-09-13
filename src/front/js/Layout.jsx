import { Navigate } from "react-router-dom";
import React, { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext, { Context } from "./store/appContext.js";
// Custom component
import { Navbar } from "./component/Navbar.jsx";
import { Footer } from "./component/Footer.jsx";
import ScrollToTop from "./component/ScrollToTop.jsx";
import { BackendURL } from "./component/BackendURL.jsx";
import { SignUp } from "./component/SignUp.jsx";
import { SignUpVets } from "./component/SignUpVets.jsx";
import { Login } from "./component/Login.jsx";
// Custom pages or views
import { Home } from "./pages/Home.jsx";
import { Explore } from "./pages/Explore.jsx";
import { UserProfile } from "./pages/UserProfile.jsx";
import { Alert } from "./component/Alert.jsx";
import { AboutUs } from "./pages/AboutUs.jsx";
import { Report } from "./pages/Report.jsx";
import { Cart } from "./pages/Cart.jsx";
import { Payment } from "./pages/Payment.jsx";
import { PaymentSuccess } from "./pages/PaymentSuccess.jsx";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentFail } from "./pages/PaymentFail.jsx";
import { MascotaDetalles } from "./pages/MascotaDetalles.jsx";
import { MascotaProfile } from "./pages/MascotaProfile.jsx";
import { IncidenciasUser } from "./pages/IncidenciasUser.jsx";



// Create your first component
const Layout = () => {
    const { store } = useContext(Context);
    // The basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;
    const key = loadStripe(process.env.FRONTSTRIPEKEY);

    return (
        <div className="d-flex flex-column min-vh-100" style={{ background: "#F5EFDE" }}>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Alert />
                    <Elements stripe={key}>
                        <Routes>
                            <Route path="/" element={<Navigate to="/" />} />
                            <Route element={<Home />} path="/home" />
                            <Route element={<SignUp />} path="/sign-up" />
                            <Route element={<SignUpVets />} path="/sign-up-vets" />
                            <Route element={<Login />} path="/login" />
                            <Route element={<Explore />} path="/explore" />
                            <Route element={<UserProfile />} path="/user-profile" />
                            <Route element={<MascotaDetalles />} path="/pet-details" />
                            <Route element={<MascotaProfile />} path="/edit-pet" />
                            <Route element={<Report />} path="/report" />
                            <Route element={<IncidenciasUser />} path="/incidencias" />
                            <Route element={<AboutUs />} path="/about-us" />
                            <Route element={<Cart />} path="/cart" />
                            <Route element={<Payment />} path="/payment" />
                            <Route element={<PaymentSuccess />} path="/success" />
                            <Route element={<PaymentFail />} path="/fail" />
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
