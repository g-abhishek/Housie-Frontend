import axios from 'axios';
import React, { Component, useState, useEffect } from 'react'
import { store } from 'react-notifications-component';
import { connect } from 'react-redux'
import { Card, CardBody, Row, Col, Button, CardHeader, Table } from 'reactstrap'

import { MDBDataTable } from 'mdbreact'

import { annonceWinner, fetchWinners } from '../../Redux/Housie/Action'
import Swal from 'sweetalert2';
import { ClipLoader } from 'react-spinners';

class ShowTable extends Component{
    constructor(props){
        super(props)
        this.state = {
            completedUsers: [],
            isDataReturned: false,
            fetchIntervalID: "",
            tLWinnerBtn: this.props.reduxData.tLWinnerData,
            mLWinnerBtn: this.props.reduxData.mLWinnerData !== "" ? true : false,
            bLWinnerBtn: this.props.reduxData.bLWinnerData !== "" ? true : false,
            fHWinnerBtn: this.props.reduxData.fHWinnerData !== "" ? true : false,
        }
    }
    
    componentWillMount(){        
        var fetchIntervalID = setInterval(this.fetchCompletedUsers, 1000)
        this.setState({
            fetchIntervalID: fetchIntervalID
        })
    }
    componentWillUnmount(){
        clearInterval(this.state.fetchIntervalID)
    }

    fetchCompletedUsers = () => {
        console.log("fetchCompletedUsers")
        axios.get(`https://housie-backend.herokuapp.com/admin/game/${this.props.type}/${this.props.gameId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("tokn")}`
            }
        }).then(response => {
            
            if (response.data.statusCode === 200) {
                let data = []
                if (this.props.type === "topLine") {
                    data = response.data.result.topLine
                }
                else if (this.props.type === "middleLine") {
                    data = response.data.result.middleLine
                }
                else if (this.props.type === "bottomLine") {
                    data = response.data.result.bottomLine
                }
                else if (this.props.type === "fullHousie") {
                    data = response.data.result.fullHousie
                }                
                this.setState({
                    completedUsers: data,
                    isDataReturned: true
                })
            }

        }).catch(error => {
            console.log(error)
        })

        this.props.fetchWinners(this.props.gameId)
    }
    handleAnnounceWinner = (data) => {
        let storeNot = () => store.addNotification({
            title: "Announced",
            message: "Winner Already Announced",
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
        if (this.props.type === "topLine" && this.props.reduxData.tLWinnerData !== "") {
            storeNot()
            return
        }
        if (this.props.type === "middleLine" && this.props.reduxData.mLWinnerData !== "") {
            storeNot()
            return
        }
        if (this.props.type === "bottomLine" && this.props.reduxData.bLWinnerData !== "") {
            storeNot()
            return
        }
        if (this.props.type === "fullHousie" && this.props.reduxData.fHWinnerData !== "") {
            storeNot()
            return
        }
        let body = {
            gid: this.props.reduxData.gameId,
            mob: data.mobile,
            uniqueName: this.props.reduxData.uniqueName
        }

        Swal.fire({
            title: 'Annouce Winner?',
            text: `Announce ${data.name} as Winner ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.value) {

                axios.put(`https://housie-backend.herokuapp.com/admin/game/winner/${this.props.type}`, body,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("tokn")}`
                        }
                    }).then(response => {
                        if (response.data.statusCode === 404) {
                            store.addNotification({
                                title: "Error",
                                message: "Not Found",
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
                        if (response.data.statusCode === 200 || response.data.statusCode === 300) {
                            store.addNotification({
                                title: "Winner",
                                message: response.data.message,
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
                            if(this.props.type === "topLine"){
                                this.setState({
                                    tLWinnerBtn: true
                                })
                            }
                            if(this.props.type === "middleLine"){
                                this.setState({
                                    mLWinnerBtn: true
                                })
                            }
                            if(this.props.type === "bottomLine"){
                                this.setState({
                                    bLWinnerBtn: true
                                })
                            }
                            if(this.props.type === "fullHousie"){
                                this.setState({
                                    fHWinnerBtn: true
                                })
                            }
                            this.props.annonceWinner(data)
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

            } else if (result.dismiss === Swal.DismissReason.cancel) {
                return
            }
        })


    }

    render(){
        return (
            <React.Fragment>
                <Card className="shadow-sm">
                    <CardHeader>
                        <h6>{this.props.type}</h6>
                    </CardHeader>
                    <CardBody>
                        {this.state.isDataReturned ?
    
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Mobile</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.completedUsers.length ?
                                    this.state.completedUsers.map((item, idx)=>{
                                        return (
                                            <tr>
                                                <td>{item.name}</td>
                                                <td>{item.mobile}</td>
                                                <td><Button id={idx} onClick={() => this.handleAnnounceWinner({ uid: item._id, mobile: item.mobile, type: this.props.type, name: item.name })} className="btn btn-info py-0 px-3" disabled={this.props.type === "topLine" ? this.state.tLWinnerBtn : (this.props.type === "middleLine" ? this.state.mLWinnerBtn : (this.props.type === "bottomLine" ? this.state.bLWinnerBtn : this.props.type === "fullHousie" ? this.state.fHWinnerBtn : false))}>Make Winner</Button></td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr>
                                        <td  colSpan="3">No Data Found</td>
                                    </tr>
                                    }
                                    
                                    
                                </tbody>
                            </Table>
    
                            : 
                            <div className="sweet-loading text-center">
                                    <ClipLoader 
                                        size={40}
                                        color={"#fff"}
                                        loading={true}
                                    />
                            </div>
                            }
                    </CardBody>
                </Card>
    
            </React.Fragment>
        )
    }


}


const mapStateToProps = (state) => {
    return {
        reduxData: state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        annonceWinner: (data) => dispatch(annonceWinner(data)),
        fetchWinners: (data) => dispatch(fetchWinners(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowTable);