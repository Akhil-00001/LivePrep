import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLogOut, FiUser } from "react-icons/fi";
import { ServerUrl } from "../App";
import { setUserData } from "../redux/userSlice";

// Closes a popover on outside click or Escape.
function useDismiss(open, onClose) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  return ref;
}

function Navbar() {
  const { userData } = useSelector((state) => state.user);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const creditRef = useDismiss(showCreditPopup, () => setShowCreditPopup(false));
  const userRef = useDismiss(showUserPopup, () => setShowUserPopup(false));

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("liveprep-auth");
      dispatch(setUserData(null));
      setShowCreditPopup(false);
      setShowUserPopup(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const credits = userData?.credits || 0;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-rule bg-paper/90 px-4 py-3 backdrop-blur sm:px-8">
      <Link to="/" className="voice text-title text-ink md:invisible">
        LivePrep
      </Link>

      {!userData ? (
        <button onClick={() => navigate("/auth")} className="btn btn-secondary">
          Sign in
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <div className="relative" ref={creditRef}>
            <button
              onClick={() => {
                setShowCreditPopup(!showCreditPopup);
                setShowUserPopup(false);
              }}
              aria-expanded={showCreditPopup}
              className="btn btn-quiet num text-graphite hover:text-ink"
            >
              <span className="num font-semibold text-ink">{credits}</span>
              <span>credits</span>
            </button>

            {showCreditPopup && (
              <div className="floating absolute right-0 z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] p-4">
                <p className="mb-3 text-body text-graphite">
                  Each interview uses credits. You have{" "}
                  <span className="num font-semibold text-ink">{credits}</span> left.
                </p>
                <button
                  onClick={() => {
                    setShowCreditPopup(false);
                    navigate("/pricing");
                  }}
                  className="btn btn-primary w-full"
                >
                  Buy credits
                </button>
              </div>
            )}
          </div>

          <div className="relative" ref={userRef}>
            <button
              onClick={() => {
                setShowUserPopup(!showUserPopup);
                setShowCreditPopup(false);
              }}
              aria-label="Account menu"
              aria-expanded={showUserPopup}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-body font-semibold text-white"
            >
              {userData?.name ? userData.name.slice(0, 1).toUpperCase() : <FiUser />}
            </button>

            {showUserPopup && (
              <div className="floating absolute right-0 z-50 mt-2 w-56 max-w-[calc(100vw-2rem)] py-2">
                <p className="truncate border-b border-rule px-4 pb-2.5 pt-1 text-body font-semibold text-ink">
                  {userData?.name}
                </p>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserPopup(false);
                      navigate("/history");
                    }}
                    className="w-full px-4 py-2 text-left text-body text-ink hover:bg-paper"
                  >
                    Your reports
                  </button>
                  <button
                    onClick={() => {
                      setShowUserPopup(false);
                      navigate("/about");
                    }}
                    className="w-full px-4 py-2 text-left text-body text-ink hover:bg-paper"
                  >
                    About LivePrep
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 border-t border-rule px-4 pb-1 pt-2.5 text-left text-body text-bad hover:underline"
                >
                  <FiLogOut />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
