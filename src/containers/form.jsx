import React, { useState } from 'react';

const RoomTypeSelect = ({ roomType, setRoomType }) => {
  const roomTypes = [
    { value: 'Standard', label: 'Standard', price: 100 },
    { value: 'Deluxe', label: 'Deluxe', price: 150 },
    { value: 'Suite', label: 'Suite', price: 200 },
  ];

  return (
    <div className="mb-4">
      <label htmlFor="roomType" className="block text-gray-700 text-sm font-bold mb-2">Room Type:</label>
      <select 
        id="roomType"
        value={roomType}
        onChange={(e) => setRoomType(e.target.value)}
        className="w-full p-2 border rounded-md"
      >
        {roomTypes.map((type, index) => (
          <option key={index} value={type.value}>{type.label}</option>
        ))}
      </select>
    </div>
  );
};

const Form = () => {
  // State for managing invoice data
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
  const [guestName, setGuestName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [roomType, setRoomType] = useState('Deluxe');
  const [nights, setNights] = useState(3);

  // Helper function to find room price
  const getRoomPrice = () => {
    const room = ['Standard', 'Deluxe', 'Suite'].find(r => r === roomType);
    return room === 'Standard' ? 100 : room === 'Deluxe' ? 150 : 200;
  };

  // Calculate totals
  const roomCost = getRoomPrice() * nights;
  const tax = roomCost * 0.1; // 10% tax for simplicity
  const total = roomCost + tax;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Hotel XYZ Invoice</h1>
        <img src="hotel-logo.png" alt="Hotel Logo" className="h-16 w-16" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Invoice Number */}
        <div className="mb-4">
          <label htmlFor="invoice-number" className="block text-gray-700 text-sm font-bold mb-2">Invoice Number:</label>
          <input 
            type="text" 
            id="invoice-number" 
            className="w-full p-2 border rounded-md" 
            value={invoiceNumber} 
            onChange={(e) => setInvoiceNumber(e.target.value)} 
            placeholder="INV-001" 
          />
        </div>

        {/* Date */}
        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Date:</label>
          <input type="text" id="date" className="w-full p-2 border rounded-md" defaultValue={new Date().toLocaleDateString()} readOnly />
        </div>

        {/* Customer Information */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Customer Information</h2>
          <input type="text" className="w-full p-2 border rounded-md mb-2" placeholder="Guest Name" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
          <input type="text" className="w-full p-2 border rounded-md mb-2" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <input type="text" className="w-full p-2 border rounded-md" placeholder="Contact" value={contact} onChange={(e) => setContact(e.target.value)} />
        </div>

        {/* Room and Charges */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Room and Charges</h2>
          <RoomTypeSelect roomType={roomType} setRoomType={setRoomType} />
          <div className="grid grid-cols-2 gap-4">
            <div>Rate: ${getRoomPrice()}/night</div>
            <div className="text-right">Nights: {nights}</div>
            <div>Total:</div>
            <div className="text-right">${roomCost}</div>
          </div>
        </div>

        {/* Totals */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-right font-bold">Subtotal:</div>
            <div className="text-right">${roomCost}</div>
            <div className="text-right font-bold">Tax (10%):</div>
            <div className="text-right">${tax.toFixed(2)}</div>
            <div className="text-right font-bold">Total:</div>
            <div className="text-right text-xl font-bold">${total.toFixed(2)}</div>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>Thank you for choosing Hotel XYZ. Please review the charges above. Payments can be made via credit card at the front desk or online at www.hotelxyz.com/pay.</p>
        </div>
      </div>
    </div>
  );
};

export default Form;