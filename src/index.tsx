import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon, goerli } from "wagmi/chains";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TwitterOauth from './pages/TwitterOauth/TwitterOauth';
import Profile from './pages/Profile/Profile';
import Ad3Transactions from './pages/Ad3Transactions/Ad3Transactions';
import InfluenceTransactions from './pages/InfluenceTransactions/InfluenceTransactions';
import Auth from './pages/Auth/Auth';
import { ConfigProvider } from 'antd';

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
            colorPrimary: '#F4801A',
            borderRadius: 10
          },
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/auth" element={<Auth />} />
              <Route path="/oauth/twitter" element={<TwitterOauth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/ad3Tx" element={<Ad3Transactions />} />
              <Route path="/influenceTx" element={<InfluenceTransactions />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </WagmiConfig>

    <Web3Modal
      projectId="2e586b0807500a0da3a4f7b66418295e"
      ethereumClient={ethereumClient}
    />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
