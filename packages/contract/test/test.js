const hre = require("hardhat");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("MyEpicGame", () => {
  const deployTextFixture = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory(
      "MyEpicGame",
    );

    const gameContract = await gameContractFactory.deploy(
      // キャラクターの名前
      ['ZORO', 'NAMI', 'USOPP'],
      // キャラクターの画像を IPFS の CID に変更
      [
        'QmXxR67ryeUw4xppPLbF2vJmfj1TCGgzANfiEZPzByM5CT',
        'QmPHX1R4QgvGQrZym5dpWzzopavyNX2WZaVGYzVQQ2QcQL',
        'QmUGjB7oQLBZdCDNJp9V9ZdjsBECjwcneRhE7bHcs9HwxG',
      ],
      [100, 50, 300],
      [100, 50, 25],
      'CROCODILE', // Bossの名前
      'https://i.imgur.com/BehawOh.png', // Bossの画像
      100, // Bossのhp
      50, // Bossの攻撃力
    );
    await gameContract.deployed();

    return {
      gameContract,
    };
  }

  it("attack was successful", async () => {
    const { gameContract } = await loadFixture(deployTextFixture);

    let txn = await gameContract.mintCharacterNFT(2);

    await txn.wait();

    let hpBefore = 0;
    let hpAfter = 0;

    let NFTInfo = await gameContract.checkIfUserHasNFT();
    hpBefore = NFTInfo.hp.toNumber();

    txn = await gameContract.attackBoss();
    await txn.wait();

    NFTInfo = await gameContract.checkIfUserHasNFT();
    hpAfter = NFTInfo.hp.toNumber();

    expect(hpBefore - hpAfter).to.equal(50);
  });

  it("check boss attack does not happen if boss hp is smaller than 0", async () => {
    const { gameContract } = await loadFixture(deployTextFixture);

    let txn = await gameContract.mintCharacterNFT(0);

    await txn.wait();

    txn = await gameContract.attackBoss();
    await txn.wait();

    txn = expect(gameContract.attackBoss()).to.be.revertedWith(
      'Error: boss must have HP to attack characters.',
    );
  });


  it("check boss attack does not happen if character hp is smaller than 0", async () => {
    const { gameContract } = await loadFixture(deployTextFixture);
    let txn = await gameContract.mintCharacterNFT(1);

    await txn.wait();

    txn = await gameContract.attackBoss();
    await txn.wait();

    txn = expect(gameContract.attackBoss()).to.be.revertedWith(
      'Error: character must have HP to attack boss.',
    );
  });
});