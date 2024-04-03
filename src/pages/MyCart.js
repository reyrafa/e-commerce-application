import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import { InfinitySpin } from "react-loader-spinner";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import UserContext from "../UserContext.js";
import CheckOut from "../components/CheckOut.js";
const MyCart = () => {
    const [orderItem, setOrderItem] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);
    const [total, setTotal] = useState("");
    const [disabled, setDisable] = useState(true);
    const [orderId, setOrderId] = useState("");

    const cart = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/orders/pending-orders`,
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
                const product = result.Cart;
                const order = result.order;
                const resultItem = product.map((item) => {
                    return item.item;
                });
                setOrderId(order._id);
                setTotal(order.totalAmount);

                setOrderItem(
                    resultItem.map((item) => {
                        let minusOrAddQuantity = 0;
                        return (
                            <tr key={item.orderItem._id}>
                                <td>
                                    <Link
                                        to={`/viewProduct/${item.associatedProduct._id}`}
                                        className="text-decoration-none text-uppercase"
                                    >
                                        {item.associatedProduct.name}
                                    </Link>
                                </td>
                                <td>
                                    &#x20B1;
                                    <span className="ms-1">
                                        {item.associatedProduct.price.toLocaleString()}
                                        .00
                                    </span>
                                </td>
                                <td className="d-flex">
                                    <Button
                                        className="rounded-0 btn btn-dark"
                                        onClick={(event) => {
                                            minusOrAddQuantity = -1;
                                            updateOrderQuantity(
                                                event,
                                                item.orderItem._id,
                                                minusOrAddQuantity
                                            );
                                        }}
                                    >
                                        <FontAwesomeIcon icon="fa-solid fa-minus" />
                                    </Button>
                                    <Form.Control
                                        type="number"
                                        required
                                        disabled={true}
                                        value={item.orderItem.quantity}
                                        className="rounded-0"
                                        style={{
                                            boxShadow: "none",
                                            width: "100px",
                                        }}
                                    />
                                    <Button
                                        className="rounded-0 btn btn-dark"
                                        onClick={(event) => {
                                            minusOrAddQuantity = 1;
                                            updateOrderQuantity(
                                                event,
                                                item.orderItem._id,
                                                minusOrAddQuantity
                                            );
                                        }}
                                    >
                                        <FontAwesomeIcon icon="fa-solid fa-plus" />
                                    </Button>
                                </td>

                                <td>
                                    &#x20B1;
                                    <span className="ms-1">
                                        {item.orderItem.subTotal.toLocaleString()}
                                        .00
                                    </span>
                                </td>
                                <td className="text-center">
                                    <Button
                                        className="btn btn-danger"
                                        onClick={(event) => {
                                            removeOrderItem(
                                                event,
                                                item.orderItem._id
                                            );
                                        }}
                                    >
                                        Remove
                                        <FontAwesomeIcon
                                            icon="fa-solid fa-trash"
                                            className="ms-2"
                                        />
                                    </Button>
                                </td>
                            </tr>
                        );
                    })
                );
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.log("Error Encountered" + error);
        }
    };

    const fetchOrderItem = async (orderItemId) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/orders/fetch-order-item/${orderItemId}`,
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
                return result.orderItem;
            }
        } catch (error) {
            console.log("Error encountered " + error);
        }
    };

    const updateOrderQuantity = async (
        event,
        orderItemId,
        minusOrAddQuantity
    ) => {
        event.preventDefault();
        try {
            const orderItem = await fetchOrderItem(orderItemId);

            let newQuantity =
                minusOrAddQuantity === 1
                    ? orderItem.quantity + 1
                    : orderItem.quantity - 1;

            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/orders/update-order-product-quantity`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({
                        orderId: orderItem.orderID,
                        productId: orderItem.productID,
                        orderItemId: orderItem._id,
                        quantity: newQuantity,
                    }),
                }
            );
            const result = await response.json();
            console.log(result);
            if (response.ok) {
                cart();
            } else {
                Swal.fire({
                    title: "Update Quantity failed",
                    icon: "error",
                    text: result.message,
                });
            }
        } catch (error) {
            console.log("Error Encountered : " + error);
        }
    };

    const removeOrderItem = async (event, orderItemId) => {
        event.preventDefault();
        try {
            const orderItem = await fetchOrderItem(orderItemId);
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/orders/remove-product-from-cart`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({
                        orderId: orderItem.orderID,
                        productId: orderItem.productID,
                        orderItemId: orderItem._id,
                    }),
                }
            );
            const result = await response.json();
            if (response.ok) {
                Swal.fire({
                    title: "Order Item Successfully remove!",
                    icon: "success",
                });
                cart();
            } else {
                Swal.fire({
                    title: "Order Item Removal Failed. Please Try again",
                    icon: "error",
                    text: result.message,
                });
            }
        } catch (error) {
            console.log("Error Encountered : " + error);
        }
    };

    useEffect(() => {
        cart();
    }, []);

    useEffect(() => {
        if (orderItem.length === 0) {
            setDisable(true);
        } else {
            setDisable(false);
        }
    }, [orderItem]);
    return !user.isAdmin ? (
        <div
            style={{ background: "#1E344E", overflow: "hidden" }}
            className="p-4"
        >
            <Container className="pb-4 vh-100 text-white">
                <Row className="mt-4">
                    <Col>
                        <h1>My Cart</h1>
                        <div className="p-3 bg-white shadow rounded mt-3">
                            <Table striped bordered hover responsive>
                                <thead
                                    className="text-center text-uppercase text-white"
                                    style={{
                                        fontSize: "0.9em",
                                    }}
                                >
                                    <tr>
                                        <th className="bg-dark text-white border-0">
                                            Product Name
                                        </th>

                                        <th className="bg-dark text-white border-0">
                                            Price
                                        </th>
                                        <th className="bg-dark text-white border-0">
                                            Quantity
                                        </th>

                                        <th className="bg-dark text-white border-0">
                                            Subtotal
                                        </th>
                                        <th className="bg-dark text-white border-0">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan={9}
                                                className="text-center"
                                            >
                                                <InfinitySpin
                                                    visible={true}
                                                    width="200"
                                                    color="#4fa94d"
                                                    ariaLabel="infinity-spin-loading"
                                                />
                                            </td>
                                        </tr>
                                    ) : orderItem.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={9}
                                                className="text-center"
                                            >
                                                No Order Yet
                                            </td>
                                        </tr>
                                    ) : (
                                        orderItem
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={4} className="p-3">
                                            <CheckOut
                                                disabled={disabled}
                                                orderId={orderId}
                                                cart={cart}
                                            />
                                        </td>
                                        <td
                                            className="text-center fw-bold"
                                            style={{ fontSize: "1.2em" }}
                                        >
                                            Total:
                                            <span className="ms-2 me-1">
                                                &#x20B1;
                                            </span>
                                            {total.toLocaleString()}.00
                                        </td>
                                    </tr>
                                </tfoot>
                            </Table>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    ) : (
        <Navigate to={"/login"} />
    );
};

export default MyCart;
