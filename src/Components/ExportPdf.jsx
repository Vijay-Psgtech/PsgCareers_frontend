import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDFDocument } from 'pdf-lib';
import { formatDate } from '../utils/dateFormat';

export const exportCandidateDetailsToPDF = async (personal, education, work, research, otherData, jobCategory) => {
  const doc = new jsPDF();
  let y = 15;

  const checkPageBreak = () => {
    if (y >= 270) {
      doc.addPage();
      y = 15;
    }
  };

  const addSectionHeader = (title) => {
    checkPageBreak();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(title, 14, y);
    y += 8;
  };

  // Profile Image at top right
  if (personal.photoUrl) {
    try {
      const imgUrl = `${import.meta.env.VITE_API_BASE_URL}/Uploads/${personal.photoUrl}`;
      const imgBlob = await fetch(imgUrl).then(res => res.blob());
      const reader = new FileReader();
      const base64 = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imgBlob);
      });
      doc.addImage(base64, 'JPEG', 150, 10, 40, 40); // Adjust position/size as needed
    } catch (err) {
      console.warn('Failed to load profile image:', err);
    }
  }

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
    doc.setFont('helvetica', 'normal');
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
      headStyles: { fillColor: [0, 123, 255] },
      margin: { left: 14, right: 14 },
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // Education
  addSectionHeader('Education Details');
  autoTable(doc, {
    startY: y,
    head: [['Qualification', 'Degree', 'Specialization', 'Percentage', 'Year']],
    body: education.educationList?.map(e => [e.qualification, e.degree, e.specialization, e.percentage, e.year]) || [],
    margin: { left: 14, right: 14 },
    headStyles: { fillColor: [0, 123, 255] }
  });
  y = doc.lastAutoTable.finalY + 10;
  

  // Work Experience - Industry
  if (work.industry?.length) {
    addSectionHeader('Work Experience - Industry');
    autoTable(doc, {
      startY: y,
      head: [['Designation', 'Institution', 'Specialization', 'From', 'To']],
      body: work.industry?.map(w => [w.designation, w.institution, w.specialization, formatDate(w.from), formatDate(w.to)]) || [],
      margin: { left: 14, right: 14 },
      headStyles: { fillColor: [0, 123, 255] }
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // Work Experience - teaching
  if(work.teaching?.length){
    addSectionHeader('Work Experience - teaching');
    autoTable(doc,{
      startY: y,
      head: [['Designation', 'Institution', 'Specialization', 'From', 'To']],
      body: work.teaching?.map(t => [t.designation, t.institution, t.specialization, formatDate(t.from), formatDate(t.to)]) || [],
      margin: { left: 14, right: 14 },
      headStyles: { fillColor: [0, 123, 255] }
    });
    y= doc.lastAutoTable.finalY + 10;
  }

  

  // Research
  if (!research.message && jobCategory == 'Teaching') {
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

    const addResearchSection = (title, items, keys) => {
      if (!items?.length) return;
      y += 8;
      checkPageBreak();
      doc.setFont('helvetica', 'bold');
      doc.text(title, 14, y);
      y += 4;
      doc.setFont('helvetica', 'normal');
      autoTable(doc, {
        startY: y,
        head: [keys.map(k => k[0])],
        body: items.map(item => keys.map(([_, key]) => item[key] || '')),
        margin: { left: 14, right: 14 },
        headStyles: { fillColor: [0, 123, 255] },
      });
      y = doc.lastAutoTable.finalY + 8;
    };
    addResearchSection('Books', research.books, [['Title', 'title'], ['Publication', 'publication'], ['Author', 'author'], ['ISBN', 'isbn'], ['Year', 'year']]);
    addResearchSection('Chapters', research.chapters, [['Title', 'title'], ['Publiction', 'publication'], ['Author', 'author'], ['ISBN', 'isbn'], ['Year', 'year']]);
    addResearchSection('Journals', research.journals, [['Title', 'title'], ['Publication', 'publication'], ['Author', 'author'], ['ISBN', 'isbn'], ['Year', 'year']]);
    addResearchSection('Projects', research.projects, [['Title', 'title'], ['Agency', 'agency'], ['Pi', 'pi'], ['Duration', 'duration']]);
    addResearchSection('Conferences', research.conferences, [['Title', 'title'], ['Conference', 'conference'], ['Institution', 'institution']]);
    addResearchSection('Patents', research.patents, [['Authors', 'authors'], ['Title', 'title'], ['Status', 'status']]);
    addResearchSection('Post Doctoral Fellowship (PDF)', research.pdfs, [['Type', 'type'], ['Institute', 'institute']]);
    addResearchSection('Vists', research.others, [['Country', 'country'], ['Purpose', 'purpose'], ['Funded', 'funded']]);
  }

  // Other Details
  addSectionHeader('Other Details');
  const otherFields = [
    ['Expected Pay', otherData.expectedPay],
    ['Last Pay', otherData.lastPay],
    ['Joining Time', otherData.joiningTime],
    ['Attended PSG Interview', otherData.attendedPSGInterview],
    ['Relatives at PSG', otherData.relativesAtPSG],
  ];
  otherFields.forEach(([label, value]) => {
    doc.text(`${label}: ${value || 'N/A'}`, 14, y);
    y += 6;
  });

  // References vertically
  const addReferenceTable = (ref, title) => {
    if (!ref) return;
    addSectionHeader(title);
    autoTable(doc, {
      startY: y,
      head: [['Field', 'Value']],
      body: [
        ['Name', ref.name || 'N/A'],
        ['Address', ref.address || 'N/A'],
        ['Designation', ref.designation || 'N/A'],
        ['Mobile', ref.mobile || 'N/A'],
        ['Email', ref.email || 'N/A']
      ],
      margin: { left: 14, right: 14 },
      headStyles: { fillColor: [0, 123, 255] }
    });
    y = doc.lastAutoTable.finalY + 10;
  };

  addReferenceTable(otherData.reference1, 'Reference 1');
  addReferenceTable(otherData.reference2, 'Reference 2');

  // Step 1: Generate jsPDF and convert to arrayBuffer
  const mainPdfBytes = doc.output('arraybuffer');
  const mergedPdf = await PDFDocument.create();
  const mainDoc = await PDFDocument.load(mainPdfBytes);
  const mainPages = await mergedPdf.copyPages(mainDoc, mainDoc.getPageIndices());
  mainPages.forEach(p => mergedPdf.addPage(p));

  // Step 2: Append Resume PDF if available
  if (personal.resumeUrl?.endsWith('.pdf')) {
    try {
      const resumeUrl = `${import.meta.env.VITE_API_BASE_URL}/Uploads/${personal.resumeUrl}`;
      const resumePdfBytes = await fetch(resumeUrl).then(res => res.arrayBuffer());
      const resumeDoc = await PDFDocument.load(resumePdfBytes);
      const resumePages = await mergedPdf.copyPages(resumeDoc, resumeDoc.getPageIndices());
      resumePages.forEach(p => mergedPdf.addPage(p));
    } catch (err) {
      console.warn('Failed to fetch resume PDF:', err);
    }
  }

  // Step 3: Append Certificate PDFs
  const educationDet = education?.educationList || [];
  for(const edu of educationDet) {
    if(edu?.certificate?.endsWith('.pdf')) {
      try {
        const certUrl = `${import.meta.env.VITE_API_BASE_URL}/Uploads/${edu.certificate}`;
        const certBytes = await fetch(certUrl).then(res => res.arrayBuffer());
        const certDoc = await PDFDocument.load(certBytes);
        const certPages = await mergedPdf.copyPages(certDoc, certDoc.getPageIndices());
        certPages.forEach(p => mergedPdf.addPage(p));
      } catch (err) {
        console.warn('Failed to fetch Education certificate PDF:', err);
      }
    }
  }

  
  const industryJobs = work?.industry || [];
  for (const job of industryJobs) {
    if (job?.certificate?.endsWith('.pdf')) {
      try {
        const certUrl = `${import.meta.env.VITE_API_BASE_URL}/Uploads/${job.certificate}`;
        const certBytes = await fetch(certUrl).then(res => res.arrayBuffer());
        const certDoc = await PDFDocument.load(certBytes);
        const certPages = await mergedPdf.copyPages(certDoc, certDoc.getPageIndices());
        certPages.forEach(p => mergedPdf.addPage(p));
      } catch (err) {
        console.warn('Failed to fetch Work Experience certificate PDF:', err);
      }
    }
  }

  const teachingJobs = work?.teaching || [];
  for (const job of teachingJobs){
    if(job?.certificate?.endsWith('.pdf')) {
      try{
        const certUrl = `${import.meta.env.VITE_API_BASE_URL}/Uploads/${job.certificate}`;
        const certBytes = await fetch(certUrl).then(res => res.arrayBuffer());
        const certDoc = await PDFDocument.load(certBytes);
        const certPages = await mergedPdf.copyPages(certDoc, certDoc.getPageIndices());
        certPages.forEach(p => mergedPdf.addPage(p));
      } catch (err) {
        console.warn('Failed to fetch Work Experience certificate PDF:', err);
      }
    }
  }

  // Step 4: Save merged PDF
  const finalPdfBytes = await mergedPdf.save();
  const blob = new Blob([finalPdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${personal.fullName || 'Candidate'}_Profile.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
