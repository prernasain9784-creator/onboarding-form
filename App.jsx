import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Validation schema
const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Minimum 8 characters required"),
  confirmPassword: z.string()
    .min(1, "Confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

function App() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    watch,
    trigger,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const data = watch();

  const stepFields = {
    1: ["firstName", "lastName", "dob"],
    2: ["email", "password", "confirmPassword"]
  };

  const isValid = {
    1: !!data.firstName?.trim() &&
       !!data.lastName?.trim() &&
       !!data.dob &&
       !errors.firstName &&
       !errors.lastName &&
       !errors.dob,

    2: !!data.email &&
       !!data.password &&
       !!data.confirmPassword &&
       !errors.email &&
       !errors.password &&
       !errors.confirmPassword &&
       data.password === data.confirmPassword
  };

  // Move to next step
  const nextStep = async () => {
    const valid = await trigger(stepFields[step]);

    if (valid) {
      setStep(step + 1);
    }
  };

  // Move to previous step
  const previousStep = () => {
    setStep(step - 1);
  };

  // Submit final form
  const onSubmit = (formData) => {
    console.log("Submitted Data:", {
      ...formData,
      password: "[REDACTED]",
      confirmPassword: "[REDACTED]"
    });

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="container">
        <div className="form-box success">
          <h1>✓ Success!</h1>
          <p>Your registration is completed successfully.</p>

          <button onClick={() => window.location.reload()}>
            Start Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">

      <div className="form-box">

        <h1>Employee Onboarding</h1>

        <p className="subtitle">
          Complete your registration in 3 simple steps.
        </p>

        {/* Progress Indicator */}

        <div className="progress-info">
          Step {step} of 3
        </div>

        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* STEP 1 */}

          {step === 1 && (
            <div>

              <h2>Personal Information</h2>

              <label>First Name</label>

              <input
                type="text"
                placeholder="Enter first name"
                {...register("firstName")}
              />

              {errors.firstName && (
                <p className="error">
                  {errors.firstName.message}
                </p>
              )}

              <label>Last Name</label>

              <input
                type="text"
                placeholder="Enter last name"
                {...register("lastName")}
              />

              {errors.lastName && (
                <p className="error">
                  {errors.lastName.message}
                </p>
              )}

              <label>Date of Birth</label>

              <input
                type="date"
                {...register("dob")}
              />

              {errors.dob && (
                <p className="error">
                  {errors.dob.message}
                </p>
              )}

            </div>
          )}

          {/* STEP 2 */}

          {step === 2 && (
            <div>

              <h2>Account Details</h2>

              <label>Email</label>

              <input
                type="email"
                placeholder="Enter email"
                {...register("email")}
              />

              {errors.email && (
                <p className="error">
                  {errors.email.message}
                </p>
              )}

              <label>Password</label>

              <div className="password-box">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  {...register("password")}
                />

                <button
                  type="button"
                  className="toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

              {errors.password && (
                <p className="error">
                  {errors.password.message}
                </p>
              )}

              <label>Confirm Password</label>

              <div className="password-box">

                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm password"
                  {...register("confirmPassword")}
                />

                <button
                  type="button"
                  className="toggle"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>

              </div>

              {errors.confirmPassword && (
                <p className="error">
                  {errors.confirmPassword.message}
                </p>
              )}

            </div>
          )}

          {/* STEP 3 */}

          {step === 3 && (
            <div>

              <h2>Review & Submit</h2>

              <div className="review">

                <h3>Personal Information</h3>

                <p>First Name: {data.firstName}</p>

                <p>Last Name: {data.lastName}</p>

                <p>Date of Birth: {data.dob}</p>

                <button
                  type="button"
                  className="edit"
                  onClick={() => setStep(1)}
                >
                  Edit
                </button>

              </div>

              <div className="review">

                <h3>Account Details</h3>

                <p>Email: {data.email}</p>

                <p>Password: ••••••••</p>

                <button
                  type="button"
                  className="edit"
                  onClick={() => setStep(2)}
                >
                  Edit
                </button>

              </div>

            </div>
          )}

          {/* Navigation Buttons */}

          <div className="buttons">

            {step > 1 && (
              <button
                type="button"
                className="back"
                onClick={previousStep}
              >
                Back
              </button>
            )}

            {step < 3 && (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isValid[step]}
              >
                Next
              </button>
            )}

            {step === 3 && (
              <button type="submit">
                Submit
              </button>
            )}

          </div>

        </form>

      </div>

    </div>
  );
}

export default App;