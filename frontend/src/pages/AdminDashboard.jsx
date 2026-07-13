import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

import OverviewPanel from '../components/admin/OverviewPanel';
import StudentsPanel from '../components/admin/StudentsPanel';
import TeachersPanel from '../components/admin/TeachersPanel';
import ClassroomsPanel from '../components/admin/ClassroomsPanel';
import AllocatePanel from '../components/admin/AllocatePanel';
import ViewAllocationsPanel from '../components/admin/ViewAllocationsPanel';

// =========================================================================
// CORE: ADMIN DASHBOARD VIEW WRAPPER
// =========================================================================
const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const setActiveTab = (tab) => setSearchParams({ tab });
  
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClassrooms: 0,
    totalCapacity: 0,
    allocatedSeats: 0,
    availableSeats: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('/allocations/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch system stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-0">
      {activeTab === 'overview' && (
        <OverviewPanel 
          stats={stats} 
          loading={loading} 
          error={error} 
          onRefresh={fetchStats} 
          setActiveTab={setActiveTab} 
        />
      )}
      {activeTab === 'students' && <StudentsPanel />}
      {activeTab === 'teachers' && <TeachersPanel />}
      {activeTab === 'classrooms' && <ClassroomsPanel />}
      {activeTab === 'allocate' && <AllocatePanel setActiveTab={setActiveTab} onRefresh={fetchStats} />}
      {activeTab === 'view-allocations' && <ViewAllocationsPanel onRefresh={fetchStats} />}
    </div>
  );
};

export default AdminDashboard;
