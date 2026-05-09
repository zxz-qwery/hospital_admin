<template>
  <div class="data-statistics-page">
    <h2 class="page-title">数据统计</h2>

    <!-- 顶部卡片 -->
    <div class="card-box">
      <div class="card-item">
        <div class="card-icon">📅</div>
        <div class="card-content">
          <div class="card-label">今日预约</div>
          <div class="card-value">{{ data.today_count }}</div>
        </div>
      </div>

      <div class="card-item">
        <div class="card-icon">📊</div>
        <div class="card-content">
          <div class="card-label">总预约</div>
          <div class="card-value">{{ data.total_count }}</div>
        </div>
      </div>

      <div class="card-item">
        <div class="card-icon">❌</div>
        <div class="card-content">
          <div class="card-label">取消数量</div>
          <div class="card-value">{{ data.cancel_count }}</div>
        </div>
      </div>
    </div>

    <div class="chart-container">
      <!-- 趋势图 -->
      <div class="chart-card">
        <div class="chart-title">最近7天预约趋势</div>
        <div ref="trendChart" class="chart-box"></div>
      </div>

      <!-- 科室 -->
      <div class="chart-card">
        <div class="chart-title">科室预约排行</div>
        <div ref="deptChart" class="chart-box"></div>
      </div>

      <!-- 医生 -->
      <div class="chart-card">
        <div class="chart-title">医生预约排行</div>
        <div ref="doctorChart" class="chart-box"></div>
      </div>

      <!-- 饼图 -->
      <div class="chart-card">
        <div class="chart-title">预约状态分布</div>
        <div ref="statusChart" class="chart-box"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from "vue";
import * as echarts from "echarts";
import { getStatistics, getTrend } from "@/api/data";

const data = ref({
  today_count: 0,
  total_count: 0,
  cancel_count: 0,
  department_rank: [],
  doctor_rank: [],
  status_data: [],
});

const trendData = ref({ dates: [], counts: [] });

const deptChart = ref(null);
const doctorChart = ref(null);
const statusChart = ref(null);
const trendChart = ref(null);

let charts = [];

onMounted(async () => {
  const res = await getStatistics();
  data.value = res.data;

  const trendRes = await getTrend();
  trendData.value = trendRes.data;

  await nextTick();
  initCharts();

  window.addEventListener("resize", resizeCharts);
});

onUnmounted(() => {
  charts.forEach((c) => c.dispose());
  window.removeEventListener("resize", resizeCharts);
});

const resizeCharts = () => {
  charts.forEach((c) => c.resize());
};

const initCharts = () => {
  initTrendChart();
  initDeptChart();
  initDoctorChart();
  initStatusChart();
};

//////////////////////
// 🔥 趋势折线图（核心亮点）
//////////////////////
const initTrendChart = () => {
  const chart = echarts.init(trendChart.value);
  charts.push(chart);

  chart.setOption({
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: trendData.value.dates,
    },
    yAxis: { type: "value" },
    series: [
      {
        data: trendData.value.counts,
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: { width: 3 },
        areaStyle: {
          opacity: 0.2,
        },
      },
    ],
  });
};

//////////////////////
// 科室图
//////////////////////
const initDeptChart = () => {
  const chart = echarts.init(deptChart.value);
  charts.push(chart);

  chart.setOption({
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: data.value.department_rank.map((i) => i.name),
      axisLabel: { rotate: 30 },
    },
    yAxis: { type: "value" },
    series: [
      {
        data: data.value.department_rank.map((i) => i.total),
        type: "bar",
        barWidth: "50%",
      },
    ],
  });
};

//////////////////////
// 医生图
//////////////////////
const initDoctorChart = () => {
  const chart = echarts.init(doctorChart.value);
  charts.push(chart);

  chart.setOption({
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: data.value.doctor_rank.map((i) => i.name),
      axisLabel: { rotate: 30 },
    },
    yAxis: { type: "value" },
    series: [
      {
        data: data.value.doctor_rank.map((i) => i.total),
        type: "bar",
        barWidth: "50%",
      },
    ],
  });
};

//////////////////////
// 饼图
//////////////////////
const initStatusChart = () => {
  const chart = echarts.init(statusChart.value);
  charts.push(chart);

  chart.setOption({
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        data: data.value.status_data.map((i) => ({
          name: i.status,
          value: i.total,
        })),
      },
    ],
  });
};
</script>

<style lang="less" scoped>
.data-statistics-page {
  padding: 0 20px;
  background: #f5f7fa;

  .card-box {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }

  .card-item {
    flex: 1;
    background: linear-gradient(135deg, #409eff, #79a9f2);
    border-radius: 12px;
    padding: 20px;
    color: #fff;
    display: flex;
    gap: 10px;
    transition: 0.3s;

    &:hover {
      transform: translateY(-5px);
    }

    .card-value {
      font-size: 24px;
      font-weight: bold;
    }
  }

  .chart-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .chart-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
  }

  .trend-card {
    margin-bottom: 20px;
  }

  .chart-box {
    height: 300px;
  }

  .large {
    height: 350px;
  }
}
</style>