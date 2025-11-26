import React, { useContext, useEffect, useRef } from "react";
import { Context } from "../store/appContext";

export const Footer = () => {
    const brandFooterRef = useRef(null);
    const { actions } = useContext(Context);

    useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
            actions.setBrandVisible(entry.isIntersecting);
        },
        { threshold: 0.1 }
    );

    if (brandFooterRef.current) {
        observer.observe(brandFooterRef.current);
    }

    return () => observer.disconnect();
    }, []);

    return (
        <footer className="text-light py-4 mt-auto" 
        ref={brandFooterRef} 
        style={{
            background: "#1B365D",
            fontFamily: "'Montserrat', sans-serif"
        }}>
            <div className="container text-center">
                <p className="mb-0">&copy; {new Date().getFullYear()} Pawsitive. Derechos Reservados.</p>
                <div className="mt-3">
                    <a href="https://www.instagram.com/pawsitiveapp.es?igsh=OG1raGJ4YTBkOTh3" className="text-light mx-2">
                        <i className="fab fa-instagram fa-lg"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
};
