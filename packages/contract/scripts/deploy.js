const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy(
    ["ZORO", "NAMI", "USOPP"],
    [
      "QmXxR67ryeUw4xppPLbF2vJmfj1TCGgzANfiEZPzByM5CT",
      "QmPHX1R4QgvGQrZym5dpWzzopavyNX2WZaVGYzVQQ2QcQL",
      "QmUGjB7oQLBZdCDNJp9V9ZdjsBECjwcneRhE7bHcs9HwxG",
    ],
    [100, 200, 300],
    [100, 50, 20],
    "CROCODILE",
    "https://i.imgur.com/BehawOh.png",
    10000,
    50
  );
  const nftGame = await gameContract.deployed();

  console.log(`Contract deployed to: ${nftGame.address}`)
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

runMain();