import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { axiosForm } from "@/config/axios";
import { useAuth } from "../../context/AuthContext";
import NavBar from "../../components/NavBar";
import CouponFormModal from "../../components/CouponFormModal";
import Footer from "../../components/Footer";
interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  max_n_usage: number;
  n_used: number;
  expiration_time: string;
  status: string;
  coupon_type: "ParticularCourse" | "ParticularInstructor" | "Universal";
  course_name?: string;
  course_id?: string;
}

const InstructorCouponPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);

  const handleDelete = async (couponId: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this coupon?"
    );
    if (!confirm) return;

    try {
      await axiosForm.delete(`/api/coupons/${couponId}`);
      alert("Coupon deleted");
      fetchInstructorCoupons();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete coupon");
    }
  };

  const fetchInstructorCoupons = async () => {
    if (!user) return;

    try {
      const instructorId = user.id;
      const res = await axiosForm.get<Coupon[]>(
        `/api/coupons/instructor/${instructorId}`
      );
      setCoupons(res.data);
    } catch (err) {
      console.error("Error fetching instructor coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorCoupons();
  }, [user]);

  return (
    <div className="min-h-screen bg-custom-white">
      <NavBar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">My Coupons</h1>
          <button
            className="bg-deepteal text-white px-5 py-2 rounded-md hover:bg-vibrant-green hover:text-deepteal transition-colors"
            onClick={() => {
              setEditCoupon(null);
              setShowModal(true);
            }}
          >
            + Create Coupon
          </button>
        </div>

        {/* Coupons Table or Empty State */}
        {loading ? (
          <p>Loading...</p>
        ) : coupons.length === 0 ? (
          <p className="text-gray-500 text-center">
            You haven't created any coupons yet.
          </p>
        ) : (
          <div className="overflow-x-auto border rounded-lg shadow-sm">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wide">
                <tr>
                  <th className="p-4">Code</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Usage</th>
                  <th className="p-4">Expires</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Scope</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="border-t hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="p-4 font-medium">{coupon.code}</td>
                    <td className="p-4">
                      {coupon.discount_type === "PercentageBased"
                        ? `${coupon.discount_value}%`
                        : `${coupon.discount_value}đ`}
                    </td>
                    <td className="p-4">
                      {coupon.n_used} / {coupon.max_n_usage}
                    </td>
                    <td className="p-4">
                      {new Date(coupon.expiration_time).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`
                                                        px-3 py-1 rounded-full text-xs font-bold
                                                        ${
                                                          coupon.status ===
                                                          "InUse"
                                                            ? "bg-green-100 text-green-700 border border-green-300"
                                                            : coupon.status ===
                                                              "OutOfUse"
                                                            ? "bg-red-100 text-red-700 border border-red-300"
                                                            : "bg-gray-200 text-gray-600 border border-gray-300"
                                                        }
                                            `}
                      >
                        {coupon.status?.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </td>
                    <td className="p-4">
                      {coupon.coupon_type === "ParticularCourse"
                        ? `Only for ${
                            coupon.course_name?.toUpperCase() || "one course"
                          }`
                        : "All Courses"}
                    </td>
                    <td className="p-4 text-center align-middle">
                      <div className="inline-flex items-center justify-center gap-4">
                        <button
                          onClick={() => {
                            setEditCoupon(coupon);
                            setShowModal(true);
                          }}
                          className="flex items-center gap-1 text-deepteal hover:underline text-sm"
                        >
                          <FiEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="flex items-center gap-1 text-red-600 hover:underline text-sm"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <CouponFormModal
          key={editCoupon ? `edit-${editCoupon.id}` : "create"}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditCoupon(null);
          }}
          onSuccess={fetchInstructorCoupons}
          mode={editCoupon ? "edit" : "create"}
          initialData={editCoupon ?? undefined}
        />
      </div>
    </div>
  );
};

export default InstructorCouponPage;
