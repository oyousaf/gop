import { useEffect, useRef, useState } from "react";

export default function Live({ videoId }) {
  const liveStreamRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { root: null, threshold: 0.1 }
    );

    if (liveStreamRef.current) {
      observer.observe(liveStreamRef.current);
    }

    return () => {
      if (liveStreamRef.current) {
        observer.unobserve(liveStreamRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={liveStreamRef}
      className="live-stream-container mx-auto flex flex-col items-center justify-center p-4"
    >
      {isVisible ? (
        <iframe
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&hq=1&vq=hd1080`}
          title="YouTube Live Stream"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-md shadow-md"
        ></iframe>
      ) : (
        <div className="placeholder flex flex-col items-center justify-center h-80 text-center border-2 border-dashed border-gray-400 rounded-md">
          <p>Loading live stream...</p>
        </div>
      )}
    </div>
  );
}
