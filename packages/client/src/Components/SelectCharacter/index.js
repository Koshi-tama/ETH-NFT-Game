import React, { useState, useEffect } from "react";
import "./SelectCharacter.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import myEpicGame from "../../utils/MyEpicGame.json";
import LoadingIndicator from "../../Components/LoadingIndicator";


const SelectCharcter = ({ setCharacterNFT }) => {

  const [characters, setCharacters] = useState([])
  const [gameContract, setGameContract] = useState(null)
  const [mintingCharacter, setMintingCharacter] = useState(false)

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract_local = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );
      setGameContract(gameContract_local);
    } else {
      console.log("Ethereum obeject not found")
    }
  }, []);

  useEffect(() => {
    const getCharacters = async () => {
      try {
        const characterTxn = await gameContract.getAllDefaultCharacters();
        console.log("characterTxn", characterTxn);

        const characters_local = characterTxn.map((character) => transformCharacterData(character));
        setCharacters(characters_local);
      } catch (error) {
        console.error(error)
      }
    }

    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
      );

      if (gameContract) {
        const characterNFT_local = await gameContract.checkIfUserHasNFT();
        setCharacterNFT(transformCharacterData(characterNFT_local));
      }
    }

    if (gameContract) {
      getCharacters();
      gameContract.on("CharacterNFTMinted", onCharacterMint);
    }

    return () => {
      if (gameContract) {
        gameContract.off("CharacterNFTMinted", onCharacterMint);
      }
    }
  }, [gameContract, setCharacterNFT])

  const mintCharaacterNFTAction = async (characterId) => {
    try {
      if (gameContract) {
        setMintingCharacter(true);
        console.log("Minting character in progress...")
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log("mintTxn: ", mintTxn);
        setMintingCharacter(false)
      }

    } catch (error) {
      console.warn("Mintcharacter Action Error: ", error)
      setMintingCharacter(false);
    }
  }

  const renderCharacters = () => {
    return (characters.map((character, index) => (
      <div className="character-item" key={character.name}>
        <div className="name-container">
          <p>{character.name}</p>
        </div>
        <img src={`https://cloudflare-ipfs.com/ipfs/${character.imageURI}`} alt={character.name} />
        <button type="button" className="character-mint-button" onClick={() => mintCharaacterNFTAction(index)}>
          {`Mint ${character.name}`}
        </button>
      </div>
    )))
  }

  return (
    <div className="select-character-container">
      <h2>一緒に戦うNFTキャラクターを選択</h2>
      {characters.length && (
        <div className="character-grid">{renderCharacters()}</div>
      )}
      {mintingCharacter && (
        <div className="loading">
          <div className="indicator">
            <LoadingIndicator />
            <p>Minting In Progress</p>
          </div>
        </div>
      )

      }
    </div>
  )
}

export default SelectCharcter;