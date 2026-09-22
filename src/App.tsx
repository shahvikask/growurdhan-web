import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { FamilyPage } from './pages/Family';
import { HomePage } from './pages/Home';
import { HowItWorksPage } from './pages/HowItWorks';
import { PrivacyPage } from './pages/Privacy';
import { ProductPage } from './pages/Product';
import { WaitlistPage } from './pages/Waitlist';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="product" element={<ProductPage />} />
        <Route path="how-it-works" element={<HowItWorksPage />} />
        <Route path="family" element={<FamilyPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="waitlist" element={<WaitlistPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
