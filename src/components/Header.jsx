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
      <div className="glass-card rounded-[30px] px-4 py-3">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setActiveTab("profile")} className="relative rounded-full p-1">
            <div className="ring flex h-16 w-16 items-center justify-center rounded-full p-[3px]" style={{ "--progress": progress }}>
              <div
                className="flex h-full w-full items-center justify-center rounded-full border border-black/5 text-base font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
                style={{ backgroundColor: profile?.avatar_color ?? "#e36a43" }}
              >
                {initials}
              </div>
            </div>
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] text-text shadow-[0_8px_18px_rgba(110,94,74,0.1)]">
              LV.{level}
            </span>
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="flex flex-1 items-center justify-between gap-2 rounded-[24px] bg-[#f8f5f0] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-text shadow-[0_8px_18px_rgba(110,94,74,0.08)]">
                <span className="mr-1 text-orange">🔥</span>
                {streak}
              </div>
              <div className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-text shadow-[0_8px_18px_rgba(110,94,74,0.08)]">
                <span className="mr-1 text-orange">✦</span>
                {xp} XP
              </div>
              <div className="truncate rounded-full bg-[#ede7df] px-3 py-2 text-[10px] font-bold tracking-[0.18em] text-text2">
                {syncStamp ? "CLOUD SYNCED" : "READY"}
              </div>
            </div>

            <button
              type="button"
              onClick={() => openModal(actionName === "+" ? "quick-add" : "settings")}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1f1e1c] text-white shadow-[0_18px_28px_rgba(31,30,28,0.18)]"
              title={syncStamp ? `Synced ${new Date(syncStamp).toLocaleTimeString()}` : "Action"}
            >
              {actionName === "+" ? "+" : <Icon name={actionName} className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
