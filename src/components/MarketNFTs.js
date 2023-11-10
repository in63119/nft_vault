import React, { useState } from "react";

// Recoil
import { useRecoilValue } from "recoil";
import { marketNfts } from "../recoil/marketNfts";

// MUI css
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
} from "@mui/material";

export default function MarketNFTs(props) {
  const { nfts } = useRecoilValue(marketNfts);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const { account } = props;

  const toggleCardExpansion = () => {
    setIsCardExpanded(!isCardExpanded);
  };

  const handleAddress = (address) => {
    window.open(
      `https://baobab.klaytnscope.com/account/${address}?tabId=txList`
    );
  };

  const handleTx = (tx) => {
    window.open(`https://baobab.klaytnscope.com/tx/${tx}?tabId=nftTransfer`);
  };

  return (
    <Box>
      <Typography variant="h5">{nfts[0].name}</Typography>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography>Owned by</Typography>
        {account.type === "EOA" ? (
          <Typography
            variant="h10"
            color="blue"
            sx={{ cursor: "pointer", ml: "4px" }}
            onClick={() => handleAddress(account.address)}
          >
            {account.address.slice(0, 6)}...
            {account.address.slice(
              account.address.length - 5,
              account.address.length - 1
            )}
          </Typography>
        ) : (
          <Typography
            variant="h10"
            color="blue"
            sx={{ cursor: "pointer", ml: "4px" }}
            onClick={() => handleAddress(nfts[0].ownerAddress)}
          >
            {nfts[0].ownerAddress.slice(0, 6)}...
            {nfts[0].ownerAddress.slice(
              nfts[0].ownerAddress.length - 5,
              nfts[0].ownerAddress.length - 1
            )}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: "15px",
        }}
      >
        <img
          src={nfts[0].image}
          alt={nfts[0].name}
          style={{ width: "150px" }}
        />
      </Box>
      <Typography variant="h8" sx={{ mt: "3px" }}>
        {nfts[0].description}
      </Typography>
      {nfts[0].attributes && nfts[0].attributes.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {nfts[0].attributes.map((attribute, attrIndex) => (
            <Box
              key={attrIndex}
              sx={{
                display: "flex",
                alignItems: "center",
                margin: "10px",
              }}
            >
              <Card
                sx={{
                  minWidth: 60,
                  backgroundColor: "#F1F1F1",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h10" fontSize="small">
                      {attribute.trait_type}
                    </Typography>
                    <Typography
                      variant="h10"
                      fontSize="small"
                      sx={{ mt: "3px" }}
                    >
                      {attribute.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      ) : null}
      <Box>
        <FormControlLabel
          control={
            <Switch
              checked={isCardExpanded}
              onChange={toggleCardExpansion}
              color="primary"
            />
          }
          label="Details"
        />
        {isCardExpanded && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              p: 2,
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Typography fontSize="small">Contract Address :</Typography>
              {account.type === "EOA" ? (
                <Typography
                  variant="h10"
                  color="blue"
                  fontSize="small"
                  sx={{ cursor: "pointer", ml: "4px" }}
                  onClick={() => handleAddress(nfts[0].contractAddress)}
                >
                  {nfts[0].contractAddress.slice(0, 6)}...
                  {nfts[0].contractAddress.slice(
                    nfts[0].contractAddress.length - 5,
                    nfts[0].contractAddress.length - 1
                  )}
                </Typography>
              ) : (
                <Typography
                  variant="h10"
                  color="blue"
                  fontSize="small"
                  sx={{ cursor: "pointer", ml: "4px" }}
                  onClick={() => handleAddress(account.address)}
                >
                  {account.address.slice(0, 6)}...
                  {account.address.slice(
                    account.address.length - 5,
                    account.address.length - 1
                  )}
                </Typography>
              )}
            </Box>
            <Box sx={{ mt: "10px", display: "flex" }}>
              <Typography fontSize="small">Token ID : </Typography>
              <Typography fontSize="small" sx={{ ml: "4px" }}>
                {nfts[0].tokenId}
              </Typography>
            </Box>
            <Box sx={{ mt: "10px", display: "flex" }}>
              <Typography fontSize="small">Chain : </Typography>
              <Typography fontSize="small" sx={{ ml: "4px" }}>
                {nfts[0].chain}
              </Typography>
            </Box>
            <Box sx={{ mt: "10px", display: "flex" }}>
              <Typography fontSize="small">Last Updated : </Typography>
              <Typography fontSize="small" sx={{ ml: "4px" }}>
                {nfts[0].createdAt}
              </Typography>
            </Box>
            <Box sx={{ mt: "10px", display: "flex" }}>
              <Typography fontSize="small">Transaction : </Typography>
              <Typography
                variant="h10"
                color="blue"
                fontSize="small"
                sx={{ cursor: "pointer", ml: "4px" }}
                onClick={() => handleTx(nfts[0].transactionHash)}
              >
                {nfts[0].transactionHash.slice(0, 6)}...
                {nfts[0].transactionHash.slice(
                  nfts[0].transactionHash.length - 5,
                  nfts[0].transactionHash.length - 1
                )}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
