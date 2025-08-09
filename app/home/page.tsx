'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
                     {/* Left Side - Realistic Parking Image */}
           <motion.div 
             initial={{ opacity: 0, x: -50 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="relative"
           >
             <div className="relative overflow-hidden rounded-3xl shadow-2xl">
               {/* Realistic Parking Scene */}
               <div className="aspect-square bg-gradient-to-br from-slate-800 via-gray-900 to-black relative">
                 {/* Background overlay */}
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-indigo-700/30"></div>
                 
                 {/* Parking lot visualization */}
                 <div className="absolute inset-0 p-8">
                   {/* Main parking area */}
                   <div className="h-full bg-gradient-to-b from-gray-700 to-gray-800 rounded-2xl relative overflow-hidden">
                     
                     {/* Parking spaces - top row */}
                     <div className="absolute top-4 left-4 right-4 flex justify-between">
                       {Array.from({ length: 6 }).map((_, i) => (
                         <motion.div
                           key={`top-${i}`}
                           initial={{ scale: 0, opacity: 0 }}
                           animate={{ scale: 1, opacity: 1 }}
                           transition={{ duration: 0.5, delay: i * 0.1 }}
                           className={`w-16 h-24 rounded-lg border-2 ${
                             i % 3 === 0 ? 'bg-green-500/80 border-green-400' : 
                             i % 4 === 0 ? 'bg-yellow-500/80 border-yellow-400' : 
                             'bg-red-500/80 border-red-400'
                           } flex items-center justify-center shadow-lg`}
                         >
                           <span className="text-white font-bold text-sm">P{i+1}</span>
                         </motion.div>
                       ))}
                     </div>
                     
                     {/* Parking spaces - bottom row */}
                     <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                       {Array.from({ length: 6 }).map((_, i) => (
                         <motion.div
                           key={`bottom-${i}`}
                           initial={{ scale: 0, opacity: 0 }}
                           animate={{ scale: 1, opacity: 1 }}
                           transition={{ duration: 0.5, delay: (i + 6) * 0.1 }}
                           className={`w-16 h-24 rounded-lg border-2 ${
                             (i + 1) % 3 === 0 ? 'bg-green-500/80 border-green-400' : 
                             (i + 1) % 4 === 0 ? 'bg-yellow-500/80 border-yellow-400' : 
                             'bg-red-500/80 border-red-400'
                           } flex items-center justify-center shadow-lg`}
                         >
                           <span className="text-white font-bold text-sm">P{i+7}</span>
                         </motion.div>
                       ))}
                     </div>
                     
                     {/* Center road */}
                     <div className="absolute top-1/2 left-4 right-4 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg transform -translate-y-1/2">
                       <div className="flex justify-center items-center h-full">
                         <div className="flex space-x-4">
                           {Array.from({ length: 8 }).map((_, i) => (
                             <motion.div
                               key={`line-${i}`}
                               initial={{ scaleX: 0 }}
                               animate={{ scaleX: 1 }}
                               transition={{ duration: 0.3, delay: i * 0.05 }}
                               className="w-4 h-1 bg-white rounded-full"
                             />
                           ))}
                         </div>
                       </div>
                     </div>
                     
                     {/* Car icons */}
                     <motion.div
                       initial={{ x: -100, opacity: 0 }}
                       animate={{ x: 0, opacity: 1 }}
                       transition={{ duration: 1, delay: 0.5 }}
                       className="absolute top-8 left-1/2 transform -translate-x-1/2 w-20 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-xl"
                     >
                       <div className="flex space-x-1">
                         <div className="w-2 h-2 bg-white rounded-full"></div>
                         <div className="w-2 h-2 bg-white rounded-full"></div>
                       </div>
                     </motion.div>
                     
                     <motion.div
                       initial={{ x: 100, opacity: 0 }}
                       animate={{ x: 0, opacity: 1 }}
                       transition={{ duration: 1, delay: 0.7 }}
                       className="absolute bottom-8 right-1/4 w-16 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-xl"
                     >
                       <div className="flex space-x-1">
                         <div className="w-2 h-2 bg-white rounded-full"></div>
                         <div className="w-2 h-2 bg-white rounded-full"></div>
                       </div>
                     </motion.div>
                   </div>
                 </div>
                 
                 {/* Status indicators */}
                 <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                   <div className="flex items-center space-x-2 text-white text-sm">
                     <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                     <span className="font-semibold">Live Data</span>
                   </div>
                 </div>
                 
                 {/* Parking sign */}
                 <motion.div
                   initial={{ rotate: -10, scale: 0 }}
                   animate={{ rotate: 0, scale: 1 }}
                   transition={{ duration: 0.8, delay: 1 }}
                   className="absolute bottom-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg border-2 border-blue-400"
                 >
                   <div className="text-center">
                     <div className="text-lg font-bold">P</div>
                     <div className="text-xs">PARKING</div>
                   </div>
                 </motion.div>
               </div>
               
               {/* Decorative elements */}
               <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg"></div>
               <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg"></div>
             </div>
           </motion.div>

          {/* Right Side - Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Project Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="text-5xl lg:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Lord of Park
              </span>
            </motion.h1>

                         {/* Tagline */}
             <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
               className="mb-8"
             >
               <h2 className="text-2xl lg:text-3xl font-semibold text-white mb-4 drop-shadow-lg">
                 Say Goodbye to Parking Worries, Embrace Smart Travel
               </h2>
               <p className="text-lg text-white/90 leading-relaxed max-w-lg mx-auto lg:mx-0 drop-shadow-md">
                 Get real-time parking information in Melbourne CBD, making every journey effortless and stress-free
               </p>
             </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
            >
              <div className="flex flex-col items-center lg:items-start space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <i className="ri-time-line text-white text-xl"></i>
                </div>
                                 <span className="text-sm font-semibold text-white drop-shadow-md">Real-time Updates</span>
               </div>
               <div className="flex flex-col items-center lg:items-start space-y-2">
                 <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                   <i className="ri-map-pin-line text-white text-xl"></i>
                 </div>
                 <span className="text-sm font-semibold text-white drop-shadow-md">Precise Location</span>
               </div>
               <div className="flex flex-col items-center lg:items-start space-y-2">
                 <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                   <i className="ri-smartphone-line text-white text-xl"></i>
                 </div>
                 <span className="text-sm font-semibold text-white drop-shadow-md">Smart Navigation</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <i className="ri-map-pin-line text-xl"></i>
                                     <span>Start Exploring</span>
                 </motion.button>
               </Link>
               <Link href="/trends">
                 <motion.button
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="w-full sm:w-auto px-8 py-4 bg-white/90 backdrop-blur-md text-gray-700 font-semibold rounded-2xl shadow-xl hover:shadow-2xl border border-white/30 transition-all duration-300 flex items-center justify-center space-x-2"
                 >
                   <i className="ri-line-chart-line text-xl"></i>
                   <span>View Trends</span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2"
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </motion.div>
      </div>
    </div>
  );
}
