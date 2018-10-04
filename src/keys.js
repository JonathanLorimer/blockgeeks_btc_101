'use strict'

const crypto = require('crypto')
const base58 = require('bs58')
const ecurve = require('ecurve')
const BigInteger = require('bigi')
const getRandomValue = require('get-random-values')

const createPrivKey = () => Buffer.from(getRandomValue(new Uint8Array(32))).toString('hex')

const createKeyPair = (key = 0) => {
	const privateKey = key === 0 ? createPrivKey() : decodePrivKey(key)
	const elliptic = ecurve.getCurveByName('secp256k1')
	const publicKey = elliptic
		.G
		.multiply(BigInteger.fromHex(privateKey))
		.getEncoded(true)
		.toString('hex')

	return {private: privateKey, public: publicKey}
}

const generateAddress = (publicKey, network="mainnet") => {
	const bytes = Buffer.from(publicKey, 'hex')
	const tmp = crypto.createHash('sha256').update(bytes).digest()
	const pubKeyHash = crypto.createHash('rmd160').update(tmp).digest()

	const versionPrefix = network === "testnet" ? "6f" : "00"
	const input = versionPrefix + pubKeyHash.toString('hex')

	const newBytes = Buffer.from(input, 'hex')
	const newTmp = crypto.createHash('sha256').update(newBytes).digest()
	const checksum = crypto.createHash('sha256').update(tmp).digest()

	const addr = input + checksum.toString('hex').substr(0,8)

	const finalBytes = Buffer.from(addr, 'hex')

	return  base58.encode(finalBytes)
}

// const keys = createKeyPair()
// console.log(generateAddress(keys.public))

const getKeyHashFromAddr = (addr) => {
	const bytes = base58.decode(addr).slice(1,21)
	return bytes.toString('hex')
}

const encodePrivKey = (privateKey, network = "mainnet") => {
	const prefix = network === "testnet" ? "EF" : "80"
	const newKey = prefix + privateKey + "01"

	// Create Cheksum
	const bytes = Buffer.from(newKey, 'hex')
	const tmp = crypto.createHash('sha256').update(bytes).digest()
	const checksum = crypto.createHash('sha256').update(tmp).digest()

	// Add first 4 bytes of checksum
	const newKeyAndCheck = newKey + checksum.toString('hex').substr(0, 8)

	// Convert to base58
	const newBytes = Buffer.from(newKeyAndCheck, 'hex')
	return base58.encode(newBytes)
}

const decodePrivKey = key => base58.decode(key).slice(1,33).toString('hex')

const getNetworkFromKey = key => {
	let network = 'unknown'

	if (key !== 0){
		const first = key.charAt(0)

		if (first === 'K' || first === 'L'){
			network = "mainnet"
		} else if(first === 'c'){
			network = 'testnet'
		}
		return network
	}
}

const createWallet = (network = "mainnet", importKey = 0) => {
	const keys = createKeyPair(importKey)
	const addr = generateAddress(keys.public, network)

	return {
		privateKey: encodePrivKey(keys.private, network),
		publicKey: keys.public,
		address: addr
	}
}

module.exports = {
	createWallet,
	getNetworkFromKey,
	getKeyHashFromAddr
}