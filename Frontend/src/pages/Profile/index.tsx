import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_image_link: string;
  email: string;
  bio?: string;
  role: "learner" | "instructor";
}

export default function ProfilePage() {
  const [tab, setTab] = useState("profile");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { user, isLoading } = useAuth();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [avatarPath, setAvatarPath] = useState<string | null>(userData?.avatar_image_link || null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    bio: "",
  });
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  useEffect(() => {
    if (user) {
      const profile: UserProfile = {
        id: user.id,
        first_name: user.fname,
        last_name: user.lname,
        email: user.email,
        avatar_image_link: user.avatar_url ?? "",
        bio: user.bio,
        role: user.is_instructor
      };
      setUserData(profile);
      if (
        user.avatar_url &&
        !user.avatar_url.startsWith("blob:") &&
        !user.avatar_url.startsWith("http")
      ) {
        setAvatarPath(user.avatar_url);
      }
      setFormData({
        first_name: profile.first_name,
        last_name: profile.last_name,
        bio: profile.bio || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (!selectedFile) return;
    const tempUrl = URL.createObjectURL(selectedFile);
    return () => URL.revokeObjectURL(tempUrl);
  }, [selectedFile]);

  const handleChangePassword = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const email = sessionData.session?.user?.email;
    if (!email) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: passwordData.old_password,
    });

    if (signInError) {
      alert("Current password is incorrect.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordData.new_password,
    });

    if (error) {
      console.error("Password change error:", error.message);
      alert("Failed to change password. Please try again.");
    } else {
      alert("Password changed successfully!");
      await supabase.auth.signOut();
      navigate("/login");
    }
  };
  const handleProfileSave = async () => {
    if (!userData) return;

    const { error } = await supabase
      .from("users")
      .update({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        bio: formData.bio.trim(),
      })
      .eq("id", userData.id);

    if (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to save profile. Please try again.");
    } else {
      alert("Profile updated successfully!");
      setUserData({ ...userData, ...formData });
    }
  };
  const handleImageUpload = async () => {
    if (!selectedFile || !userData) return;

    const fileExt = selectedFile.name.split(".").pop();
    const newFilePath = `public/${userData.id}/${Date.now()}.${fileExt}`;
    const oldFilePath = avatarPath;

    // 1. Upload file
    const { error: uploadError } = await supabase.storage
      .from("useravatars")
      .upload(newFilePath, selectedFile, { upsert: true });
    if (uploadError) {
      console.error("Upload failed:", uploadError.message);
      return;
    }

    // 2. Update avatar path in DB
    const { error: dbUpdateError } = await supabase
      .from("users")
      .update({ avatar_image_link: newFilePath })
      .eq("id", userData.id);
    if (dbUpdateError) {
      console.error("Failed to update avatar in DB:", dbUpdateError.message);
      return;
    }

    console.log("Avatar updated in DB:", newFilePath);
    console.log("Avatar current link", avatarPath);
    // 3. Delete old avatar from storage
    if (oldFilePath && oldFilePath !== newFilePath) {
      const { error: removeError } = await supabase.storage
        .from("useravatars")
        .remove([oldFilePath]);
      if (removeError) {
        console.warn("Failed to remove old avatar:", removeError.message);
      } else {
        console.log("Old avatar removed:", oldFilePath);
      }
    }

    setAvatarPath(newFilePath);
    // 4. Download new avatar blob
    const { data: file, error: downloadError } = await supabase.storage
      .from("useravatars")
      .download(newFilePath);

    if (downloadError || !file) {
      console.error("Download failed:", downloadError?.message);
      return;
    }

    // 5. Revoke previous object URL to avoid memory leak
    if (userData.avatar_image_link?.startsWith("blob:")) {
      URL.revokeObjectURL(userData.avatar_image_link);
    }

    // 6. Update local state
    const newBlobUrl = URL.createObjectURL(file);
    setUserData((prev) => prev && ({
      ...prev,
      avatar_image_link: newBlobUrl,
    }));
    setSelectedFile(null);
  };

  if (isLoading || !userData) {
    return <div className="text-center text-gray-500 mt-10">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-16 bg-gray-900 text-white flex flex-col items-center py-4">
        <div className="mb-8">Skillify</div>
        <div className="mb-8">💬</div>
        <div className="mb-8">📊</div>
        <div className="mb-8">⚙️</div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl text-black font-bold">Profile & Settings</h1>

        {/* Tabs */}
        <div className="mt-4 border-b text-black flex space-x-6">
          {[{ id: "profile", label: "Udemy profile" },
          { id: "picture", label: "Profile picture" },
          { id: "privacy", label: "Privacy settings" }].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`pb-2 text-lg font-medium focus:outline-none focus:ring-0 ${tab === t.id ? "border-b border-black" : "text-gray-500"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile Form */}
        {tab === "profile" && (
          <form
            className="mt-6 bg-white p-6 rounded-lg shadow-md"
            onSubmit={(e) => {
              e.preventDefault();
              handleProfileSave();
            }}
          >
            <div className="grid grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm text-black font-medium">First Name</label>
                <input
                  className="mt-1 p-2 w-full text-black border border-black rounded"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, first_name: e.target.value }))
                  }
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm text-black font-medium">Last Name</label>
                <input
                  className="mt-1 p-2 w-full text-black border border-black rounded"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, last_name: e.target.value }))
                  }
                />
              </div>

              <div className="col-span-2 grid grid-cols-2 gap-6">
                {/* Headline */}
                <div>
                  <label className="block text-sm text-black font-medium">Headline</label>
                  <input
                    className="mt-1 p-2 w-full text-black border border-black rounded"
                    value={`${userData.role? 'Instructor' : 'Learner'} at Skillify`}
                    disabled
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-black font-medium">Email</label>
                  <input
                    className="mt-1 p-2 w-full text-black border border-black rounded"
                    value={userData.email}
                    disabled
                  />
                </div>
              </div>

              {/* Biography */}
              <div className="col-span-2">
                <label className="block text-sm text-black font-medium">Biography</label>
                <textarea
                  className="mt-1 p-2 w-full text-black border border-black rounded h-24"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                />
              </div>
              {["Website", "X", "Facebook", "LinkedIn", "YouTube"].map((label, index) => (
                <div key={index}>
                  <label className="block text-sm text-black font-medium">{label}</label>
                  <input className="mt-1 p-2 w-full text-black border border-black rounded"
                    placeholder={label === "Website" ? "Url" : `http://www.${label.toLowerCase()}.com/`} />
                </div>
              ))}
              <div>
                <label className="block text-sm text-black font-medium">Language</label>
                <select className="mt-1 p-2 w-full text-black border border-black rounded">
                  <option>English (US)</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Save
            </button>
          </form>
        )}

        {/* Profile Picture */}
        {tab === "picture" && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-black">Image preview</h2>
            <p className="text-sm text-gray-500">Minimum 200x200 pixels, Maximum 6000x6000 pixels</p>

            <div className="mt-4 flex flex-col items-center border border-gray-300 p-4 rounded-lg w-full">
              {/* Hình đại diện */}
              <div className="w-40 h-40 flex items-center justify-center border border-gray-400 rounded-full bg-gray-200 overflow-hidden">
                <img
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : userData?.avatar_image_link
                        ? userData.avatar_image_link
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          `${userData?.first_name || ""} ${userData?.last_name || ""}`.trim()
                        )}&background=cccccc&color=ffffff`
                  }
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full border border-gray-300"
                />
              </div>

              {/* Upload ảnh */}
              <div className="mt-4 w-full border border-gray-300 rounded-lg flex items-center p-2">
                <span className="flex-1 text-gray-500 truncate">
                  {selectedFile ? selectedFile.name : "No file selected"}
                </span>
                <label className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 cursor-pointer">
                  {selectedFile || userData.avatar_image_link ? "Change" : "Upload image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Nút Save */}
              <button
                onClick={handleImageUpload}
                disabled={!selectedFile}
                className={`mt-4 px-4 py-2 rounded ${selectedFile
                  ? "bg-purple-500 text-white hover:bg-purple-600"
                  : "bg-purple-200 text-purple-500 opacity-50 cursor-not-allowed"
                  }`}
              >
                Save
              </button>
            </div>
          </div>
        )}

        {tab === "privacy" && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md max-w-xl">
            <h2 className="text-xl font-bold text-black">Change Password</h2>
            <div className="mt-4">
              <label className="block text-sm font-medium text-black">Confirm Old Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="mt-1 p-2 pr-28 w-full border border-black text-black rounded"
                  value={passwordData.old_password}
                  onChange={(e) =>
                    setPasswordData((prev) => ({ ...prev, old_password: e.target.value }))
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-purple-600 underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-black">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="mt-1 p-2 pr-28 w-full border border-black text-black rounded"
                  value={passwordData.new_password}
                  onChange={(e) =>
                    setPasswordData((prev) => ({ ...prev, new_password: e.target.value }))
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-purple-600 underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-black">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="mt-1 p-2 pr-28 w-full border border-black text-black rounded"
                  value={passwordData.confirm_password}
                  onChange={(e) =>
                    setPasswordData((prev) => ({ ...prev, confirm_password: e.target.value }))
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-purple-600 underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Warning:</strong> Changing your password will sign you out. You can then sign back in with your new password.
            </p>
            <button
              onClick={handleChangePassword}
              className="mt-6 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Change Password
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
