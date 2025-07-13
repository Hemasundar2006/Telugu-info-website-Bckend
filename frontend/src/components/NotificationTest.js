import React, { useState } from 'react';

const NotificationTest = () => {
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const runTest = async (endpoint, method = 'GET', body = null) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json'
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const options = {
                method,
                headers
            };

            if (body) {
                options.body = JSON.stringify(body);
            }

            const response = await fetch(`http://localhost:4000${endpoint}`, options);
            const data = await response.json();

            setTestResults(prev => [...prev, {
                endpoint,
                method,
                status: response.status,
                success: response.ok,
                data,
                timestamp: new Date().toLocaleTimeString()
            }]);
        } catch (error) {
            setTestResults(prev => [...prev, {
                endpoint,
                method,
                status: 'ERROR',
                success: false,
                data: { error: error.message },
                timestamp: new Date().toLocaleTimeString()
            }]);
        } finally {
            setLoading(false);
        }
    };

    const runAllTests = () => {
        setTestResults([]);
        runTest('/api/test');
        runTest('/api/notification-test');
        runTest('/api/notifications/unread-count');
        runTest('/api/notifications');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Notification API Test</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={runAllTests} 
                    disabled={loading}
                    style={{ 
                        padding: '10px 20px', 
                        marginRight: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {loading ? 'Testing...' : 'Run All Tests'}
                </button>
                
                <button 
                    onClick={() => setTestResults([])}
                    style={{ 
                        padding: '10px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Clear Results
                </button>
            </div>

            <div>
                <h3>Test Results:</h3>
                {testResults.map((result, index) => (
                    <div 
                        key={index} 
                        style={{ 
                            margin: '10px 0', 
                            padding: '15px', 
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            backgroundColor: result.success ? '#d4edda' : '#f8d7da'
                        }}
                    >
                        <div style={{ fontWeight: 'bold' }}>
                            {result.method} {result.endpoint}
                        </div>
                        <div>Status: {result.status}</div>
                        <div>Time: {result.timestamp}</div>
                        <pre style={{ 
                            backgroundColor: '#f8f9fa', 
                            padding: '10px', 
                            borderRadius: '4px',
                            overflow: 'auto',
                            fontSize: '12px'
                        }}>
                            {JSON.stringify(result.data, null, 2)}
                        </pre>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationTest; 