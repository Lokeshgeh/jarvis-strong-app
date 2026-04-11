import { useAppState } from "../store/globalState";
import { Icon } from "./icons";

const tabs = [
  { id: "workout", label: "Workout", icon: "workout" },
  { id: "home", label: "Today", icon: "home" },
  { id: "ranks", label: "Ranks", icon: "ranks" },
  { id: "nutrition", label: "Nutrition", icon: "nutrition" },
  { id: "friends", label: "Friends", icon: "friends" },
  { id: "profile", label: "Profile", icon: "profile" },
];

export default function BottomNav() {
  const { activeTab, setActiveTab, closeOverlay } = useAppState();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[480px] px-5 pb-5">
      <div className="glass-card flex items-center justify-between rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.96),rgba(15,23,42,0.96))] px-2 py-2 text-white">
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
              className={`flex min-w-[54px] flex-col items-center gap-1 rounded-[20px] px-2 py-2 text-[11px] font-medium transition ${
                active ? "bg-white/95 text-[#0b1020] shadow-[0_10px_18px_rgba(2,6,23,0.45)]" : "text-text2"
              }`}
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-full ${active ? "bg-blue/20 text-blue" : "bg-transparent"}`}>
                <Icon name={tab.icon} className="h-[18px] w-[18px]" />
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
