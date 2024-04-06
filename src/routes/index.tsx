import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import AppLayout from '@/components/layouts/AppLayout';
import Event from '@/pages/Event';
import Home from '@/pages/Home';



const router: RouteObject[] = [
    {
        path: '/',
        element: <Navigate to='home' />,
    },
    {
        element: <AppLayout />,
        children: [
            {
                path: '/home',
                element: <Home />,
            },
            {
                path: '/event/:event',
                element: <Event />,
            }
        ]
    },
]

export default router;