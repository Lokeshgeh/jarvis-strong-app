import { useAppState } from "../store/globalState";
import { Icon } from "./icons";

const actionMap = {
  workout: "+",
  home: "bell",
  ranks: "help",
  nutrition: "+",
  friends: "friends",
  profile: "settings",
};

export default function Header({ profile, syncStamp }) {
  const { activeTab, setActiveTab, openModal } = useAppState();
  const xp = Number(profile?.xp ?? 0);
  const level = Number(profile?.level ?? 1);
  const streak = Number(profile?.streak ?? 0);
  const progress = `${xp > 0 ? Math.min(96, (xp % 100) || 100) : 4}%`;
  const initials = (profile?.username ?? "Jarvis Strong")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const actionName = actionMap[activeTab];

  return (
    <header className="fixed inset-x-0 top-0 z-40 mx-auto w-full max-w-[480px] px-4 pb-3 pt-5">
      <div className="glass-card rounded-[26px] border border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className="relative rounded-full p-1"
            aria-label="Open profile"
          >
            <div className="ring flex h-16 w-16 items-center justify-center rounded-full p-[3px]" style={{ "--progress": progress }}>
              <div
                className="flex h-full w-full items-center justify-center rounded-full border border-white/10 text-base font-bold text-white"
                style={{ backgroundColor: profile?.avatar_color ?? "#00BFFF" }}
              >
                {initials}
              </div>
            </div>
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-[#0f172a] px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] text-text">
              LV.{level}
            </span>
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="flex flex-1 items-center justify-between gap-2 rounded-[20px] border border-white/10 bg-[#0f172a] px-2 py-2">
              <div className="inline-flex items-center gap-1 rounded-full bg-[#111827] px-2.5 py-2 text-xs font-semibold text-text">
                <Icon name="fire" className="h-3.5 w-3.5 text-orange" />
                <span>{streak}</span>
              </div>
              <div className="inline-flex items-center gap-1 rounded-full bg-[#111827] px-2.5 py-2 text-xs font-semibold text-text">
                <Icon name="spark" className="h-3.5 w-3.5 text-blue" />
                <span>{xp} XP</span>
              </div>
              <div
                className="truncate rounded-full border border-white/10 bg-[#0b1020] px-2.5 py-2 text-[9px] font-bold tracking-[0.2em] text-text2"
                title={syncStamp ? `Cloud synced ${new Date(syncStamp).toLocaleTimeString()}` : "Cloud sync pending"}
              >
                SCHEDULE SAVED
              </div>
            </div>

            <button
              type="button"
              onClick={() => openModal(actionName === "+" ? "quick-add" : "settings")}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#020617] text-white"
              title={syncStamp ? `Synced ${new Date(syncStamp).toLocaleTimeString()}` : "Action"}
              aria-label="Open context action"
            >
              {actionName === "+" ? "+" : <Icon name={actionName} className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
