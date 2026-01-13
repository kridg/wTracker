import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../api/auth'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from "yup"
import { notifyError, notifySuccess } from '../../utils/notify'

const Register = () => {
    const navigate = useNavigate()
  return (
    <div className="wt-auth-shell">
      <div className="wt-auth-card">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 tracking-tight text-gray-900">
            Join wTracker
          </h1>
          <p className="text-sm md:text-base text-gray-600 font-medium">
            Create your account and start logging every rep and set.
          </p>
        </div>
        <Formik
          initialValues={{
             username: "", 
             email: "", 
             password: "", 
             confirmPassword:""
            }}
          validationSchema={Yup.object({
            username: Yup.string().required("Username is required"),
            email:Yup.string().email("Invalid email address").required("Email is required"),
            password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
            confirmPassword: Yup.string().oneOf([Yup.ref("password")],"Passwords must match").required("Required"),
          })}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await registerUser(values)
              notifySuccess("Account created. You can log in now.")
              navigate("/login")
            } catch (error) {
              notifyError(error.response?.data?.detail || "Registration failed")
              setErrors({ username: "Registration failed" })
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
                  placeholder="Choose a username"
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
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm font-medium"
                />
                <ErrorMessage
                  name="email"
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
                  placeholder="Create a password"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm font-medium"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-600 text-sm mt-1.5 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">
                  Confirm Password
                </label>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm font-medium"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-600 text-sm mt-1.5 font-medium"
                />
              </div>
  
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full wt-btn-primary mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-600 font-bold hover:text-red-700 transition-colors"
          >
            Sign In
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

export default Register