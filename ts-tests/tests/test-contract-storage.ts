import { expect } from "chai";

import Test from "../build/contracts/Storage.json"
import { createAndFinalizeBlock, customRequest, describeWithFrontier } from "./util";
import { AbiItem } from "web3-utils";

describeWithFrontier("Frontier RPC (Contract)", (context) => {
	const GENESIS_ACCOUNT = "0xd43593c715fdd31c61141abd04a99fd6822c8558";
	const GENESIS_ACCOUNT_PRIVATE_KEY = "0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a";

	const TEST_CONTRACT_BYTECODE = Test.bytecode;
	const TEST_CONTRACT_ABI = Test.abi as AbiItem[];
	const TEST_CONTRACT_DEPLOYED_BYTECODE = Test.deployedBytecode;

	it("eth_getStorageAt", async function () {
		
		const contract = new context.web3.eth.Contract(TEST_CONTRACT_ABI);

		this.timeout(15000);
		const tx = await context.web3.eth.accounts.signTransaction(
			{
				from: GENESIS_ACCOUNT,
				data: TEST_CONTRACT_BYTECODE,
				value: "0x00",
				gasPrice: "0x01",
				gas: "0x100000",
			},
			GENESIS_ACCOUNT_PRIVATE_KEY
		);

		expect(await customRequest(context.web3, "eth_sendRawTransaction", [tx.rawTransaction])).to.include({
			id: 1,
			jsonrpc: "2.0",
		});

		await createAndFinalizeBlock(context.web3);
		let receipt0 = await context.web3.eth.getTransactionReceipt(tx.transactionHash);
		let contractAddress = receipt0.contractAddress;

		let getStorage0 = await customRequest(context.web3, "eth_getStorageAt", [
			contractAddress,
			"0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc",
			"latest",
		]);
	
		expect(getStorage0.result).to.be.eq(
			"0x0000000000000000000000000000000000000000000000000000000000000000"
		);
	
		const tx1 = await context.web3.eth.accounts.signTransaction(
			{
				from: GENESIS_ACCOUNT,
				to: contractAddress,
				data: contract.methods
					.setStorage(
						"0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc",
						"0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
					).encodeABI(),
				value: "0x00",
				gasPrice: "0x01",
				gas: "0x500000",
			},
			GENESIS_ACCOUNT_PRIVATE_KEY
		);
	
		await customRequest(context.web3, "eth_sendRawTransaction", [tx1.rawTransaction]);
		await createAndFinalizeBlock(context.web3);
		let receip1 = await context.web3.eth.getTransactionReceipt(tx1.transactionHash);
	
		let getStorage1 = await customRequest(context.web3, "eth_getStorageAt", [
			contractAddress,
			"0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc",
			"latest",
		]);
	
		expect(getStorage1.result).to.be.eq(
			"0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
		);
	});
});