import React from 'react';

const OrderHistory: React.FC = () => {
  const orders = [
    {
      id: '12345',
      date: '2025-04-20',
      items: [
        { name: 'Product 1', price: 29.99 },
        { name: 'Product 2', price: 39.99 },
      ],
      total: 69.98,
      status: 'Delivered',
    },
    {
      id: '67890',
      date: '2025-04-15',
      items: [
        { name: 'Product 3', price: 49.99 },
      ],
      total: 49.99,
      status: 'In Transit',
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      {orders.length === 0 ? (
        <p>You have no past orders.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border p-4 rounded">
              <h2 className="text-lg font-bold">Order ID: {order.id}</h2>
              <p>Date: {order.date}</p>
              <p>Status: {order.status}</p>
              <ul className="list-disc pl-5">
                {order.items.map((item, index) => (
                  <li key={index}>{item.name} - ${item.price}</li>
                ))}
              </ul>
              <p className="font-bold mt-2">Total: ${order.total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;