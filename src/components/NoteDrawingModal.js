import React, { useRef, useState, useEffect, useCallback } from 'react';
import { X, Eraser, Undo2, Redo2, Trash2, Send } from 'lucide-react';
import { postNote } from '../utils/notesDB';

const CANVAS_W = 420;
const CANVAS_H = 380;
const COLORS = ['#000000', '#ffffff', '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#1abc9c', '#e91e63'];
const BG = '#f2f2f2';

export default function NoteDrawingModal({ onClose, onPosted }) {
    const DISPLAY_DPR = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 3) : 1;
    const canvasRef = useRef(null);
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(4);
    const [isEraser, setIsEraser] = useState(false);
    const [strokes, setStrokes] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [drawing, setDrawing] = useState(false);
    const currentStrokeRef = useRef([]);
    const lastPosRef = useRef(null);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.setTransform(DISPLAY_DPR, 0, 0, DISPLAY_DPR, 0, 0);
        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }, [DISPLAY_DPR]);

    const getPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const sx = CANVAS_W / rect.width;
        const sy = CANVAS_H / rect.height;
        const src = e.touches ? e.touches[0] : e;
        return { x: (src.clientX - rect.left) * sx, y: (src.clientY - rect.top) * sy };
    };

    // Smooth redraw using quadratic bezier through midpoints
    const redrawStroke = useCallback((ctx, pts, strokeColor, eraser, size) => {
        if (!pts.length) return;
        ctx.save();
        ctx.strokeStyle = eraser ? BG : strokeColor;
        ctx.fillStyle = eraser ? BG : strokeColor;
        ctx.lineWidth = eraser ? 22 : size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (pts.length === 1) {
            ctx.beginPath();
            ctx.arc(pts[0].x, pts[0].y, (eraser ? 22 : size) / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length - 1; i++) {
                const mx = (pts[i].x + pts[i + 1].x) / 2;
                const my = (pts[i].y + pts[i + 1].y) / 2;
                ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
            }
            const last = pts[pts.length - 1];
            ctx.lineTo(last.x, last.y);
            ctx.stroke();
        }
        ctx.restore();
    }, []);

    const applyStroke = useCallback((ctx, stroke) => {
        redrawStroke(ctx, stroke.points, stroke.color, stroke.eraser, stroke.size);
    }, [redrawStroke]);

    const redrawAll = useCallback((strokeList) => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.setTransform(DISPLAY_DPR, 0, 0, DISPLAY_DPR, 0, 0);
        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        strokeList.forEach(s => applyStroke(ctx, s));
    }, [applyStroke, DISPLAY_DPR]);

    const onDown = (e) => {
        e.preventDefault();
        setDrawing(true);
        setRedoStack([]);
        const pos = getPos(e);
        currentStrokeRef.current = [pos];
        lastPosRef.current = pos;
        const ctx = canvasRef.current.getContext('2d');
        ctx.save();
        ctx.fillStyle = isEraser ? BG : color;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, (isEraser ? 22 : brushSize) / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    };

    const onMove = (e) => {
        if (!drawing) return;
        e.preventDefault();
        const pos = getPos(e);
        const pts = currentStrokeRef.current;
        const ctx = canvasRef.current.getContext('2d');

        // Draw smooth segment using quadratic curve to midpoint
        if (pts.length >= 2) {
            const prev = pts[pts.length - 2];
            const curr = pts[pts.length - 1];
            const mx = (curr.x + pos.x) / 2;
            const my = (curr.y + pos.y) / 2;
            ctx.save();
            ctx.strokeStyle = isEraser ? BG : color;
            ctx.lineWidth = isEraser ? 22 : brushSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo((prev.x + curr.x) / 2, (prev.y + curr.y) / 2);
            ctx.quadraticCurveTo(curr.x, curr.y, mx, my);
            ctx.stroke();
            ctx.restore();
        } else if (pts.length === 1) {
            const prev = pts[0];
            ctx.save();
            ctx.strokeStyle = isEraser ? BG : color;
            ctx.lineWidth = isEraser ? 22 : brushSize;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            ctx.restore();
        }
        currentStrokeRef.current = [...pts, pos];
    };

    const onUp = (e) => {
        if (!drawing) return;
        e.preventDefault();
        setDrawing(false);
        const pts = currentStrokeRef.current;
        if (pts.length > 0) {
            setStrokes(prev => [...prev, { color, eraser: isEraser, size: brushSize, points: pts }]);
        }
        currentStrokeRef.current = [];
    };

    const undo = () => {
        if (!strokes.length) return;
        const next = strokes.slice(0, -1);
        setRedoStack(r => [...r, strokes[strokes.length - 1]]);
        setStrokes(next);
        redrawAll(next);
    };

    const redo = () => {
        if (!redoStack.length) return;
        const stroke = redoStack[redoStack.length - 1];
        const next = [...strokes, stroke];
        setRedoStack(r => r.slice(0, -1));
        setStrokes(next);
        redrawAll(next);
    };

    const clearCanvas = () => {
        setStrokes([]);
        setRedoStack([]);
        redrawAll([]);
    };

    const buildExportDataUrl = useCallback((scale = 4) => {
        const out = document.createElement('canvas');
        out.width = CANVAS_W * scale;
        out.height = CANVAS_H * scale;

        const outCtx = out.getContext('2d');
        outCtx.fillStyle = BG;
        outCtx.fillRect(0, 0, out.width, out.height);
        outCtx.save();
        outCtx.scale(scale, scale);
        strokes.forEach((s) => applyStroke(outCtx, s));
        outCtx.restore();

        return out.toDataURL('image/png');
    }, [strokes, applyStroke]);

    const handleSubmit = async () => {
        if (!name.trim()) { setError('What should we call you?'); return; }
        if (strokes.length === 0) { setError('Draw something first!'); return; }
        setSubmitting(true);
        setError('');
        try {
            const drawing = buildExportDataUrl(4);
            await postNote({ name: name.trim(), message: message.trim(), drawing });
            localStorage.setItem('notePosted', 'true');
            onPosted({ name: name.trim(), message: message.trim(), drawing, timestamp: Date.now() });
        } catch (err) {
            setError(err.message.includes('configured') ? err.message : `Failed to post — ${err.message}`);
            setSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        >
            <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-[20px] overflow-hidden shadow-2xl [animation:fadeInScale_0.2s_ease] flex" style={{ maxWidth: 820, width: '100%' }}>

                {/* â”€â”€ LEFT: Canvas â”€â”€ */}
                <div className="flex flex-col flex-1 min-w-0">
                    {/* canvas header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#141414]">
                        <span className="font-mono text-[9px] text-[#444] tracking-[0.5em] uppercase">draw</span>
                        <span className="font-mono text-[9px] text-[#222] tracking-[0.3em]">{CANVAS_W}×{CANVAS_H}</span>
                    </div>
                    {/* canvas */}
                    <div className="flex-1">
                        <canvas
                            ref={canvasRef}
                            width={Math.round(CANVAS_W * DISPLAY_DPR)}
                            height={Math.round(CANVAS_H * DISPLAY_DPR)}
                            className="w-full h-full touch-none select-none block"
                            style={{ cursor: isEraser ? 'cell' : 'crosshair', aspectRatio: `${CANVAS_W}/${CANVAS_H}` }}
                            onMouseDown={onDown}
                            onMouseMove={onMove}
                            onMouseUp={onUp}
                            onMouseLeave={onUp}
                            onTouchStart={onDown}
                            onTouchMove={onMove}
                            onTouchEnd={onUp}
                        />
                    </div>
                </div>

                {/* â”€â”€ RIGHT: Controls + Form â”€â”€ */}
                <div className="w-[220px] flex-shrink-0 border-l border-[#141414] flex flex-col">
                    {/* header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#141414]">
                        <span className="font-mono text-[9px] text-[#888] tracking-[0.45em] uppercase">note</span>
                        <button onClick={onClose} className="text-[#555] hover:text-white transition-colors"><X size={16} /></button>
                    </div>

                    {/* color palette */}
                    <div className="px-4 pt-4 pb-3">
                        <p className="font-mono text-[8px] text-[#333] tracking-[0.4em] uppercase mb-3">Color</p>
                        <div className="grid grid-cols-5 gap-[7px]">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    onClick={() => { setColor(c); setIsEraser(false); }}
                                    className="w-[26px] h-[26px] rounded-full transition-all duration-150"
                                    style={{
                                        background: c,
                                        border: (!isEraser && color === c) ? '2px solid rgba(255,255,255,0.7)' : '2px solid #1e1e1e',
                                        outline: (c === '#ffffff' || c === '#f2f2f2') ? '1px solid #2a2a2a' : 'none',
                                        transform: (!isEraser && color === c) ? 'scale(1.25)' : 'scale(1)',
                                        boxShadow: (!isEraser && color === c) ? `0 0 8px ${c}88` : 'none',
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* brush size */}
                    <div className="px-4 pb-4 border-b border-[#141414]">
                        <p className="font-mono text-[8px] text-[#333] tracking-[0.4em] uppercase mb-3">Size</p>
                        <div className="flex items-center gap-2">
                            {[2, 4, 7, 12].map(s => (
                                <button
                                    key={s}
                                    onClick={() => { setBrushSize(s); setIsEraser(false); }}
                                    className="flex-1 flex items-center justify-center h-8 rounded-[6px] border transition-all duration-150"
                                    style={{
                                        borderColor: (!isEraser && brushSize === s) ? '#555' : '#1e1e1e',
                                        background: (!isEraser && brushSize === s) ? '#1a1a1a' : 'transparent',
                                    }}
                                >
                                    <div
                                        className="rounded-full bg-white"
                                        style={{ width: s * 1.5, height: s * 1.5, opacity: (!isEraser && brushSize === s) ? 1 : 0.3 }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* tools */}
                    <div className="px-4 py-3 border-b border-[#141414] flex flex-col gap-2">
                        <p className="font-mono text-[8px] text-[#333] tracking-[0.4em] uppercase mb-1">Tools</p>
                        <div className="grid grid-cols-3 gap-[6px]">
                            {[
                                { icon: <Eraser size={13} />, label: 'erase', action: () => setIsEraser(p => !p), active: isEraser },
                                { icon: <Undo2 size={13} />, label: 'undo', action: undo, disabled: !strokes.length },
                                { icon: <Redo2 size={13} />, label: 'redo', action: redo, disabled: !redoStack.length },
                            ].map(btn => (
                                <button
                                    key={btn.label}
                                    onClick={btn.action}
                                    disabled={btn.disabled}
                                    title={btn.label}
                                    className={`flex items-center justify-center gap-1 font-mono text-[8px] py-[7px] rounded-[7px] border transition-all duration-150 disabled:opacity-20 disabled:cursor-not-allowed
                                        ${btn.active ? 'border-white/40 text-white bg-white/8' : 'border-[#222] text-[#666] hover:border-[#444] hover:text-[#aaa]'}`}
                                >{btn.icon}</button>
                            ))}
                        </div>
                        <button
                            onClick={clearCanvas}
                            className="flex items-center justify-center gap-1 font-mono text-[8px] py-[7px] rounded-[7px] border border-[#222] text-[#666] hover:border-red-900/50 hover:text-red-400/70 transition-all duration-150"
                        ><Trash2 size={13} /> clear all</button>
                    </div>

                    {/* form */}
                    <div className="px-4 py-4 flex flex-col gap-[9px] flex-1">
                        <p className="font-mono text-[8px] text-[#333] tracking-[0.4em] uppercase mb-1">Your Info</p>
                        <input
                            type="text"
                            placeholder="Name *"
                            maxLength={30}
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="bg-[#0d0d0d] border border-[#2a2a2a] text-white text-[11px] px-3 py-[8px] rounded-[8px] placeholder:text-[#444] focus:outline-none focus:border-[#444] font-mono w-full"
                        />
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Message (optional)"
                                maxLength={60}
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                className="bg-[#0d0d0d] border border-[#2a2a2a] text-white text-[11px] px-3 py-[8px] pr-10 rounded-[8px] placeholder:text-[#444] focus:outline-none focus:border-[#444] font-mono w-full"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[8px] text-[#333] pointer-events-none">{message.length}/60</span>
                        </div>
                        {error && <p className="font-mono text-[9px] text-red-400/80 leading-[1.4]">{error}</p>}
                    </div>

                    {/* action buttons */}
                    <div className="px-4 pb-5 flex flex-col gap-2">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-full font-mono text-[11px] bg-white text-black py-[10px] rounded-[9px] hover:bg-[#e8e8e8] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 font-bold"
                        >{submitting ? 'Posting…' : <span className="flex items-center justify-center gap-2"><Send size={13} /> Post Note</span>}</button>
                        <button
                            onClick={onClose}
                            className="w-full font-mono text-[9px] border border-[#1e1e1e] text-[#444] py-[8px] rounded-[9px] hover:border-[#333] hover:text-[#777] transition-all duration-150"
                        >Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
