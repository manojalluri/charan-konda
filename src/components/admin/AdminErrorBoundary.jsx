import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class AdminErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(_) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Admin Panel Error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        // Force a hard reload to clear cache and get fresh assets
        window.location.search = `?t=${Date.now()}`;
        window.location.reload(true);
    };

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.hasError && this.state.hasError) {
            const errorStr = this.state.error?.toString() || "";
            // If it's a chunk loading error (common in Vite deployments), auto-reload once
            if (errorStr.includes("Failed to fetch dynamically imported module") ||
                errorStr.includes("loading chunk") ||
                errorStr.includes("Importing a module script failed")) {

                const lastReload = localStorage.getItem('last-chunk-reload');
                const now = Date.now();

                // Only auto-reload if we haven't reloaded in the last 10 seconds (prevent loops)
                if (!lastReload || (now - parseInt(lastReload)) > 10000) {
                    localStorage.setItem('last-chunk-reload', now.toString());
                    this.handleReset();
                }
            }
        }
    }

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Something Went Wrong
                        </h2>

                        <p className="text-gray-600 mb-6">
                            The admin panel encountered an error. Don't worry, your data is safe.
                        </p>

                        {this.state.error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                                <p className="text-sm font-medium text-red-900 mb-2">Error Details:</p>
                                <p className="text-xs text-red-700 font-mono break-all">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={this.handleReset}
                                className="flex-1 flex items-center justify-center px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                Reset Admin Panel
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="flex-1 flex items-center justify-center px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                <Home className="w-5 h-5 mr-2" />
                                Go Home
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 mt-4">
                            If this problem persists, please contact support.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default AdminErrorBoundary;
