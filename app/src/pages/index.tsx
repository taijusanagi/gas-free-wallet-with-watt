import { Cormorant } from "next/font/google";

import { useEffect, useState } from "react";
import { useIsConnected } from "@/hooks/useIsConnected";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";

import { SimpleAccountAPI, HttpRpcClient } from "@account-abstraction/sdk";
import { useEthersSigner } from "@/hooks/useEthers";
import { ethers, Contract } from "ethers";
import { entryPointAddress, factoryAddress, paymasterAddress, wattAddress } from "@/lib/contracts";

import { Core } from "@walletconnect/core";
import { Web3Wallet } from "@walletconnect/web3wallet";
import {
  SESSION_REQUEST_ETH_SIGN,
  SESSION_REQUEST_ETH_SIGN_V4,
  SESSION_REQUEST_PERSONAL_SIGN,
  SESSION_REQUEST_SEND_TRANSACTION,
} from "@/lib/wallet-connect";

import WATTMockJson from "@/lib/abi/WATTMock.json";

const cormorant = Cormorant({ subsets: ["latin"] });

const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth_goerli");

export default function Home() {
  const { isConnected } = useIsConnected();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const signer = useEthersSigner();

  const [accountAPI, setAccountAPI] = useState<SimpleAccountAPI>();
  const [accountAbstractionWalletAddress, setaccountAbstractionWalletAddress] = useState("");
  const [ethBalance, setETHBalance] = useState("0");
  const [wattBalance, setWATTBalance] = useState("0");
  const [walletConenctURI, setWalletConnectURI] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [web3Wallet, setWeb3Wallet] = useState<any>();
  const [isDAppsConnected, setIsDAppsConnected] = useState(false);
  const [topic, setTopic] = useState("");

  const [id, setId] = useState(0);
  const [to, setTo] = useState("");
  const [data, setData] = useState("");
  const [value, setValue] = useState("");
  const [hash, setHash] = useState("");

  useEffect(() => {
    (async () => {
      if (!signer) {
        return;
      }
      const walletAPI = new SimpleAccountAPI({
        provider,
        entryPointAddress: entryPointAddress,
        owner: signer,
        factoryAddress: factoryAddress,
      });
      setAccountAPI(walletAPI);
      const accountAbstractionWalletAddress = await walletAPI.getAccountAddress();
      setaccountAbstractionWalletAddress(accountAbstractionWalletAddress);
      const ethBalance = await provider.getBalance(accountAbstractionWalletAddress);
      setETHBalance(ethers.utils.formatEther(ethBalance));
      const contract = new Contract(wattAddress, WATTMockJson.abi, provider);
      const wattBalance = await contract.balanceOf(accountAbstractionWalletAddress);
      setWATTBalance(wattBalance.toString());
      const metadata = {
        name: "zkSync SSI Wallet",
        description: "Empower your crypto journey with credentials.",
        url: "http://localhost:3000",
        icons: [],
      };
      const core = new Core({
        projectId: "cffe9608a02c00c7947b9afd9dacbc70",
      });
      const web3Wallet = await Web3Wallet.init({
        core,
        metadata,
      });
      web3Wallet.on("session_proposal", async (proposal) => {
        const session = await web3Wallet.approveSession({
          id: proposal.id,
          namespaces: {
            eip155: {
              chains: ["eip155:5"],
              methods: [
                SESSION_REQUEST_SEND_TRANSACTION,
                SESSION_REQUEST_ETH_SIGN,
                SESSION_REQUEST_PERSONAL_SIGN,
                SESSION_REQUEST_ETH_SIGN_V4,
              ],
              events: ["chainChanged", "accountsChanged"],
              accounts: [`eip155:5:${accountAbstractionWalletAddress}`],
            },
          },
        });
        setIsDAppsConnected(true);
        setTopic(session.topic);
      });
      web3Wallet.on("session_request", async (request) => {
        if (request.params.request.method === "eth_sendTransaction") {
          console.log("eth_sendTransaction");
          const id = request.id;
          const to = request.params.request.params[0].to;
          const data = request.params.request.params[0].data;
          const value = request.params.request.params[0].value;
          setId(id);
          setTo(to);
          setData(data);
          setValue(value);
          setIsModalOpen(true);
        }
      });
      setWeb3Wallet(web3Wallet);
      const sessions = await web3Wallet.getActiveSessions();
      const isDAppsConnected = Object.keys(sessions).length > 0;
      setIsDAppsConnected(isDAppsConnected);
      if (isDAppsConnected) {
        const topic = Object.keys(sessions)[0];
        setTopic(topic);
      }
    })();
  }, [signer]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  return (
    <div className={`min-h-screen bg-white text-gray-800 ${cormorant.className}`}>
      <header className="py-4 px-8 flex justify-end items-center">
        {!isConnected && (
          <button
            className="bg-white border-gray-500 border hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-gray"
            onClick={openConnectModal}
          >
            Connect Wallet
          </button>
        )}
        {isConnected && (
          <button
            className="bg-white border-gray-500 border hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-gray"
            onClick={() => disconnect()}
          >
            Disconnect Wallet
          </button>
        )}
      </header>
      <main className={`flex flex-col items-center justify-center h-full ${isConnected ? "py-24" : "py-48"}`}>
        <section className="w-full max-w-md mb-8">
          <h1 className="text-6xl font-bold text-center">🪪</h1>
          <h1 className="text-3xl font-bold mb-2 text-center">WATT Paymaster</h1>
          <h1 className="text-md font-bold text-center">Gas fee subsidise with WATT tokens and ERC4331</h1>
        </section>
        <section className="w-full max-w-md p-2">
          {!isConnected && (
            <div className="flex justify-center">
              <button
                className="bg-white border-gray-500 border hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-gray"
                onClick={openConnectModal}
              >
                Connect Wallet
              </button>
            </div>
          )}
          {isConnected && (
            <form className="bg-gray-100 p-4 rounded shadow-md">
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">Connected Wallet</label>
                <p className="text-gray-700 text-sm">{address}</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">Account Abstraction Wallet</label>
                <p className="text-gray-700 text-sm">{accountAbstractionWalletAddress}</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">ETH Balance</label>
                <p className="text-gray-700 text-sm">{ethBalance} ETH</p>
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="block text-gray-700 font-bold">WATT Balance</label>
                    <p className="text-gray-700 text-sm">{wattBalance} WATT</p>
                  </div>
                  <button
                    className="bg-white border-gray-500 border hover:bg-gray-200 text-gray-800 py-1 px-2 rounded focus:outline-none focus:shadow-outline-gray text-xs"
                    onClick={async () => {
                      if (!signer) {
                        return;
                      }
                      const contract = new Contract(wattAddress, WATTMockJson.abi, signer);
                      const tx = await contract.mint(accountAbstractionWalletAddress);
                      await tx.wait();
                      const wattBalance = contract.balanceOf(accountAbstractionWalletAddress);
                      setWATTBalance(wattBalance.toString());
                    }}
                    type="button"
                  >
                    Mint WATT
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Connect dApps with Wallet Connect</label>
                {!isDAppsConnected && (
                  <>
                    <input
                      className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs mb-2"
                      type="text"
                      placeholder="wc:"
                      value={walletConenctURI}
                      onChange={(e) => setWalletConnectURI(e.target.value)}
                    />
                    <button
                      className="w-full bg-white border-gray-500 border hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-gray"
                      type="button"
                      onClick={async () => {
                        if (!web3Wallet) {
                          return;
                        }
                        await web3Wallet.core.pairing.pair({
                          uri: walletConenctURI,
                        });
                      }}
                    >
                      Connect dApps
                    </button>
                  </>
                )}
                {isDAppsConnected && (
                  <>
                    <button
                      className="w-full bg-white border-gray-500 border hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-gray"
                      disabled={!isDAppsConnected}
                      onClick={async () => {
                        if (!web3Wallet) {
                          return;
                        }
                        await web3Wallet.disconnectSession({ topic });
                        setIsDAppsConnected(false);
                      }}
                    >
                      Disconnect
                    </button>
                  </>
                )}
              </div>
            </form>
          )}
        </section>
      </main>
      {isConnected && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative z-10 bg-white p-4 rounded-xl shadow-lg max-w-xl w-full mx-4">
            <header className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-bold text-gray-700">Tx Preview</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl text-gray-400 hover:text-gray-500">
                &times;
              </button>
            </header>
            <pre
              className="p-2 rounded border border-gray-200 bg-gray-50 overflow-x-auto overflow-y-auto max-h-80 mb-4"
              style={{ fontSize: "10px" }}
            >
              <div className="mb-4">
                <label className="form-label block text-gray-700 font-bold mb-2">From</label>
                <p className="text-xs">{accountAbstractionWalletAddress}</p>
              </div>
              <div className="mb-4">
                <label className="form-label block text-gray-700 font-bold mb-2">To</label>
                <p className="text-xs">{to}</p>
              </div>
              <div className="mb-4">
                <label className="form-label block text-gray-700 font-bold mb-2">Data</label>
                <p className="text-xs">{data}</p>
              </div>
              <div className="mb-4">
                <label className="form-label block text-gray-700 font-bold mb-2">Value</label>
                <p className="text-xs">{value}</p>
              </div>
            </pre>
            <button
              className="w-full bg-white border-gray-500 border hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-gray"
              disabled={!!hash}
              onClick={async () => {
                if (!accountAPI) {
                  return;
                }
                const httpRPCClient = new HttpRpcClient(
                  "https://api.stackup.sh/v1/node/c589455678a18f482e3ec75a2e226eeed6294e928c175558410543de304165c6",
                  entryPointAddress,
                  5
                );
                const unsignedUserOp = await accountAPI.createUnsignedUserOp({
                  target: to,
                  data,
                  value,
                });
                unsignedUserOp.preVerificationGas = 500000;
                unsignedUserOp.paymasterAndData = paymasterAddress;
                const signedUserOp = await accountAPI.signUserOp(unsignedUserOp);
                const result = await httpRPCClient.sendUserOpToBundler(signedUserOp);
                setHash(result);
                const response = { id, result, jsonrpc: "2.0" };
                await web3Wallet.respondSessionRequest({ topic, response });
              }}
            >
              Send Tx
            </button>
            {hash && (
              <>
                <label className="form-label block text-gray-700 font-bold mt-4 mb-2">Request ID</label>
                <p className="text-xs mb-2 text-blue-600">
                  <a href={`https://www.jiffyscan.xyz/userOpHash/${hash}?network=goerli`}>{hash}</a>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
