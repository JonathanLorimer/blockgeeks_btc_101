const WebAPI = require('./src/webapi')

let api = new WebAPI()


api.changeNetwork("testnet")
api.getNetworkInfo().then(info => console.log(info))