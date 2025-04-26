import React from 'react'

export default function AboutUs() {
      try {
          return (
              <div data-name="about-page" className="py-16">
                  <div className="max-w-7xl mx-auto px-4">
                      <h1 className="text-4xl font-bold text-center mb-12">About TourMaster</h1>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                          <div>
                              <img
                                  src="https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9"
                                  alt="Team"
                                  className="rounded-lg shadow-lg"
                              />
                          </div>
                          <div>
                              <h2 className="text-3xl font-semibold mb-6">Our Story</h2>
                              <p className="text-gray-600 mb-4">
                                  Founded in 2010, TourMaster has been dedicated to providing exceptional travel experiences
                                  to adventurers from all around the world. Our passion for exploration and commitment to
                                  excellence has made us a leading name in the tourism industry.
                              </p>
                              <p className="text-gray-600">
                                  We believe that travel has the power to transform lives, create lasting memories, and
                                  bridge cultural gaps. Our team of experienced professionals works tirelessly to craft
                                  unique and immersive tour packages that cater to every type of traveler.
                              </p>
                          </div>
                      </div>
  
                      <div className="mb-16">
                          <h2 className="text-3xl font-semibold text-center mb-8">Our Values</h2>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                                  <i className="fas fa-heart text-4xl text-blue-600 mb-4"></i>
                                  <h3 className="text-xl font-semibold mb-2">Passion</h3>
                                  <p className="text-gray-600">
                                      We're passionate about creating unforgettable travel experiences for our clients.
                                  </p>
                              </div>
                              <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                                  <i className="fas fa-handshake text-4xl text-blue-600 mb-4"></i>
                                  <h3 className="text-xl font-semibold mb-2">Trust</h3>
                                  <p className="text-gray-600">
                                      Building lasting relationships through reliability and transparency.
                                  </p>
                              </div>
                              <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                                  <i className="fas fa-star text-4xl text-blue-600 mb-4"></i>
                                  <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                                  <p className="text-gray-600">
                                      Committed to delivering the highest quality service in every aspect.
                                  </p>
                              </div>
                          </div>
                      </div>
  
                      <div>
                          <h2 className="text-3xl font-semibold text-center mb-8">Our Team</h2>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                              {[1, 2, 3, 4].map((member) => (
                                  <div key={member} className="text-center">
                                      <img
                                          src={`https://source.unsplash.com/random/200x200?portrait=${member}`}
                                          alt="Team Member"
                                          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                                      />
                                      <h3 className="text-xl font-semibold mb-1">John Doe</h3>
                                      <p className="text-gray-600">Travel Expert</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          );
      } catch (error) {
          console.error('About page error:', error);
          reportError(error);
          return null;
      }
  }
  
