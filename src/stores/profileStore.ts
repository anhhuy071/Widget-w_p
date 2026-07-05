import { create } from "zustand";
import { persist } from "zustand/middleware";
import { resolveCityValue } from "../utils/profileMigration";
import { normalizeProfileValue } from "../utils/profileUtils";

type ProfileState = {
  name: string;
  city: string;
  interests: string[];
  hasCompletedSetup: boolean;
};

type ProfileStore = ProfileState & {
  saveProfile: (name: string, city: string, interests?: string[]) => void;
};

const PROFILE_STORAGE_VERSION = 1;

const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      name: "",
      city: "",
      interests: ["thoisu", "thegioi", "thethao", "giaitri", "suckhoe"],
      hasCompletedSetup: false,
      saveProfile: (name, city, interests) => {
        set((state) => ({
          name: normalizeProfileValue(name, 60),
          city: normalizeProfileValue(resolveCityValue(city), 80),
          interests: interests ?? state.interests,
          hasCompletedSetup: true,
        }));
      },
    }),
    {
      name: "profile-storage",
      version: PROFILE_STORAGE_VERSION,
      migrate: (persistedState, version) => {
        const state = persistedState as ProfileState;
        if (version < PROFILE_STORAGE_VERSION) {
          return {
            ...state,
            city: resolveCityValue(state.city ?? ""),
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
      },
    },
  ),
);

export default useProfileStore;
