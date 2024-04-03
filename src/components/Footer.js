import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
function Footer() {
    return (
        <Container className="mt-4 mb-5">
            <Row className="gap-3">
                <Col className="col-md-2">
                    <div>
                        <div className="fw-bold mb-2" style={{ fontSize: ".9em" }}>
                            CUSTOMER SERVICE
                        </div>
                        <div>
                            <Link
                                className="text-decoration-none text-black"
                                style={{ fontSize: ".8em" }}
                                to={"#"}
                            >
                                Help Center
                            </Link>
                        </div>
                        <div>
                            <Link
                                className="text-decoration-none text-black"
                                style={{ fontSize: ".8em" }}
                                to={"#"}
                            >
                                Payment Methods
                            </Link>
                        </div>
                        <div>
                            <Link
                                className="text-decoration-none text-black"
                                style={{ fontSize: ".8em" }}
                                to={"#"}
                            >
                                Free Shipping
                            </Link>
                        </div>
                        <div>
                            <Link
                                className="text-decoration-none text-black"
                                style={{ fontSize: ".8em" }}
                                to={"#"}
                            >
                                Return and Refund
                            </Link>
                        </div>
                        <div>
                            <Link
                                className="text-decoration-none text-black"
                                style={{ fontSize: ".8em" }}
                                to={"#"}
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </Col>
                <Col className="col-md-2">
                    <div>
                        <div className="fw-bold mb-2" style={{ fontSize: ".9em" }}>
                            ABOUT US
                        </div>
                        <div>
                            <Link
                                className="text-decoration-none text-black"
                                style={{ fontSize: ".8em" }}
                                to={"#"}
                            >
                                About
                            </Link>
                        </div>
                        <div>
                            <Link
                                className="text-decoration-none text-black"
                                style={{ fontSize: ".8em" }}
                                to={"#"}
                            >
                                Carreers
                            </Link>
                        </div>
                        <div>
                            <Link
                                className="text-decoration-none text-black"
                                style={{ fontSize: ".8em" }}
                                to={"#"}
                            >
                                Privacy Policy
                            </Link>
                        </div>
                        <div>
                            <Link
                                className="text-decoration-none text-black"
                                style={{ fontSize: ".8em" }}
                                to={"#"}
                            >
                                Policy
                            </Link>
                        </div>
                    </div>
                </Col>
                <Col className="col-12">
                    <hr />
                </Col>

                <Col>
                    <div style={{ fontSize: ".9em" }}>
                        © 2024 ECommerce Application. All Rights Reserved .
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Footer;
