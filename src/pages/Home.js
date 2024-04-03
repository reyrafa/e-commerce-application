import { Container, Row, Col } from "react-bootstrap";
import WelcomeImage from "../assets/images/welcomeImg.png";
import FeaturedProduct from "../components/FeaturedProduct";
function Home() {
    return (
        <div
            style={{ background: "#1E344E", overflow: "hidden" }}
            className="p-4"
        >
            <Container className="pb-4 text-white">
                <Row className="mt-4">
                    <Col className="text-center col-12 mb-5">
                        <div>
                            <img
                                src={WelcomeImage}
                                alt={"Welcome"}
                                className="img-fluid"
                            />
                        </div>
                        <h1>Rey Rafael EComerce Application</h1>
                        <div>
                            Discover Joy in Every Click - Welcome to My
                            ECommerce Application!
                        </div>
                    </Col>
                    <Col className="col-12 mb-2">
                        <FeaturedProduct />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Home;
