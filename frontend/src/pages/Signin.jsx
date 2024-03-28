import { InputBox, Button } from "../components";

import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// import { BACKEND_URL } from "../config";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { BACKEND_URL } from "../config";

export const Signin = () => {
  const [otpButtonVisibility, setOtpButtonVisibility] = useState(true);
  const [phoneNo, setPhoneNo] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="phone:w-full sm:w-[400px] p-[20px]">
        <h1 className="text-4xl font-bold text-center text-[#292929] ">
          Enter Your Details
        </h1>
        <h2 className="text-lg text-center text-[#6c7480] mb-[20px]">
          Don't have an account?{" "}
          <Link
            className="underline underline-offset-auto hover:text-[#292929] hover:cursor-pointer"
            to={"/signup"}
          >
            Signup
          </Link>
        </h2>
        <PhoneInput
          style={{
            marginBottom: "15px",
            padding: "5px",
            border: "2px solid #eaeaec",
            borderRadius: "4px",
            height: "40px",
          }}
          defaultCountry="IN"
          placeholder="Enter phone number"
          value={phoneNo}
          onChange={setPhoneNo}
        />
        {otpButtonVisibility ? (
          <button
            onClick={async () => {
              const toastId = toast.loading("Sending OTP");
              try {
                const response = await axios.post(`${BACKEND_URL}/login`, {
                  phoneNo: phoneNo,
                  password: "password",
                });
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("name", response.data.name);
              } catch (error) {
                if (error.response) {
                  return toast.error(error.response.data.message, {
                    id: toastId,
                  });
                } else if (error.request) {
                  return toast.error("No Response Received", {
                    id: toastId,
                  });
                } else {
                  return toast.error("Request Error:" + error.message, {
                    id: toastId,
                  });
                }
              }

              try {
                const res = await axios.post(`${BACKEND_URL}/sendCode`, {
                  token: localStorage.getItem("token"),
                });
                localStorage.setItem("phoneCodeHash", res.data.phoneCodeHash);
                toast.success("OTP sent to your telegram account", {
                  id: toastId,
                });
                setOtpButtonVisibility(false);
              } catch (error) {
                if (error.response) {
                  return toast.error(error.response.data.message, {
                    id: toastId,
                  });
                } else if (error.request) {
                  return toast.error("No Response Received", {
                    id: toastId,
                  });
                } else {
                  return toast.error("Request Error:" + error.message, {
                    id: toastId,
                  });
                }
              }
              // console.log(
              //   localStorage.getItem("token"),
              //   localStorage.getItem("phoneCodeHash")
              // );
            }}
            className="mb-[15px] mx-auto p-1 text-base flex justify-center items-center border border-transparent rounded bg-[#292929] text-white hover:bg-opacity-95 focus:border-transparent focus:ring-0 active:border-text"
          >
            Send OTP
          </button>
        ) : (
          <InputBox
            placeholder={"Enter OTP"}
            type={"number"}
            onchange={(e) => setOtp(e.target.value)}
          />
        )}
        <Button
          label={"Login"}
          onclick={async () => {
            const toastId = toast.loading("Logging in");
            try {
              const response = await axios.post(
                `${BACKEND_URL}/loginTelegram`,
                {
                  token: localStorage.getItem("token"),
                  phoneCode: otp,
                  phoneCodeHash: localStorage.getItem("phoneCodeHash"),
                }
              );
              navigate("/home");
              toast.dismiss(toastId);
            } catch (error) {
              if (error.response) {
                return toast.error(error.response.data.message, {
                  id: toastId,
                });
              } else if (error.request) {
                return toast.error("No Response Received", {
                  id: toastId,
                });
              } else {
                return toast.error("Request Error:" + error.message, {
                  id: toastId,
                });
              }
            }
          }}
        />
        <Toaster />
      </div>
    </div>
  );
};
