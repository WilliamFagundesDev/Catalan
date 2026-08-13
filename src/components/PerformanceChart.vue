<script setup lang="ts">
import { computed } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps<{
  labels: number[];
  recursiveData: number[];
  binomialData: number[];
}>();

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Recursiva (ms)',
      backgroundColor: '#ff007f',
      borderColor: '#ff007f',
      data: props.recursiveData,
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 4,
      pointBackgroundColor: '#ff007f',
      pointBorderColor: '#fff',
    },
    {
      label: 'Binomial O(n) (ms)',
      backgroundColor: '#00f3ff',
      borderColor: '#00f3ff',
      data: props.binomialData,
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 4,
      pointBackgroundColor: '#00f3ff',
      pointBorderColor: '#fff',
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  color: '#94a3b8',
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
      },
      ticks: {
        color: '#94a3b8',
      },
      title: {
        display: true,
        text: 'Tempo (ms)',
        color: '#f8fafc',
      }
    },
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
      },
      ticks: {
        color: '#94a3b8',
      },
      title: {
        display: true,
        text: 'Valor de N',
        color: '#f8fafc',
      }
    }
  },
  plugins: {
    legend: {
      labels: {
        color: '#f8fafc',
        font: {
          family: "'Outfit', sans-serif",
          size: 14
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(11, 15, 25, 0.9)',
      titleColor: '#00f3ff',
      bodyColor: '#fff',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      padding: 10,
      displayColors: true
    }
  }
};
</script>

<template>
  <div class="graph-container">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
