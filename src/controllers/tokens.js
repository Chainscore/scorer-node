const { getPrice, getCovalentPrice } = require("../indexing/prices-endpoint");
const { getAllTokens, getToken, createTokenEntry, updateToken, deleteToken } = require("../postgresql");


// ========== Adding new token ========== //

exports.addNewToken = async (address) => {
    address = address.toLowerCase();
    let token = await getCovalentPrice(address);
    console.log("Adding token: ", address);
    await createTokenEntry(token.contract_address, token.prices[0].price, token.contract_decimals, token.contract_ticker_symbol, token.contract_name);
    
    return;
};

// {
//     address: '0xac6df26a590f08dcc95d5a4705ae8abbc88509ef',
//     price: 2.3337913,
//     decimals: 18,
//     last_updated: 2021-12-14T07:23:45.451Z,
//     token_name: 'Aave interest bearing ENJ',
//     ticker: 'aENJ'
// }
exports.getOrAddToken = async (address) => {
    let token = await getToken(address);
    if(!token){
        await this.addNewToken(address)
        token = await getToken(address);
    } 
    return token
}


// ========== Updating tokens  ========== //

exports.updatePricesInBatch = async (tokens) => {
  let t_price;
  for (let i in tokens) {
    t_price = await getPrice(tokens[i].address);
    await updateToken(tokens[i].address, t_price);
  }
  return;
};

exports.updatePrices = async () => {
  let tokens = await getAllTokens();
  let CG_REQUEST_PER_LIMIT = process.env.CG_REQUEST_PER_LIMIT || 45;

  console.log(tokens);
  for (let i in Math.ceil(tokens.length / CG_REQUEST_PER_LIMIT) - 1) {
    this.updatePricesInBatch(
      tokens.slice(i * CG_REQUEST_PER_LIMIT, (i + 1) * CG_REQUEST_PER_LIMIT)
    );
  }
  return;
};


// this.addNewToken("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
// deleteToken("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
// exports.test = async() => {
//     let resp = await this.getOrAddToken("0xe1ba0fb44ccb0d11b80f92f4f8ed94ca3ff51d00")
//     console.log(resp)
// }

// this.test();