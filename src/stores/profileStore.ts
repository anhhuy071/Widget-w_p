import { create } from "zustand";
import { persist } from "zustand/middleware";
import { resolveCityValue } from "../utils/profileMigration";
import { normalizeProfileValue } from "../utils/profileUtils";

type ProfileState = {
  name: string;
  city: string;
  interests: string[];
  hasCompletedSetup: boolean;
  theme: "light" | "dark" | "system";
  language: "vi" | "en";
};

type ProfileStore = ProfileState & {
  saveProfile: (name: string, city: string, interests?: string[], language?: "vi" | "en") => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setLanguage: (language: "vi" | "en") => void;
};

const PROFILE_STORAGE_VERSION = 1;

export const updateThemeClass = (theme: "light" | "dark" | "system") => {
  if (typeof window === "undefined" || !window.document) return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else if (theme === "light") {
    root.classList.add("light");
    root.classList.remove("dark");
  } else {
    root.classList.remove("dark", "light");
  }
};

const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      name: "",
      city: "",
      interests: ["thoisu", "thegioi", "thethao", "giaitri", "suckhoe"],
      hasCompletedSetup: false,
      theme: "system",
      language: "vi",
      saveProfile: (name, city, interests, language) => {
        set((state) => ({
          name: normalizeProfileValue(name, 60),
          city: normalizeProfileValue(resolveCityValue(city), 80),
          interests: interests ?? state.interests,
          language: language ?? state.language,
          hasCompletedSetup: true,
        }));
      },
      setTheme: (theme) => {
        set({ theme });
        updateThemeClass(theme);
      },
      setLanguage: (language) => {
        set({ language });
      },
    }),
    {
      name: "profile-storage",
      version: PROFILE_STORAGE_VERSION,
      migrate: (persistedState, version) => {
        const state = persistedState as any;
        if (version < PROFILE_STORAGE_VERSION) {
          return {
            ...state,
            city: resolveCityValue(state.city ?? ""),
            theme: state.theme ?? "system",
            language: state.language ?? "vi",
          };
        }
        return state;
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const resolvedCity = resolveCityValue(state.city);
        if (resolvedCity !== state.city) {
          useProfileStore.setState({ city: resolvedCity });
        }
        updateThemeClass(state.theme || "system");
      },
    },
  ),
);

export default useProfileStore;
