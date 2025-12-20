import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    handleReset = () => {
        localStorage.clear();
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 text-center">
                    <h1 className="text-4xl font-bold text-red-600 mb-4">Something went wrong.</h1>
                    <p className="text-gray-600 mb-8 max-w-md">
                        The application encountered a critical error. This is often caused by corrupted local data during development.
                    </p>
                    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 text-left mb-8 w-full max-w-2xl overflow-auto max-h-60">
                        <p className="font-mono text-red-500 text-sm font-bold mb-2">{this.state.error?.toString()}</p>
                        <pre className="font-mono text-xs text-gray-500">{this.state.errorInfo?.componentStack}</pre>
                    </div>
                    <button
                        onClick={this.handleReset}
                        className="px-6 py-3 bg-brand-orange text-white font-bold rounded-lg shadow-lg hover:bg-orange-600 transition-colors"
                    >
                        Reset App Data & Reload
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
