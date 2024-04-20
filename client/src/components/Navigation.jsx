import { useState } from 'react'
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom'
import {
    MDBTypography,
    MDBContainer,
    MDBCollapse,
    MDBNavbarToggler,
    MDBNavbarItem,
    MDBNavbarNav,
    MDBIcon,
    MDBNavbar,
    MDBNavbarBrand,
    MDBBtn,
} from 'mdb-react-ui-kit'
import { Helmet, HelmetProvider } from 'react-helmet-async'

import { useAuth } from '../context/AuthContext'

const Navigation = () => {
    const [openNav, setOpenNav] = useState(false)
    const { isAdmin, logout } = useAuth()

    return (
        <HelmetProvider>
            <div style={{ height: '100vh' }}>
                {useLocation().pathname === '/' ? (
                    <MDBContainer
                        className="d-flex align-items-center justify-content-center"
                        style={{ height: '100%' }}
                    >
                        <Helmet>
                            <title>
                                Главная страница | Интерактивная карта
                            </title>
                        </Helmet>

                        <NavLink
                            to="/krasnoe-bedstvie"
                            className="nav-link hover-shadow nav-card "
                        >
                            <div className="bg-image">
                                <img
                                    src="/assets/images/bedstvie.jpg"
                                    className="img-fluid"
                                    alt="Красное бедствие"
                                />
                                <div className="mask custom-mask">
                                    <div className="d-flex justify-content-center align-items-center h-100">
                                        <MDBTypography
                                            tag="h3"
                                            className="text-center m-2 text-white "
                                        >
                                            Красное бедствие
                                        </MDBTypography>
                                    </div>
                                </div>
                            </div>
                        </NavLink>
                    </MDBContainer>
                ) : (
                    <div>
                        <MDBNavbar expand="lg" light bgColor="light">
                            <MDBContainer fluid>
                                <MDBNavbarBrand tag={Link} to="/">
                                    <i className="fas fa-house"></i>
                                </MDBNavbarBrand>
                                <MDBNavbarToggler
                                    type="button"
                                    aria-expanded="false"
                                    aria-label="Toggle navigation"
                                    onClick={() => setOpenNav(!openNav)}
                                >
                                    <MDBIcon icon="bars" fas />
                                </MDBNavbarToggler>
                                <MDBCollapse
                                    navbar
                                    open={openNav}
                                    className="me-auto mb-2 mb-lg-0"
                                >
                                    <MDBNavbarNav>
                                        <MDBNavbarItem>
                                            <NavLink
                                                to="/krasnoe-bedstvie"
                                                className="nav-link"
                                            >
                                                Красное бедствие
                                            </NavLink>
                                        </MDBNavbarItem>
                                    </MDBNavbarNav>
                                    {isAdmin && (
                                        <MDBContainer
                                            fluid
                                            className="d-flex w-auto pe-0"
                                        >
                                            <MDBBtn
                                                color="danger"
                                                size="sm"
                                                onClick={logout}
                                            >
                                                Выйти
                                            </MDBBtn>
                                        </MDBContainer>
                                    )}
                                </MDBCollapse>
                            </MDBContainer>
                        </MDBNavbar>
                        <Outlet />
                    </div>
                )}
            </div>
        </HelmetProvider>
    )
}

export default Navigation
