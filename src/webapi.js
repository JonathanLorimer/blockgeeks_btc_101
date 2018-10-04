'use strict'

// const blockCypherURL = 'https://api.blockcypher.com/v1/btc/main'
const request = require('request')
const COIN = 1000000

class WebAPI {
	constructor(){
		this.api = 'https://api.blockcypher.com/v1/btc/'
		this.network = "main"
	}

	changeNetwork(network) {
		if(network === "mainnet") this.network = "main"
		else if (network === "testnet") this.network = "test3"
	}

	getLastBlockNumber() {
		let url = this.api + this.network
		return new Promise((resolve, reject) => {
			request(url, (err, res, body) => {
				if (err) reject()
				let result = JSON.parse(body)
				resolve(result.height)
			})
		})
	}

	getBlock(id) {
		let url = this.api + this.network + "/blocks/" + id
		return new Promise((resolve, reject) => {
			request(url, (err, res, body) => {
				if (err) reject()
				let result = JSON.parse(body)
				resolve({
					hash: result.hash,
					number: result.height,
					time: result.time
				})
			})
		})
	}

	getBalance(addr) {
		const url = this.api + this.network + '/addrs/' + addr +'/balance'

		return new Promise((resolve, reject) => {
			request(url, (err, res, body) => {
				if (err) reject(err)
				const result = JSON.parse(body)
				resolve(result.balance / COIN)
			})
		})
	}

	getUtxos(addr) {
		const url = this.api + this.network + '/addrs/' + addr + '?unspentOnly=true&includesScript=true'

		return new Promise ((resolve, reject) => {
			request(url, (err, res, body) => {
				if (err) reject(err)
				const data = JSON.parse(body)
				const result = data.txrefs.map(tx => {
					return {
						hash: tx.tx_hash,
						index: tx.tx_output_n,
						value: tx.value,
						script: tx.script
					}
				})
				resolve({data: result})
			})
		})
	}
}

module.exports = WebAPI