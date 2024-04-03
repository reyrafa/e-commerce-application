import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Container, Row, Col, Table, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import UpdateProduct from "./UpdateProduct";
import DisableProduct from "./DisableProduct";
const ProductAdminView = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productName, setProductName] = useState("");
    const [searchProduct, setSearchProduct] = useState([]);
    const [searchedItems, setSearchedItems] = useState("");

    const fetchProducts = async () => {
        setLoading(true);
        const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/products/products-list`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        const result = await response.json();

        if (response.ok) {
            const resultProducts = result.products;

            setProducts(
                resultProducts.map((product) => {
                    return (
                        <tr
                            key={product._id}
                            style={{ fontSize: "0.8em" }}
                            className="align-middle"
                        >
                            <td
                                className="text-uppercase fw-bold"
                                style={{ color: "#1E344E" }}
                            >
                                {product.name}
                            </td>
                            <td>{product.description}</td>

                            <td>{product.price}</td>
                            <td>{product.stock}</td>
                            <td>{product.categoryID.name}</td>
                            <td>
                                {product.isActive ? (
                                    <span
                                        style={{
                                            background: "#CCFFCC",
                                            border: "1px solid #00B200",
                                            color: "#007F00",
                                        }}
                                        className="py-1 px-2 rounded-5"
                                    >
                                        Available
                                    </span>
                                ) : (
                                    <span
                                        style={{
                                            background: "#FFCCCC",
                                            border: "1px solid #CC0000",
                                            color: "#CC0000",
                                        }}
                                        className="py-1 px-2 rounded-5"
                                    >
                                        Unavailable
                                    </span>
                                )}
                            </td>
                            <td>
                                <UpdateProduct
                                    productId={product._id}
                                    fetchProducts={fetchProducts}
                                    searchedItems={productName}
                                />
                            </td>
                            <td>
                                <DisableProduct
                                    active={product.isActive}
                                    productId={product._id}
                                    fetchProducts={fetchProducts}
                                    searchedItems={productName}
                                />
                            </td>
                            <td>
                                <Link
                                    className="btn btn-success d-flex align-items-center"
                                    style={{ fontSize: "0.9em" }}
                                    to={`/viewProduct/${product._id}`}
                                >
                                    View
                                    <FontAwesomeIcon
                                        icon="fa-solid fa-eye"
                                        className="ms-2"
                                    />
                                </Link>
                            </td>
                        </tr>
                    );
                })
            );
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const searchProductName = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            if (productName !== "") {
                const response = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL}/products/search-product`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            productName: productName,
                        }),
                    }
                );
                const result = await response.json();
                setSearchedItems(productName);
                if (response.ok) {
                    const resultProduct = result.product;
                    setSearchProduct(
                        resultProduct.map((searchedProduct) => {
                            return (
                                <tr
                                    key={searchedProduct._id}
                                    style={{ fontSize: "0.8em" }}
                                    className="align-middle"
                                >
                                    <td>{searchedProduct.name}</td>
                                    <td>{searchedProduct.description}</td>
                                    <td>{searchedProduct.price}</td>
                                    <td>{searchedProduct.stock}</td>
                                    <td>{searchedProduct.categoryID.name}</td>
                                    <td>
                                        {searchedProduct.isActive ? (
                                            <span
                                                style={{
                                                    background: "#CCFFCC",
                                                    border: "1px solid #00B200",
                                                    color: "#007F00",
                                                }}
                                                className="py-1 px-2 rounded-5"
                                            >
                                                Available
                                            </span>
                                        ) : (
                                            <span
                                                style={{
                                                    background: "#FFCCCC",
                                                    border: "1px solid #CC0000",
                                                    color: "#CC0000",
                                                }}
                                                className="py-1 px-2 rounded-5"
                                            >
                                                Unavailable
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <UpdateProduct
                                            productId={searchedProduct._id}
                                            searchProductName={
                                                searchProductName
                                            }
                                            searchedItems={productName}
                                        />
                                    </td>
                                    <td>
                                        <DisableProduct
                                            active={searchedProduct.isActive}
                                            productId={searchedProduct._id}
                                            searchProductName={
                                                searchProductName
                                            }
                                            searchedItems={productName}
                                        />
                                    </td>
                                    <td>
                                        <Link
                                            className="btn btn-success d-flex align-items-center"
                                            style={{ fontSize: "0.9em" }}
                                            to={`/viewProduct/${searchedProduct._id}`}
                                        >
                                            View
                                            <FontAwesomeIcon
                                                icon="fa-solid fa-eye"
                                                className="ms-2"
                                            />
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })
                    );

                    setLoading(false);
                } else {
                    setLoading(false);
                    setSearchProduct(
                        <tr>
                            <td className="text-center" colSpan={7}>
                                No Result Found
                            </td>
                        </tr>
                    );
                }
            } else {
                setSearchedItems("");
                setSearchProduct([]);
                fetchProducts();
            }
        } catch (error) {
            console.log("error encountered" + error);
        }
    };
    return (
        <div
            style={{ background: "#1E344E", overflow: "hidden" }}
            className="p-4"
        >
            <Container className="pb-4">
                <Row className="mt-4">
                    <Col>
                        <h2 className="text-white">Product Lists</h2>
                        <div className="d-flex justify-content-between">
                            <Link
                                className="text-decoration-none btn btn-primary"
                                to={"/addProduct"}
                            >
                                Add New Product
                                <FontAwesomeIcon
                                    icon="fa-solid fa-folder-plus"
                                    className="ms-3"
                                />
                            </Link>
                            <Form
                                onSubmit={(event) => {
                                    searchProductName(event);
                                }}
                            >
                                <Row>
                                    <Col
                                        className="ms-0 me-0 ms-lg-5 me-lg-4 mb-2 mb-md-0"
                                        sm="auto"
                                    >
                                        <Form.Control
                                            type="text"
                                            placeholder="Search Product... "
                                            value={productName}
                                            onChange={(event) => {
                                                setProductName(
                                                    event.target.value
                                                );
                                            }}
                                            style={{ boxShadow: "none" }}
                                        />
                                    </Col>
                                    <Col sm="auto">
                                        <Button type="submit">Search</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <div className="p-3 bg-white shadow rounded mt-3">
                            {searchedItems && (
                                <div
                                    className="text-success mb-3 text-uppercase"
                                    style={{ fontSize: "1.2em" }}
                                >
                                    Search Results for :
                                    <span className=" fw-bold">
                                        {searchedItems}
                                    </span>
                                </div>
                            )}
                            <Table striped hover responsive className="">
                                <thead
                                    className="text-center text-uppercase"
                                    style={{ fontSize: "0.9em" }}
                                >
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Description</th>

                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Category</th>

                                        <th>Availability</th>
                                        <th colSpan={3}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan={9}
                                                className="text-center"
                                            >
                                                <InfinitySpin
                                                    visible={true}
                                                    width="200"
                                                    color="#4fa94d"
                                                    ariaLabel="infinity-spin-loading"
                                                />
                                            </td>
                                        </tr>
                                    ) : searchProduct.length === 0 ? (
                                        products
                                    ) : (
                                        searchProduct
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProductAdminView;
