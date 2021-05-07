import {LOAD_WALLET, NEW_BALANCE, NEW_WALLET} from "../actionTypes";

const initialState = {
    name: undefined,
    password: undefined,
    seed: undefined,
    balance: {
        0: {

        }
    }
}

export default function (state = initialState, action) {
    switch (action.type) {
        default:
            return state
        case NEW_WALLET:
            return action.payload
        case NEW_BALANCE:
            return {
                ...state, balances: {
                    ...state.balances,
                    [action.payload.balance_id]: {
                        balance_id: action.payload.balance_id,
                        spent: 0,
                        last_block: action.payload.last_block,
                        password: action.payload.password,
                        tag: action.payload.tag,
                        status: action.payload.status,
                    }
                }
            }
        case LOAD_WALLET:
            return action.payload
    }
}