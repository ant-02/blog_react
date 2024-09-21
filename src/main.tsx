import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router.tsx'
import './index.scss'
import 'normalize.css/normalize.css'


ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
)