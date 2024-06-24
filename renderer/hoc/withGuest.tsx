import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseApp";

const withGuest = (WrappedComponent: React.ComponentType) => {
  const Guest = (props: any) => {
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
      if (!loading && user) {
        router.push("/home");
      }
    }, [user, loading]);

    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>Error: {error.message}</p>;
    }

    return !user ? <WrappedComponent {...props} /> : null;
  };

  return Guest;
};

export default withGuest;
