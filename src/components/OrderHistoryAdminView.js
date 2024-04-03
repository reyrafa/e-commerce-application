import { useContext, useEffect, useState } from "react";
import { Accordion, Container, Row } from "react-bootstrap";
import { Puff } from "react-loader-spinner";
import OrderAccordion from "./OrderAccordion";
import UserContext from "../UserContext";
import OrderHistoryAccordionAdmin from "./OrderHistoryAccordionAdmin";

const OrderHistoryAdminView = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);

    const fetchUsers = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/users/fetch-users`,
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
                let users = [];
                resultUser.map((user) => {
                    if (!user.isAdmin) {
                        users.push(user);
                    }
                    return user;
                });
                return users;
            }
        } catch (error) {
            console.log("Error Encountered : " + error);
        }
    };

    const orderHistory = async () => {
        try {
            const users = await fetchUsers();

            setOrders(
                users.map((user) => {
                    return (
                        <OrderHistoryAccordionAdmin
                            user={user}
                            key={user._id}
                        />
                    );
                })
            );
            setLoading(false);
        } catch (error) {
            console.log("Error encountered : " + error);
        }
    };
    useEffect(() => {
        orderHistory();
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
                        <Accordion>{orders}</Accordion>
                    </div>
                </>
            )}
        </>
    );
};

export default OrderHistoryAdminView;
