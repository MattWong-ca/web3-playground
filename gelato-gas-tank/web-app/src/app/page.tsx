import { SponsoredTransactionDemo } from '~/components/sponsored-transaction-demo'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Gelato Sponsored Transactions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience gasless transactions powered by Gelato's Gas Tank. 
            Interact with smart contracts without needing ETH for gas fees!
          </p>
        </div>
        
        <SponsoredTransactionDemo />
      </div>
    </div>
  );
}