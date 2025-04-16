import React, { useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';

Chart.register(...registerables);

interface ApiResponse {
  EndDate: string;
  date: string;
  value: number;
  Id: string;
  CreatedAt: string;
  UpdatedAt: string;
}

interface ChartData {
  labels: string[];
  values: number[];
}

export const FetchDataService = async (startDate: string, endDate: string): Promise<ApiResponse[]> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_BASE_URL}/GetPricesForPeriod?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data as ApiResponse[];
  } catch (error) {
    throw error;
  }
};

function PriceChart() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);

  const handleFetchData = async (start: string, end: string, isOneDay: boolean) => {
    try {
      const data = await FetchDataService(start, end);
      console.log(`Fetched Data from ${start} to ${end}:`, data);

      const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      let labels: string[] = [];
      let values: number[] = [];

      if (isOneDay) {
        labels = sortedData.map(item => {
          const date = new Date(item.date);
          return date.getHours().toString().padStart(2, '0') + ':00';
        });
      } else {
        labels = sortedData.map(item => {
          const date = new Date(item.date);
          return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
        });
      }

      values = sortedData.map(item => parseFloat(item.value.toFixed(2)));

      setChartData({ labels, values });

      if (chartInstance) {
        chartInstance.data.labels = labels;
        chartInstance.data.datasets[0].data = values;
        chartInstance.update();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const setDateRange = (range: string) => {
    const today = new Date();
    let start: Date;
    let isOneDay = false;

    switch (range) {
      case '1Day':
        start = new Date();
        start.setDate(today.getDate() - 1);
        isOneDay = true;
        break;
      case '1Week':
        start = new Date();
        start.setDate(today.getDate() - 7);
        break;
      default:
        start = new Date();
        start.setDate(today.getDate() - 1);
        isOneDay = true;
        break;
    }

    setStartDate(start.toISOString());
    setEndDate(today.toISOString());
    handleFetchData(start.toISOString(), today.toISOString(), isOneDay);
  };

  useEffect(() => {
    setDateRange('1Day');
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chartData) {
      const canvas = document.getElementById('priceChart') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');

      if (chartInstance) {
        chartInstance.destroy();
      }

      const newChart = new Chart(ctx!, {
        type: 'bar',
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: 'Hinta (snt/kWh)',
              data: chartData.values,
              backgroundColor: '#f5ba3c',
              borderColor: 'black',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              enabled: true,
            },
            datalabels: {
              display: false,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date / Time',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Price',
              },
              beginAtZero: true,
            },
          },
        },
      });

      setChartInstance(newChart);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData]);

  return (
    <Row className="justify-content-center">
      <Col md={8}>
        <div className="info-box">
          <h3 className="info-title">Sähkön Hinta</h3>
          <br />
          <div className="info-text-container">
            <div>
              <button onClick={() => setDateRange('1Day')} className="btn-service">Päivä</button>
              <button onClick={() => setDateRange('1Week')} className="btn-service">Viikko</button>
            </div>
          </div>
          <div className="chart-container">
            <canvas id="priceChart" style={{ width: '100%', height: '100%' }}></canvas>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default PriceChart;
