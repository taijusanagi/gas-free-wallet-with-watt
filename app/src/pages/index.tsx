import { Cormorant } from "next/font/google";

const cormorant = Cormorant({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className={`min-h-screen bg-white text-gray-800 ${cormorant.className}`}>
      <header className="py-4 px-8 flex justify-end items-center">
        <button className="bg-white border-gray-500 border hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-gray">
          Connect Wallet
        </button>
      </header>
      <main className="flex flex-col items-center justify-center h-full py-24">
        <section className="w-full max-w-md mb-8">
          <h1 className="text-3xl font-bold mb-2 text-center">WATT Paymaster</h1>
          <h1 className="text-md font-bold text-center">Gas fee subsidise with WATT tokens</h1>
        </section>
        <section className="w-full max-w-md">
          <form className="bg-gray-100 p-4 rounded shadow-md">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Connected Wallet</label>
              <p className="text-gray-700 text-xs">p</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Account Abstraction Wallet</label>
              <p className="text-gray-700 text-xs">p</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">WATT Balance</label>
              <p className="text-gray-700 text-xs">p</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Connect dApps with Wallet Connect</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="wc:"
              />
            </div>
            <button
              className="w-full bg-white border-gray-500 border hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-gray"
              type="button"
            >
              Connect Wallet
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
