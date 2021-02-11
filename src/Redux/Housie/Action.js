import { SELECT_NUMBER, SELECT_GAME, ANNOUNCE_TL_WINNER, ANNOUNCE_ML_WINNER, ANNOUNCE_BL_WINNER, ANNOUNCE_FH_WINNER, TL_WINNER_DATA, ML_WINNER_DATA, BL_WINNER_DATA, FH_WINNER_DATA } from './Types'
import axios from 'axios'

export const selectNumber = (num) => {
    console.log(num)
    return {
        type: SELECT_NUMBER,
        payload: num
    }
}

export const selectGame = (data) => {
    return {
        type: SELECT_GAME,
        payload: JSON.parse(data)
    }
}

export const annonceWinner = (data) => {
    if (data.type === "topLine") {
        return {
            type: ANNOUNCE_TL_WINNER,
            payload: data
        }
    }
    else if (data.type === "middleLine") {
        return {
            type: ANNOUNCE_ML_WINNER,
            payload: data
        }
    }
    else if (data.type === "bottomLine") {
        return {
            type: ANNOUNCE_BL_WINNER,
            payload: data
        }
    }
    else if (data.type === "fullHousie") {
        return {
            type: ANNOUNCE_FH_WINNER,
            payload: data
        }
    }

}

export const tlWinnerData = (data) => {
    return {
        type: TL_WINNER_DATA,
        payload: data
    }
}
export const mlWinnerData = (data) => {
    return {
        type: ML_WINNER_DATA,
        payload: data
    }
}
export const blWinnerData = (data) => {
    return {
        type: BL_WINNER_DATA,
        payload: data
    }
}
export const fhWinnerData = (data) => {
    return {
        type: FH_WINNER_DATA,
        payload: data
    }
}



export const fetchWinners = (gid) => {
    return (dispatch) => {
        axios.get(`http://localhost:3001/admin/game/winner/all/${gid}`, {
            headers: {
                'Authorization' : `Bearer ${localStorage.getItem("tokn")}`
            }
        }).then(response => {
            console.log("fetch winners data =================")
            if (response.data.statusCode === 200) {
                let data = response.data.result;
                const tlData = data.topLine.length ? {
                    mobile: data.topLine[0].mobile,
                    name: data.topLine[0].name,
                    _id: data.topLine[0]._id,
                    type: "topLine"
                } : "";
                const mlData = data.middleLine.length ? {
                    mobile: data.middleLine[0].mobile,
                    name: data.middleLine[0].name,
                    _id: data.middleLine[0]._id,
                    type: "topLine"
                } : "";
                const blData = data.bottomLine.length ? {
                    mobile: data.bottomLine[0].mobile,
                    name: data.bottomLine[0].name,
                    _id: data.bottomLine[0]._id,
                    type: "topLine"
                } : "";
                const fhData = data.fullHousie.length ? {
                    mobile: data.fullHousie[0].mobile,
                    name: data.fullHousie[0].name,
                    _id: data.fullHousie[0]._id,
                    type: "topLine"
                } : "";
                dispatch(tlWinnerData(tlData))
                dispatch(mlWinnerData(mlData))
                dispatch(blWinnerData(blData))
                dispatch(fhWinnerData(fhData))
            }

        }).catch(error => {
            console.log(error)
        })
    }


}



// const fetchWinners = () => {
//     axios.get(`http://localhost:3001/admin/game/winner/all/`, {
//         headers: {
//             'Authorization': `Bearer ${localStorage.getItem("tokn")}`
//         }
//     }).then(response => {
//         if (response.data.statusCode === 200) {
//             console.log(response.data.result)
//         }

//     }).catch(error => {
//         console.log(error)
//     })
// }