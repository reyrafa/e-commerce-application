import { useContext, useEffect, useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import Swal from "sweetalert2";
import { RotatingLines } from "react-loader-spinner";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [design, setDesign] = useState([]);
    const [passwordError, setPasswordError] = useState("none");
    const [emailError, setEmailError] = useState("none");
    const [message, setMessage] = useState(null);
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        if (email !== "" && password !== "") {
            setDesign({
                cursor: "pointer",
                opacity: 1,
            });
            setEmailError("none");
            setPasswordError("none");
        } else {
            setDesign({
                cursor: "not-allowed",
                opacity: 0.5,
            });
        }
    }, [email, password]);

    const Login = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/users/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                }
            );
            const result = await response.json();

            if (response.ok) {
                setMessage("Logged Success");
                if (result.accessToken) {
                    localStorage.setItem("token", result.accessToken);
                    loggedUser(result.accessToken);
                    Swal.fire({
                        title: "Logged Successfull",
                        icon: "success",
                    });
                    setEmail("");
                }
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            setMessage("An unexpected error occurred. Please try again later.");
        }

        setPassword("");
    };

    const loggedUser = async (accessToken) => {
        const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/users/details`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const result = await response.json();

        if (response.ok) {
            setUser({
                id: result.user._id,
                isAdmin: result.user.isAdmin,
                emailVerified: result.user.emailVerifiedDate,
            });
        }
    };

    return (
        <>
            {user.id !== null ? (
                <Navigate to={"/"} />
            ) : (
                <div style={{ background: "#1E344E", overflow: "hidden" }}>
                    <Row className="m-3 p-3 m-md-5 p-md-5">
                        <Col className="col-12 col-lg-6 d-flex align-items-center">
                            <div className="text-white text-center">
                                <h1 className="mb-3">
                                    Rey Rafael's ECommerce Application
                                </h1>
                                <div
                                    className="mb-3"
                                    style={{ textAlign: "justify" }}
                                >
                                    Embark on a shopping journey like never
                                    before with RR ECommerce – where style meets
                                    simplicity, and every click brings you
                                    closer to affordable luxury!
                                </div>
                            </div>
                        </Col>
                        <Col
                            className={`col-12 col-lg-6 d-flex justify-content-center ${
                                message && "flex-column"
                            } `}
                        >
                            {message && (
                                <div
                                    className={`m-4 p-4 mt-3 alert ${
                                        message.includes("Login Successful")
                                            ? "alert-success"
                                            : "alert-danger"
                                    } w-75`}
                                >
                                    {message}
                                </div>
                            )}

                            <Form
                                className="p-4 m-4 bg-white rounded-1 w-75"
                                onSubmit={(event) => {
                                    Login(event);
                                }}
                            >
                                <h2 className="mb-3">Log In</h2>

                                {/*Form Group for email*/}
                                <Form.Group
                                    className="mb-3"
                                    controlId="loginEmail"
                                >
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        required
                                        value={email}
                                        onChange={(event) => {
                                            setEmail(event.target.value);
                                            if (event.target.value === "") {
                                                setEmailError("block");
                                            } else {
                                                setEmailError("none");
                                            }
                                        }}
                                        style={{
                                            boxShadow: "none",
                                        }}
                                    />
                                    <span
                                        className="text-danger"
                                        style={{
                                            fontSize: "0.8em",
                                            display: emailError,
                                        }}
                                    >
                                        Please Enter your Email*
                                    </span>
                                </Form.Group>

                                {/*FormGroup for password*/}
                                <Form.Group
                                    className="mb-3"
                                    controlId="loginPassword"
                                >
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        required
                                        value={password}
                                        style={{ boxShadow: "none" }}
                                        onChange={(event) => {
                                            setPassword(event.target.value);
                                            if (event.target.value === "") {
                                                setPasswordError("block");
                                            } else {
                                                setPasswordError("none");
                                            }
                                        }}
                                    />
                                    <span
                                        className="text-danger"
                                        style={{
                                            fontSize: "0.8em",
                                            display: passwordError,
                                        }}
                                    >
                                        Please Enter your Password*
                                    </span>
                                </Form.Group>
                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        style={{
                                            cursor: design.cursor,
                                            opacity: design.opacity,
                                        }}
                                    >
                                        LOG IN
                                    </Button>

                                    <Link className=" text-decoration-none">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="d-flex justify-content-center mt-4 text-secondary">
                                    <p>No Account Yet?</p>
                                    <Link
                                        className="text-decoration-none text-success ms-1"
                                        to={"/register"}
                                    >
                                        SIGN UP
                                    </Link>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </div>
            )}
        </>
    );
}

export default Login;
