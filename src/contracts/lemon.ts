import Web3 from 'web3'
import { toBN } from 'web3-utils'
import { BigNumber } from 'bignumber.js'

import LEMONABI from './lemon.json';

BigNumber.set({ DECIMAL_PLACES: 18 })

export class Lemon {
    web3: Web3;
    address: string;
    contract: any;
    defaultGasPrice: number;
    currentWindow: any = window
    LNFTABI: any = LEMONABI
    
	constructor(address: string) {
		this.web3 = new Web3(this.currentWindow.ethereum);
		this.address = address;
		this.contract = new this.web3.eth.Contract(this.LNFTABI, address);
		this.defaultGasPrice = 20000000000;
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

	async price(tokenID: string) {
		return await this.contract.methods.price(tokenID).call();
	}

	async listedMap(tokenID: number) {
		return await this.contract.methods.listedMap(tokenID).call();
	}

	async mint(tokenURI: string, sender: string, price: number, callback: any) {
		const prec: any = new BigNumber(10).pow(new BigNumber(18));
		let weiAmount: any = new BigNumber(price).times(prec);
		let gasPrice = await this.gasPrice();
		const tx = this.contract.methods.mint(tokenURI, sender, toBN(weiAmount));
		const NFTID: number = await tx.call();
		let gasLimit = 150000;
		try {
			gasLimit = await tx.estimateGas({ value: 0, from: sender, to: this.address });
		} catch(err) {
			console.log("Gas limit error", err)
		}
		return tx.send({
			from: sender,
			gasPrice: gasPrice,
			gas: Math.round(gasLimit * 1.1)
		}, (err: any, txHash: string) => callback(err, txHash, NFTID) );
	}

	async buy(tokenID:string, sender: string, callback: any) {
		const price: any = await this.price(tokenID);
		const gasPrice = await this.gasPrice();
		const tx = this.contract.methods.buy_for_lemon(tokenID, price);
		let gasLimit = 150000;
		try {
			gasLimit = await tx.estimateGas({ value: 0, from: sender, to: this.address });
		} catch(err) {
			console.log("Gas limit error", err)
		}
		return tx.send({
			from: sender,
			gasPrice: gasPrice,
			gas: Math.round(gasLimit * 1.1)
		}, callback);
	}

	async updatePrice(tokenID:number, sender: string, new_price:any, callback: any) {
		const prec: any = new BigNumber(10).pow(new BigNumber(18));
		let weiAmount: any = new BigNumber(new_price).times(prec);
		var gasPrice = await this.gasPrice();
		var tx = this.contract.methods.updatePrice(tokenID, toBN(weiAmount));
		let gasLimit = 150000;
		try {
			gasLimit = await tx.estimateGas({ value: 0, from: sender, to: this.address });
		} catch(err) {
			console.log("Gas limit error", err)
		}
		return tx.send({
			from: sender,
			gasPrice: gasPrice,
			gas: Math.round(gasLimit * 1.1)
		}, callback);
	}

	async updateListedStatus(tokenID:number, sender: string, status:string, callback: any) { //true or false
		var gasPrice = await this.gasPrice();
		var tx = this.contract.methods.updatePrice(tokenID, status);
		let gasLimit = 150000;
		try {
			gasLimit = await tx.estimateGas({ value: 0, from: sender, to: this.address });
		} catch(err) {
			console.log("Gas limit error", err)
		}
		return tx.send({
			from: sender,
			gasPrice: gasPrice,
			gas: Math.round(gasLimit * 1.1)
		}, callback);
	}
}

export default Lemon;