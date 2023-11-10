import React from "react";

// MUI css
import { Box } from "@mui/material";

// component
import MarketInputBox from "../components/MarketInputBox.js";

export default function Market() {
  return (
    <Box
      sx={{
        display: "flex",
        mt: "3%",
      }}
    >
      <MarketInputBox />
    </Box>
  );
}
