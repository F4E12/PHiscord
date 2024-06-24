import React from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseApp";

const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();

    React.useEffect(() => {
      if (!loading && !user) {
        router.push("/login");
      }
    }, [user, loading]);

    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>Error: {error.message}</p>;
    }

    return user ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
