export const PrivacyPage = () => {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="max-w-3xl mx-auto glass-panel rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-slate mb-4"><strong>Last updated:</strong> May 25, 2026</p>
        <p className="text-slate mb-4">
          This Privacy Policy explains how Mathieu Courchesne - OM43 ("we", "us", "our")
          collects, uses, and protects personal information when you use this website and related services.
        </p>
        <h2 className="text-xl font-semibold text-white mt-6 mb-2">Data Collection</h2>
        <ul className="list-disc pl-5 text-slate space-y-2">
          <li>Contact data submitted voluntarily, such as email address.</li>
          <li>Access validation data, including code/license references.</li>
          <li>Technical and security logs used to operate and protect the service.</li>
          <li>Essential cookie/local storage data for authentication and session continuity.</li>
        </ul>
        <h2 className="text-xl font-semibold text-white mt-6 mb-2">How Data Is Used</h2>
        <ul className="list-disc pl-5 text-slate space-y-2">
          <li>To validate paid access rights and code entitlement.</li>
          <li>To maintain platform security and prevent abuse/fraud.</li>
          <li>To provide customer support and meet legal obligations.</li>
        </ul>
        <h2 className="text-xl font-semibold text-white mt-6 mb-2">Data Sharing and Payments</h2>
        <p className="text-slate">
          We do not sell personal information. Limited data may be shared with trusted providers for payment,
          hosting, security, and legal compliance. Payment processing is handled by authorized third-party partners.
        </p>
        <h2 className="text-xl font-semibold text-white mt-6 mb-2">Contact</h2>
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
