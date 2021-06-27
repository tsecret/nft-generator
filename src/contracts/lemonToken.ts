import Web3 from 'web3'
import { BigNumber } from 'bignumber.js'

import LemonTokenABI from './lemonToken.json';


export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
// export const MAX_UINT256 = new BN('2').pow(new BN('256')).sub(new BN('1'));   //115792089237316195423570985008687907853269984665640564039457584007913129639935
export const MAX_UINT256 = '157920892373161954235709850086879078532699846656405640394575840079';

BigNumber.set({ DECIMAL_PLACES: 18 })

export class LemonToken {
    web3: Web3;
    address: string;
    contract: any;
    defaultGasPrice: number;
    currentWindow: any = window
    ABI: any = LemonTokenABI
    
	constructor(address: string) {
		this.web3 = new Web3(this.currentWindow.ethereum);
		this.address = address;
		this.contract = new this.web3.eth.Contract(this.ABI, address);
		this.defaultGasPrice = 20000000000;
	}

	fromBN(amount: any){
		return amount.c[0] || null;
	}

	setProvider(provider: any) {
		this.web3.setProvider(provider)
	}

	async gasPrice() {
		return await this.web3.eth.getGasPrice() || this.defaultGasPrice;
	}

	async totalSupply() {
		return await this.contract.methods.totalSupply().call();
	}

	async balanceOf(sender: string) {
		return await this.contract.methods.balanceOf(sender).call();
	}

	async getSymbol() {
		return await this.contract.methods.symbol().call();
	}

	async approveMax(sender:string, spender:string, callback:any) {
	  var gasPrice = await this.web3.eth.getGasPrice();
	  var tx = this.contract.methods.approve(spender, MAX_UINT256);
	  var gasLimit = await tx.estimateGas({ value: 0, from: sender, to: this.address });
	  return tx.send({
	    from: sender,
	    gasPrice: gasPrice,
	    gas: Math.round(gasLimit * 1.1)
	  }, callback);
	}

	async allowance(sender: string, spender: string) {
		try{
			const allowedBalance: any = await this.contract.methods.allowance(sender, spender).call();
			console.log(allowedBalance);
			return allowedBalance;
		}catch(err){
			return false;
		}
	}
	
}

export default LemonToken;