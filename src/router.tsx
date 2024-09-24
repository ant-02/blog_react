import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home"
import Classifier from "./pages/Classifier";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/classifier',
        element: <Classifier />
    }
])

export default router