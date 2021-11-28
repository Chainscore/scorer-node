
import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config();


function getBalances(address: string){
    axios.get(
        `https://api.covalenthq.com/v1/1/address/
        ${address}/
        balances_v2/?
        quote-currency=USD&
        format=JSON&
        nft=true&
        no-nft-fetch=false&
        key=${process.env.COVALENT_API_KEY}`
    )
    .then((resp) => {
        console.log(resp);
    })
    .catch((err) => {
        console.log(err);
    })
}