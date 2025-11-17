"use client";
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', uv: 80 },
  { name: 'Feb', uv: 60 },
  { name: 'Mar', uv: 100 },
  { name: 'Apr', uv: 70 },
  { name: 'May', uv: 80 },
  { name: 'June', uv: 90 },
  { name: 'July', uv: 70 },
  { name: 'Aug', uv: 60 },
  { name: 'Sep', uv: 80 },
  { name: 'Oct', uv: 90 },
  { name: 'Nov', uv: 70 },
  { name: 'Dec', uv: 90 },
];

const IncomeBar = () => {
  return (
    <ResponsiveContainer width="100%" height={250} style={{ border: 'none' }}>
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: -25,
          bottom: 0,
        }}
      >
           <defs>
          <linearGradient id="myColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="29%" stopColor="#015093" stopOpacity={100}/>
            <stop offset="67%" stopColor="#49A0E6" stopOpacity={100}/>
          </linearGradient>
        </defs>

        <XAxis dataKey="name" 
         axisLine={false}
          tickLine={false}
          padding={{ left: 9, right: 0 }}
           tick={{
    fill: '#5C5C5C',          
    fontSize: 12,                   
    fontFamily: 'poppins' 
  }}         
        />
        <YAxis  domain={[0, 100]}
        ticks={[0, 20, 40, 60, 80, 100]}
         axisLine={false}
          tickLine={false}
            tick={{
    fill: '#5C5C5C',          
    fontSize: 12,                   
    fontFamily: 'poppins' 
  }}
          
          
         />
        <Tooltip />
        <Area type="monotone" dataKey="uv" stroke="#" fill="url(#myColor)" fillOpacity={1}  />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default IncomeBar;