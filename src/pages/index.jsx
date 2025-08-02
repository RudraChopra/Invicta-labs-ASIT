import Layout from "./Layout.jsx";

import Home from "./Home";

import Dashboard from "./Dashboard";

import Curriculum from "./Curriculum";

import Badges from "./Badges";

import AIMentor from "./AIMentor";

import Module from "./Module";

import Lesson from "./Lesson";

import Subscription from "./Subscription";

import ConsultingHub from "./ConsultingHub";

import DemoLab from "./DemoLab";

import AdminDashboard from "./AdminDashboard";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Dashboard: Dashboard,
    
    Curriculum: Curriculum,
    
    Badges: Badges,
    
    AIMentor: AIMentor,
    
    Module: Module,
    
    Lesson: Lesson,
    
    Subscription: Subscription,
    
    ConsultingHub: ConsultingHub,
    
    DemoLab: DemoLab,
    
    AdminDashboard: AdminDashboard,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Curriculum" element={<Curriculum />} />
                
                <Route path="/Badges" element={<Badges />} />
                
                <Route path="/AIMentor" element={<AIMentor />} />
                
                <Route path="/Module" element={<Module />} />
                
                <Route path="/Lesson" element={<Lesson />} />
                
                <Route path="/Subscription" element={<Subscription />} />
                
                <Route path="/ConsultingHub" element={<ConsultingHub />} />
                
                <Route path="/DemoLab" element={<DemoLab />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}