import React, { useEffect, useState } from 'react';
import { useParams,useLocation } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import CandidateProfileTabs from '../../../Components/Cards/candidateProfileTab';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaFilePdf  } from "react-icons/fa";
import { formatDate } from '../../../utils/dateFormat';


export default function CandidateDetails() {
  const { userId, jobId } = useParams();
  const location = useLocation();
  const jobCategory = location.state?.jobCategory;
  const [personal, setPersonal] = useState({});
  const [education, setEducation] = useState({});
  const [work, setWork] = useState({});
  const [research, setResearch] = useState({});
  const [otherData, setOtherData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllDetails = async () => {
      try {
        const [personalRes, eduRes, workRes, otherRes] = await Promise.all([
          axiosInstance.get(`/api/personalDetails/${userId}`),
          axiosInstance.get('/api/education/get', { params: { userId } }),
          axiosInstance.get('/api/workExperience/get', { params: { userId } }),
          axiosInstance.get(`/api/otherDetails/${userId}`)
        ]);

        setPersonal(personalRes.data || {});
        setEducation(eduRes.data || {});
        setWork(workRes.data || {});
        setOtherData(otherRes.data || {});

        if(jobCategory === 'Teaching') {
         const researchRes = await axiosInstance.get(`/api/research/${userId}`);
         setResearch(researchRes.data || {});
        }
        // Update stage to "Viewed"
        await axiosInstance.put('/api/applications/updateStatus', {
          userId,
          jobId,
          status: 'Viewed',
        });

      } catch (err) {
        console.error('Error fetching candidate details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDetails();
  }, [userId, jobId]);


  // Export PDF function 
  const exportCandidateDetailsToPDF = async () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Candidate Profile', 14, y);

    // Load profile picture if available
    const addImageAndRender = async () => {
      if (personal.photoUrl) {
        try {
          const imageUrl = `${import.meta.env.VITE_API_BASE_URL}/Uploads/${personal.photoUrl}`;
          const blob = await fetch(imageUrl).then(res => res.blob());
          const reader = new FileReader();
          reader.onload = () => {
            doc.addImage(reader.result, 'JPEG', 160, 10, 35, 35);
            renderContent();
          };
          reader.readAsDataURL(blob);
          return;
        } catch (err) {
          console.warn("Failed to load profile image", err);
        }
      }
      renderContent(); // fallback if no image
    };

    const renderContent = () => {
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      let y = 30;

      const checkPageBreak = () => {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
      };

      const addSectionHeader = (title) => {
        y += 10;
        checkPageBreak();
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 14, y);
        y += 6;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
      };

      // Personal Details
      addSectionHeader('Personal Details');
      const personalData = [
        ['Full Name', personal.fullName],
        ['Gender', personal.gender],
        ['DOB', formatDate(personal.dob)],
        ['Email', personal.email],
        ['Mobile', personal.mobile],
        ['Category', personal.category],
        ['Community', personal.community],
        ['Aadhar', personal.aadhar],
        ['PAN', personal.pan],
        ['Mother Tongue', personal.motherTongue],
        ['Marital Status', personal.maritalStatus],
        ['Physically Challenged', personal.physicallyChallenged],
        ['Communication Address', personal.communicationAddress],
        ['Permanent Address', personal.permanentAddress]
      ];
      personalData.forEach(([key, val]) => {
        checkPageBreak();
        doc.text(`${key}: ${val || 'N/A'}`, 14, y);
        y += 6;
      });

      // Languages Known
      if (personal.languagesKnown?.length) {
        addSectionHeader('Languages Known');
        autoTable(doc, {
          startY: y,
          head: [['Language', 'Read', 'Write', 'Speak']],
          body: personal.languagesKnown.map(l => [
            l.language,
            l.read ? 'Yes' : 'No',
            l.write ? 'Yes' : 'No',
            l.speak ? 'Yes' : 'No',
          ]),
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185] },
          margin: { left: 14, right: 14 },
        });
        y = doc.lastAutoTable.finalY + 10;
      }

      // Education
      if (education.educationList?.length) {
        addSectionHeader('Education Details');
        autoTable(doc, {
          startY: y,
          head: [['S.no', 'Course', 'Degree/Major Subject', 'School/university', 'Year of completion/Graduation', '% Marks', 'Course type']],
          body: education.educationList.map((edu,idx)=> [
            idx+1,
            edu.qualification,
            edu.degree,
            edu.school,
            edu.year,
            edu.percentage,
            edu.type
          ]),
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185] },
          margin: { left: 14, right: 14 },
        })
        y = doc.lastAutoTable.finalY + 10;

        if (education.achievements) {
          doc.text(`Special Achievements: ${education.achievements}`, 14, y);
          y += 6;
        }
      }

      // Work - industry
      if (work.industry?.length) {
        addSectionHeader('Work Experience - Industry');
        autoTable(doc,{
          startY: y,
          head: [['S.no', 'Name of Institution', 'Designation', 'from date', 'To date', 'Whether certificate avaible yes/No.']],
          body: work.industry.map((ind,idx)=>[
            idx+1,
            ind.institution,
            ind.designation,
            formatDate(ind.from),
            formatDate(ind.to),
            ind.certificate !== 'No' ? 'Yes' : ind.certificate
          ]),
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185] },
          margin: { left: 14, right: 14 },
        })
        y = doc.lastAutoTable.finalY + 10;
      }

      // work - teaching
      if(work.teaching?.length) {
        addSectionHeader('Work Experience - Teaching');
        autoTable(doc,{
          startY: y,
          head: [['S.no', 'Name of Institution', 'Designation', 'from date', 'To date', 'Whether certificate avaible yes/No.']],
          body: work.teaching.map((teach,idx)=>[
            idx+1,
            teach.institution,
            teach.designation,
            formatDate(teach.from),
            formatDate(teach.to),
            teach.certificate !== 'No' ? 'Yes' : teach.certificate
          ]),
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185] },
          margin: { left: 14, right: 14 },
        })
        y = doc.lastAutoTable.finalY + 10;
      }


      // Research
      if (!research.message && jobCategory === 'Teaching') {
        addSectionHeader('Research Contributions');

        const identifiers = [
          ['Scopus ID', research.scopusId],
          ['Sci', research.sci],
          ['Ugc', research.ugc],
          ['hGoogle', research.hGoogle],
          ['hScopus', research.hScopus],
          ['Other', research.other]
        ];

        identifiers.forEach(([label, val]) => {
          checkPageBreak();
          doc.text(`${label}: ${val || 'N/A'}`, 14, y);
          y += 6;
        });

        const addSubSection = (title, items, columns) => {
          if (items?.length) {
            y += 8;
            checkPageBreak();
            doc.setFont('helvetica', 'bold');
            doc.text(title, 14, y);
            y += 4;
            doc.setFont('helvetica', 'normal');
            autoTable(doc, {
              startY: y,
              head: [columns],
              body: items.map(item => columns.map(col => item[col] || '')),
              theme: 'grid',
              margin: { left: 14, right: 14 },
              headStyles: { fillColor: [41, 128, 185] },
            });
            y = doc.lastAutoTable.finalY + 6;
          }
        };

        // Add each subsection table
        addSubSection('Books Published', research.books, ['title', 'publication', 'author', 'isbn', 'edition', 'year']);
        addSubSection('Chapters', research.chapters, ['title', 'publication', 'author', 'isbn', 'edition', 'year']);
        addSubSection('Journals Published', research.journals, ['title', 'publication', 'author', 'isbn', 'year']);
        addSubSection('Projects', research.projects, ['title', 'agency', 'pi', 'duration']);
        addSubSection('Patents', research.patents, ['authors', 'title', 'status']);
        addSubSection('Post Doctoral Fellowship (PDF)', research.pdfs, ['type', 'institute']);
        addSubSection('Consultancy Work', research.consultancy, ['title', 'organization', 'scope', 'duration', 'amount']);
        addSubSection('Paper Presentation & Conferences', research.conferences, ['title', 'conference', 'type', 'institution', 'conferenceDate']);
        addSubSection('Vists', research.others, ['country', 'purpose', 'funded']);
        
        
      }

      // Other
      if (otherData) {
        addSectionHeader('Other Details');
        const other = otherData;
        const otherFields = [
          ['Expected Pay', other.expectedPay],
          ['Last Pay', other.lastPay],
          ['Joining Time', other.joiningTime],
          ['Attended PSG Interview', other.attendedPSGInterview],
          ['Relatives at PSG', other.relativesAtPSG],
        ];
        otherFields.forEach(([key, val]) => {
          checkPageBreak();
          doc.text(`${key}: ${val || 'N/A'}`, 14, y);
          y += 6;
        });

        if (otherData?.reference1 || otherData?.reference2) {
          addSectionHeader('References');

          autoTable(doc, {
            startY: y,
            head: [['Field', 'Reference 1', 'Reference 2']],
            body: [
              ['Name', otherData.reference1?.name || 'N/A', otherData.reference2?.name || 'N/A'],
              ['Address', otherData.reference1?.address || 'N/A', otherData.reference2?.address || 'N/A'],
              ['Designation', otherData.reference1?.designation || 'N/A', otherData.reference2?.designation || 'N/A'],
              ['Mobile', otherData.reference1?.mobile || 'N/A', otherData.reference2?.mobile || 'N/A'],
              ['Email', otherData.reference1?.email || 'N/A', otherData.reference2?.email || 'N/A']
            ],
            theme: 'grid',
            margin: { left: 14, right: 14 },
            headStyles: { fillColor: [0, 123, 255] },
          });

          y = doc.lastAutoTable.finalY + 10;
        }
      }

      // Save PDF directly
      const filename = `${personal.fullName || 'Candidate'}_Profile.pdf`;
      doc.save(filename);
    };

    // Start generation
    await addImageAndRender();
  };


  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      
      <div className='flex justify-between items-center'>
        <h1 className="text-2xl font-bold  mb-4">Candidate Details</h1>
        <div className='flex-end'>
          <button 
            onClick={exportCandidateDetailsToPDF} 
            className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-700 transition"
          >
            <FaFilePdf className='text-md'/>Export PDF
          </button>
        </div>
      </div>
        

      <CandidateProfileTabs
        personal={personal}
        education={education}
        experience={work}
        research={research}
        otherDetails={otherData}
        jobCategory={jobCategory}
      />
    </div>
  );
}
