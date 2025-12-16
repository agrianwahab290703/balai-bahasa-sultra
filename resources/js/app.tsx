import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

createInertiaApp({
    resolve: (name) => {
        const tsxPages = import.meta.glob(['./Pages/**/*.tsx', '!**/*.test.tsx', '!**/*.spec.tsx'], { eager: true });
        const jsxPages = import.meta.glob(['./Pages/**/*.jsx'], { eager: true });
        
        // Try .tsx first, then .jsx
        return tsxPages[`./Pages/${name}.tsx`] || jsxPages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <React.StrictMode>
                <App {...props} />
            </React.StrictMode>
        );
    },
});
