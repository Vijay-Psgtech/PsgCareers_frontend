import { Tab } from '@headlessui/react'
import PersonalDetails from './personalDetailsCard'
import EducationDetails from './educationDetailsCard'
import WorkExperienceDetails from './workExperienceDetailsCard'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function CandidateProfileTabs({ personal, education, experience }) {
  const tabs = {
    'Personal Details': <PersonalDetails data={personal} />,
    'Education': <EducationDetails education={education} />,
    'Work Experience': <WorkExperienceDetails work={experience} />,
  }

  return (
    <div className="w-full px-4 py-6">
      <Tab.Group>
        <Tab.List className="flex space-x-2 rounded-xl bg-blue-50 p-1 mb-4">
          {Object.keys(tabs).map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-700'
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(tabs).map((content, idx) => (
            <Tab.Panel key={idx} className="rounded-xl bg-white p-4 shadow">
              {content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
