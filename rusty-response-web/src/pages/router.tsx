import { createBrowserRouter } from "react-router";
import MainLayout from "../app/layouts/MainLayout";
import HomePage from "./HomePage/HomePage";
import SignInPage from "./SignInPage/SignInPage";
import SignUpPage from "./SignUpPage/SignUpPage";
import ExamplePage from "./ExamplePage/ExamplePage";

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: 'example',
                element: <ExamplePage />
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
    }
])

export default router;