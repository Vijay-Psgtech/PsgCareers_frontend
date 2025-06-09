import React from 'react';

const SectionCard = ({ title, children }) => (
  <div className="bg-white shadow-md rounded-2xl p-4 mb-4 border border-gray-200">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
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
      <SectionCard title="Basic Info">
        <div className="grid gap-2 text-sm">
          <p><strong>Scopus ID:</strong> {data.scopusId || 'N/A'}</p>
          <p><strong>ORCID ID:</strong> {data.orcidId || 'N/A'}</p>
          <p><strong>H-Index:</strong> {data.hIndex || 'N/A'}</p>
          <p><strong>i10-Index:</strong> {data.i10Index || 'N/A'}</p>
          <p><strong>Citations:</strong> {data.citations || 'N/A'}</p>
          <p><strong>Research Areas:</strong> {data.researchAreas || 'N/A'}</p>
        </div>
      </SectionCard>

      <SectionCard title="Books">
        {renderList(data.books || [], ['title', 'publication', 'author', 'isbn', 'edition', 'year'])}
      </SectionCard>

      <SectionCard title="Journals">
        {renderList(data.journals || [], ['title', 'publication', 'author', 'isbn', 'edition', 'year'])}
      </SectionCard>

      <SectionCard title="Conferences">
        {renderList(data.conferences || [], ['title', 'conference', 'type', 'institution', 'conferenceDate', 'publishedDate'])}
      </SectionCard>

      <SectionCard title="Patents">
        {renderList(data.patents || [], ['authors', 'title', 'status'])}
      </SectionCard>

      <SectionCard title="Consultancy">
        {renderList(data.consultancy || [], ['title', 'organization', 'scope', 'duration', 'amount'])}
      </SectionCard>

      <SectionCard title="Funded Projects">
        {renderList(data.fundedProjects || [], ['title', 'agency', 'amount', 'duration'])}
      </SectionCard>

      <SectionCard title="Copyrights">
        {renderList(data.copyrights || [], ['title', 'authors', 'year'])}
      </SectionCard>

      <SectionCard title="Others">
        {renderList(data.others || [], ['title', 'description'])}
      </SectionCard>
    </div>
  );
};

export default ResearchDetails;
