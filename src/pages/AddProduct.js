import { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import {
    Container,
    Row,
    Col,
    Button,
    Form,
    FloatingLabel,
} from "react-bootstrap";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddProduct = () => {
    const { user } = useContext(UserContext);
    const [categories, setCategories] = useState([]);
    const [disabled, setIsDisabled] = useState(true);
    const [name, setName] = useState("");
    const [model, setModel] = useState("");
    const [color, setColor] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const fetchCategories = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/categories/categories-list`,
                {
                    method: "GET",
                }
            );

            const result = await response.json();

            if (response.ok) {
                const resultCategories = result.category;

                setCategories(
                    resultCategories.map((category) => {
                        return (
                            <option value={category._id} key={category._id}>
                                {category.name}
                            </option>
                        );
                    })
                );
            }
        } catch (error) {
            console.log("error encountered");
        }
    };

    useEffect(() => {
        if (
            name !== "" &&
            model !== "" &&
            color !== "" &&
            description !== "" &&
            price !== "" &&
            stock !== "" &&
            category !== ""
        ) {
            setIsDisabled(false);
            // console.log(category);
        } else {
            setIsDisabled(true);
        }
    }, [name, model, color, description, price, stock, category, imageUrl]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const addProduct = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/products/add-product`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({
                        name: name,
                        description: description,
                        model: model,
                        color: color,
                        price: price,
                        stocks: stock,
                        images: [imageUrl],
                        categoryID: category,
                    }),
                }
            );
            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: "Added Product Successfully",
                    icon: "success",
                    text: result.insert,
                });
                setName("");
                setModel("");
                setColor("");
                setDescription("");
                setPrice("");
                setStock("");
                setCategory("");
                setImageUrl("");
            } else {
                Swal.fire({
                    title: "Failed",
                    icon: "error",
                    text: result.message,
                });
            }
        } catch (error) {
            Swal.fire({ title: "Product Add Failed", icon: "error" });
        }
    };

    return user.isAdmin ? (
        <div
            style={{ background: "#1E344E", overflow: "hidden" }}
            className="p-4"
        >
            <Container className="mb-4">
                <Row className="mt-4">
                    <Col>
                        <h2 className="text-white">Add Product</h2>
                        <div className="p-4 m-4 bg-white rounded-1 shadow-lg">
                            <Form
                                className=""
                                onSubmit={(event) => {
                                    addProduct(event);
                                }}
                            >
                                <Row>
                                    <Col className="col-md-4">
                                        <Form.Group
                                            className="mb-3"
                                            controlId="name"
                                        >
                                            <Form.Label>
                                                Product Name
                                                <span
                                                    className="text-danger ms-2"
                                                    style={{
                                                        fontSize: "0.8em",
                                                    }}
                                                >
                                                    (REQUIRED*)
                                                </span>
                                            </Form.Label>

                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Product Name"
                                                required
                                                value={name}
                                                onChange={(event) => {
                                                    setName(event.target.value);
                                                }}
                                                style={{
                                                    boxShadow: "none",
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col className="col-md-4">
                                        <Form.Group
                                            className="mb-3"
                                            controlId="model"
                                        >
                                            <Form.Label>
                                                Product Model
                                                <span
                                                    className="text-danger ms-2"
                                                    style={{
                                                        fontSize: "0.8em",
                                                    }}
                                                >
                                                    (REQUIRED*)
                                                </span>
                                            </Form.Label>

                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Product Model"
                                                required
                                                value={model}
                                                onChange={(event) => {
                                                    setModel(
                                                        event.target.value
                                                    );
                                                }}
                                                style={{
                                                    boxShadow: "none",
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col className="col-md-4">
                                        <Form.Group
                                            className="mb-3"
                                            controlId="color"
                                        >
                                            <Form.Label>
                                                Product Color
                                                <span
                                                    className="text-danger ms-2"
                                                    style={{
                                                        fontSize: "0.8em",
                                                    }}
                                                >
                                                    (REQUIRED*)
                                                </span>
                                            </Form.Label>

                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Product Color"
                                                required
                                                value={color}
                                                onChange={(event) => {
                                                    setColor(
                                                        event.target.value
                                                    );
                                                }}
                                                style={{
                                                    boxShadow: "none",
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col className="col-md-12">
                                        <Form.Group
                                            className="mb-3"
                                            controlId="description"
                                        >
                                            <Form.Label>
                                                Product Description
                                                <span
                                                    className="text-danger ms-2"
                                                    style={{
                                                        fontSize: "0.8em",
                                                    }}
                                                >
                                                    (REQUIRED*)
                                                </span>
                                            </Form.Label>

                                            <FloatingLabel
                                                controlId="floatingTextarea2"
                                                label="Description"
                                            >
                                                <Form.Control
                                                    as="textarea"
                                                    placeholder="Leave a comment here"
                                                    value={description}
                                                    onChange={(event) => {
                                                        setDescription(
                                                            event.target.value
                                                        );
                                                    }}
                                                    style={{
                                                        height: "100px",
                                                        boxShadow: "none",
                                                    }}
                                                />
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Col>
                                    <Col className="col-md-4">
                                        <Form.Group
                                            className="mb-3"
                                            controlId="price"
                                        >
                                            <Form.Label>
                                                Price
                                                <span
                                                    className="text-danger ms-2"
                                                    style={{
                                                        fontSize: "0.8em",
                                                    }}
                                                >
                                                    (REQUIRED*)
                                                </span>
                                            </Form.Label>

                                            <Form.Control
                                                type="number"
                                                placeholder="Enter Product price"
                                                required
                                                value={price}
                                                onChange={(event) => {
                                                    setPrice(
                                                        event.target.value
                                                    );
                                                }}
                                                style={{
                                                    boxShadow: "none",
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col className="col-md-4">
                                        <Form.Group
                                            className="mb-3"
                                            controlId="stock"
                                        >
                                            <Form.Label>
                                                Stock
                                                <span
                                                    className="text-danger ms-2"
                                                    style={{
                                                        fontSize: "0.8em",
                                                    }}
                                                >
                                                    (REQUIRED*)
                                                </span>
                                            </Form.Label>

                                            <Form.Control
                                                type="number"
                                                placeholder="Enter Product stock"
                                                required
                                                value={stock}
                                                onChange={(event) => {
                                                    setStock(
                                                        event.target.value
                                                    );
                                                }}
                                                style={{
                                                    boxShadow: "none",
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col className="col-md-4">
                                        <Form.Group
                                            className="mb-3"
                                            controlId="stock"
                                        >
                                            <Form.Label>
                                                Category
                                                <span
                                                    className="text-danger ms-2"
                                                    style={{
                                                        fontSize: "0.8em",
                                                    }}
                                                >
                                                    (REQUIRED*)
                                                </span>
                                            </Form.Label>

                                            <Form.Select
                                                required
                                                aria-label="Default select example"
                                                value={category}
                                                onChange={(event) => {
                                                    setCategory(
                                                        event.target.value
                                                    );
                                                }}
                                            >
                                                <option
                                                    disabled={true}
                                                    value={""}
                                                >
                                                    Select Category
                                                </option>
                                                {categories}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col className="col-md-4">
                                        <Form.Group
                                            className="mb-3"
                                            controlId="stock"
                                        >
                                            <Form.Label>Image URL</Form.Label>

                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Image URL"
                                                required
                                                value={imageUrl}
                                                onChange={(event) => {
                                                    setImageUrl(
                                                        event.target.value
                                                    );
                                                }}
                                                style={{
                                                    boxShadow: "none",
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={disabled}
                                    >
                                        Add Product
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    ) : (
        <Navigate to={"/"} />
    );
};

export default AddProduct;
