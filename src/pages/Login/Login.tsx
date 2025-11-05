import { useState } from "react";
import { handleAuthResponse, getUserData } from "~/utils/auth";
import MessageBanner from "~/components/MessageBanner/MessageBanner";
import type { Message } from "~/components/MessageBanner/MessageBanner";
import "./Login.scss";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<Message | null>({ type: "info", text: "Diese Login-Seite ist nur ein Platzhalter und funktioniert nicht vollständig.", duration: 0 });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        console.log('🔵 Login attempt:', { email }); // ✅ Debug log

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    email,
                    password 
                }),
            });

            console.log('🔵 Response status:', response.status); // ✅ Debug log
            console.log('🔵 Response ok:', response.ok); // ✅ Debug log

            const data = await response.json();
            console.log('🔵 Response data:', data); // ✅ Debug log

            if (response.ok && data.success) {
                console.log('✅ Login successful!');
                console.log('🔵 User data to store:', data.user); // ✅ Debug log
                
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // ✅ Verify it was stored
                const stored = localStorage.getItem('user');
                console.log('🔵 Stored in localStorage:', stored); // ✅ Debug log
                console.log('🔵 Parsed stored data:', JSON.parse(stored || '{}')); // ✅ Debug log

                const targetPath = data.user.isAdmin ? '/candidates' : '/events';
                console.log('🔵 Navigating to:', targetPath);
                
                // ✅ Use window.location instead of navigate() to force full reload
                window.location.href = targetPath;
            } else {
                console.log('❌ Login failed:', data.message);
                setMessage({ type: "error", text: data.message || 'Login fehlgeschlagen', duration: 0 });
            }
        } catch (err) {
            console.error('❌ Login error:', err);
            setMessage({ type: "error", text: 'Verbindung zum Server fehlgeschlagen', duration: 0 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {message && <MessageBanner message={message} />}
            <div className="login-container">
                <h2>Login</h2>
                <p>Logge dich mit deiner Sunrise E-Mail und Passwort ein.</p>
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="email"
                        id="email"
                        value={email}
                        placeholder="E-Mail"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        id="password"
                        value={password}
                        placeholder="Passwort"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Einloggen...' : 'Einloggen'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;