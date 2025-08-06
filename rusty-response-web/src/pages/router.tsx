import { createBrowserRouter, Navigate } from "react-router";
import MainLayout from "../app/layouts/MainLayout";
import SignInPage from "./SignInPage";
import SignUpPage from "./SignUpPage";
import OverviewPage from "./dashboards/OverviewPage";
import ServersPage from "./dashboards/ServersPage";
import NotifiersPage from "./dashboards/NotifiersPage";
import DocsPage from "./pages/DocsPage";
import NotFoundPage from "./NotFoundPage"

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to='/dashboards/overview' replace />
    },
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: 'dashboards',
                children: [
                    {
                        index: true,
                        element: <Navigate to='overview' replace />
                    },
                    {
                        path: 'overview',
                        element: <OverviewPage />
                    },
                    {
                        path: 'servers',
                        element: <ServersPage />
                    },
                    {
                        path: 'notifiers',
                        element: <NotifiersPage />
                    }
                ]
            },
            {
                path: 'pages',
                children: [
                    {
                        index: true,
                        element: <Navigate to='docs' replace />
                    },
                    {
                        path: 'docs',
                        element: <DocsPage />
                    }
                ]
            }
        ]
    }, 
    {
        path: 'signin',
        element: <SignInPage />
    },
    {
        path: 'signup',
        element: <SignUpPage />
    },
    {
        path: '*',
        element: <NotFoundPage />
    }
])

export default router;