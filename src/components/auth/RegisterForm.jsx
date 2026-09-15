import React from "react";
import AppInput from "../ui/AppInput";
import PasswordInput from "../ui/PasswordInput";
import AppText from "../ui/AppText";
import AppButton from "../ui/AppButton";
import { useForm } from "react-hook-form";
import { registerSchema } from "../../schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { register as registerUser } from "../../services/authService";

function RegisterForm({ setMode, onRegisterSuccess, setRegisteredEmail }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data);
      setRegisteredEmail(response.email);
      onRegisterSuccess(response);
    } catch (error) {
     const {code , field , message} = error.response?.data || {};
     if(code === "USERNAME_ALREADY_EXISTS" || code === "EMAIL_ALREADY_EXISTS" ){
        setError(field, {
          type: "server",
          message,
        });
        return
     }
     console.error(error);
    }
  };
  return (
    <div className="  flex flex-col gap-2 ">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <AppInput
          name="username"
          register={register}
          error={errors.username}
          label="username"
          placeholder="Enter username"
        />
        <AppInput
          name="email"
          register={register}
          error={errors.email}
          label="Email"
          placeholder="name@example.com"
        />
        <PasswordInput
          name="password"
          register={register}
          error={errors.password}
          label="Password"
          placeholder="Create a password"
        />
        <PasswordInput
          name="confirmPassword"
          register={register}
          error={errors.confirmPassword}
          label="Confirm Password"
          placeholder="Confirm your password"
        />
        <AppButton
          type="submit"
          variant="primary"
          fullWidth
          loading={isSubmitting}
          size="sm"
          className="mt-2"
        >
          Create Account
        </AppButton>
      </form>
      {/* foot */}
      <div className="flex items-center justify-center pt-1  text-sm">
        <AppText as="span" variant="body" className="text-text-secondary ">
          already have an account ?
        </AppText>
        <AppButton as="span" variant="link" onClick={() => setMode("login")}>
          Login
        </AppButton>
      </div>
    </div>
  );
}

export default RegisterForm;
