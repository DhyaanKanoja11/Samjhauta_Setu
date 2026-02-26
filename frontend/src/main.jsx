import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            background: '#F5F1E7',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            fontFamily: 'sans-serif'
          }}
        >
          <h1 style={{ color: '#2C5F2D' }}>
            नमस्ते, कुछ तकनीकी समस्या आई है
          </h1>

          <p>कृपया पेज को रिफ्रेश करें या बाद में प्रयास करें।</p>

          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              background: '#2C5F2D',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              width: 'fit-content',
              alignSelf: 'center'
            }}
          >
            रिफ्रेश करें
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);  