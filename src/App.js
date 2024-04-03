import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import { UserProvider } from "./UserContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import NotFoundPage from "./components/NotFoundPage";
import SignUp from "./pages/SignUp";
import { Bars } from "react-loader-spinner";
import Logout from "./pages/Logout";
import Product from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import ViewProduct from "./pages/ViewProduct";
import MyCart from "./pages/MyCart";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import UserManagement from "./pages/UserManagement";

function App() {
    const [user, setUser] = useState({
        id: null,
        isAdmin: null,
        emailVerified: null,
    });
    const [loading, setLoading] = useState(true);
    const unSetUser = () => {
        setUser({
            id: null,
            isAdmin: null,
            emailVerified: null,
        });
        localStorage.clear();
    };

    const fetchDetails = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/users/details`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        const result = await response.json();

        if (response.ok) {
            setUser({
                id: result.user._id,
                isAdmin: result.user.isAdmin,
                emailVerified: result.user.emailVerifiedDate,
            });
        } else {
            setUser({
                id: null,
                isAdmin: null,
                emailVerified: null,
            });
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            fetchDetails();
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }, []);

    return (
        <UserProvider value={{ user, setUser, unSetUser }}>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <Bars
                        height="80"
                        width="80"
                        color="#4fa94d"
                        ariaLabel="bars-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />
                </div>
            ) : (
                <Router>
                    <NavBar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<SignUp />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/products" element={<Product />} />
                        <Route path="/addProduct" element={<AddProduct />} />
                        <Route
                            path="/viewProduct/:productId"
                            element={<ViewProduct />}
                        />
                        <Route path="/myCart" element={<MyCart />} />
                        <Route
                            path="/orderHistory"
                            element={<OrderHistory />}
                        />
                        <Route path="/users" element={<UserManagement />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>

                    <Footer />
                </Router>
            )}
        </UserProvider>
    );
}

export default App;
