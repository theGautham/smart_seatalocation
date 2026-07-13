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
// SUB-COMPONENT: SEAT VIEW ALLOCATIONS & INVIGILATORS GRID
// =========================================================================
const ViewAllocationsPanel = ({ onRefresh }) => {
  const [allocations, setAllocations] = useState([]);
  const [teacherAllocations, setTeacherAllocations] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [activeRoom, setActiveRoom] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [assignTeacher, setAssignTeacher] = useState('');

  useEffect(() => {
    fetchAllocations();
    fetchTeacherAssignments();
    fetchMetadata();
  }, [searchQuery]);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/allocations', {
        params: { search: searchQuery }
      });
      setAllocations(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch seat allocations');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherAssignments = async () => {
    try {
      const res = await axios.get('/allocations/teachers');
      setTeacherAllocations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMetadata = async () => {
    try {
      const teachersRes = await axios.get('/teachers');
      setTeachers(teachersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignTeacher = async (e) => {
    e.preventDefault();
    if (!activeRoom || !assignTeacher) {
      setError('Select a teacher');
      return;
    }
    try {
      setError(null);
      await axios.post('/allocations/teacher', {
        roomNumber: activeRoom,
        teacherId: assignTeacher
      });
      setAssignTeacher('');
      setSuccess(`Teacher assigned to room ${activeRoom} successfully!`);
      fetchTeacherAssignments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign teacher');
    }
  };

  const handleRemoveTeacherAssignment = async (id) => {
    if (!window.confirm('Remove this invigilator assignment?')) return;
    try {
      await axios.delete(`/allocations/teacher/${id}`);
      setSuccess('Invigilator duty assignment removed.');
      fetchTeacherAssignments();
    } catch (err) {
      console.error(err);
      setError('Failed to remove assignment');
    }
  };

  const handleClearAllAllocations = async () => {
    if (!window.confirm('Delete ALL seat allocations and teacher assignments? This cannot be undone.')) return;
    try {
      setLoading(true);
      setError(null);
      await axios.delete('/allocations');
      setSuccess('All seat and teacher allocations cleared successfully!');
      setActiveRoom('');
      fetchAllocations();
      fetchTeacherAssignments();
      onRefresh(); // Refresh main dashboard numbers
    } catch (err) {
      console.error(err);
      setError('Failed to clear allocations');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoomAllocation = async (roomNum) => {
    if (!window.confirm(`Delete all allocations and invigilators for room ${roomNum}?`)) return;
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`/allocations/room/${roomNum}`);
      setSuccess(`Allocations for room ${roomNum} deleted successfully!`);
      if (activeRoom === roomNum) setActiveRoom('');
      fetchAllocations();
      fetchTeacherAssignments();
      onRefresh(); // Refresh main metrics
    } catch (err) {
      console.error(err);
      setError(`Failed to delete room allocations`);
    } finally {
      setLoading(false);
    }
  };

  const uniqueRooms = Array.from(new Set(allocations.map(a => a.roomNumber))).sort();
  const roomStudentsCount = (room) => allocations.filter(a => a.roomNumber === room).length;
  const roomTeacherName = (room) => {
    const match = teacherAllocations.find(ta => ta.roomNumber === room);
    return match ? match.teacher?.name : 'No invigilator assigned';
  };
  const roomTeacherObj = (room) => teacherAllocations.find(ta => ta.roomNumber === room);

  const activeRoomStudents = allocations
    .filter(a => a.roomNumber === activeRoom)
    .sort((a, b) => a.seatNumber - b.seatNumber);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">View Seat Allocations</h2>
          <p className="text-slate-400 text-sm mt-1">Select a classroom card below to inspect student seating layout and manage invigilators.</p>
        </div>
        {uniqueRooms.length > 0 && (
          <button
            onClick={handleClearAllAllocations}
            className="flex items-center gap-2 bg-red-650/10 hover:bg-red-600/25 border border-red-500/20 text-red-300 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 active:scale-[0.98] self-start md:self-auto"
          >
            <Trash2 size={14} />
            <span>Clear Seating Plan</span>
          </button>
        )}
      </div>

      {(error || success) && (
        <div className="space-y-2">
          {error && (
            <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-xs">
              <div className="flex items-center gap-2"><AlertCircle size={14} /><span>{error}</span></div>
              <button onClick={() => setError(null)}><X size={14} /></button>
            </div>
          )}
          {success && (
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-xl text-xs">
              <div className="flex items-center gap-2"><CheckCircle2 size={14} /><span>{success}</span></div>
              <button onClick={() => setSuccess(null)}><X size={14} /></button>
            </div>
          )}
        </div>
      )}

      {loading && allocations.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-3 border-indigo-600/35 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-slate-500 text-xs font-semibold">Querying allocations...</span>
        </div>
      ) : uniqueRooms.length === 0 ? (
        <div className="glass rounded-3xl py-16 flex flex-col items-center justify-center gap-3 text-slate-500 border border-slate-800/60 shadow-lg">
          <ShieldAlert size={36} className="text-indigo-500/40" />
          <div className="text-center">
            <h3 className="text-sm font-bold text-white mb-1">No Seating Plans Generated</h3>
            <p className="text-xs text-slate-500">Go to the Seat Allocation Wizard to generate allocations first.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass p-4 rounded-xl border border-slate-800/60 flex items-center gap-3">
              <div className="bg-indigo-650/20 p-2 rounded-lg text-indigo-400"><School size={16} /></div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Halls Seated</span>
                <p className="text-base font-bold text-white">{uniqueRooms.length}</p>
              </div>
            </div>
            <div className="glass p-4 rounded-xl border border-slate-800/60 flex items-center gap-3">
              <div className="bg-purple-650/20 p-2 rounded-lg text-purple-400"><Users size={16} /></div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Total Seated</span>
                <p className="text-base font-bold text-white">{allocations.length} students</p>
              </div>
            </div>
            <div className="glass p-4 rounded-xl border border-slate-800/60 flex items-center gap-3">
              <div className="bg-emerald-650/20 p-2 rounded-lg text-emerald-400"><UserCheck size={16} /></div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Invigilators Duty</span>
                <p className="text-base font-bold text-white">{teacherAllocations.length} active</p>
              </div>
            </div>
          </div>

          <div className="relative max-w-sm">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><Users size={16} /></span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, register number, department..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:border-indigo-500 text-slate-200"
            />
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-slate-505 uppercase tracking-widest mb-3.5">Select Room to Inspect Seating layout</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {uniqueRooms.map(room => {
                const isActive = activeRoom === room;
                const studentCount = roomStudentsCount(room);
                const teacherName = roomTeacherName(room);
                const teacherObj = roomTeacherObj(room);

                return (
                  <div
                    key={room}
                    onClick={() => setActiveRoom(isActive ? '' : room)}
                    className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isActive 
                        ? 'bg-indigo-950/30 border-indigo-500 shadow-md' 
                        : 'glass border-slate-800 hover:border-slate-705'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[9px] text-indigo-400 font-extrabold uppercase">Classroom</span>
                          <h4 className="text-xl font-extrabold text-white mt-0.5">{room}</h4>
                        </div>
                        <span className="bg-slate-950 text-indigo-400 border border-indigo-900/40 text-[10px] font-bold px-2.5 py-0.5 rounded">
                          {studentCount} Students
                        </span>
                      </div>
                      <div className="mt-4 space-y-0.5">
                        <span className="text-[9px] text-slate-505 uppercase font-bold block">Invigilator</span>
                        <div className="flex items-center gap-1.5">
                          <UserCheck size={12} className={teacherObj ? 'text-emerald-400' : 'text-slate-600'} />
                          <span className={`text-xs font-semibold ${teacherObj ? 'text-slate-200' : 'text-slate-500'}`}>{teacherName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-[11px]">
                      <span className="text-indigo-400 font-semibold">{isActive ? 'Hide Details' : 'View Seating Details →'}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRoomAllocation(room);
                        }}
                        className="text-slate-500 hover:text-red-400 p-1 hover:bg-slate-905 rounded-lg transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {activeRoom && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-2">
              <div className="xl:col-span-2 space-y-4">
                <div className="glass rounded-2xl border border-slate-800/60 overflow-hidden shadow-lg">
                  <div className="px-6 py-4.5 border-b border-slate-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <School className="text-indigo-400" size={16} />
                      <h3 className="font-extrabold text-slate-100 text-sm">Seating Map: Room {activeRoom}</h3>
                    </div>
                    <button onClick={() => setActiveRoom('')} className="text-slate-505 hover:text-slate-300 bg-slate-905 p-1 rounded-lg"><X size={12} /></button>
                  </div>
                  <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950/60 border-b border-slate-800/80 text-[10px] font-semibold text-slate-450 uppercase tracking-wider sticky top-0 z-10">
                          <th className="px-6 py-3 bg-slate-950/80">Seat</th>
                          <th className="px-6 py-3 bg-slate-950/80">Register No</th>
                          <th className="px-6 py-3 bg-slate-950/80">Name</th>
                          <th className="px-6 py-3 bg-slate-950/80">Dept</th>
                          <th className="px-6 py-3 bg-slate-950/80">Sem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850/60 text-xs text-slate-350">
                        {activeRoomStudents.map((alloc) => (
                          <tr key={alloc._id} className="hover:bg-slate-900/20">
                            <td className="px-6 py-3"><span className="bg-indigo-900/40 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded font-mono font-bold text-[10px]">Seat {alloc.seatNumber}</span></td>
                            <td className="px-6 py-3 font-mono text-indigo-400">{alloc.registerNumber}</td>
                            <td className="px-6 py-3 font-medium text-slate-200">{alloc.student?.name || 'N/A'}</td>
                            <td className="px-6 py-3">{alloc.department}</td>
                            <td className="px-6 py-3">{alloc.semester}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass rounded-2xl p-5 border border-slate-800/60">
                  <div className="flex items-center gap-2 border-b border-slate-850 pb-2.5 mb-3">
                    <UserCheck className="text-indigo-400" size={16} />
                    <h3 className="font-bold text-slate-100 text-xs">Assign / Override Teacher</h3>
                  </div>
                  <form onSubmit={handleAssignTeacher} className="space-y-4">
                    <div>
                      <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">Modify assigned teacher for <strong>Room {activeRoom}</strong>. Only free invigilators are listed.</p>
                      <div className="relative">
                        <select
                          value={assignTeacher}
                          onChange={(e) => setAssignTeacher(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs appearance-none outline-none focus:border-indigo-500 text-slate-200"
                          required
                        >
                          <option value="">Select Teacher</option>
                          {teachers
                            .filter(teacher => {
                              const assignedToOther = teacherAllocations.some(
                                alloc => alloc.roomNumber !== activeRoom && 
                                (alloc.teacher?._id === teacher._id || alloc.teacher === teacher._id)
                              );
                              return !assignedToOther;
                            })
                            .map(teacher => (
                              <option key={teacher._id} value={teacher._id}>
                                {teacher.name} ({teacher.employeeId})
                              </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-2.5 text-slate-505 pointer-events-none" size={14} />
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-indigo-650 hover:bg-indigo-600 text-white py-2 px-3 rounded-xl text-xs font-semibold transition-all">
                      Assign Selected
                    </button>
                  </form>
                </div>

                {roomTeacherObj(activeRoom) && (
                  <div className="glass p-4 rounded-xl border border-slate-800/60 space-y-2">
                    <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Active duty Invigilator</h4>
                    <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-850 flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">{roomTeacherObj(activeRoom).teacher?.name}</p>
                        <p className="text-[9px] text-slate-550 font-mono mt-0.5">ID: {roomTeacherObj(activeRoom).teacher?.employeeId}</p>
                        <p className="text-[9px] bg-indigo-900/30 text-indigo-400 border border-indigo-900/30 px-2 py-0.5 rounded font-bold inline-block mt-2">
                          Dept: {roomTeacherObj(activeRoom).teacher?.department}
                        </p>
                      </div>
                      <button onClick={() => handleRemoveTeacherAssignment(roomTeacherObj(activeRoom)._id)} className="text-slate-500 hover:text-red-400 p-1 hover:bg-slate-900 rounded-lg"><Trash2 size={12} /></button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export default ViewAllocationsPanel;
