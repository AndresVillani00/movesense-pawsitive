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
                    <a href="https://www.instagram.com/pawsitiveapp.es?igsh=OG1raGJ4YTBkOTh3" className="text-light mx-2">
                        <i className="fab fa-instagram fa-lg"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
};
