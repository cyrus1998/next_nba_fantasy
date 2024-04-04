import {  DonutChart } from "@tremor/react";

interface pieChartData {
    data: {[key:string]: string}

}

const fields = ['pts_score', 'ast_score', 'to_score', 'tp_score', 'blk_score', 'tor_score']

const transformData = (data:{[key:string]: string}) => {
    let transform = []
    for (const field in data) {
        if (fields.includes(field)){
            transform.push({
                name: field.replace('_score',''),
                number: data[field]
            })
        }
    }
    return transform  
}



const PieChart = ({ data }: pieChartData) => (
    <DonutChart
      data={transformData(data)}
      category="number"
      index="name"
      colors={["rose", "yellow", "orange", "indigo", "blue", "red"]}
      label={data?.total_score}
      showAnimation={true}
    />
);




export default PieChart;