import { Cormorant } from "next/font/google";
import { useState } from "react";
import { useIsConnected } from "@/hooks/useIsConnected";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const cormorant = Cormorant({ subsets: ["latin"] });

export default function Home() {
  const { isConnected } = useIsConnected();
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();

  const [accountAbstractionWaleltAddress, setAccountAbstractionWaleltAddress] = useState("");
  const [ethBalance, setETHTBalance] = useState("0");
  const [wattBalance, setWATTBalance] = useState("0");
  const [walletConenctURI, setWalletConnectURI] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [id, setId] = useState(0);
  const [to, setTo] = useState("");
  const [data, setData] = useState("");
  const [value, setValue] = useState("");
  const [hash, setHash] = useState("");

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
      </header>
      <main className="flex flex-col items-center justify-center h-full py-32">
        <section className="w-full max-w-md mb-8">
          <h1 className="text-3xl font-bold mb-2 text-center">WATT Paymaster</h1>
          <h1 className="text-md font-bold text-center">Gas fee subsidise with WATT tokens</h1>
        </section>
        <section className="w-full max-w-md">
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
                <p className="text-gray-700 text-xs">{address}</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">Account Abstraction Wallet</label>
                <p className="text-gray-700 text-xs">{accountAbstractionWaleltAddress}</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">ETH Balance</label>
                <p className="text-gray-700 text-xs">{ethBalance} ETH</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">WATT Balance</label>
                <p className="text-gray-700 text-xs">{wattBalance} WATT</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Connect dApps with Wallet Connect</label>
                <input
                  className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs"
                  type="text"
                  placeholder="wc:"
                  value={walletConenctURI}
                  onChange={(e) => setWalletConnectURI(e.target.value)}
                />
              </div>
              <button
                className="w-full bg-white border-gray-500 border hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-gray"
                type="button"
              >
                Connect dApps
              </button>
            </form>
          )}
        </section>
      </main>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative z-10 bg-white py-4 px-6 rounded-xl shadow-lg max-w-xl w-full mx-4">
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
                <p className="text-xs">{accountAbstractionWaleltAddress}</p>
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
            >
              Send Tx
            </button>
            {hash && (
              <>
                <label className="form-label block text-gray-700 font-bold mb-2">Tx Hash</label>
                <p className="text-xs mb-2 text-blue-600">
                  <a href={`https://goerli.explorer.zksync.io/tx/${hash}`}>{hash}</a>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
