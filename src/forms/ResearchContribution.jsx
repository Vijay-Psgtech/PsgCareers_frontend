// ✅ Fully Updated ResearchContribution Component
// 🧩 Includes: All 10 sections with dynamic forms
// 🔁 Uses Minor/Major for Projects (replacing National/International logic)
// 📦 Dynamic add/remove for each section, Tailwind styling

import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@radix-ui/react-accordion';
import { useAuth } from '../Context/AuthContext';
import { Trash2, Plus } from 'lucide-react';

export default function ResearchContribution({ updateFormData, jobId }) {
  const { auth } = useAuth();
  const userId = auth?.userId;

  const initialForm = {
    sci: '', scopus: '', ugc: '', other: '',
    scopusId: '', hGoogle: '', hScopus: '',
    minorProjects: '', majorProjects: '',
    appliedPatents: '', publishedPatents: '', grantedPatents: '',
    booksNational: '', booksInternational: '',
    chaptersNational: '', chaptersInternational: '',
    journalsNational: '', journalsInternational: '',
    books: [], chapters: [], journals: [], projects: [],
    patents: [], pdfs: [], consultancy: [], conferences: [], visits: []
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!userId || !jobId) return;
    axiosInstance.get(`/api/research/${userId}?jobId=${jobId}`)
      .then(res => {
        if (res.data) setForm({ ...initialForm, ...res.data });
      })
      .catch(console.error);
  }, [userId, jobId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDynamicChange = (section, index, field, value) => {
    const updated = [...form[section]];
    updated[index][field] = value;
    setForm(prev => ({ ...prev, [section]: updated }));
  };

  const addEntry = (section, template) => {
    setForm(prev => ({ ...prev, [section]: [...(prev[section] || []), { ...template }] }));
  };

  const removeEntry = (section, index) => {
    const updated = [...form[section]];
    updated.splice(index, 1);
    setForm(prev => ({ ...prev, [section]: updated }));
  };

  const renderNISection = (section, nationalKey, internationalKey, fields, label, labelA = 'National', labelB = 'International') => {
    const national = parseInt(form[nationalKey]) || 0;
    const international = parseInt(form[internationalKey]) || 0;
    const total = national + international;

    useEffect(() => {
      const list = [...(form[section] || [])];
      while (list.length < total) list.push(fields.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {}));
      if (list.length > total) list.length = total;
      setForm(prev => ({ ...prev, [section]: list }));
    }, [national, international]);

    return (
      <AccordionItem value={section} className="border rounded p-4 mb-2">
        <AccordionTrigger className="text-lg font-semibold">{label}</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-semibold">{labelA}</label>
              <input
                type="number"
                name={nationalKey}
                value={form[nationalKey] || ''}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">{labelB}</label>
              <input
                type="number"
                name={internationalKey}
                value={form[internationalKey] || ''}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
          </div>
          {(form[section] || []).map((entry, idx) => {
            const isNational = idx < national;
            const entryLabel = isNational ? `${labelA} Entry ${idx + 1}` : `${labelB} Entry ${idx - national + 1}`;
            return (
              <div key={idx} className="mb-6 border p-4 rounded bg-gray-50">
                <h4 className="text-sm font-medium text-indigo-700 mb-2">{entryLabel}</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {fields.map(f => (
                    <div key={f.name}>
                      <label className="text-sm font-semibold block mb-1">{f.label}</label>
                      <input
                        type="text"
                        value={entry[f.name] || ''}
                        onChange={e => handleDynamicChange(section, idx, f.name, e.target.value)}
                        className="border p-2 rounded w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    );
  };

  const renderDynamic = (section, label, fields) => (
    <AccordionItem value={section} className="border rounded p-4 mb-2">
      <AccordionTrigger className="text-lg font-semibold">{label}</AccordionTrigger>
      <AccordionContent>
        {form[section]?.map((entry, i) => (
          <div key={i} className="grid md:grid-cols-3 gap-4 mb-4 relative">
            {fields.map(f => (
              <div key={f.name}>
                <label className="text-sm font-semibold block mb-1">{f.label}</label>
                {f.type === 'select' ? (
                  <select
                    value={entry[f.name] || ''}
                    onChange={e => handleDynamicChange(section, i, f.name, e.target.value)}
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Select</option>
                    {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type={f.type || 'text'}
                    value={entry[f.name] || ''}
                    onChange={e => handleDynamicChange(section, i, f.name, e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => removeEntry(section, i)}
              className="absolute top-0 right-0 text-red-600 hover:text-red-800"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addEntry(section, fields.reduce((a, f) => ({ ...a, [f.name]: '' }), {}))}
          className="text-blue-700 hover:text-blue-900 flex items-center gap-1 mt-2"
        >
          <Plus size={16} /> Add {label.split(' ')[0]} Entry
        </button>
      </AccordionContent>
    </AccordionItem>
  );

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/api/research/${userId}`, { ...form, userId, jobId });
      updateFormData?.(form);
      document.getElementById("work-experience")?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error("Submit failed", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded-xl space-y-6">
      <h2 className="text-2xl font-bold text-blue-800">Research Contribution</h2>
      <Accordion type="multiple">
        {/* 1. Basic Metrics */}
        <AccordionItem value="basic" className="border rounded p-4 mb-2">
          <AccordionTrigger className="text-lg font-semibold">Paper Published - Basic Metrics</AccordionTrigger>
          <AccordionContent>
            <div className="grid md:grid-cols-3 gap-4">
              {['sci', 'scopus', 'ugc', 'other', 'scopusId', 'hGoogle', 'hScopus'].map(f => (
                <div key={f}>
                  <label className="text-sm font-semibold block mb-1">{f}</label>
                  <input name={f} value={form[f]} onChange={handleChange} className="border p-2 rounded w-full" />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 2-4: Books / Chapters / Journals */}
        {renderNISection('books', 'booksNational', 'booksInternational', [
          { name: 'title', label: 'Title' },
          { name: 'publication', label: 'Publication' },
          { name: 'author', label: 'Author Name' },
          { name: 'isbn', label: 'Book ISBN/DOI' },
          { name: 'edition', label: 'Edition' },
          { name: 'year', label: 'Year of Publication' },
        ], 'Books Published / Edited')}

        {renderNISection('chapters', 'chaptersNational', 'chaptersInternational', [
          { name: 'title', label: 'Title' },
          { name: 'publication', label: 'Publication' },
          { name: 'author', label: 'Author Name' },
          { name: 'isbn', label: 'Chapter ISBN/DOI' },
          { name: 'edition', label: 'Edition' },
          { name: 'year', label: 'Year of Publication' },
        ], 'Chapters Published / Edited')}

        {renderNISection('journals', 'journalsNational', 'journalsInternational', [
          { name: 'title', label: 'Title' },
          { name: 'publication', label: 'Publication' },
          { name: 'author', label: 'Author Name' },
          { name: 'isbn', label: 'Journal ISBN/DOI' },
          { name: 'edition', label: 'Edition' },
          { name: 'year', label: 'Year of Publication' },
        ], 'Journals')}

        {/* 5. Projects using Minor/Major logic */}
        {renderNISection('projects', 'minorProjects', 'majorProjects', [
          { name: 'pi', label: 'PI / CO-PI' },
          { name: 'title', label: 'Title' },
          { name: 'agency', label: 'Funding Agency' },
          { name: 'status', label: 'Status' },
          { name: 'duration', label: 'Duration (YYYY - YYYY)' },
        ], 'Projects', 'Minor Projects', 'Major Projects')}

        {/* 6-10 Remaining Sections */}
        {renderDynamic('patents', 'Patents', [
          { name: 'authors', label: 'Authors (In Order)' },
          { name: 'title', label: 'Title with ID' },
          { name: 'status', label: 'Status', type: 'select', options: ['Applied', 'Published', 'Granted'] },
        ])}

        {renderDynamic('pdfs', 'Post Doctoral Fellowship (PDF)', [
          { name: 'type', label: 'National / International', type: 'select', options: ['National', 'International'] },
          { name: 'institute', label: 'Institute / Country' },
        ])}

        {renderDynamic('consultancy', 'Consultancy Undertaken', [
          { name: 'title', label: 'Title – Author – Order – First / The Number' },
          { name: 'organization', label: 'Organization / Area / Company' },
          { name: 'scope', label: 'Scope' },
          { name: 'duration', label: 'Duration' },
          { name: 'amount', label: 'Amount Received', type: 'number' },
        ])}

        {renderDynamic('conferences', 'Paper Presentation & Conferences', [
          { name: 'title', label: 'Title of the Paper' },
          { name: 'conference', label: 'Title of Conference / FDP' },
          { name: 'type', label: 'Conference / FDP / MDP' },
          { name: 'institution', label: 'Organizing Institution' },
          { name: 'conferenceDate', label: 'Conference Date' },
          { name: 'publishedDate', label: 'Published Date' },
        ])}

        {renderDynamic('visits', 'Foreign Visit', [
          { name: 'country', label: 'Country Visited' },
          { name: 'purpose', label: 'Nature and Purpose' },
          { name: 'funded', label: 'Funded By' },
        ])}
      </Accordion>

      <div className="text-right">
        <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800">
          Save & Continue
        </button>
      </div>
    </form>
  );
}




  