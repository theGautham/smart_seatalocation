import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, Users, GraduationCap, Lock, LogIn, AlertCircle } from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Login = () => {
  const { login, user, error, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('student'); // 'student', 'teacher', 'admin'
  const [identifier, setIdentifier] = useState(''); // username / employeeId / registerNumber
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setError(null);
    setIdentifier('');
    setPassword('');
  }, [activeTab, setError]);

  // Route to correct dashboard if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'teacher') navigate('/teacher/dashboard');
      else if (user.role === 'student') navigate('/student/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      await login(activeTab, identifier, password);
    } catch (err) {
      // Error is already set in context
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getTabLabel = () => {
    if (activeTab === 'student') return 'Register Number (or Name)';
    if (activeTab === 'teacher') return 'Employee ID (or Name)';
    return 'Username';
  };

  const getTabIcon = () => {
    if (activeTab === 'student') return <GraduationCap size={16} />;
    if (activeTab === 'teacher') return <Users size={16} />;
    return <Shield size={16} />;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-650/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-md glass glow-card relative z-10 shadow-2xl border-slate-800/80 bg-slate-950/40">
        <CardHeader className="flex flex-col items-center mb-2 text-center pb-2">
          <div className="bg-indigo-600 p-3.5 rounded-2xl text-white shadow-lg shadow-indigo-600/30 mb-4 animate-bounce">
            <Shield size={28} />
          </div>
          <CardTitle className="text-2xl font-extrabold tracking-wide text-white">Smart Exam System</CardTitle>
          <CardDescription className="text-slate-400 mt-1">Seat Allocation & Hall Management</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl h-14 p-1 mb-6">
              <TabsTrigger value="student" className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <div className="flex flex-col items-center gap-1">
                  <GraduationCap size={14} />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Student</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="teacher" className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <div className="flex flex-col items-center gap-1">
                  <Users size={14} />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Teacher</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="admin" className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <div className="flex flex-col items-center gap-1">
                  <Shield size={14} />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Admin</span>
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-2xl text-sm mb-6 animate-pulse">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 mt-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{getTabLabel()}</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    {getTabIcon()}
                  </span>
                  <Input 
                    type="text" 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={`Enter ${getTabLabel().toLowerCase()}`}
                    className="pl-10 h-12 bg-slate-950/60 border-slate-800 focus-visible:ring-indigo-500 rounded-2xl text-white placeholder:text-slate-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Lock size={16} />
                  </span>
                  <Input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 h-12 bg-slate-950/60 border-slate-800 focus-visible:ring-indigo-500 rounded-2xl text-white placeholder:text-slate-600"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full h-14 mt-6 bg-indigo-650 hover:bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/25 transition-all duration-300"
              >
                {submitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={18} className="mr-2" />
                    <span className="font-semibold tracking-wide">Log In to Portal</span>
                  </>
                )}
              </Button>
            </form>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-800/60 pt-6 text-xs text-slate-500 text-center">
          {activeTab === 'student' && (
            <p>Students can log in using their Name as username and Register Number as the password.</p>
          )}
          {activeTab === 'teacher' && (
            <p>Teachers can log in using their Name as username and Employee ID as the password.</p>
          )}
          {activeTab === 'admin' && (
            <p>Admin credentials seeded during server setup.</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
