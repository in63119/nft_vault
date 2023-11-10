import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { SnackbarProvider } from "notistack";

// pages
import Main from "./pages/Main.js";
import NFT from "./pages/NFT.js";
import Mint from "./pages/Mint.js";
import Market from "./pages/Market.js";

// components
import TabSelector from "./components/TabSelector.js";
import Header from "./components/Header.js";
import Loading from "./components/Loading.js";
import Snackbar from "./components/Snackbar.js";

// recoil
import { useRecoilValue, useRecoilState } from "recoil";
import { loadingState } from "./recoil/loading.js";
import { addressState } from "./recoil/account.js";

function App() {
  const isLoading = useRecoilValue(loadingState);
  const [address, setAddress] = useRecoilState(addressState);

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        try {
          window.ethereum.on("accountsChanged", (accounts) => {
            if (address.address !== accounts[0]) {
              setAddress({ address: accounts[0], privateKey: "wallet" });
              if (!localStorage.getItem("refreshed")) {
                localStorage.setItem("refreshed", "true");
                window.location.reload();
              }
            }
          });
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        console.log("MetaMask is not installed");
      }
    };

    loadWeb3();
    localStorage.removeItem("refreshed");
  }, [address.address, setAddress]);

  return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
        <Header />
        {isLoading.isLoading ? <Loading /> : null}
        {address.address.length === 0 ? null : <TabSelector />}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/NFT" element={<NFT />} />
          <Route path="/Mint" element={<Mint />} />
          <Route path="/Market" element={<Market />} />
        </Routes>
        <Snackbar />
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
