import PieChart from "./pieChart";
import { Title,Legend  } from "@tremor/react";
import BarChart from "./barChart";
import React, { useState } from "react";
import { ButtonGroup, Button } from "semantic-ui-react";
import Loading from "../components/common/loader";
import PlayersBarChart from "./barChart";
interface playerData {
  player_id: number;
  name: string;
  total_blk: number;
  total_pts: number;
  total_ast: number;
  total_tp: number;
  total_to: number;
  total_tor: number;
  [key: string]: number | string;
}

interface pieChartData {
  [key: string]: string;
}

const Dashboard = ({
  piedata,
  bardata,
}: {
  piedata: pieChartData;
  bardata: playerData[];
}) => {
  const [selectedChart, setSelectedChart] = useState<"pie" | "bar">("pie");

  return (
    <div className="flex items-center justify-center flex-col rounded-tremor-default text-tremor-default dark:bg-dark-tremor-background dark:shadow-dark-tremor-dropdown dark:border-dark-tremor-border ">
      <div className="flex items-center justify-center flex-col space-y-6">
      <h1 className="text-center">My Team</h1>
        <ButtonGroup>
          <Button onClick={() => setSelectedChart("pie")}>Overall Score</Button>
          <Button onClick={() => setSelectedChart("bar")}>Player Stats</Button>
        </ButtonGroup>
      </div>
        {selectedChart === "pie" && <Legend
        categories={['points', 'assists', 'turnovers', 'three points', 'blocks', 'rebounds']}
        colors={["rose", "yellow", "orange", "indigo", "blue", "red"]}
        />}
        {selectedChart === "pie" && <PieChart data={piedata}/>}
        {selectedChart === "pie" && piedata === undefined && <Loading/>}
        {selectedChart === "bar" && <PlayersBarChart data={bardata} />}
        {selectedChart === "bar" && bardata === undefined && <Loading/>}
    </div>
  );
};

export default Dashboard;
