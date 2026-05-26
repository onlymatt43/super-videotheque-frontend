export const AMLPage = () => {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur">
        <h1 className="mb-4 text-2xl font-bold text-white">Anti-Money Laundering (AML) & Cryptocurrency Policy</h1>
        <p className="mb-4 text-slate"><strong>Last updated:</strong> May 26, 2026</p>

        <p className="mb-4 text-slate">
          OM43 is committed to preventing money laundering, terrorist financing,
          and other financial crimes. This policy applies to all cryptocurrency transactions processed
          through our authorized payment partner, NOWPayments.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Cryptocurrency Payment Processing</h2>
        <p className="mb-3 text-slate">
          Cryptocurrency payments on this platform are processed exclusively by{' '}
          <strong className="text-white">NOWPayments</strong> (nowpayments.io), a regulated digital
          asset payment service provider that maintains its own AML/KYC compliance program.
          By completing a cryptocurrency transaction, you agree to NOWPayments' Terms of Service
          and their AML/KYC policies.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Transaction Finality</h2>
        <div className="rounded-xl border border-amber-300/40 bg-amber-200/10 p-4">
          <p className="text-slate">
            <strong className="text-white">All cryptocurrency transactions are final and irreversible.</strong>{' '}
            Due to the immutable nature of blockchain technology, completed cryptocurrency payments
            cannot be reversed, refunded, or charged back. By proceeding with a crypto payment,
            you acknowledge and accept this condition.
          </p>
        </div>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Prohibited Uses</h2>
        <p className="mb-3 text-slate">The following uses are strictly prohibited:</p>
        <ul className="list-disc space-y-2 pl-5 text-slate">
          <li>Using cryptocurrency payments to launder funds from illegal activities.</li>
          <li>Structuring transactions to evade reporting thresholds.</li>
          <li>Using stolen or fraudulently obtained cryptocurrency.</li>
          <li>Processing payments on behalf of prohibited or sanctioned individuals or entities.</li>
          <li>Any use that violates FINTRAC (Canada), FinCEN (USA), or other applicable AML regulations.</li>
        </ul>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Our Obligations</h2>
        <p className="text-slate">
          We reserve the right to suspend access and report suspicious transactions to applicable
          regulatory authorities, including FINTRAC (Financial Transactions and Reports Analysis
          Centre of Canada), in compliance with the Proceeds of Crime (Money Laundering) and
          Terrorist Financing Act (PCMLTFA) and any other applicable law.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Know Your Customer (KYC)</h2>
        <p className="text-slate">
          KYC verification for cryptocurrency transactions is handled by NOWPayments in accordance
          with their regulatory obligations. We may, at our sole discretion, request identity
          verification before granting access to purchased content if there is reasonable suspicion
          of fraud or AML violations.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Record Keeping</h2>
        <p className="text-slate">
          Transaction records, including payment identifiers and access logs, are retained for a
          minimum of <strong className="text-white">5 years</strong> in compliance with Canadian
          AML record-keeping requirements under the PCMLTFA.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Contact</h2>
        <p className="text-slate leading-relaxed">
          For AML-related inquiries or to report suspicious activity:<br />
          Email: <a href="mailto:contact@theom43.team" className="text-ember hover:underline">contact@theom43.team</a><br />

        </p>
      </div>
    </div>
  );
};
