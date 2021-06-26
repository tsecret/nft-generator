import Web3 from 'web3'
import { toBN } from 'web3-utils'
import { BigNumber } from 'bignumber.js'

import COW_ABI from './cow.json';

BigNumber.set({ DECIMAL_PLACES: 18 })

export class Cow {
    web3: Web3;
    address: string;
    contract: any;
    stakeToken: any;
    yieldToken: any;
    defaultGasPrice: number;
    stakePrecision: any;
    yieldPrecision: any;
    currentWindow: any = window
    COWABI: any = COW_ABI
    
	constructor(address: string, stakeToken: string, yieldToken: string) {
		this.web3 = new Web3(this.currentWindow.ethereum);
		this.address = address;
		this.contract = new this.web3.eth.Contract(this.COWABI, address);
		this.stakeToken = stakeToken;
		this.yieldToken = yieldToken;
		this.defaultGasPrice = 20000000000;
		this.stakePrecision = new BigNumber(10).pow(new BigNumber(this.stakeToken.decimals));
		this.yieldPrecision = new BigNumber(10).pow(new BigNumber(this.yieldToken.decimals));
	}

	fromBN(amount: any){
		return amount.c[0]
	}

	setProvider(provider: any) {
		this.web3.setProvider(provider)
	}

	async stakeTokenAddress() {
		return this.stakeToken ? this.stakeToken.address : await this.contract.methods.stakeToken().call();
	}

	async yieldTokenAddress() {
		return this.yieldToken ? this.stakeToken.address : await this.contract.methods.yieldToken().call();
	}

	async totalSupply() {
		let supply = await this.contract.methods.totalSupply().call();
		return this.fromBN(new BigNumber(supply).div(this.yieldPrecision))
	}

	async totalStaked() {
		let supply = await this.contract.methods.totalstaked().call();
		return this.fromBN(new BigNumber(supply).div(this.yieldPrecision))
	}

	async gasPrice() {
		return await this.web3.eth.getGasPrice() || this.defaultGasPrice;
	}

	async stake(sender: string, amount: number, callback: any) {
		let weiAmount: any = new BigNumber(amount).times(this.stakePrecision);
		var gasPrice = await this.gasPrice();
		var tx = this.contract.methods.stake(toBN(weiAmount));
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

	async earned(sender: string) {
		let earned = await this.contract.methods.earned(sender).call();
		return this.fromBN(new BigNumber(earned).div(this.stakePrecision));
	}	
	
	async balanceOf(sender: string) {
		let balance =  await this.contract.methods.balanceOf(sender).call();
		return this.fromBN(new BigNumber(balance).div(this.stakePrecision));
	}

	async periodFinish() {
		return await this.contract.methods.periodFinish().call();
	}

	async duration() {
		return await this.contract.methods.duration().call();
	}

	async lastUpdateTime() {
		return await this.contract.methods.lastUpdateTime().call();
	}

	async startTime() {
		return await this.contract.methods.starttime().call();
	}

	async finishTime() {
		return await this.contract.methods.finishTime().call();
	}

	async initreward() {
		let initReward = await this.contract.methods.initreward().call();
		return this.fromBN(new BigNumber(initReward).div(this.yieldPrecision));
	}

	async rewardRate() {
		let rewardRate = await this.contract.methods.rewardRate().call();
		return this.fromBN(new BigNumber(rewardRate).div(this.yieldPrecision));
	}

	async getReward(sender: string, callback: any) {
		var gasPrice = await this.gasPrice();
		var tx = this.contract.methods.getReward();
		var gasLimit = await tx.estimateGas({ value: 0, from: sender, to: this.address });
		return tx.send({
			from: sender,
			gasPrice: gasPrice,
			gas: Math.round(gasLimit * 1.1)
		}, callback);
	}

	async exit(sender: string, callback: any) {
		var gasPrice = await this.gasPrice();
		var tx = this.contract.methods.exit();
		var gasLimit = await tx.estimateGas({ value: 0, from: sender, to: this.address });
		return tx.send({
		from: sender,
		gasPrice: gasPrice,
		gas: Math.round(gasLimit * 1.1)
		}, callback);
	}

	async redeem(sender: string, callback: any) {
		var gasPrice = this.defaultGasPrice;
		var tx = this.contract.methods.redeem();
		let gasLimit = 300000;
		return tx.send({
			from: sender,
			gasPrice: gasPrice,
			gas: Math.round(gasLimit * 1.1)
		}, callback);
	}

	async canRedeem(sender: string) {
		return await this.contract.methods.canRedeem(sender).call();
	}

}

export default Cow;