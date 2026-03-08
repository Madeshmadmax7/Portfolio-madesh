import React, { useState, useEffect } from 'react';
import MiniNavbar from '../components/MiniNavbar';
import NoteDrawingModal from '../components/NoteDrawingModal';
import { fetchNotes, isConfigured, prependToCache } from '../utils/notesDB';
import { unlockAchievement } from '../components/Achievements';

// Deterministic rotation per slot so cards always look consistent
const ROTS = [-2.5, 1.5, -2, 3, -1.5, 2.5, -3, 2, -1, 2, -2, 1, -2.5, 1.5, -1, 2.5, -2, 1.5];
// skeleton tilt angles (alternating left/right, gentle)
const SKEL_ROTS = [-3, 2, -2.5, 3, -1.5, 2.5, -2, 1.5, -2.5, 2];

const TagLine = ({ count, loading }) => (
    <p className="font-mono text-[11px] text-[#666] mt-[6px]">
        {loading ? '—' : count === 0 ? 'no notes yet' : `${count} ${count === 1 ? 'note' : 'notes'} from around the world`}
    </p>
);

const SkeletonCard = ({ idx }) => (
    <div
        className="rounded-[12px] overflow-hidden bg-[#111] border border-[#1e1e1e] animate-pulse"
        style={{ transform: `rotate(${SKEL_ROTS[idx % SKEL_ROTS.length]}deg)` }}
    >
        {/* grey drawing area — matches old dark skeleton style */}
        <div className="bg-[#1e1e1e] h-[155px]" />
        <div className="p-3 space-y-2">
            <div className="h-[8px] bg-[#2a2a2a] rounded w-2/5" />
            <div className="h-[7px] bg-[#222] rounded w-3/5" />
        </div>
    </div>
);

