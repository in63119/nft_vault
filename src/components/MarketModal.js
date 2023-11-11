import React, { useState } from "react";

// Mui
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";

// Recoil
import { useRecoilValue } from "recoil";
import { addressState } from "../recoil/account";

// Util
import { sellItem } from "../utils/web3";

function MarketModal({ open, handleClose, nft }) {
  const [salePrice, setSalePrice] = useState("");
  const account = useRecoilValue(addressState);
  const [isLoading, setIsLoading] = useState(false);

  const handleSalePriceChange = (event) => {
    setSalePrice(event.target.value);
  };

  const handleSell = async () => {
    setIsLoading(true);
    const result = await sellItem(nft, account, salePrice);
    console.log(result);
    setIsLoading(false);

    handleClose();
    window.location.reload();
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
          <TextField
            label="판매 금액(Klay)"
            type="number"
            fullWidth
            margin="normal"
            value={salePrice}
            onChange={handleSalePriceChange}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSell}
            sx={{ mt: 2 }}
          >
            판매
          </Button>
        </Box>
      )}
    </Modal>
  );
}

export default MarketModal;
