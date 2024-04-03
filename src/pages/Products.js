import { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import ProductAdminView from "../components/ProductAdminView";
import ProductUserView from "../components/ProductUserView";

const Product = () => {
    const { user } = useContext(UserContext);
    const [activeProducts, setActiveProducts] = useState([]);
    const fetchActiveProduct = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/products/active-products`
            );
            const result = await response.json();
            if (response.ok) {
                setActiveProducts(result.products);
            }
        } catch (error) {
            console.log("Error encountered" + error);
        }
    };

    useEffect(() => {
        if (!user.isAdmin) {
            fetchActiveProduct();
        }
    }, [user]);
    return (
        <>
            {user.isAdmin ? (
                <ProductAdminView />
            ) : (
                <ProductUserView activeProducts={activeProducts} fetchActiveProduct={fetchActiveProduct} />
            )}
        </>
    );
};

export default Product;
