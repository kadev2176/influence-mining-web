import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { goerli } from "wagmi/chains";
import { Routes, Route, HashRouter, Navigate } from "react-router-dom";
import { ConfigProvider } from 'antd';
import Home from './pages/Home/Home';
import Test from './pages/Test/Test';
import MintBillboard from './components/MintBillboard/MintBillboard';
import { ApiPromise } from '@polkadot/api';
import Miner from './pages/Miner/Miner';
import Landing from './pages/Landing/Landing';
import LeaderBoard from './pages/LeaderBoard/LeaderBoard';
import Dashboard from './pages/Dashboard/Dashboard';
import BidHNFT from './pages/BidHNTF/BidHNFT';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

import './fonts/Gilroy-Bold.ttf';
import './fonts/Gilroy-Regular.ttf';


declare global {
  interface Window {
    apiWs: ApiPromise;
  }
}

const chains = [goerli];

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: "2e586b0807500a0da3a4f7b66418295e" }),
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains }), ...modalConnectors({ appName: "InfluenceMining", chains })],
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <>
    <WagmiConfig client={wagmiClient}>
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 10,
            colorText: '#ffffff',
            colorPrimary: '#A0204C'
          },
        }}
      >
        <HashRouter>
          <Routes>
            <Route path='/' element={<Home />}>
              <Route path="/" element={<Landing />} />
              <Route path="/miner" element={<Miner />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leaderboard" element={<LeaderBoard />} />
              <Route path='/bid' element={<BidHNFT />} />

              <Route path="/test" element={<Test />} />
              {/* <Route path="/billboard" element={<MintBillboard />} /> */}
              <Route path='*' element={<Navigate to='/' />} />
            </Route>
          </Routes>
        </HashRouter>
      </ConfigProvider>
    </WagmiConfig>

    <Web3Modal
      projectId="2e586b0807500a0da3a4f7b66418295e"
      ethereumClient={ethereumClient}
      themeMode="dark"
      themeZIndex={1001}
    />
  </>
);
