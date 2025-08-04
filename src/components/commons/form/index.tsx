"use client";

import { ZodTypeAny } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
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

  // console.log("Form Data:", method.watch());

  const { onSubmit, isLoaded = true } = useInitialize(method);

  return (
    <FormProvider {...method}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={method.handleSubmit(onSubmit)}
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
