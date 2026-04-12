import { useEffect, useMemo, useState } from "react";
import { Icon } from "../icons";
import { getSupabase, isSupabaseReady } from "../../lib/supabase";

export default function FriendsTab({ user, friends, onAddFriend, onRemoveFriend, onOpenInfo }) {
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    async function loadProfiles() {
      if (!isSupabaseReady || !user?.id) return;
      const client = getSupabase();
      const { data } = await client
        .from("profiles")
        .select("id, username, bio, avatar_color, level, streak")
        .neq("id", user.id)
        .eq("is_public", true)
        .limit(8);
      setProfiles(data ?? []);
    }

    loadProfiles();
  }, [user?.id]);

  const filteredFriends = useMemo(
    () => friends.filter((friend) => (friend.profile?.username ?? "").toLowerCase().includes(query.toLowerCase())),
    [friends, query]
  );

  const pending = useMemo(
    () => profiles.filter((profile) => !friends.some((friend) => friend.friend_id === profile.id) && profile.username.toLowerCase().includes(query.toLowerCase())),
    [friends, profiles, query]
  );

  return (
    <div className="space-y-5">
      <section className="rounded-[24px] border border-white/10 bg-card p-5 shadow-[0_14px_28px_rgba(2,6,23,0.45)]">
        <p className="text-xs uppercase tracking-[0.24em] text-text3">Find Friends</p>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search usernames"
          className="mt-3 w-full rounded-2xl border border-white/10 bg-[#0f172a] px-4 py-3 text-text outline-none"
        />
      </section>

      <section className="rounded-[24px] border border-white/10 bg-card p-5 shadow-[0_14px_28px_rgba(2,6,23,0.45)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-text3">Pending requests</p>
            <h3 className="mt-2 text-xl font-bold text-text">Discover athletes</h3>
          </div>
          <span className="rounded-full bg-blue/10 px-3 py-1 text-sm font-semibold text-blue">{pending.length}</span>
        </div>

        <div className="mt-4 space-y-3">
          {pending.map((profile) => (
            <div key={profile.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0f172a] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold" style={{ backgroundColor: profile.avatar_color }}>
                  {profile.username.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-text">{profile.username}</p>
                  <p className="text-sm text-text3">{profile.bio}</p>
                </div>
              </div>
              <button type="button" onClick={() => onAddFriend(profile.id)} className="rounded-full bg-orange px-4 py-2 text-sm font-bold text-white">
                Add
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {filteredFriends.map((friend) => (
          <article key={friend.id} className="rounded-[24px] border border-white/10 bg-card p-5 shadow-[0_14px_28px_rgba(2,6,23,0.45)]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold"
                  style={{ backgroundColor: friend.profile?.avatar_color ?? "#00BFFF" }}
                >
                  {friend.profile?.username?.slice(0, 2).toUpperCase() ?? "JS"}
                </div>
                <div>
                  <p className="font-semibold text-text">{friend.profile?.username ?? "Friend"}</p>
                  <p className="text-sm text-text3">{friend.workout?.completed_at ? `${Math.round(friend.workout.duration_seconds / 60)} min ago` : "No recent workout"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenInfo("Friend profile", `${friend.profile?.username ?? "This friend"} will open in a richer profile sheet with stats and recent sessions.`)}
                className="rounded-full border border-white/10 bg-[#0f172a] px-4 py-2 text-sm text-text2"
              >
                View
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-[#0f172a] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-text3">Streak</p>
                <p className="mt-2 flex items-center gap-2 text-xl font-bold text-orange">
                  <Icon name="fire" className="h-5 w-5" />
                  {friend.profile?.streak ?? 0}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0f172a] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-text3">Duration</p>
                <p className="mt-2 text-xl font-bold text-text">{friend.workout ? `${Math.round(friend.workout.duration_seconds / 60)}m` : "--"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0f172a] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-text3">Muscle map</p>
                <p className="mt-2 text-xl text-blue">
                  <Icon name="spark" className="h-5 w-5" />
                </p>
              </div>
            </div>

            <button type="button" onClick={() => onRemoveFriend(friend.friend_id)} className="mt-4 rounded-full border border-red/30 bg-red/10 px-4 py-2 text-sm text-red">
              Remove Friend
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
