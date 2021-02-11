import React, { useState, useEffect } from 'react'
import { Button, Card, CardBody, Form, FormGroup, Label, Input, Row, Col, Alert } from 'reactstrap'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { store } from 'react-notifications-component'

export default function UserRegistration() {


    const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false)

    const { register, handleSubmit, errors } = useForm()

    const onSubmit = (data) => {

        console.log(data)
        axios.post(`https://housie-backend.herokuapp.com/user/registration`, data).then(response => {
            console.log(response)

            // alert("Created")

            if (response.data.statusCode === 201) {
                store.addNotification({
                    title: "Error",
                    message: "User Already Exists",
                    type: "danger",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                        duration: 2000,
                        onScreen: true
                    }
                });
            }
            if (response.data.statusCode === 200) {
                setIsRegistrationSuccess(true)
                store.addNotification({
                    title: "Success",
                    message: "Registration Successfull",
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                        duration: 2000,
                        onScreen: true
                    }
                });
            }

        }).catch(error => {
            console.log(error)
            store.addNotification({
                title: "Error",
                message: "Internal Server Error",
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                    duration: 2000,
                    onScreen: true
                }
            });
        })

    }


    return (
        <div className="container vh-100 d-flex justify-content-center" style={{ flexDirection: "column" }}>
            <Row className="justify-content-center">
                <Col md={5}>
                    <Card className="shadow-sm text-left">
                        <CardBody>
                            <h2>Registration</h2>
                            <p>Welcome to housie game.</p>
                            {isRegistrationSuccess ?
                                <Alert>Regsitration Successfull</Alert>
                                :
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label>Name</Label>
                                                <input type="text" className="form-control" name="name" id="name" placeholder="Name" ref={register({ required: true })} autocomplete="off" />
                                                {errors.name && <p className="text-danger">Required</p>}
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label>Mobile</Label>
                                                <input type="number" className="form-control" name="mobile" id="mobile" placeholder="Mobile" ref={register({ required: true, validate: (val) => val && val.length === 10 })} />
                                                {errors.mobile?.type === "required" && <p className="text-danger">Required</p>}
                                                {errors.mobile?.type === "validate" && <p className="text-danger">Invalid Mobile</p>}
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Button block color="success" outline type="submit">Register</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            }
                        </CardBody>
                    </Card>
                </Col>
            </Row>

        </div>
    )
}

