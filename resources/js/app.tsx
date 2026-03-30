import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import '../css/Admin.css';
import '../css/User.css'

import { ThemeProvider } from './Contexts/ThemeContext';

// เพิ่มการ import ตัวจัดการ Route
import { route as ziggyRoute } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // ทำให้ฟังก์ชัน route พร้อมใช้งานทั่วทั้งแอป
        (window as any).route = ziggyRoute;
        root.render(<ThemeProvider><App {...props} /></ThemeProvider>);
    },
    progress: {
        color: '#4B5563',
    },
});
