const wallet = require('./src/simpleWallet')

wallet.createWallet('', 'key')
.then(w => {
	return wallet.sendBitcoin(0.1, "address")
})
.then(tx => console.log(tx))