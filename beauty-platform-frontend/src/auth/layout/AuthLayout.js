import "./../../styles/auth.css";
import DecoPanel from "./DecoPanel";
import FormPanel from "./FormPanel";

function AuthLayout({ children }) {
  return (
    <div className="shell">
      <DecoPanel />
      <FormPanel>
        {children}
      </FormPanel>
    </div>
  );
}

export default AuthLayout;