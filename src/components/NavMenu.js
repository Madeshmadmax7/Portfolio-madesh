import React, { useRef, useState, useEffect, createRef } from 'react';
import { gsap } from 'gsap';

const NavMenu = ({ items }) => {
    const menuRef = useRef();
    const indicatorRef = useRef();
    const itemRefs = useRef(items.map(() => createRef()));
    const [active, setActive] = useState(0);

    const scrollToSection = (id, duration = 1000) => {
        const element = document.getElementById(id);
        if (!element) return;

        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
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

    const animate = () => {
        const menuOffset = menuRef.current.getBoundingClientRect();
        const activeItem = itemRefs.current[active].current;
        const { width, height, top, left } = activeItem.getBoundingClientRect();
        const settings = {
            x: left - menuOffset.x,
            y: top - menuOffset.y,
            width: width,
            height: height,
            backgroundColor: '#000',
            ease: 'power3.out',
            duration: 0.4,
        };
        gsap.to(indicatorRef.current, settings);
    };

    useEffect(() => {
        animate();
        window.addEventListener('resize', animate);
        return () => window.removeEventListener('resize', animate);
    }, [active]);

    return (
        <nav className="nav-menu" ref={menuRef}>
            {items.map((item, index) => {
                const sectionId = item.href.replace('#', '');
                return (
                    <a
                        key={item.name}
                        ref={itemRefs.current[index]}
                        className={`nav-link ${active === index ? 'active' : ''}`}
                        href={item.href}
                        onClick={(e) => {
                            e.preventDefault();
                            setActive(index);
                            scrollToSection(sectionId);
                        }}
                        onMouseEnter={() => setActive(index)}
                    >
                        {item.name}
                    </a>
                );
            })}
            <div ref={indicatorRef} className="nav-indicator" />
        </nav>
    );
};

export default NavMenu;
