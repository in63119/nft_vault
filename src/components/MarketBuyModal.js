import React, { useState } from "react";

// Mui
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

// Recoil
import { useRecoilValue } from "recoil";
import { addressState } from "../recoil/account";

// Util
import { buyItem } from "../utils/web3";

function MarketBuyModal({ open, handleClose, nft }) {
  const account = useRecoilValue(addressState);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async () => {
    setIsLoading(true);

    try {
      const result = await buyItem(nft, account, nft.price);
      if (result) {
        setIsLoading(false);
        handleClose();
        window.location.reload();
      } else {
        setIsLoading(false);
        handleClose();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error buying item", error);
      setIsLoading(false);
      handleClose();
      window.location.reload();
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      {isLoading ? (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: "15px",
            }}
          >
            <img src={nft?.image} alt={nft?.name} style={{ width: "150px" }} />
          </Box>
          <Typography variant="h6">{nft?.name}</Typography>
          <Typography sx={{ mt: 2 }}>{nft?.description}</Typography>
          <Typography sx={{ mt: 2 }}>가격 : {nft?.price} KLAY</Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleBuy}
            sx={{ mt: 2 }}
          >
            구매
          </Button>
        </Box>
      )}
    </Modal>
  );
}

export default MarketBuyModal;
