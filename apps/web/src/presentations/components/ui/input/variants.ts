import { cva, type VariantProps } from "class-variance-authority";

export const inputVariants = cva(
    "bg-white border border-solid rounded-md px-4 py-2 group relative flex items-center justify-center transition-opacity focus-within:border-primary",
    {
        variants: {
            variant: {
                default: "border-input",
                destructive: "border-destructive",
                disabled: "bg-muted text-muted-foreground cursor-not-allowed border-border-read-only",
                ghost: "border-none bg-transparent",
                underline: "border-0 border-b bg-transparent border-input rounded-none"
            },
            scale: {
                default: "h-12",
                md: "h-10",
                sm: "h-8"
            },
            uppercase: {
                false: "",
                true: "uppsercase"
            },
            full: {
                false: '',
                true: 'flex-1'
            }
        },
        defaultVariants: {
            scale: "default",
            variant: "default",
            uppercase: false,
            full: false
        }
    }
);

export type InputVariantsParameters = VariantProps<typeof inputVariants>;