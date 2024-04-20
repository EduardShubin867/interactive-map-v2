import { useState } from 'react'
import { MDBContainer, MDBBtn, MDBInput } from 'mdb-react-ui-kit'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

import './login.css'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const response = await login({ username, password })
            if (response.success) {
                navigate('/')
            } else {
                setErrorMessage(response.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <HelmetProvider>
            <Helmet>
                <title>Логин | Интерактивная карта</title>
            </Helmet>
            <MDBContainer className="p-3 my-5 d-flex flex-column w-25 rounded-4 shadow-3-strong">
                <h2 className="fw-bold mb-2 text-center">Логин</h2>
                <form onSubmit={handleLogin} autoComplete="on">
                    <MDBInput
                        className="mb-4"
                        type="text"
                        id="username"
                        label="Логин"
                        value={username}
                        autoComplete="username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <MDBInput
                        className="mb-4"
                        type="password"
                        id="password"
                        label="Пароль"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errorMessage && (
                        <div className="d-flex border border-danger rounded text-danger p-1  justify-content-center mb-2">
                            {errorMessage}
                        </div>
                    )}
                    <MDBContainer className="d-flex flex-column align-items-center justify-content-center">
                        <MDBBtn
                            outline
                            color="secondary"
                            type="submit"
                            className="mb-4 mt-2 w-50 mx-auto"
                            block
                        >
                            Войти
                        </MDBBtn>
                    </MDBContainer>
                </form>
            </MDBContainer>
        </HelmetProvider>
    )
}

export default Login
