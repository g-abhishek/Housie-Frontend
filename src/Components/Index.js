import axios from 'axios';
import React, { Component, useState, useEffect } from 'react'
import { store } from 'react-notifications-component';
import { connect } from 'react-redux'
import { Card, CardBody, Row, Col, Button, CardHeader, Table } from 'reactstrap'
import NavBar from '../Layouts/NavBar';
import ShowTable from './IndexComponents/ShowTable.js'

import { MDBDataTable } from 'mdbreact'

import { selectNumber, selectGame, fetchWinners } from '../Redux/Housie/Action'

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataArray: this.props.dataArray,
            topLine: [],
            middleLine: [],
            bottomLine: [],
            fullHousie: [],
            isDataReturned: false,
            tableComponent: "topLine",
            refresher: 0
        }
    }

    componentWillMount() {
        if (!localStorage.getItem('tokn')) {
            window.location.href = "/login"
        }
        this.fetchOngoingGame();
    }

    fetchOngoingGame = () => {

        axios.get(`https://housie-backend.herokuapp.com/admin/game/ongoing/`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("tokn")}`
                }
            }).then(response => {                
                if (response.data.statusCode === 200) {
                    let data = response.data.result
                    this.props.selectGame(JSON.stringify({ gameId: data._id, gameName: data.name, gameDateTime: new Date(data.gameDate), numUsers: data.users, done: data.done, uniqueName: data.uniqueName }))
                    this.props.fetchWinners(data._id)
                }
            }).catch(error => {
                console.log(error)
            })
    }

    handleButtonClick = (num) => {

        axios.post(`https://housie-backend.herokuapp.com/admin/game/appeared/`, {
            gid: this.props.gameData.gameId,
            num: num
        },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("tokn")}`
                }
            }).then(response => {
                if (response.data.statusCode === 404) {
                    store.addNotification({
                        title: "Error",
                        message: "No Game Found",
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
                if (response.data.statusCode === 200) {
                    this.setState({
                        refresher: this.state.refresher+1
                    })
                    this.props.selectNumber(num)
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


    render() {
        return (
            <React.Fragment>
                <NavBar />
                <div className="container-fluid">
                    <div className="my-4">
                        {this.props.gameData.gameId ?
                            <React.Fragment>
                                <Card className="shadow">
                                    <CardBody>
                                    <div className="d-flex justify-content-between">
                                        <h5><b>Name:</b> {this.props.gameData.gameName}</h5>
                                        <h5><b>Unique Name:</b> {this.props.gameData.uniqueName}</h5>
                                        <h5><b>Date/Time:</b> {`${new Date(this.props.gameData.gameDateTime).toString().slice(0, 21)}`}</h5>
                                        <h5><b>Users:</b> {this.props.gameData.numUsers}</h5>
                                    </div>
                                    </CardBody>
                                </Card>
                                
                                
                                <Card className="shadow my-3">
                                    <CardBody>


                                        <Row>
                                            <Col>
                                                <Card className="shadow-sm">
                                                    <CardBody>
                                                        {
                                                            [...Array(99)].map((e, i) => {
                                                                return (
                                                                    <Button className={"btn m-1 " + (this.props.dataArray.has(i + 1) ? "btn-success" : "btn-info")} key={i + 1} onClick={() => this.handleButtonClick(i + 1)} style={{ width: "3rem" }}>{i + 1}</Button>
                                                                )
                                                            })
                                                        }
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                            <Col>
                                                <Card className="shadow-sm">
                                                    <CardBody>
                                                        {
                                                            [...this.props.dataArray].map((item) => {
                                                                return (
                                                                    <Button color="info" key={item} className="m-1" style={{ width: "3rem" }}>{item}</Button>
                                                                )
                                                            })
                                                        }
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </React.Fragment>
                            :
                            <Card className="shadow my-3">
                                <CardBody>
                                    <h4>No Game Started Yet</h4>
                                </CardBody>
                            </Card>
                        }

                    </div>
                    <div>
                        {this.props.gameData.gameId ?
                            <Card className="shadow my-5">
                                <CardBody>
                                    <div className="d-flex justify-content-between h-100 my-3">
                                        <div>
                                            <Button style={{ width: "7rem" }} onClick={() => this.setState({ tableComponent: "topLine" })}>Top Line</Button>
                                        </div>
                                        <div>
                                            <Button style={{ width: "7rem" }} onClick={() => this.setState({ tableComponent: "middleLine" })}>Middle Line</Button>
                                        </div>
                                        <div>
                                            <Button style={{ width: "7rem" }} onClick={() => this.setState({ tableComponent: "bottomLine" })}>Bottom Line</Button>
                                        </div>
                                        <div>
                                            <Button style={{ width: "7rem" }} onClick={() => this.setState({ tableComponent: "fullHousie" })}>Full Housie</Button>
                                        </div>

                                    </div>
                                    <Row>
                                        <Col md={7} className="text-left">
                                            {this.state.tableComponent === "topLine" ?
                                                <ShowTable type={"topLine"} gameId={this.props.gameData.gameId} refresher={this.state.refresher} />
                                                : <></>}
                                            {this.state.tableComponent === "middleLine" ?
                                                <ShowTable type={"middleLine"} gameId={this.props.gameData.gameId} refresher={this.state.refresher} />
                                                : <></>}
                                            {this.state.tableComponent === "bottomLine" ?
                                                <ShowTable type={"bottomLine"} gameId={this.props.gameData.gameId} refresher={this.state.refresher} />
                                                : <></>}
                                            {this.state.tableComponent === "fullHousie" ?
                                                <ShowTable type={"fullHousie"} gameId={this.props.gameData.gameId} refresher={this.state.refresher} />
                                                : <></>}
                                            
                                        </Col>
                                        <Col md={5} className="text-left">
                                            <Card className="shadow-sm">
                                                <CardHeader>
                                                    <h6>Winners</h6>
                                                </CardHeader>
                                                <CardBody>
                                                    <Table bordered>
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Name</th>
                                                                <th>Users</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <th scope="row">Top Line</th>
                                                                <td>{this.props.gameData.tLWinnerData !== "" ? this.props.gameData.tLWinnerData.name : ""}</td>
                                                                <td>{this.props.gameData.tLWinnerData !== "" ? this.props.gameData.tLWinnerData.mobile : ""}</td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row">Bottom Line</th>
                                                                <td>{this.props.gameData.mLWinnerData !== "" ? this.props.gameData.mLWinnerData.name : ""}</td>
                                                                <td>{this.props.gameData.mLWinnerData !== "" ? this.props.gameData.mLWinnerData.mobile : ""}</td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row">Middle Line</th>
                                                                <td>{this.props.gameData.bLWinnerData !== "" ? this.props.gameData.bLWinnerData.name : ""}</td>
                                                                <td>{this.props.gameData.bLWinnerData !== "" ? this.props.gameData.bLWinnerData.mobile : ""}</td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row">Full Housie</th>
                                                                <td>{this.props.gameData.fHWinnerData !== "" ? this.props.gameData.fHWinnerData.name : ""}</td>
                                                                <td>{this.props.gameData.fHWinnerData !== "" ? this.props.gameData.fHWinnerData.mobile : ""}</td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </CardBody>
                                            </Card>

                                        </Col>
                                    </Row>

                                </CardBody>
                            </Card>
                            : <></>}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        dataArray: state.dataArray,
        gameData: state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectGame: (data) => dispatch(selectGame(data)),
        selectNumber: (num) => dispatch(selectNumber(num)),
        fetchWinners: (data) => dispatch(fetchWinners(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);


