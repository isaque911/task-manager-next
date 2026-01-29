"use client";  
  
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";  
  
interface DataPoint {  
  name: string;  
  value: number;  
}  
  
const COLORS = {  
  High: "#ef4444",   
  Mid: "#eab308",    
  Low: "#22c55e",    
};  
  
export default function PriorityChart({ data }: { data: DataPoint[] }) {  
  if (data.every((d) => d.value === 0)) {  
    return <div className="text-slate-500 text-center py-10">Sem dados suficientes</div>;  
  }  
  
  return (  
    <div className="h-[300px] w-full">  
      <ResponsiveContainer width="100%" height="100%">  
        <PieChart>  
          <Pie  
            data={data}  
            cx="50%"  
            cy="50%"  
            innerRadius={60}  
            outerRadius={80}  
            paddingAngle={5}  
            dataKey="value"  
          >  
            {data.map((entry, index) => (  
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />  
            ))}  
          </Pie>  
          <Tooltip   
            contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#fff" }}  
            itemStyle={{ color: "#fff" }}  
          />  
          <Legend />  
        </PieChart>  
      </ResponsiveContainer>  
    </div>  
  );  
}
