import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

function RevenueChart(){

const data=[
{month:"Jan", revenue:20000},
{month:"Feb", revenue:35000},
{month:"Mar", revenue:50000}
];

return(

<LineChart width={500} height={300} data={data}>

<XAxis dataKey="month"/>
<YAxis/>

<Tooltip/>

<Line dataKey="revenue" stroke="#C0395A"/>

</LineChart>

)

}

export default RevenueChart;