import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import { registerUser } from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await registerUser(data);

      dispatch(setCredentials(result));

      toast.success("Registration Successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center">
          Smart Civic Portal
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Create Account
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-6">
            <label>Name</label>

            <input
              type="text"
              className="w-full border rounded-lg p-3 mt-2"
              {...register("name", {
                required: "Name is required",
              })}
            />

            <p className="text-red-500 text-sm">
              {errors.name?.message}
            </p>
          </div>

          <div className="mt-4">
            <label>Email</label>

            <input
              type="email"
              className="w-full border rounded-lg p-3 mt-2"
              {...register("email", {
                required: "Email is required",
              })}
            />

            <p className="text-red-500 text-sm">
              {errors.email?.message}
            </p>
          </div>

          <div className="mt-4">
            <label>Password</label>

            <input
              type="password"
              className="w-full border rounded-lg p-3 mt-2"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message:
                    "Password must be at least 6 characters",
                },
              })}
            />

            <p className="text-red-500 text-sm">
              {errors.password?.message}
            </p>
          </div>


          <button
            type="submit"
            
            className="w-full bg-blue-600 text-white p-3 rounded-lg mt-6"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?
          <Link
            to="/login"
            className="text-blue-600 ml-2"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;