import React, { useEffect } from 'react';

const Loader = ({ onFinish }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black flex justify-center items-center z-[9999] [animation:fadeOutLoader_1s_ease_forwards_2.5s]">
            <h1
                className="relative uppercase [text-shadow:0_0_10px_blue] text-[blue]"
                style={{ fontSize: '20vmin', fontFamily: "'Staatliches', sans-serif" }}
            >
                <span className="jt__row block">
                    <span className="jt__text block origin-bottom-left [animation:moveIn_2s_0s_cubic-bezier(.36,0,.06,1)_alternate_infinite]">MAD</span>
                </span>
                <span className="jt__row absolute top-0 left-0 select-none w-[800px]" aria-hidden="true">
                    <span className="jt__text block origin-bottom-left [animation:moveIn_2s_0s_cubic-bezier(.36,0,.06,1)_alternate_infinite]">MAD</span>
                </span>
                <span className="jt__row absolute top-0 left-0 select-none w-[800px]" aria-hidden="true">
                    <span className="jt__text block origin-bottom-left [animation:moveIn_2s_0s_cubic-bezier(.36,0,.06,1)_alternate_infinite]">MAD</span>
                </span>
                <span className="jt__row absolute top-0 left-0 select-none w-[800px]" aria-hidden="true">
                    <span className="jt__text block origin-bottom-left [animation:moveIn_2s_0s_cubic-bezier(.36,0,.06,1)_alternate_infinite]">MAD</span>
                </span>
            </h1>
        </div>
    );
};

export default Loader;