const NoteCard = ({ note, idx }) => {
    const rot = ROTS[idx % ROTS.length];

    return (
        // Outer div handles tilt — separate from animation so they don't fight
        <div
            style={{
                transform: `rotate(${rot}deg)`,
                transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1)',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'rotate(0deg) translateY(-5px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = `rotate(${rot}deg)`)}
        >
            {/* Inner div handles fade-in animation and card styling */}
            <div
                className="rounded-[12px] overflow-hidden bg-[#111] border border-[#2a2a2a] hover:border-[#444] cursor-default select-none [animation:fadeInScale_0.35s_ease_both]"
                style={{ animationDelay: `${(idx % 12) * 55}ms` }}
            >
                {/* Drawing */}
                <div className="bg-[#f0f0f0] overflow-hidden flex items-center justify-center" style={{ height: 155 }}>
                    <img
                        src={note.drawing}
                        alt={`${note.name}'s drawing`}
                        draggable={false}
                        className="w-full h-full object-contain"
                    />
                </div>
                {/* Meta */}
                <div className="px-3 py-[10px]">
                    <p className="font-mono text-[11px] text-white font-semibold truncate">{note.name}</p>
                    {note.message && (
                        <p className="font-mono text-[10px] text-[#888] mt-[3px] leading-[1.45] line-clamp-2">{note.message}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const SetupGuide = () => (
    <div className="border border-[#151515] rounded-[14px] p-7 max-w-lg">
        <p className="font-mono text-[11px] text-[#555] tracking-[0.4em] uppercase mb-4">setup required</p>
        <p className="text-white font-mono text-sm mb-5">Connect a free Firebase Realtime Database to store notes:</p>
        {[
            ['1', 'Go to', 'console.firebase.google.com', '→ New project'],
            ['2', 'Build', '→ Realtime Database', '→ Create Database → Start in test mode'],
            ['3', 'Copy the database URL shown at the top of the page'],
            ['4', 'Create', '.env.local', 'in project root:'],
        ].map(([n, ...parts]) => (
            <div key={n} className="flex gap-3 mb-2">
                <span className="font-mono text-[10px] text-[#222] w-4 flex-shrink-0 pt-[2px]">{n}.</span>
                <p className="font-mono text-[11px] text-[#444] leading-[1.6]">
                    {parts.map((p, i) =>
                        p.startsWith('→') || p.startsWith('console.') || p.startsWith('.env') ? (
                            <span key={i} className="text-[#666]">{p} </span>
                        ) : (
                            <span key={i}>{p} </span>
                        )
                    )}
                </p>
            </div>
        ))}
        <div className="mt-3 ml-7 font-mono text-[11px] bg-[#0a0a0a] border border-[#151515] rounded-[8px] px-4 py-3 text-[#555]">
            VITE_NOTES_DB_URL=https://your-db-url.firebaseio.com
        </div>
        <p className="font-mono text-[11px] text-[#2a2a2a] mt-3 ml-7">Then restart the dev server.</p>
    </div>
);

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [hasPosted, setHasPosted] = useState(false);
    const [dbMissing, setDbMissing] = useState(false);

    useEffect(() => {
        setHasPosted(!!localStorage.getItem('notePosted'));
        if (!isConfigured()) {
            setDbMissing(true);
            setLoading(false);
            return;
        }
        fetchNotes().then(data => {
            setNotes(data);
            setLoading(false);
        });
    }, []);

    const refresh = () => {
        if (dbMissing) return;
        setLoading(true);
        fetchNotes(true).then(data => {
            setNotes(data);
            setLoading(false);
        });
    };

    const handlePosted = (note) => {
        prependToCache(note);
        setNotes(prev => [note, ...prev]);
        setHasPosted(true);
        setShowModal(false);
        unlockAchievement(16);
    };

    return (
        <>
            <MiniNavbar />
            <div className="min-h-screen bg-black text-white pt-[110px] pb-24 px-6 md:px-14 [animation:fadeIn_0.5s_ease]">
                <div className="max-w-[1100px] mx-auto">

                    {/* ── Page header ── */}
                    <div className="flex flex-wrap items-end justify-between gap-4 mb-14">
                        <div>
                            <p className="font-mono text-[10px] text-[#555] tracking-[0.55em] uppercase mb-2">gallery</p>
                            <h1 className="text-[2rem] font-bold text-white" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                                Visitor Notes
                            </h1>
                            <TagLine count={notes.length} loading={loading} />
                        </div>

                        <div className="flex items-center gap-3">
                            {!dbMissing && (
                                <button
                                    onClick={refresh}
                                    disabled={loading}
                                    className="font-mono text-[10px] border border-[#333] text-[#777] px-3 py-[8px] rounded-[8px] hover:border-[#555] hover:text-[#aaa] disabled:opacity-25 transition-all duration-200"
                                >↻ refresh</button>
                            )}

                            {hasPosted ? (
                                <span className="font-mono text-[10px] text-[#666] border border-[#333] px-4 py-[8px] rounded-[8px]">
                                    note posted ✓
                                </span>
                            ) : (
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="font-mono text-[11px] bg-white text-black px-5 py-[9px] rounded-[8px] hover:bg-[#eaeaea] transition-all duration-200 font-semibold"
                                >+ Leave a note</button>
                            )}
                        </div>
                    </div>

                    {/* ── Setup guide ── */}
                    {dbMissing && <SetupGuide />}

                    {/* ── Loading skeletons ── */}
                    {!dbMissing && loading && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {[...Array(10)].map((_, i) => <SkeletonCard key={i} idx={i} />)}
                        </div>
                    )}

                    {/* ── Empty state ── */}
                    {!dbMissing && !loading && notes.length === 0 && (
                        <div className="flex flex-col items-center justify-center pt-32 pb-16 gap-3">
                            <p className="font-mono text-[10px] text-[#555] tracking-[0.55em] uppercase">empty canvas</p>
                            <p className="text-[#888] text-sm font-mono">Be the first to leave a note.</p>
                        </div>
                    )}

                    {/* ── Notes grid ── */}
                    {!dbMissing && !loading && notes.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {notes.map((note, i) => (
                                <NoteCard key={note.timestamp ?? i} note={note} idx={i} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <NoteDrawingModal
                    onClose={() => setShowModal(false)}
                    onPosted={handlePosted}
                />
            )}
        </>
    );
}
