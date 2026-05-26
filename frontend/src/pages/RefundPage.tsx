export const RefundPage = () => {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur">
        <h1 className="mb-4 text-2xl font-bold text-white">Refund &amp; Cancellation Policy</h1>
        <p className="mb-4 text-slate"><strong>Last updated:</strong> May 26, 2026</p>

        <div className="mb-5 rounded-xl border border-amber-300/40 bg-amber-200/10 p-4 text-slate">
          <strong>
            All purchases on this platform are for immediate digital access to media content.
            Due to the immediate delivery nature of digital content, all sales are final and non-refundable
            once access is granted. If you experience any technical issues, contact{' '}
            <a href="mailto:contact@theom43.team" className="text-ember hover:underline">contact@theom43.team</a>{' '}
            before filing a dispute.
          </strong>
        </div>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Time-Limited Access Purchases (Card / Payhip / CCBill)</h2>
        <p className="text-slate">
          Time-limited access purchases (e.g. 1-hour streaming access via Payhip gift card) are one-time,
          non-recurring transactions. There are no automatic renewals, hidden subscriptions, or recurring
          charges associated with these purchases.
          The descriptor <strong className="text-white">CCBILL.COM</strong> or{' '}
          <strong className="text-white">PAYHIP.COM</strong> will appear on your statement depending on the payment method used.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Annual Subscription (Cryptocurrency)</h2>
        <p className="text-slate">
          The &quot;All Year Long&quot; annual subscription is billed once per year at USD 300, paid exclusively
          via cryptocurrency through NOWPayments. There are <strong className="text-white">no automatic renewals</strong> —
          each subscription period requires a new manual payment initiated by the customer.
          Cryptocurrency transactions are <strong className="text-white">irreversible</strong> once confirmed
          on the blockchain. No refunds are possible for crypto payments.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Exceptions &amp; Technical Issues</h2>
        <p className="text-slate">
          If you have been charged but cannot access the content due to a technical error on our part,
          we will investigate and resolve the issue promptly. Contact support within{' '}
          <strong className="text-white">72 hours</strong> of your purchase with your transaction ID
          and email address.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Chargebacks &amp; Disputes</h2>
        <p className="text-slate">
          Before filing a chargeback with your bank or card issuer, please contact us first.
          We are committed to resolving legitimate issues quickly and fairly. Fraudulent chargebacks
          may result in permanent access revocation and may be reported to relevant authorities.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Contact &amp; Customer Support</h2>
        <p className="text-slate leading-relaxed">
          Mathieu Courchesne — OM43<br />
          Email: <a href="mailto:contact@theom43.team" className="text-ember hover:underline">contact@theom43.team</a><br />
          Phone: +1 929 812 1653<br />
          <span className="text-slate/70 text-xs">Response time: within 2 business days.</span>
        </p>
      </div>
    </div>
  );
};
