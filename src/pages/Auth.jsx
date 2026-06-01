import { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import { useGame } from '../context/GameContext';

const Auth = memo(function Auth() {
  const navigate = useNavigate();
  const { loginUser, registerUser } = useGame();
  
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await loginUser(email, password);
        navigate('/');
      } else {
        await registerUser(username, email, password);
        // After register, you might want to log them in automatically or switch to login mode.
        // Let's just switch to login mode for simplicity, or auto login if backend returns token.
        // The backend returns a message for register, so we'll just switch to login.
        setIsLogin(true);
        setError('Registration successful! Please log in.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen fade-in">
      <Navbar pill="AUTHENTICATION" />

      <div className="s-content" style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: '100px' }}>
        <div className="card card-glow-blue slide-in" style={{ padding: '36px 28px', width: '100%', maxWidth: '400px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
          
          {/* Top Background Decoration */}
          <div style={{
            position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
            width: 200, height: 200, background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)',
            pointerEvents: 'none'
          }}></div>

          <div style={{
            width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
            background: 'linear-gradient(135deg,#e0e7ff,#c7d2fe)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, boxShadow: '0 8px 24px rgba(99,102,241,0.2)',
            border: '3px solid rgba(255,255,255,0.9)',
            position: 'relative', zIndex: 1
          }}>
            {isLogin ? '🔐' : '👋'}
          </div>

          <h2 style={{ textAlign: 'center', marginBottom: 24, fontSize: 24, letterSpacing: '-0.5px' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          <div style={{ 
            display: 'flex', background: 'rgba(99,102,241,0.08)', padding: 5, 
            borderRadius: 14, marginBottom: 24, position: 'relative', zIndex: 1
          }}>
            <button
               onClick={() => { setIsLogin(true); setError(''); }}
               style={{ 
                 flex: 1, padding: '10px', borderRadius: 10, border: 'none', 
                 background: isLogin ? '#fff' : 'transparent', 
                 color: isLogin ? 'var(--blue)' : 'var(--text2)', 
                 fontWeight: 700, 
                 boxShadow: isLogin ? '0 2px 12px rgba(99,102,241,0.15)' : 'none', 
                 cursor: 'pointer', transition: 'all 0.25s ease' 
               }}
            >
               Login
            </button>
            <button
               onClick={() => { setIsLogin(false); setError(''); }}
               style={{ 
                 flex: 1, padding: '10px', borderRadius: 10, border: 'none', 
                 background: !isLogin ? '#fff' : 'transparent', 
                 color: !isLogin ? 'var(--blue)' : 'var(--text2)', 
                 fontWeight: 700, 
                 boxShadow: !isLogin ? '0 2px 12px rgba(99,102,241,0.15)' : 'none', 
                 cursor: 'pointer', transition: 'all 0.25s ease' 
               }}
            >
               Sign Up
            </button>
          </div>

          {error && (
            <div style={{
              background: error.includes('successful') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: error.includes('successful') ? 'var(--green)' : 'var(--red)',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '20px',
              fontSize: '13px',
              fontWeight: 600,
              textAlign: 'center',
              border: `1px solid ${error.includes('successful') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
              animation: 'slideUp 0.3s ease'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', zIndex: 1 }}>
            {!isLogin && (
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-glass" disabled={loading} style={{ marginTop: '12px', padding: '16px 20px', fontSize: 15 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span className="dots"><span/><span/><span/></span> Processing
                </span>
              ) : (isLogin ? 'Log In to ImposterHunt' : 'Create My Account')}
            </button>
          </form>
        </div>
      </div>

      <BottomNav active="auth" navigate={navigate} />
    </div>
  );
});

export default Auth;
