"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import AuthLayout from "@/app/components/auth/AuthLayout";
import InputField from "@/app/components/core/form-field/InputField";
import SubmitButton from "@/app/components/core/SubmitButton";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// Password validation criteria
const passwordCriteria = [
  { label: "At least 8 characters long", regex: /.{8,}/ },
  { label: "One uppercase letter", regex: /[A-Z]/ },
  { label: "One lowercase letter", regex: /[a-z]/ },
  { label: "One digit", regex: /\d/ },
  { label: "One special character", regex: /[!@#$%^&*(),.?":{}|<>]/ },
  { label: "No spaces", regex: /^\S*$/ },
];

// Yup validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must include at least one uppercase letter")
    .matches(/[a-z]/, "Must include at least one lowercase letter")
    .matches(/\d/, "Must include at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Must include at least one special character"
    )
    .matches(/^\S*$/, "Cannot contain spaces")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function SetNewPasswordPage() {
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();

  return (
    <AuthLayout>
      <div className="w-full max-w-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 text-left">
          Set New Password
        </h2>
        <p className="text-gray-600 text-sm text-left mb-6">
          Enter your new password below.
        </p>

        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            setTimeout(() => {
              console.log("New Password:", values.password);
              setSubmitting(false);
              router.push("/auth/login"); // Navigate to the success page
            }, 2000);
          }}
        >
          {({ values, handleChange, isSubmitting }) => (
            <Form className="space-y-5">
              {/* Password Input */}
              <InputField
                label="New Password"
                name="password"
                type="password"
                placeholder="Enter new password"
                onChanged={(value) => {
                  handleChange({ target: { name: "password", value } });
                  setIsTyping(true);
                }}
              />

              {/* Confirm Password Input */}
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
              />

              {/* Password Validation Criteria */}
              {isTyping && (
                <div className="mt-3 p-3">
                  {passwordCriteria.map(({ label, regex }, index) => {
                    const isValid = regex.test(values.password);
                    return (
                      <div key={index} className="flex items-center text-sm">
                        {isValid ? (
                          <FaCheckCircle className="text-green-500 mr-2" />
                        ) : (
                          <FaTimesCircle className="text-gray-400 mr-2" />
                        )}
                        <span
                          className={
                            isValid ? "text-green-600" : "text-gray-500"
                          }
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Submit Button */}
              <SubmitButton isLoading={isSubmitting} text="Set Password" />
            </Form>
          )}
        </Formik>
      </div>
    </AuthLayout>
  );
}
