import styled from "styled-components";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useRecoilValue } from "recoil";
import { themeState } from "../../../atoms/theme";
import React, { useEffect, useState } from "react";
import getAxios from "../../../util/AxiosInstance";
import Input from "../../ui/Input";

interface ChartDataNode {
  sales: number;
  date: string;
}

export default function RecentSalesChart() {
  const theme = useRecoilValue(themeState);

  const [select, setSelect] = useState("All");

  const [data, setData] = useState<ChartDataNode[]>(generateData());

  const startTime = 1613537306882;
  const end = new Date().getTime();

  const [start, setStart] = useState(
    new Date(
      new Date().getTime() - 60 * 60 * 24 * 7 * 1000
    ).toLocaleDateString()
  );

  const aggregateData = (data): ChartDataNode[] => {
    const rawData = data.payload.payments;
    const timeSorted = {};

    for (const payment of rawData) {
      payment.timestamp = new Date(payment.timestamp);
      const dateKey = payment.timestamp.toLocaleDateString();
      if (timeSorted[dateKey] === undefined) {
        timeSorted[dateKey] = 1;
      } else {
        timeSorted[dateKey] = timeSorted[dateKey] + 1;
      }
    }

    const nodes = [];

    for (const date of Object.keys(timeSorted)) {
      const sales = timeSorted[date];
      const node: ChartDataNode = { sales, date };
      nodes.push(node);
    }

    return nodes.reverse();
  };

  useEffect(() => {
    const filter: any = {
      start: startTime,
      end,
    };
    if (select !== "All") {
      filter.resource = select;
    }
    getAxios()
      .post("/checkout/purchase-chart", filter)
      .then((res) => setData(aggregateData(res.data)));
  }, [select]);

  return (
    <ChartContainer>
      <h1>Daily Sales</h1>
      <Controls>
        <select
          name={"resource"}
          value={select}
          onChange={(e) => setSelect(e.target.value)}
        >
          <option value={"All"}>All Resources</option>
          <option value={"CVE0kzSpW"}>FactionsX</option>
          <option value={"eUyVEKcjm"}>SkyblockX</option>
          <option value={"CSMVL75iD"}>TestResource</option>
        </select>
        <Input value={start} onChange={(e) => setStart(e.target.value)} invalid={false}/>
      </Controls>
      <PaddedResponsiveContainer width={"100%"} height={250}>
        <AreaChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="10%"
                stopColor={theme.accentColor}
                stopOpacity={0.8}
              />
              <stop
                offset="90%"
                stopColor={theme.accentColor}
                stopOpacity={0.3}
              />
            </linearGradient>
          </defs>
          <XAxis dataKey={"date"} />
          {/* Auto sends the props :) */}
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="sales"
            stroke={theme.accentColor}
            fillOpacity={1}
            fill="url(#colorPv)"
          />
        </AreaChart>
      </PaddedResponsiveContainer>
    </ChartContainer>
  );
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: any;
  payload?: any;
  label?: any;
}) => {
  if (active) {
    return (
      <div>
        <p>{`${payload ? Math.round(payload[0]?.value) : 0} sales`}</p>
        <p>{label}</p>
      </div>
    );
  }

  return null;
};

const ChartContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 1em 0;
`;

const PaddedResponsiveContainer = styled(ResponsiveContainer)``;

const Controls = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0.5em 0;
`;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max)) + 20;
}

function date(subtract) {
  return new Date(
    new Date().getTime() - subtract * 60 * 60 * 24 * 1000
  ).toLocaleDateString();
}

const generateData = () => {
  return [
    {
      sales: getRandomInt(100),
      date: date(1),
    },
    {
      sales: getRandomInt(100),
      date: date(2),
    },
    {
      sales: getRandomInt(100),
      date: date(3),
    },
    {
      sales: getRandomInt(100),
      date: date(4),
    },
    {
      sales: getRandomInt(100),
      date: date(5),
    },
    {
      sales: getRandomInt(100),
      date: date(6),
    },
    {
      sales: getRandomInt(100),
      date: date(7),
    },
    {
      sales: getRandomInt(100),
      date: date(8),
    },
    {
      sales: getRandomInt(100),
      date: date(9),
    },
  ].reverse();
};