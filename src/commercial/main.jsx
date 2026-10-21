import React from 'react';
import { createRoot } from 'react-dom/client';
import CommercialPage from './CommercialPage.jsx';
import './commercial.css';

createRoot(document.getElementById('commercial-root')).render(<React.StrictMode><CommercialPage /></React.StrictMode>);
