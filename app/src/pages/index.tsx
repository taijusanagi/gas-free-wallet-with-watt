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
              <label className="block text-gray-700 font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Username"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="********"
              />
            </div>
            <div className="flex items-center justify-end">
              <button
                className="bg-white border-gray-500 border hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-gray"
                type="button"
              >
                Sign In
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
