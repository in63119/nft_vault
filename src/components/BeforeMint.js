import React from "react";

// MUI css
import { Box, Card, CardContent, Typography, TextField } from "@mui/material";

// recoil
import { useRecoilValue, useSetRecoilState } from "recoil";
import { fileNumState } from "../recoil/files.js";
import { nftMetaState } from "../recoil/nftMeta.js";

export default function BeforeMint() {
  const fileNum = useRecoilValue(fileNumState);
  // const metaData = useRecoilValue(nftMetaState);
  const nftMeta = useSetRecoilState(nftMetaState);

  const handleName = (e) => {
    nftMeta((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  const handleDescription = (e) => {
    nftMeta((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };

  const rendering = () => {
    const result = [];

    for (let i = 0; i < fileNum.count; i++) {
      result.push(
        <Box key={i} sx={{ mb: "5%" }}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                아래의 정보로 NFT가 민팅됩니다.
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                id="nameInput"
                label="name : NFT 이름을 쓰세요."
                variant="standard"
                fullWidth
                onChange={handleName}
              />
              <TextField
                autoFocus
                margin="dense"
                id="descriptionInput"
                label="description : NFT에 관한 설명을 쓰세요."
                variant="standard"
                fullWidth
                onChange={handleDescription}
              />
            </CardContent>
          </Card>
        </Box>
      );
    }

    return result;
  };

  return <Box>{rendering()}</Box>;
}
