import "../styles/tailwind.css";
import AuthenticatedComponents from "../security/auth";

function WallboardApp({ Component, pageProps }) {
  return (
    <AuthenticatedComponents>
      <Component {...pageProps} />
    </AuthenticatedComponents>
  );
}

export default WallboardApp;
