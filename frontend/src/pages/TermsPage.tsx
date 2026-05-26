export const TermsPage = () => {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur">
        <h1 className="mb-4 text-2xl font-bold text-white">Terms of Service</h1>
        <p className="mb-4 text-slate"><strong>Last updated:</strong> May 26, 2026</p>
        <p className="mb-4 text-slate">
          These Terms govern access to and use of this website and all related digital content services
          operated by OM43 (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
          By accessing this website, you confirm that you have read, understood, and agree to be bound by these Terms.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">1. Age Restriction</h2>
        <p className="text-slate">
          This website contains adult content. You must be at least 18 years of age (or the legal age of majority
          in your jurisdiction) to access this site. By entering, you represent and warrant that you are at least
          18 years old and that you are legally permitted to access adult content in your jurisdiction.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">2. Purchased Access</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate">
          <li>All purchases grant personal, private, non-transferable access to digital content.</li>
          <li>Redistribution, sharing, resale, screen capture, and republication are strictly prohibited.</li>
          <li>Access codes and subscription credentials may not be shared with third parties.</li>
          <li>Unauthorized use may result in immediate access revocation and legal action.</li>
        </ul>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">3. Payment &amp; Billing</h2>
        <p className="mb-2 text-slate">
          Payments are processed by our authorized third-party partners:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-slate">
          <li>
            <strong className="text-white">CCBill</strong> — For credit/debit card transactions.
            The descriptor <strong className="text-white">CCBILL.COM</strong> will appear on your bank or
            credit card statement. CCBill is an authorized reseller and payment processor.
            Customer support: <a href="https://support.ccbill.com" target="_blank" rel="noopener noreferrer" className="text-ember hover:underline">support.ccbill.com</a> | 1-888-596-9279.
          </li>
          <li>
            <strong className="text-white">NOWPayments</strong> — For cryptocurrency transactions.
            Crypto payments are processed by NOWPayments (nowpayments.io) and are final and irreversible
            once confirmed on the blockchain.
          </li>
          <li>
            <strong className="text-white">Payhip</strong> — For card payments via Payhip checkout.
            The descriptor <strong className="text-white">PAYHIP.COM</strong> may appear on your statement.
          </li>
        </ul>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">4. Subscriptions</h2>
        <p className="text-slate">
          Subscription plans (e.g. &quot;All Year Long&quot; at USD 300/year) are paid in full upfront
          via cryptocurrency through NOWPayments. Plan formats and pricing may evolve over time.
          There are no automatic renewals — each subscription period requires a new manual payment.
          Time-limited access purchases (e.g. 1-hour streaming via Payhip or CCBill) are single
          non-recurring transactions with no recurring component.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">5. Refunds &amp; Cancellations</h2>
        <p className="text-slate">
          All sales are final. Due to the immediate digital nature of content delivery, refunds are not
          available after access is granted. Cryptocurrency transactions are irreversible by nature.
          For technical support or billing disputes, contact us <em>before</em> filing a chargeback.
          See our full <a href="/refund" className="text-ember hover:underline">Refund &amp; Cancellation Policy</a>.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">6. Intellectual Property</h2>
        <p className="text-slate">
          All videos, images, branding, and related materials are the exclusive property of
          OM43 and are protected by applicable copyright and intellectual property laws.
          No license is granted for commercial use, redistribution, or derivative works.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">7. Prohibited Conduct</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate">
          <li>Accessing the platform using automated tools, bots, or scrapers.</li>
          <li>Attempting to circumvent access controls, DRM, or watermarks.</li>
          <li>Using the platform for any unlawful purpose.</li>
          <li>Harassing, threatening, or defrauding other users or our team.</li>
          <li>Uploading or transmitting viruses or malicious code.</li>
        </ul>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">8. Disclaimer &amp; Limitation of Liability</h2>
        <p className="text-slate">
          Content is provided &quot;as is.&quot; We make no warranties, express or implied, regarding
          uninterrupted access or fitness for a particular purpose. To the maximum extent permitted by law,
          our liability is limited to the amount paid for the specific access that gave rise to the claim.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">9. Governing Law &amp; Dispute Resolution</h2>
        <p className="text-slate">
          These Terms are governed by the laws of the Province of Quebec and the federal laws of Canada
          applicable therein. Any dispute shall be resolved by the courts of Montréal, Québec, Canada,
          and you consent to the exclusive jurisdiction thereof.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">10. Changes to These Terms</h2>
        <p className="text-slate">
          We may update these Terms at any time. Continued use of the platform after changes constitutes
          acceptance of the revised Terms. The &quot;Last updated&quot; date at the top of this page reflects
          the most recent revision.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Contact &amp; Customer Support</h2>
        <p className="text-slate leading-relaxed">
          Website: <a href="https://video.onlymatt.ca" className="text-ember hover:underline">video.onlymatt.ca</a><br />
          Email: <a href="mailto:contact@theom43.team" className="text-ember hover:underline">contact@theom43.team</a><br />
          <span className="text-slate/70 text-xs">Response time: within 2 business days.</span>
        </p>
      </div>
    </div>
  );
};
