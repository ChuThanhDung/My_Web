import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MachineLearning from './pages/MachineLearning';
import TopicDetails from './pages/TopicDetails';
import Admin from './pages/Admin';

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-[60vh]">
    <h1 className="text-3xl font-bold text-slate-400">{title} - Coming Soon</h1>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="ml" element={<MachineLearning />} />
        <Route path="ml/:topicId" element={<TopicDetails />} />
        <Route path="admin" element={<Admin />} />
        <Route path="projects" element={<Placeholder title="Projects" />} />
        <Route path="about" element={<Placeholder title="About" />} />
        <Route path="contact" element={<Placeholder title="Contact" />} />
      </Route>
    </Routes>
  );
}

export default App;
