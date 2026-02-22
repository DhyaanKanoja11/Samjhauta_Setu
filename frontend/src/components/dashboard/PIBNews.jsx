import { useEffect, useState } from "react";
import { getPIBNews } from "../../services/api";

export default function PIBNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const data = await getPIBNews(10);

      if (data.status === "success") {
        setNews(data.news || []);
      } else {
        setError("Could not load PIB news.");
      }
    } catch (err) {
      console.error("News Fetch Error:", err);
      setError("Could not load PIB news.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 py-4">
        Loading news...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 py-4">
        {error}
      </p>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-bold text-green-700 mb-3">
        🌾 Government Agriculture News (PIB)
      </h2>

      <ul className="space-y-3">
        {news.map((item, index) => (
          <li
            key={index}
            className="border-b pb-2 last:border-none"
          >
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="text-blue-700 text-sm font-medium hover:underline"
            >
              {item.title}
            </a>

            <p className="text-xs text-gray-400 mt-1">
              {item.published}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}