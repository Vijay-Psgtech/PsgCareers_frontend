import React, { useState } from 'react';

const defaultEntry = {
  projects: [],
  patents: [],
  pdfs: [],
  consultancy: [],
  conferences: [],
  visits: [],
};

export default function ResearchContribution({ data = {}, updateFormData }) {
  const [form, setForm] = useState({
    sci: '', scopus: '', ugc: '', other: '',
    scopusId: '', hGoogle: '', hScopus: '',
    booksPublishedNational: '', booksPublishedInternational: '',
    booksEditedNational: '', booksEditedInternational: '',
    chaptersPublishedNational: '', chaptersPublishedInternational: '',
    chaptersEditedNational: '', chaptersEditedInternational: '',
    minorProjects: '', majorProjects: '',
    file: null,
    ...defaultEntry,
    ...data,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleDynamicChange = (key, index, field, value) => {
    const updated = [...form[key]];
    updated[index][field] = value;
    setForm(prev => ({ ...prev, [key]: updated }));
  };

  const addEntry = (key, fields) => {
    const entry = fields.reduce((acc, f) => ({ ...acc, [f]: '' }), {});
    setForm(prev => ({ ...prev, [key]: [...prev[key], entry] }));
  };

  const removeEntry = (key, index) => {
    const updated = [...form[key]];
    updated.splice(index, 1);
    setForm(prev => ({ ...prev, [key]: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData(form);
  };

  const input = "border p-2 rounded w-full";

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8 space-y-8">
      <h3 className="text-3xl font-bold text-blue-800 border-b pb-2">Research Contribution</h3>

      {/* Papers Published */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['sci', 'scopus', 'ugc', 'other'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
            <input name={field} type="number" min="0" className={input} value={form[field]} onChange={handleChange} placeholder="0" />
          </div>
        ))}
      </div>

      {/* Indexing & IDs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input name="scopusId" className={input} value={form.scopusId} onChange={handleChange} placeholder="Scopus ID" />
        <input name="hGoogle" className={input} value={form.hGoogle} onChange={handleChange} placeholder="H-Index (Google Scholar)" />
        <input name="hScopus" className={input} value={form.hScopus} onChange={handleChange} placeholder="H-Index (Scopus)" />
      </div>

      {/* Books & Chapters */}
      {[
        ['booksPublishedNational', 'booksPublishedInternational', 'Books Published'],
        ['booksEditedNational', 'booksEditedInternational', 'Books Edited'],
        ['chaptersPublishedNational', 'chaptersPublishedInternational', 'Chapters Published'],
        ['chaptersEditedNational', 'chaptersEditedInternational', 'Chapters Edited']
      ].map(([nat, intl, label]) => (
        <div key={label}>
          <label className="block font-semibold">{label}</label>
          <div className="grid grid-cols-2 gap-4">
            <input name={nat} value={form[nat]} onChange={handleChange} className={input} placeholder="National" />
            <input name={intl} value={form[intl]} onChange={handleChange} className={input} placeholder="International" />
          </div>
        </div>
      ))}

      {/* File Upload */}
      <div>
        <label className="block text-sm mb-1">Upload publication file (PDF / DOC)</label>
        <input type="file" name="file" onChange={handleChange} className="block" />
      </div>

      {/* Projects */}
      <div>
        <label className="block text-lg font-semibold mb-2">Projects</label>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input name="minorProjects" value={form.minorProjects} onChange={handleChange} className={input} placeholder="Minor Projects" />
          <input name="majorProjects" value={form.majorProjects} onChange={handleChange} className={input} placeholder="Major Projects" />
        </div>
        {form.projects.map((p, i) => (
          <div key={i} className="grid md:grid-cols-5 gap-2 mb-2">
            <input placeholder="PI/CO-PI" value={p.pi || ''} onChange={e => handleDynamicChange('projects', i, 'pi', e.target.value)} className={input} />
            <input placeholder="Title" value={p.title || ''} onChange={e => handleDynamicChange('projects', i, 'title', e.target.value)} className={input} />
            <input placeholder="Agency" value={p.agency || ''} onChange={e => handleDynamicChange('projects', i, 'agency', e.target.value)} className={input} />
            <input placeholder="Status" value={p.status || ''} onChange={e => handleDynamicChange('projects', i, 'status', e.target.value)} className={input} />
            <input placeholder="Duration (e.g. 2020–2023)" value={p.duration || ''} onChange={e => handleDynamicChange('projects', i, 'duration', e.target.value)} className={input} />
            <button type="button" className="text-red-600" onClick={() => removeEntry('projects', i)}>Remove</button>
          </div>
        ))}
        <button type="button" className="text-blue-600" onClick={() => addEntry('projects', ['pi', 'title', 'agency', 'status', 'duration'])}>+ Add Project</button>
      </div>

      {/* Repeatable Dynamic Sections for: Patents, PDFs, Consultancy, Conferences, Visits */}
      {[
        ['patents', ['authorship', 'title', 'status'], 'Patent'],
        ['pdfs', ['type', 'institute'], 'PDF'],
        ['consultancy', ['title', 'organization', 'scope', 'duration', 'amount'], 'Consultancy'],
        ['conferences', ['title', 'event', 'organizer', 'date'], 'Conference'],
        ['visits', ['country', 'purpose', 'funded'], 'Foreign Visit'],
      ].map(([key, fields, label]) => (
        <div key={key}>
          <label className="block text-lg font-semibold mb-2">{label}</label>
          {form[key].map((entry, i) => (
            <div key={i} className="grid md:grid-cols-3 gap-2 mb-2">
              {fields.map(field => (
                <input
                  key={field}
                  placeholder={field}
                  value={entry[field] || ''}
                  onChange={e => handleDynamicChange(key, i, field, e.target.value)}
                  className={input}
                />
              ))}
              <button type="button" className="text-red-600" onClick={() => removeEntry(key, i)}>Remove</button>
            </div>
          ))}
          <button type="button" className="text-blue-600" onClick={() => addEntry(key, fields)}>+ Add {label}</button>
        </div>
      ))}

      <div className="text-right pt-6">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow">
          Save & Continue
        </button>
      </div>
    </form>
  );
}


// Tailwind class "input" can be defined in your styles:
// .input {
//   @apply w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-400;
// }