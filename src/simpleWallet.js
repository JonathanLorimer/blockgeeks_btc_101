'use strict'

const WebAPI = require('./webapi')
const keys = require('./keys')
const tx = require('./transaction')
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

	sendBitcoin(amount, toAddr) {
		amount = (amount * COIN) / 1 //concert to number of satoshis

		return new Promise((resolve, reject) => {
			this.api.getUtxos(this.wallet.address).then(utxo => {
				return tx.create(utxo, amount, toAddr, this.wallet)
			}).then(tx => {
				resolve(tx)
			}).catch(err => reject(err))
		})
		
	}
}

module.exports = new SimpleWallet()