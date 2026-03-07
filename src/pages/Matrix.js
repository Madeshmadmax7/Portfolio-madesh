import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function Matrix() {
    const [isDark, setIsDark] = useState(true);
    const [command, setCommand] = useState('');
    const [history, setHistory] = useState([]);
    const [autoTypingDone, setAutoTypingDone] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const introLines = [
            '> Accessing secret diary of my developer journey...',
            '> Enhancing user experience has always been my main goal.',
            '> Exploring creative solutions, breaking limits, and building meaningful products.',
            '> Want to know my journey? (yes/no)',
        ];

        let i = 0;
        setIsTyping(true);

        const interval = setInterval(() => {
            setHistory((prev) => [...prev, { type: 'output', text: introLines[i] }]);
            i++;
            if (i === introLines.length) {
                clearInterval(interval);
                setIsTyping(false);
                setAutoTypingDone(true);
            }
        }, 1200);

        return () => clearInterval(interval);
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && command.trim()) {
            const input = command.trim().toLowerCase();
            setHistory((prev) => [...prev, { type: 'command', text: `minime % ${command}` }]);

            if (input === 'yes') {
                simulateStoryTyping();
            } else if (input === 'no') {
                setHistory((prev) => [
                    ...prev,
                    { type: 'output', text: '> Thank you. Easter Egg unlocked!' },
                ]);
            } else if (input === 'open diary') {
                setHistory((prev) => [
                    ...prev,
                    { type: 'output', text: '> The diary is already open...' },
                ]);
            } else if (input === 'clear') {
                setHistory([]);
            } else {
                setHistory((prev) => [
                    ...prev,
                    { type: 'output', text: `> Unknown command: ${input}` },
                ]);
            }

            setCommand('');
        }
    };

    const simulateStoryTyping = () => {
        const story =
            "In my early days as a developer, I was obsessed with making small ideas come alive. Every bug taught me patience, every project taught me creativity. My mission has always been simple — to craft experiences that feel human, intuitive, and a little bit magical. I continue learning, experimenting, and improving — one line of code at a time.";

        const words = story.split(' ');
        setIsTyping(true);
        setHistory((prev) => [...prev, { type: 'output', text: '> ' }]);

        let index = 0;

        const interval = setInterval(() => {
            setHistory((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last) {
                    updated[updated.length - 1] = {
                        ...last,
                        text: last.text + (index === 0 ? '' : ' ') + words[index],
                    };
                }
                return updated;
            });

            index++;
            if (index >= words.length) {
                clearInterval(interval);
                setIsTyping(false);
                setTimeout(() => {
                    setHistory((prev) => [
                        ...prev,
                        { type: 'output', text: '> End of diary. Keep exploring, curious mind.' },
                    ]);
                }, 500);
            }
        }, 180);
    };


    return (
        <div className={`min-h-screen flex items-center justify-center p-10 relative transition-all duration-300 ${isDark ? 'bg-black text-[#d4d4d4]' : 'bg-black text-black'}`}>
            <button
                className="fixed top-5 right-5 bg-white border border-[#e0e0e0] rounded-[8px] w-11 h-11 font-bold flex items-center justify-center cursor-pointer transition-all duration-300 z-[1000] [box-shadow:0_2px_8px_rgba(0,0,0,0.1)] hover:scale-105 hover:bg-[#f5f5f5]"
                onClick={() => setIsDark(!isDark)}
                aria-label="Toggle theme"
            >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className={`w-full max-w-[900px] rounded-[12px] overflow-hidden [box-shadow:0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-300 ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                <div className={`flex items-center px-4 py-3 relative border-b border-b-[rgba(128,128,128,0.2)] ${isDark ? 'bg-[#2d2d2d]' : 'bg-[#f6f6f6]'}`}>
                    <div className="flex gap-2 z-[1]">
                        <span className="w-3 h-3 rounded-full cursor-pointer bg-[#ff5f57]"></span>
                        <span className="w-3 h-3 rounded-full cursor-pointer bg-[#febc2e]"></span>
                        <span className="w-3 h-3 rounded-full cursor-pointer bg-[#28c840]"></span>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 text-[13px] font-medium text-[#888]">minime@mac — 80 × 24</div>
                </div>

                <div className={`terminal-body p-5 min-h-[500px] font-[Monaco,Menlo,"Courier New",monospace] text-[13px] leading-[1.6] whitespace-pre-wrap break-normal overflow-y-auto ${isDark ? 'text-[#d4d4d4]' : 'text-[#111]'}`}>
                    {history.map((item, idx) => (
                        <div key={idx} className="whitespace-pre-wrap break-normal">
                            {item.text}
                        </div>
                    ))}

                    {autoTypingDone && (
                        <div className="flex items-center mt-1">
                            <span className="mr-2 select-none text-[#4ec9b0]">minime % </span>
                            <input
                                type="text"
                                className="flex-1 bg-transparent border-none outline-none font-[inherit] text-[inherit] leading-[inherit] text-[inherit] color-inherit"
                                value={command}
                                onChange={(e) => setCommand(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isTyping}
                                autoFocus
                                spellCheck={false}
                            />
                            
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
