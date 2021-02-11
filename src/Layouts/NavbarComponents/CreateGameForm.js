import React from 'react'
import { Button, Col, Form, FormGroup, Label, Row} from 'reactstrap'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import {store} from 'react-notifications-component'


export default function CreateGameForm(props){
    const { register, handleSubmit, errors } = useForm()

    const onSubmit = (data) => {
        data.uniqueName = (new Date(`${data.date} ${data.time}`)).toString().replace(/\s/g, '').slice(0,14).toUpperCase()        
        console.log(data)
        axios.post(`http://localhost:3001/admin/game/create`, data, {
            headers: {
                'Authorization' : `Bearer ${localStorage.getItem("tokn")}`
            }
        }).then(response => {
            console.log(response)
            // alert("Created")

            if(response.data.statusCode === 201){
                store.addNotification({
                    title: "Already Exists",
                    message: "Game Already Exists",
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
                props.toggleCreateGameModal()
                store.addNotification({
                    title: "Created",
                    message: "Game Created Successfully",
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
        })
        
    }

    return (
        //required will no work , untill onsubmit line
        <Form onSubmit={handleSubmit(onSubmit)}> 
            <Row>
                <Col>
                    <FormGroup>
                        <Label>Game Name</Label>
                        <input type="text" className="form-control" name="name" id="name" placeholder="Game Name" ref={register({required:true})} autocomplete="off" />
                        {errors.name && <p className="text-danger">Required</p>}
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <FormGroup>
                        <Label>Date</Label>
                        <input type="date" className="form-control" name="date" id="date" placeholder="date" ref={register({required:true})} />
                        {errors.date && <p className="text-danger">Required</p> }
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label>Time</Label>
                        <input type="time" className="form-control" name="time" id="time" placeholder="Game Name" ref={register({required:true})} />
                        {errors.time && <p className="text-danger">Required</p> }
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button block color="success" outline type="submit">Create Game</Button>
                </Col>
            </Row>
        </Form>
    )
}