import { createBrowserRouter, Navigate } from "react-router";
import MainLayout from "../app/layouts/MainLayout";
import SignInPage from "./auth/SignInPage";
import SignUpPage from "./auth/SignUpPage";
import OverviewPage from "./dashboards/OverviewPage";
import Servers from "./dashboards/servers";
import Notifiers from "./dashboards/notifiers";
import DocsPage from "./pages/DocsPage";
import NotFoundPage from "./NotFoundPage"
import { ProtectedRoute } from "./ProtectedRoute";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to='/dashboards/overview' replace />
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
            path: '/',
            element: <MainLayout />,
            children: [
                {
                    path: 'dashboards',
                    children: [
                        { index: true, element: <Navigate to='overview' replace /> },
                        { path: 'overview', element: <OverviewPage /> },
                        { path: 'servers', children: [
                            {
                                index: true,
                                element: <Servers.Main />
                            },
                            {
                                path: 'create',
                                element: <Servers.CreateServer />
                            }
                        ] },
                        { path: 'notifiers', children: [
                            {
                                index: true,
                                element: <Notifiers.Main />
                            },
                            {
                                path: 'create',
                                element: <Notifiers.FormNotifier requestMethod="POST" />
                            },
                            {
                                path: 'change',
                                element: <Notifiers.FormNotifier requestMethod="PUT" />
                            }
                        ] },
                    ]
                },
                {
                    path: 'pages',
                    children: [
                        { index: true, element: <Navigate to='docs' replace /> },
                        { path: 'docs', element: <DocsPage /> }
                    ]
                }
            ]
        }, 
        ]
    },
    {
        element: <ProtectedRoute type="auth" />,
        children: [
            {
                path: 'auth',
                children: [
                    { path: 'signin', element: <SignInPage /> },
                    { path: 'signup', element: <SignUpPage /> },
                ]
            }
        ]
        
    },
    {
        path: '*',
        element: <NotFoundPage />
    }
])

export default router;