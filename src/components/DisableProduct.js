import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";

const DisableProduct = ({
    active,
    productId,
    fetchProducts,
    searchedItems,
    searchProductName,
}) => {
    const disableProduct = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/products/archive-product/${productId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            const result = await response.json();

            if (response.ok) {
                Swal.fire({ title: "Disabled Successfully!", icon: "success" });
                if (searchedItems === "") {
                    fetchProducts();
                } else {
                    searchProductName(event);
                }
            } else {
                Swal.fire({
                    title: "Disable Failed",
                    icon: "error",
                    text: result.message,
                });
            }
        } catch (error) {
            console.log("Error encountered" + error);
        }
    };

    const activateProduct = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/products/activate-product/${productId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            const result = await response.json();
            if (response.ok) {
                Swal.fire({
                    title: "Activated Successfully!",
                    icon: "success",
                });
                if (searchedItems === "") {
                    fetchProducts();
                } else {
                    searchProductName(event);
                }
            } else {
                Swal.fire({
                    title: "Activation Failed",
                    icon: "error",
                    text: result.message,
                });
            }
        } catch (error) {
            console.log("Error encountered" + error);
        }
    };
    return (
        <>
            {active ? (
                <Button
                    className="btn btn-danger d-flex align-items-center"
                    style={{ fontSize: "0.9em" }}
                    onClick={(event) => {
                        disableProduct(event);
                    }}
                >
                    Disable
                    <FontAwesomeIcon icon="fa-solid fa-ban" className="ms-2" />
                </Button>
            ) : (
                <Button
                    className="btn btn-secondary d-flex align-items-center"
                    style={{ fontSize: "0.9em" }}
                    onClick={(event) => {
                        activateProduct(event);
                    }}
                >
                    Activate
                    <FontAwesomeIcon
                        icon="fa-solid fa-circle-check"
                        className="ms-2"
                    />
                </Button>
            )}
        </>
    );
};

export default DisableProduct;
