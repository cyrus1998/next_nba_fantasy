import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import TablePagination from "@/pages/components/common/tablePagination"
import useSWR from "swr";
import useSocket from "@/utils/useSocket";
import Loading from "../components/common/loader"

export default function Lottery() {
  const socketHost = "http://localhost:8080"

  const handleLotteryReady = (order: string[], timestamp: string) => {
    console.log("order received in page", order)
    setOrder(order) 
    if (order[0] === session?.user.email) {
      setSelected(0)
    }

  };

  const handleNextPlay = (user: string, player: string, end: boolean) => {
    console.log("handle next play",user, player)
    if (order[order.indexOf(user) + 1] === session?.user.email ||
    (order[0] === session?.user.email && order.indexOf(user) === (order.length - 1))
    ) {
      setSelected(0)
    }
    setDrafted({user:user,player:player})
    draftedMutate()
    playerMutate()
    if (end){
      console.log("END!")
      setSelected(-1)
    }

  };

  interface Drafted {
    user: string,
    player: string
  }

  const { socket, emitLotterySelect } = useSocket(socketHost, handleLotteryReady, handleNextPlay);
  const { data: session, status } = useSession()

  const router = useRouter()
  const fetcher = (url: string) =>
    fetch(url).then((res) => res.json());
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState<string>()
  const [totalPage, setTotalPage] = useState(1)
  const [transformed, setTransformed] = useState<any[] | null>(null);
  const [selected, setSelected] = useState(-1);
  const [submit, setSubmit] = useState(-1);
  const [url, SetUrl] = useState<string>("/api/players?page=1")
  const [loading, setLoading] = useState(true);
  const [drafted, setDrafted] = useState<Drafted>()
  const [order, setOrder] = useState<string[]>([]);
  const { data: playerData, error:playerError,isLoading: isplayerLoading ,mutate:playerMutate } = useSWR(url, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: false,
    revalidateOnMount: true,
  });
  const { data:draftedData, error:draftedrerror,isLoading: isdraftedLoading,mutate:draftedMutate } = useSWR("/api/users" + "?email=" + drafted?.user, fetcher,{
    revalidateOnFocus: true,
    revalidateOnReconnect: false,
    revalidateOnMount: true,
  });

  useEffect(() => {
    if (!isplayerLoading && !isdraftedLoading) {
        setLoading(false);
    } else {
        setLoading(true);
    }
}, [isplayerLoading, isdraftedLoading]);
  const lotterySubmit = async (data: { player_id: number, email: string | undefined }) => {
    try {
      console.log("data in function", data)
      await fetch("/api/lottery", {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        method: "POST"
      }).then((response) => response.json() as Promise<{ message: string }>)
        .then(data => {
          if (data.message === "success") {
            if (socket) {
              console.log("event emit",selected)
              try {
                emitLotterySelect(session.user.email, selected)
              } catch (e) {
                console.error("unable to emit lottery-select", e)
              }

            }
            setSelected(-1)
            setLoading(false)
          }
        })
    } catch (error) {
      console.error(error)
    }
  }

  const teamMap = {
    1: "Atlanta Hawks",
    2: "Boston Celtics",
    4: "Brooklyn Nets",
    5: "Charlotte Hornets",
    6: "Chicago Bulls",
    7: "Cleveland Cavaliers",
    8: "Dallas Mavericks",
    9: "Denver Nuggets",
    10: "Detroit Pistons",
    11: "Golden State Warriors",
    14: "Houston Rockets",
    15: "Indiana Pacers",
    16: "LA Clippers",
    17: "Los Angeles Lakers",
    19: "Memphis Grizzlies",
    20: "Miami Heat",
    21: "Milwaukee Bucks",
    22: "Minnesota Timberwolves",
    23: "New Orleans Pelicans",
    24: "New York Knicks",
    25: "Oklahoma City Thunder",
    26: "Orlando Magic",
    27: "Philadelphia 76ers",
    28: "Phoenix Suns",
    29: "Portland Trail Blazers",
    30: "Sacramento Kings",
    31: "San Antonio Spurs",
    38: "Toronto Raptors",
    40: "Utah Jazz",
    41: "Washington Wizards",
  };

  const keyMap = {
    "player_id": "player ID",
    "name": "Name",
    "team": "Team",
    "played_season": "Seasons played",
    "avg_blk": "avg block",
    "avg_ast": "avg ast",
    "avg_tor": "avg rebound",
    "avg_fga": "avg fga",
    "avg_fgm": "avg fgm",
    "avg_fgp": "avg fgp",
    "avg_pf": "avg pf",
    "avg_pts": "avg pts",
    "avg_to": "avg to",
    "avg_tpa": "avg tpa",
    "avg_tpm": "avg tpm",
    "avg_tpp": "avg tpp",
    "played_game": "Games played",
  };

  const transformData = (result: Array<{ [key: string]: any }>) => {
    const transformed_data: Array<any> = new Array();

    if (!result) {
      return null
    }
    result.map((player) => { //array level
      const transformed_player: any = {};
      Object.keys(player).forEach(key => { //object level 
        if (key === 'team') {
          const teamKey = (player[key] as Array<number>)[0]; //access value of team array
          transformed_player[keyMap[key as keyof typeof keyMap]] = teamMap[teamKey as keyof typeof teamMap]
        } else if (key === 'played_game') {
          transformed_player[keyMap[key as keyof typeof keyMap]] = (player as any).played_game.no_of_games;
        }
        else if (key !== "selected") {
          const value = player[key];
          if (typeof value === 'number' && !Number.isInteger(value)) {
            transformed_player[keyMap[key as keyof typeof keyMap]] = parseFloat(value.toFixed(2));
          } else if (key === 'avg_fgp' || key === 'avg_tpp') {
            transformed_player[keyMap[key as keyof typeof keyMap]] = parseFloat(value).toFixed(2) + '%';
          }
          else {
            transformed_player[keyMap[key as keyof typeof keyMap]] = value;
          }
        }
      })
      transformed_data.push(transformed_player)
    })
    return transformed_data
  }

  useEffect(() => {
    console.log("data", playerData)
    if (playerData) {
      setTransformed(transformData(playerData.result))
      setTotalPage(Math.ceil((playerData.count / 10)))
    }
  }, [playerData])

  useEffect(() => {
    if (search !== undefined) {
      SetUrl("/api/players" + "?page=" + page + "&search=" + search)
    } else {
      SetUrl("/api/players" + "?page=" + page)
    }
  }, [search, page])

  useEffect(() => {
    console.log("selected update", selected)
  }, [selected])

  useEffect(() => {
    console.log("drafted data come",draftedData)
    console.log("drafted data check",draftedData?.result[0]?.name)
    console.log("drafted data check",draftedData?.result[0]?.avatar_img)
  }, [draftedData])

  useEffect(() => {
    if (status === "authenticated") {
      console.log("User is authenticated", session);
    } else if (status === "unauthenticated") {
      console.log("User is not authenticated, redirecting to login");
      router.push('/login')
    }
  }, [status]);

  useEffect(() => {
    if (submit !== -1 && submit !== 0) {
      lotterySubmit(
        {
          player_id: submit,
          email: session?.user.email
        })
    }
  }, [submit])

  if (playerError) return <div>Failed to load data: {playerError.message}</div>;
  {
    return (
      <div className="flex flex-col h-screen w-full">
        {loading && (
          <Loading />
        )}
        <div className="flex items-center justify-center h-2/5 w-full">
        {draftedData?.result[0]?.name && draftedData?.result[0]?.avatar_img && drafted?.player &&
      <div className="flex items-center space-x-4">
        <img src={draftedData?.result[0]?.avatar_img} className="w-20 h-20 object-cover rounded-full" alt="Avatar"/>
        <span>{draftedData?.result[0]?.name} drafted {drafted?.player}</span>
      </div>
    }
  </div>
        <div className="h-3/5 w-full">
          {!loading&&
          <TablePagination
          data={transformed}
          page={page}
          totalpage={totalPage}
          setPage={setPage}
          setSearch={setSearch}
          selected={selected}
          setSelected={setSelected}
          setSubmit={setSubmit}
        />
        }
          
        </div>
      </div>
    )
  }
}
