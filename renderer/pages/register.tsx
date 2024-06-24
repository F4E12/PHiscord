"use client"; // will be rendered on the client side
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
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
import { registerUser } from "../lib/createuser";
import { useRouter } from "next/router";
import withGuest from "@/hoc/withGuest";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, firestore } from "../../firebase/firebaseApp";

const formSchema = z.object({
  email: z.string().email({
    message: " - Invalid email address.",
  }),
  displayname: z.string().min(3, {
    message: " - Display name must be at least 4 characters.",
  }),
  username: z.string().min(3, {
    message: " - Username must be at least 4 characters.",
  }),
  password: z.string().min(6, {
    message: " - Password must be at least 6 characters.",
  }),
  month: z.string().min(1, {
    message: " - Month is required.",
  }),
  day: z.string().min(1, {
    message: " - Day is required.",
  }),
  year: z.string().min(1, {
    message: " - Year is required.",
  }),
});

export function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      displayname: "",
      username: "",
      password: "",
      month: "",
      day: "",
      year: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      const currentDetails = {
        id: user.uid,
        email: values.email,
        username: values.username,
        displayname: values.displayname,
        status: "",
        DOB: `${values.day}-${values.month}-${values.year}`,
      };

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log(user);
          const userDocRef = doc(firestore, "users", user.uid);
          await setDoc(userDocRef, currentDetails);
          router.push("/login"); // Redirect to login page after successful registration
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const months = Array.from({ length: 12 }, (v, k) => k + 1).map((month) => (
    <option key={month} value={month}>
      {month}
    </option>
  ));

  const days = Array.from({ length: 31 }, (v, k) => k + 1).map((day) => (
    <option key={day} value={day}>
      {day}
    </option>
  ));

  const years = Array.from(
    { length: 100 },
    (v, k) => new Date().getFullYear() - k
  ).map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ));

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
                <Input {...field} className="bg-primary" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="displayname"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-1 items-center">
                <FormLabel>Display Name</FormLabel>
                <FormMessage className="italic text-xs" />
              </div>
              <FormControl>
                <Input {...field} className="bg-primary" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-1 items-center">
                <FormLabel>Username</FormLabel>
                <FormMessage className="italic text-xs" />
              </div>
              <FormControl>
                <Input {...field} className="bg-primary" />
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
                <Input type="password" {...field} className="bg-primary" />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="text-sm font-medium leading-none">
          <p className="pb-2">Date Of Birth</p>
          <div className="flex space-x-4">
            <div className="flex-1">
              <FormField
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <select
                        {...field}
                        className="flex-1 bg-primary rounded-md px-3 py-2 w-full"
                      >
                        {/* <option value="">Month</option> */}
                        {months}
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                name="day"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <select
                        {...field}
                        className="flex-1 bg-primary rounded-md px-3 py-2 w-full"
                      >
                        {/* <option value="">Day</option> */}
                        {days}
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <select
                        {...field}
                        className="flex-1 bg-primary rounded-md px-3 py-2 w-full"
                      >
                        {/* <option value="">Year</option> */}
                        {years}
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <Button type="submit" className={buttonVariants({ variant: "form" })}>
          Submit
        </Button>
      </form>
    </Form>
  );
}

const RegisterPage = () => {
  return (
    <React.Fragment>
      <Head>
        <title>PHiscord | Register</title>
      </Head>
      <div className="bg-[url('/images/loginbg.svg')] h-screen grid place-items-center">
        <div className="flex flex-col items-center bg-background w-4/12 px-10 py-5 rounded-lg">
          <h1 className="text-primary text-2xl font-semibold">
            Create an account
          </h1>
          <RegisterForm />
          <div className="text-xs">
            By registering, you agree to PHiscord's Terms of Service and Privacy
            Policy
          </div>
          <div className="text-form mt-3">
            <Link href="/login">Already have an account?</Link>
          </div>
        </div>
      </div>
      {/* <div className="w-full flex-wrap flex justify-center">
        <Link href="/home" className={buttonVariants()}>
          Home
        </Link>
      </div> */}
    </React.Fragment>
  );
};

export default withGuest(RegisterPage);
