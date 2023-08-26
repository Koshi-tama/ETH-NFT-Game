import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import { ethers } from "ethers";
import SelectCharcter from './Components/SelectCharacter';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import myEpicGame from "./utils/MyEpicGame.json";
import Arena from './Components/Arena';
import LoadingIndicator from "./Components/LoadingIndicator";

// Constants
const TWITTER_HANDLE = 'proprogramer123';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== "11155111") {
        alert("Sepolia Test Networkに接続してください。")
      } else {
        console.log("Sepoliaに接続されています。")
      }

    } catch (error) {
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        setIsLoading(false);
        return;
      } else {
        console.log("We have ethereum object", ethereum);

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorize account:", account);
          setCurrentAccount(account);
        } else {
          console.log("No authorize account found!");
        }
      }
    } catch (error) {
      console.log(error);
    }
    console.log("Through setIsloading ...")
    setIsLoading(false);
  };

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Gert Metamask");
        return;
      }

      checkIfWalletIsConnected();

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      })

      console.log("Connected ", accounts[0]);
      setCurrentAccount(accounts[0]);
      checkNetwork();
    } catch (error) {
      console.log(error);
    }
  }

  const renderContract = () => {
    if (isLoading) {
      return LoadingIndicator();
    }

    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://i.imgur.com/TXBQ4cC.png"
            alt="LUFFY"
          />
          <button className='cta-button connect-wallet-button' onClick={connectWalletAction}>
            Connect Wallet To Get Started
          </button>
        </div>
      );
    } else if (currentAccount && !characterNFT) {
      return <SelectCharcter setCharacterNFT={setCharacterNFT} />
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
    }
  }

  useEffect(() => {
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer,
      );

      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        const ex_character = transformCharacterData(txn);
        setCharacterNFT(ex_character);
      }
      setIsLoading(false)
    }

    if (currentAccount) {
      fetchNFTMetadata();
    }
  }, [currentAccount])


  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚡️ METAVERSE GAME ⚡️</p>
          <p className="sub-text">プレイヤーと協力してボスを倒そう✨</p>
          {renderContract()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
