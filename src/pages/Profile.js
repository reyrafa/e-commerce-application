import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import UserContext from "../UserContext";
import Swal from "sweetalert2";

const Profile = () => {
    const { user } = useContext(UserContext);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pwdBtnDisable, setpwdBtnDisable] = useState(true);
    const [disabled, setDisabled] = useState(true);
    const [passError, setPassError] = useState("none");
    useEffect(() => {
        if (
            firstName !== "" &&
            lastName !== "" &&
            email !== "" &&
            mobileNumber !== ""
        ) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [firstName, lastName, email, mobileNumber]);

    useEffect(() => {
        fetchDetails();
    }, []);

    useEffect(() => {
        if (newPassword !== "" && confirmPassword !== "") {
            setpwdBtnDisable(false);
        } else {
            setpwdBtnDisable(true);
        }
    }, [confirmPassword, newPassword]);

    const fetchDetails = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/users/details`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            const result = await response.json();

            if (response.ok) {
                const resultUser = result.user;
                setFirstName(resultUser.firstName);
                setLastName(resultUser.lastName);
                setEmail(resultUser.email);
                setMobileNumber(resultUser.mobileNumber);
            }
        } catch (error) {
            console.log("Error encountered : " + error);
        }
    };

    const update = async (event) => {
        const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/users/update-info`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    mobileNumber: mobileNumber,
                    password: newPassword,
                }),
            }
        );

        return response;
    };

    const updateProfile = async (event) => {
        event.preventDefault();
        try {
            const response = await update(event);

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: "Profile Updated Successfully",
                    icon: "success",
                });
                fetchDetails();
            } else {
                Swal.fire({
                    title: "Profile Update Failed",
                    icon: "error",
                    text: result.message,
                });
            }
        } catch (error) {
            console.log("Error Encountered : " + error);
        }
    };

    const updatePassword = async (event) => {
        event.preventDefault();
        try {
            if (newPassword.length < 8) {
                Swal.fire({
                    title: "Update Password Failed",
                    icon: "error",
                    text: "New Password should be at least 8 character",
                });
            } else if (newPassword !== confirmPassword) {
                Swal.fire({
                    title: "Update Password Failed",
                    icon: "error",
                    text: "New Password and Confirm Password should match. Please try again!",
                });
            } else {
                const response = await update(event);
                const result = await response.json();

                if (response.ok) {
                    Swal.fire({
                        title: "Password Updated Successfully",
                        icon: "success",
                    });
                    fetchDetails();
                    setNewPassword("");
                    setConfirmPassword("");
                } else {
                    Swal.fire({
                        title: "Password Update Failed",
                        icon: "error",
                        text: result.message,
                    });
                }
            }
        } catch (error) {
            console.log("Error Encountered : " + error);
        }
    };

    return (
        <div
            style={{ background: "#1E344E", overflow: "hidden" }}
            className="p-4"
        >
            {user.id !== null ? (
                <Container className="pb-4 text-white">
                    <Row className="mt-4">
                        <Col className="col-12 mb-5 text-center">
                            <h2>Profile Management</h2>
                        </Col>
                        <Col className="col-12 col-md-6">
                            <div>Profile Information</div>
                            <p
                                className=""
                                style={{ color: "#E5E5E5", fontSize: "0.8em" }}
                            >
                                Update your account's profile information,
                                mobile number and email address.
                            </p>
                        </Col>
                        <Col className="col-12 col-md-6 text-black">
                            <Form
                                className=" bg-white rounded-1"
                                onSubmit={(event) => {
                                    updateProfile(event);
                                }}
                            >
                                <div className="p-4">
                                    <Form.Group
                                        className="mb-3"
                                        controlId="fname"
                                    >
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter firstName"
                                            required
                                            className=""
                                            style={{ boxShadow: "none" }}
                                            value={firstName}
                                            onChange={(event) => {
                                                setFirstName(
                                                    event.target.value
                                                );
                                            }}
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="lname"
                                    >
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className=""
                                            placeholder="Enter lastName"
                                            required
                                            style={{ boxShadow: "none" }}
                                            value={lastName}
                                            onChange={(event) => {
                                                setLastName(event.target.value);
                                            }}
                                        />
                                    </Form.Group>

                                    <Form.Group
                                        className="mb-3"
                                        controlId="email"
                                    >
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            className=""
                                            placeholder="Enter email"
                                            style={{ boxShadow: "none" }}
                                            value={email}
                                            onChange={(event) => {
                                                setEmail(event.target.value);
                                            }}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group
                                        className="mb-3"
                                        controlId="mobileNo"
                                    >
                                        <Form.Label>mobile Number</Form.Label>
                                        <Form.Control
                                            type="number"
                                            className=""
                                            placeholder="Enter Mobile number"
                                            style={{ boxShadow: "none" }}
                                            value={mobileNumber}
                                            onChange={(event) => {
                                                setMobileNumber(
                                                    event.target.value
                                                );
                                            }}
                                            required
                                        />
                                    </Form.Group>
                                </div>

                                <div
                                    className="d-flex justify-content-end p-3 rounded-bottom-1"
                                    style={{ background: "#EAECEE" }}
                                >
                                    <Button
                                        variant="dark"
                                        type="submit"
                                        disabled={disabled}
                                        style={{
                                            fontSize: "0.8em",
                                            width: "100px",
                                        }}
                                    >
                                        SAVE
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                    <hr className="mt-5 mb-5" />
                    <Row className="">
                        <Col className="col-12 col-md-6">
                            <div>Update Password</div>
                            <p
                                className=""
                                style={{ color: "#E5E5E5", fontSize: "0.8em" }}
                            >
                                To enhance security, ensure that your account
                                employs a resilient password.
                            </p>
                        </Col>
                        <Col className="col-12 col-md-6 text-black">
                            <Form
                                className=" bg-white rounded-1"
                                onSubmit={(event) => {
                                    updatePassword(event);
                                }}
                            >
                                <div className="p-4">
                                    <Form.Group
                                        className="mb-3"
                                        controlId="newPass"
                                    >
                                        <Form.Label>
                                            New Password
                                            <span
                                                className="text-danger ms-2"
                                                style={{ fontSize: "0.8em" }}
                                            >
                                                (REQUIRED*)
                                            </span>
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter new password"
                                            required
                                            className=""
                                            style={{ boxShadow: "none" }}
                                            value={newPassword}
                                            onChange={(event) => {
                                                setNewPassword(
                                                    event.target.value
                                                );
                                            }}
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="confirmPass"
                                    >
                                        <Form.Label>
                                            Confirm Password
                                            <span
                                                className="text-danger ms-2"
                                                style={{ fontSize: "0.8em" }}
                                            >
                                                (REQUIRED*)
                                            </span>
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            className=""
                                            placeholder="Re Enter new password"
                                            required
                                            style={{ boxShadow: "none" }}
                                            value={confirmPassword}
                                            onChange={(event) => {
                                                setConfirmPassword(
                                                    event.target.value
                                                );
                                            }}
                                        />
                                    </Form.Group>
                                </div>

                                <div
                                    className="d-flex justify-content-end p-3 rounded-bottom-1"
                                    style={{ background: "#EAECEE" }}
                                >
                                    <Button
                                        variant="dark"
                                        type="submit"
                                        disabled={pwdBtnDisable}
                                        style={{
                                            fontSize: "0.8em",
                                            width: "100px",
                                        }}
                                    >
                                        SAVE
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            ) : (
                <Navigate to={"/login"} />
            )}
        </div>
    );
};

export default Profile;
