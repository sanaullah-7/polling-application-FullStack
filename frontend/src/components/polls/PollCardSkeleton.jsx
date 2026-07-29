export default function PollCardSkeleton() {
  return (
    <div className="card rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="skeleton h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3 w-1/3 rounded" />
          <div className="skeleton h-3 w-1/4 rounded" />
        </div>
      </div>
      <div className="skeleton mb-2 h-4 w-3/4 rounded" />
      <div className="skeleton mb-4 h-4 w-1/2 rounded" />
      <div className="space-y-2">
        <div className="skeleton h-10 rounded-xl" />
        <div className="skeleton h-10 rounded-xl" />
      </div>
    </div>
  );
}
