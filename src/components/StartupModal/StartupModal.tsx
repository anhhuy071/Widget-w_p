import { useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "framer-motion";
import useProfileStore from "../../stores/profileStore";
import { createPortal } from "react-dom";
import { openWeatherCityOptions } from "../../constants/weatherCities";

export default function StartupModal() {
  const { saveProfile,  hasCompletedSetup,  } =
    useProfileStore();
  const [formData, setFormData] = useState({ name: "", city: "" });
  const [error, setError] = useState<string | null>(null);
    
  if (hasCompletedSetup) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleCityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, city: e.target.value }));
    setError(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.city.trim()) {
      setError("Name and city are required.");
      return;
    }
    saveProfile(formData.name, formData.city);
  };


  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.section
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl sm:p-10"
      >
        <div className="mb-6">
          <p className="mb-1 text-xs font-semibold uppercase text-[var(--accent)]">Pulse Board</p>
          <h2 className="text-2xl font-bold text-[var(--text-heading)]">
            Welcome! Let's set you up
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">We only need two things to personalise your dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="rounded-md bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="setup-name" className="mb-1.5 block text-xs font-semibold uppercase text-[var(--text-muted)]">
              Your Name
            </label>
            <input
              id="setup-name"
              name="name"
              value={formData.name}
              onChange={(event) => {
                handleChange(event);
                setError(null);
              }}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm text-[var(--text-heading)] placeholder:text-[var(--text-muted)] transition-colors focus:border-[var(--accent)] focus:outline-none"
              placeholder="e.g. Alex"
              required
            />
          </div>
          <div>
            <label htmlFor="setup-city" className="mb-1.5 block text-xs font-semibold uppercase text-[var(--text-muted)]">
              Your City
            </label>
            <select
              id="setup-city"
              name="city"
              value={formData.city}
              onChange={handleCityChange}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm text-[var(--text-heading)] placeholder:text-[var(--text-muted)] transition-colors focus:border-[var(--accent)] focus:outline-none"
              required
            >
              <option value="" disabled>
                Select a city or province in Vietnam
              </option>
              {openWeatherCityOptions.map((city) => (
                <option key={city.value} value={city.value}>
                  {city.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Used for the weather widget.</p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="w-full rounded-md bg-[var(--accent)] px-6 py-2.5 font-semibold text-white shadow-lg transition hover:bg-[var(--accent-strong)] sm:w-auto"
            >
              Save &amp; Continue
            </button>
          </div>
        </form>
      </motion.section>
    </motion.div>,
    document.body,
  );
}
