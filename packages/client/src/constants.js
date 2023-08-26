const CONTRACT_ADDRESS = "0x3ee3a229FD536B80B2F848020dF960EAdF1a307A"

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