import { useContext } from "react";
import UserContext from "../UserContext";
import { Container, Row, Col } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import OrderHistoryUserView from "../components/OrderHistoryUserView";

import OrderHistoryAdminView from "../components/OrderHistoryAdminView";

const OrderHistory = () => {
    const { user } = useContext(UserContext);

    return (
        <div
            style={{ background: "#1E344E", overflow: "hidden" }}
            className="p-4"
        >
            {user.id !== null ? (
                <Container className="pb-4 text-white">
                    <Row>
                        <Col>
                            {user.isAdmin ? (
                                <OrderHistoryAdminView />
                            ) : (
                                <OrderHistoryUserView />
                            )}
                        </Col>
                    </Row>
                </Container>
            ) : (
                <Navigate to={"/login"} />
            )}
        </div>
    );
};

export default OrderHistory;
