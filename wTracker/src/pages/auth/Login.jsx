import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Link, useNavigate } from "react-router-dom"
import { loginUser } from "../../api/auth"
import { useAuth } from "../../context/AuthContext"
import { notifyError, notifySuccess } from "../../utils/notify"

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="wt-auth-shell">
      <div className="wt-auth-card">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 tracking-tight text-gray-900">
            Welcome Back
          </h1>
          <p className="text-sm md:text-base text-gray-600 font-medium">
            Log your sessions and stay consistent with your training.
          </p>
        </div>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={Yup.object({
            username: Yup.string().required("Username is required"),
            password: Yup.string().required("Password is required"),
          })}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              const data = await loginUser(values)
              login(data.access, data.refresh)
              notifySuccess("Logged in successfully")
              navigate("/dashboard")
            } catch (error) {
              notifyError(error.response?.data?.detail || "Invalid username or password")
              setErrors({ password: "Invalid username or password" })
            } finally {
              setSubmitting(false)
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">
                  Username
                </label>
                <Field
                  name="username"
                  placeholder="Enter your username"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm font-medium"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-600 text-sm mt-1.5 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm font-medium"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-600 text-sm mt-1.5 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full wt-btn-primary mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Logging in..." : "Sign In"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-sm text-gray-600 mt-8">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-red-600 font-bold hover:text-red-700 transition-colors"
          >
            Create Account
          </Link>
        </p>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
