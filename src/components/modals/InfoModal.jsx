export default function InfoModal({ open, title, body, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="glass-card w-full max-w-[480px] rounded-[24px] border border-white/10 bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-text3">Jarvis Strong</p>
            <h3 className="mt-2 text-xl font-bold text-text">{title}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 px-3 py-2 text-sm text-text2">
            Close
          </button>
        </div>
        <p className="mt-4 whitespace-pre-line text-sm leading-6 text-text2">{body}</p>
        <button type="button" onClick={onClose} className="mt-5 w-full rounded-full bg-blue px-4 py-3 text-sm font-bold text-[#03131d]">
          OK
        </button>
      </div>
    </div>
  );
}
