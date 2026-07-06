import { useState } from "react";
import useClockStore, { DEFAULT_SETTINGS } from "../../stores/clockStore";
import useProfileStore from "../../stores/profileStore";
import { FiAlertCircle, FiCheckCircle, FiClock, FiMapPin, FiRefreshCw, FiSave, FiUser, FiGlobe } from "react-icons/fi";
import { motion } from "framer-motion";
import { openWeatherCityOptions } from "../../constants/weatherCities";
import { useTranslation } from "../../utils/translations";

const toNumber = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export default function Settings() {
  const { settings, saveSettings } = useClockStore();
  const { name, city, interests, language, saveProfile } = useProfileStore();
  const { t } = useTranslation();
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: name,
    city: city,
    interests: interests ?? ["thoisu", "thegioi", "thethao", "giaitri", "suckhoe"],
    language: language || "vi",
    work: settings.work,
    breakMin: settings.break,
    longBreak: settings.longBreak,
  });
  
  const handleChange = (key: keyof typeof form, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
    setSuccessMessage(null);
  };

  const handleInterestChange = (category: string, checked: boolean) => {
    let newInterests = [...form.interests];
    if (checked) {
      if (!newInterests.includes(category)) {
        newInterests.push(category);
      }
    } else {
      newInterests = newInterests.filter((id) => id !== category);
    }
    setForm((prev) => ({ ...prev, interests: newInterests }));
    setIsDirty(true);
    setSuccessMessage(null);
  };

  const handleCancel = () => {
    setForm({
      name: name,
      city: city,
      interests: interests,
      language: language,
      work: settings.work,
      breakMin: settings.break,
      longBreak: settings.longBreak,
    });
    setIsDirty(false);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      setError(form.language === "vi" ? "Tên không được để trống." : "Name cannot be empty.");
      return;
    }
    if (!form.city.trim()) {
      setError(form.language === "vi" ? "Thành phố không được để trống." : "City cannot be empty.");
      return;
    }
    setError(null);
    saveProfile(form.name, form.city, form.interests, form.language as "vi" | "en");
    saveSettings({
      work: Number(form.work),
      break: Number(form.breakMin),
      longBreak: Number(form.longBreak),
    });
    setIsDirty(false);
    setSuccessMessage(t("settingsSaved"));
  };

  const handleResetDefault = () => {
    setForm((prev) => ({
      ...prev,
      work: DEFAULT_SETTINGS.work,
      breakMin: DEFAULT_SETTINGS.break,
      longBreak: DEFAULT_SETTINGS.longBreak,
    }));
    setIsDirty(true);
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto grid max-w-[1500px] grid-cols-1 gap-6 auto-rows-min lg:grid-cols-12 2xl:gap-8"
    >
      <section className="flex flex-col gap-6 lg:col-span-12 xl:col-span-7 2xl:gap-8">
        <article className="flex flex-1 flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-500 hover:shadow-[var(--shadow-soft)] lg:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-[var(--text-muted)]">
                Preferences
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-heading)]">
                {t("settings")}
              </h1>
            </div>
            <button
              onClick={handleResetDefault}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[var(--text-heading)] transition hover:bg-[var(--surface-muted)]"
              type="button"
            >
              <FiRefreshCw aria-hidden="true" />
              {t("reset")}
            </button>
          </div>

          <div className="mt-6">
            <p className="my-4 text-xs font-semibold uppercase text-[var(--text-muted)]">
              {t("profileSettings")}
            </p>
          {successMessage && (
            <div className="mb-2 flex items-center gap-2 rounded-md bg-[var(--accent-soft)] px-3 py-2 text-sm text-[var(--accent-strong)]">
              <FiCheckCircle size={14} />
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mb-2 flex items-center gap-2 rounded-md bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]">
              <FiAlertCircle size={14} />
              {error}
            </div>
          )}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="profile-name" className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]"><FiUser size={13} />{t("nameLabel")}</label>
              <input
                id="profile-name"
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm text-[var(--text-heading)] transition-colors focus:border-[var(--accent)] focus:outline-none"
                type="text"
                value={form.name}
                onChange={(e) => { handleChange("name", e.target.value); setError(null); }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="profile-city" className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]"><FiMapPin size={13} />{t("cityLabel")}</label>
              <select
                id="profile-city"
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm text-[var(--text-heading)] transition-colors focus:border-[var(--accent)] focus:outline-none"
                value={form.city}
                onChange={(e) => { handleChange("city", e.target.value); setError(null); }}
              >
                <option value="" disabled>
                  {t("startupCityPlaceholder")}
                </option>
                {openWeatherCityOptions.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="profile-language" className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]"><FiGlobe size={13} />{t("languageLabel")}</label>
              <select
                id="profile-language"
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm text-[var(--text-heading)] transition-colors focus:border-[var(--accent)] focus:outline-none"
                value={form.language}
                onChange={(e) => { handleChange("language", e.target.value); setError(null); }}
              >
                <option value="vi">Tiếng Việt (Vietnamese)</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-sm text-[var(--text-muted)]">{t("interestsLabel")}</span>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 mt-1">
                {[
                  { id: "thoisu", label: t("thoisu") },
                  { id: "thegioi", label: t("thegioi") },
                  { id: "thethao", label: t("thethao") },
                  { id: "giaitri", label: t("giaitri") },
                  { id: "suckhoe", label: t("suckhoe") },
                ].map((item) => (
                  <label key={item.id} htmlFor={`interest-${item.id}`} className="flex items-center gap-2 text-sm text-[var(--text-heading)] cursor-pointer select-none">
                    <input
                      id={`interest-${item.id}`}
                      type="checkbox"
                      checked={form.interests.includes(item.id)}
                      onChange={(e) => handleInterestChange(item.id, e.target.checked)}
                      className="rounded border-[var(--border)] bg-[var(--surface-muted)] text-[var(--accent)] focus:ring-[var(--accent)]"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          </div>
          <div className="mt-2"> 
            <p className="my-4 flex items-center gap-2 text-xs font-semibold uppercase text-[var(--text-muted)]">
            <FiClock aria-hidden="true" /> {t("timerSettings")}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="work-min" className="text-sm text-[var(--text-muted)]">{t("workDuration").split("(")[0].trim()}</label>
              <input
                id="work-min"
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm text-[var(--text-heading)] transition-colors focus:border-[var(--accent)] focus:outline-none"
                type="number" min="10" max="120" step="5"
                value={form.work}
                onChange={(e) => handleChange("work", toNumber(e.target.value, settings.work))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="short-break" className="text-sm text-[var(--text-muted)]">{t("shortBreakDuration").split("(")[0].trim()}</label>
              <input
                id="short-break"
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm text-[var(--text-heading)] transition-colors focus:border-[var(--accent)] focus:outline-none"
                type="number" min="5" max="30" step="1"
                value={form.breakMin}
                onChange={(e) => handleChange("breakMin", toNumber(e.target.value, settings.break))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="long-break" className="text-sm text-[var(--text-muted)]">{t("longBreakDuration").split("(")[0].trim()}</label>
              <input
                id="long-break"
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm text-[var(--text-heading)] transition-colors focus:border-[var(--accent)] focus:outline-none"
                type="number" min="15" max="60" step="5"
                value={form.longBreak}
                onChange={(e) => handleChange("longBreak", toNumber(e.target.value, settings.longBreak))}
              />
            </div>
          </div>
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[var(--border)] pt-4 sm:flex-row sm:justify-end">
            <button
              onClick={handleCancel}
              disabled={!isDirty}
              className="rounded-md border border-[var(--border)] px-5 py-2 text-sm text-[var(--text)] transition hover:bg-[var(--surface-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {form.language === "vi" ? "Hủy" : "Cancel"}
            </button>
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiSave aria-hidden="true" />
              {t("saveButton")}
            </button>
          </div>
        </article>
      </section>
    </motion.div>
  )
}

