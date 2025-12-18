import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [debugInfo, setDebugInfo] = useState('');

    // Add debug info on component mount
    useEffect(() => {
        console.log('Login component mounted');
        console.log('Current URL:', window.location.href);
        console.log('CSRF Token:', document.querySelector('meta[name="csrf-token"]')?.content);

        // Test direct fetch
        fetch('/admin/login', {
            method: 'GET',
            headers: {
                'Accept': 'text/html',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then(response => {
            console.log('GET login page status:', response.status);
            setDebugInfo(`GET Status: ${response.status}, OK: ${response.ok}`);
        }).catch(error => {
            console.error('GET error:', error);
            setDebugInfo(`GET Error: ${error.message}`);
        });
    }, []);

    const submit = (e) => {
        e.preventDefault();

        console.log('Login form submitted');
        console.log('Form data:', data);

        if (isSubmitting) return;
        setIsSubmitting(true);

        // Add debug before sending
        console.log('Sending login request...');
        console.log('Form data:', JSON.stringify(data, null, 2));

        post('/admin/login', {
            preserveScroll: true,
            onStart: () => {
                console.log('Request started...');
            },
            onSuccess: (page) => {
                console.log('Login successful! Page:', page);
                console.log('URL:', window.location.href);
                // Check if redirected
                if (window.location.href.includes('/dashboard')) {
                    console.log('Successfully redirected to dashboard');
                }
            },
            onError: (errors) => {
                console.error('Login errors:', errors);
                reset('password');
                setIsSubmitting(false);
            },
            onFinish: () => {
                console.log('Login request finished');
                setIsSubmitting(false);
            },
        });
    };

    return (
        <>
            <Head title="Admin Login" />
            
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8 p-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Admin Login
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Balai Bahasa Provinsi Sulawesi Tenggara
                        </p>
                        {debugInfo && (
                            <div className="mt-2 text-xs text-gray-500 text-center">
                                Debug: {debugInfo}
                            </div>
                        )}
                    </div>
                    
                    <form className="mt-8 space-y-6" onSubmit={submit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                                    required
                                    autoComplete="email"
                                    autoFocus
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                                    required
                                    autoComplete="current-password"
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing || isSubmitting}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {(processing || isSubmitting) ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memproses...
                                    </span>
                                ) : 'Login'}
                            </button>
                        </div>
                    </form>
                    
                    <div className="text-center text-xs text-gray-500 mt-4">
                        <p>Default: superadmin@balaibahasa.go.id / password</p>
                    </div>
                </div>
            </div>
        </>
    );
}
