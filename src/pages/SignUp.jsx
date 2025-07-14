import { useNavigate } from "react-router";
import SignUpForm from "../components/SignUpForm";

export default function SignUp() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold mb-2">Sign Up</h2>
          <p className="text-gray-500 mb-6">
            Enter your name, username, and password to sign up!
          </p>
          <SignUpForm />
          <p className="mt-4">
            Already have an account?{" "}
            <span
              className="font-semibold cursor-pointer text-blue-600 hover:text-blue-800"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden md:flex w-1/2 bg-[#4665F6] text-white flex-col justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4 mb-4">
            <img
              src="src/assets/LOGO.svg"
              alt="logo"
              className="h-16 w-16 object-contain"
            />
            <h1 className="text-4xl font-bold">BankTech Pro</h1>
          </div>
          <p className="text-center mt-2 px-8">Your Digital Banking Partner</p>
        </div>
      </div>
    </div>
  );
}
