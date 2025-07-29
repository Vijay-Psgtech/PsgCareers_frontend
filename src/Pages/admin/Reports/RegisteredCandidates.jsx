import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { Download, Search } from 'lucide-react';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import Select from "react-select";
import { FaSearch } from 'react-icons/fa';

const RegisteredCandidates = () => {
    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [jobCategory, setJobCategory] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    const jobCategoryOptions = ["Teaching", "Non Teaching"].map((jobCat)=>({
      label : jobCat,
      value : jobCat
    }));

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterData();
    }, [search, jobCategory, fromDate, toDate, data]);

    const fetchData = async () => {
        try {
        const res = await axiosInstance.get('/api/reports/registered-not-applied');
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

        if (jobCategory) {
            result = result.filter(c => c.jobCategory === jobCategory.value);
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
            Name: c.first_name,
            Email: c.email,
            mobile: c.mobile,
            JobCategory: c.jobCategory,
            RegisteredDate: dayjs(c.createdAt).format('DD MMM YYYY'),
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'RegisteredCandidates');
        XLSX.writeFile(wb, 'RegisteredCandidates.xlsx');
    };

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedData = filtered.slice((currentPage -1)*pageSize,currentPage*pageSize);

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Registered Candidates (Not Applied)</h2>

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
        
        <Select 
            name="jobCategory"
            options={jobCategoryOptions}
            value={jobCategory}
            onChange={setJobCategory}
            placeholder="All Categories"
            className="min-h-[40px]  rounded-lg" 
            isClearable
        />
        <input type="date" className="border p-2 rounded" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        <input type="date" className="border p-2 rounded" value={toDate} onChange={e => setToDate(e.target.value)} />
        <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Export to Excel
        </button>
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
                    <th className="px-4 py-3">Job Category</th>
                    <th className="px-4 py-3">Registered</th>
                    <th className="px-4 py-3">Resume</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {paginatedData.map((c, idx) => (
                <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="px-4 py-3">{c.first_name} {c.last_name || ''}</td>
                    <td className="px-4 py-3">{c.email}</td>
                    <td className="px-4 py-3">{c.mobile}</td>
                    <td className="px-4 py-3">{c.jobCategory}</td>
                    <td className="px-4 py-3">{dayjs(c.createdAt).format('DD MMM YYYY')}</td>
                    <td className="px-4 py-3">
                        {c.resume ? (
                            <a href={c.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                            <Download size={16} /> Download
                            </a>
                        ) : (
                            'N/A'
                        )}
                    </td>
                </tr>
                ))}
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
  );
};

export default RegisteredCandidates;
