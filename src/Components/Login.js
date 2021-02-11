import React, {useState, useEffect} from 'react'
import { Button, Card, CardBody, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap'
import axios from 'axios'
import NavBar from '../Layouts/NavBar';
import {store} from 'react-notifications-component'

export default function Login() {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()

        axios.post(`http://localhost:3001/admin/login`, 
            {
                email: email,
                password: password
            }
        ).then(response => {
            console.log(response)
            if(response.data.statusCode === 404){
                store.addNotification({
                    title: "Not Found",
                    message: "User Not Found",
                    type: "info",
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
            if(response.data.statusCode === 403){
                store.addNotification({
                    title: "Not Found",
                    message: "Wrong Password",
                    type: "info",
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
            if(response.data.statusCode === 200){
                store.addNotification({
                    title: "Login",
                    message: "Login Successfully",
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
                localStorage.setItem('tokn', response.data.token)
                localStorage.setItem('usr', JSON.stringify(response.data.user))
                window.location.href = "/index"
            }
        }).catch(error => {
            console.log(error)
            store.addNotification({
                title: "Login",
                message: "Internal Server Error",
                type: "info",
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
    useEffect(() => {
        if(localStorage.getItem('tokn')){
            window.location.href = "/index"
        }
    }, [0])
    return (
        <React.Fragment>
            <NavBar />
            <div className="container vh-100 d-flex justify-content-center" style={{flexDirection: "column"}}>
                <Row className="justify-content-center">
                    <Col md={5}>
                        <Card className="shadow-sm text-left">
                            <CardBody>
                                <h2>Login</h2>
                                <p>Welcome to housie game.</p>
                                <Form onSubmit={handleSubmit}>
                                    <FormGroup>
                                        <Label>Email</Label>
                                        <Input type="email" name="email" id="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Password</Label>
                                        <Input type="password" name="password" id="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
                                    </FormGroup>
                                    <Button block color="success">Login</Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

            </div>
        </React.Fragment>
    )
}
