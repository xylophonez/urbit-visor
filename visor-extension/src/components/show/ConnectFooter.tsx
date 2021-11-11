import * as React from "react";
import Spinner from "../ui/svg/Spinner";

interface ConnectFooterProps {
  setPw: (value: string) => void;
  loading: boolean;
  error: string;
  confirmString: string;
  children: React.ReactNode;
}

const ConnectFooter = ({
  setPw,
  loading,
  error,
  confirmString,
  children,
}: ConnectFooterProps) => (
  <>
    <div className="flex-grow">
      <p className="confirm-string">{confirmString}</p>
      <label className="label-input">Master Password</label>
      <input
        onChange={(e) => setPw(e.currentTarget.value)}
        type="password"
        placeholder="Master Password"
      />
      <div className="spinner">
        {loading && (
          <Spinner
            width="24"
            height="24"
            innerColor="white"
            outerColor="black"
          />
        )}
        <p className="errorMessage">{error}</p>
      </div>
    </div>
    {children}
  </>
);

export default ConnectFooter;
