import { useAppState } from "../store/globalState";

const tabs = [
  { id: "workout", label: "Workout", icon: "?", activeColor: "text-blue" },
  { id: "home", label: "Home", icon: "??", activeColor: "text-blue" },
  { id: "ranks", label: "Ranks", icon: "??", activeColor: "text-orange" },
  { id: "nutrition", label: "Nutrition", icon: "??", activeColor: "text-red" },
  { id: "friends", label: "Friends", icon: "??", activeColor: "text-blue" },
  { id: "profile", label: "Profile", icon: "??", activeColor: "text-blue" },
];

export default function BottomNav() {
  const { activeTab, setActiveTab, closeOverlay } = useAppState();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-[480px] items-center justify-between border-t border-white/5 bg-[#111128]/95 px-3 py-3 backdrop-blur-xl">
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              closeOverlay();
              setActiveTab(tab.id);
            }}
            className={`flex min-w-[52px] flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition ${
              active ? `${tab.activeColor} bg-white/6` : "text-text2"
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

