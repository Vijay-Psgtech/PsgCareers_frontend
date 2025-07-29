import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import dayjs from 'dayjs';
import { useAuth } from '../../../Context/AuthContext';
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";
import { FaSearch } from 'react-icons/fa';
import Select from "react-select";

const AppliedCandidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const {auth} = useAuth();
    const [filtered, setFiltered] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    const [search, setSearch] = useState('');
    const [institutionOptions,setInstitutionOptions] = useState([]);
    const [institution, setInstitution] = useState(null);
    const [jobCategory, setJobCategory] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const jobCategoryOptions = ["Teaching", "Non Teaching"].map((jobCat)=>({
      label : jobCat,
      value : jobCat
    }));

    useEffect(() => {
        fetchUniqueCandidates();
        fetchInstitutions();
    }, []);

    useEffect(() => {
        filterData();
    }, [search, institution, jobCategory, fromDate, toDate, candidates]);

    const fetchInstitutions = async() => {
      try{
        const res = await axiosInstance.get('/api/dropDown/getInstitutions');
        const formattedOptions = res.data.map((inst)=>({
          label: inst.name,
          value: inst.name
        }));
        setInstitutionOptions(formattedOptions);
      } catch(err) {
        console.error("failed to fetch institutions",err);
      }
    }

    const fetchUniqueCandidates = async () => {
        try {
            const res = await axiosInstance.get('/api/reports/applied-candidates',{
                headers:{
                    Authorization: `Bearer ${auth.token}`,
                }
            });
            setCandidates(res.data.results || []);
        } catch (err) {
            console.error('Error fetching candidates', err);
        } finally {
            setLoading(false);
        }
    };

    const filterData = () => {
        let result = candidates;
       

        if (search) {
            result = result.filter(c =>
                (c.name && c.name.toLowerCase().includes(search.toLowerCase())) ||
                (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
            );
        }

        if (institution) {
            result = result.filter(c => 
                Array.isArray(c.institution) ? c.institution.includes(institution.value) : c.institution === institution.value
            );
        }

        if (jobCategory) {
            result = result.filter(c => c.jobCategory === jobCategory.value);
        }

        if (fromDate && toDate) {
            result = result.filter(c =>
                dayjs(c.latestAppliedDate).isAfter(dayjs(fromDate).subtract(1, 'day')) &&
                dayjs(c.latestAppliedDate).isBefore(dayjs(toDate).add(1, 'day'))
            );
        }

        setFiltered(result);
    };

    const exportToExcel = (data, fileName = "Applied_Candidates_Report.xlsx") => {
        const formattedData = data.map((candidate, index) => ({
            "S.No": index + 1,
            "Candidate ID": candidate._id,
            "Name": candidate.name,
            "Email": candidate.email,
            "Mobile": candidate.mobile,
            "Job Category": candidate.jobCategory,
            "Institution(s)": Array.isArray(candidate.institution)
            ? candidate.institution.join(", ")
            : candidate.institution || "",
            "Job Titles Applied": Array.isArray(candidate.jobTitles)
            ? candidate.jobTitles.join(", ")
            : "",
            "Total Applications": candidate.totalApplications,
            "Latest Applied Date": candidate.latestAppliedDate
            ? new Date(candidate.latestAppliedDate).toLocaleString()
            : "",
            "Resume": candidate.resume ? `${import.meta.env.VITE_API_BASE_URL}/${candidate.resume}` : "N/A",
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Applied Candidates");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(dataBlob, fileName);
    };


    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedData = filtered.slice((currentPage -1)*itemsPerPage,currentPage*itemsPerPage);

    return (
        <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Applied Candidates Report</h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
                <div className='relative max-w-sm'>
                    <input
                        type="text"
                        placeholder="Search by name or email"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-lg shadow-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                </div>
                <Select
                    name="institution"
                    options={institutionOptions}
                    value={institution}
                    onChange={setInstitution}
                    placeholder="All Institutions"
                    className="min-h-[40px] rounded-lg"
                    isClearable
                />
                <Select 
                    name="jobCategory"
                    options={jobCategoryOptions}
                    value={jobCategory}
                    onChange={setJobCategory}
                    placeholder="All Categories"
                    className="min-h-[40px]  rounded-lg" 
                    isClearable
                />
                <input
                    type="date"
                    value={fromDate}
                    onChange={e => setFromDate(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="date"
                    value={toDate}
                    onChange={e => setToDate(e.target.value)}
                    className="border p-2 rounded"
                />
                <button
                    onClick={()=>exportToExcel(filtered)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                Export to Excel
                </button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="overflow-auto rounded-lg border border-gray-200">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700 uppercase border-b">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3">Jobs Applied</th>
                                <th className="px-4 py-3">Latest Application</th>
                                <th className="px-4 py-3">Resume</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedData.map((c, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td className="px-4 py-2">{c.name}</td>
                                    <td className="px-4 py-2">{c.email}</td>
                                    <td className="px-4 py-2">{c.mobile}</td>
                                    <td className="px-4 py-2">
                                        <div className="relative group cursor-pointer text-blue-600 underline">
                                        {c.totalApplications}
                                        <div className="absolute hidden group-hover:block bg-white border shadow-md p-2 rounded text-sm z-10 w-60">
                                            <strong>Jobs:</strong>
                                            <ul className="list-disc ml-4">
                                            {c.jobTitles.map((title, idx) => (
                                                <li key={idx}>{title}</li>
                                            ))}
                                            </ul>
                                        </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        {c.latestAppliedDate
                                        ? dayjs(c.latestAppliedDate).format('DD MMM YYYY')
                                        : 'N/A'}
                                    </td>
                                    <td className="px-4 py-2">
                                        {c.resume ? (
                                            <a
                                            href={`${import.meta.env.VITE_API_BASE_URL}/${c.resume}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                            download
                                            >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5m0 0l5-5m-5 5V4" />
                                            </svg>
                                            Download
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 italic">No resume</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-sm text-gray-600 font-semibold">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
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
            )}
        </div>
    );
};

export default AppliedCandidates;
