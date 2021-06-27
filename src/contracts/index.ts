import Lemon from './lemon';
import LemonToken from './lemonToken';
import NFT_W_L from './NFT_W_L';

import config from '../config';

const contract: any = new Lemon(config.CONTRACT_ADDRESS);
const token: any = new LemonToken(config.TOKEN_CONTRACT)

const isApproved = async (wallet: string) => {
    const allowed: any = await token.allowance(localStorage.wallet, config.CONTRACT_ADDRESS);
    if(allowed){
        return true;
    } else {
        return await new Promise((resolve, reject) => token.approveMax(localStorage.wallet, config.CONTRACT_ADDRESS, (err: any, txHash: string) => {
            if(err) reject(false);
            resolve(true)
        }))
    }

}


export {
    Lemon,
    LemonToken,
    NFT_W_L,
    isApproved
}