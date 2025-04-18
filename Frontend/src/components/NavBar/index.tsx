import React, { ReactElement, useState } from "react";
import UserMiniAvatar from "../UserMiniAvatar";
import SearchBar from "./SearchBar";
import SearchOverlay from "./SearchOverlay";
import SearchIcon from "./SearchIcon";
import BurgerMenuOverlay from "./BurgerMenuOverlay";
import { useAuth } from "../../context/AuthContext";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
interface NavBarUserInfo {
  fname: string;
  lname: string;
  email?: string;
  avatarUrl?: string;
}
interface NavBarProps {
  disabled?: boolean;
  children?: React.ReactNode;
  toInstructor?: boolean;
  isLoggedIn?: boolean;
  user: NavBarUserInfo;
}

interface BurgerMenuIconProps {
  menuState: boolean;
  setMenuState: (state: boolean) => void;
}

function BurgerMenuIcon(props: BurgerMenuIconProps): ReactElement {
  return (
    <div
      className="flex-col gap-y-1 h-auto cursor-pointer
            flex relative
            md:hidden"
      onClick={() => props.setMenuState(true)}
    >
      {/* 3 horizontal lines */}
      <div className="rounded-2xl bg-white py-0.5 px-3"></div>
      <div className="rounded-2xl bg-white py-0.5 px-3"></div>
      <div className="rounded-2xl bg-white py-0.5 px-3"></div>
    </div>
  );
}

export default function NavBar(props: NavBarProps): ReactElement {
  const [searchOverlayState, setSearchOverlayState] = useState(false);
  const [burgerMenuState, setBurgerMenuState] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <nav
        className="w-full h-24 sticky top-0 left-0 py-4 px-[4%] flex items-center bg-deepteal z-30
                gap-x-2
                md:gap-x-4"
      >
        <div className="min-w-fit h-full flex items-center text-white! gap-x-3">
          {/* burger menu icon */}
          <BurgerMenuIcon
            menuState={burgerMenuState}
            setMenuState={setBurgerMenuState}
          />

          {/* logo */}
          <a
            href="/"
            className="text-decoration-none! text-white! font-bold! text-2xl! hover:text-white! hover:no-underline!"
          >
            <span>Skillify</span>
          </a>
        </div>

        <div
          className="h-full
                        hidden
                        md:flex md:w-full md:min-w-100"
        >
          <SearchBar disabled={false} />
        </div>

        <div
          className="flex flex-row gap-x-8 justify-end w-full
                    md:justify-self-end
                "
        >
          <div
            title="Go to home page"
            className="w-12 max-h-full h-12 items-center
                            hidden
                            md:flex md:min-w-fit"
          >
            <a
              href="#"
              className="text-decoration-none! text-white! text-lg font-bold! hover:text-light-green! hover:no-underline!"
            >
              <span>Home</span>
            </a>
          </div>

          <div
            title="Go to instructor page"
            className="w-12 max-h-full h-12 items-center
                            hidden
                            md:flex md:min-w-fit"
          >
            <a
              href="#"
              className="text-decoration-none! text-white! text-lg font-bold! hover:text-light-green! hover:no-underline!"
            >
              <span>Instructor</span>
            </a>
          </div>

          {user && (
            <div
              className="h-12 items-center
                                      hidden
                                      md:flex md:min-w-fit"
            >
              <span className="text-white text-sm">
                {user.email || "Not signed in"}
              </span>
            </div>
          )}

          {user && (
            <Button onClick={logout}>
              <span>Logout</span>
            </Button>
          )}

          {!user && (
            <Button
              onClick={() => {
                navigate("/login");
              }}
            >
              <span>Login</span>
            </Button>
          )}

          <div
            title="View basic settings"
            className="w-fit h-auto cursor-pointer flex items-center
                            justify-end gap-x-4
                            md:justify-center md:min-w-fit"
          >
            <div
              className="min-w-8 h-8 justify-end items-center
                            flex col-span-1 col-start-3 row-start-1
                            md:hidden"
              onClick={() => setSearchOverlayState(true)}
            >
              <SearchIcon onClick={() => setSearchOverlayState(true)} />
            </div>
            <UserMiniAvatar
              fname={user?.fname || "F"}
              lname={user?.lname || "L"}
              title="View basic settings"
              avatarUrl={user?.avatar_url}
              onClick={() => navigate("/profile")}
            />
          </div>
        </div>
      </nav>
      <SearchOverlay
        state={searchOverlayState}
        setState={setSearchOverlayState}
        // use the default onSubmit
      />
      <BurgerMenuOverlay
        state={burgerMenuState}
        setState={setBurgerMenuState}
      />
    </>
  );
}
