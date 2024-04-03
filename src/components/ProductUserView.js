import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import ProductCard from "./ProductCard";
import { ThreeDots } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";

const ProductUserView = ({ activeProducts, fetchActiveProduct }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchedItems, setSearchedItems] = useState([]);
    const [search, setSearch] = useState("");
    const [clickSearch, setClickSearch] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoryProduct, setCategoryProduct] = useState([]);
    const [fromPrice, setFromPrice] = useState("");
    const [toPrice, setToPrice] = useState("");
    const [disableSortBtn, setDisableSortBtn] = useState(true);
    const [productsOnRange, setProductsOnRange] = useState([]);

    useEffect(() => {
        if (activeProducts.length !== 0) {
            setLoading(false);
        }
        const updatedProducts = activeProducts.map((product) => {
            return <ProductCard product={product} key={product._id} />;
        });
        setProducts(updatedProducts);
    }, [activeProducts]);

    const searchProduct = async (event) => {
        event.preventDefault();
        try {
            setClickSearch(false);
            setSearchedItems([]);
            if (search !== "") {
                const response = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL}/products/search-product`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                        body: JSON.stringify({
                            productName: search,
                        }),
                    }
                );

                const result = await response.json();
                setClickSearch(true);
                if (response.ok) {
                    const resultProduct = result.product;
                    setSearchedItems(
                        resultProduct.map((product) => {
                            return (
                                <ProductCard
                                    product={product}
                                    key={product._id}
                                />
                            );
                        })
                    );
                }
            } else {
                setSearchedItems([]);
            }
        } catch (error) {
            console.log("Error Encountered : " + error);
        }
    };
    const fetchCategories = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/categories/categories-list`
            );
            const result = await response.json();
            if (response.ok) {
                const resultCategories = result.category;
                const icons = [
                    <FontAwesomeIcon icon="fa-solid fa-tv" />,
                    <FontAwesomeIcon icon="fa-solid fa-shirt" />,
                ];
                let count = 0;
                setCategories(
                    resultCategories.map((category) => {
                        return (
                            <div
                                className="col-2 text-center me-3 bg-primary p-3 rounded text-white"
                                key={category._id}
                                style={{
                                    cursor: "pointer",
                                }}
                                onClick={(event) => {
                                    fetchProductCategory(category._id);
                                }}
                            >
                                <div className="">{icons[count++]}</div>
                                <div>{category.name}</div>
                            </div>
                        );
                    })
                );
            }
        } catch (error) {
            console.log("Error Encountered : " + error);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchProductCategory = async (categoryId) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/products/fetch-products-in-category/${categoryId}`
            );
            const result = await response.json();
            if (response.ok) {
                const resultProduct = result.products;
                setCategoryProduct(
                    resultProduct.map((product) => {
                        return (
                            <ProductCard product={product} key={product._id} />
                        );
                    })
                );
            }
        } catch (error) {
            console.log("Error Encountered : " + error);
        }
    };

    // search by price
    const searchProductByPrice = async (event) => {
        event.preventDefault();
        setCategoryProduct([]);
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/products/fetch-products-price-range`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        minPrice: fromPrice,
                        maxPrice: toPrice,
                    }),
                }
            );
            const result = await response.json();

            if (response.ok) {
                const resultProducts = result.products;
                setProductsOnRange(
                    resultProducts.map((product) => {
                        return (
                            <ProductCard product={product} key={product._id} />
                        );
                    })
                );
            } else {
                Swal.fire({
                    title: "No Product Found",
                    icon: "error",
                    text:
                        "No product between PHP " +
                        fromPrice +
                        " to PHP " +
                        toPrice,
                });
                fetchActiveProduct();
            }

            setFromPrice("");
            setToPrice("");
        } catch (error) {
            console.log("Error Encountered : " + error);
        }
    };
    useEffect(() => {
        if (fromPrice !== "" && toPrice !== "") {
            setDisableSortBtn(false);
        } else {
            setDisableSortBtn(true);
        }
    }, [fromPrice, toPrice]);
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
                <Container className="pb-4 text-white">
                    <Row className="mt-4">
                        <Col className="text-center col-12 mb-3">
                            <h1>Products</h1>
                        </Col>
                        <Col className="col-12 mb-4">
                            <Form
                                onSubmit={(event) => {
                                    searchProduct(event);
                                }}
                            >
                                <div className="d-flex">
                                    <Form.Control
                                        type="text"
                                        placeholder="Search Product... "
                                        value={search}
                                        onChange={(event) => {
                                            setSearch(event.target.value);
                                        }}
                                        style={{
                                            boxShadow: "none",
                                            background: "#E5E5E5",
                                        }}
                                    />

                                    <Button
                                        type="submit"
                                        className="ms-3 d-flex align-items-center"
                                    >
                                        Search
                                        <FontAwesomeIcon
                                            icon="fa-solid fa-magnifying-glass"
                                            className="ms-2"
                                        />
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                        {clickSearch ? (
                            searchedItems.length === 0 ? (
                                <Col className="col-12">
                                    <div>
                                        Search Results for:
                                        <span
                                            className="ms-1 text-uppercase"
                                            style={{ color: "orange" }}
                                        >
                                            {search}
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        NO RESULT FOUND.
                                    </div>
                                    <hr />
                                </Col>
                            ) : (
                                <>
                                    <Col className="col-12 mb-3">
                                        <div>
                                            Search Results for:
                                            <span
                                                className="text-uppercase ms-1"
                                                style={{ color: "orange" }}
                                            >
                                                {search}
                                            </span>
                                        </div>
                                    </Col>
                                    {searchedItems}
                                    <hr />
                                </>
                            )
                        ) : (
                            <></>
                        )}
                        <Col className="col-12 mb-5">
                            <div className="bg-white text-black rounded shadow p-4">
                                CATEGORIES
                                <div className="d-flex mt-3">{categories}</div>
                                <div className="mt-3">Sort (Price Range)</div>
                                <div className="col-6 mt-2">
                                    <Form
                                        onSubmit={(event) => {
                                            searchProductByPrice(event);
                                        }}
                                    >
                                        <div className="d-flex align-items-center">
                                            <Form.Control
                                                type="number"
                                                placeholder="From "
                                                value={fromPrice}
                                                onChange={(event) => {
                                                    setFromPrice(
                                                        event.target.value
                                                    );
                                                }}
                                                style={{
                                                    boxShadow: "none",
                                                    background: "#E5E5E5",
                                                }}
                                            />
                                            <span className="ms-2 me-2">-</span>
                                            <Form.Control
                                                type="number"
                                                placeholder="To "
                                                value={toPrice}
                                                onChange={(event) => {
                                                    setToPrice(
                                                        event.target.value
                                                    );
                                                }}
                                                style={{
                                                    boxShadow: "none",
                                                    background: "#E5E5E5",
                                                }}
                                            />

                                            <Button
                                                type="submit"
                                                className="ms-3"
                                                disabled={disableSortBtn}
                                            >
                                                Search
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </Col>
                        {categoryProduct.length === 0
                            ? productsOnRange.length === 0
                                ? products
                                : productsOnRange
                            : categoryProduct}
                    </Row>
                </Container>
            )}
        </div>
    );
};

export default ProductUserView;
