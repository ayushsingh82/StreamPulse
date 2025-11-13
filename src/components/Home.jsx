import React from 'react';
import { motion } from 'framer-motion';
import { TracingBeam } from './ui/tracing-beam';
import { TypewriterEffect } from './ui/typewriter-effect';
import Footer from './Footer';

const Home = () => {
  const words = [
    {
      text: "Stream",
      className: "text-2xl md:text-4xl text-[#8051B8]"
    },
    {
      text: "Pulse",
      className: "text-2xl md:text-4xl text-[#CDA3E0] font-bold"
    }
  ];

  return (
    <TracingBeam className="px-6">
      <div className="fixed left-0 top-0 bottom-0 w-24 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute top-1/4 left-4 w-12 h-12 bg-[#8051B8]/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-1/3 left-8 w-16 h-16 bg-[#DBBDE3]/10 rounded-full blur-xl animate-pulse delay-300" />
          <div className="absolute top-1/2 left-2 w-20 h-20 bg-[#8051B8]/10 rounded-full blur-xl animate-pulse delay-500" />
          <motion.div
            animate={{
              y: [0, 100, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-0 left-10 w-2 h-32 bg-gradient-to-b from-[#8051B8]/0 via-[#8051B8]/20 to-[#8051B8]/0 rounded-full"
          />
        </motion.div>
      </div>

      <div className="fixed right-0 top-0 bottom-0 w-24 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute top-2/3 right-4 w-12 h-12 bg-[#8051B8]/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-1/4 right-8 w-16 h-16 bg-[#DBBDE3]/10 rounded-full blur-xl animate-pulse delay-300" />
          <div className="absolute top-1/2 right-2 w-20 h-20 bg-[#8051B8]/10 rounded-full blur-xl animate-pulse delay-500" />
          <motion.div
            animate={{
              y: [100, 0, 100],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-0 right-10 w-2 h-32 bg-gradient-to-b from-[#8051B8]/0 via-[#8051B8]/20 to-[#8051B8]/0 rounded-full"
          />
        </motion.div>
      </div>

      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="fixed left-12 top-1/4 w-32 h-32 pointer-events-none"
      >
        <div className="absolute inset-0 border-2 border-[#8051B8]/20 rounded-full" />
        <div className="absolute inset-2 border-2 border-[#8051B8]/20 rounded-full" />
        <div className="absolute inset-4 border-2 border-[#8051B8]/20 rounded-full" />
      </motion.div>

      <motion.div
        animate={{
          rotate: [360, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="fixed right-12 top-2/3 w-40 h-40 pointer-events-none"
      >
        <div className="absolute inset-0 border-2 border-[#DBBDE3]/20 rounded-full" />
        <div className="absolute inset-2 border-2 border-[#DBBDE3]/20 rounded-full" />
        <div className="absolute inset-4 border-2 border-[#DBBDE3]/20 rounded-full" />
      </motion.div>

      <div className="min-h-screen bg-gradient-to-b from-[#DBBDE3]/10 via-white to-[#DBBDE3]/10">
        {/* Hero Section */}
        <section className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="mx-auto mb-10 max-w-4xl px-4">
                <TypewriterEffect words={words} />
              </div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto font-medium px-4"
              >
 Explore SDS - a breakthrough SDK that turns on-chain data into live, structured, and reactive streams. Build apps that react instantly to on-chain events.
              </motion.p>

              <motion.div
                className="flex gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-[#8051B8] to-[#DBBDE3] text-white rounded-lg font-semibold hover:from-[#6a4399] hover:to-[#c5a5d1] transition-all shadow-lg hover:shadow-xl"
                >
                  Get Started
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-[#8051B8] text-[#8051B8] rounded-lg font-semibold hover:bg-[#DBBDE3]/30 transition-all shadow-md hover:shadow-lg"
                >
                  Learn More
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Features Section */}
            <section className="py-20 relative overflow-hidden">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8051B8]/10 to-[#DBBDE3]/10 rounded-3xl" />
                  <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 lg:p-12">
                    <div>
                      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#8051B8] to-[#CDA3E0] bg-clip-text text-transparent">
                        Real-Time On-Chain Data
                      </h2>
                      <ul className="space-y-4">
                        {features.map((feature, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="flex items-center gap-3 text-gray-700"
                          >
                            <span className="w-6 h-6 rounded-full bg-[#DBBDE3]/50 flex items-center justify-center">
                              <svg className="w-4 h-4 text-[#8051B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="relative"
                    >
                      <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                        <div className="flex justify-between items-center mb-6">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-[#DBBDE3]/50 flex items-center justify-center">
                              <svg className="w-6 h-6 text-[#8051B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold">Live Data Stream</h3>
                              <p className="text-sm text-gray-500">Real-time updates</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-2xl text-[#8051B8]">Active</p>
                            <p className="text-sm text-[#8051B8]">Streaming</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="h-2 bg-[#DBBDE3] rounded w-3/4" />
                          <div className="h-2 bg-[#DBBDE3] rounded w-1/2" />
                          <div className="h-2 bg-[#DBBDE3] rounded w-5/6" />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Process Section */}
            <section className="py-20">
              <div className="max-w-7xl mx-auto">
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-[#8051B8] to-[#CDA3E0] bg-clip-text text-transparent"
                >
                  How It Works
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {processSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="relative"
                    >
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#DBBDE3]/50">
                        <div className="w-12 h-12 bg-[#DBBDE3]/50 rounded-lg flex items-center justify-center mb-4">
                          {step.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                      {index < processSteps.length - 1 && (
                        <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                          <svg className="w-6 h-6 text-[#CDA3E0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
            >
              {featureCards.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border border-[#DBBDE3]/50"
                >
                  <div className="absolute -top-4 left-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: index * 0.2 }}
                      className="w-12 h-12 bg-gradient-to-br from-[#DBBDE3]/50 to-[#DBBDE3]/30 rounded-lg flex items-center justify-center shadow-md"
                    >
                      {feature.icon}
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 mt-6 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-700">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 mb-20"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-[#DBBDE3]/50"
                >
                  <motion.div
                    initial={{ y: 20 }}
                    whileInView={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-4xl font-bold bg-gradient-to-r from-[#8051B8] to-[#CDA3E0] bg-clip-text text-transparent mb-2"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-700 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Add Footer here */}
            <Footer />
          </div>
        </section>
      </div>
    </TracingBeam>
  );
};


const features = [
  "Live, structured data streams from blockchain",
  "Instant updates without waiting for oracles",
  "Reactive applications that respond in real-time",
  "Build games, DeFi, and dashboards with live data"
];

const processSteps = [
  {
    title: "Connect to SDS",
    description: "Integrate Somnia Data Streams SDK to access live on-chain data streams instantly.",
    icon: <svg className="w-6 h-6 text-[#8051B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  },
  {
    title: "Build & React",
    description: "Create applications that respond instantly to on-chain events and changes.",
    icon: <svg className="w-6 h-6 text-[#8051B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  },
  {
    title: "Showcase",
    description: "Demonstrate your innovative use case and compete in the hackathon.",
    icon: <svg className="w-6 h-6 text-[#8051B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  }
];

const featureCards = [
  {
    title: "Live Data Streams",
    description: "Get instant, structured data directly from the blockchain without delays or oracles.",
    icon: <svg className="w-6 h-6 text-[#8051B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
  },
  {
    title: "Reactive Applications",
    description: "Build apps that update instantly as events happen on-chain - games, DeFi, dashboards, and more.",
    icon: <svg className="w-6 h-6 text-[#8051B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
  },
  {
    title: "Hackathon Ready",
    description: "Experiment, prototype, and showcase innovative use cases of Somnia Data Streams.",
    icon: <svg className="w-6 h-6 text-[#8051B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
  }
];

const stats = [
  { value: "Nov 4-15", label: "Hackathon Dates" },
  { value: "Global", label: "Online Event" },
  { value: "2025", label: "Year" }
];

export default Home;
