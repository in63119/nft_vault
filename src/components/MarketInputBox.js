import React, { useState } from "react";

// Components
import MarketNFTs from "./MarketNFTs.js";

// MUI css
import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// Utils
import { checkAddress } from "../utils/web3";

// Apis
import { getNftsByAddress, getNftsByCaAddress } from "../APIs/kasCall";

// Recoil
import { useSetRecoilState } from "recoil";
import { marketNfts } from "../recoil/marketNfts";
import { loadingState } from "../recoil/loading.js";

export default function MarketInputBox() {
  const [inputAddr, setInputAddr] = useState({
    address: "",
    type: "",
  });
  const [checkAddr, setCheckAddr] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const setMarketNfts = useSetRecoilState(marketNfts);
  const isLoading = useSetRecoilState(loadingState);

  const handleClick = async () => {
    isLoading({ isLoading: true });
    const check = await checkAddress(inputAddr.address);
    setCheckAddr(check.result);

    if (check.result && check.type === "EOA") {
      const eoaNFTs = await getNftsByAddress(inputAddr.address);
      setInputAddr({
        address: inputAddr.address,
        type: check.type,
      });
      setMarketNfts({ nfts: eoaNFTs });
      setIsReady(true);
      isLoading({ isLoading: false });
    } else if (check.result && check.type === "CA") {
      const caNFTs = await getNftsByCaAddress(inputAddr.address);
      setMarketNfts({ nfts: caNFTs });
      setInputAddr({
        address: inputAddr.address,
        type: check.type,
      });
      setIsReady(true);
      isLoading({ isLoading: false });
    } else {
      setIsReady(false);
      isLoading({ isLoading: false });
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ width: "50%", ml: "3%" }}>
        {checkAddr ? (
          <TextField
            autoFocus
            margin="dense"
            id="nameInput"
            label="Address or Contract Address"
            variant="standard"
            fullWidth
            onChange={(e) =>
              setInputAddr({
                address: e.target.value,
              })
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon
                    sx={{ cursor: "pointer" }}
                    onClick={handleClick}
                  />
                </InputAdornment>
              ),
            }}
          />
        ) : (
          <TextField
            error
            margin="dense"
            id="nameInput"
            label="Address or Contract Address"
            helperText="유효한 Address 값 인지 확인해주세요."
            variant="standard"
            fullWidth
            onChange={(e) =>
              setInputAddr({
                address: e.target.value,
              })
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon
                    sx={{ cursor: "pointer" }}
                    onClick={handleClick}
                  />
                </InputAdornment>
              ),
            }}
          />
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: "3%" }}>
        {isReady ? (
          <Box>
            <MarketNFTs account={inputAddr} />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
