import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

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
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [avatarBlobUrl, setAvatarBlobUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    bio: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("Error fetching user:", error);
        return;
      }
      try {
        const { data: userFromDb, error: dbError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        if (dbError || !userFromDb) {
          console.error("Error fetching user data:", dbError);
          return;
        }

        const profile: UserProfile = {
          ...userFromDb,
          role: userFromDb.type?.toLowerCase?.() === "instructor" ? "Instructor" : "Learner",
        };
        setUserData(profile);

        if (userFromDb.avatar_image_link) {
          const { data, error } = await supabase.storage
            .from("useravatars")
            .download(userFromDb.avatar_image_link);
          if (data && !error) {
            setAvatarBlobUrl(URL.createObjectURL(data));
          }
        }
        
        setFormData({
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          bio: profile.bio || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);
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
    const filePath = `public/${userData.id}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("useravatars")
      .upload(filePath, selectedFile, { upsert: true });
    if (uploadError) {
      console.error("Upload failed:", uploadError.message);
      return;
    }

    const { error: dbUpdateError } = await supabase
      .from("users")
      .update({ avatar_image_link: filePath })
      .eq("id", userData.id);
    if (dbUpdateError) {
      console.error("Failed to update avatar in DB:", dbUpdateError.message);
    }

    const { data: newBlob, error: downloadError } = await supabase.storage
      .from("useravatars")
      .download(filePath);
    if (downloadError) {
      console.error("Download failed:", downloadError.message);
      return;
    }

    const freshBlobUrl = URL.createObjectURL(newBlob);
    setAvatarBlobUrl(freshBlobUrl);
    setSelectedFile(null);
  };
  if (!userData) {
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
                    value={`${userData.role} at Skillify`}
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
                      : avatarBlobUrl || "https://ui-avatars.com/api/?name=User&background=cccccc&color=ffffff"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
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

      </div>
    </div>
  );
}
