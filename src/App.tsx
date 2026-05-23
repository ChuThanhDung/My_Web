import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import MachineLearning from './pages/MachineLearning';
import TopicDetails from './pages/TopicDetails';
import SamplingTechniques from './pages/SamplingTechniques';
import SamplingDetails from './pages/SamplingDetails';
import ToolsProgramming from './pages/ToolsProgramming';
import ToolDetails from './pages/ToolDetails';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import About from './pages/About';
import ProTools from './pages/ProTools';
import { motion } from 'framer-motion';

const Placeholder = ({ title }: { title: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    className="flex items-center justify-center h-[60vh]"
  >
    <h1 className="text-3xl font-bold text-slate-400">{title} — Coming Soon</h1>
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index           element={<Home />} />
          <Route path="ml"       element={<MachineLearning />} />
          <Route path="ml/:topicId" element={<TopicDetails />} />
          <Route path="sampling" element={<SamplingTechniques />} />
          <Route path="sampling/:samplingId" element={<SamplingDetails />} />
          <Route path="pro-tools" element={<ProTools />} />
          <Route path="tools"    element={<ToolsProgramming />} />
          <Route path="tools/:toolId" element={<ToolDetails />} />
          <Route path="admin"    element={<Admin />} />
          <Route path="projects" element={<Placeholder title="Projects" />} />
          <Route path="about"    element={<About />} />
          <Route path="contact"  element={<Contact />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return <AnimatedRoutes />;
}

export default App;
