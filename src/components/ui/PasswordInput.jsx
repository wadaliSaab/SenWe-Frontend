import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import AppText from "./AppText";

function PasswordInput({
  label,
  placeholder,
  error,
  register,
  name,
  disabled = false,
  autoComplete = "off",
  
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex w-full flex-col gap-1">
      <label htmlFor={name}>
        <AppText variant="label">{label}</AppText>
      </label>

      <div className="relative">
        <input
          id={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          {...register(name)}
          className={`
            h-9
            w-full
            rounded-xl
            border
            bg-background
            px-4
            pr-12
            text-sm
            text-text-primary
            placeholder:text-text-secondary
            outline-none
            transition-all
            duration-200
            ${
              error
                ? "border-warning"
                : "border-text-secondary focus:border-accent"
            }
            ${disabled ? "opacity-60 cursor-not-allowed" : ""}
          `}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && (
        <AppText
          as="p"
          variant="small"
          className="text-warning"
        >
          {error.message}
        </AppText>
      )}
    </div>
  );
}

export default PasswordInput;