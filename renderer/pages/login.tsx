"use client" //will be rendered on the client side
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getAuth } from "firebase/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInUser } from "../lib/authentication";
import { useRouter } from 'next/router';
import withGuest from "@/hoc/withGuest";

const auth = getAuth();

const formSchema = z.object({
    email: z.string().email({
      message: "Invalid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
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

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        const user = await signInUser(values.email, values.password);
        console.log("User signed in: ", user);
        router.push('/home');
      } catch (error) {
        console.error("Error signing in: ", error.message);
      }
    };
  
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password must be at least 6 characters." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  }
  
  const LoginPage=()=>{
    return (
      <React.Fragment>
        <Head>
          <title>PHiscord | Login</title>
        </Head>
        <LoginForm />
        <div className="w-full flex-wrap flex justify-center">
          <Link href="/home" className={buttonVariants()}>
            Home
          </Link>
        </div>
        <div className="w-full flex-wrap flex justify-center">
                <Link href="/register" className={buttonVariants()}>
                    Register
                </Link>
            </div>
      </React.Fragment>
    );
  }

  export default withGuest(LoginPage);