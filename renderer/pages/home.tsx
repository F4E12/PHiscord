import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { SiteHeader } from "@/components/site-header";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../../firebase/firebaseApp";
import { signOutUser } from "../lib/authentication";
import withAuth from '../../renderer/hoc/withAuth';

const HomePage=()=> {
    //user -> currently login user
    //loading -> value of the user is loading or not
    //error -> is there any error while loading current user
    const [user, loading, error] = useAuthState(auth);

    const handleSignOut = async () => {
        try {
            await signOutUser();
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <React.Fragment>
            <Head>
                <title>PHiscord - Home Page</title>
            </Head>
            <SiteHeader />
            <div className="w-full flex-wrap flex justify-center">
                <Link href="/login" className={buttonVariants()}>
                    Login
                </Link>
            </div>
            <button className=""></button>
            <div className="text-center mt-4">
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error.message}</p>}
                {user ? (
                    <div>
                        <h1>Welcome, {user.email}</h1>
                        <button onClick={handleSignOut} className={buttonVariants()}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <h1>No user is signed in</h1>
                )}
            </div>
        </React.Fragment>
    );
};

export default withAuth(HomePage);
