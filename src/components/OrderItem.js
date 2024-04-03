import { useEffect, useState } from "react";

const OrderItem = ({ orderId }) => {
    const [orderItems, setOrderItems] = useState([]);

    const fetchOrderItem = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/orders/order-items/${orderId}`,
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
                            <li key={orderlist._id} className="mb-2">
                                <span className="text-primary">{orderlist.productID.name}</span> - Quantity -
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
    return <ul>{orderItems}</ul>;
};

export default OrderItem;
