import React from "react";


export const Footer = () => {
    return (
        <footer className="bg-dark text-light py-4 mt-auto" style={{
            background: "linear-gradient(135deg, #1E3A5F, #4A69BB, #8FAADC)",  
            fontFamily: "'Montserrat', sans-serif"}}>
            <div className="container text-center">
                <p className="mb-0">&copy; {new Date().getFullYear()} ArtVibe. All Rights Reserved.</p>
                <div className="mt-3">
                    <a href="#" className="text-light mx-2">
                        <i className="fab fa-facebook fa-lg"></i>
                    </a>
                    <a href="#" className="text-light mx-2">
                        <i className="fab fa-twitter fa-lg"></i>
                    </a>
                    <a href="#" className="text-light mx-2">
                        <i className="fab fa-instagram fa-lg"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
};
