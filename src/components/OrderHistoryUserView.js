import { useEffect, useState } from "react";
import { Accordion, Container, Row } from "react-bootstrap";
import OrderAccordion from "./OrderAccordion";
import { Puff } from "react-loader-spinner";

const OrderHistoryUserView = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchOrderStatus = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/orderStatus/fetch-orderStatus`,
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
            return result;
        } catch (error) {
            console.log("Error encountered: " + error);
        }
    };

    const fetchOrderHistory = async () => {
        try {
            const orderStatus = await fetchOrderStatus();
            const orderStat = orderStatus.orderStatus;
            let processingStatus = [];
            orderStat.map((order) => {
                if (order.name === "Processing") {
                    processingStatus.push(order);
                }
                return processingStatus;
            });
            const orderStatusId = processingStatus[0]._id;

            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/orders/order-history/${orderStatusId}`,
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
                const resultOrder = result.order;
                let count = 0;
                setOrders(
                    resultOrder.map((resultOrder) => {
                        return (
                            <OrderAccordion
                                order={resultOrder}
                                key={resultOrder._id}
                                count={++count}
                            />
                        );
                    })
                );
                setLoading(false);
            }
        } catch (error) {
            console.log("Error Encounterd : " + error);
        }
    };
    useEffect(() => {
        fetchOrderHistory();
    }, []);

    return (
        <>
            {loading ? (
                <Container className=" vh-100 d-flex justify-content-center align-items-center">
                    <Row>
                        <Puff
                            visible={true}
                            height="80"
                            width="80"
                            color="white"
                            ariaLabel="triangle-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    </Row>
                </Container>
            ) : (
                <>
                    <h2>Order History</h2>
                    <div className="mt-3">
                        <Accordion>
                            {orders.length === 0 ? (
                                <div className="text-center">
                                    Not Place an Order Yet.
                                </div>
                            ) : (
                                orders
                            )}
                        </Accordion>
                    </div>
                </>
            )}
        </>
    );
};
export default OrderHistoryUserView;
