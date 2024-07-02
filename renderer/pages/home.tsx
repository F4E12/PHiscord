import React, { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { SiteHeader } from "@/components/site-header";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseApp";
import { signOutUser } from "../lib/authentication";
import withAuth from "../../renderer/hoc/withAuth";
import Layout from "../components/layout/Layout";
import monitorUserPresence from "@/lib/monitoruserpresence";

const HomePage = () => {
  //user -> currently login user
  //loading -> value of the user is loading or not
  //error -> is there any error while loading current user
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      // Start monitoring user presence when user is authenticated
      monitorUserPresence(user.uid);
    }
  }, [user]);

  return (
    <Layout>
      <Head>
        <title>PHiscord - Home Page</title>
      </Head>
    </Layout>
  );
};

export default withAuth(HomePage);
