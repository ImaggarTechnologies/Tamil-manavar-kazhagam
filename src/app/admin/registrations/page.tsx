import { useEffect, useState } from 'react';
import { tamilNaduDistricts } from '../../../constants/districts';
import { interestOptions } from '../../../constants/translations';
import {
  Users,
  UserCheck,
  MapPin,
  Calendar,
  Phone,
  Mail,
  BookOpen,
  Award,
  Hash,
  Download,
  Search,
  X,
  Copy,
  CheckCircle,
  ExternalLink,
  Heart,
  MessageSquare,
  Filter,
  Plus,
  Pencil,
  Trash2
} from 'lucide-react';

type Registration = {
  _id: string;
  fullName: string;
  mobileNumber: string;
  whatsappNumber?: string;
  whatsAppNumber?: string;
  email: string;
  gender: string;
  dob?: string;
  dateOfBirth?: string;
  collegeName: string;
  university?: string;
  department: string;
  year: string;
  district: string;
  city?: string;
  reason?: string;
  whyJoin?: string;
  interests?: string[];
  areasOfInterest?: string[];
  createdAt: string;
};

const initialFormState = {
  fullName: '',
  mobileNumber: '',
  whatsappNumber: '',
  email: '',
  gender: '',
  dob: '',
  collegeName: '',
  university: '',
  department: '',
  year: '',
  district: '',
  city: '',
  reason: '',
  interests: [] as string[],
};

