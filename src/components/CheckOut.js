import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CheckOut = ({ disabled, orderId, cart }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [amount, setAmount] = useState("");
    const [methods, setMethods] = useState([]);
    const [modalDisableBtn, setModalDisableBtn] = useState(true);
    const navigate = useNavigate();

    const openCheckOutModal = async () => {
        setIsOpen(true);
    };

    const closeCheckOutModal = () => {
        setIsOpen(false);
    };

    const fetchPaymentMethods = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/paymentMethods/payment-methods`,
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
                const resultPaymentMethods = result.paymentMethods;
                setMethods(
                    resultPaymentMethods.map((method) => {
                        return (
                            <option key={method._id} value={method._id}>
                                {method.name}
                            </option>
                        );
                    })
                );
            }
        } catch (error) {
            console.log("Error Encountered: " + error);
        }
    };

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    useEffect(() => {
        if (paymentMethod !== "" && amount !== "") {
            setModalDisableBtn(false);
        } else {
            setModalDisableBtn(true);
        }
    }, [paymentMethod, amount]);

    const checkOut = async (event, orderId) => {
        event.preventDefault();
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/payments/add-payment`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({
                        orderId: orderId,
                        amount: amount,
                        paymentMethodId: paymentMethod,
                    }),
                }
            );
            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: "Check out Successfull",
                    icon: "success",
                });
                setAmount("");
                setPaymentMethod("");
                navigate("/");
            } else {
                Swal.fire({
                    title: "Check out Failed.",
                    icon: "error",
                    text: result.message,
                });
            }
        } catch (error) {
            console.log("Error Encountered: " + error);
        }
    };
    return (
        <>
            <Button
                className="btn btn-success w-100"
                disabled={disabled}
                onClick={(event) => {
                    openCheckOutModal();
                }}
            >
                Checkout
                <FontAwesomeIcon
                    icon="fa-solid fa-cart-shopping"
                    className="ms-2"
                />
            </Button>
            <Modal show={isOpen}>
                <Form
                    onSubmit={(event) => {
                        checkOut(event, orderId);
                    }}
                >
                    <Modal.Header className="bg-primary text-white">
                        <Modal.Title className="text-uppercase">
                            Checkout Order
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="stock">
                            <Form.Label>
                                Payment Method
                                <span
                                    className="text-danger ms-2"
                                    style={{
                                        fontSize: "0.8em",
                                    }}
                                >
                                    (REQUIRED*)
                                </span>
                            </Form.Label>

                            <Form.Select
                                required
                                aria-label="Default select example"
                                value={paymentMethod}
                                onChange={(event) => {
                                    setPaymentMethod(event.target.value);
                                }}
                                style={{ boxShadow: "none" }}
                            >
                                <option disabled={true} value={""}>
                                    Select Payment Method
                                </option>
                                {methods}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="price">
                            <Form.Label>
                                Amount
                                <span
                                    className="text-danger ms-2"
                                    style={{
                                        fontSize: "0.8em",
                                    }}
                                >
                                    (REQUIRED*)
                                </span>
                            </Form.Label>

                            <Form.Control
                                type="number"
                                placeholder="Enter amount"
                                required
                                value={amount}
                                onChange={(event) => {
                                    setAmount(event.target.value);
                                }}
                                style={{
                                    boxShadow: "none",
                                }}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                closeCheckOutModal();
                            }}
                        >
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={modalDisableBtn}
                        >
                            CheckOut
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};
export default CheckOut;
