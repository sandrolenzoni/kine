import * as React from "react";
import { X as XIcon } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { Button } from "../button";
import { inputVariants, type InputVariantsParameters } from "./variants";

export type InputProps = Omit<React.ComponentProps<"input">, "value"> &
  InputVariantsParameters & {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    clearValue?: boolean;
    alignText?: "left" | "right" | "center";
    contentRef?: React.Ref<HTMLDivElement>;
    onClearValue?: () => void;
    value?: string | number | null;
  };

export type InputContainerParams = React.ComponentProps<"div"> &
  InputVariantsParameters;

export const InputContainer = React.forwardRef<
  HTMLDivElement,
  InputContainerParams
>(({ variant, scale, uppercase, full, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex items-center gap-2 transition-colors",
      inputVariants({ variant, scale, uppercase, full, className }),
    )}
    {...props}
  />
));
InputContainer.displayName = "InputContainer";

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    className,
    onChange,
    disabled,
    variant,
    scale,
    uppercase,
    full,
    type,
    leftIcon,
    rightIcon,
    clearValue = true,
    onClearValue,
    contentRef,
    value,
    placeholder,
    alignText = "left",
    ...rest
  } = props;

  const inputVariant = React.useMemo(() => {
    if (disabled) return "disabled";
    if (rest["aria-invalid"]) return "destructive";
    return variant;
  }, [disabled, rest, variant]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;

    const val = uppercase ? e.target.value.toUpperCase() : e.target.value;

    const syntheticEvent = {
      ...e,
      target: { ...e.target, value: val },
    };

    onChange(syntheticEvent);
  };

  const handleClear = () => {
    if (disabled) return;
    if (onChange) {
      const event = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
    onClearValue?.();
  };

  return (
    <InputContainer
      ref={contentRef}
      scale={scale}
      variant={inputVariant}
      uppercase={uppercase}
      full={full}
      className={cn(className, "bg-transparent")}
    >
      {leftIcon && <div className="flex shrink-0 items-center">{leftIcon}</div>}

      <input
        {...rest}
        ref={ref}
        type={type}
        disabled={disabled}
        placeholder={placeholder ?? ""}
        value={value ?? ""}
        onChange={handleChange}
        autoComplete="off"
        className={cn(
          "appearance-none flex-1 min-w-0 bg-transparent border-none shadow-none focus:ring-0 outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          {
            "text-left": alignText === "left",
            "text-right": alignText === "right",
            "text-center": alignText === "center",
          },
        )}
      />

      {clearValue && value && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0 hover:bg-transparent"
          onClick={handleClear}
        >
          <XIcon
            size={16}
            weight="bold"
            className="text-muted-foreground hover:text-foreground"
          />
        </Button>
      )}

      {rightIcon && (
        <div className="flex shrink-0 items-center">{rightIcon}</div>
      )}
    </InputContainer>
  );
});

Input.displayName = "Input";

export default Input;
