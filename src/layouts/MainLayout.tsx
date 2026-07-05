import MainContent from "../components/MainContent/MainContent";
import Settings from "../components/Settings/Settings";
import NewsFeed from "../components/Widgets/News/NewsFeed";
import SideBar from "../components/Sidebar/Sidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function MainLayout() {
  return (
    <BrowserRouter>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to dashboard
      </a>
      <div className="min-h-screen bg-slate-950 text-slate-100 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        <SideBar />
        <main id="main-content" className="min-w-0 bg-[var(--bg)]">
          <div className="min-h-screen px-4 py-5 text-[var(--text)] sm:px-6 lg:px-10 lg:py-8">
            <Routes>
              <Route path="/" element={<MainContent />} />
              <Route path="/news" element={<NewsFeed />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
