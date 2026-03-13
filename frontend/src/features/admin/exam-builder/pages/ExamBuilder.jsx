import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../../../../shared/components/Loader';

import StepHeader from '../components/StepHeader';
import Step1BasicInfo from '../steps/Step1BasicInfo';
import Step2Sections from '../steps/Step2Sections';
import Step3SubSections from '../steps/Step3SubSections';
import Step4Questions from '../steps/Step4Questions';
import Step5Review from '../steps/Step5Review';
import ExamSummarySidebar from '../components/ExamSummarySidebar';

import {
  createExam,
  publishExam,
  fetchExamStructure,
  fetchBankSections,
  attachSection,
  detachSection,
  attachSubSection,
} from '../services/examBuilderService';

/**
 * ExamBuilder – Wizard Controller
 */
const ExamBuilder = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [examId, setExamId] = useState(null);
  const [structure, setStructure] = useState(null);
  const [sections, setSections] = useState([]);

  const [examData, setExamData] = useState({
    title: '',
    description: '',
    durationMinutes: 60,
    negativeMarks: 0,
    examMode: 'FULL',
  });

  useEffect(() => {
    if (examId) loadStructure();
  }, [examId]);

  useEffect(() => {

    const init = async () => {

      const params = new URLSearchParams(location.search);
      const editId = params.get("edit");

      try {

        const secRes = await fetchBankSections();
        setSections(secRes.data.data || []);

        if (editId) {
          const id = Number(editId);

          setExamId(id);
          setCurrentStep(2);

          const res = await fetchExamStructure(id);
          setStructure(res.data.data);
        }

      } catch {
        alert("Failed loading exam builder data");
      }

    };

    init();

  }, [location.search]);

  const loadStructure = async () => {
    try {
      const res = await fetchExamStructure(examId);
      setStructure(res.data.data);
    } catch {
      alert('Failed loading structure');
    }
  };

  const handleSaveBasicInfo = async () => {
    if (!examData.title.trim()) {
      alert('Exam title required');
      return;
    }

    setLoading(true);
    try {
      const res = await createExam(examData);

      const id = res.data.data.id;

      setExamId(id);

      const resStruct = await fetchExamStructure(id);
      setStructure(resStruct.data.data);

      const secRes = await fetchBankSections();
      setSections(secRes.data.data || []);

      setCurrentStep(2);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed creating exam');
    } finally {
      setLoading(false);
    }
  };

  const handleAttachSection = async (sectionId) => {
    try {
      const alreadyAttached = structure?.sections?.some(
        s => s.sectionId === sectionId
      );

      if (alreadyAttached) {
        await detachSection(examId, sectionId);
      } else {
        await attachSection(examId, sectionId);
      }

      await loadStructure();
    } catch (err) {
      alert('Section operation failed');
    }
  };

  const handleStepClick = (step) => {

    // Step 1 must be completed first
    if (!examId && step > 1) {
      alert("Please complete Step 1 first.");
      return;
    }

    // Step 2 requires at least one section
    if (step > 2 && (!structure?.sections || structure.sections.length === 0)) {
      alert("Please add at least one section first.");
      return;
    }

    // Step 3 requires subsections
    const hasSubSections = structure?.sections?.some(
      sec => sec.subSections && sec.subSections.length > 0
    );

    if (step > 3 && !hasSubSections) {
      alert("Please add at least one subsection.");
      return;
    }

    setCurrentStep(step);
  };

  const handlePublish = async () => {
    try {
      await publishExam(examId);
      alert('Exam published successfully');
      navigate('/admin/my-exams');
    } catch (err) {
      alert(err.response?.data?.message || 'Publish failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        <StepHeader
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border p-6">
            {currentStep === 1 && (
              <Step1BasicInfo
                examData={examData}
                setExamData={setExamData}
                onNext={handleSaveBasicInfo}
              />
            )}

            {currentStep === 2 && (
              <Step2Sections
                sections={sections}
                structure={structure}
                onAttach={handleAttachSection}
                onNext={() => setCurrentStep(3)}
                onPrevious={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && structure && (
              <Step3SubSections
                examId={examId}
                structure={structure}
                refreshStructure={loadStructure}
                onNext={() => setCurrentStep(4)}
                onPrevious={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 4 && structure && (
              <Step4Questions
                structure={structure}
                refreshStructure={loadStructure}
                onNext={() => setCurrentStep(5)}
                onPrevious={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 5 && structure && (
              <Step5Review
                structure={structure}
                onPublish={handlePublish}
                onPrevious={() => setCurrentStep(4)}
                onSaveDraft={() => navigate('/admin/my-exams')}
              />
            )}
          </div>

          <ExamSummarySidebar structure={structure} />

        </div>
      </div>
    </div>
  );
};

export default ExamBuilder;