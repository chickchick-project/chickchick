import {
  Controller,
  ControllerRenderProps,
  FieldError,
  useFormContext,
} from "react-hook-form";
import { ProfileRow } from "./ProfileRow";

interface FormFieldProps {
  name: string;
  label: string;
  isRequired?: boolean;
  children: (
    field: ControllerRenderProps,
    error?: FieldError
  ) => React.ReactNode;
}

export const FormField = ({
  name,
  label,
  isRequired,
  children,
}: FormFieldProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <ProfileRow label={label} htmlFor={name} isRequired={isRequired}>
          {children(field, error)}
          {error && (
            <p className="text-sm text-red-500 mt-1">{error.message}</p>
          )}
        </ProfileRow>
      )}
    />
  );
};
