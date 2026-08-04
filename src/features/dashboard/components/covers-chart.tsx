"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { CoversPoint } from "../api";

/**
 * Covers per seating time across the day, lunch in steel and dinner in saffron.
 * Every colour comes from the tokens rather than a recharts default palette.
 */
export function CoversChart({ data }: { data: CoversPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid
            vertical={false}
            stroke="var(--sf-oud-700)"
            strokeDasharray="2 4"
          />
          <XAxis
            dataKey="time"
            tick={{ fill: "var(--sf-salt-400)", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "var(--sf-oud-700)" }}
            interval={1}
          />
          <YAxis
            tick={{ fill: "var(--sf-salt-400)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: "var(--sf-oud-750)" }}
            contentStyle={{
              background: "var(--sf-oud-850)",
              border: "1px solid var(--sf-oud-600)",
              borderRadius: "var(--sf-radius-md)",
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--sf-salt-400)" }}
            itemStyle={{ color: "var(--sf-salt-50)" }}
            formatter={(value) => [`${String(value)} covers`, "Booked"]}
          />
          <Bar dataKey="covers" radius={[3, 3, 0, 0]} maxBarSize={26}>
            {data.map((point) => (
              <Cell
                key={point.time}
                fill={
                  point.service === "lunch"
                    ? "var(--sf-steel-500)"
                    : "var(--sf-saffron-500)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
