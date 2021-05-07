import {NEW_WALLET, NEW_BALANCE, LOAD_WALLET} from "./actionTypes"

export const newWallet = (name,encryptedSeed,checkPassord) => {
   return {
       type: NEW_WALLET,
       payload: {
           name: name,
           encryptedSeed: encryptedSeed,
           check_password: checkPassord,
           version: "1.0",

       }
   }
}

export const newBalance = (balance_id,lastBlock, tag = undefined, tagStatus = undefined) => {
    return {
        type: NEW_BALANCE,
        payload: {
            balance_id: balance_id,
            tag: tag,
            last_block: lastBlock,
            status: tagStatus
        }
    }
}

export const loadWallet = (wallet) => {
    return {
        type: LOAD_WALLET,
        payload: {
            ...wallet
        }
    }
}