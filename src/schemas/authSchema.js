import {z} from "zod";

export const registerSchema = z.object({
    username: z.string().trim().toLowerCase().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 characters"),
    email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters").max(30),
    confirmPassword: z.string(),}).refine((data)=>data.password === data.confirmPassword,{  message: "Passwords do not match" , path: ["confirmPassword"] })

export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required")
})



export const updateProfileFormSchema = z.object({
  username: z.string().min(3).max(20).optional(),
  email: z.email().optional(),
  name: z.string().min(3).max(50).optional(),
  bio: z.string().min(3).max(100).optional(),
});
 
export const changePasswordFormSchema = z
  .object({
    oldPassword: z.string().min(8).max(50),
    newPassword: z.string().min(8).max(50),
    confirmPassword: z.string().min(6).max(50),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], 
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "New password must be different from old password",
    path: ["newPassword"],
  });
 