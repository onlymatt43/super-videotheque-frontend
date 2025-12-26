import { useSession } from '../features/session/useSession';
import { Clock, Film, Folder, Trash2 } from 'lucide-react';

export const AccessManager = () => {
  const { codes, removeCode, getActiveAccess } = useSession();
  const activeAccess = getActiveAccess();

  if (codes.length === 0) return null;

  const getAccessIcon = (type: string) => {
    switch (type) {
      case 'time': return <Clock className="w-4 h-4" />;
      case 'film': return <Film className="w-4 h-4" />;
      case 'category': return <Folder className="w-4 h-4" />;
      default: return null;
    }
  };

  const getAccessLabel = (type: string, value: string) => {
    switch (type) {
      case 'time': return 'Accès complet temporaire';
      case 'film': return `Film: ${value}`;
      case 'category': return `Catégorie: ${value}`;
      default: return value;
    }
  };

  const getTimeRemaining = (expiresAt?: string) => {
    if (!expiresAt) return 'Permanent';
    
    const now = Date.now();
    const expires = new Date(expiresAt).getTime();
    const remaining = expires - now;
    
    if (remaining <= 0) return 'Expiré';
    
    const minutes = Math.floor(remaining / 60000);
    if (minutes < 60) return `${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    
    const days = Math.floor(hours / 24);
    return `${days}j`;
  };

  return (
    <div className="glass-panel rounded-xl p-4 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Mes accès actifs</h3>
      <div className="space-y-3">
        {codes.map((codeAccess) => {
          const isExpired = codeAccess.grant.expiresAt && 
            new Date(codeAccess.grant.expiresAt).getTime() <= Date.now();
          
          return (
            <div
              key={codeAccess.code}
              className={`flex items-center justify-between p-3 rounded-lg bg-white/5 border ${
                isExpired ? 'border-red-500/30 opacity-50' : 'border-white/10'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="text-ember">
                  {getAccessIcon(codeAccess.grant.type)}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">
                    {getAccessLabel(codeAccess.grant.type, codeAccess.grant.value)}
                  </p>
                  <p className="text-slate/70 text-xs">
                    Code: {codeAccess.code.substring(0, 8)}...
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    isExpired ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {getTimeRemaining(codeAccess.grant.expiresAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeCode(codeAccess.code)}
                className="ml-3 text-slate/50 hover:text-red-400 transition-colors"
                title="Retirer ce code"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
