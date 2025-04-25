import { useEffect, useState } from "react";
import React from 'react';
import { Link } from "react-router-dom";

export default function Home() {
    // State for the carousel
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Hero section carousel images
    const heroImages = [
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Travel image 1
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Travel image 2
        "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Travel image 3
        "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Travel image 4
        "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Travel image 5
        "https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"  // Travel image 6
    ];
    
    // Featured tour images
    const tourImages = [
        "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // Paris
        "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // Bali
        "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"  // Maldives
    ];
    
    // Tour package names
    const tourNames = ["Paris Explorer", "Bali Paradise", "Maldives Getaway"];

    // Set up the image rotation
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 6000); // 6 seconds interval
        
        return () => clearInterval(interval);
    }, []);

    try {
        return (
            <div data-name="home-page" className="relative">
                {/* Video Call Button in Left Corner */}
                <Link to="/VideoCallForm">
                    <button className="fixed left-4 top-20 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                </Link>

                <section 
                    data-name="hero-section" 
                    className="hero-section h-[500px] flex items-center justify-center text-white relative overflow-hidden"
                >
                    {/* Image carousel */}
                    {heroImages.map((image, index) => (
                        <div 
                            key={index}
                            className="absolute inset-0 w-full h-full transition-opacity duration-1000 bg-cover bg-center"
                            style={{ 
                                backgroundImage: `url(${image})`,
                                opacity: index === currentImageIndex ? 1 : 0,
                                zIndex: index === currentImageIndex ? 1 : 0
                            }}
                        />
                    ))}
                    
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
                    
                    <div className="text-center relative z-20">
                        <h1 className="text-5xl font-bold mb-4">Discover Amazing Tours</h1>
                        <p className="text-xl mb-8">Experience the world with our expertly curated tours</p>
                        
                        {/* Two square-shaped cards */}
                        <div className="flex justify-center gap-8">
                            <div 
                                className="bg-white p-6 rounded-lg shadow-lg w-[200px] text-center cursor-pointer hover:bg-blue-600 hover:text-white transition duration-300"
                            >
                                <h3 className="text-xl font-semibold mb-2 text-gray-800 hover:text-white">Customized Packages</h3>
                                <p className="text-gray-600 hover:text-white">Tailored just for you</p>
                            </div>
                            <Link to="/user/tours">
                            <div 
                                className="bg-white p-6 rounded-lg shadow-lg w-[200px] text-center cursor-pointer hover:bg-blue-600 hover:text-white transition duration-300"
                            >
                                <h3 className="text-xl font-semibold mb-2 text-gray-800 hover:text-white">Our Packages</h3>
                                <p className="text-gray-600 hover:text-white">Explore our special deals</p>
                            </div>
                            </Link>
                        </div>
                    </div>
                </section>

                <section data-name="features-section" className="py-16 bg-gray-100">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                <h3 className="text-xl font-semibold mb-2">Expert Guides</h3>
                                <p className="text-gray-600">Professional and knowledgeable guides for your journey</p>
                            </div>
                            <div className="text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <h3 className="text-xl font-semibold mb-2">Quality Accommodations</h3>
                                <p className="text-gray-600">Carefully selected hotels for your comfort</p>
                            </div>
                            <div className="text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-xl font-semibold mb-2">Flexible Schedule</h3>
                                <p className="text-gray-600">Tours that fit your timeline and preferences</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section data-name="popular-tours" className="py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Popular Tours</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[0, 1, 2].map((index) => (
                                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                    <img
                                        src={tourImages[index]}
                                        alt={tourNames[index]}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold mb-2">{tourNames[index]}</h3>
                                        <p className="text-gray-600 mb-4">Experience the beauty of nature and culture</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-blue-600 font-bold">$999</span>
                                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        );
    } catch (error) {
        console.error('Home page error:', error);
        reportError(error);
        return null;
    }
}