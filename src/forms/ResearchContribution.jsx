import React, { useEffect, useState } from 'react';
import axiosInstance from "../utils/axiosInstance";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@radix-ui/react-accordion";
import { useAuth } from "../Context/AuthContext";

export default function ResearchContribution({ updateFormData, jobId }) {
  const { auth } = useAuth();
  const userId = auth.userId;

  const [form, setForm] = useState({
    sci: '', scopus: '', ugc: '', other: '',
    scopusId: '', hGoogle: '', hScopus: '',
    minorProjects: '', majorProjects: '',
    appliedPatents: '', publishedPatents: '', grantedPatents: '',
    books: [], chapters: [], journals: [], projects: [], patents: [], pdfs: [],
    consultancy: [], conferences: [], visits: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/api/research/${userId}?jobId=${jobId}`);
        if (res.data) {
          setForm(prev => ({
            ...prev,
            ...res.data,
            books: res.data.books || [],
            chapters: res.data.chapters || [],
            journals: res.data.journals || [],
            projects: res.data.projects || [],
            patents: res.data.patents || [],
            pdfs: res.data.pdfs || [],
            consultancy: res.data.consultancy || [],
            conferences: res.data.conferences || [],
            visits: res.data.visits || []
          }));
        }
      } catch (error) {
        console.error("Error fetching research contribution data", error);
      }
    };
    if (userId && jobId) fetchData();
  }, [userId, jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDynamicChange = (key, index, field, value) => {
    const updated = [...form[key]];
    updated[index][field] = value;
    setForm(prev => ({ ...prev, [key]: updated }));
  };

  const addEntry = (key, fields) => {
    const entry = fields.reduce((acc, f) => ({ ...acc, [f]: '' }), {});
    setForm(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), entry]
    }));
  };

  const removeEntry = (key, index) => {
    const updated = [...(form[key] || [])];
    updated.splice(index, 1);
    setForm(prev => ({ ...prev, [key]: updated }));
  };

  const validate = () => {
    const requiredFields = [
      'sci', 'scopus', 'ugc', 'other',
      'scopusId', 'hGoogle', 'hScopus',
      'minorProjects', 'majorProjects',
      'appliedPatents', 'publishedPatents', 'grantedPatents'
    ];

    const newErrors = {};
    requiredFields.forEach(field => {
      if (!form[field] || form[field].toString().trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axiosInstance.post(`/api/research/${userId}`, {
        ...form,
        jobId,
      });
      if (res.data) {
        updateFormData && updateFormData(form);
        const nextSection = document.getElementById("work-experience");
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (error) {
      console.error("Error saving research contributions", error);
    }
  };

  const Label = ({ text }) => (
    <label className="text-sm font-semibold">{text}</label>
  );

  const renderDynamicFields = (key, fields, label) => (
    <AccordionItem value={key} className="border rounded-lg p-4 my-2">
      <AccordionTrigger className="text-lg font-semibold cursor-pointer">{label}</AccordionTrigger>
      <AccordionContent>
        {(form[key] || []).map((entry, i) => (
          <div key={i} className="grid md:grid-cols-3 gap-4 mb-3">
            {fields.map(field => (
              <div key={field}>
                <Label text={field} />
                <input
                  type="text"
                  placeholder={field}
                  value={entry[field] || ''}
                  onChange={e => handleDynamicChange(key, i, field, e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
            ))}
            <button type="button" className="text-red-600" onClick={() => removeEntry(key, i)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => addEntry(key, fields)} className="text-blue-600 mt-2">+ Add {label}</button>
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded-xl space-y-6">
      <h2 className="text-2xl font-bold text-blue-800">Research Contribution</h2>
      <Accordion type="multiple" className="space-y-2">
        <AccordionItem value="basic" className="border rounded-lg p-4">
          <AccordionTrigger className="text-lg font-semibold cursor-pointer">Basic Metrics</AccordionTrigger>
          <AccordionContent>
            <div className="grid md:grid-cols-4 gap-4">
              {['sci', 'scopus', 'ugc', 'other'].map(field => (
                <div key={field}>
                  <Label text={field.toUpperCase()} />
                  <input
                    type="number"
                    name={field}
                    min="0"
                    value={form[field]}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                  {errors[field] && <p className="text-red-600 text-sm">{errors[field]}</p>}
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              {['scopusId', 'hGoogle', 'hScopus'].map(field => (
                <div key={field}>
                  <Label text={field} />
                  <input
                    type="text"
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                  {errors[field] && <p className="text-red-600 text-sm">{errors[field]}</p>}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {renderDynamicFields('books', ['title', 'publication', 'author', 'isbn', 'edition', 'year'], 'Books Published / Edited')}
        {renderDynamicFields('chapters', ['title', 'publication', 'author', 'isbn', 'edition', 'year'], 'Chapters Published / Edited')}
        {renderDynamicFields('journals', ['title', 'publication', 'author', 'isbn', 'edition', 'year'], 'Journals')}

        <AccordionItem value="projects" className="border rounded-lg p-4">
          <AccordionTrigger className="text-lg font-semibold cursor-pointer">Projects</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {['minorProjects', 'majorProjects'].map(field => (
                <div key={field}>
                  <Label text={field} />
                  <input
                    type="text"
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                  {errors[field] && <p className="text-red-600 text-sm">{errors[field]}</p>}
                </div>
              ))}
            </div>
            {renderDynamicFields('projects', ['pi', 'title', 'agency', 'status', 'duration'], 'Project')}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="patents" className="border rounded-lg p-4">
          <AccordionTrigger className="text-lg font-semibold cursor-pointer">Patents</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-4">
              {['appliedPatents', 'publishedPatents', 'grantedPatents'].map(field => (
                <div key={field}>
                  <Label text={field} />
                  <input
                    type="text"
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                  {errors[field] && <p className="text-red-600 text-sm">{errors[field]}</p>}
                </div>
              ))}
            </div>
            {renderDynamicFields('patents', ['authors', 'title', 'status'], 'Patent')}
          </AccordionContent>
        </AccordionItem>

        {renderDynamicFields('pdfs', ['type', 'institute'], 'Post Doctoral Fellowship')}
        {renderDynamicFields('consultancy', ['title', 'organization', 'scope', 'duration', 'amount'], 'Consultancy Undertaken')}
        {renderDynamicFields('conferences', ['title', 'conference', 'type', 'institution', 'conferenceDate', 'publishedDate'], 'Paper Presentation & Conferences')}
        {renderDynamicFields('visits', ['country', 'purpose', 'funded'], 'Foreign Visit')}
      </Accordion>

      <div className="text-right mt-4">
        <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800">Save & Continue</button>
      </div>
    </form>
  );
}









  