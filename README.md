# Scorer Node
- Listens to request from Scoring Protocol Contract
- Evaluates Score and 
- Submits Score back to the contract
## Instructions to run

NOTE: Make sure you clone all below repositories under the same folder

### Contracts

[This repository](https://github.com/Chainscore/contracts.git) contains all the deployed contracts:
- SCORE Token
- sSCORE Staking Contract
- Score Protocol
- Identity Factory Contract
- Identity 
- Example Faucet Contract


#### Clone the repo
```bash
git clone https://github.com/Chainscore/contracts.git
```
#### Install Dependencies
```bash
npm install
```
#### Deploy Contracts
```bash
truffle migrate --network oneTestnet
```

### Scorer Node
Node is responsible for listening to requests from the ScoreProtocol contract, calculating score and submitting it back.

https://github.com/Chainscore/scorer

#### Clone the repo
```bash
git clone https://github.com/Chainscore/scorer.git
```
#### Install Dependencies
```bash
npm install
```
#### Run the node
```bash
node app.js
```

### Example Client
Demonstration of submitting request for the score of a user, this request is then listened by the scorer node and a score is returned.

- Approve and transfer SCORE tokens as fees (for processing the credit score)
- 
https://github.com/Chainscore/example-client

#### Clone the repo
```bash
git clone https://github.com/Chainscore/example-client.git
```
#### Install Dependencies
```bash
npm install
```
#### Send the transaction
```bash
node app.js
```