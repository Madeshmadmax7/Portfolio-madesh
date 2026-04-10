import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const CARD_WIDTH = "clamp(280px, 80vw, 600px)";
const GAP = 40;

const reviews = [
    {
        quote: "Madesh ships quickly and keeps code quality high. He consistently turns rough ideas into production-ready screens and APIs.",
        name: "Karthik R",
        role: "Hackathon Teammate",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        quote: "Strong full-stack instincts. Great at debugging under pressure and balancing UX polish with backend reliability.",
        name: "Aishwarya S",
        role: "Class Project Lead",
        img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        quote: "His portfolio is interactive, but what stands out is execution discipline. He can design, build, and deploy end-to-end.",
        name: "Vijay M",
        role: "Peer Developer",
        img: "https://randomuser.me/api/portraits/men/62.jpg",
    },
    {
        quote: "Madesh transformed our vague product idea into a working prototype in 2 weeks. Outstanding problem-solving skills.",
        name: "Priya N",
        role: "UI/UX Designer",
        img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
        quote: "Best part? He documents everything. Makes collaboration and knowledge transfer super smooth. Rare find.",
        name: "Dr. Rajesh K",
        role: "Project Mentor",
        img: "https://randomuser.me/api/portraits/men/52.jpg",
    },
    {
        quote: "From React to Spring Boot to databases—this guy handles it all seamlessly. True full-stack developer.",
        name: "Laura Chen",
        role: "Tech Lead",
        img: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    {
        quote: "His ability to balance clean code with shipping fast is enviable. No technical debt, just results.",
        name: "Henry Walsh",
        role: "Engineering Aspirant Mentor",
        img: "https://randomuser.me/api/portraits/men/41.jpg",
    },
    {
        quote: "I learned more from watching Madesh code than from any tutorial. Incredible attention to detail.",
        name: "Sophie B",
        role: "Junior Developer",
        img: "https://randomuser.me/api/portraits/women/45.jpg",
    },
];

const ReviewCard = React.memo(({ data, isActive }) => {
    return (
        <div
            style={{ width: CARD_WIDTH }}
            className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl
            p-6 sm:p-8 md:p-10 transition-all duration-500 ease-out
            contain-paint
            ${isActive ? "opacity-100" : "opacity-40"}`}
        >
            <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 text-[#e0e0e0]">
                "{data.quote}"
            </p>

            <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <img
                        src={data.img}
                        alt={data.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                    />
                    <div>
                        <h4 className="font-medium text-sm sm:text-base text-white">
                            {data.name}
                        </h4>
                        <p className="text-white/60 text-xs sm:text-sm">
                            {data.role}
                        </p>
                    </div>
                </div>

                <button className="hidden sm:flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors">
                    View <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
});

export default function Testimonials() {
    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(1);

    const centerOnIndex = (index, smooth = true) => {
        const el = carouselRef.current;
        if (!el) return;

        const cards = el.children;
        const card = cards[index];
        if (!card) return;

        const containerCenter = el.clientWidth / 2;
        const cardCenter =
            card.offsetLeft + card.offsetWidth / 2;

        el.scrollTo({
            left: cardCenter - containerCenter,
            behavior: smooth ? "smooth" : "auto",
        });
    };

    const handleScroll = () => {
        const el = carouselRef.current;
        if (!el) return;

        const center = el.scrollLeft + el.clientWidth / 2;
        let closestIndex = 0;
        let minDistance = Infinity;

        Array.from(el.children).forEach((child, i) => {
            const cardCenter =
                child.offsetLeft + child.offsetWidth / 2;
            const distance = Math.abs(center - cardCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
            }
        });

        setCurrentIndex(closestIndex);
    };

    const scrollByOne = (dir) => {
        const next =
            dir === "left"
                ? Math.max(0, currentIndex - 1)
                : Math.min(reviews.length - 1, currentIndex + 1);

        centerOnIndex(next);
    };

    useEffect(() => {
        requestAnimationFrame(() => {
            centerOnIndex(currentIndex, false);
        });
    }, []);

    return (
        <section className="bg-black text-white px-4 sm:px-6 py-16 sm:py-20 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">

                {/* HEADER ROW: VOICES CENTER, BUTTONS RIGHT */}
                <div className="relative w-full mb-10">
                    <h6 className="font-['Exo_2',sans-serif] text-[2rem] text-white font-bold text-center">Voices</h6>

                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-3">
                        <button
                            onClick={() => scrollByOne("left")}
                            className="p-2 rounded-full border border-white/60 bg-white text-black hover:border-white transition-colors shadow-[0_0_14px_rgba(0,0,0,0.45)]"
                            aria-label="Previous testimonial"
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <button
                            onClick={() => scrollByOne("right")}
                            className="p-2 rounded-full border border-white/60 bg-white text-black hover:border-white transition-colors shadow-[0_0_14px_rgba(0,0,0,0.45)]"
                            aria-label="Next testimonial"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>

                {/* CAROUSEL */}
                <div className="h-[260px] sm:h-[300px] md:h-[350px] min-w-0">
                    <div
                        ref={carouselRef}
                        onScroll={handleScroll}
                        className="flex items-center gap-10 overflow-x-auto scroll-smooth no-scrollbar will-change-transform"
                    >
                        {reviews.map((review, i) => (
                            <div
                                key={i}
                                className="flex-shrink-0 overflow-hidden"
                            >
                                <ReviewCard
                                    data={review}
                                    isActive={i === currentIndex}
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
