import React from "react";


export const Footer = () => {
    return (
        <footer className="bg-dark text-light py-4 mt-5" style={{
			background: "linear-gradient(135deg, #5A189A, #E03E94)",
			fontFamily: "'Poppins', sans-serif"
		}}>
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
