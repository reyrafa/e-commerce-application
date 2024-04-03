import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import UserContext from "../UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
const ViewProduct = () => {
    const { productId } = useParams();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [model, setModel] = useState("");
    const [color, setColor] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState(0);
    const [image, setImage] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);
    const [quantity, setQuantity] = useState(1);
    const [quantityError, setQuantityError] = useState("none");
    const [disable, setDisable] = useState(false);
    const navigate = useNavigate();

    const retrieveProduct = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/products/fetch-product/${productId}`
            );
            const result = await response.json();
            if (response.ok) {
                setLoading(false);
                const resultProduct = result.product;
                setName(resultProduct.name);
                setDescription(resultProduct.description);
                setModel(resultProduct.model);
                setColor(resultProduct.color);
                setPrice(resultProduct.price);
                setImage(resultProduct.images[0]);
                setStock(resultProduct.stock);
                setCategory(resultProduct.categoryID.name);
                if (resultProduct.stock === 0) {
                    setDisable(true);
                } else {
                    setDisable(false);
                }
            }
        } catch (error) {
            console.log("Error Encountered: " + error);
        }
    };

    const addQuantity = () => {
        if (stock > quantity) {
            setQuantity(quantity + 1);
        } else {
            setQuantityError("block");
            setDisable(true);
        }
    };

    const decreaseQuantity = () => {
        setQuantityError("none");
        setDisable(false);
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    useEffect(() => {
        if (stock === 0) {
            setDisable(true);
        }
    }, [stock]);

    const addToCart = async (event) => {
        event.preventDefault();
        try {
            if (!user.id) {
                navigate("/login");
            } else {
                const response = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL}/orders/add-to-cart`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                        body: JSON.stringify({
                            productId: productId,
                            quantity: quantity,
                        }),
                    }
                );
                const result = await response.json();
                if (response.ok) {
                    Swal.fire({
                        title: "Added To Cart Successfully",
                        icon: "success",
                    });
                    retrieveProduct();
                } else {
                    Swal.fire({
                        title: "Added To Cart Failed",
                        icon: "error",
                        text: result.message,
                    });
                }
            }
        } catch (error) {
            console.log("Error Encountered" + error);
        }
    };
    useEffect(() => {
        retrieveProduct();
    }, []);
    return (
        <div
            style={{ background: "#1E344E", overflow: "hidden" }}
            className="p-4"
        >
            {loading ? (
                <Container className="d-flex justify-content-center align-items-center vh-100">
                    <ThreeDots
                        visible={true}
                        height="80"
                        width="80"
                        color="#4fa94d"
                        radius="9"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                    />
                </Container>
            ) : (
                <Container className="pb-4 vh-100">
                    <Row className="mt-4">
                        <Col className="col-6 mx-auto">
                            <Card className="text-center">
                                <Card.Header>
                                    <Card.Img
                                        variant="top"
                                        src={image}
                                        style={{ width: "200px" }}
                                        className="img-fluid mx-auto"
                                    />
                                </Card.Header>

                                <Card.Body>
                                    <Card.Title className="text-uppercase fw-bold">
                                        {name} ( {model} - {color} )
                                    </Card.Title>
                                    <Card.Subtitle className="text-secondary"></Card.Subtitle>
                                    <Card.Subtitle className="text-secondary">
                                        Stock: {stock}
                                        <span
                                            style={{
                                                borderLeft: "2px solid #ccc",
                                                margin: "0 10px",
                                            }}
                                        ></span>
                                        Price: PHP {price.toLocaleString()}.00
                                    </Card.Subtitle>

                                    <Card.Subtitle className="text-start mt-3">
                                        Description
                                    </Card.Subtitle>
                                    <ul className=" text-start mt-2">
                                        <li>{description}</li>
                                    </ul>
                                    {!user.isAdmin && (
                                        <>
                                            <Card.Subtitle className="text-start mt-4 mb-2">
                                                Quantity
                                            </Card.Subtitle>
                                            <div className="d-flex mb-1">
                                                <Button
                                                    className="rounded-0"
                                                    onClick={decreaseQuantity}
                                                >
                                                    <FontAwesomeIcon icon="fa-solid fa-minus" />
                                                </Button>
                                                <Form.Control
                                                    type="number"
                                                    required
                                                    disabled={true}
                                                    value={quantity}
                                                    className="rounded-0"
                                                    style={{
                                                        boxShadow: "none",
                                                        width: "30%",
                                                    }}
                                                />
                                                <Button
                                                    className="rounded-0"
                                                    onClick={() => {
                                                        addQuantity();
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon="fa-solid fa-plus" />
                                                </Button>
                                            </div>
                                            <div className="text-start">
                                                <span
                                                    className="text-danger"
                                                    style={{
                                                        fontSize: "0.8em",
                                                        display: quantityError,
                                                    }}
                                                >
                                                    Insufficient Stock
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </Card.Body>
                                {!user.isAdmin && (
                                    <Card.Footer className="p-3">
                                        <Button
                                            className="w-100 text-uppercase btn btn-success"
                                            disabled={disable}
                                            onClick={(event) => {
                                                addToCart(event);
                                            }}
                                        >
                                            Add To Cart
                                            <FontAwesomeIcon
                                                icon="fa-solid fa-cart-shopping"
                                                className="ms-3"
                                            />
                                        </Button>
                                    </Card.Footer>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </Container>
            )}
        </div>
    );
};

export default ViewProduct;
