import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "Comment obtenir une clé de licence ?",
    answer: "Achetez votre accès sur notre boutique Payhip. Vous recevrez immédiatement votre clé de licence par email."
  },
  {
    question: "Combien de temps dure ma location ?",
    answer: "Chaque location vous donne accès au contenu pendant 48 heures à partir du moment où vous commencez le visionnage."
  },
  {
    question: "Sur quels appareils puis-je regarder ?",
    answer: "Le service fonctionne sur tous les appareils : ordinateur, tablette, smartphone. La lecture est optimisée pour mobile."
  },
  {
    question: "Comment fonctionne le catalogue ?",
    answer: "Le catalogue s'affiche horizontalement façon Netflix. Survolez une vidéo pendant 4 secondes pour voir la prévisualisation automatique."
  },
  {
    question: "Les liens vidéo sont-ils sécurisés ?",
    answer: "Oui, tous les liens vidéo sont signés et temporisés. Ils expirent après un certain temps pour garantir la sécurité du contenu."
  },
  {
    question: "Puis-je télécharger les vidéos ?",
    answer: "Non, le contenu est disponible uniquement en streaming pour protéger les droits d'auteur."
  }
];

export const QuestionsPage = () => (
  <div className="mx-auto max-w-3xl">
    <Link 
      to="/" 
      className="mb-8 inline-flex items-center gap-2 text-sm text-slate transition-colors hover:text-ember"
    >
      <span>←</span> Retour à l'accueil
    </Link>
    
    <h1 className="mb-2 font-display text-4xl uppercase tracking-[0.2em] text-ember">
      Questions Fréquentes
    </h1>
    <p className="mb-10 text-slate">Tout ce que vous devez savoir sur Super Vidéothèque</p>
    
    <div className="space-y-6">
      {faqs.map((faq, index) => (
        <article 
          key={index}
          className="rounded-2xl bg-night-light p-6 transition-all hover:ring-1 hover:ring-ember/30"
        >
          <h2 className="mb-3 text-lg font-semibold text-white">{faq.question}</h2>
          <p className="text-slate">{faq.answer}</p>
        </article>
      ))}
    </div>
    
    <div className="mt-12 rounded-2xl border border-ember/30 bg-night-light/50 p-6 text-center">
      <p className="text-slate">
        Vous avez d'autres questions ? Contactez-nous à{' '}
        <a href="mailto:support@super-videotheque.com" className="text-ember hover:underline">
          support@super-videotheque.com
        </a>
      </p>
    </div>
  </div>
);
