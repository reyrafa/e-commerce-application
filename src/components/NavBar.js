import { useContext } from "react";
import {
    Navbar,
    Container,
    Nav,
    Form,
    Row,
    Col,
    Button,
} from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import UserContext from "../UserContext";

function NavBar() {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";
    const isRegisterPage = location.pathname === "/register";
    const isProductPage = location.pathname === "/products";

    const backgroundColor = "";
    return (
        <>
            <Navbar
                expand="lg"
                className=""
                style={{ background: backgroundColor }}
            >
                <Container>
                    <Navbar.Brand
                        className="d-flex align-items-center"
                        as={NavLink}
                        to={"/"}
                    >
                        <img
                            src="https://www.dynamicmarketing.eu/wp-content/uploads/2018/06/ecommerce.logo_-420x280_c.png"
                            alt="eCommerce"
                            className="img-fluid"
                            style={{ width: "70px" }}
                        />
                        {isLoginPage && <h3 className="ms-3">Log In</h3>}
                        {isRegisterPage && <h3 className="ms-3">Sign Up</h3>}
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {!isLoginPage && !isRegisterPage && (
                            <>
                                <Nav className="ms-auto gap-0 gap-lg-3">
                                    <Nav.Link
                                        as={NavLink}
                                        to={"/"}
                                        className={
                                            location.pathname === "/"
                                                ? "bg-success rounded text-white shadow-lg"
                                                : "text-black"
                                        }
                                    >
                                        Home
                                    </Nav.Link>
                                    <Nav.Link
                                        className={
                                            location.pathname === "/products"
                                                ? "bg-success rounded text-white shadow-lg"
                                                : "text-black"
                                        }
                                        as={NavLink}
                                        to={"/products"}
                                    >
                                        Products
                                    </Nav.Link>
                                    {user.id && user.isAdmin && (
                                        <>
                                            <Nav.Link
                                                className={
                                                    location.pathname ===
                                                    "/users"
                                                        ? "bg-success rounded text-white shadow-lg"
                                                        : "text-black"
                                                }
                                                as={NavLink}
                                                to={"/users"}
                                            >
                                                User Management
                                            </Nav.Link>
                                        </>
                                    )}
                                    {user.id && !user.isAdmin && (
                                        <>
                                            <Nav.Link
                                                className={
                                                    location.pathname ===
                                                    "/myCart"
                                                        ? "bg-success rounded text-white shadow-lg"
                                                        : "text-black"
                                                }
                                                as={NavLink}
                                                to={"/myCart"}
                                            >
                                                My Cart
                                            </Nav.Link>
                                        </>
                                    )}
                                    {user.id === null ? (
                                        <>
                                            <Nav.Link
                                                as={NavLink}
                                                to={"/login"}
                                                className="text-black"
                                            >
                                                Login
                                            </Nav.Link>
                                            <Nav.Link
                                                className="text-black"
                                                as={NavLink}
                                                to={"/register"}
                                            >
                                                Sign Up
                                            </Nav.Link>
                                        </>
                                    ) : (
                                        <>
                                            <Nav.Link
                                                className={
                                                    location.pathname ===
                                                    "/orderHistory"
                                                        ? "bg-success rounded text-white shadow-lg"
                                                        : "text-black"
                                                }
                                                as={NavLink}
                                                to={"/orderHistory"}
                                            >
                                                Order History
                                            </Nav.Link>
                                            <Nav.Link
                                                className={
                                                    location.pathname ===
                                                    "/profile"
                                                        ? "bg-success rounded text-white shadow-lg"
                                                        : "text-black"
                                                }
                                                as={NavLink}
                                                to={"/profile"}
                                            >
                                                Profile
                                            </Nav.Link>
                                            <Nav.Link
                                                className="text-black"
                                                as={NavLink}
                                                to={"/logout"}
                                            >
                                                Logout
                                            </Nav.Link>
                                        </>
                                    )}
                                </Nav>
                            </>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default NavBar;
