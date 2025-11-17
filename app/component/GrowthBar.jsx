"use client";
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Cookies from 'js-cookie';
import axios from 'axios';

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "June",
  "July", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const GrowthBar = ({ year = "2025" }) => {
  const [data, setData] = useState(
    months.map((m) => ({ name: m, uv: 0 }))
  );

  useEffect(() => {
    const fetchUserGrowth = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      try {
        const res = await axios.get("https://admin-dashboard.drivestai.com/admin/user-list", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        let usersList = res.data;
        if (Array.isArray(usersList)) {
          // OK
        } else if (usersList?.data) {
          usersList = usersList.data;
        } else if (usersList?.users) {
          usersList = usersList.users;
        } else {
          usersList = [];
        }

        // filter users by year
        const filtered = usersList.filter(user => {
          const dateStr = user.createdAt || user.created_at || user.registrationDate;
          if (!dateStr) return false;
          const d = new Date(dateStr);
          return d.getFullYear() === Number(year);
        });

        // count per month
        const monthCount = Array(12).fill(0);
        filtered.forEach(user => {
          const dateStr = user.createdAt || user.created_at || user.registrationDate;
          if (!dateStr) return;
          const d = new Date(dateStr);
          const monthIndex = d.getMonth(); // 0-11
          monthCount[monthIndex] += 1;
        });

        const chartData = months.map((m, idx) => ({
          name: m,
          uv: monthCount[idx] || 0
        }));

        setData(chartData);

      } catch (err) {
        console.error("GrowthBar fetch error:", err);
      }
    };

    fetchUserGrowth();
  }, [year]);

  return (
    <ResponsiveContainer width="100%" height={250} style={{ border: 'none' }}>
      <BarChart
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
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          padding={{ left: 9, right: 0 }}
          tick={{
            fill: '#5C5C5C',
            fontSize: 12,
            fontFamily: 'poppins'
          }}
        />
        <YAxis
          domain={[0, Math.max(...data.map(d => d.uv)) + 5]}
          axisLine={false}
          tickLine={false}
          tick={{
            fill: '#5C5C5C',
            fontSize: 12,
            fontFamily: 'poppins'
          }}
        />
        <Tooltip />
        <Bar
          dataKey="uv"
          barSize={12}
          radius={[8, 8, 0, 0]}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill="#FFC42D"
              fillOpacity={1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GrowthBar;
