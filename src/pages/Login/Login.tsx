import { useState } from "react";
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
    const [loginMode, setLoginMode] = useState<'ldap' | 'local'>('ldap');
    const [isRegistering, setIsRegistering] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        console.log('🔵 Frontend: Login attempt:', { email, loginMode, isRegistering });

        // Validate registration
        if (isRegistering && loginMode === 'local') {
            if (password !== confirmPassword) {
                console.log('❌ Frontend: Passwords do not match');
                setMessage({ type: "error", text: 'Passwörter stimmen nicht überein', duration: 0 });
                setLoading(false);
                return;
            }
            if (password.length < 8) {
                console.log('❌ Frontend: Password too short');
                setMessage({ type: "error", text: 'Passwort muss mindestens 8 Zeichen lang sein', duration: 0 });
                setLoading(false);
                return;
            }
        }

        const endpoint = isRegistering && loginMode === 'local' 
            ? `${API_BASE}/auth/register` 
            : `${API_BASE}/auth/login`;

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
            console.log('🔵 Frontend: Response ok:', response.ok);
            
            // Check if response has content
            const contentType = response.headers.get('content-type');
            console.log('🔵 Frontend: Content-Type:', contentType);
            
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('❌ Frontend: Server returned non-JSON response:', text.substring(0, 200));
                throw new Error('Server returned non-JSON response');
            }
            
            const text = await response.text();
            console.log('🔵 Frontend: Response text length:', text.length);
            
            if (!text) {
                console.error('❌ Frontend: Empty response from server');
                throw new Error('Empty response from server');
            }
            
            const data = JSON.parse(text);
            console.log('🔵 Frontend: Response data:', { 
                success: data.success, 
                hasUser: !!data.user, 
                hasToken: !!data.token 
            });

            if (response.ok && data.success) {
                console.log('✅ Frontend: Login/Registration successful!');
                console.log('🔵 Frontend: User data:', data.user);
                
                if (isRegistering) {
                    setMessage({ type: "success", text: 'Registrierung erfolgreich! Sie werden eingeloggt...', duration: 3000 });
                    console.log('🔵 Frontend: Waiting 1.5s before redirect...');
                    setTimeout(() => {
                        localStorage.setItem('user', JSON.stringify(data.user));
                        const targetPath = data.user.isAdmin ? '/candidates' : '/events';
                        console.log('🔵 Frontend: Redirecting to:', targetPath);
                        window.location.href = targetPath;
                    }, 1500);
                } else {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    const targetPath = data.user.isAdmin ? '/candidates' : '/events';
                    console.log('🔵 Frontend: Redirecting to:', targetPath);
                    window.location.href = targetPath;
                }
            } else {
                console.log('❌ Frontend: Login/Registration failed:', data.message);
                setMessage({ type: "error", text: data.message || 'Login fehlgeschlagen', duration: 0 });
            }
        } catch (err) {
            console.error('❌ Frontend: Login error:', err);
            console.error('❌ Frontend: Error details:', {
                name: err instanceof Error ? err.name : 'Unknown',
                message: err instanceof Error ? err.message : String(err)
            });
            setMessage({ type: "error", text: 'Verbindung zum Server fehlgeschlagen', duration: 0 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {message && <MessageBanner message={message} />}
            <div className="login-container">
                <h2>{isRegistering ? 'Registrierung' : 'Login'}</h2>
                
                {/* Login Mode Switcher */}
                <div className="login-mode-switcher">
                    <button
                        type="button"
                        className={`mode-button ${loginMode === 'ldap' ? 'active' : ''}`}
                        onClick={() => {
                            setLoginMode('ldap');
                            setIsRegistering(false); // LDAP doesn't support registration
                            setMessage(null);
                        }}
                    >
                        🏢 LDAP (Nur im Office)
                    </button>
                    <button
                        type="button"
                        className={`mode-button ${loginMode === 'local' ? 'active' : ''}`}
                        onClick={() => {
                            setLoginMode('local');
                            setMessage(null);
                        }}
                    >
                        🌐 Lokal (Remote)
                    </button>
                </div>

                <p className="login-description">
                    {loginMode === 'ldap' 
                        ? 'Logge dich mit deiner Sunrise E-Mail und Passwort ein (nur im Büronetzwerk verfügbar).'
                        : isRegistering
                        ? 'Erstellen Sie ein lokales Konto mit Ihrer Sunrise E-Mail.'
                        : 'Logge dich mit deiner Sunrise E-Mail und lokalem Passwort ein (funktioniert überall).'}
                </p>

                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="email"
                        id="email"
                        value={email}
                        placeholder="E-Mail (@sunrise.net)"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        id="password"
                        value={password}
                        placeholder={
                            loginMode === 'ldap' 
                                ? 'LDAP-Passwort' 
                                : isRegistering 
                                ? 'Neues Passwort (min. 8 Zeichen)' 
                                : 'Lokales Passwort'
                        }
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {isRegistering && loginMode === 'local' && (
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            placeholder="Passwort bestätigen"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    )}
                    <button type="submit" disabled={loading} className="submit-button">
                        {loading 
                            ? (isRegistering ? 'Registriere...' : 'Einloggen...') 
                            : (isRegistering ? 'Registrieren' : 'Einloggen')}
                    </button>
                </form>

                {loginMode === 'local' && (
                    <div className="auth-switch">
                        <button
                            type="button"
                            className="switch-button"
                            onClick={() => {
                                setIsRegistering(!isRegistering);
                                setMessage(null);
                                setPassword("");
                                setConfirmPassword("");
                            }}
                        >
                            {isRegistering 
                                ? '← Zurück zum Login' 
                                : 'Noch kein Konto? Jetzt registrieren →'}
                        </button>
                    </div>
                )}

                {loginMode === 'local' && !isRegistering && (
                    <div className="login-hint">
                        <p>
                            <strong>Hinweis:</strong> 
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;