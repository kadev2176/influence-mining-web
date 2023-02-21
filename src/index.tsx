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
import { goerli } from "wagmi/chains";
import { Routes, Route, HashRouter } from "react-router-dom";
import Profile from './pages/Profile/Profile';
import Ad3Transactions from './pages/Ad3Transactions/Ad3Transactions';
import InfluenceTransactions from './pages/InfluenceTransactions/InfluenceTransactions';
import Auth from './pages/Auth/Auth';
import { ConfigProvider } from 'antd';
import Home from './pages/Home/Home';
import Test from './pages/Test/Test';
import MintBillboard from './components/MintBillboard/MintBillboard';
import BidWar from './pages/BidWar/BidWar';
import { ApiPromise } from '@polkadot/api';
import SocialInfluenceToken from './pages/SocialInfluenceToken/SocialInfluenceToken';
import InfluenceMining from './pages/InfluenceMining/InfluenceMining';
import Boost from './pages/Boost/Boost';
import Ad3Mining from './pages/Ad3Mining/Ad3Mining';
import DaoBattle from './pages/DaoBattle/DaoBattle';
import TreasureHunt from './pages/TreasureHunt/TreasureHunt';
import Vault from './pages/Vault/Vault';
import Landing from './pages/Landing/Landing';

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
  connectors: modalConnectors({ appName: "InfluenceMining", chains }),
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
              <Route path="/auth" element={<Auth />} />
              <Route path="/vault" element={<Vault />} />
            </Route>

            <Route path="/app" element={<App />}>
              {/* <Route path="/auth" element={<Auth />} /> */}
              <Route path="/app/market" element={<MintBillboard />} />
              <Route path="/app/profile" element={<Profile />} />
              <Route path="/app/ad3Tx" element={<Ad3Transactions />} />
              <Route path="/app/influenceTx" element={<InfluenceTransactions />} />
              <Route path="/app/battles/billboard" element={<BidWar />} />
              <Route path="/app/battles/dao" element={<DaoBattle />} />
              <Route path="/app/sit" element={<SocialInfluenceToken />} />
              <Route path="/app/boost" element={<Boost />} />
              <Route path="/app/mining/influence" element={<InfluenceMining />} />
              <Route path="/app/mining/ad3" element={<Ad3Mining />} />
              <Route path="/app/treasure" element={<TreasureHunt />} />

              <Route path="/app/test" element={<Test />} />
            </Route>
          </Routes>
        </HashRouter>
      </ConfigProvider>
    </WagmiConfig>

    <Web3Modal
      projectId="2e586b0807500a0da3a4f7b66418295e"
      ethereumClient={ethereumClient}
      themeMode="dark"
    />
  </>
);
