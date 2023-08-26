const CONTRACT_ADDRESS = "0x6FD29E7CaA4218f7E10bA53d157b1Bb242725a02"

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
}


export { CONTRACT_ADDRESS, transformCharacterData }