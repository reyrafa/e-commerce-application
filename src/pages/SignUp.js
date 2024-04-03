import { useContext, useEffect, useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate, Link, Navigate } from "react-router-dom";
import UserContext from "../UserContext";
import Swal from "sweetalert2";

function SignUp() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    const [passwordError, setPasswordError] = useState("none");
    const [rePasswordError, setRePasswordError] = useState("none");

    useEffect(() => {
        if (
            firstName !== "" &&
            lastName !== "" &&
            mobileNo !== "" &&
            email !== "" &&
            password !== "" &&
            rePassword !== ""
        ) {
            if (password !== rePassword) {
                setRePasswordError("block");
                setIsDisabled(true);
            } else {
                setIsDisabled(false);
                setRePasswordError("none");
                setPasswordError("none");
            }
        } else {
            setIsDisabled(true);
        }
    }, [firstName, lastName, mobileNo, email, password, rePassword]);

    const registerUser = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/users/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        password: password,
                        mobileNumber: mobileNo,
                    }),
                }
            );

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: "Registration Success!",
                    icon: "success",
                    text: result.insert,
                });
                setFirstName("");
                setLastName("");
                setMobileNo("");
                setEmail("");
                setPassword("");
                setRePassword("");
                navigate("/login");
            } else {
                Swal.fire({
                    title: "Failed Registration",
                    icon: "error",
                    text: result.message,
                });
            }
        } catch (error) {
            console.error("Error during registration:", error);
            Swal.fire({
                title: "Failed Registration",
                icon: "error",
                text: "An unexpected error occurred. Please try again later.",
            });
        }
    };
    return (
        <>
        {user.id !== null ?
            <Navigate to={"/"} />
            : 
            <>
      
            <div style={{ background: "#1E344E", overflow: "hidden" }}>
                <Row className="m-3 p-3 m-md-5 p-md-5">
                    <Col className="col-12 col-lg-6 d-flex align-items-center">
                        <div className="text-white text-center">
                            <h1 className="mb-3">
                                Welcome to Our ECommerce Community!
                            </h1>
                            <div
                                className="mb-3"
                                style={{ textAlign: "justify" }}
                            >
                                Create an account to unlock a world of exciting
                                features and seamless shopping experience. Get
                                started on your shopping journey by filling out
                                the registration form. We're thrilled to have
                                you join us!
                            </div>
                        </div>
                    </Col>
                    <Col className="">
                        <Form
                            className="p-4 m-4 bg-white rounded-1"
                            onSubmit={(event) => {
                                registerUser(event);
                            }}
                        >
                            <h2 className="mb-3">Register</h2>

                            <Form.Group className="mb-3">
                                <Form.Label>
                                    First Name
                                    <span
                                        className="text-danger ms-2"
                                        style={{ fontSize: "0.8em" }}
                                    >
                                        (REQUIRED*)
                                    </span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter First Name"
                                    required
                                    style={{
                                        boxShadow: "none",
                                    }}
                                    value={firstName}
                                    onChange={(event) =>
                                        setFirstName(event.target.value)
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Last Name
                                    <span
                                        className="text-danger ms-2"
                                        style={{ fontSize: "0.8em" }}
                                    >
                                        (REQUIRED*)
                                    </span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Last Name"
                                    required
                                    style={{
                                        boxShadow: "none",
                                    }}
                                    value={lastName}
                                    onChange={(event) =>
                                        setLastName(event.target.value)
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Mobile Number
                                    <span
                                        className="text-danger ms-2"
                                        style={{ fontSize: "0.8em" }}
                                    >
                                        (REQUIRED*)
                                    </span>
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter mobile Number"
                                    required
                                    style={{
                                        boxShadow: "none",
                                    }}
                                    value={mobileNo}
                                    onChange={(event) =>
                                        setMobileNo(event.target.value)
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Email Address
                                    <span
                                        className="text-danger ms-2"
                                        style={{ fontSize: "0.8em" }}
                                    >
                                        (REQUIRED*)
                                    </span>
                                </Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    required
                                    style={{
                                        boxShadow: "none",
                                    }}
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Password
                                    <span
                                        className="text-danger ms-2"
                                        style={{ fontSize: "0.8em" }}
                                    >
                                        (REQUIRED*)
                                    </span>
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    required
                                    style={{
                                        boxShadow: "none",
                                    }}
                                    value={password}
                                    onChange={(event) => {
                                        const newPassword = event.target.value;
                                        setPassword(newPassword);
                                        if (newPassword.length < 8) {
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
                                    Password should be at least 8 Character.
                                    Please retry
                                </span>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Retype Password
                                    <span
                                        className="text-danger ms-2"
                                        style={{ fontSize: "0.8em" }}
                                    >
                                        (REQUIRED*)
                                    </span>
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Retype password"
                                    required
                                    style={{
                                        boxShadow: "none",
                                    }}
                                    value={rePassword}
                                    onChange={(event) =>
                                        setRePassword(event.target.value)
                                    }
                                />
                                <span
                                    className="text-danger"
                                    style={{
                                        fontSize: "0.8em",
                                        display: rePasswordError,
                                    }}
                                >
                                    Password doesn't match. Please retry
                                </span>
                            </Form.Group>
                            <div className="d-flex justify-content-between align-items-center mt-4">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={isDisabled}
                                >
                                    REGISTER
                                </Button>
                                <div className=" text-muted">
                                    Already Registered?<Link className="text-decoration-none" to={"/login"}> Login </Link>
                                </div>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </div>
        </>
        }
        </>
    );
}

export default SignUp;
