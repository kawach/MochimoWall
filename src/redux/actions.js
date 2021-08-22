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

export const newBalance = (balance_id, tag = undefined, tagStatus = undefined) => {
    return {
        type: NEW_BALANCE,
        payload: {
            balance_id: balance_id,
            tag: tag,
            status: tagStatus
        }
    }
}

export const loadWallet = (encryptedSeed, check_password,count,naked) => {
    return {
        type: LOAD_WALLET,
        payload: {
            encryptedSeed,check_password,count,naked
        }
    }

}