import React, { useEffect, useState } from "react";

// Component
import MarketModal from "./MarketModal.js";
import MarketErrModal from "./MarketErrModal.js";
import MarketBuyModal from "./MarketBuyModal.js";

// Recoil
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import { marketNfts } from "../recoil/marketNfts";
import { addressState } from "../recoil/account";
import { loadingState } from "../recoil/loading.js";

// MUI css
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
} from "@mui/material";
import SellIOutlinedconIcon from "@mui/icons-material/SellOutlined";
import SellIcon from "@mui/icons-material/Sell";
import PaidIcon from "@mui/icons-material/Paid";

// Util
import { checkSellItem } from "../utils/web3";

export default function MarketNFTs(props) {
  const [nfts, setNfts] = useRecoilState(marketNfts);
  const [isCardExpanded, setIsCardExpanded] = useState(
    nfts.nfts.map(() => false)
  );
  const { account } = props;
  const isLoading = useSetRecoilState(loadingState);
  const [modalOpen, setModalOpen] = useState(false);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [permission, setPermission] = useState(true);
  const { address } = useRecoilValue(addressState);

  const toggleCardExpansion = (index) => {
    setIsCardExpanded((prevState) =>
      prevState.map((value, i) => (i === index ? !value : value))
    );
  };

  const handleAddress = (address) => {
    window.open(
      `https://baobab.klaytnscope.com/account/${address}?tabId=txList`
    );
  };

  const handleTx = (tx) => {
    window.open(`https://baobab.klaytnscope.com/tx/${tx}?tabId=nftTransfer`);
  };

  const handleOpenModal = (nft) => {
    switch (account.type) {
      case "EOA":
        if (
          account.address &&
          account.address.toLowerCase() === address.toLowerCase()
        ) {
          setSelectedNFT(nft);
          setModalOpen(true);
        } else {
          setPermission(false);
          setModalOpen(true);
        }
        break;
      case "CA":
        if (
          nft.ownerAddress &&
          nft.ownerAddress.toLowerCase() === address.toLowerCase()
        ) {
          setSelectedNFT(nft);
          setModalOpen(true);
        } else {
          setPermission(false);
          setModalOpen(true);
        }
        break;
      default:
        setPermission(false);
        setModalOpen(true);
    }
  };

  const handleOpenBuyModal = (nft) => {
    setSelectedNFT(nft);
    setBuyModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setBuyModalOpen(false);
    setPermission(true);
  };

  useEffect(() => {
    const check = async () => {
      isLoading({ isLoading: true });

      let updateRequired = false;
      let sellNFTs = [];

      if (account.type === "EOA") {
        sellNFTs = await checkSellItem(account, null);
        updateRequired = sellNFTs.length > 0;
      } else if (account.type === "CA") {
        sellNFTs = await checkSellItem(account, nfts.nfts);
        updateRequired = sellNFTs.length > 0;
      }

      if (updateRequired) {
        const updatedNfts = nfts.nfts.map((nft) => {
          const matchingSellNftIndex = sellNFTs.findIndex(
            (sellNft) =>
              sellNft.tokenId === String(nft.tokenId) &&
              sellNft.tokenAddress.toLowerCase() ===
                nft.contractAddress.toLowerCase() &&
              sellNft.listed === true
          );
          const isSellList = matchingSellNftIndex !== -1;
          return isSellList
            ? {
                ...nft,
                isSellList,
                price: sellNFTs[matchingSellNftIndex].price,
                sellNftIndex: matchingSellNftIndex,
              }
            : { ...nft, isSellList };
        });
        setNfts({ nfts: updatedNfts });
      }

      isLoading({ isLoading: false });
    };

    check();
    // eslint-disable-next-line
  }, [account, isLoading]);

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
      {nfts.nfts?.map((nft, index) => (
        <Box
          key={index}
          sx={{
            margin: "2%",
            flex: "0 0 calc(33.33% - 16px)",
          }}
        >
          <Card sx={{ minWidth: 275, position: "relative" }}>
            {nft.isSellList ? (
              <>
                <PaidIcon
                  onClick={() => handleOpenBuyModal(nft)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 40,
                    cursor: "pointer",
                  }}
                />
                <SellIcon
                  onClick={() => handleOpenModal(nft)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    cursor: "pointer",
                  }}
                  color="secondary"
                />
              </>
            ) : (
              <SellIOutlinedconIcon
                onClick={() => handleOpenModal(nft)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  cursor: "pointer",
                }}
                color="secondary"
              />
            )}

            <CardContent>
              <Typography variant="h5">{nft.name}</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography>Owned by</Typography>
                {account.type === "EOA" ? (
                  <Typography
                    variant="h10"
                    color="blue"
                    sx={{ cursor: "pointer", ml: "4px" }}
                    onClick={() => handleAddress(account.address)}
                  >
                    {account.address?.slice(0, 6)}...
                    {account.address &&
                      account.address.slice(
                        account.address.length - 5,
                        account.address.length - 1
                      )}
                  </Typography>
                ) : (
                  <Typography
                    variant="h10"
                    color="blue"
                    sx={{ cursor: "pointer", ml: "4px" }}
                    onClick={() => handleAddress(nft.ownerAddress)}
                  >
                    {nft.ownerAddress?.slice(0, 6)}...
                    {nft.ownerAddress &&
                      nft.ownerAddress.slice(
                        nft.ownerAddress.length - 5,
                        nft.ownerAddress.length - 1
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
                  src={nft.image}
                  alt={nft.name}
                  style={{ width: "150px" }}
                />
              </Box>
              <Typography variant="h8" sx={{ mt: "3px" }}>
                {nft.description}
              </Typography>
              {nft.attributes && nft.attributes.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                  }}
                >
                  {nft.attributes.map((attribute, attrIndex) => (
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
                      checked={isCardExpanded[index]}
                      onChange={() => toggleCardExpansion(index)}
                      color="primary"
                    />
                  }
                  label="Details"
                />
                {isCardExpanded[index] && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flexWrap: "wrap",
                      p: 2,
                    }}
                  >
                    <Box sx={{ display: "flex" }}>
                      <Typography fontSize="small">
                        Contract Address :
                      </Typography>
                      {account.type === "EOA" ? (
                        <Typography
                          variant="h10"
                          color="blue"
                          fontSize="small"
                          sx={{ cursor: "pointer", ml: "4px" }}
                          onClick={() => handleAddress(nft.contractAddress)}
                        >
                          {nft.contractAddress.slice(0, 6)}...
                          {nft.contractAddress.slice(
                            nft.contractAddress.length - 5,
                            nft.contractAddress.length - 1
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
                        {nft.tokenId}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: "10px", display: "flex" }}>
                      <Typography fontSize="small">Chain : </Typography>
                      <Typography fontSize="small" sx={{ ml: "4px" }}>
                        {nft.chain}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: "10px", display: "flex" }}>
                      <Typography fontSize="small">Last Updated : </Typography>
                      <Typography fontSize="small" sx={{ ml: "4px" }}>
                        {nft.createdAt}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: "10px", display: "flex" }}>
                      <Typography fontSize="small">Transaction : </Typography>
                      <Typography
                        variant="h10"
                        color="blue"
                        fontSize="small"
                        sx={{ cursor: "pointer", ml: "4px" }}
                        onClick={() => handleTx(nft.transactionHash)}
                      >
                        {nft.transactionHash.slice(0, 6)}...
                        {nft.transactionHash.slice(
                          nft.transactionHash.length - 5,
                          nft.transactionHash.length - 1
                        )}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      ))}
      {permission ? (
        <MarketModal
          open={modalOpen}
          handleClose={handleCloseModal}
          nft={selectedNFT}
        />
      ) : (
        <MarketErrModal open={modalOpen} handleClose={handleCloseModal} />
      )}
      <MarketBuyModal
        open={buyModalOpen}
        handleClose={handleCloseModal}
        nft={selectedNFT}
      />
    </Box>
  );
}
