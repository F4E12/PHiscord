"use client"; //will be rendered on the client side
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getAuth } from "firebase/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInUser } from "../lib/authentication";
import { useRouter } from "next/router";
import withGuest from "@/hoc/withGuest";
import { ModeToggle } from "@/components/mode-toggle";
import { Toaster } from "@/components/ui/toaster";
import { toast, useToast } from "@/components/ui/use-toast";

const auth = getAuth();

const formSchema = z.object({
  email: z.string().email({
    message: "- Invalid email address.",
  }),
  password: z.string().min(1, {
    message: "- Password must be filled.",
  }),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const user = await signInUser(values.email, values.password);
      console.log("User signed in: ", user);
      router.push("/home");
    } catch (error) {
      console.error("Error signing in: ", error.message);
      toast({
        variant: "destructive",
        title: "Error Singing In",
        description: error.message
      })
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full mt-5"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-1 items-center">
                <FormLabel>Email</FormLabel>
                <FormMessage className="italic text-xs" />
              </div>
              <FormControl>
                <Input {...field} className="bg-input" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-1 items-center">
                <FormLabel>Password</FormLabel>
                <FormMessage className="italic text-xs" />
              </div>
              <FormControl>
                <Input type="password" {...field} className="bg-input" />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className={buttonVariants({ variant: "form" })}>
          Submit
        </Button>
      </form>
    </Form>
  );
}

const LoginPage = () => {
  return (
    <React.Fragment>
      <Head>
        <title>PHiscord | Login</title>
      </Head>
      <div className="fixed">
        <ModeToggle />
      </div>
      <div className="bg-[url('/images/loginbg.svg')] h-screen grid place-items-center">
        <div className="flex flex-col items-center bg-background w-4/12 px-10 py-5 rounded-lg">
          <h1 className="text-primary text-2xl font-semibold">Welcome back!</h1>
          <h3>We're so excited to see you again!</h3>
          <LoginForm />
          <div className="mt-5 w-full flex-wrap flex justify-center gap-1">
            <p>Need an account?</p>
            <div className="text-form">
              <Link href="/register">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default withGuest(LoginPage);
