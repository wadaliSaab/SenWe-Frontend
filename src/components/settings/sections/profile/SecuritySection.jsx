import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Trash2, Loader2 } from "lucide-react";
import AppText from "../../../ui/AppText";
import AppButton from "../../../ui/AppButton";
import PasswordInput from "../../../ui/PasswordInput";
import { changePassword, deleteAccount } from "../../../../services/userService";
import { useAuth } from "../../../../hooks/useAuth";
import { changePasswordFormSchema } from "../../../../schemas/authSchema";

function SecuritySection() {
  const { logoutDevice } = useAuth();

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleCancel = () => {
    reset();
    setServerError("");
    setShowChangePassword(false);
  };

  const onSubmit = async (data) => {
    setServerError("");
    setIsChangingPassword(true);
    try {
      await changePassword(data.oldPassword, data.newPassword);
      handleCancel();

    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to change password. Check your current password.";
      setServerError(message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDelete = async () => {
    setDeleteError("");
    setIsDeleting(true);
    try {
      await deleteAccount();
      setIsDeleting(false);
      logoutDevice?.();
    } catch (err) {
      setDeleteError(err?.response?.data?.message || "Failed to delete account.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-7 py-4 pb-16">
      <AppText as="h2" variant="subheading" className="border-b border-shadow/60 pb-3">
        Security
      </AppText>

      {/* Password */}
      <div className="rounded-2xl border border-shadow/60 bg-background">
        <div className="flex items-center justify-between sm:px-5 sm:py-5  py-3">
          <div className="flex items-center sm:gap-4 gap-1">
            <div className="flex w-9 h-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-card">
              <Lock className="text-accent size-4 sm:size-5" />
            </div>
            <div>
              <AppText variant="label" className="sm:text-xs  text-2xs">
                Password
              </AppText>
              <AppText variant="label2" className="mt-1 max-sm:text-2xs  tracking-[0.25rem] sm:tracking-[0.35rem]">
                ••••••••••••
              </AppText>
            </div>
          </div>

          <AppButton
            variant="ghost"
            className="sm:text-sm text-2xs"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            {showChangePassword ? "Hide" : "Change Password"}
          </AppButton>
        </div>

        {showChangePassword && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="border-t border-shadow/60 sm:px-5 sm:py-5 px-3 py-3"
          >
            <div className="space-y-5">
              <PasswordInput
                label="Old Password"
                name="oldPassword"
                register={register}
                error={errors.oldPassword}
                placeholder="Enter old password"
                disabled={isChangingPassword}
              />

              <PasswordInput
                label="New Password"
                name="newPassword"
                register={register}
                error={errors.newPassword}
                placeholder="Enter new password"
                disabled={isChangingPassword}
              />

              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                register={register}
                error={errors.confirmPassword}
                placeholder="Confirm new password"
                disabled={isChangingPassword}
              />

              {serverError && (
                <AppText variant="label2" className="text-warning">
                  {serverError}
                </AppText>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <AppButton
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={isChangingPassword}
                >
                  Cancel
                </AppButton>

                <AppButton type="submit" variant="primary" disabled={isChangingPassword}>
                  {isChangingPassword ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Update Password"
                  )}
                </AppButton>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Delete Account */}
      <div className="rounded-2xl border border-warning/20 bg-warning/5 p-4 gap-4 sm:p-5">
        <div className="flex items-start justify-between  sm:gap-5">
          <div className="flex sm:gap-4 gap-2">
            <div className="flex sm:h-10 sm:w-10 w-6 h-6 items-center justify-center rounded-xl bg-warning/10">
              <Trash2 size={14} className="text-warning " />
            </div>
            <div className="flex items-center ">
              <AppText variant="label" className="max-sm:text-2xs">Delete Account</AppText>
             
            </div>
            
          </div>

          {showDeleteConfirm ? (
            <div className="flex shrink-0  justify-end items-center gap-2 max-sm:px-1  ">
              <AppButton
                variant="ghost"
                className="max-sm:text-2xs  px-1"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </AppButton>
              <AppButton
                variant="ghost"
                className="text-warning hover:bg-warning/10  max-sm:text-2xs rounded-md max-sm:px-1"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : "Confirm"}
              </AppButton>
            </div>
          ) : (
            <AppButton
              variant="ghost"
              className="text-warning hover:bg-warning/10 max-sm:text-xs max-sm:px-1"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete
            </AppButton>
          )}
        </div>
        <div className="mt-3 flex items-center">
          <AppText variant="label2" className="mt-1 text-text-secondary ">
                Permanently delete your account, chats, messages and all
                associated data. This action cannot be undone.
              </AppText>
              {deleteError && (
                <AppText variant="label2" className="mt-2 text-warning">
                  {deleteError}
                </AppText>
              )}
        </div>
      </div>
    </div>
  );
}

export default SecuritySection;