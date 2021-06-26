import Web3 from 'web3'
import { toBN } from 'web3-utils'
import { BigNumber } from 'bignumber.js'

import LNFT_ABI from './lemon_nft.json';

BigNumber.set({ DECIMAL_PLACES: 18 })

export class Lemon_nft {
    web3: Web3;
    address: string;
    contract: any;
    defaultGasPrice: number;
    currentWindow: any = window
    LNFTABI: any = LNFT_ABI
    
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
		return  await this.contract.methods.totalSupply().call();
	}

	async price(tokenID: number) {
		let price =  await this.contract.methods.price(tokenID).call();
		//return this.fromBN(new BigNumber(price).div(18));
		return price;
	}

	async listed_map(tokenID: number) {
		let listedMap =  await this.contract.methods.listedMap(tokenID).call();
		//return this.fromBN(new BigNumber(price).div(18));
		return listedMap;
	}

	async mint(tokenURI: string, sender: string, price: number , callback: any) {
		let weiAmount: any = new BigNumber(price).times(18);
		var gasPrice = await this.gasPrice();
		var tx = this.contract.methods.mint(tokenURI,sender,toBN(weiAmount));
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


	async buy(tokenID:number, sender: string, callback: any) {
		// let weiAmount: any = new BigNumber(price).times(18);
		let price: any = await this.price(tokenID);
		var gasPrice = await this.gasPrice();
		var tx = this.contract.methods.buy(tokenID);
		let gasLimit = 150000;
		try {
			gasLimit = await tx.estimateGas({ value: 0, from: sender, to: this.address });
		} catch(err) {
			console.log("Gas limit error", err)
		}
		return tx.send({
			from: sender,
			value: price,
			gasPrice: gasPrice,
			gas: Math.round(gasLimit * 1.1)
		}, callback);
	}

	async update_price(tokenID:number, sender: string, new_price:number, callback: any) {
		let weiAmount: any = new BigNumber(new_price).times(18);
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

	async update_listed_status(tokenID:number, sender: string, status:string, callback: any) { //true or false
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

export default Lemon_nft;