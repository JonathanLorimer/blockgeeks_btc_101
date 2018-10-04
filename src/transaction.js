'use strict'

const keys = require('./keys')

const addPadding = (num, bytes) => {
	while(num.length < bytes*2) num = "0" + num
	return num
}

const toLE = (input) => {
	return input.match(/.{2}/g).reverse().join('')
}

const getFee = () => '10000'

const getNewTx = (inputs, outputs) => {
	return {
		version: "01000000", // 4 byte version in little-endian
		inputcount: toLE(addPadding(inputs.length.toString(16), 1)),
		inputs,
		outputcount: toLE(addPadding(outputs.length.toString(16), 1)),
		outputs,
		locktime: '00000000'
	}
}

const createInputs = (utxo, amount) => {
	let inputs = []
	let accum = 0

	// Find a list of inputs that add up to the amount
	utxo.data.forEach(data => {
		if (accum < amount){
			accum += data.value
			inputs.push(data)
		}
	})

	// Create a new array of input data structures
	inputs = inputs.map(tx => {
		let obj = {}
		obj.previoushHash = toLE(tx.hash)
		obj.previousIndex = toLE(addPadding(tx.index.toSring(16), 4) ) //in hex
		obj.scriptLength = (tx.script.length / 2).toString(16)
		obj.unlockScript = tx.script // Set to the locking script of previous UTXO
		obj. sequence = 'ffffffff'
		return obj
	})

	inputs.push(accum)
	return inputs
}

const createSingleOutput = (amount, toAddr) => {
	const pubKeyHash = keys.getKeyHashFromAddr(toAddr)
	const keyHashInBytes = (pubKeyHash.length/2).toString(16)
	let script = ''
	let output = {}
	output.value = toLE(addPadding(amount.toString(16), 8))
	output.length = (script.length/2).toString(16)
	output.script = script

	return output
}

const createOutputs = (amount, toAddr, inputValue, wallet) => {
	let outputs = []

	// Create normal output
	outputs.push(createSingleOutput(amount, toAdddr))

	// Create change output if necessary
	const change = inputValue - amount - getFee()
	if (change > 0) {
		outputs.push(createSingleOutput(change, wallet.address))
	}

	return outputs
}

const create = (utxo, amount, toAddr, wallet) => {
	const inputs = createInputs(utxo, amount)
	const inputValue = inputs.pop()
	const outputs = createOutputs(amount, toAddr, inputValue, wallet)
	const tx = getNewTx(inputs, outputs)
	return tx
}

module.exports = {
	create
}