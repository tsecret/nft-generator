import Web3 from 'web3'
import { toBN } from 'web3-utils';
import { BigNumber } from 'bignumber.js'
import BN from 'bn.js';

import LNFT_ABI from './lemon.json';

BigNumber.set({ DECIMAL_PLACES: 18 })

export class Lemon {
    web3: Web3;
    address: string;
    contract: any;
    defaultGasPrice: number;
    currentWindow: any = window
    LNFTABI: any = LNFT_ABI
	symbol: string|null;
    
	constructor(address: string) {
		this.web3 = new Web3(this.currentWindow.ethereum);
		this.address = address;
		this.contract = new this.web3.eth.Contract(this.LNFTABI, address);
		this.defaultGasPrice = 20000000000;
		this.symbol = null;
	}

	fromBN(amount: any){
		return amount.c[0];
	}

	setProvider(provider: any) {
		this.web3.setProvider(provider)
	}

	async getSymbol() {
		return this.symbol || await this.contract.methods.symbol().call();
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

	async listedMap(tokenID: string) {
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
		const tx = this.contract.methods.buy(tokenID);
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

	async balanceOf(address: string) {
		const balance = await this.contract.methods.balanceOf(address).call();
		return balance;
	}

	async approveMax(sender: string, spender: string, callback: any) {
		const gasPrice = await this.web3.eth.getGasPrice();
		const tx = this.contract.methods.approve(spender, new BN('2').pow(new BN('256')).sub(new BN('1')));
		const gasLimit = await tx.estimateGas({ value: 0, from: sender, to: this.address });
		return tx.send({
			from: sender,
			gasPrice: gasPrice,
			gas: Math.round(gasLimit * 1.1)
		}, callback);
	}

	async approveTest(sender: string, spender: string, callback: any) {
		const gasPrice = this.defaultGasPrice;
		const tx = this.contract.methods.approve(spender, 0);
		const gasLimit = 90000;//await tx.estimateGas({ value: 0, from: sender, to: this.address });
		const transaction = {
			value: "0",
			from: sender,
			to: this.address,
			gasPrice: gasPrice.toString(),
			gas: Math.round(gasLimit * 1.1).toString(),
			data: tx.encodeABI()
		};
		console.log("transaction=", transaction);
		return this.web3.eth.sendTransaction(transaction, (error, hash) => {
			console.log("inner error", error)
			console.log("inner hash", hash)
			callback(error, hash)
		})
		}

}

export default Lemon;