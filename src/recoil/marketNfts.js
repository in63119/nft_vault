import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const marketNfts = atom({
  key: "marketNFTs",
  default: {
    nfts: [],
  },
  effects_UNSTABLE: [persistAtom],
});
