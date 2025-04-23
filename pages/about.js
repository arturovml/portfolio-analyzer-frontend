import React from 'react';
import { FaChartLine, FaLaptopCode, FaPython, FaReact, FaDatabase, FaChartBar, FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiTailwindcss, SiFastapi, SiNextdotjs, SiPandas } from 'react-icons/si';
import Link from 'next/link';

export default function About() {
  const features = [
    {
      icon: <FaChartLine className="h-6 w-6 text-blue-500" />,
      title: "Análisis de Portafolio",
      description: "Analiza y optimiza portafolios de inversión usando técnicas de frontera eficiente y sharpe ratio."
    },
    {
      icon: <FaChartBar className="h-6 w-6 text-green-500" />,
      title: "Simulación Monte Carlo",
      description: "Predice posibles escenarios futuros de tu portafolio mediante simulaciones estocásticas."
    },
    {
      icon: <FaDatabase className="h-6 w-6 text-purple-500" />,
      title: "Datos Históricos",
      description: "Utiliza datos reales de mercado para analizar el comportamiento histórico de los activos."
    }
  ];
  
  const techStack = [
    { icon: <FaPython className="h-6 w-6" />, name: "Python", color: "text-blue-600" },
    { icon: <SiFastapi className="h-6 w-6" />, name: "FastAPI", color: "text-teal-600" },
    { icon: <SiPandas className="h-6 w-6" />, name: "Pandas", color: "text-blue-800" },
    { icon: <FaReact className="h-6 w-6" />, name: "React", color: "text-blue-400" },
    { icon: <SiNextdotjs className="h-6 w-6" />, name: "Next.js", color: "text-gray-800" },
    { icon: <SiTailwindcss className="h-6 w-6" />, name: "Tailwind CSS", color: "text-teal-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <FaChartLine className="text-blue-600 mr-3 h-10 w-10" /> 
            Análisis Financiero
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Una plataforma moderna para análisis y optimización de portafolios de inversión
          </p>
        </div>
        
        {/* Main Features */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 border-b border-gray-200 pb-2">
            Características principales
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-lg font-semibold text-gray-800 ml-3">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* How to Use */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 border-b border-gray-200 pb-2">
            Cómo utilizar la aplicación
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <ol className="list-decimal pl-6 space-y-6">
              <li className="text-gray-800">
                <span className="font-medium">Selección de activos</span>
                <p className="text-gray-600 mt-1">
                  Elige al menos dos acciones de la lista disponible para formar tu portafolio. 
                  Puedes buscar por nombre o símbolo.
                </p>
              </li>
              <li className="text-gray-800">
                <span className="font-medium">Período de evaluación</span>
                <p className="text-gray-600 mt-1">
                  Define el rango de fechas para analizar el comportamiento histórico de los activos seleccionados.
                  Se recomienda un período mínimo de 1 año para obtener resultados más precisos.
                </p>
              </li>
              <li className="text-gray-800">
                <span className="font-medium">Inversión inicial</span>
                <p className="text-gray-600 mt-1">
                  Especifica la cantidad que deseas invertir inicialmente en tu portafolio.
                </p>
              </li>
              <li className="text-gray-800">
                <span className="font-medium">Simulaciones Monte Carlo</span>
                <p className="text-gray-600 mt-1">
                  Indica el número de simulaciones a ejecutar. Un mayor número proporciona resultados más precisos pero requiere más tiempo de procesamiento.
                </p>
              </li>
              <li className="text-gray-800">
                <span className="font-medium">Análisis de resultados</span>
                <p className="text-gray-600 mt-1">
                  Una vez completado el análisis, revisa los resultados que incluyen:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                  <li>La distribución óptima del portafolio según la teoría de Markowitz</li>
                  <li>El rendimiento esperado y volatilidad del portafolio óptimo</li>
                  <li>Visualización de la frontera eficiente</li>
                  <li>Proyecciones futuras basadas en simulación Monte Carlo</li>
                  <li>Comparativa de rendimiento entre activos individuales y el portafolio optimizado</li>
                </ul>
              </li>
            </ol>
            
            <div className="mt-8 text-center">
              <Link href="/">
                <a className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-200 shadow-md inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Comenzar un análisis
                </a>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Technical Info */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 border-b border-gray-200 pb-2">
            Información técnica
          </h2>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Tecnologías utilizadas</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {techStack.map((tech, index) => (
                <div key={index} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className={`${tech.color} mb-2`}>
                    {tech.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{tech.name}</span>
                </div>
              ))}
            </div>
            
            <h3 className="text-lg font-medium text-gray-800 mb-4">Metodología</h3>
            <div className="text-gray-600 space-y-3">
              <p>
                Esta aplicación implementa la <strong>Teoría Moderna de Portafolios</strong> desarrollada por Harry Markowitz, 
                que busca construir portafolios óptimos maximizando el rendimiento esperado para un nivel determinado de riesgo.
              </p>
              <p>
                Se utilizan métodos estadísticos para calcular los retornos esperados, volatilidades y correlaciones entre activos, 
                y técnicas de optimización para determinar la asignación óptima de activos.
              </p>
              <p>
                Las <strong>simulaciones Monte Carlo</strong> permiten proyectar el comportamiento futuro del portafolio 
                generando múltiples escenarios posibles basados en la distribución histórica de los retornos.
              </p>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="border-t border-gray-200 pt-8 mt-16">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500">
                © 2023 Análisis Financiero
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <FaGithub className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <FaLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </footer>
        
      </div>
    </div>
  );
} 