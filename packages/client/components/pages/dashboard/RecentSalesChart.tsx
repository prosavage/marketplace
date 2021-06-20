import React, { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { themeState } from "../../../atoms/theme";
import PropsTheme from "../../../styles/theme/PropsTheme";
import { Resource } from "@savagelabs/types";
import getAxios from "../../../util/AxiosInstance";
import { formatNumber } from "../../../util/Format";
import useToast from "../../../util/hooks/useToast";
import { parseISOString, validateISODate } from "../../../util/Validation";
import Input from "../../ui/Input";

interface ChartDataNode {
  sales: number;
  amount: number;
  date: string;
}

export default function RecentSalesChart() {
  const theme = useRecoilValue(themeState);

  const [select, setSelect] = useState("All");

  const [chartData, setChartData] = useState<ChartDataNode[]>([]);

  const [data, setData] = useState([]);

  const [resourceFilterOptions, setResourceOptions] = useState<Resource[]>([]);

  const [start, setStart] = useState(
    new Date(
      new Date().getTime() - 60 * 60 * 24 * 7 * 1000
    ).toLocaleDateString()
  );

  const [end, setEnd] = useState(new Date().toLocaleDateString());

  useEffect(() => {
    if (data.length === 0) return;
    transformDataToChartData();
  }, [data]);

  useEffect(() => {
    if (data.length === 0) return;
    transformDataToChartData();
  }, [select]);

  const transformDataToChartData = () => {
    let rawData = data;

    if (select !== "All") {
      rawData = rawData.filter((payment) => payment.resource === select);
    }

    const timeSorted = {};

    const startDate = parseISOString(start);
    const endDate = parseISOString(end);

    let timeLooper = startDate.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    while (timeLooper < endDate.getTime()) {
      timeSorted[new Date(timeLooper).toLocaleDateString()] = {
        sales: 0,
        amount: 0,
      };
      timeLooper = timeLooper + oneDay;
    }

    for (const payment of rawData) {
      payment.timestamp = new Date(payment.timestamp);
      const dateKey = payment.timestamp.toLocaleDateString();
      timeSorted[dateKey] = {
        sales: timeSorted[dateKey].sales + 1,
        amount: timeSorted[dateKey].amount + payment.amount,
      };
    }

    const nodes = [];

    for (const date of Object.keys(timeSorted)) {
      const sales = timeSorted[date].sales;
      const amount = timeSorted[date].amount;
      const node: ChartDataNode = { sales, amount, date };
      nodes.push(node);
    }
    setChartData(nodes);
  };

  const toast = useToast();

  useEffect(() => {
    if (!validateISODate(start) || !validateISODate(end)) {
      return;
    }

    const startDate = parseISOString(start);
    const endDate = parseISOString(end);

    const filter: any = {
      start: startDate.getTime(),
      end: endDate.getTime(),
    };
    if (select !== "All") {
      filter.resource = select;
    }
    getAxios()
      .post("/checkout/purchase-chart", filter)
      .then((res) => {
        setData(res.data.payload.payments);
      });
  }, [start, end]);

  useEffect(() => {
    getAxios()
      .get("/directory/my-resources")
      .then((res) => {
        const paidResources = res.data.payload.resources.filter(
          (resource: Resource) => resource.price !== 0
        );
        setResourceOptions(paidResources);
      })
      .catch((err) => toast(err.response.data.error));
  }, []);

  return (
    <ChartContainer>
      <h1>Daily Sales</h1>
      <Controls>
        <ControlContainer>
          <Select
            name={"resource"}
            value={select}
            onChange={(e) => setSelect(e.target.value)}
          >
            <option value={"All"}>All Resources</option>
            {resourceFilterOptions.map((opt) => (
              <option key={opt._id} value={opt._id}>
                {opt.name}
              </option>
            ))}
          </Select>
        </ControlContainer>
        <ControlGroup>
          <ControlContainer>
            <label>Start Date</label>
            <Input
              value={start}
              onChange={(e) => setStart(e.target.value)}
              invalid={!validateISODate(start)}
            />
          </ControlContainer>
          <ControlContainer>
            <label>End Date</label>
            <Input
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              invalid={false}
            />
          </ControlContainer>
        </ControlGroup>
      </Controls>

      {chartData.length > 0 && (
        <ResponsiveContainer width={"100%"} height={250}>
          <AreaChart
            data={chartData}
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
        </ResponsiveContainer>
      )}
      <Controls>
        <ControlGroup>
          <ControlContainer>
            <label>Total Profit</label>
            <h2>
              $
              {chartData.length > 0
                ? formatNumber(
                    chartData
                      .map((node) => node.amount)
                      .reduce((v1, v2) => v1 + v2) / 100
                  )
                : 0}
            </h2>
          </ControlContainer>
          <ControlContainer>
            <label>Total Sales</label>
            <h2>
              {chartData.length > 0
                ? formatNumber(
                    chartData
                      .map((node) => node.sales)
                      .reduce((v1, v2) => v1 + v2)
                  )
                : 0}
            </h2>
          </ControlContainer>
        </ControlGroup>
      </Controls>
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
  @media (max-width: 450px) {
    display: none;
  }
`;

const Select = styled.select`
  padding: 10px 0;
  border-radius: 5px;
  border-color: ${(props: PropsTheme) => props.theme.accentColor};
  background: transparent;
  color: ${(props: PropsTheme) => props.theme.color};

  option {
    color: black;
  }
`;

const Controls = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0.5em 0;
  align-items: center;
  justify-content: space-between;
`;

const ControlContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
  padding: 0 0.5em;
`;

const ControlGroup = styled.div`
  display: flex;
`;
