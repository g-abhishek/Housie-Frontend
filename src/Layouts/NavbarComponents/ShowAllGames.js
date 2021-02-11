import React, { useState, useEffect, Component } from 'react'
import { Button } from 'reactstrap'
import axios from 'axios'
import { MDBDataTable } from 'mdbreact'
import { connect } from 'react-redux'
import { selectGame, fetchWinners } from '../../Redux/Housie/Action'
import Swal from 'sweetalert2'
import { store } from 'react-notifications-component'
import Pagination from 'react-js-pagination'
import { ClipLoader } from 'react-spinners'


class ShowAllGames extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allGames: [],
            isAllGamesReturned: false,
            activeGameId: this.props.gameData.gameId,
            activePage: 1,
            numOfItems: 5,
            documentCounts: 0
        }
    }

    componentWillMount() {
        this.fetchPaginatedGame()
    }

    handleReduxDispatch = (data) => {


        if (this.props.gameData.gameId !== "") {
            if (this.props.gameData.gameId === data.gameId) {
                Swal.fire({
                    title: 'Confirm Stop?',
                    text: 'Stop This Game?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.value) {
                        axios.put(`https://housie-backend.herokuapp.com/admin/game/stop/`, {
                            gid: this.props.gameData.gameId
                        }, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('tokn')}`
                            }
                        })
                            .then((response) => {
                                console.log(response)
                                if (response.data.statusCode === 404) {
                                    store.addNotification({
                                        title: "Info",
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
                                    return false;
                                }
                                if (response.data.statusCode === 200) {
                                    console.log("Created");
                                    store.addNotification({
                                        title: "Started!",
                                        message: `${this.props.gameData.uniqueName} Game Stopped`,
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

                                    document.getElementById(this.props.gameData.gameId).innerHTML = "Start"
                                    this.setState({
                                        activeGameId: ""
                                    })
                                    this.props.selectGame(JSON.stringify({ gameId: "", gameName: "", gameDateTime: "", numUsers: "", done: "", uniqueName: "" }))
                                    return true;


                                }

                            }).catch((error) => {
                                this.setState({
                                    submitDisabled: false
                                })
                                console.log("error");
                                console.log(error.status)
                                store.addNotification({
                                    title: "Error!",
                                    message: "Internal Server Error!",
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
                                return false;

                            })
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        return
                    }
                })
            } else {

                Swal.fire({
                    title: 'Start Another Game?',
                    text: 'Stop Current Active Game and Start Another Game?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.value) {

                        axios.put(`https://housie-backend.herokuapp.com/admin/game/stop/`, {
                            gid: this.props.gameData.gameId
                        }, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('tokn')}`
                            }
                        })
                            .then((response) => {
                                console.log(response)
                                if (response.data.statusCode === 404) {
                                    store.addNotification({
                                        title: "Info",
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
                                    return false;
                                }
                                if (response.data.statusCode === 200) {
                                    store.addNotification({
                                        title: "Stopped!",
                                        message: `${this.props.gameData.uniqueName} Game Stopped`,
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

                                    document.getElementById(this.props.gameData.gameId).innerHTML = "Start"
                                    this.setState({
                                        activeGameId: ""
                                    })
                                    this.props.selectGame(JSON.stringify({ gameId: "", gameName: "", gameDateTime: "", numUsers: "", done: "", uniqueName: "" }))

                                    this.startGame(data)
                                    return true;


                                }

                            }).catch((error) => {
                                this.setState({
                                    submitDisabled: false
                                })
                                console.log("error");
                                console.log(error.status)
                                store.addNotification({
                                    title: "Error!",
                                    message: "Internal Server Error!",
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
                                return false;

                            })

                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        return
                    }
                })
            }
        } else {

            this.startGame(data);

        }
    }    

    
    startGame = (data) => {
        let body = {
            gid: data.gameId
        }
        axios.put(`https://housie-backend.herokuapp.com/admin/game/start/`, body, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('tokn')}`
            }
        })
            .then((response) => {
                console.log(response)
                if (response.data.statusCode === 404) {
                    // Swal.fire( response.data.message )
                    store.addNotification({
                        title: "Info",
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
                    return false;
                }
                if (response.data.statusCode === 200) {
                    console.log("Created");
                    store.addNotification({
                        title: "Started!",
                        message: `${data.uniqueName} Game Started`,
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

                    this.props.selectGame(JSON.stringify(data))
                    this.props.fetchWinners(data.gameId)
                    document.getElementById(data.gameId).innerHTML = "Stop"
                    // return true;


                }

            }).catch((error) => {
                this.setState({
                    submitDisabled: false
                })
                console.log("error");
                console.log(error.status)
                store.addNotification({
                    title: "Error!",
                    message: "Internal Server Error!",
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
                return false;

            })
    }

    handlePagination = (pageNumber) => {
        this.setState({
            activePage: pageNumber,            
        })
        this.fetchPaginatedGame(pageNumber)
    }

    fetchPaginatedGame = (pageNum = 1) => {
        axios.get(`https://housie-backend.herokuapp.com/admin/game/paginated/?page=${pageNum}&items=${this.state.numOfItems}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("tokn")}`
            }
        }).then(response => {
            console.log(response.data)
            if (response.data.statusCode === 200) {
                let rowsData = []
                for (var i = 0; i < response.data.paginatedGames.length; i++) {
                    let rowItem = response.data.paginatedGames[i]
                    console.log(rowItem)
                    rowItem["gameDate"] = `${new Date(response.data.paginatedGames[i].gameDate)}`.substr(0, 25)
                    rowItem["usersCount"] = response.data.paginatedGames[i].users
                    rowItem["playBtn"] = <Button id={rowItem._id} onClick={() => this.handleReduxDispatch({ gameId: rowItem._id, gameName: rowItem.name, gameDateTime: new Date(rowItem.gameDate), numUsers: rowItem.usersCount, done: rowItem.done, uniqueName: rowItem.uniqueName })} className="btn btn-danger py-0 px-3">{this.state.activeGameId === rowItem._id ? "Stop" : "Start"}</Button>

                    rowsData.push(rowItem)
                }
                this.setState({
                    allGames: rowsData,
                    documentCounts: response.data.gamesCount,
                    isAllGamesReturned: true
                })
            }

        }).catch(error => {
            console.log(error)
        })
    }

    render() {
        const columnData = [
            {
                label: 'Name',
                field: 'name',
                sort: 'asc',
            },
            {
                label: 'Unique Name',
                field: 'uniqueName',
                sort: 'asc',
            },
            {
                label: 'Game Date/Time',
                field: 'gameDate',
                sort: 'asc',
            },
            {
                label: 'Users',
                field: 'usersCount',
                sort: 'asc',
            },
            {
                label: 'Action',
                field: 'playBtn',
                sort: 'asc',
            },
        ]
        return (
            <React.Fragment>
                {this.state.isAllGamesReturned ?
                    <div>
                        <MDBDataTable
                            
                            bordered
                            entries={this.state.numOfItems}                            
                            striped
                            paging={false}
                            data={{
                                columns: columnData,
                                rows: this.state.allGames
                            }}
                        />
                        <Pagination 
                            itemClass="page-item"
                            linkClass="page-link"
                            activePage={this.state.activePage}
                            itemsCountPerPage={this.state.numOfItems}
                            totalItemsCount={this.state.documentCounts}
                            pageRangeDisplayed={5}
                            onChange={(val)=> this.handlePagination(val)}
                        />
                    </div>
                    : 
                    <div className="sweet-loading text-center">
                            <ClipLoader 
                                size={40}
                                color={"#fff"}
                                loading={true}
                            />
                    </div>
                    }
            </React.Fragment>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        gameData: state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectGame: (data) => dispatch(selectGame(data)),
        fetchWinners: (data) => dispatch(fetchWinners(data)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ShowAllGames);