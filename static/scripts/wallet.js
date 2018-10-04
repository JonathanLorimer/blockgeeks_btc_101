// Create New Wallet button click
$("#create-wallet").click(() => {
	$('#old-wallet').hide()
	$('#new-wallet').show()
	$('#output-area').html("")
})

// Network selection and Create button click
$('#new-wallet-form').on('submit', (e) => {
	e.preventDefault(e)
	let network = $('input[name=network]:checked').val()

	bitcoin.createWallet(network).then((wallet) => {
		$('#new-wallet-form')[0].reset()
		$('#new-wallet').hide()
		$('#output-area').html(generateNewWalletInfo())
	})
})

//New Wallet confirmation button click
$('#output-area').on('click', '#confirm-key', (e) => {
	$('#output-area').html(generateWalletUI())
})

//Handle sending transaction
$('#output-area').on('click', 'tx-form button', (e) => {
	e.preventDefault(e)

	let amount = $('input[name="btc"]').val()
	let address = $('input[name="addr"]').val()

	displayAlert("danger", "Unable to send" + amount + ' to ' + addr)
})

//Import Existing Wallet button click
$('#import-wallet').click(()=>{
	$('#old-wallet').show()
	$('#new-wallet').hide()
	$('#output-area').html("")
})

//Private key unlock button click
$('#old-wallet-form').on('submit', (e)=>{
	e.preventDefault(e)
	let key = $('#input[name="cipher"]').val()

	bitcoin.createWallet("", key).then((wallet) => {
		if(wallet.privateKey === key){
			$('#old-wallet-form')[0].reset()
			$('#old-wallet').hide()
			$('output-area').html(generateWalletUI())
			updateBtcBalance()
		} else {
			displayAlert("danger", "Not a valid key, only WIF-compresed format is supported!")
		}
	}).catch((err) => {
		displayAlert("danger", "Not a valid key, only WIF-compresed format is supported!")
	})
})

// HELPERS
const displayAlert = (type, msg) => {
	let alert = `
		<div class='alert alert-dismissable alert-${type}>
			<p>${msg}</p>
			<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
		</div>
	`
	$('#alert-msg').append(alert)
}

const generateNewWalletInfo = () => {

	var html =`
		<h4> Save your private key and DO NOT lose it! </h4>
		<div class='key-info'>${bitcoin.getWallet().privateKey}</div>
		<button id='confirm-key' type='submit' class='btn btn-secondary'> Ok, got it!</button>

	`
	return html
}

const generateWalletUI = () => {
	let html = `
		<h5 id='btc-balance'> Balance: </h5>
		<h5>Address: ${bitcoin.getWallet().address}</h5>
		<h5>Send Transaction</h5>
		<form id="tx-form'>
			<div class='form-group'>
				<input type='number' min='0' step='any' name='btc' placeholder='Amount in BTC' class='form-control'>
				<input type='text' name='addr' placeholder='Recipient Address' class='form-control'>
			</div>
			<button type='submit' class='btn btn-secondary'> Send Bitcoin</button>
		</form>
	`
	return html
}

const updateBtcBalance = () => {
	bitcoin.getBalance().then((balance) => {
		$('#btc-balance').html("Balance: " + balance + " BTC")
	})
}