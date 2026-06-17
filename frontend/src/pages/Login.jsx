import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client.js';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ nickname: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      await client.post(endpoint, form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold">⚽ FC온라인 리그</Link>
        </div>

        <div className="bg-bg-surface border border-border rounded-xl p-8 space-y-5">
          <div className="flex rounded-lg overflow-hidden border border-border">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2 text-sm font-semibold transition ${
                  mode === m ? 'bg-accent text-bg-base' : 'text-muted hover:text-text'
                }`}
              >
                {m === 'login' ? '로그인' : '회원가입'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-muted block mb-1">닉네임</label>
              <input
                type="text" required value={form.nickname}
                onChange={(e) => setField('nickname', e.target.value)}
                className="w-full bg-bg-elevated border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
                placeholder="닉네임 입력"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="text-xs text-muted block mb-1">이메일</label>
                <input
                  type="email" required value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  className="w-full bg-bg-elevated border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
                  placeholder="이메일 입력"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-muted block mb-1">비밀번호</label>
              <input
                type="password" required value={form.password}
                onChange={(e) => setField('password', e.target.value)}
                className="w-full bg-bg-elevated border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
                placeholder="비밀번호 입력"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full py-2.5 bg-green hover:bg-green-hover text-white font-semibold text-sm rounded-md transition disabled:opacity-50"
            >
              {loading ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
