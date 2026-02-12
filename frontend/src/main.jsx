import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n';

// Simple Error Boundary for fail-safe rendering
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, errorInfo) {
        console.error("App Crash:", error, errorInfo);
        this.setState({ error, errorInfo });
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', textAlign: 'center', background: '#F5F1E7', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontFamily: 'sans-serif' }}>
                    <h1 style={{ color: '#2C5F2D' }}>नमस्ते, कुछ तकनीकी समस्या आई है</h1>
                    <p>कृपया पेज को रिफ्रेश करें या कुछ देर बाद प्रयास करें।</p>
                    <div style={{ margin: '20px auto', padding: '15px', background: 'rgba(255,0,0,0.05)', borderRadius: '12px', textAlign: 'left', maxWidth: '600px', overflow: 'auto', border: '1px solid rgba(255,0,0,0.1)' }}>
                        <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {this.state.error?.message}</p>
                        <pre style={{ fontSize: '10px', color: '#666' }}>{this.state.error?.stack}</pre>
                    </div>
                    <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', background: '#2C5F2D', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: 'fit-content', alignSelf: 'center' }}>
                        रिफ्रेश करें
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

try {
    ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </React.StrictMode>
    );
} catch (e) {
    console.error("Critical Render Error:", e);
}