export default function AdminRegistrationsPage() {
  const [items, setItems] = useState<Registration[]>([]);
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  
  // Modals & CRUD State
  const [selected, setSelected] = useState<Registration | null>(null);
  const [showFormModal, setShowFormModal] = useState<'add' | 'edit' | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const [formData, setFormData] = useState(initialFormState);
  const [editId, setEditId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  const loadData = () => {
    const token = localStorage.getItem('adminToken');
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (district) params.set('district', district);
    if (college) params.set('college', college);
    if (department) params.set('department', department);

    fetch(`/api/admin/registrations?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setItems(data.items || []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const exportCsv = async () => {
    const token = localStorage.getItem('adminToken');
    const params = new URLSearchParams({ export: 'csv' });
    if (search) params.set('search', search);
    if (district) params.set('district', district);
    if (college) params.set('college', college);
    if (department) params.set('department', department);

    const response = await fetch(`/api/admin/registrations?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `registrations_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // CRUD actions
  const handleOpenAdd = () => {
    setFormData(initialFormState);
    setEditId(null);
    setFormError('');
    setShowFormModal('add');
  };

  const handleOpenEdit = (item: Registration) => {
    setFormData({
      fullName: item.fullName || '',
      mobileNumber: item.mobileNumber || '',
      whatsappNumber: item.whatsappNumber || item.whatsAppNumber || '',
      email: item.email || '',
      gender: item.gender || '',
      dob: item.dob || (item.dateOfBirth ? new Date(item.dateOfBirth).toISOString().slice(0, 10) : ''),
      collegeName: item.collegeName || '',
      university: item.university || '',
      department: item.department || '',
      year: item.year || '',
      district: item.district || '',
      city: item.city || '',
      reason: item.reason || item.whyJoin || '',
      interests: item.interests || item.areasOfInterest || [],
    });
    setEditId(item._id);
    setFormError('');
    setShowFormModal('edit');
    setSelected(null); // Close details modal if open
  };

  const updateField = (key: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (
      !formData.fullName ||
      !formData.mobileNumber ||
      !formData.email ||
      !formData.gender ||
      !formData.dob ||
      !formData.collegeName ||
      !formData.department ||
      !formData.year ||
      !formData.district
    ) {
      setFormError('Please fill in all required fields marked with *');
      return;
    }

    setFormSubmitting(true);
    const token = localStorage.getItem('adminToken');
    
    // Normalize fields for backend compatibility
    const submitPayload = {
      fullName: formData.fullName,
      mobileNumber: formData.mobileNumber,
      whatsAppNumber: formData.whatsappNumber,
      whatsappNumber: formData.whatsappNumber,
      email: formData.email,
      gender: formData.gender,
      dateOfBirth: formData.dob,
      dob: formData.dob,
      collegeName: formData.collegeName,
      university: formData.university,
      department: formData.department,
      year: formData.year,
      district: formData.district,
      city: formData.city,
      whyJoin: formData.reason,
      reason: formData.reason,
      areasOfInterest: formData.interests,
      interests: formData.interests
    };

    try {
      const url = showFormModal === 'add' 
        ? '/api/admin/registrations' 
        : `/api/admin/registrations/${editId}`;
      const method = showFormModal === 'add' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(submitPayload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save registration');

      setShowFormModal(null);
      loadData();
    } catch (err: any) {
      setFormError(err.message || 'An error occurred');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setShowDeleteConfirm(id);
    setSelected(null);
  };

  const handleConfirmDelete = async () => {
    if (!showDeleteConfirm) return;
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`/api/admin/registrations/${showDeleteConfirm}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete');
      
      setShowDeleteConfirm(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'An error occurred during deletion');
    }
  };

  // Calculate statistics from the registration list
  const totalCount = items.length;
  const todayCount = items.filter((item) => {
    if (!item.createdAt) return false;
    const date = new Date(item.createdAt);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }).length;

  const maleCount = items.filter((item) => item.gender?.toLowerCase() === 'male').length;
  const femaleCount = items.filter((item) => item.gender?.toLowerCase() === 'female').length;
  const otherCount = items.filter((item) => item.gender?.toLowerCase() === 'other').length;
  
  const uniqueDistricts = new Set(items.map((item) => item.district).filter(Boolean)).size;

  return (
    <div className="space-y-8">
      {/* 1. Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total */}
        <div className="card p-6 flex items-center gap-4">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary shadow-inner">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Total Registered</p>
            <p className="text-3xl font-bold text-white mt-1">{totalCount}</p>
          </div>
        </div>

        {/* Today */}
        <div className="card p-6 flex items-center gap-4">
          <div className="rounded-2xl bg-accent/10 p-3 text-accent shadow-inner">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">New Today</p>
            <p className="text-3xl font-bold text-white mt-1">{todayCount}</p>
          </div>
        </div>

        {/* Gender breakdown */}
        <div className="card p-6 flex items-center gap-4">
          <div className="rounded-2xl bg-secondary/10 p-3 text-secondary shadow-inner">
            <Heart className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Gender Distribution</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 font-semibold border border-blue-500/20">
                M: {maleCount}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-300 font-semibold border border-pink-500/20">
                F: {femaleCount}
              </span>
              {otherCount > 0 && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-semibold border border-purple-500/20">
                  O: {otherCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Districts */}
        <div className="card p-6 flex items-center gap-4">
          <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400 shadow-inner">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Districts Covered</p>
            <p className="text-3xl font-bold text-white mt-1">{uniqueDistricts}</p>
          </div>
        </div>
      </div>

      {/* 2. Filters Card */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-primary/10 pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-accent" />
            <h2 className="text-base font-semibold">Filter Registrations</h2>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Add Student
          </button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email..."
              className="input-field pl-10"
            />
          </div>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="input-field"
          >
            <option value="">All Districts</option>
            {tamilNaduDistricts.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            placeholder="Filter by College"
            className="input-field"
          />
          <input
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Filter by Department"
            className="input-field"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={loadData}
            className="btn-primary px-6 py-2.5"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={exportCsv}
            className="btn-outline px-6 py-2.5 flex items-center gap-2"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* 3. Table Card */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-primary/10 bg-black/25 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Registered Students</h2>
          <span className="text-xs bg-primary/20 text-accent font-semibold px-3 py-1 rounded-full border border-primary/30">
            {items.length} records found
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-primary/20 bg-black/40 text-gray-300 font-medium">
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Mobile</th>
                <th className="px-6 py-3.5">College</th>
                <th className="px-6 py-3.5">District</th>
                <th className="px-6 py-3.5">Registered Date</th>
                <th className="px-6 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item._id} className="hover:bg-primary/5 transition duration-150">
                    <td className="px-6 py-4 font-semibold text-white">{item.fullName}</td>
                    <td className="px-6 py-4 text-gray-300">{item.mobileNumber}</td>
                    <td className="px-6 py-4 text-gray-300 max-w-[200px] truncate">{item.collegeName}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                        <MapPin className="h-3 w-3" /> {item.district}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      }) : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelected(item)}
                          className="text-accent hover:text-white bg-accent/10 hover:bg-accent px-3 py-1.5 rounded-full text-xs font-semibold transition"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-500 p-1.5 rounded-full transition"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(item._id)}
                          className="text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 p-1.5 rounded-full transition"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                    No registrations found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Beautiful Details Modal */}
      {selected && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-3xl card p-6 md:p-8 max-h-[92vh] overflow-y-auto shadow-glow flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-primary/20 pb-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white text-xl font-bold uppercase shadow-md">
                  {selected.fullName.slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">{selected.fullName}</h2>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                    <Calendar className="h-3.5 w-3.5 text-accent" /> Registered on {formatDate(selected.createdAt)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 flex-1 pr-1">
              {/* Section 1: Personal Details */}
              <div className="bg-black/35 rounded-2xl p-5 border border-primary/10">
                <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4" /> Personal Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Gender */}
                  <div>
                    <span className="text-xs text-gray-400 block">Gender</span>
                    <span className="text-sm font-medium text-white mt-0.5 block">{selected.gender || 'N/A'}</span>
                  </div>

                  {/* DOB */}
                  <div>
                    <span className="text-xs text-gray-400 block">Date of Birth</span>
                    <span className="text-sm font-medium text-white mt-0.5 block">
                      {formatDate(selected.dob || selected.dateOfBirth)}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-2 flex justify-between items-center border-t border-primary/5 pt-3">
                    <div>
                      <span className="text-xs text-gray-400 block">Email Address</span>
                      <a href={`mailto:${selected.email}`} className="text-sm font-medium text-blue-300 hover:underline flex items-center gap-1 mt-0.5">
                        <Mail className="h-3.5 w-3.5" /> {selected.email}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(selected.email, 'email')}
                      className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-white/5 px-2 py-1 rounded"
                    >
                      {copiedField === 'email' ? <CheckCircle className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                      {copiedField === 'email' ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  {/* Mobile Number */}
                  <div className="flex justify-between items-center border-t border-primary/5 pt-3">
                    <div>
                      <span className="text-xs text-gray-400 block">Mobile Number</span>
                      <a href={`tel:${selected.mobileNumber}`} className="text-sm font-medium text-white hover:text-accent flex items-center gap-1 mt-0.5">
                        <Phone className="h-3.5 w-3.5 text-accent" /> {selected.mobileNumber}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(selected.mobileNumber, 'mobile')}
                      className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-white/5 px-2 py-1 rounded"
                    >
                      {copiedField === 'mobile' ? <CheckCircle className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                      {copiedField === 'mobile' ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex justify-between items-center border-t border-primary/5 pt-3">
                    {(() => {
                      const waNum = selected.whatsappNumber || selected.whatsAppNumber || '';
                      const cleanWa = waNum.replace(/\D/g, '');
                      return (
                        <>
                          <div>
                            <span className="text-xs text-gray-400 block">WhatsApp Number</span>
                            {waNum ? (
                              <a
                                href={`https://wa.me/91${cleanWa.slice(-10)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm font-medium text-emerald-400 hover:underline flex items-center gap-1 mt-0.5"
                              >
                                <MessageSquare className="h-3.5 w-3.5" /> {waNum} <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            ) : (
                              <span className="text-sm font-medium text-gray-500 mt-0.5 block">Not provided</span>
                            )}
                          </div>
                          {waNum && (
                            <button
                              type="button"
                              onClick={() => handleCopy(waNum, 'whatsapp')}
                              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-white/5 px-2 py-1 rounded"
                            >
                              {copiedField === 'whatsapp' ? <CheckCircle className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                              {copiedField === 'whatsapp' ? 'Copied' : 'Copy'}
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Section 2: Academic & Location */}
              <div className="bg-black/35 rounded-2xl p-5 border border-primary/10">
                <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> Academic & Location Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* College Name */}
                  <div className="sm:col-span-2">
                    <span className="text-xs text-gray-400 block">College Name</span>
                    <span className="text-sm font-semibold text-white mt-0.5 block flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-primary shrink-0" /> {selected.collegeName}
                    </span>
                  </div>

                  {/* University */}
                  <div>
                    <span className="text-xs text-gray-400 block">University</span>
                    <span className="text-sm font-medium text-white mt-0.5 block flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-secondary" /> {selected.university || 'N/A'}
                    </span>
                  </div>

                  {/* Department */}
                  <div>
                    <span className="text-xs text-gray-400 block">Department</span>
                    <span className="text-sm font-medium text-white mt-0.5 block">{selected.department}</span>
                  </div>

                  {/* Year */}
                  <div>
                    <span className="text-xs text-gray-400 block">Year of Study</span>
                    <span className="text-sm font-medium text-white mt-0.5 block flex items-center gap-1.5">
                      <Hash className="h-3.5 w-3.5 text-accent" /> 
                      {selected.year === '1' ? '1st Year' : 
                       selected.year === '2' ? '2nd Year' : 
                       selected.year === '3' ? '3rd Year' : 
                       selected.year === '4' ? '4th Year' : 
                       selected.year || 'N/A'}
                    </span>
                  </div>

                  {/* Location (District & City) */}
                  <div>
                    <span className="text-xs text-gray-400 block">District & City/Town</span>
                    <span className="text-sm font-medium text-white mt-0.5 block flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-emerald-400" /> {selected.district} {selected.city ? `, ${selected.city}` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 3: Motivation & Interests */}
              <div className="bg-black/35 rounded-2xl p-5 border border-primary/10">
                <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Award className="h-4 w-4" /> Areas of Interest & Motivation
                </h3>
                <div className="space-y-4">
                  {/* Areas of Interest */}
                  <div>
                    <span className="text-xs text-gray-400 block mb-2">Areas of Interest</span>
                    {(() => {
                      const interests = selected.interests || selected.areasOfInterest || [];
                      return interests.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {interests.map((interest, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/15 text-white border border-primary/30"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-gray-500">None specified</span>
                      );
                    })()}
                  </div>

                  {/* Why Join */}
                  <div className="border-t border-primary/5 pt-4">
                    <span className="text-xs text-gray-400 block mb-2">Why do you want to join?</span>
                    <div className="rounded-xl bg-white/5 border-l-4 border-accent p-4 text-sm text-gray-200 italic leading-relaxed">
                      "{selected.reason || selected.whyJoin || 'No reason provided.'}"
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-primary/20 pt-4 mt-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(selected)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-2 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit details
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteClick(selected._id)}
                  className="bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/20 rounded-full px-5 py-2 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete student
                </button>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="btn-outline px-6 py-2"
              >
                Close
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* 5. Add/Edit Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl card p-6 md:p-8 max-h-[92vh] overflow-y-auto shadow-glow flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-primary/20 pb-4 mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {showFormModal === 'add' ? 'Add New Registration' : 'Edit Registration Details'}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Fill in the fields below to {showFormModal === 'add' ? 'register a new student' : 'update this registration'}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFormModal(null)}
                className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Form */}
            <form onSubmit={handleSubmitForm} className="space-y-6 flex-1 pr-1">
              
              {/* Section 1: Personal Details */}
              <div className="bg-black/35 rounded-2xl p-5 border border-primary/10 space-y-4">
                <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" /> Personal Information
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-gray-300">
                    Full Name *
                    <input
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      required
                      className="input-field mt-1.5"
                    />
                  </label>
                  <label className="block text-sm text-gray-300">
                    Gender *
                    <select
                      value={formData.gender}
                      onChange={(e) => updateField('gender', e.target.value)}
                      required
                      className="input-field mt-1.5"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  <label className="block text-sm text-gray-300">
                    Mobile Number *
                    <input
                      value={formData.mobileNumber}
                      onChange={(e) => updateField('mobileNumber', e.target.value)}
                      required
                      className="input-field mt-1.5"
                    />
                  </label>
                  <label className="block text-sm text-gray-300">
                    WhatsApp Number
                    <input
                      value={formData.whatsappNumber}
                      onChange={(e) => updateField('whatsappNumber', e.target.value)}
                      className="input-field mt-1.5"
                    />
                  </label>
                  <label className="block text-sm text-gray-300">
                    Email Address *
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      required
                      className="input-field mt-1.5"
                    />
                  </label>
                  <label className="block text-sm text-gray-300">
                    Date of Birth *
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => updateField('dob', e.target.value)}
                      required
                      className="input-field mt-1.5"
                    />
                  </label>
                </div>
              </div>

              {/* Section 2: Academic Details */}
              <div className="bg-black/35 rounded-2xl p-5 border border-primary/10 space-y-4">
                <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> Academic & Location details
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-gray-300 sm:col-span-2">
                    College Name *
                    <input
                      value={formData.collegeName}
                      onChange={(e) => updateField('collegeName', e.target.value)}
                      required
                      className="input-field mt-1.5"
                    />
                  </label>
                  <label className="block text-sm text-gray-300">
                    University
                    <input
                      value={formData.university}
                      onChange={(e) => updateField('university', e.target.value)}
                      className="input-field mt-1.5"
                    />
                  </label>
                  <label className="block text-sm text-gray-300">
                    Department *
                    <input
                      value={formData.department}
                      onChange={(e) => updateField('department', e.target.value)}
                      required
                      className="input-field mt-1.5"
                    />
                  </label>
                  <label className="block text-sm text-gray-300">
                    Year of Study *
                    <select
                      value={formData.year}
                      onChange={(e) => updateField('year', e.target.value)}
                      required
                      className="input-field mt-1.5"
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="PG">PG</option>
                    </select>
                  </label>
                  <label className="block text-sm text-gray-300">
                    District *
                    <select
                      value={formData.district}
                      onChange={(e) => updateField('district', e.target.value)}
                      required
                      className="input-field mt-1.5"
                    >
                      <option value="">Select District</option>
                      {tamilNaduDistricts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm text-gray-300 sm:col-span-2">
                    City/Town
                    <input
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      className="input-field mt-1.5"
                    />
                  </label>
                </div>
              </div>

              {/* Section 3: Motivation & Interests */}
              <div className="bg-black/35 rounded-2xl p-5 border border-primary/10 space-y-4">
                <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4" /> Areas of Interest & Motivation
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-semibold text-white block mb-2">Areas of Interest</span>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {interestOptions.map((option) => (
                        <label key={option} className="inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-primary/20 bg-black/60 px-4 py-3 transition hover:border-primary/50">
                          <input 
                            type="checkbox" 
                            checked={formData.interests.includes(option)} 
                            onChange={() => toggleInterest(option)} 
                            className="h-4 w-4 rounded border-primary/20 text-primary focus:ring-primary" 
                          />
                          <span className="text-xs text-gray-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <label className="block text-sm text-gray-300">
                    Why do you want to join?
                    <textarea
                      value={formData.reason}
                      onChange={(e) => updateField('reason', e.target.value)}
                      rows={3}
                      className="input-field mt-1.5"
                      placeholder="Share your reasons..."
                    />
                  </label>
                </div>
              </div>

              {formError && <p className="error-box">{formError}</p>}

              {/* Form Footer */}
              <div className="border-t border-primary/20 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFormModal(null)}
                  className="btn-outline px-6 py-2.5"
                  disabled={formSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-8 py-2.5"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? 'Saving...' : 'Save Registration'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 6. Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card max-w-md w-full p-6 text-center shadow-glow border border-red-500/20">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/10 text-red-500 mb-4">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete Student Record</h3>
            <p className="text-sm text-gray-400 mt-2">
              Are you sure you want to delete this student registration? This action is permanent and cannot be undone.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(null)}
                className="btn-outline px-5 py-2 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full px-5 py-2 text-xs font-semibold transition"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

