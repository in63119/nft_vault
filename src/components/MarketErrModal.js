import React from "react";

// Mui
import { Modal, Box, Typography, Button } from "@mui/material";

function MarketErrModal({ open, handleClose }) {
  const handleClick = () => {
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
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
        <Typography variant="h6">
          판매 요청은 소유자만 할 수 있습니다!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleClick}
          sx={{ mt: 2 }}
        >
          닫기
        </Button>
      </Box>
    </Modal>
  );
}

export default MarketErrModal;
