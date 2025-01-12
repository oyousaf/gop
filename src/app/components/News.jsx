import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) {
          throw new Error("Failed to fetch news");
        }
        const data = await res.json();
        setNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  return (
    <section className="max-w-7xl mx-auto p-6 py-12" id="news">
      <h2 className="text-5xl font-bold text-center mb-8">News</h2>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-white text-lg animate-pulse">Loading...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <motion.div
              key={index}
              className="bg-background shadow-md rounded-lg p-6 border border-gray-200 flex flex-col"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-2xl text-blue-200 font-semibold mb-4 text-center">
                {article.title}
              </h3>
              <p className="text-xl mb-4 pt-3 text-center flex-grow">
                {article.description || "No description available."}
              </p>
              <div className="flex justify-center mt-auto">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-4 py-2 bg-neutral-200 text-background hover:text-[#6c857d] rounded hover:bg-neutral-300 transition-colors duration-200 text-center"
                >
                  Read More
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
