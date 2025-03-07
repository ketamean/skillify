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

interface ProfilePageProps {
  userId: string;
}

export default function ProfilePage({ userId }: ProfilePageProps) {
  const [tab, setTab] = useState("profile");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let { data: instructor, error: instructorError } = await supabase
          .from("instructors")
          .select("*")
          .eq("id", userId)
          .single();

        if (instructor) {
          setUser({ ...instructor, role: "instructor" });
          return;
        }

        let { data: learner, error: learnerError } = await supabase
          .from("learners")
          .select("*")
          .eq("id", userId)
          .single();

        if (learner) {
          setUser({ ...learner, role: "learner" });
          return;
        }

        if (instructorError && learnerError) {
          console.error("User not found in both tables");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [userId]);

  if (!user) {
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
              className={`pb-2 text-lg font-medium focus:outline-none focus:ring-0 ${
                tab === t.id ? "border-b border-black" : "text-gray-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile Form */}
        {tab === "profile" && (
          <form className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-2 gap-6">
              {["First Name", "Last Name", "Headline", "Biography"].map((label, index) => (
                <div key={index} className={label === "Biography" ? "col-span-2" : ""}>
                  <label className="block text-sm text-black font-medium">{label}</label>
                  {label === "Biography" ? (
                    <textarea className="mt-1 p-2 w-full text-black border border-black rounded h-24" />
                  ) : (
                    <input className="mt-1 p-2 w-full text-black border border-black rounded" defaultValue={
                      label === "First Name" ? user.first_name : 
                      label === "Last Name" ? user.last_name : 
                      label === "Headline" ? "Instructor at Udemy" : ""
                    } />
                    
                  )}
                </div>
              ))}
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
            <button className="mt-6 bg-purple-200 text-purple-500 px-4 py-2 rounded opacity-50 cursor-not-allowed">
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
                {selectedFile ? (
                  <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                ) : user.avatar_image_link ? (
                  <img src={user.avatar_image_link} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500">No file selected</span>
                )}
              </div>

              {/* Upload ảnh */}
              <div className="mt-4 w-full border border-gray-300 rounded-lg flex items-center p-2">
                <span className="flex-1 text-gray-500 truncate">
                  {selectedFile ? selectedFile.name : "No file selected"}
                </span>
                <label className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 cursor-pointer">
                  {selectedFile || user.avatar_image_link ? "Change" : "Upload image"}
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
                className={`mt-4 px-4 py-2 rounded ${
                  selectedFile ? "bg-purple-500 text-white hover:bg-purple-600" : "bg-purple-200 text-purple-500 opacity-50 cursor-not-allowed"
                }`}
                disabled={!selectedFile}
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
  