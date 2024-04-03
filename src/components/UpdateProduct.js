import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import Swal from "sweetalert2";
const UpdateProduct = ({
    productId,
    fetchProducts,
    searchProductName,
    searchedItems,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [model, setModel] = useState("");
    const [color, setColor] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [disabled, setDisabled] = useState(false);

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
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [name, description, model, color, price, stock, image, category]);

    // fetching categories
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
        fetchCategories();
    }, []);

    const openUpdateModal = (productId) => {
        setIsOpen(true);
        try {
            fetchProduct(productId);
        } catch (error) {
            console.log("error encountered!");
        }
    };

    const fetchProduct = async (productId) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/products/fetch-product/${productId}`
            );
            const result = await response.json();

            if (response.ok) {
                const resultProduct = result.product;
                setName(resultProduct.name);
                setDescription(resultProduct.description);
                setModel(resultProduct.model);
                setColor(resultProduct.color);
                setPrice(resultProduct.price);
                setImage(resultProduct.images[0]);
                setStock(resultProduct.stock);
                setCategory(resultProduct.categoryID._id);
            }
        } catch (error) {
            console.log("error encountered!");
        }
    };

    const updateProduct = async (event, productId) => {
        event.preventDefault();
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/products/update-product/${productId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({
                        categoryId: category,
                        name: name,
                        description: description,
                        model: model,
                        color: color,
                        price: price,
                        stock: stock,
                        images: image,
                    }),
                }
            );

            const result = await response.json();
            if (response.ok) {
                Swal.fire({
                    title: "Product Updated Successfully",
                    icon: "success",
                });
                setName("");
                setModel("");
                setColor("");
                setDescription("");
                setPrice("");
                setStock("");
                setCategory("");
                setImage("");
                closeUpdateModal();
                if (searchedItems === "") {
                    fetchProducts();
                } else {
                    searchProductName(event);
                }
            } else {
                Swal.fire({
                    title: "Product Update Failed",
                    icon: "error",
                    text: result.message,
                });
            }
        } catch (error) {
            console.log("error encountered" + error);
        }
    };

    const closeUpdateModal = () => {
        setIsOpen(false);
    };

    return (
        <>
            <Button
                className="btn btn-primary d-flex align-items-center "
                style={{ fontSize: "0.9em" }}
                onClick={(event) => {
                    openUpdateModal(productId);
                }}
            >
                Update
                <FontAwesomeIcon icon="fa-solid fa-wrench" className="ms-2" />
            </Button>
            <Modal show={isOpen} onHide={closeUpdateModal}>
                <Form
                    onSubmit={(event) => {
                        updateProduct(event, productId);
                    }}
                >
                    <Modal.Header className="bg-primary text-white">
                        <Modal.Title className="text-uppercase">
                            Update Product
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="name">
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
                        <Form.Group className="mb-3" controlId="model">
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
                                    setModel(event.target.value);
                                }}
                                style={{
                                    boxShadow: "none",
                                }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="color">
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
                                    setColor(event.target.value);
                                }}
                                style={{
                                    boxShadow: "none",
                                }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="description">
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
                                        setDescription(event.target.value);
                                    }}
                                    style={{
                                        height: "100px",
                                        boxShadow: "none",
                                    }}
                                />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="price">
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
                                    setPrice(event.target.value);
                                }}
                                style={{
                                    boxShadow: "none",
                                }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="stock">
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
                                    setStock(event.target.value);
                                }}
                                style={{
                                    boxShadow: "none",
                                }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="stock">
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
                                    setCategory(event.target.value);
                                }}
                            >
                                <option disabled={true} value={""}>
                                    Select Category
                                </option>
                                {categories}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="stock">
                            <Form.Label>Image URL</Form.Label>

                            <Form.Control
                                type="text"
                                placeholder="Enter Image URL"
                                required
                                value={image}
                                onChange={(event) => {
                                    setImage(event.target.value);
                                }}
                                style={{
                                    boxShadow: "none",
                                }}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                closeUpdateModal();
                            }}
                        >
                            Close
                        </Button>
                        <Button
                            variant="success"
                            type="submit"
                            disabled={disabled}
                        >
                            Update
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateProduct;
