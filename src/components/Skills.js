import React, { useEffect, useMemo, useRef, useState } from 'react';
import { unlockAchievement } from './Achievements';
import AchievementNotification from './AchievementNotification';

const SKILLS = [
    { name: 'C++', logo: '/logos/cpp2w.svg' },
    { name: 'Java', logo: '/logos/javaw.svg' },
    { name: 'Python', logo: '/logos/pythonw.svg' },
    { name: 'React', logo: '/logos/reactw.svg' },
    { name: 'Spring Boot', logo: '/logos/springbootw.svg' },
    { name: 'AWS', logo: '/logos/amazonwebservicesw.svg' },
    { name: 'Git', logo: '/logos/gitw.svg' },
    { name: 'HTML', logo: '/logos/html5w.svg' },
    { name: 'CSS', logo: '/logos/css3w.svg' },
    { name: 'MySQL', logo: '/logos/mysqlw.svg' },
    { name: 'Figma', logo: '/logos/figmaw.svg' },
    { name: 'MongoDB', logo: '/logos/mongodbw.svg' },
    { name: 'Docker', logo: '/logos/dockerw.svg' },
    { name: 'JavaScript', logo: '/logos/javascriptw.svg' },
    { name: 'Selinium', logo: '/logos/seleniumw.svg' },
    { name: 'Tailwind', logo: '/logos/tailwindw.svg' },
    { name: 'Sqlite', logo: '/logos/sqlitew.svg' },
    { name: 'NodeJS', logo: '/logos/nodejsw.svg' },
    { name: 'Firebase', logo: '/logos/firebasew.svg' },
    { name: 'GCP', logo: '/logos/gcpw.svg' },
    { name: 'Arduino', logo: '/logos/arduinow.svg' },
];

const Skills = () => {
    const [clickOrder, setClickOrder] = useState([]);
    const [fadingOrderNumbers, setFadingOrderNumbers] = useState([]);
    const [showNoti, setShowNoti] = useState(false);
    const [recentUnlocked, setRecentUnlocked] = useState('');
    const fadeTimerRef = useRef(null);

    const orderLookup = useMemo(() => {
        const map = {};
        clickOrder.forEach((skillName, idx) => {
            map[skillName] = idx + 1;
        });
        return map;
    }, [clickOrder]);

    const allClicked = clickOrder.length === SKILLS.length;

    const handleSkillClick = (skillName) => {
        if (allClicked || clickOrder.includes(skillName)) return;
        setClickOrder((prev) => [...prev, skillName]);
    };

    useEffect(() => {
        if (!allClicked) return;

        let current = 1;
        fadeTimerRef.current = setInterval(() => {
            setFadingOrderNumbers((prev) => [...prev, current]);
            current += 1;

            if (current > SKILLS.length) {
                clearInterval(fadeTimerRef.current);
                const isNew = unlockAchievement(17);
                if (isNew) {
                    setRecentUnlocked('Skill Cartographer');
                    setShowNoti(true);
                }

                setTimeout(() => {
                    setClickOrder([]);
                    setFadingOrderNumbers([]);
                }, 900);
            }
        }, 300);

        return () => {
            if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
        };
    }, [allClicked]);

    useEffect(() => {
        if (!showNoti) return;
        const timer = setTimeout(() => setShowNoti(false), 3500);
        return () => clearTimeout(timer);
    }, [showNoti]);

    return (
        <section className="py-12">
            <div className="max-w-[1200px] mx-auto px-4 mt-[50px]">
                <h2 className="text-4xl font-bold mb-8 text-white text-center">Skills</h2>
                <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 4fr))' }}>
                    {SKILLS.map((skill, index) => {
                        const order = orderLookup[skill.name];
                        const faded = fadingOrderNumbers.includes(order);
                        return (
                        <div
                            key={index}
                            className={`relative flex flex-col items-center py-12 px-4 rounded-xl transition-all duration-300 hover:-translate-y-[5px] bg-[#101010] text-white border border-[#444] cursor-pointer`}
                            onClick={() => handleSkillClick(skill.name)}
                        >
                            {order && (
                                <span
                                    className={`absolute top-1 right-1 w-5 h-5 rounded-full bg-white text-black text-[9px] font-bold flex items-center justify-center transition-all duration-300 ${faded ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}
                                >
                                    {order}
                                </span>
                            )}
                            <img src={skill.logo} alt={skill.name} className="w-10 h-10 text-white mb-4 object-contain" />
                            <span>{skill.name}</span>
                        </div>
                    );})}
                </div>
            </div>

            {showNoti && recentUnlocked && (
                <AchievementNotification
                    title="Achievement Unlocked"
                    description={recentUnlocked}
                    onClose={() => setShowNoti(false)}
                />
            )}
        </section>
    );
};

export default Skills;

