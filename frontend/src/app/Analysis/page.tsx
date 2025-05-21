import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
    const services = [
        {
            title: 'Detect & Analyse Coronary Artery Disease',
            image: '/images/coronary.jpg',
            href: '/cad', 
        },
        {
            title: 'Detect & Analyse Heart Failure',
            image: '/images/heart-failure.jpg',
            href: '/heart_failure',
        },
        {
            title: 'Detect & Analyse Arrhythmias',
            image: '/images/arrhythmia.jpg',
            href: '/arrhythmia',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6 lg:px-20">
            <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
                Cardiovascular Health Analysis
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {services.map((service, index) => (
                    <Link key={index} href={service.href} className="w-full max-w-md mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow cursor-pointer">
                            <div className="relative w-full h-60 sm:h-64 md:h-72">
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    layout="fill"
                                    objectFit="contain"
                                    className="rounded-t-2xl"
                                />
                            </div>
                            <div className="p-6 sm:p-7 md:p-8">
                                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                                    {service.title}
                                </h2>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
