import { Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
const ProductCard = ({ product }) => {
    const { _id, name, model, color, price, stock, images } =
        product;
    return (
        <Col className="col-12 col-lg-3 mb-4">
            <Card className="h-100 d-flex flex-column text-center">
                <Card.Header>
                    <Card.Img
                        variant="top"
                        src={images}
                        style={{ width: "100px" }}
                        className="img-fluid mx-auto"
                    />
                </Card.Header>

                <Card.Body>
                    <Card.Title
                        style={{ fontSize: "0.9em" }}
                        className="text-uppercase fw-bold"
                    >
                        {name} ( {model} - {color} )
                    </Card.Title>

                    <Card.Subtitle className="text-secondary">
                        <span
                            className={
                                stock === 0 ? "text-danger fw-bold" : "text-secondary"
                            }
                            style={{ fontSize: "0.8em" }}
                        >
                            Stock: {stock}
                        </span>

                        <span
                            style={{
                                borderLeft: "2px solid #ccc",
                                margin: "0 10px",
                            }}
                        ></span>
                        <span style={{ fontSize: "0.8em" }}>
                            Price: PHP {price.toLocaleString()}.00
                        </span>
                    </Card.Subtitle>
                </Card.Body>
                <Card.Footer>
                    <Link
                        className="btn btn-primary w-100"
                        to={`/viewProduct/${_id}`}
                    >
                        Details
                    </Link>
                </Card.Footer>
            </Card>
        </Col>
    );
};

export default ProductCard;
