import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseApp";
import withAuth from "../../renderer/hoc/withAuth";
import Layout from "../components/layout/Layout";
import monitorUserPresence from "@/lib/monitoruserpresence";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseApp"; // Ensure this import is correct

const HomePage = () => {
  const [user, loading, error] = useAuthState(auth);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      monitorUserPresence(user.uid);

      const notificationsRef = collection(
        firestore,
        `notifications/${user.uid}/messages`
      );
      const notificationsQuery = query(
        notificationsRef,
        where("createdAt", ">", new Date())
      );

      console.log(
        "Listening to notifications at:",
        `notifications/${user.uid}/messages`
      );

      const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
        console.log("Snapshot received:", snapshot.docs);
        const notificationsArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notificationsArray);

        notificationsArray.forEach((message: any) => {
          if (Notification.permission === "granted") {
            if (message.type === "message") {
              new Notification(
                `${message.senderName} (${message.channelName})`,
                {
                  body: message.text,
                  icon: message.profilePicture,
                }
              );
            } else if (message.type === "dm-call") {
              new Notification(`Incoming Call From (${message.senderName})`, {
                body: "Incoming Call Request",
                icon: message.profilePicture,
              });
            }
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                if (message.type === "message") {
                  new Notification(
                    `${message.senderName} (${message.channelName})`,
                    {
                      body: message.text,
                      icon: message.profilePicture,
                    }
                  );
                }
              }
            });
          }
        });
      });

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <div className="">
      <Layout>
        <Head>
          <title>PHiscord - Home Page</title>
        </Head>
      </Layout>
    </div>
  );
};

export default withAuth(HomePage);
