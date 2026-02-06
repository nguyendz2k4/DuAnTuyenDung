import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface RevenueData {
  categories: string[];
  revenue: number[];
}

interface LineChartProps {
  filter: "monthly" | "quarterly" | "annually";
}

export default function LineChartOne({ filter = "monthly" }: LineChartProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RevenueData>({
    categories: [],
    revenue: [],
  });

  // Fetch dữ liệu doanh thu từ API
  useEffect(() => {
    fetchRevenueData();
  }, [filter]);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost/DuAnWebTuyenDung/BE/chart/revenue.php?filter=${filter}&year=2025`
      );
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
    setLoading(false);
  };

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [3],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) =>
          new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(val),
      },
    },
    xaxis: {
      type: "category",
      categories: data.categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
        formatter: (val: number) => {
          if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
          if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
          return val.toFixed(0);
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "Doanh thu",
      data: data.revenue,
    },
  ];

  if (loading) {
    return (
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] h-[310px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#465FFF]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartEight" className="min-w-[1000px]">
        <Chart options={options} series={series} type="area" height={310} />
      </div>
    </div>
  );
}