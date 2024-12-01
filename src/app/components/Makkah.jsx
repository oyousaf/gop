import Live from "./Live";

export default function Makkah() {
  const videoId = "9Kr-BFxmKII";

  return (
    <section className="relative py-12 h-screen" id="makkah">
      <div className="max-w-5xl mx-auto flex justify-center items-center h-full z-10">
        <div className="text-center">
          <h2 className="md:text-4xl text-2xl font-bold mb-6 p-3">
            Live from Makkah al-Mukarramah
          </h2>
          <Live videoId={videoId} />
        </div>
      </div>
    </section>
  );
}
