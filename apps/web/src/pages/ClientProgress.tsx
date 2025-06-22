import React, { useState, useEffect } from 'react';
import { trpc } from '../utils/trpc';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

interface ClientProgressProps {
  clientId: number;
  clientName?: string;
  onBack?: () => void;
}

interface Measurement {
  id: number;
  client_id: number;
  weight_kg: number;
  waist_cm?: number;
  hip_cm?: number;
  neck_cm?: number;
  chest_cm?: number;
  arm_cm?: number;
  thigh_cm?: number;
  body_fat_percent?: number;
  measured_at: string;
  note?: string;
}

interface ProgressCard {
  title: string;
  icon: string;
  startValue: string;
  endValue: string;
  difference: string;
  isPositive: boolean;
  color: string;
}

const ClientProgress: React.FC<ClientProgressProps> = ({ clientId, clientName, onBack }) => {
  const [activeTab, setActiveTab] = useState<'weight' | 'waist' | 'bodyfat'>('weight');
  const [progressCards, setProgressCards] = useState<ProgressCard[]>([]);

  // Ölçümleri API'den çek
  const { data: measurementsData = [], isLoading, error } = trpc.measurements.getByClientId.useQuery({ client_id: clientId });

  // API'den gelen verileri doğru tipe cast et
  const measurements = measurementsData as unknown as Measurement[];
  console.log('Gelen ölçümler:', measurements);

  // Defensive: sort by measured_at ascending (oldest to newest)
  const sortedMeasurements = [...measurements].sort(
    (a, b) => new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime()
  );

  console.log('Original measurements:', measurements);
  console.log('Sorted measurements:', sortedMeasurements);
  console.log('First measurement:', sortedMeasurements[0]);
  console.log('Last measurement:', sortedMeasurements[sortedMeasurements.length - 1]);

  // Use sortedMeasurements for all calculations and rendering
  const first = sortedMeasurements[0];
  const last = sortedMeasurements[sortedMeasurements.length - 1];

  // En son ölçümü bul
  const latestMeasurement = sortedMeasurements[sortedMeasurements.length - 1];
  const previousMeasurement = sortedMeasurements.length > 1 ? sortedMeasurements[sortedMeasurements.length - 2] : null;

  // Son ölçüm değişimlerini hesapla
  const getChangeInfo = (current: number, previous: number | null | undefined, unit: string) => {
    if (!previous) return { change: 0, isPositive: false, color: '#6b7280', sign: '' };
    
    const change = current - previous;
    const isPositive = change < 0; // Azalma olumlu
    const color = isPositive ? '#10b981' : '#ef4444'; // Yeşil azalma, kırmızı artma
    const sign = change > 0 ? '+' : '';
    
    return { change, isPositive, color, sign };
  };

  const weightChange = getChangeInfo(latestMeasurement.weight_kg, previousMeasurement?.weight_kg, 'kg');
  const waistChange = getChangeInfo(latestMeasurement.waist_cm || 0, previousMeasurement?.waist_cm || 0, 'cm');
  const bodyFatChange = getChangeInfo(latestMeasurement.body_fat_percent || 0, previousMeasurement?.body_fat_percent || 0, '%');

  useEffect(() => {
    if (measurements.length >= 2) {
      const cards: ProgressCard[] = [
        {
          title: 'Kilo Değişimi',
          icon: latestMeasurement.weight_kg < first.weight_kg ? '📉' : '📈',
          startValue: `${first.weight_kg} kg`,
          endValue: `${latestMeasurement.weight_kg} kg`,
          difference: `${latestMeasurement.weight_kg - first.weight_kg} kg`,
          isPositive: latestMeasurement.weight_kg < first.weight_kg, // Kilo azalması olumlu
          color: latestMeasurement.weight_kg < first.weight_kg ? '#10b981' : '#ef4444' // Azalma yeşil, artma kırmızı
        },
        {
          title: 'Bel Çevresi',
          icon: latestMeasurement.waist_cm && first.waist_cm && latestMeasurement.waist_cm < first.waist_cm ? '📉' : '📈',
          startValue: `${first.waist_cm} cm`,
          endValue: `${latestMeasurement.waist_cm} cm`,
          difference: latestMeasurement.waist_cm && first.waist_cm ? `${latestMeasurement.waist_cm - first.waist_cm} cm` : 'N/A',
          isPositive: latestMeasurement.waist_cm && first.waist_cm ? latestMeasurement.waist_cm < first.waist_cm : false,
          color: latestMeasurement.waist_cm && first.waist_cm && latestMeasurement.waist_cm < first.waist_cm ? '#10b981' : '#ef4444'
        },
        {
          title: 'Vücut Yağı',
          icon: latestMeasurement.body_fat_percent && first.body_fat_percent && latestMeasurement.body_fat_percent < first.body_fat_percent ? '📉' : '📈',
          startValue: `${first.body_fat_percent}%`,
          endValue: `${latestMeasurement.body_fat_percent}%`,
          difference: latestMeasurement.body_fat_percent && first.body_fat_percent ? `${latestMeasurement.body_fat_percent - first.body_fat_percent}%` : 'N/A',
          isPositive: latestMeasurement.body_fat_percent && first.body_fat_percent ? latestMeasurement.body_fat_percent < first.body_fat_percent : false,
          color: latestMeasurement.body_fat_percent && first.body_fat_percent && latestMeasurement.body_fat_percent < first.body_fat_percent ? '#10b981' : '#ef4444'
        }
      ];

      setProgressCards(cards);
    }
  }, [measurements]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Grafik verilerini oluştururken measured_at alanını stringe zorla
  const chartData = sortedMeasurements
    .filter(m => !!m.measured_at && typeof m.measured_at === 'string')
    .map((m, index) => {
      // Sayısal değerleri zorla number'a çevir
      const weight = parseFloat(m.weight_kg?.toString() || '0');
      const waist = parseFloat(m.waist_cm?.toString() || '0');
      const bodyfat = parseFloat(m.body_fat_percent?.toString() || '0');
      
      const dataPoint = {
        name: formatDate(m.measured_at as string),
        date: m.measured_at,
        weight: weight,
        waist: waist,
        bodyfat: bodyfat
      };
      
      console.log(`Data Point ${index + 1}:`, dataPoint);
      return dataPoint;
    });

  // Debug: Grafik verilerini console'a yazdır
  console.log('Final Chart Data:', chartData);
  console.log('Active Tab:', activeTab);
  console.log('Data Key:', activeTab === 'weight' ? 'weight' : activeTab === 'waist' ? 'waist' : 'bodyfat');
  console.log('Chart Data Length:', chartData.length);
  console.log('Sample Data Point:', chartData[0]);

  // Test verisi oluştur
  const testData = [
    { name: 'Test 1', weight: 70, waist: 80, bodyfat: 15 },
    { name: 'Test 2', weight: 72, waist: 82, bodyfat: 16 },
    { name: 'Test 3', weight: 71, waist: 81, bodyfat: 15.5 },
    { name: 'Test 4', weight: 73, waist: 83, bodyfat: 16.5 }
  ];

  console.log('Test Data:', testData);

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  if (isLoading) {
    return (
      <div className="client-detail-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>İlerleme verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="client-detail-page">
        <div className="loading-state">
          <p>Veriler yüklenirken hata oluştu.</p>
        </div>
      </div>
    );
  }

  if (measurements.length === 0) {
    return (
      <div className="client-detail-page">
        <div className="loading-state">
          <p>Bu danışana ait ölçüm bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="client-detail-page">
      <Toaster />
      
      {/* Header */}
      <div className="page-header">
        <button onClick={handleBack} className="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Geri
        </button>
        <div className="header-title">
          <h1>İlerleme</h1>
        </div>
      </div>

      <div className="progress-content">
        <div className="section-header">
          <h2>Ölçüm Değişimleri</h2>
        </div>

        {/* Son Ölçüm Kartları */}
        <div className="latest-measurements-section">
          <div className="latest-measurements-grid">
            <div className="latest-measurement-card">
              <div className="card-header">
                <span className="card-icon">⚖️</span>
                <h4>Kilo</h4>
              </div>
              <div className="card-content">
                <div className="current-value">
                  <span className="value">{latestMeasurement.weight_kg} kg</span>
                  {previousMeasurement && (
                    <span 
                      className="change-indicator" 
                      style={{ color: weightChange.color }}
                    >
                      {weightChange.sign}{weightChange.change} kg
                    </span>
                  )}
                </div>
                <div className="measurement-date">
                  {formatDate(latestMeasurement.measured_at)}
                </div>
              </div>
            </div>

            <div className="latest-measurement-card">
              <div className="card-header">
                <span className="card-icon">📏</span>
                <h4>Bel Çevresi</h4>
              </div>
              <div className="card-content">
                <div className="current-value">
                  <span className="value">{latestMeasurement.waist_cm || '-'} cm</span>
                  {previousMeasurement && latestMeasurement.waist_cm && previousMeasurement.waist_cm && (
                    <span 
                      className="change-indicator" 
                      style={{ color: waistChange.color }}
                    >
                      {waistChange.sign}{waistChange.change} cm
                    </span>
                  )}
                </div>
                <div className="measurement-date">
                  {formatDate(latestMeasurement.measured_at)}
                </div>
              </div>
            </div>

            <div className="latest-measurement-card">
              <div className="card-header">
                <span className="card-icon">🔥</span>
                <h4>Vücut Yağı</h4>
              </div>
              <div className="card-content">
                <div className="current-value">
                  <span className="value">{latestMeasurement.body_fat_percent || '-'}%</span>
                  {previousMeasurement && latestMeasurement.body_fat_percent && previousMeasurement.body_fat_percent && (
                    <span 
                      className="change-indicator" 
                      style={{ color: bodyFatChange.color }}
                    >
                      {bodyFatChange.sign}{bodyFatChange.change}%
                    </span>
                  )}
                </div>
                <div className="measurement-date">
                  {formatDate(latestMeasurement.measured_at)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-header">
            <h2>Grafik Analizi</h2>
            <div className="chart-tabs">
              <button 
                className={`tab-button ${activeTab === 'weight' ? 'active' : ''}`}
                onClick={() => setActiveTab('weight')}
              >
                📊 Kilo
              </button>
              <button 
                className={`tab-button ${activeTab === 'waist' ? 'active' : ''}`}
                onClick={() => setActiveTab('waist')}
              >
                📏 Bel
              </button>
              <button 
                className={`tab-button ${activeTab === 'bodyfat' ? 'active' : ''}`}
                onClick={() => setActiveTab('bodyfat')}
              >
                🔥 Vücut Yağı
              </button>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart 
                data={chartData}
                margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
              >
                <XAxis 
                  dataKey="name" 
                  hide={true}
                />
                <YAxis 
                  hide={true}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#374151',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="natural" 
                  dataKey={activeTab === 'weight' ? 'weight' : activeTab === 'waist' ? 'waist' : 'bodyfat'}
                  stroke={activeTab === 'weight' ? '#3b82f6' : activeTab === 'waist' ? '#10b981' : '#f59e0b'}
                  strokeWidth={3}
                  dot={{ 
                    fill: activeTab === 'weight' ? '#3b82f6' : activeTab === 'waist' ? '#10b981' : '#f59e0b', 
                    r: 4, 
                    stroke: '#ffffff',
                    strokeWidth: 2
                  }}
                  activeDot={{ 
                    r: 6, 
                    stroke: activeTab === 'weight' ? '#3b82f6' : activeTab === 'waist' ? '#10b981' : '#f59e0b', 
                    strokeWidth: 2, 
                    fill: '#ffffff' 
                  }}
                >
                  <LabelList 
                    dataKey={activeTab === 'weight' ? 'weight' : activeTab === 'waist' ? 'waist' : 'bodyfat'}
                    position="top"
                    offset={10}
                    content={(props) => {
                      console.log('LabelList props:', props);
                      if (!props || props.value === undefined || props.value === null) return null;
                      return (
                        <text 
                          x={props.x} 
                          y={typeof props.y === 'number' ? props.y - 15 : 0} 
                          textAnchor="middle" 
                          fill={activeTab === 'weight' ? '#3b82f6' : activeTab === 'waist' ? '#10b981' : '#f59e0b'}
                          fontSize="11"
                          fontWeight="500"
                          fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
                        >
                          {props.value}
                        </text>
                      );
                    }}
                  />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Measurements Table */}
        <div className="measurements-section">
          <h2>Ölçüm Geçmişi</h2>
          <div className="table-container">
            <table className="measurements-table">
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>Kilo (kg)</th>
                  <th>Bel (cm)</th>
                  <th>Vücut Yağı (%)</th>
                </tr>
              </thead>
              <tbody>
                {sortedMeasurements
                  .map((measurement) => (
                    <tr key={measurement.id}>
                      <td>{formatDate(measurement.measured_at)}</td>
                      <td>{measurement.weight_kg}</td>
                      <td>{measurement.waist_cm ? measurement.waist_cm : '-'}</td>
                      <td>{measurement.body_fat_percent ? measurement.body_fat_percent : '-'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        /* Force positioning with highest specificity */
        body .client-detail-page,
        html .client-detail-page,
        #root .client-detail-page,
        .client-detail-page {
          margin-left: 140px !important;
          margin-right: 2rem !important;
          margin-top: 2rem !important;
          margin-bottom: 2rem !important;
          padding: 2rem !important;
          background: white !important;
          border-radius: 16px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
          min-height: 100vh !important;
          width: calc(100% - 140px - 2rem) !important;
          max-width: 1200px !important;
          position: relative !important;
          left: 0 !important;
          right: auto !important;
          transform: none !important;
          float: none !important;
          display: block !important;
        }

        /* Override any other CSS that might be affecting positioning */
        .client-detail-page * {
          box-sizing: border-box !important;
        }

        /* Remove any centering from parent elements */
        body > .client-detail-page,
        html > .client-detail-page,
        #root > .client-detail-page {
          margin-left: 140px !important;
          margin-right: 2rem !important;
          width: calc(100% - 140px - 2rem) !important;
          max-width: 1200px !important;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #1e293b;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .page-header {
          position: relative;
          margin-bottom: 2rem;
          border-bottom: 1px solid #e2e8f0;
          padding: 1rem 0;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .header-title h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          text-align: center;
        }
        
        .header-title p {
          display: none;
        }
        
        .back-button {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #1e293b;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }

        .back-button:hover {
          background: #334155;
        }

        .progress-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .section-header {
          margin-bottom: 0.5rem;
        }

        .section-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
        }

        .latest-measurements-section {
          margin-bottom: 2rem;
        }

        .latest-measurements-section h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .latest-measurements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .latest-measurement-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
        }

        .latest-measurement-card:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .latest-measurement-card .card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .latest-measurement-card .card-icon {
          font-size: 1.5rem;
        }

        .latest-measurement-card h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .latest-measurement-card .card-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .current-value {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .current-value .value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
        }

        .change-indicator {
          font-size: 0.9rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          background: rgba(0, 0, 0, 0.05);
        }

        .measurement-date {
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 500;
        }

        .charts-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .chart-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .chart-tabs {
          display: flex;
          gap: 0.5rem;
        }

        .tab-button {
          padding: 0.5rem 1rem;
          background: #f3f4f6;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .tab-button:hover {
          background: #e5e7eb;
        }

        .tab-button.active {
          background: #1e293b;
          color: white;
        }

        .chart-container {
          height: 350px;
          width: 100%;
          position: relative;
          overflow: visible;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }

        /* Recharts override styles */
        .chart-container .recharts-wrapper {
          width: 100% !important;
          height: 100% !important;
        }

        .chart-container .recharts-surface {
          width: 100% !important;
          height: 100% !important;
        }

        .chart-container .recharts-line {
          stroke-width: 2px !important;
        }

        .chart-container .recharts-dot {
          fill: #3b82f6 !important;
          stroke: #ffffff !important;
          stroke-width: 1px !important;
          r: 3px !important;
        }

        .chart-container .recharts-active-dot {
          fill: #ffffff !important;
          stroke: #3b82f6 !important;
          stroke-width: 2px !important;
          r: 5px !important;
        }

        .chart-container .recharts-cartesian-grid-horizontal line,
        .chart-container .recharts-cartesian-grid-vertical line {
          stroke: #e5e7eb !important;
          stroke-opacity: 0.5 !important;
        }

        /* Line type override */
        .chart-container .recharts-line-curve {
          stroke-linecap: round !important;
          stroke-linejoin: round !important;
        }

        /* Label override */
        .chart-container .recharts-label {
          font-size: 11px !important;
          font-weight: 500 !important;
          fill: #3b82f6 !important;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif !important;
        }

        .chart-container .recharts-label-list {
          font-size: 11px !important;
          font-weight: 500 !important;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif !important;
        }

        .chart-container .recharts-label-list text {
          font-size: 11px !important;
          font-weight: 500 !important;
          fill: #3b82f6 !important;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif !important;
        }

        /* Specific label colors for different tabs */
        .chart-container .recharts-label-list text[fill="#3b82f6"] {
          fill: #3b82f6 !important;
        }

        .chart-container .recharts-label-list text[fill="#10b981"] {
          fill: #10b981 !important;
        }

        .chart-container .recharts-label-list text[fill="#f59e0b"] {
          fill: #f59e0b !important;
        }

        .measurements-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .measurements-section h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 1.5rem 0;
        }

        .table-container {
          overflow-x: auto;
        }

        .measurements-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
          table-layout: fixed;
        }

        .measurements-table th,
        .measurements-table td {
          padding: 1rem 0.75rem;
          text-align: center;
          border-bottom: 1px solid #e5e7eb;
          vertical-align: middle;
        }

        .measurements-table th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .measurements-table td {
          color: #1f2937;
          font-weight: 500;
        }

        .measurements-table tr:hover {
          background: #f9fafb;
        }

        /* Sütun genişlikleri */
        .measurements-table th:nth-child(1),
        .measurements-table td:nth-child(1) {
          width: 25%;
          text-align: left;
        }

        .measurements-table th:nth-child(2),
        .measurements-table td:nth-child(2) {
          width: 25%;
        }

        .measurements-table th:nth-child(3),
        .measurements-table td:nth-child(3) {
          width: 25%;
        }

        .measurements-table th:nth-child(4),
        .measurements-table td:nth-child(4) {
          width: 25%;
        }

        @media (max-width: 768px) {
          .client-detail-page {
            padding: 1rem;
          }

          .chart-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .chart-tabs {
            width: 100%;
            justify-content: space-between;
          }

          .tab-button {
            flex: 1;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ClientProgress;
