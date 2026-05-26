export const AdultNoticePage = () => {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur">
        <h1 className="mb-4 text-2xl font-bold text-white">18+ Adult Content Notice</h1>
        <p className="mb-4 text-slate"><strong>Last updated:</strong> May 25, 2026</p>
        <p className="mb-4 text-slate">
          This website contains adult-oriented material and is strictly intended for persons aged 18 years or older, or the legal age of majority in their jurisdiction.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-slate">
          <li>You confirm you are legally permitted to access adult material.</li>
          <li>You access this website voluntarily and at your own responsibility.</li>
          <li>If you are underage or restricted by local law, you must leave immediately.</li>
        </ul>
      </div>
    </div>
  );
};
