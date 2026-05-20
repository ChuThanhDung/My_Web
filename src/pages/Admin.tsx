import { useState, useEffect } from 'react';
import api from '../api';
import { Loader2, Trash2 } from 'lucide-react';

interface Article {
  id: number;
  slug: string;
  title_en: string;
}

export default function Admin() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [articlesRes] = await Promise.all([
        api.get('/articles')
      ]);
      setArticles(articlesRes.data);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      
      const res = await api.post('/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      const newToken = res.data.access_token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setError('');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const deleteArticle = async (id: number) => {
    if(!confirm("Are you sure?")) return;
    try {
      await api.delete(`/admin/articles/${id}`);
      setArticles(articles.filter(a => a.id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  }

  if (!token) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 glass-card bg-white dark:bg-slate-800 rounded-3xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Admin Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent" />
          </div>
          <div>
            <label className="block mb-2 font-medium">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent" />
          </div>
          <button type="submit" className="w-full p-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">Logout</button>
      </div>

      {loading ? (
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" />
      ) : (
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-4">Manage Articles</h2>
            <div className="space-y-3">
              {articles.map(a => (
                <div key={a.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div>
                    <p className="font-bold">{a.title_en}</p>
                    <p className="text-sm text-slate-500">/{a.slug}</p>
                  </div>
                  <button onClick={() => deleteArticle(a.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {articles.length === 0 && <p className="text-slate-500">No articles found.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
