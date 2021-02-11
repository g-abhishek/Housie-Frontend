import axios from 'axios';
import React, { Component, useState, useEffect } from 'react'
import { store } from 'react-notifications-component';
import { connect } from 'react-redux'
import { Card, CardBody, Row, Col, Button, CardHeader, Table } from 'reactstrap'

import { MDBDataTable } from 'mdbreact'

import { annonceWinner, fetchWinners } from '../../Redux/Housie/Action'
import Swal from 'sweetalert2';

class ShowTable extends Component{
    constructor(props){
        super(props)
        this.state = {
            completedUsers: [],
            isDataReturned: false,
            tLWinnerBtn: this.props.reduxData.tLWinnerData,
            mLWinnerBtn: this.props.reduxData.mLWinnerData !== "" ? true : false,
            bLWinnerBtn: this.props.reduxData.bLWinnerData !== "" ? true : false,
            fHWinnerBtn: this.props.reduxData.fHWinnerData !== "" ? true : false,
        }
    }
    
    componentWillMount(){
        this.fetchCompletedUsers()
    }
    fetchCompletedUsers = () => {

        axios.get(`http://localhost:3001/admin/game/${this.props.type}/${this.props.gameId}`, {
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

                axios.put(`http://localhost:3001/admin/game/winner/${this.props.type}`, body,
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
                        if (response.data.statusCode === 200) {
                            store.addNotification({
                                title: "Winner",
                                message: "Winner Announced",
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
    
                            : <></>}
                    </CardBody>
                </Card>
    
            </React.Fragment>
        )
    }


}

// function ShowTable(props) {

//     const [data, setData] = useState({
//         completedUsers: [],
//         isDataReturned: false,
//     })

//     const [buttonDisabled, setButtonDisabled] = useState({
//         tLWinnerBtn: props.reduxData.tLWinnerData !== "" ? true : false,
//         mLWinnerBtn: props.reduxData.mLWinnerData !== "" ? true : false,
//         bLWinnerBtn: props.reduxData.bLWinnerData !== "" ? true : false,
//         fHWinnerBtn: props.reduxData.fHWinnerData !== "" ? true : false,
//     })

//     let type = props.type

//     useEffect(() => {
//         fetchCompletedUsers()
//     }, [0])

//     const fetchCompletedUsers = () => {

//         axios.get(`http://localhost:3001/admin/game/${props.type}/${props.gameId}`, {
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem("tokn")}`
//             }
//         }).then(response => {
//             if (response.data.statusCode === 200) {
//                 let data = []
//                 if (type === "topLine") {
//                     data = response.data.result.topLine
//                 }
//                 else if (type === "middleLine") {
//                     data = response.data.result.middleLine
//                 }
//                 else if (type === "bottomLine") {
//                     data = response.data.result.bottomLine
//                 }
//                 else if (type === "fullHousie") {
//                     data = response.data.result.fullHousie
//                 }                
//                 setData({
//                     completedUsers: data,
//                     isDataReturned: true
//                 })
//             }

//         }).catch(error => {
//             console.log(error)
//         })

//         props.fetchWinners(props.gameId)
//     }

//     const handleAnnounceWinner = (data) => {
//         let storeNot = () => store.addNotification({
//             title: "Announced",
//             message: "Already Announced",
//             type: "info",
//             insert: "top",
//             container: "top-right",
//             animationIn: ["animated", "fadeIn"],
//             animationOut: ["animated", "fadeOut"],
//             dismiss: {
//                 duration: 2000,
//                 onScreen: true
//             }
//         });
//         if (type === "topLine" && props.reduxData.tLWinnerData !== "") {
//             storeNot()
//             return
//         }
//         if (type === "middleLine" && props.reduxData.mLWinnerData !== "") {
//             storeNot()
//             return
//         }
//         if (type === "bottomLine" && props.reduxData.bLWinnerData !== "") {
//             storeNot()
//             return
//         }
//         if (type === "fullHousie" && props.reduxData.fHWinnerData !== "") {
//             storeNot()
//             return
//         }
//         let body = {
//             gid: props.reduxData.gameId,
//             mob: data.mobile
//         }

//         Swal.fire({
//             title: 'Annouce Winner?',
//             text: `Announce ${data.name} as Winner ?`,
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonText: 'Confirm',
//             cancelButtonText: 'Cancel'
//         }).then((result) => {
//             if (result.value) {

//                 axios.put(`http://localhost:3001/admin/game/winner/${type}`, body,
//                     {
//                         headers: {
//                             'Authorization': `Bearer ${localStorage.getItem("tokn")}`
//                         }
//                     }).then(response => {
//                         if (response.data.statusCode === 404) {
//                             store.addNotification({
//                                 title: "Error",
//                                 message: "Not Found",
//                                 type: "info",
//                                 insert: "top",
//                                 container: "top-right",
//                                 animationIn: ["animated", "fadeIn"],
//                                 animationOut: ["animated", "fadeOut"],
//                                 dismiss: {
//                                     duration: 2000,
//                                     onScreen: true
//                                 }
//                             });
//                         }
//                         if (response.data.statusCode === 200) {
//                             store.addNotification({
//                                 title: "Winner",
//                                 message: "Winner Announced",
//                                 type: "success",
//                                 insert: "top",
//                                 container: "top-right",
//                                 animationIn: ["animated", "fadeIn"],
//                                 animationOut: ["animated", "fadeOut"],
//                                 dismiss: {
//                                     duration: 2000,
//                                     onScreen: true
//                                 }
//                             });
//                             if(type === "topLine"){
//                                 setButtonDisabled({
//                                     tLWinnerBtn: true
//                                 })
//                             }
//                             if(type === "middleLine"){
//                                 setButtonDisabled({
//                                     bLWinnerBtn: true
//                                 })
//                             }
//                             if(type === "bottomLine"){
//                                 setButtonDisabled({
//                                     bLWinnerBtn: true
//                                 })
//                             }
//                             if(type === "fullHousie"){
//                                 setButtonDisabled({
//                                     fHWinnerBtn: true
//                                 })
//                             }
//                             props.annonceWinner(data)
//                         }
//                     }).catch(error => {
//                         console.log(error)
//                         store.addNotification({
//                             title: "Error",
//                             message: "Internal Server Error",
//                             type: "danger",
//                             insert: "top",
//                             container: "top-right",
//                             animationIn: ["animated", "fadeIn"],
//                             animationOut: ["animated", "fadeOut"],
//                             dismiss: {
//                                 duration: 2000,
//                                 onScreen: true
//                             }
//                         });
//                     })

//             } else if (result.dismiss === Swal.DismissReason.cancel) {
//                 return
//             }
//         })


//     }



//     const columnData = [
//         {
//             label: 'Name',
//             field: 'name',
//             sort: 'asc',
//         },
//         {
//             label: 'Mobile',
//             field: 'mobile',
//             sort: 'asc',
//         },
//         {
//             label: 'Action',
//             field: 'playBtn',
//             sort: 'asc',
//         },
//     ]


//     return (
//         <React.Fragment>
//             <Card className="shadow-sm">
//                 <CardHeader>
//                     <h6>{type}</h6>
//                 </CardHeader>
//                 <CardBody>
//                     {data.isDataReturned ?

//                         <Table bordered>
//                             <thead>
//                                 <tr>
//                                     <th>Name</th>
//                                     <th>Mobile</th>
//                                     <th>Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {data.completedUsers.length ?
//                                 data.completedUsers.map((item, idx)=>{
//                                     return (
//                                         <tr>
//                                             <td>{item.name}</td>
//                                             <td>{item.mobile}</td>
//                                             <td><Button id={idx} onClick={() => handleAnnounceWinner({ uid: item._id, mobile: item.mobile, type: type, name: item.name })} className="btn btn-info py-0 px-3" disabled={type === "topLine" ? buttonDisabled.tLWinnerBtn : (type === "middleLine" ? buttonDisabled.mLWinnerBtn : (type === "bottomLine" ? buttonDisabled.bLWinnerBtn : type === "fullHousie" ? buttonDisabled.fHWinnerBtn : false))}>Make Winner</Button></td>
//                                         </tr>
//                                     )
//                                 })
//                                 :
//                                 <tr>
//                                     <td  colSpan="3">No Data Found</td>
//                                 </tr>
//                                 }
                                
                                
//                             </tbody>
//                         </Table>

//                         : <></>}
//                 </CardBody>
//             </Card>

//         </React.Fragment>
//     )
// }

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