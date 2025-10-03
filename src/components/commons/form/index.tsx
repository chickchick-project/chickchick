"use client";

import { ZodTypeAny } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldErrors,
  FieldValues,
  FormProvider,
  useForm,
  UseFormReturn,
} from "react-hook-form";

interface IForm<T extends FieldValues> {
  children: React.ReactNode;
  schema: ZodTypeAny;
  defaultValues?: DefaultValues<T>;
  useInitialize: (methods: UseFormReturn<T>) => {
    onSubmit: (data: T) => Promise<void>;
    isLoaded?: boolean;
  };
}

export default function Form<T extends FieldValues>({
  children,
  schema,
  defaultValues,
  useInitialize,
}: IForm<T>) {
  const method = useForm<T>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues,
  });

  const { onSubmit, isLoaded = true } = useInitialize(method);
  const onInvalid = (errors: FieldErrors<T>) => {
    console.error("Validation Errors:", JSON.stringify(errors, null, 2));
  };
  return (
    <FormProvider {...method}>
      <form
        onSubmit={method.handleSubmit(onSubmit, onInvalid)}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {isLoaded ? children : <></>}
      </form>
    </FormProvider>
  );
}
