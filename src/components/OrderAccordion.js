import { Accordion } from "react-bootstrap";
import { format } from "date-fns";
import { useEffect, useState } from "react";
const OrderAccordion = ({ order, count }) => {
    const [orderItems, setOrderItems] = useState([]);
    const fetchOrderItem = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/orders/order-items/${order._id}`,
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
                const resultOrderList = result.orderLists;
                setOrderItems(
                    resultOrderList.map((orderlist) => {
                        return (
                            <li key={orderlist._id}>
                                {orderlist.productID.name} - Quantity -
                                {orderlist.quantity}
                            </li>
                        );
                    })
                );
            }
        } catch (error) {
            console.log("Error encountered: " + error);
        }
    };
    useEffect(() => {
        fetchOrderItem();
    }, []);
    return (
        <Accordion.Item eventKey={order._id} key={order._id}>
            <Accordion.Header>
                Order #{count} - Purchased on:
                <span className="ms-2">
                    {format(new Date(order.orderDate), "MMM d, yyy")}
                </span>
                <span className="ms-2">(Click for Details)</span>
            </Accordion.Header>
            <Accordion.Body>
                <div>
                    <p>Items:</p>
                    <ul>{orderItems}</ul>
                </div>
                <div>
                    <p>
                        Total:
                        <span className="ms-2" style={{ color: "orange" }}>
                            PHP {order.totalAmount.toLocaleString()}.00
                        </span>
                    </p>
                </div>
            </Accordion.Body>
        </Accordion.Item>
    );
};

export default OrderAccordion;
