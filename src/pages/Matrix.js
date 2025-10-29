import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import '../components/Matrix.css'; // keep your same CSS

export default function Matrix() {
    const [isDark, setIsDark] = useState(true);
    const [command, setCommand] = useState('');
    const [history, setHistory] = useState([]);
    const [autoTypingDone, setAutoTypingDone] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // --- Auto type intro lines ---
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

    // --- Handle user input ---
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
                setHistory([]); // clear all lines
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
                // get last text safely
                const last = updated[updated.length - 1];
                if (last) {
                    // build up text cleanly without duplication
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
                // add a small ending line for style
                setTimeout(() => {
                    setHistory((prev) => [
                        ...prev,
                        { type: 'output', text: '> End of diary. Keep exploring, curious mind.' },
                    ]);
                }, 500);
            }
        }, 180); // control speed (in ms)
    };


    return (
        <div className={`matrix-container ${isDark ? 'dark' : 'light'}`}>
            <button
                className="theme-toggle"
                onClick={() => setIsDark(!isDark)}
                aria-label="Toggle theme"
            >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className={`terminal-window ${isDark ? 'dark' : 'light'}`}>
                <div className="terminal-header">
                    <div className="window-controls">
                        <span className="control control-close"></span>
                        <span className="control control-minimize"></span>
                        <span className="control control-maximize"></span>
                    </div>
                    <div className="terminal-title">minime@mac — 80 × 24</div>
                </div>

                <div className="terminal-body">
                    {history.map((item, idx) => (
                        <div key={idx} className="terminal-line">
                            {item.text}
                        </div>
                    ))}

                    {autoTypingDone && (
                        <div className="terminal-input-line">
                            <span className="prompt">minime % </span>
                            <input
                                type="text"
                                className="terminal-input"
                                value={command}
                                onChange={(e) => setCommand(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isTyping}
                                autoFocus
                                spellCheck={false}
                            />
                            <span className="cursor"></span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
