import React, { useState, useRef, useEffect } from 'react';

export default function VideoCallForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        country: '',
        date: '',
        time: '',
        message: ''
    });
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const countryDropdownRef = useRef(null);

    // List of all countries
    const countries = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", 
        "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", 
        "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", 
        "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", 
        "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", 
        "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Democratic Republic)", 
        "Congo (Republic)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", 
        "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", 
        "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", 
        "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", 
        "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", 
        "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", 
        "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "North Korea", 
        "South Korea", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", 
        "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", 
        "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", 
        "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", 
        "Myanmar", "Namibia", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", 
        "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", 
        "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", 
        "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", 
        "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", 
        "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", 
        "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "South Sudan", "Suriname", 
        "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", 
        "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", 
        "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", 
        "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", 
        "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ];

    // Filter countries based on search term
    const filteredCountries = countries.filter(country => 
        country.toLowerCase().includes(countrySearch.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event) {
            if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
                setShowCountryDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const selectCountry = (country) => {
        setFormData(prevState => ({
            ...prevState,
            country: country
        }));
        setShowCountryDropdown(false);
        setCountrySearch('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!acceptedTerms) {
            alert('Please accept the terms and conditions');
            return;
        }
        
        try {
            const response = await fetch('/api/videocalls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Video call request submitted successfully');
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    country: '',
                    date: '',
                    time: '',
                    message: ''
                });
                setAcceptedTerms(false);
            } else {
                alert('Failed to submit the request');
            }
        } catch (error) {
            console.error('Error submitting video call request:', error);
        }
    };

    return (
        // Added min-h-screen and flex with items-center and justify-center for full vertical centering
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-2xl bg-white p-8 rounded shadow-md">
                <div className="flex justify-end">
                    <button className="text-gray-500 text-2xl">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Your Name*</label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full border-b border-gray-300 py-2 outline-none"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">Your Email*</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full border-b border-gray-300 py-2 outline-none"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">Country*</label>
                            <div className="relative" ref={countryDropdownRef}>
                                <div 
                                    className="w-full border-b border-gray-300 py-2 flex items-center justify-between cursor-pointer"
                                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                >
                                    <span>{formData.country || 'Select'}</span>
                                    <span>▼</span>
                                </div>
                                
                                {showCountryDropdown && (
                                    <div className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg">
                                        <div className="sticky top-0 bg-white border-b border-gray-300 p-2">
                                            <input
                                                type="text"
                                                placeholder="Search country..."
                                                value={countrySearch}
                                                onChange={(e) => setCountrySearch(e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                        <div>
                                            {filteredCountries.map((country) => (
                                                <div
                                                    key={country}
                                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => selectCountry(country)}
                                                >
                                                    {country}
                                                </div>
                                            ))}
                                            {filteredCountries.length === 0 && (
                                                <div className="p-2 text-gray-500">No countries found</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                <input 
                                    type="hidden" 
                                    name="country"
                                    value={formData.country}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">Your Date</label>
                            <input 
                                type="date" 
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full border-b border-gray-300 py-2 outline-none"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">Your Time</label>
                            <div className="relative">
                                <select 
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="w-full border-b border-gray-300 py-2 outline-none appearance-none bg-transparent"
                                >
                                    <option value="">Select Time</option>
                                    <option value="9:00">9:00 AM</option>
                                    <option value="10:00">10:00 AM</option>
                                    <option value="11:00">11:00 AM</option>
                                    <option value="12:00">12:00 PM</option>
                                    <option value="13:00">1:00 PM</option>
                                    <option value="14:00">2:00 PM</option>
                                    <option value="15:00">3:00 PM</option>
                                    <option value="16:00">4:00 PM</option>
                                    <option value="17:00">5:00 PM</option>
                                </select>
                                <div className="absolute right-0 top-3 pointer-events-none">▼</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <textarea 
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="4"
                            className="w-full border-b border-gray-300 py-2 outline-none resize-none"
                        ></textarea>
                    </div>
                    
                    <div className="mt-6 flex items-center">
                        <input 
                            type="checkbox" 
                            id="terms"
                            checked={acceptedTerms}
                            onChange={() => setAcceptedTerms(!acceptedTerms)}
                            className="mr-2"
                        />
                        <label htmlFor="terms" className="text-sm">
                            <span>Privacy Policy / </span>
                            <span className="text-green-600">Terms And Conditions</span>
                            <span>.</span>
                        </label>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                        <button 
                            type="submit" 
                            className="bg-green-500 text-white px-8 py-3 rounded flex items-center"
                            style={{ backgroundColor: '#8c9440' }}
                        >
                            Submit
                            <span className="ml-2"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}