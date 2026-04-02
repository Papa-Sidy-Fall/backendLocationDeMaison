import { z } from "zod";
export const registerSchema = z
    .object({
    fullName: z.string().trim().min(2, "fullName is required"),
    email: z.string().trim().toLowerCase().email("email is invalid"),
    phone: z.string().trim().min(8, "phone is required"),
    password: z.string().min(6, "password must contain at least 6 characters"),
    confirmPassword: z.string().optional(),
})
    .superRefine((data, context) => {
    if (data.confirmPassword !== undefined && data.confirmPassword !== data.password) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["confirmPassword"],
            message: "confirmPassword does not match password",
        });
    }
});
export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email("email is invalid"),
    password: z.string().min(1, "password is required"),
});
//# sourceMappingURL=auth.schema.js.map