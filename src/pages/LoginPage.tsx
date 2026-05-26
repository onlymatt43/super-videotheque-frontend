import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, setAdminSessionToken } from '../api/client';

export default function LoginPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const normalizedCode = code.replace(/\s+/g, '');
    if (!/^\d{6}$/.test(normalizedCode)) {
      setError('Entre un code à 6 chiffres.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/api/admin/auth/login', { code: normalizedCode });
      const token = response?.data?.data?.token as string | undefined;

      if (!token) {
        setError('Réponse invalide du serveur.');
        return;
      }

      setAdminSessionToken(token);
      navigate('/admin');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Échec de connexion admin';
      setError(message);
      setCode('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-zinc-900 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Connexion admin
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="totp-code" className="block text-sm font-medium text-gray-300 mb-2">
              Code 6 chiffres (cell)
            </label>
            <input
              type="text"
              id="totp-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="123456"
              autoFocus
            />
          </div>
          
          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Vérification...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
