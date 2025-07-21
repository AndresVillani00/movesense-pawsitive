import React from "react";


export const Footer = () => {
    return (
        <footer className="text-light py-4 mt-auto" style={{
            background: "#1B365D",
            fontFamily: "'Montserrat', sans-serif"
        }}>
            <div className="container text-center">
                <p className="mb-0">&copy; {new Date().getFullYear()} Pawsitive. All Rights Reserved.</p>
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
