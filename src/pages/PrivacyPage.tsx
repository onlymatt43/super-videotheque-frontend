export const PrivacyPage = () => {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="max-w-3xl mx-auto glass-panel rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-slate mb-4"><strong>Last updated:</strong> May 26, 2026</p>
        <p className="text-slate mb-4">
          This Privacy Policy explains how Mathieu Courchesne — OM43 (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
          collects, uses, and protects personal information when you use this website and related services.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6 mb-2">1. Information We Collect</h2>
        <ul className="list-disc pl-5 text-slate space-y-2">
          <li>Email address submitted voluntarily for access validation or subscription.</li>
          <li>Access code / license key references used to authenticate purchases.</li>
          <li>Technical logs: IP address, browser type, access timestamps, used for security and fraud prevention.</li>
          <li>Cookie and local storage data for session continuity and authentication.</li>
          <li>Payment transaction identifiers (not full card numbers) provided by our payment processors.</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6 mb-2">2. Payment Processors &amp; Data Sharing</h2>
        <p className="text-slate mb-3">
          We work with the following authorized third-party payment processors, each of which maintains
          its own privacy and security policies:
        </p>
        <ul className="list-disc pl-5 text-slate space-y-2">
          <li>
            <strong className="text-white">CCBill, LLC</strong> — Processes credit/debit card transactions.
            CCBill collects cardholder name, billing address, card number, and related payment data directly.
            CCBill is PCI-DSS Level 1 certified. See{' '}
            <a href="https://www.ccbill.com/privacy-policy.php" target="_blank" rel="noopener noreferrer" className="text-ember hover:underline">ccbill.com/privacy-policy</a>.
          </li>
          <li>
            <strong className="text-white">NOWPayments</strong> — Processes cryptocurrency transactions.
            NOWPayments handles wallet addresses and transaction data in accordance with their AML/KYC policies.
            See <a href="https://nowpayments.io/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-ember hover:underline">nowpayments.io/privacy-policy</a>.
          </li>
          <li>
            <strong className="text-white">Payhip Limited</strong> — Processes card payments via Payhip checkout.
            Payhip handles payment data per their own privacy policy at{' '}
            <a href="https://payhip.com/privacy" target="_blank" rel="noopener noreferrer" className="text-ember hover:underline">payhip.com/privacy</a>.
          </li>
        </ul>
        <p className="mt-3 text-slate">
          We do not receive, store, or have access to full credit card numbers. All card data is
          handled entirely by the respective processor.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6 mb-2">3. How We Use Your Information</h2>
        <ul className="list-disc pl-5 text-slate space-y-2">
          <li>To validate paid access rights and deliver purchased digital content.</li>
          <li>To maintain platform security, detect fraud, and prevent abuse.</li>
          <li>To provide customer support and resolve billing issues.</li>
          <li>To comply with legal obligations (AML, PCMLTFA, GDPR/PIPEDA as applicable).</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6 mb-2">4. Cookies &amp; Local Storage</h2>
        <p className="text-slate">
          This site uses browser local storage to maintain your session and access codes.
          No advertising or third-party tracking cookies are used. Essential session data
          is cleared when you log out or close the session. By using this site, you consent
          to this essential use of local storage.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6 mb-2">5. Data Retention</h2>
        <p className="text-slate">
          Access logs and transaction identifiers are retained for a minimum of{' '}
          <strong className="text-white">5 years</strong> to comply with Canadian AML record-keeping
          requirements (PCMLTFA). Email addresses are retained for the duration of active access
          and may be kept up to 2 years thereafter for support purposes.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6 mb-2">6. Your Rights</h2>
        <p className="text-slate">
          Under applicable law (PIPEDA, GDPR where applicable), you may request access to, correction of,
          or deletion of your personal data. To exercise these rights, contact us at the address below.
          Note that certain data may be retained as required by law.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6 mb-2">7. Security</h2>
        <p className="text-slate">
          We implement reasonable technical and organizational security measures to protect your
          information. However, no internet transmission is 100% secure. We encourage you to
          contact us immediately if you suspect unauthorized access to your account.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6 mb-2">Contact</h2>
        <p className="text-slate leading-relaxed">
          Mathieu Courchesne — OM43<br />
          Email: <a href="mailto:contact@theom43.team" className="text-ember hover:underline">contact@theom43.team</a><br />
          Phone: +1 929 812 1653<br />
          Address: 1442 PIE-IX, H1V2C1, Montréal, Québec, Canada
        </p>
      </div>
    </div>
  );
};
