# Modified Frontier

This repository is used as a node template to test some Solidity contracts on a Substrate network with Ethereum compatible layers. It is built on the base of [the original Frontier repository](https://github.com/substrate-developer-hub/substrate-node-template).

To test contracts using [the HardHat tools](https://hardhat.org/) the following have been introduced into the original code:
* five account with some ETH with public keys derived from [the default HardHat seed phrase](https://hardhat.org/hardhat-network/reference/#accounts) in the file: ["./template/node/src/chain_spec.rs"](./template/node/src/chain_spec.rs)
* `MILLISECS_PER_BLOCK = 1000` in the file: ["./template/runtime/src/lib.rs"](./template/runtime/src/lib.rs)
* `ExistentialDeposit=0` in the file: ["./template/runtime/src/lib.rs"](./template/runtime/src/lib.rs)

## Usage
1. Run the following command (from the repository root dir) to build: `cargo build --release`. It could take 10 or more minutes depending on your machine characteristics.
2. Run the following command (from the repository root dir) to up the local Substrate test network with temporary storage:`./target/release/frontier-template-node --dev --tmp`
3. Configure and run your test on the executing network.