import React from 'react';

const HowItWorks = () => {
    const steps = [
        {
            number: '1',
            title: 'Sign Up',
            description: 'Create your account with your student email to get started',
            icon: '👤',
        },
        {
            number: '2',
            title: 'List Your Item',
            description: 'Post items you want to sell with photos and descriptions',
            icon: '📸',
        },
        {
            number: '3',
            title: 'Connect with Buyers',
            description: 'Chat with interested students and negotiate prices',
            icon: '💬',
        },
        {
            number: '4',
            title: 'Complete Transaction',
            description: 'Meet up safely on campus and complete the exchange',
            icon: '✅',
        },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        How It Works
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Start buying and selling in just 4 simple steps
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="text-center">
                            <div className="relative">
                                <div className="w-20 h-20 bg-[#ff6a3d] rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                                    {step.icon}
                                </div>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 bg-white border-4 border-[#ff6a3d] rounded-full w-10 h-10 flex items-center justify-center font-bold text-[#ff6a3d]">
                                    {step.number}
                                </div>
                            </div>
                            <h3 className="font-semibold text-xl text-gray-900 mb-2">
                                {step.title}
                            </h3>
                            <p className="text-gray-600">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
