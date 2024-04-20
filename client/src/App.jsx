import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'

import store from './app/store'
import Root from './routes/root'
import ErrorPage from './error-page'
import KrasnoeBedstvie from './pages/KrasnoeBedstvie'
import Vzvod from './pages/Vzvod'
import Login from './components/Login/Login'
import { AuthProvider } from './context/AuthContext'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './index.css'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'krasnoe-bedstvie',
                element: <KrasnoeBedstvie />,
            },
            {
                path: 'vzvod',
                element: <Vzvod />,
            },
            {
                path: 'login',
                element: <Login />,
            },
        ],
    },
])

function App() {
    return (
        <Provider store={store}>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </Provider>
    )
}

export default App
