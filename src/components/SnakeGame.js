import React, { useEffect, useRef, useState } from 'react';

const COLS = 25;
const ROWS = 20;
const CELL = 18;
const TICK_MS = 140;

function randomFood(snake) {
    let p;
    do {
        p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (snake.some(s => s.x === p.x && s.y === p.y));
    return p;
}

function drawBoard(ctx, snake, food, dir) {
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

    // subtle grid dots
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    for (let x = 0; x < COLS; x++)
        for (let y = 0; y < ROWS; y++)
            ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);

    // snake segments
    snake.forEach((seg, i) => {
        if (i === 0) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4, 3);
            else ctx.rect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4);
            ctx.fill();
            // eyes
            if (dir) {
                ctx.fillStyle = '#0a0a0f';
                const cx = seg.x * CELL + CELL / 2 + dir.x * 3;
                const cy = seg.y * CELL + CELL / 2 + dir.y * 3;
                ctx.beginPath(); ctx.arc(cx + dir.y * 3, cy - dir.x * 3, 1.8, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(cx - dir.y * 3, cy + dir.x * 3, 1.8, 0, Math.PI * 2); ctx.fill();
            }
        } else {
            const alpha = Math.max(0.2, 1 - i * 0.025);
            ctx.fillStyle = `rgba(180,180,180,${alpha})`;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(seg.x * CELL + 3, seg.y * CELL + 3, CELL - 6, CELL - 6, 2);
            else ctx.rect(seg.x * CELL + 3, seg.y * CELL + 3, CELL - 6, CELL - 6);
            ctx.fill();
        }
    });

    // food — ring
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0a0a0f';
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 6, 0, Math.PI * 2);
    ctx.fill();
}

export default function SnakeGame({ onClose, onGameOver }) {
    const canvasRef = useRef(null);
    const gameRef = useRef(null);
    const tickId = useRef(null);
    const replayRef = useRef([]);
    const [ui, setUi] = useState({ score: 0, level: 1, dead: false });

    function initGame() {
        const snake = [{ x: 12, y: 10 }, { x: 11, y: 10 }, { x: 10, y: 10 }];
        gameRef.current = {
            snake,
            food: randomFood(snake),
            dir: { x: 1, y: 0 },
            nextDir: { x: 1, y: 0 },
            score: 0,
            alive: true,
        };
        replayRef.current = [];
    }

    function draw() {
        const canvas = canvasRef.current;
        const g = gameRef.current;
        if (!canvas || !g) return;
        drawBoard(canvas.getContext('2d'), g.snake, g.food, g.dir);
    }

    function tick() {
        const g = gameRef.current;
        if (!g || !g.alive) return;

        g.dir = g.nextDir;
        const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y };

        // collision
        if (
            head.x < 0 || head.x >= COLS ||
            head.y < 0 || head.y >= ROWS ||
            g.snake.some(s => s.x === head.x && s.y === head.y)
        ) {
            g.alive = false;
            replayRef.current.push({ snake: g.snake.map(p => ({ ...p })), food: { ...g.food } });
            clearInterval(tickId.current);
            draw();
            setUi(u => ({ ...u, dead: true }));
            if (onGameOver) onGameOver(replayRef.current, g.score);
            return;
        }

        const ns = [head, ...g.snake];
        if (head.x === g.food.x && head.y === g.food.y) {
            g.score += 10;
            g.food = randomFood(ns);
            setUi({ score: g.score, level: Math.floor(g.score / 50) + 1, dead: false });
        } else {
            ns.pop();
        }
        g.snake = ns;
        replayRef.current.push({ snake: ns.map(p => ({ ...p })), food: { ...g.food } });
        draw();
    }

    function startLoop() {
        clearInterval(tickId.current);
        tickId.current = setInterval(tick, TICK_MS);
    }

    function restart() {
        initGame();
        setUi({ score: 0, level: 1, dead: false });
        startLoop();
        draw();
    }

    useEffect(() => {
        initGame();
        draw();
        startLoop();

        const onKey = (e) => {
            const g = gameRef.current;
            if (!g || !g.alive) return;
            const map = {
                ArrowUp: { x: 0, y: -1 },
                ArrowDown: { x: 0, y: 1 },
                ArrowLeft: { x: -1, y: 0 },
                ArrowRight: { x: 1, y: 0 },
            };
            const nd = map[e.key];
            if (!nd) return;
            e.preventDefault();
            if (nd.x === -g.dir.x && nd.y === -g.dir.y) return;
            g.nextDir = nd;
        };

        window.addEventListener('keydown', onKey);
        return () => {
            clearInterval(tickId.current);
            window.removeEventListener('keydown', onKey);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/85 backdrop-blur-sm">
            <div
                className="relative bg-[#0a0a0f] border border-[#1a1a1a] rounded-[14px] overflow-hidden"
                style={{ boxShadow: '0 0 60px rgba(255,255,255,0.03), inset 0 0 0 1px rgba(255,255,255,0.04)' }}
            >
                {/* header */}
                <div className="flex items-center justify-between px-5 py-[10px] border-b border-[#141414]">
                    <span className="font-mono text-[11px] tracking-[0.1em] text-[#444]">
                        SCORE<span className="text-white ml-2">{String(ui.score).padStart(4, '0')}</span>
                    </span>
                    <span className="font-mono text-[9px] text-[#222] tracking-[0.6em] select-none uppercase">— Snake —</span>
                    <span className="font-mono text-[11px] tracking-[0.1em] text-[#444]">
                        LEVEL<span className="text-white ml-2">{String(ui.level).padStart(2, '0')}</span>
                    </span>
                </div>

                {/* canvas */}
                <div className="relative">
                    <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} className="block" />
                    {ui.dead && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'rgba(10,10,15,0.9)' }}>
                            <div className="font-mono text-white text-[20px] tracking-[0.4em] mb-[2px]">GAME OVER</div>
                            <div className="font-mono text-[#333] text-[10px] tracking-[0.2em] mb-7">
                                SCORE {String(ui.score).padStart(4, '0')} · REPLAY SAVED
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={restart}
                                    className="font-mono text-[10px] border border-[#333] text-[#999] px-5 py-2 rounded-[6px] tracking-[0.2em] hover:border-[#666] hover:text-white transition-colors duration-150"
                                >
                                    RETRY
                                </button>
                                <button
                                    onClick={onClose}
                                    className="font-mono text-[10px] border border-[#1e1e1e] text-[#444] px-5 py-2 rounded-[6px] tracking-[0.2em] hover:border-[#333] hover:text-[#666] transition-colors duration-150"
                                >
                                    EXIT
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* footer */}
                <div className="px-5 py-2 border-t border-[#141414] flex items-center justify-between">
                    <span className="font-mono text-[8px] text-[#1e1e1e] tracking-[0.4em] uppercase">Arrow Keys · Move</span>
                    {!ui.dead && (
                        <button
                            onClick={onClose}
                            className="font-mono text-[8px] text-[#2a2a2a] hover:text-[#555] tracking-[0.2em] uppercase transition-colors duration-150"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
