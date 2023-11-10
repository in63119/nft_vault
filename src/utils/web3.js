import Web3 from "web3";
import { REACT_APP_RPC_URL } from "./config.js";

const web3 = new Web3(REACT_APP_RPC_URL);

export const checkAddress = async (address) => {
  const result = {
    result: await web3.utils.isAddress(address),
    type: await web3.eth.getCode(address).then((res) => {
      return res === "0x" ? "EOA" : "CA";
    }),
  };
  return result;
};
