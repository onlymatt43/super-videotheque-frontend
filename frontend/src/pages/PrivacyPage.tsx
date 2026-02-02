
export const PrivacyPage = () => {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="max-w-3xl mx-auto glass-panel rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Privacy, Legal & Responsibility</h1>
        <p className="text-slate mb-4">
          Nous prenons votre confidentialité au sérieux. Cette page résume les politiques de
          confidentialité, les mentions légales et nos engagements de responsabilité.
        </p>
        <h2 className="text-xl font-semibold text-white mt-6 mb-2">Confidentialité</h2>
        <ul className="list-disc pl-5 text-slate space-y-2">
          <li>Les codes Payhip et adresses email sont utilisés uniquement pour valider l'accès.</li>
          <li>Vos données ne sont pas partagées avec des tiers hors des services nécessaires.</li>
          <li>Vous pouvez révoquer votre session à tout moment via la déconnexion.</li>
        </ul>
        <h2 className="text-xl font-semibold text-white mt-6 mb-2">Mentions légales</h2>
        <ul className="list-disc pl-5 text-slate space-y-2">
          <li>Le contenu est protégé par droits d'auteur; toute redistribution est interdite.</li>
          <li>Les accès sont temporaires ou limités selon le produit acheté.</li>
        </ul>
        <h2 className="text-xl font-semibold text-white mt-6 mb-2">Responsabilité</h2>
        <ul className="list-disc pl-5 text-slate space-y-2">
          <li>Nous nous efforçons d'assurer la disponibilité; en cas d'incident, contactez le support.</li>
          <li>Respectez les conditions d'utilisation et les limitations d'accès.</li>
        </ul>
      </div>
    </div>
  );
};
