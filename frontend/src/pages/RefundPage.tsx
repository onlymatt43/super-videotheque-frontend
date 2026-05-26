export const RefundPage = () => {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur">
        <h1 className="mb-4 text-2xl font-bold text-white">Refund & Cancellation Policy</h1>
        <p className="mb-4 text-slate"><strong>Last updated:</strong> May 25, 2026</p>
        <div className="mb-5 rounded-xl border border-amber-300/40 bg-amber-200/10 p-4 text-slate">
          <strong>
            All purchases made on this platform are for one-time digital access to media content. There are no recurring charges, memberships, or hidden subscriptions associated with these transactions. Due to the immediate and digital nature of the content delivery, all sales are final and non-refundable. If you experience any technical issues accessing your purchase, please contact our support at contact@theom43.team.
          </strong>
        </div>
        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">No Recurring Billing</h2>
        <p className="text-slate">Every purchase is a single, one-time transaction. There are no subscriptions, auto-renewals, or recurring charges of any kind.</p>
        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Support and Billing Issues</h2>
        <p className="text-slate">
          If you believe a transaction was processed in error or you are experiencing technical difficulties accessing your purchase, contact support before filing a bank dispute. We are committed to resolving issues promptly.
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
