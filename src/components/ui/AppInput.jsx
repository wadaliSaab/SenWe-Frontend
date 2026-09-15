import React from "react";
import App from "../../App";
import AppText from "./AppText";

function AppInput({
  label,
  placeholder,
  type = "text",
  error,
  register,
  name,
  disabled = false,
  autoComplete = "off",
  autoCapitalize = "none",
  spellCheck = false,
  value,
  onChange
}) {
  return (
    <div className="flex w-full flex-col gap-1 ">
      <label htmlFor={name}>
        <AppText variant="label">{label}</AppText>
      </label>
      <input
        id={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={!!error}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        spellCheck={spellCheck}
        className={`
        h-9
        w-full
        rounded-xl
        border
        bg-background
        px-4
        text-sm
       
        text-text-primary
        placeholder:text-text-secondary
        outline-none
        transition-all
        duration-200
        ${
          error ? "border-warning" : "border-text-secondary focus:border-accent"
        }
        ${disabled ? "cursor-not-allowed opacity-60" : ""}
    `}
        placeholder={placeholder}
        type={type}
         {...(register ? register(name) : {})}
      />
      {error && (
        <AppText as="p" variant="small" className="text-warning">
          {error.message}
        </AppText>
      )}
    </div>
  );
}

export default AppInput;
