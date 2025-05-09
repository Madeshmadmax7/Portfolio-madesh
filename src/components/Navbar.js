import React, { useRef, useState, useEffect, createRef, useCallback } from 'react';
import { gsap } from 'gsap';
import './Navbar.css';
import './NavTimer.css';

const navItems = [
{ name: 'Skills', id: 'skills' },
{ name: 'Projects', id: 'projects' },
{ name: 'Contact', id: 'contact' },
];

const scrollToSection = (id, duration = 800) => {
const element = document.getElementById(id);
if (!element) return;

const targetPosition = element.getBoundingClientRect().top + window.scrollY;
const startPosition = window.scrollY;
const distance = targetPosition - startPosition;
let startTime = null;

const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
};

const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
};

requestAnimationFrame(animation);
};

const NavMenu = ({ items }) => {
const menuRef = useRef();
const indicatorRef = useRef();
const itemRefs = useRef(items.map(() => createRef()));
const [active, setActive] = useState(0);
const animate = useCallback(() => {
    const menuOffset = menuRef.current.getBoundingClientRect();
    const activeItem = itemRefs.current[active].current;
    if (!activeItem) return;
    const { width, height, top, left } = activeItem.getBoundingClientRect();
    const settings = {
    x: left - menuOffset.x,
    y: top - menuOffset.y,
    width,
    height,
    backgroundColor: '#000',
    ease: 'power3.out',
    duration: 0.4,
    };
    gsap.to(indicatorRef.current, settings);
}, [active]);

useEffect(() => {
    animate();
    window.addEventListener('resize', animate);
    return () => window.removeEventListener('resize', animate);
}, [animate]);


return (
    <nav className="nav-menu" ref={menuRef}>
    {items.map((item, index) => (
        <button
        key={item.name}
        ref={itemRefs.current[index]}
        className="nav-link"
        onClick={() => {
            scrollToSection(item.id);
            setActive(index);
        }}
        onMouseEnter={() => setActive(index)}
        >
        {item.name}
        </button>
    ))}
    <div ref={indicatorRef} className="nav-indicator" />
    </nav>
);
};

const Navbar = () => {
return (
    <header className="navbar">
    <div className="nav-logo" onClick={() => scrollToSection('home')}>MAD</div>
    <NavMenu items={navItems} />
    <div className="nav-actions">
        <button
        className="nav-btn"
        onClick={() =>
            window.open(
            'https://mail.google.com/mail/?view=cm&fs=1&to=writetomadesh@gmail.com&su=Inquiry%20Regarding%20Collaboration&body=Dear%20Madesh%2C%0A%0AI%20hope%20this%20message%20finds%20you%20well.%20I%20would%20like%20to%20discuss%20a%20potential%20collaboration%20with%20you.%20Please%20let%20me%20know%20a%20convenient%20time%20to%20connect.%0A%0ABest%20regards%2C%0A[Your%20Name]',
            '_blank'
            )
        }
        >
        Let’s Talk
        </button>
        <figure className="navtimer-component" aria-hidden="true">
        <div className="navtimer-wrapper">
            <svg
            className="navtimer-timer"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentcolor"
            viewBox="0 0 256 256"
            >
            <rect width="256" height="256" fill="none"></rect>
            <circle cx="128" cy="128" r="88" fill="var(--navtimer-theme)"></circle>
            <circle
                cx="128"
                cy="128"
                r="88"
                fill="none"
                stroke="currentcolor"
                strokeMiterlimit="10"
                strokeWidth="16"
            ></circle>
            <line
                className="navtimer-hand"
                x1="128"
                y1="128"
                x2="167.6"
                y2="88.4"
                fill="none"
                stroke="currentcolor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
            ></line>
            <line
                className="navtimer-switch"
                x1="104"
                y1="8"
                x2="152"
                y2="8"
                fill="none"
                stroke="currentcolor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
            ></line>
            </svg>
        </div>
        </figure>
    </div>
    </header>
);
};

export default Navbar;
