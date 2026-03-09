require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",

  networks: {
    ganache: {
      url: 'HTTP://127.0.0.1:7545',
      port: 7545,
      accounts: [
        '0x8420ee578a98496250c4490eb0080a5caad2cbe007dddbbe5c1cd2b017efd056',
        '0xc2d58a7f615793af95f19524a47fbff957bb7a4a0b8e2e6631c92869070eeb43',
        '0x330850bf4e30cae18d5ec168ca3512435d88d4bc046fc4966eb0fcb70174030b'  
      ],
    },
    local: {
      url: 'HTTP://127.0.0.1:8545',
      port: 8545,
      accounts: ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'],
    },
  },
};
