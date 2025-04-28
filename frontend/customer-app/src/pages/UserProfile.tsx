import React, { useState } from 'react';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    address: '123 Main St, Springfield',
    paymentMethod: 'Credit Card',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Address</label>
          <textarea
            name="address"
            value={user.address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium">Payment Method</label>
          <input
            type="text"
            name="paymentMethod"
            value={user.paymentMethod}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UserProfile;