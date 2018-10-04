'use strict'

const WebAPI = require('./webapi')
const keys = require('./keys')

class SimpleWallet {
	constructor() {
		this.api = new WebAPI()
		this.wallet = {}
	}

	getWallet(){
		return this.wallet
	}

	getBalance() {
		return this.api.getBalance(this.wallet.address)
	}

	createWallet(network="mainnet", key=0) {

		if(keys.getNetworkFromKey(key) !== "unkown"){
			network = keys.getNetworkFromKey(key)
		}
		this.api.changeNetwork(network)
		this.wallet = keys.createWallet(network, key)

		return new Promise((resolve, reject) => {
			resolve(this.wallet)
		})
	}
}

module.exports = new SimpleWallet()