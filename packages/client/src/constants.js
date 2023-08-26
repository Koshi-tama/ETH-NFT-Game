const CONTRACT_ADDRESS = "0x0ad5afD6ae0b6F5ae7d228B6138A1651bF6419AD"

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