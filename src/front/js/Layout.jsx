import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "./store/appContext.js";
// Custom component
import { Navbar } from "./component/Navbar.jsx";
import { Footer } from "./component/Footer.jsx";
import ScrollToTop from "./component/ScrollToTop.jsx";
import { BackendURL } from "./component/BackendURL.jsx";
// Custom pages or views
import { Home } from "./pages/Home.jsx";
import { SignUp } from "./pages/SignUp.jsx";
import { Login } from "./component/Login.jsx";
import { Product } from "./pages/Product.jsx";
import { Blog } from "./pages/Blogs.jsx";
import { NewBlogPost } from "./pages/NewBlogPost.jsx";
import { Explore } from "./pages/Explore.jsx";
import { PostProduct } from "./pages/PostProduct.jsx";
import { UserProfile } from "./pages/UserProfile.jsx";
import { Purchases } from "./pages/Purchases.jsx";
import { Sales } from "./pages/Sales.jsx";
import { Artists } from "./pages/Artists.jsx";
import { Alert } from "./component/Alert.jsx";





// Create your first component
const Layout = () => {
    // The basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";
    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div className="d-flex flex-column min-vh-100">
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Alert />
                    <Routes>
                        <Route element={<Home />} path="/home" />
                        <Route element={<SignUp />} path="/sign-up" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Product />} path="/product" />
                        <Route element={<Blog />} path="/blogs" />
                        <Route element={<NewBlogPost />} path="/new-blog-post" />
                        <Route element={<Explore />} path="/explore" />
                        <Route element={<Artists />} path="/artists" />
                        <Route element={<PostProduct />} path="/post-product" />
                        <Route element={<UserProfile />} path="/user-profile" />
                        <Route element={<Purchases />} path="/purchases" />
                        <Route element={<Sales />} path="/sales" />
                        {/* <Route element={<Demo />} path="/demo" /> */}
                        {/* <Route element={<Single />} path="/single/:theid" /> */}
                        <Route element={<h1>Not found!</h1>} path='*'/>
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
