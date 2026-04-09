import { useEffect, useRef } from "react";

export default function VolumeBarChart({ labels, values, color = "#00BFFF" }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ChartLibrary = window.Chart;
    if (!ChartLibrary || !canvasRef.current) {
      return undefined;
    }

    chartRef.current?.destroy();

    chartRef.current = new ChartLibrary(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            data: values,
            borderRadius: 12,
            backgroundColor: color,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: { color: "#9CA3AF", font: { family: "JetBrains Mono" } },
            grid: { display: false },
          },
          y: {
            ticks: { color: "#9CA3AF", font: { family: "JetBrains Mono" } },
            grid: { color: "rgba(255,255,255,0.06)" },
          },
        },
        plugins: { legend: { display: false } },
      },
    });

    return () => chartRef.current?.destroy();
  }, [color, labels, values]);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}

