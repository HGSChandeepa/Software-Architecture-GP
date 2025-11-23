import React, { useState, useEffect } from 'react';
import type { Stall, Reservation } from '../types';
import { stallAPI, reservationAPI } from '../api/client';
import { QRCodeCanvas } from 'qrcode.react';

export const Stalls: React.FC = () => {
    const [stalls, setStalls] = useState<Stall[]>([]);
    const [selectedStalls, setSelectedStalls] = useState<number[]>([]);
    const [myReservations, setMyReservations] = useState<Reservation[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        loadStalls();
        loadMyReservations();
    }, []);

    const loadStalls = async () => {
        try {
            const response = await stallAPI.getAll();
            setStalls(response.data);
        } catch (err) {
            console.error('Failed to load stalls');
        }
    };

    const loadMyReservations = async () => {
        if (!token) return;
        try {
            const response = await reservationAPI.getMyReservations(token);
            setMyReservations(response.data);
        } catch (err) {
            console.error('Failed to load reservations');
        }
    };

    const toggleStallSelection = (stallId: number, isReserved: boolean) => {
        if (isReserved) return;

        setSelectedStalls(prev => {
            if (prev.includes(stallId)) {
                return prev.filter(id => id !== stallId);
            }
            if (prev.length >= 3) {
                alert('You can only reserve up to 3 stalls');
                return prev;
            }
            return [...prev, stallId];
        });
    };

    const handleReserve = async () => {
        if (!token || selectedStalls.length === 0) return;

        setLoading(true);
        try {
            await reservationAPI.create(selectedStalls, token);
            alert('Reservation successful! Check your email for QR codes.');
            setSelectedStalls([]);
            setShowConfirm(false);
            loadStalls();
            loadMyReservations();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Reservation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">Stall Reservation</h1>
                        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                            Logout
                        </button>
                    </div>
                    <p className="text-gray-600">Welcome, {user.name}! ({user.role})</p>
                    <p className="text-sm text-gray-500 mt-2">
                        You can reserve up to 3 stalls. Click on available stalls to select them.
                    </p>
                </div>

                {/* Stall Map Grid */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Stall Map</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {stalls.map(stall => {
                            const isSelected = selectedStalls.includes(stall.id);
                            const isReserved = stall.is_reserved;

                            return (
                                <div
                                    key={stall.id}
                                    onClick={() => toggleStallSelection(stall.id, isReserved)}
                                    className={`
                    p-4 rounded-lg cursor-pointer transition-all text-center
                    ${isReserved ? 'bg-gray-300 cursor-not-allowed' : ''}
                    ${!isReserved && isSelected ? 'bg-green-500 text-white' : ''}
                    ${!isReserved && !isSelected ? 'bg-green-100 hover:bg-green-200' : ''}
                  `}
                                >
                                    <div className="font-bold text-lg">{stall.stall_code}</div>
                                    <div className="text-sm">{stall.size}</div>
                                    <div className="text-sm font-semibold">Rs. {stall.price}</div>
                                    <div className="text-xs mt-1">
                                        {isReserved ? 'Reserved' : isSelected ? 'Selected' : 'Available'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {selectedStalls.length > 0 && (
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={() => setShowConfirm(true)}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Reserve {selectedStalls.length} Stall{selectedStalls.length > 1 ? 's' : ''}
                            </button>
                            <button
                                onClick={() => setSelectedStalls([])}
                                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                            >
                                Clear Selection
                            </button>
                        </div>
                    )}
                </div>

                {/* My Reservations */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">My Reservations</h2>
                    {myReservations.length === 0 ? (
                        <p className="text-gray-500">You have no reservations yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {myReservations.map(reservation => (
                                <div key={reservation.id} className="border p-4 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">Stall {reservation.stall_code}</h3>
                                            <p className="text-sm text-gray-600">{reservation.size} - Rs. {reservation.price}</p>
                                            <p className="text-xs text-gray-500 mt-1">Reserved: {new Date(reservation.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <QRCodeCanvas value={reservation.qr_code} size={80} />
                                            <p className="text-xs mt-1">QR Code</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Confirmation Modal */}
                {showConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h3 className="text-xl font-semibold mb-4">Confirm Reservation</h3>
                            <p className="mb-4">Are you sure you want to reserve these stalls?</p>
                            <ul className="list-disc list-inside mb-6">
                                {selectedStalls.map(id => {
                                    const stall = stalls.find(s => s.id === id);
                                    return <li key={id}>Stall {stall?.stall_code} - Rs. {stall?.price}</li>;
                                })}
                            </ul>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleReserve}
                                    disabled={loading}
                                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Confirm'}
                                </button>
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};