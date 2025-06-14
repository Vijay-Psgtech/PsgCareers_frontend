import { Tab } from '@headlessui/react'
import { Fragment, useState } from 'react';
import PersonalDetails from './personalDetailsCard'
import EducationDetails from './educationDetailsCard'
import WorkExperienceDetails from './workExperienceDetailsCard'
import ResearchCard from './researchDetailsCard'
import OtherDetailsCard from './otherDetailsCard'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function CandidateProfileTabs({ personal, education, experience, research, otherDetails, jobCategory }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabs = [
    { label: 'Personal Details', content: <PersonalDetails data={personal} /> },
    { label: 'Education', content: <EducationDetails education={education} /> },
    { label: 'Work Experience', content: <WorkExperienceDetails work={experience} /> }
  ];

  // Insert Research tab only if Teaching
  if (jobCategory === 'Teaching') {
    tabs.push({ label: 'Research Contribution', content: <ResearchCard data={research} /> });
  }

  tabs.push({ label: 'Other Details', content: <OtherDetailsCard data={otherDetails} /> });

  return (
    <div className="w-full px-4 py-6">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-2 rounded-xl bg-blue-50 p-1 mb-4">
          {tabs.map((tab, idx) => (
            <Tab as={Fragment} key={idx} 
              className={({ selected }) =>
                 classNames(
                 'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                   selected
                    ? 'bg-white shadow'
                    : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-700'
                )
              }>
              {({ selected }) => (
                <button
                  className={`px-4 py-2 rounded-t-md text-sm font-medium transition-all ${
                    selected ? 'bg-blue-600 text-blue' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {tabs.map((tab, idx) => (
            <Tab.Panel key={idx} className="bg-white p-4 rounded shadow">
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}



