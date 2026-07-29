import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import PollCard from "../components/polls/PollCard";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";
import PageLoader from "../components/ui/PageLoader";
import { getPublicProfile, toggleFollow } from "../services/userService";

export default function PublicProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getPublicProfile(username);
      setProfile(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [username]);

  const follow = async () => {
    try {
      const { data } = await toggleFollow(username);
      setProfile((p) => ({ ...p, isFollowing: data.following }));
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <PageLoader />;
  if (!profile) return <p className="text-muted">Profile not found.</p>;

  return (
    <div className="space-y-6">
      <section className="card rounded-3xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar user={profile.user} size="lg" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{profile.user.name}</h1>
            <p className="text-muted">@{profile.user.username}</p>
            {profile.user.bio ? (
              <p className="mt-2 text-sm">{profile.user.bio}</p>
            ) : null}
          </div>
          {!profile.isMe ? (
            <Button variant="secondary" onClick={follow}>
              {profile.isFollowing ? "Unfollow" : "Follow"}
            </Button>
          ) : null}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(profile.stats).map(([key, value]) => (
            <div key={key} className="rounded-xl border border-[var(--border)] p-3">
              <p className="text-xs capitalize text-muted">{key}</p>
              <p className="text-xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Polls by @{profile.user.username}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {profile.polls?.length ? (
            profile.polls.map((poll) => <PollCard key={poll._id} poll={poll} />)
          ) : (
            <p className="text-muted">No polls yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
