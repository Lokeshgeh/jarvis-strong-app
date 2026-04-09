import { useAppState } from "../store/globalState";

const actionMap = {
  workout: "+",
  home: "??",
  ranks: "?",
  nutrition: "+",
  friends: "??",
  profile: "??",
};

export default function Header({ profile, syncStamp }) {
  const { activeTab, setActiveTab, openModal } = useAppState();
  const xp = Number(profile?.xp ?? 410);
  const level = Number(profile?.level ?? 27);
  const streak = Number(profile?.streak ?? 46);
  const progress = `${Math.min(96, (xp % 100) || 64)}%`;

  return (
    <header className="fixed inset-x-0 top-0 z-40 mx-auto w-full max-w-[480px] border-b border-white/5 bg-[#0a0a14]/90 px-4 pb-3 pt-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setActiveTab("profile")} className="relative rounded-full p-1">
          <div className="ring flex h-14 w-14 items-center justify-center rounded-full p-[3px]" style={{ "--progress": progress }}>
            <div
              className="flex h-full w-full items-center justify-center rounded-full border border-white/10 text-sm font-bold"
              style={{ backgroundColor: profile?.avatar_color ?? "#00BFFF" }}
            >
              {(profile?.username ?? "Jarvis Strong")
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          </div>
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-blue/20 px-2 py-0.5 text-[10px] font-bold text-blue">
            LV.{level}
          </span>
        </button>

        <div className="flex flex-1 items-center justify-between gap-2 rounded-[18px] border border-white/6 bg-card/85 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>??</span>
            <span>{streak}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-blue">
            <span>??</span>
            <span>{xp}</span>
          </div>
          <div className="rounded-full bg-green/20 px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-green">
            SCHEDULE SAVED
          </div>
          <button
            type="button"
            onClick={() => openModal(actionMap[activeTab] === "+" ? "quick-add" : "settings")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/6 text-lg"
            title={syncStamp ? `Synced ${new Date(syncStamp).toLocaleTimeString()}` : "Action"}
          >
            {actionMap[activeTab]}
          </button>
        </div>
      </div>
    </header>
  );
}

