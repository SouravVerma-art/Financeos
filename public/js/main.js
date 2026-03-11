// ============================
// DASHBOARD CHARTS
// ============================

function initDashboardCharts(monthlyData, categoryData) {
  const chartDefaults = {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(10,15,25,0.95)",
        borderColor: "rgba(0,255,178,0.2)",
        borderWidth: 1,
        titleColor: "#aaa",
        bodyColor: "#fff",
        titleFont: { family: "'Space Mono', monospace", size: 11 },
        bodyFont: { family: "'Space Mono', monospace", size: 12 },
        padding: 10,
        callbacks: {
          label: (ctx) => ` $${ctx.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "rgba(255,255,255,0.3)", font: { family: "'Space Mono'", size: 10 } },
        border: { display: false },
      },
      y: { display: false },
    },
  };

  // Area Chart
  const areaCtx = document.getElementById("areaChart");
  if (areaCtx && monthlyData) {
    new Chart(areaCtx, {
      type: "line",
      data: {
        labels: monthlyData.map((d) => d.month),
        datasets: [
          {
            label: "Income",
            data: monthlyData.map((d) => d.income),
            borderColor: "#00FFB2",
            borderWidth: 2,
            fill: true,
            backgroundColor: (ctx) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
              g.addColorStop(0, "rgba(0,255,178,0.18)");
              g.addColorStop(1, "rgba(0,255,178,0)");
              return g;
            },
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: "#00FFB2",
          },
          {
            label: "Expenses",
            data: monthlyData.map((d) => d.expenses),
            borderColor: "#FF6B6B",
            borderWidth: 2,
            fill: true,
            backgroundColor: (ctx) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
              g.addColorStop(0, "rgba(255,107,107,0.15)");
              g.addColorStop(1, "rgba(255,107,107,0)");
              return g;
            },
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: "#FF6B6B",
          },
        ],
      },
      options: { ...chartDefaults, responsive: true, maintainAspectRatio: true, interaction: { mode: "index", intersect: false } },
    });
  }

  // Pie Chart
  const pieCtx = document.getElementById("pieChart");
  if (pieCtx && categoryData && categoryData.length > 0) {
    const colors = ["#00FFB2", "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#C77DFF", "#FF9F1C", "#2EC4B6"];
    new Chart(pieCtx, {
      type: "doughnut",
      data: {
        labels: categoryData.map((d) => d.name),
        datasets: [{
          data: categoryData.map((d) => d.value),
          backgroundColor: colors.slice(0, categoryData.length).map((c) => c + "CC"),
          borderColor: colors.slice(0, categoryData.length),
          borderWidth: 2,
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: "62%",
        plugins: {
          legend: {
            display: true,
            position: "right",
            labels: {
              color: "rgba(255,255,255,0.55)",
              font: { family: "'Space Mono'", size: 10 },
              boxWidth: 10,
              padding: 10,
            },
          },
          tooltip: {
            backgroundColor: "rgba(10,15,25,0.95)",
            borderColor: "rgba(0,255,178,0.2)",
            borderWidth: 1,
            bodyColor: "#fff",
            bodyFont: { family: "'Space Mono'", size: 12 },
            callbacks: { label: (ctx) => ` ${ctx.label}: $${ctx.raw.toLocaleString()}` },
          },
        },
      },
    });
  }

  // Bar Chart
  const barCtx = document.getElementById("barChart");
  if (barCtx && monthlyData) {
    new Chart(barCtx, {
      type: "bar",
      data: {
        labels: monthlyData.map((d) => d.month),
        datasets: [
          {
            label: "Income",
            data: monthlyData.map((d) => d.income),
            backgroundColor: "rgba(0,255,178,0.65)",
            borderRadius: 5,
            borderSkipped: false,
          },
          {
            label: "Expenses",
            data: monthlyData.map((d) => d.expenses),
            backgroundColor: "rgba(255,107,107,0.65)",
            borderRadius: 5,
            borderSkipped: false,
          },
        ],
      },
      options: {
        ...chartDefaults,
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          ...chartDefaults.plugins,
          legend: {
            display: true,
            labels: {
              color: "rgba(255,255,255,0.4)",
              font: { family: "'Space Mono'", size: 10 },
              boxWidth: 10,
            },
          },
        },
      },
    });
  }
}

// ============================
// MOBILE NAV TOGGLE
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const navLinks = document.querySelector(".nav-links");
  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
    });
  }

  // Auto-dismiss flash messages after 4s
  const flashes = document.querySelectorAll(".flash");
  flashes.forEach((f) => setTimeout(() => f && f.remove(), 4000));

  // Highlight active nav link
  const path = window.location.pathname;
  document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.getAttribute("href") === path) link.classList.add("active");
  });
});
