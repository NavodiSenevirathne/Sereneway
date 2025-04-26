import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from 'firebase/storage';
import { app } from '../../firebase';

export default function EditPackage() {
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '', 
    accommodation: '',
    packageType: 'group', 
    featured: false,
    offer: false,
    maxGroupSize: 1,
    days: 1, 
    regularPrice: 0,
    discountedPrice: 0,
    imageUrls: []
  });

  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const fileInputRef = useRef(null);

  // Fetch package data on mount and prefill form
  useEffect(() => {
    async function fetchPackage() {
      setLoading(true);
      try {
        const res = await fetch(`/api/tours/get/${id}`);
        const data = await res.json();
        console.log("RAW FETCH RESPONSE:", res);
        console.log("Parsed JSON:", data);

        if (!res.ok || !data.success || !data.data) throw new Error(data.message || 'Failed to fetch package');
        setFormData({
          title: data.data.title || '',
          description: data.data.description || '',
          address: data.data.address || '',
          accommodation: data.data.accommodation || '',
          packageType: data.data.packageType || 'group',
          featured: data.data.featured || false,
          offer: data.data.offer || false,
          maxGroupSize: data.data.maxGroupSize || 1,
          days: data.data.days || 1,
          regularPrice: data.data.regularPrice || 0,
          discountedPrice: data.data.discountedPrice || 0,
          imageUrls: data.data.imageUrls || []
        });
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPackage();
    // Cleanup previews on unmount
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.preview));
    };
    // eslint-disable-next-line
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [id]: checked }));
    } else if (type === 'radio') {
      setFormData(prev => ({ ...prev, packageType: id }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
    if (validationErrors[id]) {
      setValidationErrors(prev => ({ ...prev, [id]: null }));
    }
  };

  // Image handling
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const newImages = [...images];
    imageFiles.forEach(file => {
      if (newImages.length < 6) {
        newImages.push({
          file,
          preview: URL.createObjectURL(file),
          id: Date.now() + Math.random().toString(36).substring(2)
        });
      }
    });
    setImages(newImages);
  };

  const handleImageUpload = async () => {
    if (images.length === 0) {
      setImageUploadError("Please select images to upload");
      return;
    }
    if (formData.imageUrls.length + images.length > 6) {
      setImageUploadError("Maximum 6 images allowed");
      return;
    }
    setUploading(true);
    setImageUploadError(null);
    setUploadProgress({});
    try {
      const uploadPromises = images.map(image => storeImage(image.file, image.id));
      const imageUrls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...imageUrls]
      }));
      images.forEach(image => URL.revokeObjectURL(image.preview));
      setImages([]);
      setUploading(false);
    } catch (error) {
      setImageUploadError("Failed to upload images (max 5MB per image)");
      setUploading(false);
    }
  };

  const storeImage = async (file, id) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(prev => ({
            ...prev,
            [id]: Math.round(progress)
          }));
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then(resolve)
            .catch(reject);
        }
      );
    });
  };

  const deleteImage = (id) => {
    const imageToDelete = images.find(image => image.id === id);
    if (imageToDelete) {
      URL.revokeObjectURL(imageToDelete.preview);
    }
    setImages(images.filter(image => image.id !== id));
  };

  const deleteUploadedImage = (index) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Validation
  const validateForm = () => {
    const errors = {};
    if (parseFloat(formData.discountedPrice) > parseFloat(formData.regularPrice)) {
      errors.discountedPrice = "Discounted price cannot be higher than regular price";
    }
    if (formData.imageUrls.length === 0) {
      errors.images = "You must upload at least one image";
    }
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.accommodation.trim()) errors.accommodation = "Accommodation is required";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tours/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Failed to update package');
      alert("Package updated successfully!");
      navigate('/admin/tour_packages');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancel handler
  const handleCancel = () => {
    images.forEach(image => URL.revokeObjectURL(image.preview));
    navigate('/admin/tour_packages');
  };

  // Show loading indicator while data is being fetched
  if (loading) return (
    <main className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="text-lg text-gray-700">Loading...</div>
    </main>
  );

  // UI (identical to CreatePackage)
  return (
    <main className="min-h-screen bg-gray-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Tour Package</h1>
          <p className="text-gray-500 mt-2">Update your tour package details</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <form className="grid grid-cols-1 lg:grid-cols-3 gap-0" onSubmit={handleSubmit}>
            {/* Left Side: Basic Information */}
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Package Title
                  </label>
                  <input type="text" placeholder="Enter package title"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    id="title" maxLength="62" minLength="10" required value={formData.title} onChange={handleChange}
                  />
                  {validationErrors.title && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.title}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe the tour package"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    id="description" rows="20" maxLength="1500" minLength="10" required value={formData.description} onChange={handleChange}
                  />
                  {validationErrors.description && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.description}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Middle: Details & Pricing */}
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Details & Pricing</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text" placeholder="Enter the address"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    id="address" maxLength="100" required value={formData.address} onChange={handleChange}
                  />
                  {validationErrors.address && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="accommodation" className="block text-sm font-medium text-gray-700 mb-1">
                    Accommodation
                  </label>
                  <input
                    type="text" placeholder="Hotel name or type"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    id="accommodation" required value={formData.accommodation} onChange={handleChange}
                  />
                  {validationErrors.accommodation && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.accommodation}</p>
                  )}
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">Package Type</span>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-gray-600">
                      <input
                        type="radio" id="group" name="packageType" className="w-4 h-4 text-blue-500"
                        checked={formData.packageType === 'group'}
                        onChange={handleChange}
                      />
                      <span>Group</span>
                    </label>
                    <label className="flex items-center gap-2 text-gray-600">
                      <input
                        type="radio" id="private" name="packageType" className="w-4 h-4 text-blue-500"
                        checked={formData.packageType === 'private'}
                        onChange={handleChange}
                      />
                      <span>Private</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-gray-600">
                    <input type="checkbox" id="featured" className="w-4 h-4 text-blue-500 rounded"
                      checked={formData.featured}
                      onChange={handleChange}
                    />
                    <span>Mark as Featured</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-gray-600">
                    <input type="checkbox" id="offer" className="w-4 h-4 text-blue-500 rounded"
                      checked={formData.offer}
                      onChange={handleChange}
                    />
                    <span>Offer</span>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="maxGroupSize" className="block text-sm font-medium text-gray-700 mb-1">
                      Max Group Size
                    </label>
                    <input type="number" id="maxGroupSize" min="1" max="100"
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      required
                      value={formData.maxGroupSize}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">
                      Days
                    </label>
                    <input
                      type="number" id="days" min="1" max="30"
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      required value={formData.days}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="regularPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Regular Price (Rs.)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500"></span>
                    </div>
                    <input
                      type="number" id="regularPrice" min="5000" max="1000000"
                      className="w-full rounded-lg border border-gray-200 pl-8 pr-4 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      required
                      value={formData.regularPrice}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {formData.offer && (
                  <div>
                    <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700 mb-1">
                      Discounted Price (Rs.)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-500"></span>
                      </div>
                      <input type="number" id="discountedPrice" min="0" max="1000000"
                        className={`w-full rounded-lg border ${validationErrors.discountedPrice ? 'border-red-500' : 'border-gray-200'} pl-8 pr-4 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400`}
                        value={formData.discountedPrice}
                        onChange={handleChange}
                      />
                    </div>
                    {validationErrors.discountedPrice && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.discountedPrice}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Right Side: Image Upload */}
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Images</h2>
              <div className="space-y-4">
                <div
                  className={`border-2 border-dashed ${images.length < 6 ? 'border-gray-200 bg-gray-50 hover:bg-gray-100' : 'border-gray-100 bg-gray-50'} rounded-lg p-6 transition-all`}
                  onDrop={images.length < 6 ? handleDrop : null}
                  onDragOver={images.length < 6 ? handleDragOver : null}
                >
                  {images.length < 6 ? (
                    <div className="flex flex-col items-center justify-center gap-3 text-center">
                      <svg className="w-12 h-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Drag & drop images here</p>
                        <p className="text-xs text-gray-500 mt-1">The first image will be the cover (max 6)</p>
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Browse Files
                      </button>
                      <input type="file"
                        ref={fileInputRef} accept="image/*" multiple className="hidden" onChange={handleFileInput}
                      />
                    </div>
                  ) : (
                    <div className="text-center text-sm text-gray-500">
                      Maximum 6 images reached
                    </div>
                  )}
                </div>
                {images.length > 0 && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={uploading}
                      className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70"
                    >
                      {uploading ? 'Uploading...' : 'Upload Selected Images'}
                    </button>
                  </div>
                )}
                {imageUploadError && (
                  <p className="text-red-500 text-sm">{imageUploadError}</p>
                )}
                {images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Selected Images</p>
                    <div className="grid grid-cols-3 gap-3">
                      {images.map((image, index) => (
                        <div key={image.id} className="relative group">
                          <div className="aspect-w-1 aspect-h-1 rounded-md overflow-hidden">
                            <img
                              src={image.preview}
                              alt={`Tour image ${index + 1}`}
                              className="object-cover w-full h-full"
                            />
                            {uploading && uploadProgress[image.id] !== undefined && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="text-white font-medium">
                                  {uploadProgress[image.id]}%
                                </div>
                              </div>
                            )}
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => deleteImage(image.id)}
                              disabled={uploading}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {formData.imageUrls.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Uploaded Images</p>
                    <div className="grid grid-cols-3 gap-3">
                      {formData.imageUrls.map((url, index) => (
                        <div key={url} className="relative group">
                          <div className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${index === 0 ? 'ring-2 ring-blue-500' : ''}`}>
                            <img
                              src={url}
                              alt={`Tour image ${index + 1}`}
                              className="object-cover w-full h-full"
                            />
                            {index === 0 && (
                              <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                                Cover
                              </div>
                            )}
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => deleteUploadedImage(index)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {validationErrors.images && (
                  <p className="text-red-500 text-sm">{validationErrors.images}</p>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Supported formats: JPG, PNG, JPEG (max 5MB each)</span>
                </div>
              </div>
            </div>
            {/* Form Actions */}
            <div className="col-span-1 lg:col-span-3 flex items-center justify-end gap-4 p-6 bg-gray-50 border-t border-gray-100">
              {error && <p className="text-red-500 text-sm mr-auto">{error}</p>}
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium"
                onClick={handleCancel}
                disabled={loading || uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                disabled={loading || uploading}
              >
                {loading ? 'Updating...' : 'Update Package'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
