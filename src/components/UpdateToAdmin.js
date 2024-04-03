import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
const UpdateToAdmin = ({ isAdmin, user, fetchUsers }) => {
    const [isOpen, setIsOpen] = useState(false);

    const closeModal = () => {
        setIsOpen(false);
    };

    const openModal = () => {
        setIsOpen(true);
    };

    const updateUserToAdmin = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/users/update-to-admin/${user._id}`,
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
                const resultUser = result.users;
                Swal.fire({
                    title: "Authorization Success",
                    icon: "success",
                    text: resultUser.email + " is now an Admin",
                });
                fetchUsers();
                closeModal();
            } else {
                Swal.fire({
                    title: "Authorization Failed",
                    icon: "error",
                    text: result.message,
                });
            }
        } catch (error) {
            console.log("Error encountered : " + error);
        }
    };
    return (
        <>
            {isAdmin ? (
                <span></span>
            ) : (
                <Button
                    className="btn btn-danger"
                    style={{ fontSize: "0.9em" }}
                    onClick={() => {
                        const admin = false;
                        openModal(admin);
                    }}
                >
                    Authorize
                    <FontAwesomeIcon
                        icon="fa-solid fa-user-tie"
                        className=" ms-2"
                    />
                </Button>
            )}
            <Modal show={isOpen} onHide={closeModal}>
                <Form
                    onSubmit={(event) => {
                        updateUserToAdmin(event);
                    }}
                >
                    <Modal.Header className="bg-danger text-white">
                        <Modal.Title className="text-uppercase">
                            Warning
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to Authorize User ?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                closeModal();
                            }}
                        >
                            Close
                        </Button>
                        <Button variant="danger" type="submit">
                            AUTHORIZE
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateToAdmin;
