import { format, formatDistanceToNow } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import { InfinitySpin } from "react-loader-spinner";
import { Navigate } from "react-router-dom";
import UpdateToAdmin from "../components/UpdateToAdmin";
import UserContext from "../UserContext";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const fetchUsers = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/users/fetch-users`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            const result = await response.json();

            if (response.ok) {
                const resultUsers = result.user;

                setUsers(
                    resultUsers.map((user) => {
                        return (
                            <tr key={user._id} style={{ fontSize: "0.8em" }}>
                                <td className="p-3 text-uppercase text-center align-middle">
                                    {user.firstName} {user.lastName}
                                </td>
                                <td className="p-3 text-center align-middle">
                                    {user.email}
                                </td>
                                <td className="p-3 text-center align-middle">
                                    {user.mobileNumber}
                                </td>
                                <td className="p-3 align-middle">
                                    <div
                                        className="text-center rounded-3 px-2 py-1"
                                        style={{
                                            background: `${
                                                user.isAdmin
                                                    ? "#FFEDCC"
                                                    : "#B2FFB2"
                                            }`,
                                            border: `${
                                                user.isAdmin
                                                    ? "1px solid #996300"
                                                    : "1px solid #00E500"
                                            }`,
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: `${
                                                    user.isAdmin
                                                        ? "#996300"
                                                        : "#007F00"
                                                }`,
                                            }}
                                        >
                                            {user.isAdmin ? "Admin" : "User"}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-3 text-center align-middle">
                                    {format(
                                        new Date(user.createdAt),
                                        "MMM d, yyy"
                                    )}
                                </td>
                                <td className="p-3 text-center text-primary align-middle">
                                    {formatDistanceToNow(
                                        new Date(user.updatedAt),
                                        { addSuffix: true }
                                    )}
                                </td>
                                <td className="p-3 text-center">
                                    <UpdateToAdmin
                                        isAdmin={user.isAdmin}
                                        user={user}
                                        fetchUsers={fetchUsers}
                                    />
                                </td>
                            </tr>
                        );
                    })
                );
                setLoading(false);
            }
        } catch (error) {
            console.log("Error Encountered: " + error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    return (
        user.isAdmin ?
        <div
            style={{ background: "#1E344E", overflow: "hidden" }}
            className="p-4"
        >
            {loading ? (
                <div className=" vh-100 d-flex justify-content-center align-items-center">
                    <InfinitySpin
                        visible={true}
                        width="200"
                        color="white"
                        ariaLabel="infinity-spin-loading"
                    />
                </div>
            ) : (
                <Container className="pb-4">
                    <Row className="mt-4">
                        <Col>
                            <h2 className="text-white">User List</h2>

                            <div className="p-3 bg-white shadow rounded mt-3">
                                <Table striped hover responsive className="">
                                    <thead
                                        className="text-center"
                                        style={{ fontSize: "0.9em" }}
                                    >
                                        <tr>
                                            <th>FULLNAME</th>
                                            <th>EMAIL</th>

                                            <th>MOBILE NUMBER</th>
                                            <th>IS ADMIN</th>
                                            <th>REGISTER DATE</th>
                                            <th>LAST UPDATE</th>

                                            <th colSpan={3}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>{users}</tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                </Container>
            )}
        </div> : <Navigate to={"/"} />
    );
};
export default UserManagement;
