import { useAppState } from "../store/globalState";
import { Icon } from "./icons";

const tabs = [
  { id: "workout", label: "Workout", icon: "workout" },
  { id: "home", label: "Progress", icon: "home" },
  { id: "ranks", label: "Ranks", icon: "ranks" },
  { id: "nutrition", label: "Fuel", icon: "nutrition" },
  { id: "friends", label: "Friends", icon: "friends" },
  { id: "profile", label: "Me", icon: "profile" },
];

export default function BottomNav() {
  const { activeTab, setActiveTab, closeOverlay } = useAppState();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[480px] px-5 pb-5">
      <div className="glass-card flex items-center justify-between rounded-[30px] bg-[linear-gradient(180deg,rgba(35,35,35,0.72),rgba(82,82,82,0.62))] px-2 py-2 text-white shadow-[0_24px_40px_rgba(85,73,59,0.18)]">
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
                active ? "bg-white text-[#191815] shadow-[0_10px_18px_rgba(16,16,16,0.12)]" : "text-white/72"
              }`}
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-full ${active ? "bg-[#f3ddd4] text-orange" : "bg-transparent"}`}>
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
