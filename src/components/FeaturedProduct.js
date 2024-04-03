import { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import ProductCard from "./ProductCard";

const FeaturedProduct = () => {
    const [previews, setPreviews] = useState([]);

    const generateFeatured = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/products/active-products`
            );
            const result = await response.json();
            const numbers = [];
            const featured = [];

            if (response.ok) {
                const resultProduct = result.products;

                const generateRandomNums = () => {
                    let randomNum = Math.floor(
                        Math.random() * resultProduct.length
                    );

                    if (numbers.indexOf(randomNum) === -1) {
                        numbers.push(randomNum);
                    } else {
                        generateRandomNums();
                    }
                };
                for (let i = 0; i < 4; i++) {
                    generateRandomNums();

                    featured.push(
                        <ProductCard
                            product={resultProduct[numbers[i]]}
                            key={numbers[i]}
                        />
                    );
                }

                setPreviews(featured);
            }
        } catch (error) {
            console.log("Error Encountered " + error);
        }
    };

    useEffect(() => {
        generateFeatured();
    }, []);
    return (
        <>
            <hr />
            <div className="mt-4">
                <h1 className="text-center mb-3">Featured Products</h1>
                <Row className="">{previews}</Row>
            </div>
        </>
    );
};

export default FeaturedProduct;
