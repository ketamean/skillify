import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
interface Coupon {
    id: string;
    code: string;
    discount_type: string;
    discount_value: number;
    max_n_usage: number;
    n_used: number;
    expiration_time: string;
    status: string;
}

interface CouponFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    mode?: 'create' | 'edit';
    initialData?: Coupon;
}

const CouponFormModal: React.FC<CouponFormModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    mode = 'create',
    initialData = null,
}) => {
    const [code, setCode] = useState('');
    const [discountValue, setDiscountValue] = useState(0);
    const [discountType, setDiscountType] = useState<'PercentageBased' | 'ValueBased'>('PercentageBased');
    const [maxUsage, setMaxUsage] = useState(1);
    const [expirationTime, setExpirationTime] = useState('');
    const [formErrors, setFormErrors] = useState<string[]>([]);

    const { user } = useAuth();

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setCode(initialData.code);
            setDiscountType(initialData.discount_type as any);
            setDiscountValue(initialData.discount_value);
            setMaxUsage(initialData.max_n_usage);
            setExpirationTime(initialData.expiration_time?.slice(0, 16));
        } else {
            setCode('');
            setDiscountType('PercentageBased');
            setDiscountValue(0);
            setMaxUsage(1);
            setExpirationTime('');
        }
    }, [initialData, mode]);

    // Detect outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.id) {
            alert('User not authenticated');
            return;
        }
        const errors = [];

        if (!code.trim()) errors.push('Coupon code is required.');
        if (discountValue <= 0) errors.push('Discount must be greater than 0.');
        if (discountType === 'PercentageBased' && discountValue > 100)
            errors.push('Percentage discount cannot exceed 100%.');
        if (maxUsage < 1) errors.push('Maximum usage must be at least 1.');
        if (!expirationTime) errors.push('Expiration time is required.');
        if (new Date(expirationTime) <= new Date())
            errors.push('Expiration time must be in the future.');

        if (errors.length > 0) {
            setFormErrors(errors);
            return;
        }

        setFormErrors([]);

        try {
            const payload = {
                code,
                discount_type: discountType,
                discount_value: discountValue,
                max_n_usage: maxUsage,
                expiration_time: expirationTime,
            };

            if (mode === 'edit' && initialData) {
                const res = await axios.put(`/api/coupons/${initialData.id}`, payload);

                if (res.status === 200) {
                    alert('Coupon updated!');
                    onSuccess?.();
                    onClose();
                } else {
                    alert('Failed to update coupon.');
                }
            } else {
                const res = await axios.post('/api/coupons', {
                    ...payload,
                    coupon_type: 'ParticularInstructor',
                    instructor_id: user.id,
                });

                if (res.status === 201) {
                    alert('Coupon created!');
                    onSuccess?.();
                    onClose();
                } else {
                    alert('Failed to create coupon');
                }
            }
        } catch (err: any) {
            console.error('Coupon submission error:', err);
            alert(err?.response?.data?.error || 'Something went wrong.');
        }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-transparent">
            <div
                ref={modalRef}
                className="relative bg-white/80 border border-gray-300 backdrop-blur-xl rounded-xl shadow-lg max-w-2xl w-full p-8"
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                    aria-label="Close"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                    {mode === 'edit' ? 'Edit Coupon' : 'Create a New Coupon'}
                </h2>
                {formErrors.length > 0 && (
                    <div className="bg-red-100 text-red-700 rounded p-3 mb-4">
                        <ul className="list-disc list-inside text-sm">
                            {formErrors.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block font-medium mb-1">Coupon Code</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            className="w-full border rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Discount Type</label>
                        <select
                            value={discountType}
                            onChange={(e) => setDiscountType(e.target.value as any)}
                            className="w-full border rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="PercentageBased">Percentage (%)</option>
                            <option value="ValueBased">Fixed Amount</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Discount Value</label>
                        <input
                            type="number"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(Number(e.target.value))}
                            className="w-full border rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Maximum Uses</label>
                        <input
                            type="number"
                            min={1}
                            value={maxUsage}
                            onChange={(e) => setMaxUsage(Number(e.target.value))}
                            className="w-full border rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Expiration Time</label>
                        <input
                            type="datetime-local"
                            value={expirationTime}
                            onChange={(e) => setExpirationTime(e.target.value)}
                            className="w-full border rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CouponFormModal;