import React,{useState, useEffect} from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { Download, FileText, XCircle } from 'lucide-react';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { FaSearch } from 'react-icons/fa';

const DraftApplications = () => {
    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterData();
    }, [search, fromDate, toDate, data]);
    
    const fetchData = async () => {
        try {
            const res = await axiosInstance.get('/api/reports/quick-applied-candidates');
            setData(res.data || []);
        } catch (err) {
            console.error('Error fetching registered candidates', err);
        }
    };

    const filterData = () => {
        let result = [...data];

        if (search) {
            const s = search.toLowerCase();
            result = result.filter(
                c =>
                (c.name && c.name.toLowerCase().includes(s)) ||
                (c.email && c.email.toLowerCase().includes(s))
            );
        }


        if (fromDate && toDate) {
            result = result.filter(c =>
                dayjs(c.createdAt).isAfter(dayjs(fromDate).subtract(1, 'day')) &&
                dayjs(c.createdAt).isBefore(dayjs(toDate).add(1, 'day'))
            );
        }

        setFiltered(result);
        setCurrentPage(1);
    };

     const exportToExcel = () => {
        const exportData = filtered.map(c => ({
            Name: c.name,
            Email: c.email,
            mobile: c.phone,
            Resume: c.resume ? `${import.meta.env.VITE_API_BASE_URL}/${c.resume}` : "N/A",
            Date: dayjs(c.createdAt).format('DD MMM YYYY'),
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'DraftCandidates');
        XLSX.writeFile(wb, 'DraftCandidates.xlsx');
    };

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedData = filtered.slice((currentPage -1)*pageSize,currentPage*pageSize);
    
    return (
        <div className="p-6 bg-white rounded-xl shadow">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">Draft Candidates (Quick applied)</h2>
                <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                {data.length} candidates
                </span>
            </div>
            <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Export to Excel
            </button>
        </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className='relative max-w-sm'>
            <input
                type="text"
                placeholder="Search name or email"
                className="pl-10 pr-4 py-2 rounded-lg shadow-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
        </div>
        <div className="flex items-center gap-2">
            <input type="date" className="border p-2 rounded" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            <input type="date" className="border p-2 rounded" value={toDate} onChange={e => setToDate(e.target.value)} />
            <button
                onClick={() => {
                    setFromDate('');
                    setToDate('');
                }}
                className="text-md text-blue-600 hover:underline flex items-center gap-1"
                >
                <XCircle className="w-5 h-5" />
                Reset Dates
            </button>
        </div>
       
       
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase border-b">
                <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Mobile</th>
                    <th className="px-4 py-3">Education</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Resume</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {data.length > 0 ? (
                    paginatedData.map((c, idx) => (
                        <tr key={c._id} className="border-t">
                        <td className="px-4 py-2">{idx + 1}</td>
                        <td className="px-4 py-2">{c.name || '—'}</td>
                        <td className="px-4 py-2">{c.email}</td>
                        <td className="px-4 py-2">{c.phone}</td>
                        <td className="px-4 py-2">{c.education}</td>
                        <td className="px-4 py-2">
                            {dayjs(c.createdAt).format('DD MMM YYYY')}
                        </td>
                        <td className="px-4 py-2">
                            {c.resume ? (
                                <div className="flex items-center gap-2">
                                {/* File Icon with label */}
                                <div className="flex items-center gap-1 text-gray-700">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">Resume</span>
                                </div>

                                {/* Download icon button */}
                                <a
                                    href={`${import.meta.env.VITE_API_BASE_URL}/${c.resume}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Download Resume"
                                    download
                                >
                                    <Download className="h-5 w-5" />
                                </a>
                                </div>
                            ) : (
                                <span className="text-gray-400 italic">No resume</span>
                            )}
                        </td>
                        
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="6" className="text-center py-8 text-gray-500 italic">
                        No record found
                        </td>
                    </tr>
                    )}
            </tbody>
        </table>
      </div>

      {/* Pagination */}
       <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600 font-semibold">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
            </p>

            <div className="flex gap-2">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                    Prev
                </button>

                <span>Page {currentPage} of {totalPages}</span>

                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    </div>
    )
}

export default DraftApplications