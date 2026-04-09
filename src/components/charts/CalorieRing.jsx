import { useEffect, useRef } from "react";

function formatSegments(entries) {
  return entries.map((entry) => Math.max(Number(entry) || 0, 0));
}

export default function CalorieRing({ protein, carbs, fat, fiber }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ChartLibrary = window.Chart;
    if (!ChartLibrary || !canvasRef.current) {
      return undefined;
    }

    chartRef.current?.destroy();

    chartRef.current = new ChartLibrary(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: ["Protein", "Carbs", "Fat", "Fiber"],
        datasets: [
          {
            data: formatSegments([protein, carbs, fat, fiber]),
            backgroundColor: ["#00BFFF", "#FF6B35", "#FFD700", "#22C55E"],
            borderColor: "#10102A",
            borderWidth: 4,
            cutout: "72%",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    });

    return () => chartRef.current?.destroy();
  }, [carbs, fat, fiber, protein]);

  return <canvas ref={canvasRef} className="h-48 w-48" />;
}

