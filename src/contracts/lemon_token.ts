import Web3 from 'web3'
import { toBN } from 'web3-utils'
import { BigNumber } from 'bignumber.js'

import Lemon_token from './lemon_token.json';

BigNumber.set({ DECIMAL_PLACES: 18 })

export class Lemon_token {
    web3: Web3;
    address: string;
    contract: any;
    defaultGasPrice: number;
    currentWindow: any = window
    LNFTABI: any = LNFT_ABI
    
	constructor(address: string, symbol: string, decimals: number) {
		this.web3 = new Web3(this.currentWindow.ethereum);
		this.address = address;
		this.contract = new this.web3.eth.Contract(this.Lemon_token, address);
		this.defaultGasPrice = 20000000000;
		this.decimals = decimals;
		this.symbol = symbol;

	}

	fromBN(amount: any){
		return amount.c[0]
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

	async balanceOf(user) {
		let balance = await this.contract.methods.balanceOf(user).call();
		return this.fromBN(balance);
	}
	async balanceOf(sender: string) {
		let balance =  await this.contract.methods.balanceOf(sender).call();
		return this.fromBN(balance);
		// return this.fromBN(new BigNumber(balance).div(this.stakePrecision));
	}

	async getSymbol() {
		return this.symbol || await this.contract.methods.symbol().call();
	}

	async approveMax(sender:string, spender:string, callback) {
	  var gasPrice = await this.web3.eth.getGasPrice();
	  var tx = this.contract.methods.approve(spender, MAX_UINT256);
	  var gasLimit = await tx.estimateGas({ value: 0, from: sender, to: this.address });
	  return tx.send({
	    from: sender,
	    gasPrice: gasPrice,
	    gas: Math.round(gasLimit * 1.1)
	  }, callback);
	}

	
}

export default Lemon_token;