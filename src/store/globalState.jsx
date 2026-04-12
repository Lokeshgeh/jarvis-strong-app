import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage.getItem("jarvis-theme");
    return saved === "light" ? "light" : "dark";
  });
  const [activeTab, setActiveTab] = useState("workout");
  const [subTabs, setSubTabs] = useState({
    workout: "tracker",
    home: "forYou",
    ranks: "yourRank",
    nutrition: "diary",
  });
  const [overlay, setOverlay] = useState({ type: null, payload: null });
  const [modal, setModal] = useState({ type: null, payload: null });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    window.localStorage.setItem("jarvis-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      activeTab,
      setActiveTab,
      subTabs,
      setSubTab: (tab, value) => setSubTabs((current) => ({ ...current, [tab]: value })),
      overlay,
      openOverlay: (type, payload = null) => setOverlay({ type, payload }),
      closeOverlay: () => setOverlay({ type: null, payload: null }),
      modal,
      openModal: (type, payload = null) => setModal({ type, payload }),
      closeModal: () => setModal({ type: null, payload: null }),
      selectedDate,
      setSelectedDate,
    }),
    [activeTab, modal, overlay, selectedDate, subTabs, theme],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppState must be used inside AppProvider");
  }

  return context;
}

