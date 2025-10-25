import React, { useEffect } from 'react';
import './Loader.css';

const Loader = ({ onFinish }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className="loader-container">
            <h1 className="jt --debug">
                <span className="jt__row">
                    <span className="jt__text">MAD</span>
                </span>
                <span className="jt__row jt__row--sibling" aria-hidden="true">
                    <span className="jt__text">MAD</span>
                </span>
                <span className="jt__row jt__row--sibling" aria-hidden="true">
                    <span className="jt__text">MAD</span>
                </span>
                <span className="jt__row jt__row--sibling" aria-hidden="true">
                    <span className="jt__text">MAD</span>
                </span>
            </h1>
        </div>
    );
};

export default Loader;
