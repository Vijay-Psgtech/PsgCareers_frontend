import React from 'react';

const SectionCard = ({ title, children }) => (
  <div className="bg-white shadow-md rounded-2xl p-4 mb-4 border border-gray-200">
    <h2 className="text-lg text-blue-700 font-semibold mb-2">{title}</h2>
    {children}
  </div>
);

const renderList = (items, fields) => (
  items.length === 0 ? (
    <p className="text-gray-500">No records found.</p>
  ) : (
    <ul className="grid gap-2">
      {items.map((item, index) => (
        <li key={index} className="bg-gray-50 p-3 shadow-md rounded-lg border">
          {fields.map((field) => (
            <div key={field} className="text-sm">
              <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {item[field]}
            </div>
          ))}
        </li>
      ))}
    </ul>
  )
);

const ResearchDetails = ({ data }) => {
  if (!data) return <p>No data available</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SectionCard title="Paper Published - Basic Metrics">
        <div className="grid gap-2 text-sm">
          <p><strong>Scopus ID:</strong> {data.scopusId || 'N/A'}</p>
          <p><strong>Sci:</strong> {data.sci || 'N/A'}</p>
          <p><strong>Ugc:</strong> {data.ugc || 'N/A'}</p>
          <p><strong>hGoogle:</strong> {data.hGoogle || 'N/A'}</p>
          <p><strong>hScopus:</strong> {data.hScopus || 'N/A'}</p>
          <p><strong>Other:</strong> {data.other || 'N/A'}</p>
        </div>
      </SectionCard>

      <SectionCard title="Books Published / Edited">
        {renderList(data.books || [], ['title', 'publication', 'author', 'isbn', 'edition', 'year'])}
      </SectionCard>

      <SectionCard title="Chapters Published / Edited">
        {renderList(data.chapters || [], ['title', 'publication', 'author', 'isbn', 'edition', 'year'])}
      </SectionCard>

      <SectionCard title="Journals">
        {renderList(data.journals || [], ['title', 'publication', 'author', 'isbn', 'edition', 'year'])}
      </SectionCard>

      <SectionCard title="Projects">
         {renderList(data.projects || [], ['title', 'agency', 'pi', 'duration'])}
      </SectionCard>

      <SectionCard title="Patents">
        {renderList(data.patents || [], ['authors', 'title', 'status'])}
      </SectionCard>

      <SectionCard title="Post Doctoral Fellowship (PDF)">
        {renderList(data.pdfs || [], ['type', 'institute'])}
      </SectionCard>

      <SectionCard title="Consultancy Undertaken">
        {renderList(data.consultancy || [], ['title', 'organization', 'scope', 'duration', 'amount'])}
      </SectionCard>

      <SectionCard title="Paper Presentation & Conferences">
        {renderList(data.conferences || [], ['title', 'conference', 'type', 'institution', 'conferenceDate', 'publishedDate'])}
      </SectionCard>

      <SectionCard title="Vists">
         {renderList(data.visits || [], ['country', 'purpose', 'funded'])}
      </SectionCard>
    </div>
  );
};

export default ResearchDetails;
