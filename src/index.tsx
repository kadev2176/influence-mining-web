import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon, goerli } from "wagmi/chains";
import { BrowserRouter, Routes, Route, Navigate, HashRouter } from "react-router-dom";
import Profile from './pages/Profile/Profile';
import Ad3Transactions from './pages/Ad3Transactions/Ad3Transactions';
import InfluenceTransactions from './pages/InfluenceTransactions/InfluenceTransactions';
import Auth from './pages/Auth/Auth';
import { ConfigProvider } from 'antd';
import Home from './pages/Home/Home';

// const chains = [arbitrum, mainnet, polygon];
const chains = [arbitrum, mainnet, polygon, goerli];

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: "2e586b0807500a0da3a4f7b66418295e" }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "web3Modal", chains }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 10,
            colorText: '#ffffff'
          },
        }}
      >
        <HashRouter>
          <Routes>
            <Route path='/home' element={<Home/>}></Route>
            
            <Route path="/" element={<App />}>
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/ad3Tx" element={<Ad3Transactions />} />
              <Route path="/influenceTx" element={<InfluenceTransactions />} />
            </Route>
          </Routes>
        </HashRouter>
      </ConfigProvider>
    </WagmiConfig>

    <Web3Modal
      projectId="2e586b0807500a0da3a4f7b66418295e"
      ethereumClient={ethereumClient}
    />
  </React.StrictMode>
);
