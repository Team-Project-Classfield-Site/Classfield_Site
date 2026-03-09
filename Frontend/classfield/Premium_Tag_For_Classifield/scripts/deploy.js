const hre = require("hardhat");
// require("dotenv").config();

async function main() {
    const ContractFactory = await hre.ethers.getContractFactory("PremiumTag");
    console.log("Deploying contract...");

    const contract = await ContractFactory.deploy();
    await contract.waitForDeployment();

    console.log("Contract deployed to:", await contract.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });