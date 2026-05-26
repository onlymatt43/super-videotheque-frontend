export const TermsPage = () => {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur">
        <h1 className="mb-4 text-2xl font-bold text-white">Terms of Service</h1>
        <p className="mb-4 text-slate"><strong>Last updated:</strong> May 25, 2026</p>
        <p className="mb-4 text-slate">
          These Terms govern access to and use of this website and related digital content services operated by Mathieu Courchesne - OM43.
        </p>
        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Core Rules</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate">
          <li>Adult-only access: you must be 18+ (or legal age in your jurisdiction).</li>
          <li>Purchased access is personal, private, and non-transferable.</li>
          <li>Redistribution, sharing, resale, capture, and republication are prohibited.</li>
          <li>Unauthorized use may result in access suspension and legal action.</li>
        </ul>
        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Intellectual Property</h2>
        <p className="text-slate">
          All videos, images, branding, and related materials are protected by applicable intellectual property laws.
        </p>
        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Contact</h2>
        <p className="text-slate leading-relaxed">
          Mathieu Courchesne - OM43<br />
          Website: theo43.team<br />
          Email: contact@theom43.team<br />
          Phone: +1 929 812 1653<br />
          Address: 1442 PIE-IX H1V2C1 MONTREAL QUEBEC CANADA
        </p>
      </div>
    </div>
  );
};
