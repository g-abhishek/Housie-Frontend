import { SELECT_NUMBER, SELECT_GAME, ANNOUNCE_TL_WINNER, ANNOUNCE_ML_WINNER, ANNOUNCE_BL_WINNER, ANNOUNCE_FH_WINNER, TL_WINNER_DATA, ML_WINNER_DATA, BL_WINNER_DATA, FH_WINNER_DATA } from './Types'

const initialState = {
    dataArray: new Set(),
    gameId: "",
    gameName: "",
    uniqueName: "",
    gameDateTime: "",
    numUsers: 0,
    tLWinnerData: "",
    mLWinnerData: "",
    bLWinnerData: "",
    fHWinnerData: "",
}

const selectNumberReducer = (state = initialState, action) => {
    switch(action.type){
        case SELECT_NUMBER: return {
            ...state,
            dataArray: new Set([...state.dataArray, action.payload])
            // dataArray: state.dataArray.add(action.payload)
            //why it was not working bcoz, we are modifying the existing state
            //but always return new state
        }
        case SELECT_GAME: return {
            ...state,
            dataArray: new Set([...action.payload.done]),
            gameId: action.payload.gameId,
            gameName: action.payload.gameName,
            gameDateTime: action.payload.gameDateTime,
            numUsers: action.payload.numUsers,
            uniqueName: action.payload.uniqueName,
        }
        case ANNOUNCE_TL_WINNER: return {
            ...state,
            tLWinnerData: action.payload
        }
        case ANNOUNCE_ML_WINNER: return {
            ...state,
            mLWinnerData: action.payload
        }
        case ANNOUNCE_BL_WINNER: return {
            ...state,
            bLWinnerData: action.payload
        }
        case ANNOUNCE_FH_WINNER: return {
            ...state,
            fHWinnerData: action.payload
        }

        case TL_WINNER_DATA: return {
            ...state,
            tLWinnerData: action.payload
        }
        case ML_WINNER_DATA: return {
            ...state,
            mLWinnerData: action.payload
        }
        case BL_WINNER_DATA: return {
            ...state,
            bLWinnerData: action.payload
        }
        case FH_WINNER_DATA: return {
            ...state,
            fHWinnerData: action.payload
        }
        
        default: return state
    }
}

export default selectNumberReducer;