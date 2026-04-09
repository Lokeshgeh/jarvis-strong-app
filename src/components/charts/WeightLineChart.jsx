import { useEffect, useRef } from "react";

export default function WeightLineChart({ labels, values, fill = true }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ChartLibrary = window.Chart;
    if (!ChartLibrary || !canvasRef.current) {
      return undefined;
    }

    chartRef.current?.destroy();

    chartRef.current = new ChartLibrary(canvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            data: values,
            tension: 0.35,
            fill,
            borderWidth: 3,
            borderColor: "#00BFFF",
            backgroundColor: fill ? "rgba(0, 191, 255, 0.16)" : "transparent",
            pointRadius: 3,
            pointBackgroundColor: "#FFD700",
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
  }, [fill, labels, values]);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}

