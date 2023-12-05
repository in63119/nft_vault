import Web3 from "web3";
import {
  REACT_APP_RPC_URL,
  REACT_APP_ADDRESS,
  REACT_APP_PRIVATE_KEY,
} from "./config.js";

// Contract
import {
  MarketCA,
  MarketABI,
  AttendABI,
  AttendCA,
} from "../contract/getAbiData.js";

const web3 = new Web3(window.ethereum);
const marketContract = new web3.eth.Contract(MarketABI, MarketCA).methods;
const nftContract = new web3.eth.Contract(AttendABI, AttendCA).methods;
const accounts = window.ethereum.request({
  method: "eth_requestAccounts",
});

export const checkAddress = async (address) => {
  const result = {
    result: await web3.utils.isAddress(address),
    type: await web3.eth.getCode(address).then((res) => {
      return res === "0x" ? "EOA" : "CA";
    }),
  };
  return result;
};

export const checkSellItem = async (account, nfts) => {
  switch (account.type) {
    case "EOA":
      let result;
      const getSellerListedNFTs = await marketContract
        .getSellerListedNFTs(account.address)
        .call();

      result = getSellerListedNFTs;
      return result;

    case "CA":
      const forCaCheckAddr = nfts.map((el) => el.ownerAddress);
      let resultCa = [];

      for (let i = 0; i < forCaCheckAddr.length; i++) {
        const getSellerListedNFTs = await marketContract
          .getSellerListedNFTs(forCaCheckAddr[i])
          .call();
        if (getSellerListedNFTs.length > 0) {
          resultCa.push(getSellerListedNFTs);
        }
      }

      return resultCa.flat();

    default:
      return [];
  }
};

export const sellItem = async (nft, account, price) => {
  switch (account.privateKey) {
    case "wallet":
      if (typeof window.ethereum !== "undefined") {
        const metaWeb3 = new Web3(window.ethereum);

        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });

          const contract = new metaWeb3.eth.Contract(MarketABI, MarketCA)
            .methods;
          const nftContract = new metaWeb3.eth.Contract(
            AttendABI,
            nft.contractAddress
          ).methods;

          await nftContract
            .approve(REACT_APP_ADDRESS, nft.tokenId)
            .send({ from: accounts[0] })
            .then((result) => {
              console.log(result);
            })
            .catch((error) => {
              console.error("Error removing NFT from market", error);
              throw error;
            });

          // 컨트랙트 함수 실행
          const result = await contract
            .listNFT(nft.contractAddress, nft.tokenId, price)
            .send({ from: accounts[0] })
            .then((result) => {
              console.log(result);
            })
            .catch((error) => {
              console.error("Error removing NFT from market", error);
              throw error;
            });

          return result;
        } catch (error) {
          console.error("Error connecting to MetaMask", error);
        }
        break;
      } else {
        console.log("MetaMask is not installed");
        break;
      }
    default:
      break;
  }
};

export const buyItem = async (nft, account, price) => {
  console.log(nft, account, price);
  switch (account.privateKey) {
    case "wallet":
      if (typeof window.ethereum !== "undefined") {
        const metaWeb3 = new Web3(window.ethereum);

        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });

          const contract = new metaWeb3.eth.Contract(MarketABI, MarketCA)
            .methods;

          const gasEstimate = await contract
            .removeNFTFromMarket(nft.sellNftIndex, nft.ownerAddress)
            .estimateGas({
              from: accounts[0],
              gas: 5000000,
            });

          await contract
            .removeNFTFromMarket(nft.sellNftIndex, nft.ownerAddress)
            .send({
              from: accounts[0],
              value: await metaWeb3.utils.toWei(price, "ether"),
              gas: gasEstimate,
              gasPrice: await metaWeb3.eth.getGasPrice(),
            })
            .then((result) => {
              console.log("NFT removed from market", result);
            })
            .catch((error) => {
              console.error("Error removing NFT from market", error);
              throw error;
            });

          // Approve 받은 오너가 트랜잭션 실행
          const nftContract = new web3.eth.Contract(
            AttendABI,
            nft.contractAddress
          ).methods;
          const safeTransferFrom = await nftContract
            .safeTransferFrom(nft.ownerAddress, account.address, nft.tokenId)
            .encodeABI();
          const estimate = await nftContract
            .safeTransferFrom(nft.ownerAddress, account.address, nft.tokenId)
            .estimateGas({
              from: REACT_APP_ADDRESS,
              gas: 5000000,
            });
          await SendTransactionNoValue(
            safeTransferFrom,
            nft.contractAddress,
            estimate
          );

          // 판매자에게 지불
          const signTx = await web3.eth.accounts
            .signTransaction(
              {
                from: REACT_APP_ADDRESS,
                to: nft.ownerAddress,
                gas: 21000,
                gasPrice: await web3.eth.getGasPrice(),
                value: await web3.utils.toHex(
                  await web3.utils.toWei(price, "ether")
                ),
              },
              REACT_APP_PRIVATE_KEY
            )
            .then((res) => {
              return res.rawTransaction;
            });

          const buyResult = await web3.eth
            .sendSignedTransaction(signTx)
            .then((receipt) => {
              console.log("Transaction receipt:", receipt);
            })
            .catch((error) => {
              console.error("Error sending transaction:", error);
            });

          return buyResult;
        } catch (error) {
          console.error("Error connecting to MetaMask", error);
        }
        break;
      } else {
        console.log("MetaMask is not installed");
        break;
      }
    default:
      break;
  }
};

const SendTransactionNoValue = async (data, to, estimateGas) => {
  const result = await web3.eth.accounts
    .signTransaction(
      {
        from: REACT_APP_ADDRESS,
        to: to,
        gas: estimateGas,
        gasPrice: await web3.eth.getGasPrice(),
        data: data,
      },
      REACT_APP_PRIVATE_KEY
    )
    .then(async (Tx) => {
      await web3.eth
        .sendSignedTransaction(Tx.rawTransaction)
        .then((hash, err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("완료되었습니다.");
            return hash;
          }
        });
    });

  return result;
};

// 잔액 조회
export const getBalance = async (address) => {
  const balance = await web3.eth.getBalance(address).then(async (data) => {
    return web3.utils.fromWei(data, "ether");
  });
  let floorBalance;
  let decimal;
  let sliceIndex = 0;
  const arrayBalance = balance.split("");

  for (let i = 0; i < arrayBalance.length; i++) {
    if (arrayBalance[i] === ".") {
      sliceIndex = i;
      break;
    }
  }

  decimal = balance.slice(sliceIndex + 1);

  if (decimal.length > 4) {
    floorBalance = Number(balance).toFixed(4);
    return floorBalance;
  }

  return balance;
};

// 네트워크 상태
export const isListening = async () => {
  const peerCount = await web3.eth.net.getPeerCount();
  return peerCount;
};

// NFT Minting
export const minting = async (tokenURI, to) => {
  const mint = nftContract.methods.mintNFT(to, tokenURI).encodeABI();

  const estimate = await nftContract.methods.mintNFT(to, tokenURI).estimateGas({
    from: accounts[0],
  });

  console.log("예상 실행 가스비 견적 : ", estimate);
  // const result = await SendTransactionNoValue(mint, AttendCA, estimate);
  const result = await nftContract
    .mintNFT(to, tokenURI)
    .send({
      from: accounts[0],
      gas: estimate,
      gasPrice: await web3.eth.getGasPrice(),
    })
    .then((result) => {
      console.log("완료되었습니다.", result);
    })
    .catch((error) => {
      console.error("Error : ", error);
      throw error;
    });
  console.log("트랜잭션 해시 : ", result);
  return result;
};
