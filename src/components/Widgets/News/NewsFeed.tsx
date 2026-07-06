import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiExternalLink, FiRefreshCw } from "react-icons/fi";
import useProfileStore from "../../../stores/profileStore";
import { useNewsStore } from "../../../stores/newsStore";

const CATEGORY_MAP: Record<string, string> = {
  thoisu: "Thời sự",
  thegioi: "Thế giới",
  thethao: "Thể thao",
  giaitri: "Giải trí",
  suckhoe: "Sức khỏe",
};

const NewsSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="animate-pulse rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4 flex flex-col gap-3">
        <div className="w-full h-40 bg-[var(--border)] rounded-md"></div>
        <div className="h-4 bg-[var(--border)] rounded w-1/4"></div>
        <div className="h-6 bg-[var(--border)] rounded w-3/4"></div>
        <div className="flex justify-between items-center mt-auto pt-2 border-t border-[var(--border)]">
          <div className="h-4 bg-[var(--border)] rounded w-1/3"></div>
          <div className="h-6 bg-[var(--border)] rounded w-12"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function NewsFeed() {
  const { interests } = useProfileStore();
  const { articles, isLoading, hasError, errorMessage, likedArticleIds, fetchArticles, toggleLike } = useNewsStore();

  const activeInterests = interests && interests.length > 0
    ? interests
    : ["thoisu", "thegioi", "thethao", "giaitri", "suckhoe"];

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isRotating, setIsRotating] = useState(false);

  const interestsKey = JSON.stringify(activeInterests);

  useEffect(() => {
    const parsedInterests = JSON.parse(interestsKey) as string[];
    fetchArticles(parsedInterests);
  }, [interestsKey, fetchArticles]);

  const handleRefresh = async () => {
    setIsRotating(true);
    await fetchArticles(activeInterests, true);
    setTimeout(() => setIsRotating(false), 600);
  };

  const filteredArticles = activeTab === "all"
    ? articles
    : articles.filter((a) => a.category === activeTab);

  const getCategoryLabel = (cat: string) => CATEGORY_MAP[cat] || cat;

  return (
    <article className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-500 hover:shadow-[var(--shadow-soft)] lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border)] pb-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase text-[var(--text-muted)]">Cập nhật mới nhất</p>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-heading)]">Tin tức nổi bật</h2>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--text-heading)] hover:bg-[var(--surface-muted)] transition-colors disabled:opacity-40 cursor-pointer"
          title="Tải lại tin"
        >
          <motion.div animate={isRotating ? { rotate: 360 } : {}} transition={{ duration: 0.6, ease: "easeInOut" }}>
            <FiRefreshCw />
          </motion.div>
          Làm mới
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "all"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--surface-muted)] text-[var(--text)] hover:bg-[var(--border)]"
          }`}
        >
          Tất cả
        </button>
        {activeInterests.map((catId) => (
          <button
            key={catId}
            onClick={() => setActiveTab(catId)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === catId
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface-muted)] text-[var(--text)] hover:bg-[var(--border)]"
            }`}
          >
            {getCategoryLabel(catId)}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <NewsSkeleton />
      ) : hasError ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <p className="text-[var(--danger)] text-sm">{errorMessage || "Không thể tải tin tức"}</p>
          <button onClick={handleRefresh} className="px-4 py-2 bg-[var(--accent)] text-white rounded-md text-sm hover:bg-[var(--accent-strong)] transition">Thử lại</button>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-10 text-sm text-[var(--text-muted)]">Không có tin tức nào trong danh mục này.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
          <AnimatePresence mode="popLayout">
            {filteredArticles.map((article) => {
              const isLiked = likedArticleIds.includes(article.id);
              return (
                <motion.div
                  key={article.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="group relative flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5"
                >
                  {/* Image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-200">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-black/60 text-white backdrop-blur-[2px]">
                      {getCategoryLabel(article.category)}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-4">
                    {/* Source and Time */}
                    <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] mb-2">
                      <span className="font-semibold uppercase tracking-wider text-[var(--accent)]">{article.source}</span>
                      <span>·</span>
                      <span>{article.publishedAt}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-semibold leading-snug text-[var(--text-heading)] mb-4 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                      <a href={article.url} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
                        {article.title}
                      </a>
                    </h3>

                    {/* Footer */}
                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-[var(--border)]">
                      <button
                        onClick={() => toggleLike(article.id)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded transition-colors cursor-pointer ${
                          isLiked
                            ? "text-[var(--danger)] bg-[var(--danger-soft)]"
                            : "text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--surface-secondary)]"
                        }`}
                      >
                        <FiHeart className={isLiked ? "fill-current" : ""} />
                        <span>{article.likes + (isLiked ? 1 : 0)}</span>
                      </button>
                      
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline font-semibold"
                      >
                        Đọc tin
                        <FiExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </article>
  );
}
