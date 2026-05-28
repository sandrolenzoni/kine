import * as React from "react";
import { Button as Slot } from "@base-ui/react/button";
import { LoaderCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../../lib/utils";

const buttonVariants = cva(
  "rounded-md cursor-pointer inline-flex items-center text-center justify-center gap-2 whitespace-nowrap text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        success:
          "bg-success text-white shadow-xs hover:bg-success/90 focus-visible:ring-success/20 dark:focus-visible:ring-success/40 dark:bg-success/60",
        outline:
          "border border-primary bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        "outline-destructive":
          "border border-destructive bg-background text-destructive hover:bg-destructive/5 dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        "outline-success":
          "border border-success bg-background text-success hover:bg-success/10 dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        "ghost-destructive": "text-destructive hover:bg-destructive/10",
        secondary:
          "bg-secondary font-medium text-primary hover:bg-secondary/80",
        "secondary-destructive":
          " bg-destructive/13 font-medium text-destructive hover:bg-destructive/20",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline cursor-pointer",
      },
      size: {
        default: "h-12 px-4 py-[16.5px] has-[>svg]:px-3",
        md: "h-10 px-6 has-[>svg]:px-4",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5 rounded-sm",
        icon: "size-9 flex items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  disabled,
  asChild = false,
  children,
  loading = false,
  type = "button",
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  const disabledButton = React.useMemo(() => {
    if (disabled || loading) return true;
    return false;
  }, [disabled, loading]);

  return (
    <Comp
      data-slot="button"
      type={type}
      disabled={disabledButton}
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        }),
      )}
      {...props}
    >
      {loading ? <LoaderCircle className="animate-spin" /> : children}
    </Comp>
  );
}

export { Button, buttonVariants };
