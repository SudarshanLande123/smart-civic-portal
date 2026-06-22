import { useForm } from "react-hook-form";

import { loginUser } from "../../services/authService";

import { useDispatch } from "react-redux";

import { setCredentials } from "../../redux/slices/authSlice";

import { useNavigate, Link } from "react-router-dom";

import Input from "../../components/common/Input";

import toast from "react-hot-toast";
import Button from "../../components/common/Button";

const Login = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await loginUser(data);

      dispatch(setCredentials(result));

      toast.success("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
      px-4
      "
    >
      <div
        className="
        w-full
        max-w-md
        bg-white
        p-6
        rounded-xl
        shadow-md
        "
      >
        <h1
          className="
          text-2xl
          font-bold
          text-center
          "
        >
          Smart Civic Portal
        </h1>

        <p
          className="
          text-center
          text-gray-500
          mt-2
          "
        >
          Welcome Back
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-6">
    

            <Input
              label="Email"
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
            />

            <p
              className="
              text-red-500
              text-sm
              "
            >
              {errors.email?.message}
            </p>
          </div>

          <div className="mt-4">


            <Input
              label="Password"
              type="password"
              {...register("password", {
                required: "Password is required",
              })}
            />

            <p>
              {errors.password?.message}
            </p>
          </div>
        
        <div className="mt-4">
          <Button 
            type="submit"
            
          >
            Login
          </Button>
          </div>
        </form>

        <p
          className="
          text-center
          mt-4
          "
        >
          Don't have an account?
          <Link
            to="/register"
            className="
            text-blue-600
            ml-2
            "
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
