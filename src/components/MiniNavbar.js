import React from "react";
import { useNavigate } from "react-router-dom";

const MiniNavbar = () => {
    const navigate = useNavigate();

    return (
        <header className="flex w-full items-center justify-between py-5 px-[60px] bg-black fixed top-0 z-[1000]">
            <div
                className="text-2xl font-bold text-white cursor-pointer"
                onClick={() => navigate("/")}
            >
                MAD
            </div>
        </header>
    );
};

export default MiniNavbar;
