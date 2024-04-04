import { Card, DonutChart, Title,BarChart } from "@tremor/react";
import { useEffect } from "react";

interface UserData {
    name: string,
    pts_score: number,
    ast_score: number,
    tp_score: number,
    tor_score: number,
    blk_score: number,
    to_score: number,
    [key: string]: number | string; 
}

const transformData = (data: UserData[]) => {
    // return data.map((player:UserData) => {
    //     const transformedPlayer = { ...player };
    //     Object.keys(transformedPlayer).forEach((key) => {
    //         if (typeof transformedPlayer[key] === 'number') {
    //             transformedPlayer[key] = parseFloat((transformedPlayer[key] as number).toFixed(2));
    //         }
    //     });
    //     return transformedPlayer;
    // });
    console.log("data",data)
    return data
}

const UserBarChart = ({ data }: { data: UserData[] }) => {
    return(
    <BarChart
      data={transformData(data)}
      categories={["pts_score","ast_score","tp_score","tor_score","blk_score","to_score"]}
      index="name"
      showAnimation={true}
    />
    )
}





export default UserBarChart;