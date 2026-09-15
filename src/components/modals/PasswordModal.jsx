import { LockKeyhole, Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";


import AppButton from "../ui/AppButton";
import AppInput from "../ui/AppInput";
import AppText from "../ui/AppText";

const PasswordModal = ({
  isOpen,
  title = "Private Messages",
  description = "Enter your password to continue.",
  confirmLabel = "Make Private",
  loading = false,
  onClose,
  onConfirm,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!password.trim()) return;

    onConfirm(password);
    setPassword("");
  };

  const handleClose = () => {
    setPassword("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#071723] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FCAC01]/15">
              <LockKeyhole size={22} className="text-[#FCAC01]" />
            </div>

            <div>
              <AppText variant="heading">{title}</AppText>

              <AppText variant="caption" className="mt-1 text-white/60">
                {description}
              </AppText>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="rounded-xl p-2 transition hover:bg-white/10"
          >
            <X size={18} className="text-white/60" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="relative">
            
            <AppInput
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              name="private-message-key"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 transition hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <AppText variant="caption" className="text-white/45"></AppText>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-5">
          <AppButton variant="secondary" onClick={handleClose}>
            Cancel
          </AppButton>

          <AppButton
            variant="primary"
            disabled={!password.trim() || loading}
            onClick={handleConfirm}
          >
            {loading ? "Saving..." : confirmLabel}
          </AppButton>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
