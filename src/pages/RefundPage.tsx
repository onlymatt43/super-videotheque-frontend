export const RefundPage = () => {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur">
        <h1 className="mb-4 text-2xl font-bold text-white">Refund & Cancellation Policy</h1>
        <p className="mb-4 text-slate"><strong>Last updated:</strong> May 25, 2026</p>
        <div className="mb-5 rounded-xl border border-amber-300/40 bg-amber-200/10 p-4 text-slate">
          <strong>
            All purchases are for one-time digital access. There are no recurring charges or subscriptions associated with this purchase. Due to the immediate delivery of digital media, all sales are final.
          </strong>
        </div>
        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">No Recurring Billing</h2>
        <p className="text-slate">Current purchase flow is one-time only, with no subscription renewal cycle.</p>
        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Support and Billing Issues</h2>
        <p className="text-slate">
          If you believe a transaction was duplicated or processed in error, contact support with transaction details before filing a bank dispute.
        </p>
        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Contact</h2>
        <p className="text-slate leading-relaxed">
          Mathieu Courchesne - OM43<br />
          Email: contact@theom43.team<br />
          Phone: +1 929 812 1653
        </p>
      </div>
    </div>
  );
};
