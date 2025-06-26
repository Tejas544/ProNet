import React from 'react';
import Button from '../components/Button';

const PremiumPage = () => {
    const plans = [
        { name: 'Basic', price: '$9.99', features: ['50 new connections / month', 'Basic analytics', 'Standard support'] },
        { name: 'Pro', price: '$19.99', features: ['Unlimited connections', 'Advanced analytics', 'Priority support', 'Profile badge'], popular: true },
        { name: 'Business', price: '$49.99', features: ['All Pro features', 'Team accounts', 'Dedicated account manager'] }
    ];

    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">Choose Your Plan</h2>
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Unlock more features and grow your network.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map(plan => (
                    <div key={plan.name} className={`relative p-8 rounded-2xl border transition-all duration-300 ${plan.popular ? 'border-blue-500 border-2 scale-105 bg-white dark:bg-gray-800' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'}`}>
                        {plan.popular && <span className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</span>}
                        <h3 className="text-2xl font-bold text-center">{plan.name}</h3>
                        <p className="mt-4 text-4xl font-extrabold text-center">{plan.price}<span className="text-base font-medium text-gray-500 dark:text-gray-400">/month</span></p>
                        <ul className="mt-8 space-y-4">
                            {plan.features.map(feature => (
                                <li key={feature} className="flex items-start">
                                    <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <Button className="w-full mt-8" variant={plan.popular ? 'primary' : 'secondary'}>
                            Buy Now
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PremiumPage;