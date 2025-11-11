import { useState, useEffect } from "react";
import MessageBanner from "~/components/MessageBanner/MessageBanner";
import type { Message } from "~/components/MessageBanner/MessageBanner";
import "./Login.scss";

// Use VITE_API_URL only if explicitly set, otherwise use relative path for proxy
const API_URL = import.meta.env.VITE_API_URL;
const API_BASE = API_URL ? `${API_URL}/api` : '/api';

console.log('🔧 API Configuration:', { 
    VITE_API_URL: import.meta.env.VITE_API_URL,
    API_BASE,
    mode: import.meta.env.MODE 
});

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<Message | null>(null);
    const [loginMode, setLoginMode] = useState<'ldap' | 'local'>('local');
    const [ldapAvailable, setLdapAvailable] = useState<boolean | null>(null); // null = checking
    const [checkingLdap, setCheckingLdap] = useState(true);

    // Check LDAP status on component mount
    useEffect(() => {
        checkLdapStatus();
    }, []);

    /**
     * Check if LDAP server is reachable
     * Auto-selects login mode based on availability
     */
    async function checkLdapStatus() {
        console.log('� Frontend: Checking LDAP server status...');
        setCheckingLdap(true);
        
        try {
            const response = await fetch(`${API_BASE}/auth/ldap-status`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
            console.log('✅ Frontend: LDAP status received:', data.ldapAvailable);
            
            setLdapAvailable(data.ldapAvailable);
            
            if (data.ldapAvailable) {
                // LDAP is available - use it by default
                setLoginMode('ldap');
                console.log('✅ Frontend: LDAP server reachable, defaulting to LDAP login');
            } else {
                // LDAP unavailable - use local login
                setLoginMode('local');
                setMessage({
                    type: 'warning',
                    text: 'LDAP-Server nicht erreichbar. Bitte verbinden Sie sich mit dem DAL-Netzwerk oder nutzen Sie den lokalen Login.',
                    duration: 0
                });
                console.log('⚠️ Frontend: LDAP server unreachable, defaulting to local login');
            }
        } catch (err) {
            console.error('❌ Frontend: Error checking LDAP status:', err);
            setLdapAvailable(false);
            setLoginMode('local');
            setMessage({
                type: 'warning',
                text: 'Verbindung zum Server fehlgeschlagen. Bitte versuchen Sie es später erneut.',
                duration: 0
            });
        } finally {
            setCheckingLdap(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        console.log('🔵 Frontend: Login attempt:', { email, loginMode });

        // Validate email domain
        if (!email.endsWith('@sunrise.net')) {
            setMessage({ 
                type: "error", 
                text: 'Bitte verwenden Sie eine @sunrise.net E-Mail-Adresse', 
                duration: 0 
            });
            setLoading(false);
            return;
        }

        const endpoint = `${API_BASE}/auth/login`;
        console.log('🔵 Frontend: Sending request to:', endpoint);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    email,
                    password,
                    preferredMethod: loginMode
                }),
            });

            console.log('🔵 Frontend: Response status:', response.status);
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('❌ Frontend: Server returned non-JSON response:', text.substring(0, 200));
                throw new Error('Server returned non-JSON response');
            }
            
            const data = await response.json();
            console.log('🔵 Frontend: Response data:', { 
                success: data.success, 
                hasUser: !!data.user, 
                hasToken: !!data.token 
            });

            if (response.ok && data.success) {
                console.log('✅ Frontend: Login successful!');
                console.log('🔵 Frontend: User data:', data.user);
                
                // Store user data and redirect
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                
                const targetPath = data.user.isAdmin ? '/candidates' : '/events';
                console.log('🔵 Frontend: Redirecting to:', targetPath);
                window.location.href = targetPath;
            } else {
                console.log('❌ Frontend: Login failed:', data.message);
                setMessage({ 
                    type: "error", 
                    text: data.message || 'Login fehlgeschlagen', 
                    duration: 0 
                });
            }
        } catch (err) {
            console.error('❌ Frontend: Login error:', err);
            setMessage({ 
                type: "error", 
                text: 'Verbindung zum Server fehlgeschlagen', 
                duration: 0 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {message && <MessageBanner message={message} />}
            <div className="login-container">
                <h2>Login</h2>
                
                {/* Login Mode Switcher */}
                <div className="login-mode-switcher">
                    <button
                        type="button"
                        className={`mode-button ${loginMode === 'ldap' ? 'active' : ''}`}
                        onClick={() => {
                            if (ldapAvailable) {
                                setLoginMode('ldap');
                                setMessage(null);
                            }
                        }}
                        disabled={checkingLdap || !ldapAvailable}
                        title={!ldapAvailable ? 'LDAP-Server nicht erreichbar' : ''}
                    >
                        🏢 LDAP (Büronetzwerk)
                        {ldapAvailable === false && ' ❌'}
                    </button>
                    <button
                        type="button"
                        className={`mode-button ${loginMode === 'local' ? 'active' : ''}`}
                        onClick={() => {
                            setLoginMode('local');
                            setMessage(null);
                        }}
                        disabled={checkingLdap}
                    >
                        🌐 Lokal (Remote)
                    </button>
                </div>

                {/* Status indicator */}
                {checkingLdap && (
                    <p className="login-status">
                        🔄 Prüfe LDAP-Server Erreichbarkeit...
                    </p>
                )}

                {/* Login description */}
                <p className="login-description">
                    {loginMode === 'ldap' 
                        ? 'Melden Sie sich mit Ihrer Sunrise E-Mail und LDAP-Passwort an (nur im DAL-Büronetzwerk verfügbar).'
                        : 'Melden Sie sich mit Ihrer Sunrise E-Mail und lokalem Passwort an (funktioniert überall).'}
                </p>

                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="email"
                        id="email"
                        value={email}
                        placeholder="E-Mail (@sunrise.net)"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={checkingLdap || loading}
                    />
                    <input
                        type="password"
                        id="password"
                        value={password}
                        placeholder={
                            loginMode === 'ldap' 
                                ? 'LDAP-Passwort' 
                                : 'Lokales Passwort'
                        }
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={checkingLdap || loading}
                    />
                    <button 
                        type="submit" 
                        disabled={checkingLdap || loading} 
                        className="submit-button"
                    >
                        {checkingLdap 
                            ? 'Initialisiere...' 
                            : loading 
                            ? 'Einloggen...' 
                            : 'Einloggen'}
                    </button>
                </form>

                {/* Info message about local login */}
                {loginMode === 'local' && !checkingLdap && (
                    <div className="login-info">
                        <p>
                            💡 <strong>Hinweis:</strong> Lokale Benutzer müssen vom Administrator erstellt werden. 
                            LDAP-Benutzer werden beim ersten Login automatisch angelegt.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;