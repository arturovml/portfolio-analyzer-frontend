import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import Collapsible from '../components/Collapsible';
import ChartFrame from '../components/ChartFrame';

// Constantes
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Home() {
  // Estados
  const [availableTickers, setAvailableTickers] = useState([]);
  const [selectedTickers, setSelectedTickers] = useState([]);
  const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 5)));
  const [endDate, setEndDate] = useState(new Date());
  const [initialInvestment, setInitialInvestment] = useState(1000000);
  const [simRuns, setSimRuns] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisId, setAnalysisId] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [activeTab, setActiveTab] = useState('form');

  // Cargar tickers disponibles
  useEffect(() => {
    const fetchAvailableTickers = async () => {
      try {
        const response = await axios.get(`${API_URL}/tickers/available`);
        
        // Añadir algunas categorías principales para ayudar al usuario
        const mainTickers = [
          "AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "NVDA", 
          "JPM", "JNJ", "PG", "V", "WMT", "DIS", "KO", "PFE", "INTC"
        ];
        
        // Crear un grupo de 'Popular' para los tickers principales
        const groups = [
          {
            label: 'Popular',
            options: mainTickers.map(ticker => ({
              value: ticker,
              label: ticker
            }))
          },
          {
            label: 'S&P 500 Completo',
            options: response.data.tickers
              .filter(ticker => !mainTickers.includes(ticker))
              .map(ticker => ({
                value: ticker,
                label: ticker
              }))
          }
        ];
        
        setAvailableTickers(groups);
      } catch (error) {
        console.error('Error fetching tickers:', error);
        toast.error('Error al cargar tickers disponibles');
      }
    };

    fetchAvailableTickers();
  }, []);

  // Verificar estado del análisis
  useEffect(() => {
    let interval;
    
    if (analysisId && (analysisStatus?.status === 'pending' || analysisStatus?.status === 'running')) {
      interval = setInterval(checkAnalysisStatus, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [analysisId, analysisStatus]);

  // Funciones
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedTickers.length < 2) {
      toast.error('Selecciona al menos 2 acciones para el análisis');
      return;
    }
    
    setIsLoading(true);
    setAnalysisResults(null);
    
    try {
      const response = await axios.post(`${API_URL}/portfolio/analyze`, {
        tickers: selectedTickers.map(t => t.value),
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        initial_investment: parseFloat(initialInvestment),
        sim_runs: parseInt(simRuns)
      });
      
      setAnalysisId(response.data.id);
      setAnalysisStatus(response.data);
      setActiveTab('status');
      toast.info('Análisis iniciado correctamente');
    } catch (error) {
      console.error('Error submitting analysis:', error);
      toast.error('Error al iniciar el análisis: ' + (error.response?.data?.detail || error.message));
      setIsLoading(false);
    }
  };

  const checkAnalysisStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/portfolio/status/${analysisId}`);
      setAnalysisStatus(response.data);
      
      if (response.data.status === 'completed') {
        setIsLoading(false);
        toast.success('Análisis completado correctamente');
        fetchAnalysisResults();
      } else if (response.data.status === 'failed') {
        setIsLoading(false);
        toast.error(`Análisis fallido: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };
  
  const fetchAnalysisResults = async () => {
    try {
      const response = await axios.get(`${API_URL}/portfolio/results/${analysisId}`);
      setAnalysisResults(response.data);
      setActiveTab('results');
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error('Error al cargar resultados');
    }
  };

  const formatDate = (date, displayFormat = false) => {
    if (!date) return '';
    
    if (displayFormat) {
      return format(new Date(date), 'dd/MM/yyyy');
    }
    return date ? date.toISOString().split('T')[0] : '';
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  
  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };
  
  const formatChartTitle = (key) => {
    const titleMap = {
      'plot_closing_prices': 'Precios de Cierre',
      'plot_daily_returns': 'Retornos Diarios',
      'plot_returns_histogram': 'Histograma de Retornos',
      'plot_correlation_heatmap': 'Matriz de Correlación',
      'plot_efficient_frontier': 'Frontera Eficiente',
    };

    // Para gráficos específicos de acciones
    if (key.includes('_candlestick')) {
      const ticker = key.replace('plot_', '').replace('_candlestick', '');
      return `Gráfico de Velas - ${ticker}`;
    }
    
    if (key.includes('_trends_pie')) {
      const ticker = key.replace('plot_', '').replace('_trends_pie', '');
      return `Tendencias - ${ticker}`;
    }

    return titleMap[key] || key.replace('plot_', '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const Results = ({ data, status, dateRange, invested, tickers }) => {
    if (status !== "completed") {
      return null;
    }

    return (
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Resultados del Análisis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold mb-3">Resumen del Análisis</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Período:</span> {formatDate(dateRange.startDate, true)} - {formatDate(dateRange.endDate, true)}</p>
              <p><span className="font-medium">Inversión inicial:</span> ${invested}</p>
              <p><span className="font-medium">Acciones:</span> {tickers.join(', ')}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold mb-3">Estadísticas</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Retorno promedio:</span> {data.optimal_metrics?.expected_return ? data.optimal_metrics.expected_return.toFixed(2) : 'N/A'}%</p>
              <p><span className="font-medium">Desviación estándar:</span> {data.optimal_metrics?.volatility ? data.optimal_metrics.volatility.toFixed(2) : 'N/A'}%</p>
              <p><span className="font-medium">Valor final:</span> ${data.optimal_metrics?.final_value ? data.optimal_metrics.final_value.toFixed(2) : 'N/A'}</p>
              <p><span className="font-medium">Retorno sobre inversión:</span> {data.optimal_metrics?.return_on_investment ? data.optimal_metrics.return_on_investment.toFixed(2) : 'N/A'}%</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Head>
        <title>Analizador de Portafolios Financieros</title>
        <meta name="description" content="Herramienta para análisis de portafolios financieros" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="top-right" autoClose={4000} />

      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center flex items-center justify-center">
            <span className="mr-2">Analizador de Portafolios Financieros</span>
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Pestañas de navegación */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          <button
            className={`py-3 px-5 font-medium whitespace-nowrap ${activeTab === 'form' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('form')}
          >
            Configuración
          </button>
          <button
            className={`py-3 px-5 font-medium whitespace-nowrap ${activeTab === 'status' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => analysisId && setActiveTab('status')}
            disabled={!analysisId}
          >
            Estado del Proceso
          </button>
          <button
            className={`py-3 px-5 font-medium whitespace-nowrap ${activeTab === 'results' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => analysisResults && setActiveTab('results')}
            disabled={!analysisResults}
          >
            Resultados del Análisis
          </button>
        </div>
        
        {/* Contenido de la pestaña activa */}
        {activeTab === 'form' && (
          <div className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 transform hover:shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Configuración del Análisis</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-gray-700 font-medium mb-2">
                  Acciones a Analizar
                </label>
                <Select
                  isMulti
                  options={availableTickers}
                  value={selectedTickers}
                  onChange={setSelectedTickers}
                  placeholder="Selecciona o busca acciones para el portafolio"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isSearchable={true}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: '#3b82f6',
                      primary25: '#eff6ff',
                    },
                  })}
                  styles={{
                    menuList: (base) => ({
                      ...base,
                      maxHeight: '200px',
                    })
                  }}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Selecciona 2-10 acciones para el análisis. Puedes buscar por símbolo (p.ej. AAPL, MSFT, GOOGL).
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Fecha de inicio:
                </label>
                <div className="relative">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    maxDate={new Date()}
                    showYearDropdown
                    dateFormatCalendar="MMMM"
                    yearDropdownItemNumber={15}
                    scrollableYearDropdown
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Fecha de fin:
                </label>
                <div className="relative">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    maxDate={new Date()}
                    minDate={startDate}
                    showYearDropdown
                    dateFormatCalendar="MMMM"
                    yearDropdownItemNumber={15}
                    scrollableYearDropdown
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Inversión Inicial ($)
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">USD</span>
                    </div>
                    <input
                      type="number"
                      value={initialInvestment}
                      onChange={e => setInitialInvestment(e.target.value)}
                      className="w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1000"
                      step="1000"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Monto en dólares americanos</p>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Simulaciones Monte Carlo
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="number"
                      value={simRuns}
                      onChange={e => setSimRuns(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      min="10"
                      max="10000"
                      step="10"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">simulaciones</span>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Más simulaciones = mayor precisión, pero toma más tiempo
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  className={`
                    px-6 py-3 rounded-md font-medium transform transition-all duration-200 shadow-md
                    flex items-center
                    ${isLoading 
                      ? 'bg-gray-400 cursor-not-allowed text-white' 
                      : selectedTickers.length < 2
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    }
                  `}
                  disabled={isLoading || selectedTickers.length < 2}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      Procesando...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Analizar Portafolio
                    </span>
                  )}
                </button>
              </div>
              {selectedTickers.length < 2 && (
                <p className="text-center text-red-500 text-sm mt-2">
                  Selecciona al menos 2 acciones para continuar
                </p>
              )}
            </form>
          </div>
        )}
        
        {activeTab === 'status' && analysisStatus && (
          <div className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              Estado del Análisis
            </h2>
            
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors">
                  <p className="text-sm text-gray-600 mb-1">ID del Análisis</p>
                  <div className="bg-gray-100 rounded-md p-2 font-mono text-sm overflow-auto flex items-center justify-between gap-2 group">
                    <span className="truncate">{analysisId}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(analysisId);
                        toast.success('ID copiado al portapapeles');
                      }}
                      className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copiar ID"
                    >
                      Copiar ID
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors">
                  <p className="text-sm text-gray-600 mb-1">Estado</p>
                  <div 
                    className={`
                      flex items-center justify-center p-2 rounded-md font-medium mt-1
                      ${analysisStatus.status === 'completed' ? 'bg-green-100 text-green-700' : 
                        analysisStatus.status === 'failed' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'}
                    `}
                  >
                    {analysisStatus.status === 'completed' ? (
                      <>Completado</>
                    ) : analysisStatus.status === 'failed' ? (
                      <>Fallido</>
                    ) : analysisStatus.status === 'running' ? (
                      <>En proceso</>
                    ) : (
                      <>En cola</>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors">
                  <p className="text-sm text-gray-600 mb-1">Mensaje</p>
                  <div className="bg-white p-2 rounded-md border border-gray-200 mt-1 text-gray-700">
                    {analysisStatus.message}
                  </div>
                </div>
              </div>
              
              {(analysisStatus.status === 'pending' || analysisStatus.status === 'running') && (
                <div className="mb-8 bg-white p-5 rounded-lg border border-blue-100 shadow-sm">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                          Progreso del Análisis
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600">
                          {Math.round(analysisStatus.progress)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-2 text-xs flex rounded-full bg-blue-50">
                      <div 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-in-out" 
                        style={{ width: `${analysisStatus.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-center text-xs text-gray-500 mt-1">
                      {analysisStatus.status === 'running' ? 'Procesando análisis financiero...' : 'En espera para iniciar procesamiento...'}
                    </div>
                  </div>
                </div>
              )}
              
              {analysisStatus.status === 'completed' && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setActiveTab('results')}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-md shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transform hover:scale-105 transition-all duration-200 flex items-center"
                  >
                    Ver Resultados del Análisis
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'results' && analysisResults && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              Resultados del Análisis
            </h2>
            
            <Results data={analysisResults} status={analysisStatus.status} dateRange={{ startDate, endDate }} invested={initialInvestment} tickers={selectedTickers.map(t => t.value)} />
            
            <Collapsible 
              title={
                <div className="flex items-center">
                  <span>Métricas del Portafolio Óptimo</span>
                </div>
              } 
              defaultOpen={true} 
              titleClassName="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-600">Retorno anual esperado</p>
                  </div>
                  <p className="text-xl font-bold text-blue-700 mt-2">
                    {formatPercentage(analysisResults.optimal_metrics.expected_return)}
                  </p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-600">Volatilidad</p>
                  </div>
                  <p className="text-xl font-bold text-orange-700 mt-2">
                    {formatPercentage(analysisResults.optimal_metrics.volatility)}
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-600">Sharpe Ratio</p>
                  </div>
                  <p className="text-xl font-bold text-green-700 mt-2">
                    {analysisResults.optimal_metrics.sharpe_ratio.toFixed(2)}
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-600">Valor final</p>
                  </div>
                  <p className="text-xl font-bold text-purple-700 mt-2">
                    {formatCurrency(analysisResults.optimal_metrics.final_value)}
                  </p>
                </div>
                
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-600">Retorno sobre inversión</p>
                  </div>
                  <p className="text-xl font-bold text-teal-700 mt-2">
                    {formatPercentage(analysisResults.optimal_metrics.return_on_investment)}
                  </p>
                </div>
                
                <div className="bg-pink-50 p-4 rounded-lg border border-pink-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-600">Inversión inicial</p>
                  </div>
                  <p className="text-xl font-bold text-pink-700 mt-2">
                    {formatCurrency(analysisResults.initial_investment)}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium mb-3 text-gray-700 flex items-center">
                  Distribución óptima de activos
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {Object.entries(analysisResults.optimal_metrics.weights).map(([ticker, weight]) => (
                    <div key={ticker} className="bg-white p-3 rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow hover:border-blue-300">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-gray-800">{ticker}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${weight * 100}%` }}></div>
                      </div>
                      <p className="text-center font-medium text-gray-700">{(weight * 100).toFixed(2)}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </Collapsible>
            
            <Collapsible 
              title={
                <div className="flex items-center">
                  <span>Visualizaciones y Gráficos</span>
                </div>
              } 
              defaultOpen={true}
              titleClassName="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700"
            >
              {analysisResults.plot_paths && Object.keys(analysisResults.plot_paths).length > 0 ? (
                <div>
                  {/* Gráficos principales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {Object.entries(analysisResults.plot_paths)
                      .filter(([key]) => 
                        !key.includes("_trends_pie") && 
                        !key.includes("_candlestick"))
                      .map(([key, path]) => (
                        <ChartFrame 
                          key={key} 
                          title={formatChartTitle(key)} 
                          src={`${API_URL}/static/${path}`}
                        />
                      ))}
                  </div>
                  
                  {/* Gráficos específicos de acciones si existen */}
                  {Object.entries(analysisResults.plot_paths)
                    .filter(([key]) => 
                      key.includes("_trends_pie") || 
                      key.includes("_candlestick"))
                    .length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-700 mb-4 mt-6 border-b pb-2">
                        Análisis de Acciones Individuales
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(analysisResults.plot_paths)
                          .filter(([key]) => 
                            key.includes("_trends_pie") || 
                            key.includes("_candlestick"))
                          .map(([key, path]) => (
                            <ChartFrame 
                              key={key} 
                              title={formatChartTitle(key)} 
                              src={`${API_URL}/static/${path}`}
                            />
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 py-8 text-center">No hay gráficos disponibles para mostrar</p>
              )}
            </Collapsible>
            
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setActiveTab('form')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-md hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-200 shadow-md flex items-center"
              >
                Nuevo Análisis
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-6 text-center mt-12">
        <div className="container mx-auto px-4">
          <p className="text-sm">Analizador de Portafolios Financieros © {new Date().getFullYear()}</p>
          <p className="text-xs text-gray-400 mt-1">Desarrollado con tecnologías modernas para análisis financiero</p>
        </div>
      </footer>
    </div>
  );
} 
