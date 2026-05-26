export const DMCAPage = () => {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur">
        <h1 className="mb-4 text-2xl font-bold text-white">DMCA & Content Removal Policy</h1>
        <p className="mb-4 text-slate"><strong>Last updated:</strong> May 26, 2026</p>

        <p className="mb-4 text-slate">
          Mathieu Courchesne — OM43 respects intellectual property rights and complies with the
          Digital Millennium Copyright Act (DMCA) and equivalent international copyright laws.
          We respond promptly to valid takedown notices and take copyright infringement seriously.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Filing a DMCA Takedown Notice</h2>
        <p className="mb-3 text-slate">
          If you believe that content available on this website infringes upon your copyright,
          you (or your authorized agent) may submit a written DMCA takedown notice to our
          Designated Copyright Agent. Your notice must include <em>all</em> of the following:
        </p>
        <ol className="list-decimal space-y-2 pl-5 text-slate">
          <li>Your physical or electronic signature as the copyright owner or authorized agent.</li>
          <li>Identification of the copyrighted work(s) you claim has been infringed.</li>
          <li>Identification of the infringing material and its URL or location on this website,
            sufficient for us to locate and remove it.</li>
          <li>Your name, mailing address, telephone number, and email address.</li>
          <li>A statement that you have a good faith belief that the use of the material is not
            authorized by the copyright owner, its agent, or the law.</li>
          <li>A statement, made under penalty of perjury, that the information in your notice is
            accurate and that you are the copyright owner or authorized to act on their behalf.</li>
        </ol>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Designated Copyright Agent</h2>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate">
          <p className="font-semibold text-white">Mathieu Courchesne — OM43</p>
          <p>DMCA Agent / Copyright Compliance Officer</p>
          <p className="mt-2">
            Email: <a href="mailto:dmca@theom43.team" className="text-ember hover:underline">dmca@theom43.team</a>
          </p>
          <p>Phone: +1 929 812 1653</p>
          <p>Address: 1442 PIE-IX, H1V2C1, Montréal, Québec, Canada</p>
        </div>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Counter-Notice</h2>
        <p className="text-slate">
          If you believe that content was removed in error, you may submit a written counter-notice
          to our Designated Copyright Agent. The counter-notice must contain all elements required
          by 17 U.S.C. § 512(g)(3), including your consent to jurisdiction of the federal district
          court for the district in which your address is located (or the Southern District of New
          York if outside the United States).
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Repeat Infringer Policy</h2>
        <p className="text-slate">
          In accordance with the DMCA and applicable law, we will terminate the access of any user
          who is found to be a repeat infringer of third-party copyrights.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Content Removal Requests</h2>
        <p className="text-slate">
          For content removal requests unrelated to copyright (e.g., unauthorized publication of
          personal images), please contact <a href="mailto:contact@theom43.team" className="text-ember hover:underline">contact@theom43.team</a>.
          All performers appearing on this platform have provided documented, written consent.
          Records are maintained by Mathieu Courchesne — OM43 in accordance with applicable law.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold text-white">Response Time</h2>
        <p className="text-slate">
          We will acknowledge valid notices within <strong className="text-white">3 business days</strong> and
          act on confirmed valid takedown requests as expeditiously as practicable.
        </p>
      </div>
    </div>
  );
};
