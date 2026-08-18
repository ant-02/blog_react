export type ThemePreference = "light" | "dark" | "auto";

const PREFERENCE_KEY = "theme-preference";

export const getHourBasedTheme = (): "light" | "dark" => {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6 ? "dark" : "light";
};

export const getInitialTheme = (): "light" | "dark" => {
  const preference = getStoredPreference();
  if (preference === "auto") {
    return getHourBasedTheme();
  }
  return preference;
};

export const applyThemePreference = (
  preference: ThemePreference,
  setTheme: (theme: "light" | "dark" | "system") => void
) => {
  if (preference === "auto") {
    setTheme(getHourBasedTheme());
  } else {
    setTheme(preference);
  }
};

export const getStoredPreference = (): ThemePreference => {
  try {
    const saved = localStorage.getItem(PREFERENCE_KEY);
    if (saved === "light" || saved === "dark" || saved === "auto") {
      return saved;
    }
  } catch {
    // ignore
  }
  return "auto";
};

export const savePreference = (preference: ThemePreference) => {
  try {
    localStorage.setItem(PREFERENCE_KEY, preference);
  } catch {
    // ignore
  }
};
