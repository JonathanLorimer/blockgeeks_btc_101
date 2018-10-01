'use strict'

// const blockCypherURL = 'https://api.blockcypher.com/v1/btc/main'
const request = require('request')

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
}

module.exports = WebAPI