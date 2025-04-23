import { useState, useEffect } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface BurgerMenuOverlayProps {
  state: boolean;
  setState: (state: boolean) => void;
}

export default function BurgerMenuOverlay(props: BurgerMenuOverlayProps) {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  useEffect(() => {
    props.setState(false);
  }, [windowWidth]);

  const handleNavigate = (path: string) => {
    navigate(path);
    props.setState(false);
  };

  const handleLogout = async () => {
    await logout();
    props.setState(false);
    navigate("/");
  };

  return (
    <Modal
      isOpen={props.state}
      onRequestClose={() => props.setState(false)}
      style={{
        overlay: {
          zIndex: 30,
        },
      }}
      className="fixed md:hidden"
    >
      <div className="flex flex-col fixed h-full w-3/5 left-0 bg-white pt-4">
        <a
          onClick={() => handleNavigate("/")}
          className="px-4 h-12 flex items-center text-decoration-none! text-black! text-lg font-bold! border-b-gray-300 border-b-1 hover:bg-gray-200 cursor-pointer"
        >
          Home
        </a>

        <a
          onClick={() => handleNavigate("/instructor/dashboard")}
          className="px-4 h-12 flex items-center text-decoration-none! text-black! text-lg font-bold! border-b-gray-300 border-b-1 hover:bg-gray-200 cursor-pointer"
        >
          Instructor
        </a>

        {user && (
          <>
            <a
              onClick={() => handleNavigate("/profile")}
              className="px-4 h-12 flex items-center text-decoration-none! text-black! text-lg font-bold! border-b-gray-300 border-b-1 hover:bg-gray-200 cursor-pointer"
            >
              Profile
            </a>
            <a
              onClick={() => handleNavigate("/mylearning")}
              className="px-4 h-12 flex items-center text-decoration-none! text-black! text-lg font-bold! border-b-gray-300 border-b-1 hover:bg-gray-200 cursor-pointer"
            >
              My Learning
            </a>

            {user.is_instructor && (
              <a
                onClick={() => handleNavigate("/instructor/dashboard")}
                className="px-4 h-12 flex items-center text-decoration-none! text-black! text-lg font-bold! border-b-gray-300 border-b-1 hover:bg-gray-200 cursor-pointer"
              >
                Instructor Dashboard
              </a>
            )}

            <a
              onClick={handleLogout}
              className="px-4 h-12 flex items-center text-decoration-none! text-red-500! text-lg font-bold! border-b-gray-300 border-b-1 hover:bg-gray-200 cursor-pointer"
            >
              Logout
            </a>
          </>
        )}

        {!user && (
          <a
            onClick={() => handleNavigate("/login")}
            className="px-4 h-12 flex items-center text-decoration-none! text-black! text-lg font-bold! border-b-gray-300 border-b-1 hover:bg-gray-200 cursor-pointer"
          >
            Login
          </a>
        )}
      </div>
    </Modal>
  );
}
