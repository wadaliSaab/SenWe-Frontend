import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilLine, Check, X, Loader2 } from "lucide-react";

import AppText from "../../../ui/AppText";
import AppButton from "../../../ui/AppButton";
import AppInput from "../../../ui/AppInput";
import { updateProfile } from "../../../../services/userService";
import { updateProfileFormSchema } from "../../../../schemas/authSchema";

function InformationSection({ user, onUserUpdate }) {
  const initialData = {
    email: user.email || "",
    username: user.username || "",
    name: user.name || "",
    status: user.status || "",
    bio: user.bio || "",
  };

  const {
    register,
    trigger,
    getValues,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: initialData,
    mode: "onSubmit",
  });

  const [editingField, setEditingField] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [savingField, setSavingField] = useState("");
  const [serverError, setServerError] = useState({});

  const handleEdit = (field) => {
    clearErrors(field);
    setServerError((prev) => ({ ...prev, [field]: "" }));
    setEditingField(field);
  };

  const handleSave = async (field) => {
    const isValid = await trigger(field);
    if (!isValid) return; 

    setSavingField(field);
    setServerError((prev) => ({ ...prev, [field]: "" }));

    try {
      const value = getValues(field);
      const updated = await updateProfile({ [field]: value });
    
      onUserUpdate?.(updated);
      setEditingField("");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Update failed. Try again.";
       
      setServerError((prev) => ({ ...prev, [field]: message }));
    } finally {
      setSavingField("");
    }
  };

  const handleCancel = (field) => {
    setValue(field, initialData[field]);
    clearErrors(field);
    setServerError((prev) => ({ ...prev, [field]: "" }));
    setEditingField("");
  };

  const renderRow = ({ label, field, editable = true, multiline = false }) => {
    const isEditing = editingField === field;
    const isSaving = savingField === field;
    const clientError = errors[field];
    const apiError = serverError[field];
    const currentValue = getValues(field);

    let displayValue = currentValue;
    if (multiline && !expanded && displayValue.length > 180) {
      displayValue = displayValue.slice(0, 180) + "...";
    }

    return (
      <div key={field} className="flex flex-col py-3">
        <div className="flex items-start">
          <AppText variant="label" className="w-24 max-sm:text-xs sm:w-30 pt-3 shrink-0">
            {label}
          </AppText>

          <div className="flex-1">
            {multiline ? (
             
              <textarea
                rows={4}
                disabled={!isEditing || isSaving}
                {...register(field)}
                className={`w-full resize-none hide-scrollbar rounded-xl border bg-transparent sm:px-4 px-2 py-2 sm:text-sm text-xs text-text-secondary outline-none transition-all duration-200 ${
                  clientError
                    ? "border-warning"
                    : "border-text-secondary/30 focus:border-accent"
                } ${!isEditing || isSaving ? "cursor-not-allowed opacity-60" : ""}`}
              />
            ) : (
              
              <AppInput
                name={field}
                register={register}
                error={clientError}
                disabled={!editable || !isEditing || isSaving}
              />
            )}

            {multiline && !isEditing && currentValue.length > 180 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-xs text-accent hover:underline"
              >
                {expanded ? "Read Less" : "Read More"}
              </button>
            )}

           
            {multiline && clientError && (
              <AppText variant="label2" className="mt-1 text-warning">
                {clientError.message}
              </AppText>
            )}

            {!clientError && apiError && (
              <AppText variant="label2" className="mt-1 text-warning">
                {apiError}
              </AppText>
            )}
          </div>

          {editable &&
            (isEditing ? (
              <div className="flex gap-1 sm:gap-2 sm:p-2 p-1">
                <AppButton
                  variant="ghost"
                  size="icon"
                  disabled={isSaving}
                  onClick={() => handleSave(field)}
                >
                  {isSaving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Check size={18} />
                  )}
                </AppButton>

                <AppButton
                  variant="ghost"
                  size="icon"
                  disabled={isSaving}
                  onClick={() => handleCancel(field)}
                >
                  <X size={18} />
                </AppButton>
              </div>
            ) : (
              <AppButton
                variant="ghost"
                size="icon"
                className="p-2"
                onClick={() => handleEdit(field)}
              >
                <PencilLine size={16} />
              </AppButton>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <AppText
        variant="subtitle"
        className="border-b text-accent border-white/10 py-2"
      >
        Profile Information
      </AppText>

      {renderRow({ label: "Email", field: "email" ,editable: false })}
      {renderRow({ label: "Username", field: "username" })}
      {renderRow({ label: "Display Name", field: "name" })}
      {renderRow({ label: "Status", field: "status", editable: false })}
      {renderRow({ label: "Bio", field: "bio", multiline: true })}
    </div>
  );
}

export default InformationSection;