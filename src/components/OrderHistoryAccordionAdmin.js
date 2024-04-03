import { Accordion } from "react-bootstrap";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import OrderItem from "./OrderItem";
const OrderHistoryAccordionAdmin = ({ user }) => {
    const [orderItems, setOrderItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const fetchOrder = async (user) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/users/orders`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({
                        userId: user._id,
                    }),
                }
            );
            const result = await response.json();
            if (response.ok) {
                const resultUserOrder = result.userOrder;
                setOrders(
                    resultUserOrder.map((userOrder) => {
                        return (
                            <div key={userOrder._id}>
                                <div
                                    style={{ fontSize: "0.9em" }}
                                    className="mb-2"
                                >
                                    Purchased on
                                    <span className="ms-2">
                                        {format(
                                            new Date(userOrder.orderDate),
                                            "MMM d, yyy"
                                        )}
                                    </span>
                                    :
                                </div>
                                <OrderItem orderId={userOrder._id} />
                                <div>
                                    Total:
                                    <span
                                        className="ms-2"
                                        style={{ color: "orange" }}
                                    >
                                        &#x20B1;
                                    </span>
                                    <span
                                        className="ms-1"
                                        style={{ color: "orange" }}
                                    >
                                        {userOrder.totalAmount.toLocaleString()}
                                        .00
                                    </span>
                                </div>
                                <hr />
                            </div>
                        );
                    })
                );
            }
        } catch (error) {
            console.log("Error encountered: " + error);
        }
    };
    useEffect(() => {
        fetchOrder(user);
    }, []);
    return (
        <Accordion.Item eventKey={user._id} key={user._id}>
            <Accordion.Header>
                Orders for user
                <span className="ms-2" style={{ color: "red" }}>
                    {user.email}
                </span>
            </Accordion.Header>
            <Accordion.Body>
                {orders.length === 0 ? (
                    <div className="text-center text-muted">
                        Not yet place an Order.
                    </div>
                ) : (
                    orders
                )}
            </Accordion.Body>
        </Accordion.Item>
    );
};

export default OrderHistoryAccordionAdmin;
