import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Clock, Film, Folder, Trash2, LogOut, Plus, Shield, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { sendChatMessage } from '../api/chat';
import { useNavigate } from 'react-router-dom';
import { submitSurvey } from '../api/analytics';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../features/session/useSession';
import { PayhipForm } from './PayhipForm';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `👋 Salut ! Je suis l'assistant de Super Vidéothèque.

Je peux t'aider avec :
• Comment fonctionne le site
• Trouver des vidéos qui te plaisent
• Résoudre des problèmes techniques
• Répondre à tes questions

Qu'est-ce que je peux faire pour toi ?`,
  timestamp: new Date()
};

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChat = ({ isOpen, onClose }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { codes, customerEmail, removeCode, clearSession } = useSession();
  const [view, setView] = useState<'chat' | 'access' | 'add' | 'logout' | 'survey'>('chat');
  const navigate = useNavigate();
  const navigate = useNavigate();

  const timeRemainingLabel = (() => {
    const now = Date.now();
    const timeCodes = codes.filter(c => c.grant.type === 'time' && c.grant.expiresAt);
    if (timeCodes.length === 0) return undefined;
    const longest = Math.max(...timeCodes.map(c => new Date(c.grant.expiresAt!).getTime() - now));
    if (longest <= 0) return 'Expiré';
    const minutes = Math.floor(longest / 60000);
    return `${minutes} min restantes`;
  })();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Occasionally prompt survey (~once per 3 days)
  useEffect(() => {
    if (!isOpen) return;
    const key = 'survey:lastPrompt';
    const last = localStorage.getItem(key);
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    const due = !last || (Date.now() - Number(last)) > threeDaysMs;
    if (due) {
      setView('survey');
      localStorage.setItem(key, String(Date.now()));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build history for API (exclude welcome message)
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }));

      const responseContent = await sendChatMessage(input.trim(), history);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Oups, une erreur est survenue. Réessaie dans un moment !',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Chat window */}
      <div className="relative flex h-[500px] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-night-light shadow-2xl sm:h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-night p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ember text-night">
              <span className="text-lg font-bold">?</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Assistant AI</h3>
              <p className="text-xs text-slate">Toujours là pour t'aider</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {customerEmail && (
              <div className="hidden sm:block text-xs text-slate">
                {customerEmail} {timeRemainingLabel ? `• ${timeRemainingLabel}` : ''}
              </div>
            )}
            <button
              onClick={() => navigate('/privacy')}
              className="rounded-full p-2 text-slate transition hover:bg-white/10 hover:text-white"
              title="Privacy"
            >
              <Shield size={18} />
            </button>
            <div className="flex items-center gap-2">
              {customerEmail && (
                <div className="hidden sm:block text-xs text-slate">
                  {customerEmail}
                </div>
              )}
              <button
                onClick={() => navigate('/privacy')}
                className="rounded-full p-2 text-slate transition hover:bg-white/10 hover:text-white"
                title="Privacy"
              >
                <Shield size={18} />
              </button>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate transition hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="border-b border-white/10 bg-night/40 p-3 flex gap-2 justify-between">
          <button onClick={() => setView('access')} className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15 transition">
            Mes accès
          </button>
          <button onClick={() => setView('add')} className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15 transition">
            <span className="inline-flex items-center gap-1"><Plus size={14}/> Ajouter un code</span>
          </button>
          <button onClick={() => setView('logout')} className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15 transition">
            <span className="inline-flex items-center gap-1"><LogOut size={14}/> Déconnexion</span>
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {view === 'access' && (
            <div className="space-y-3">
              <div className="text-xs text-slate">Connecté: {customerEmail || '—'}</div>
              {codes.length === 0 ? (
                <p className="text-sm text-slate">Aucun code enregistré.</p>
              ) : (
                codes.map((c) => {
                  const now = Date.now();
                  const expiresAt = c.grant.expiresAt ? new Date(c.grant.expiresAt).getTime() : undefined;
                  const isExpired = !!expiresAt && expiresAt <= now;
                  const remaining = expiresAt ? Math.max(0, Math.floor((expiresAt - now) / 60000)) : undefined;
                  const icon = c.grant.type === 'time' ? <Clock className="w-4 h-4"/> : c.grant.type === 'film' ? <Film className="w-4 h-4"/> : <Folder className="w-4 h-4"/>;
                  const label = c.grant.type === 'time' ? 'Accès complet temporaire' : c.grant.type === 'film' ? `Film: ${c.grant.value}` : `Catégorie: ${c.grant.value}`;
                  return (
                    <div key={c.code} className={clsx('flex items-center justify-between rounded-lg border p-3', isExpired ? 'border-red-500/30 opacity-60' : 'border-white/10 bg-white/5')}>
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-ember">{icon}</div>
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium">{label}</p>
                          <p className="text-xs text-slate/70">Code: {c.code.substring(0,8)}…</p>
                        </div>
                        <div className={clsx('text-right text-sm', isExpired ? 'text-red-400' : 'text-green-400')}>
                          {expiresAt ? (isExpired ? 'Expiré' : `${remaining} min`) : 'Permanent'}
                        </div>
                      </div>
                      <button onClick={() => removeCode(c.code)} className="ml-3 text-slate/60 hover:text-red-400"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {view === 'add' && (
            <div>
              <p className="mb-3 text-sm text-slate">Entre ton code Payhip et ton email pour activer l’accès.</p>
              <PayhipForm />
            </div>
          )}

          {view === 'logout' && (
            <div className="space-y-3">
              <p className="text-sm text-slate">Tu vas te déconnecter et effacer tes codes de ce navigateur.</p>
              <div className="flex gap-2">
                <button onClick={() => { clearSession(); setView('chat'); }} className="rounded-lg bg-red-500/80 hover:bg-red-500 px-4 py-2 text-sm text-white">Confirmer</button>
                <button onClick={() => setView('chat')} className="rounded-lg bg-white/10 hover:bg-white/15 px-4 py-2 text-sm text-white">Annuler</button>
              </div>
            </div>
          )}

          {view === 'chat' && (
            <>
              {/* Messages */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={clsx(
                    'flex',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={clsx(
                      'max-w-[85%] rounded-2xl px-4 py-3 text-sm',
                      message.role === 'user'
                        ? 'bg-ember text-night'
                        : 'bg-white/10 text-white'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (

            {/* Survey modal content */}
            {view === 'survey' && (
              <div className="absolute inset-x-4 bottom-24 rounded-xl border border-white/10 bg-night/90 p-4 shadow-glow">
                <div className="flex items-center gap-2 mb-2 text-white"><Sparkles size={16}/> <span className="text-sm font-semibold">Dis-nous ce que tu aimes</span></div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget as HTMLFormElement;
                    const getVals = (name: string) => Array.from(form.querySelectorAll(`input[name='${name}']:checked`)).map((el: any) => el.value);
                    const frequency = (form.querySelector("select[name='frequency']") as HTMLSelectElement)?.value || undefined;
                    const answers = {
                      genres: getVals('genres'),
                      likeMore: getVals('more'),
                      likeLess: getVals('less'),
                      frequency
                    };
                    try {
                      await submitSurvey({ email: customerEmail, answers });
                      setView('chat');
                    } catch {
                      setView('chat');
                    }
                  }}
                  className="space-y-3 text-sm text-slate"
                >
                  <div>
                    <p className="text-white mb-1">Genres préférés</p>
                    <div className="flex flex-wrap gap-2">
                      {['drame','comédie','thriller','documentaire'].map(g => (
                        <label key={g} className="inline-flex items-center gap-1">
                          <input type="checkbox" name="genres" value={g} className="accent-ember"/> <span className="capitalize">{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-white mb-1">Voir plus de…</p>
                    <div className="flex flex-wrap gap-2">
                      {['actions','romance','humour','slow-burn'].map(g => (
                        <label key={g} className="inline-flex items-center gap-1">
                          <input type="checkbox" name="more" value={g} className="accent-ember"/> <span className="capitalize">{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-white mb-1">Voir moins de…</p>
                    <div className="flex flex-wrap gap-2">
                      {['violence','langage','lenteur','spoilers'].map(g => (
                        <label key={g} className="inline-flex items-center gap-1">
                          <input type="checkbox" name="less" value={g} className="accent-ember"/> <span className="capitalize">{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-white mb-1">Fréquence des suggestions</p>
                    <select name="frequency" className="rounded-lg bg:white/5 border border-white/10 px-3 py-2 text-white">
                      <option value="rarement">Rarement</option>
                      <option value="parfois">Parfois</option>
                      <option value="souvent">Souvent</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="rounded-lg bg-ember text-night px-3 py-2">Envoyer</button>
                    <button type="button" onClick={() => setView('chat')} className="rounded-lg bg-white/10 text-white px-3 py-2">Plus tard</button>
                  </div>
                </form>
              </div>
            )}
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white/10 px-4 py-3">
                    <Loader2 className="h-5 w-5 animate-spin text-ember" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-white/10 p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écris ton message..."
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate outline-none transition focus:border-ember"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-ember text-night transition hover:bg-yellow-400 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
