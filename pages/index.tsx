import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

import UserBarChart from "./components/userBarChart";
import Dashdoard from "./components/dashdoard";


export default function Home() {
  const { data: session, status } = useSession();
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const router = useRouter();

  const { data: userteamData, error:userteamError } = useSWR(
    status === "authenticated" ? "/api/userteam" + "?email=" + session?.user.email : null,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    }
  );

  const { data: multiData, error:multiError } = useSWR(
    "/api/userteam" + "?multi=" + "true",
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    }
  );

  useEffect(() => {
    if (status === "authenticated") {
      console.log("User is authenticated");
    } else if (status === "unauthenticated") {
      console.log("User is not authenticated, redirecting to login");
      router.push("/login");
    }
  }, [status]);

  useEffect(() => {
    console.log("data in page",userteamData)
  }, [userteamData]);

  return (
    <>
    <div className="h-3/5 w-full">
    <Dashdoard 
        piedata={userteamData?.result}
        bardata={userteamData?.result?.player_stats}
      />
    </div>
      <div className="flex-col items-center justify-center h-2/5 w-full">
      <h1 className="text-center">Ranking List</h1>
      <UserBarChart 
      data={multiData?.result}
      />
      </div>
    </>
  );
}
