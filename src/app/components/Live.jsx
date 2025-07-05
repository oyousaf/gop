import { useEffect, useRef, useState } from "react";

export default function Live({ videoId }) {
  const liveStreamRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = liveStreamRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { root: null, threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={liveStreamRef}
      className="live-stream-container aspect-video rounded-xl overflow-hidden shadow-xl backdrop-blur-md bg-white/10 mx-auto flex items-center justify-center"
    >
      {isVisible ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&hq=1&vq=hd1080`}
          title="YouTube Live Stream"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-400">
          <p className="text-white/80">Loading live stream...</p>
        </div>
      )}
    </div>
  );
}
