import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { 
  Users, 
  School, 
  UserCheck, 
  CheckCircle, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ChevronRight, 
  LayoutGrid, 
  Plus, 
  Upload, 
  Search, 
  Trash2, 
  Edit3, 
  FileSpreadsheet, 
  X, 
  ChevronDown, 
  ShieldAlert, 
  RefreshCw, 
  Cpu, 
  Info
} from 'lucide-react';

// =========================================================================
// SUB-COMPONENT: TEACHER MANAGEMENT
// =========================================================================
const TeachersPanel = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);

  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [csvFile, setCsvFile] = useState(null);
  const [uploadingCsv, setUploadingCsv] = useState(false);

  const departments = ['CSE', 'ECE', 'EEE', 'Civil', 'Mechanical'];

  useEffect(() => {
    fetchTeachers();
  }, [searchQuery]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/teachers', {
        params: { search: searchQuery }
      });
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch teacher database');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!name || !employeeId || !department) {
      setError('All fields are required');
      return;
    }
    try {
      setError(null);
      await axios.post('/teachers', { name, employeeId, department });
      setName('');
      setEmployeeId('');
      setIsAddModalOpen(false);
      setSuccessMsg('Teacher added successfully!');
      fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add teacher');
    }
  };

  const handleEditTeacher = async (e) => {
    e.preventDefault();
    if (!currentTeacher.name || !currentTeacher.employeeId || !currentTeacher.department) {
      setError('All fields are required');
      return;
    }
    try {
      setError(null);
      await axios.put(`/teachers/${currentTeacher._id}`, currentTeacher);
      setIsEditModalOpen(false);
      setCurrentTeacher(null);
      setSuccessMsg('Teacher details updated successfully!');
      fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update teacher');
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm('Delete this teacher? This clears any invigilation assignment.')) return;
    try {
      await axios.delete(`/teachers/${id}`);
      setSuccessMsg('Teacher deleted successfully');
      fetchTeachers();
    } catch (err) {
      console.error(err);
      setError('Failed to delete teacher');
    }
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      setError('Select a CSV file');
      return;
    }
    const formData = new FormData();
    formData.append('file', csvFile);
    try {
      setUploadingCsv(true);
      setError(null);
      const res = await axios.post('/teachers/upload-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccessMsg(`Import Complete! Imported: ${res.data.successCount}, Skipped: ${res.data.duplicateCount}`);
      setCsvFile(null);
      const fileInput = document.getElementById('teacher-csv-input');
      if (fileInput) fileInput.value = '';
      fetchTeachers();
    } catch (err) {
      console.error(err);
      setError('Error uploading CSV');
    } finally {
      setUploadingCsv(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Teacher Management</h2>
          <p className="text-slate-400 text-sm mt-1">Manage database records and register invigilators.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-650 hover:bg-indigo-600 active:scale-[0.98] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md self-start md:self-auto"
        >
          <Plus size={16} />
          <span>Add Teacher</span>
        </button>
      </div>

      {(error || successMsg) && (
        <div className="space-y-2">
          {error && (
            <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-xs animate-fade-in">
              <div className="flex items-center gap-2"><AlertCircle size={14} /><span>{error}</span></div>
              <button onClick={() => setError(null)}><X size={14} /></button>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-xl text-xs animate-fade-in">
              <div className="flex items-center gap-2"><CheckCircle2 size={14} /><span>{successMsg}</span></div>
              <button onClick={() => setSuccessMsg(null)}><X size={14} /></button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-5 border border-slate-800/60 flex flex-col justify-center lg:col-span-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Search Teachers</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500"><Search size={16} /></span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, employee ID, or department..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs outline-none focus:border-indigo-500 text-slate-200"
              />
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-slate-800/60">
          <form onSubmit={handleCsvUpload} className="space-y-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Import Teachers CSV</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="file"
                  id="teacher-csv-input"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files[0])}
                  className="hidden"
                />
                <label
                  htmlFor="teacher-csv-input"
                  className="flex items-center gap-2 justify-center w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 border-dashed rounded-xl py-2.5 px-4 text-xs text-slate-400 cursor-pointer"
                >
                  <FileSpreadsheet size={14} className="text-indigo-400" />
                  <span className="truncate max-w-[120px]">{csvFile ? csvFile.name : 'Select CSV'}</span>
                </label>
              </div>
              <button
                type="submit"
                disabled={uploadingCsv || !csvFile}
                className="bg-indigo-650 hover:bg-indigo-600 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all"
              >
                <Upload size={14} />
                <span>{uploadingCsv ? 'Saving...' : 'Upload'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="glass rounded-2xl border border-slate-800/60 overflow-hidden shadow-lg">
        {loading && teachers.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-3 border-indigo-600/35 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-slate-500 text-xs">Querying teachers...</span>
          </div>
        ) : teachers.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-500">
            <FileSpreadsheet size={32} className="text-slate-800" />
            <p className="text-xs">No teacher records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800/80 text-[10px] font-semibold text-slate-450 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Employee ID</th>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 text-xs text-slate-300">
                {teachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-3.5 font-mono font-bold text-indigo-400">{teacher.employeeId}</td>
                    <td className="px-6 py-3.5 font-medium text-slate-200">{teacher.name}</td>
                    <td className="px-6 py-3.5">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold">{teacher.department}</span>
                    </td>
                    <td className="px-6 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => {
                          setCurrentTeacher(teacher);
                          setIsEditModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-500/10 hover:text-indigo-300 border border-slate-705 text-slate-450 transition-colors"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(teacher._id)}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-500/10 hover:text-red-400 border border-slate-705 text-slate-450 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-base text-white border-b border-slate-800 pb-3 mb-4">Add Teacher</h3>
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Teacher Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-500 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Employee ID</label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-500 text-white font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Department</label>
                <div className="relative">
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs appearance-none outline-none focus:border-indigo-500 text-slate-200"
                  >
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-3 text-slate-505 pointer-events-none" size={14} />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-650 hover:bg-indigo-600 text-white py-3 rounded-xl text-xs font-bold transition-colors">
                Register Teacher
              </button>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && currentTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-base text-white border-b border-slate-800 pb-3 mb-4">Edit Teacher</h3>
            <form onSubmit={handleEditTeacher} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Name</label>
                <input
                  type="text"
                  value={currentTeacher.name}
                  onChange={(e) => setCurrentTeacher({ ...currentTeacher, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Employee ID</label>
                <input
                  type="text"
                  value={currentTeacher.employeeId}
                  onChange={(e) => setCurrentTeacher({ ...currentTeacher, employeeId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Department</label>
                <select
                  value={currentTeacher.department}
                  onChange={(e) => setCurrentTeacher({ ...currentTeacher, department: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-250 rounded-xl py-2 px-3 text-xs"
                >
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-indigo-650 hover:bg-indigo-600 text-white py-3 rounded-xl text-xs font-bold transition-colors">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default TeachersPanel;
