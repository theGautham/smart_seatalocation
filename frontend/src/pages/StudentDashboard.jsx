import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, MapPin, Grid, AlertCircle, RefreshCw, Info } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  
  const [allocation, setAllocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSeatInfo();
  }, []);

  const fetchSeatInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('/allocations/my-seat');
      setAllocation(res.data);
    } catch (err) {
      console.error('Error fetching seat info:', err);
      setError('Unable to fetch seat allocation data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-650/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Retrieving seat details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pt-4">
      {/* Welcome Header */}
      <div className="text-center md:text-left mb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Student Exam Portal</h1>
        <p className="text-slate-400 text-sm mt-1">Verify your seating arrangement and room instructions below.</p>
      </div>

      {error && (
        <div className="flex items-center justify-between bg-destructive/10 border border-destructive/20 text-destructive-foreground p-4 rounded-xl text-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchSeatInfo} className="h-8 hover:bg-destructive/20 hover:text-white">
            <RefreshCw size={14} className="mr-2" /> Retry
          </Button>
        </div>
      )}

      {/* Seating Arrangement Card */}
      <Card className="glass glow-card overflow-hidden border-slate-800 shadow-2xl relative bg-slate-950/40 rounded-3xl">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-550/10 rounded-full blur-2xl" />

        <CardHeader className="bg-gradient-to-r from-indigo-900/60 to-indigo-950/80 px-8 py-6 border-b border-indigo-500/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full">
            <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-600/25">
              <GraduationCap size={22} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg text-white uppercase tracking-wide">Seating Arrangement</CardTitle>
              <CardDescription className="text-[10px] text-indigo-400 uppercase tracking-widest font-extrabold mt-0.5">Exam Seating Details</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-350 border-indigo-550/20 hover:bg-indigo-500/30 uppercase tracking-wider font-bold">
              Active Session
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Name</span>
              <p className="text-base font-bold text-slate-100">{user?.name}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Register Number</span>
              <p className="text-base font-mono font-bold text-white">{user?.registerNumber || user?.identifier}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</span>
              <p className="text-base font-bold text-slate-200">{user?.department}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Semester</span>
              <p className="text-base font-bold text-slate-200">{user?.semester}</p>
            </div>
          </div>

          <hr className="border-slate-800/60" />

          {allocation && allocation.allocated ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <Card className="bg-slate-950/60 border-slate-850 flex items-center gap-4 p-5 rounded-2xl shadow-none">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-indigo-400">
                  <MapPin size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">EXAM HALL</span>
                  <span className="text-xl font-black text-white">{allocation.roomNumber}</span>
                  {allocation.building && (
                    <span className="text-xs text-slate-400 block mt-0.5">{allocation.building} Building</span>
                  )}
                </div>
              </Card>

              <Card className="bg-slate-950/60 border-slate-850 flex items-center gap-4 p-5 rounded-2xl shadow-none">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-emerald-450">
                  <Grid size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 tracking-widest block uppercase">SEAT NUMBER</span>
                  <span className="text-xl font-black text-emerald-450">{allocation.seatNumber}</span>
                </div>
              </Card>
            </div>
          ) : (
            <div className="bg-amber-500/10 border border-amber-500/25 p-5 rounded-2xl flex items-start gap-3.5 text-amber-300">
              <AlertCircle size={22} className="shrink-0 text-amber-450" />
              <div>
                <h4 className="font-bold text-sm text-amber-200">Allocation Pending</h4>
                <p className="text-xs text-amber-400/90 leading-relaxed mt-1">
                  Seating arrangements for your group have not been generated yet. Please contact the exam administrator or check back later.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-slate-950/20 px-8 py-4 border-t border-slate-900/50 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Info size={14} className="text-indigo-400 shrink-0" />
          <span>Instructions: Please report to your exam hall at least 15 minutes prior to the scheduled exam. Carry your valid student identification.</span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StudentDashboard;
