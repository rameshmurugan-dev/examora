import { useEffect, useState } from 'react';
import Loader from '../../../../shared/components/Loader';
import {
  fetchBankSubSections,
  attachSubSection,
  detachSubSection,
} from '../services/examBuilderService';

/**
 * Step3SubSections
 * Attach / detach subsections under selected sections
 */
const Step3SubSections = ({
  examId,
  structure,
  refreshStructure,
  onNext,
  onPrevious,
}) => {
  const [bankSubSections, setBankSubSections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (structure?.sections?.length) {
      loadSubSections();
    } else {
      setLoading(false);
    }
  }, [structure]);

  const loadSubSections = async () => {
    try {
      const result = {};

      for (const section of structure.sections) {
        const res = await fetchBankSubSections(section.sectionId);
        result[section.sectionId] = res.data.data || [];
      }

      setBankSubSections(result);
    } catch {
      alert('Failed loading subsections');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (section, sub) => {
    try {
      const attached = section.subSections.some(
        s => s.subSectionId === sub.id
      );

      if (attached) {
        const examSub = section.subSections.find(
          s => s.subSectionId === sub.id
        );

        await detachSubSection(examId, examSub.examSubSectionId);
      } else {
        await attachSubSection(examId, section.sectionId, sub.id);
      }

      await refreshStructure();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  if (loading) return <Loader />;

  const hasSubSections = structure.sections.some(
    sec => sec.subSections.length > 0
  );

  return (
    <div className="space-y-6">
      {structure.sections.map(section => {
        const bankSubs = bankSubSections[section.sectionId] || [];
        const attachedIds = section.subSections.map(s => s.subSectionId);

        return (
          <div key={section.examSectionId} className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">
              {section.title}
            </h3>

            <div className="grid md:grid-cols-2 gap-3">
              {bankSubs.map(sub => {
                const isAttached = attachedIds.includes(sub.id);

                return (
                  <button
                    key={sub.id}
                    onClick={() => handleToggle(section, sub)}
                    className={`border rounded-lg p-3 text-sm text-left transition-all
                      ${isAttached
                        ? 'bg-green-50 border-green-300 text-green-700'
                        : 'border-gray-300 hover:bg-indigo-50'
                      }`}
                  >
                    <div className="flex justify-between">
                      <span>{sub.name}</span>
                      {isAttached && <span>✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="flex justify-between">
        <button onClick={onPrevious} className="bg-gray-200 px-4 py-2 rounded-lg">
          Previous
        </button>

        <button
          disabled={!hasSubSections}
          onClick={onNext}
          className={`px-4 py-2 rounded-lg text-white
            ${hasSubSections
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step3SubSections;