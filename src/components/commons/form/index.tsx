"use client";

import { ZodTypeAny } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldErrors,
  FieldValues,
  FormProvider,
  useForm,
} from "react-hook-form";
import { useEffect } from "react";

interface IForm<T extends FieldValues> {
  children: React.ReactNode;
  schema: ZodTypeAny;
  defaultValues?: DefaultValues<T>;
  onSubmit?: (data: T) => Promise<void>;
}

export default function Form<T extends FieldValues>({
  children,
  schema,
  defaultValues,
  onSubmit,
}: IForm<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  if (!onSubmit) {
    throw new Error("onSubmit prop is required");
  }

  const onInvalid = (errors: FieldErrors<T>) => {
    console.error("Validation Errors:", JSON.stringify(errors, null, 2));
  };

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        // style={{
        //   width: "100%",
        //   display: "flex",
        //   flexDirection: "column",
        // }}
      >
        {children}
      </form>
    </FormProvider>
  );
}
