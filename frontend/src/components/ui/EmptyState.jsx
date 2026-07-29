export default function EmptyState({ title, description, action, emoji = "📭" }) {
  return (
    <div className="card card-hover rounded-2xl p-10 text-center">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500/15 to-fuchsia-500/15 text-3xl">
        {emoji}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
