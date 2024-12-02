import Live from "./Live";

export default function Madinah() {
  const videoId = "Kt7hKHlArl8";

  return (
    <section className="relative py-12 h-screen" id="madinah">
      <div className="max-w-5xl mx-auto flex justify-center items-center h-full z-10">
        <div className="text-center">
          <h2 className="md:text-4xl text-2xl font-bold mb-6 p-3">
            Live From Madinah al-Munawwarah
          </h2>
          <Live videoId={videoId} />
        </div>
      </div>
    </section>
  );
}
