import type { RouteObject } from 'react-router-dom';
import AppLayout from '@/components/layouts/AppLayout';
import Home from '@/pages/Home';


const router: RouteObject[] = [
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                path: '/',
                element: <Home />,
            },

        ]
    },


]

export default router;