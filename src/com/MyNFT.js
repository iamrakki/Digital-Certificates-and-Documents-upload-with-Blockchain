import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import MyNFTABI from './MyNFTABI.json';

const MyNFT = () => {
  const [contract, setContract] = useState(null);
  const [tokenId, setTokenId] = useState(0);
  const [ipfsHash, setIpfsHash] = useState('');
  const [owner, setOwner] = useState('');

  useEffect(() => { 
    initializeWeb3(); 
  }, []);

  const privateKey = '0xaae6757d640c565936fef7fb0aa53e9be9e397428406a35ec0008401d7a70c8d';

  const initializeWeb3 = async () => { 
    try {
      const provider = new Web3.providers.HttpProvider('https://polygon-mumbai.infura.io/v3/467cb109e77349eeb28914213aab1e0a');
      const web3 = new Web3(provider);
      const contractAddress = '0x373ae1EB0A752d55f8dffa8cF8878C3812eD9583';
      const deployedContract = new web3.eth.Contract(MyNFTABI, contractAddress);
      setContract(deployedContract);
    } catch (error) { 
      console.error('Error initializing Web3:', error);
    }
  }; 
 

  const handleMint = async () => {
    if (contract) {
      const web3 = new Web3(new Web3.providers.HttpProvider('https://polygon-mumbai.infura.io/v3/467cb109e77349eeb28914213aab1e0a'));
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      web3.eth.accounts.wallet.add(account);
      web3.eth.defaultAccount = account.address;

      const toAddresses = [
        '0x6F21FdfD6416DE7fC26ea78c5aFc5de902AbCfC8',
        '0xDd470fe4dA78EE74d90074E12C467011c334432B',
        '0x29efE855BF28d296F3DAA5Cf545f447BbDc36b93',
        '0x2527Dd3aF6770fE623E301227dd9486DA4189841',
      ];
      const ipfsHashes = [
        'QmUd8n45mzjg3RfTDdQKREEirjUGrRVy8B3u6oxLaqLG5v',
        'QmWLNvDmbYrmbyAiRymK3UpTxhCTS9fiKhw56aMwgsjCMT',
        'QmSYHBLnv9Cf7PxwqXvU8iRQbovhWSxzk8BsvAdvXNhXbJ',
        'QmbZgMQmyN7k9DjzC81kbxc6RErSjYj6QhMWb4VuAAsCCt',
      ];

      try {
        const gasPrice = await web3.eth.getGasPrice();
        const nonce = await web3.eth.getTransactionCount(account.address);

        const contractMethod = contract.methods.mint(toAddresses, ipfsHashes);
        const encodedABI = contractMethod.encodeABI();

        const transaction = {
          from: account.address,
          to: contract.options.address,
          data: encodedABI,
          gasPrice,
          gas: web3.utils.toHex(3000000),
          nonce: web3.utils.toHex(nonce),
        };

        const signedTransaction = await web3.eth.accounts.signTransaction(transaction, privateKey);
        const rawTransaction = signedTransaction.rawTransaction;

        const receipt = await web3.eth.sendSignedTransaction(rawTransaction);
        console.log('Transaction receipt:', receipt);

        const transactionHash = receipt.transactionHash;
        console.log('Transaction hash:', transactionHash);

        console.log('Tokens minted successfully.');
      } catch (error) {
        console.error('Error minting tokens:', error);
      }
    }
  };

  const handleGetTokenData = async () => {
    if (contract) {
      try {
        const result = await contract.methods.getTokenData(tokenId).call();
        setIpfsHash(result.ipfsHash);
        setOwner(result.owner);
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    }
  };

  return (
    <div>
      <h1>My NFT</h1>
      <div>
        <label htmlFor="tokenId">Token ID:</label>
        <input
          type="number"
          id="tokenId"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
        <button onClick={handleGetTokenData}>Get Token Data</button>
      </div>
      <div>
        <label htmlFor="ipfsHash">IPFS Hash:</label>
        <p id="ipfsHash">{ipfsHash}</p>
      </div>
      <div>
        <label htmlFor="owner">Owner:</label>
        <p id="owner">{owner}</p>
      </div>
      <button onClick={handleMint}>Mint</button>
    </div>
  );
};

export default MyNFT;
