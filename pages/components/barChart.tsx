import { Card, DonutChart, Title,BarChart } from "@tremor/react";
import { useEffect } from "react";


interface playerData {
    player_id: number,
    name: string,
    total_blk: number,
    total_pts: number,
    total_ast: number,
    total_tp: number,
    total_to: number,
    total_tor: number,
    [key: string]: number | string; 
}

const transformData = (data: playerData[]) => {
    return data.map((player:playerData) => {
        const transformedPlayer = { ...player };
        Object.keys(transformedPlayer).forEach((key) => {
            if (typeof transformedPlayer[key] === 'number') {
                transformedPlayer[key] = parseFloat((transformedPlayer[key] as number).toFixed(2));
            }
        });
        return transformedPlayer;
    });
}

const PlayersBarChart = ({ data }: { data: playerData[] }) => {
    return(
        <BarChart
      data={transformData(data)}
      categories={["total_pts","total_ast","total_tp","total_tor","total_blk","total_to"]}
      index="name"
      showAnimation={true}
    />
    )
}





export default PlayersBarChart;