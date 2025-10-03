import React from "react";
import { Controller, useFormContext, FieldValues, Path } from "react-hook-form";
import { SubTitle } from "../SubTitle";

interface ReviewFormSectionProps<
  TFormValues extends FieldValues,
  TOption extends { key: string; label: string }
> {
  name: Path<TFormValues>;
  title: string;
  description?: string;
  options: readonly TOption[];
  renderOption: (
    option: TOption,
    isSelected: boolean,
    onChange: (value: any) => void
  ) => React.ReactNode;
  containerClassName?: string;
}

export const ReviewFormSection = <
  TFormValues extends FieldValues,
  TOption extends { key: string; label: string }
>({
  name,
  title,
  description,
  options,
  renderOption,
  containerClassName,
}: ReviewFormSectionProps<TFormValues, TOption>) => {
  const { control } = useFormContext<TFormValues>();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <SubTitle>{title}</SubTitle>
        {description && (
          <div className="text-black-300 text-sm">{description}</div>
        )}
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className={containerClassName}>
            {options.map((option) => (
              <React.Fragment key={option.key}>
                {renderOption(
                  option,
                  field.value === option.key,
                  field.onChange
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      />
    </div>
  );
};
