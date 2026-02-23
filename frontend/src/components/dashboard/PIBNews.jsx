import { useEffect, useState } from "react";
import { ExternalLink, Newspaper, RefreshCw } from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";
import { getPIBNews } from "../../services/api";

export default function PIBNews({ count = 10, compact = false }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchNews = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await getPIBNews(count);

      // backend returns: { status:"success", total:n, news:[...] }
      const list = res?.news || [];
      setNews(list);
    } catch (e) {
      console.error("PIB fetch failed:", e);
      setErr("News load nahi ho rahi. Thoda baad try karo.");
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse h-6 w-44 bg-neutral-200 dark:bg-neutral-700 rounded" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-24 bg-neutral-100 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-brand-green" />
          <h3 className="text-lg font-black text-neutral-900 dark:text-neutral-100">
            PIB Updates
          </h3>
        </div>

        <Button
          variant="outline"
          className="rounded-xl px-3 py-2 text-xs font-black"
          onClick={fetchNews}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {err && (
        <div className="text-sm font-semibold text-red-600 dark:text-red-400">
          {err}
        </div>
      )}

      {/* List */}
      <div className="grid gap-4">
        {(compact ? news.slice(0, 4) : news).map((item, idx) => (
          <Card key={idx} className="rounded-2xl border border-neutral-100 dark:border-neutral-800">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="text-sm font-black text-neutral-900 dark:text-neutral-100 leading-snug">
                  {item.title}
                </div>
                <div className="text-xs font-semibold text-neutral-500">
                  {item.published || ""}
                </div>
              </div>

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-green/10 text-brand-green font-black text-xs hover:bg-brand-green/15"
                >
                  Open <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>

      {!news?.length && !err && (
        <div className="text-sm font-semibold text-neutral-500">
          Abhi koi update nahi mila.
        </div>
      )}
    </div>
  );
}