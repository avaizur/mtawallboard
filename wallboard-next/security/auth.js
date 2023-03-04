import { useRouter } from "next/router";
import Image from "next/image";
import jwt_decode from "jwt-decode";
import { v4 as uuidv4 } from "uuid";
import { useEffect, createContext, useContext, useState } from "react";
import LoadingIndicator from "../components/common/loadingIndicator";
const fetch = require("node-fetch");

const AuthContext = createContext({});

export default function AuthenticatedComponents({ children }) {
  const router = useRouter();

  const [render, setRender] = useState(true);
  const [wallboardGuid, setWallboardGuid] = useState("");

  let wallboard = { id: "", guid: "" };

  /**
   * Get/Assign new GUID for the wallboard
   */
  function assignBoardUUID() {
    let wallboardId = router.pathname.replace("/", "");

    let wallboardAuthGuid = localStorage.getItem(`${wallboardId}_guid`);

    if (!wallboardAuthGuid) {
      wallboardAuthGuid = uuidv4();
      localStorage.setItem(`${wallboardId}_guid`, wallboardAuthGuid);
      console.log(
        `Assigned new GUID [${wallboardAuthGuid}] to Wallboard [${wallboardId}]`
      );
    }

    setWallboardGuid(wallboardAuthGuid);

    return { wallboardId, wallboardAuthGuid };
  }

  /**
   * Keep checking for board authorisation
   */
  function checkBoardApprovalStatusAgainLater() {
    setTimeout(checkBoardApprovalStatus, 5000);
  }

  /**
   * Check if board has beenn approved
   */
  async function checkBoardApprovalStatus() {
    try {
      if (router.pathname && !router.pathname.startsWith("/approve")) {
        let { wallboardId, wallboardAuthGuid } = assignBoardUUID();

        /* get auth token from Dynamo for this board guid */
        let response = await fetch(`/api/auth?id=${id}&guid=${guid}`);
        const authToken = "";

        if (!token || token === "") {
          checkBoardApprovalStatusAgainLater();
        } else {
          var decoded = jwt_decode(token);

          var expiry = decoded.exp;

          /* token expired */
          if (expiry < new Date().getTime() / 1000) {
            checkBoardApprovalStatusAgainLater();
          } else {
            wallboard = { id: wallboardId, guid: wallboardAuthGuid };

            if (render === false) {
              setRender(true);
            }
          }
        }
      } else {
        setRender(true);
      }
    } catch (exception) {
      /* ignore */
    }
  }

  //   useEffect(() => {
  //     checkBoardApprovalStatus();
  //   });

  if (!render) {
    return (
      <div className="h-screen">
        <div className="flex justify-center pt-11">
          <div className="rounded-md bg-mta-smart-blue h-16 w-16">
            <Image src="/images/logo_white.png" width="100" height="100" />
          </div>
        </div>
        <div className="h-full flex flex-col justify-center items-center pb-11">
          <div className="font-bold text-6xl text-mta-primary-a pb-7">
            {wallboardGuid}
          </div>
          <LoadingIndicator color="mta-primary-a" height="11" width="11" />
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ wallboard }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export function hasUnauthorisationError(error) {
  var unauthorised = false;

  try {
    var message = error.message.toLowerCase();
    if (
      message.includes("unauthorised") ||
      message.includes("not authorised")
    ) {
      unauthorised = true;
    }
  } catch (exception) {
    /* ignore */
  }

  return unauthorised;
}

export function accountHasRoles(account, ...roles) {
  var hasAuthority = false;

  try {
    var permissions = account.permissions.map((p) => p.role);
    roles.forEach((r) => {
      if (permissions.includes(r)) {
        hasAuthority = true;
      }
    });
  } catch (exception) {
    /* ignore */
  }

  return hasAuthority;
}

export function hasAuthority(...roles) {
  var hasAuthority = false;

  try {
    const { user } = useAuth();
    var permissions = user.permissions.map((p) => p.role);
    if (permissions.includes(Role.ADMINISTRATOR)) {
      hasAuthority = true;
    } else {
      roles.forEach((r) => {
        if (permissions.includes(r)) {
          hasAuthority = true;
        }
      });
    }
  } catch (exception) {
    /* ignore */
  }

  return hasAuthority;
}

export const Role = {
  ADMINISTRATOR: "administrator",
};
