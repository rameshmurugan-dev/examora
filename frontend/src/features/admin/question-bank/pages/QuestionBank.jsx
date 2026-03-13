/**
 * ================================================================
 * QuestionBank (Container)
 * ================================================================
 * Orchestrates:
 *  - State management
 *  - API calls (via service layer)
 *  - Modal control
 *  - Selection logic
 *  - Pagination logic
 * ================================================================
 */

import { useState, useEffect, useCallback } from 'react';

import SectionPanel from '../components/SectionPanel';
import QuestionPanel from '../components/QuestionPanel';
import QuestionBankModals from '../components/QuestionBankModals';
import BulkQuestionUploadModal from '../components/BulkQuestionUploadModal';

import {
  fetchSectionsAPI,
  createSectionAPI,
  updateSectionAPI,
  deleteSectionAPI,
  fetchSubSectionsAPI,
  createSubSectionAPI,
  updateSubSectionAPI,
  deleteSubSectionAPI,
  fetchQuestionsAPI,
  createQuestionAPI,
  updateQuestionAPI,
  deleteQuestionAPI
} from '../services/questionBankService';

const QuestionBank = () => {

  /* ============================================================
     STATE
  ============================================================ */

  const [sections, setSections] = useState([]);
  const [subSections, setSubSections] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedSubSectionId, setSelectedSubSectionId] = useState(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const [loadingSections, setLoadingSections] = useState(false);
  const [loadingSubSections, setLoadingSubSections] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});

  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isSubSectionModalOpen, setIsSubSectionModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  /* ============================================================
     FETCHERS
  ============================================================ */

  const fetchSections = useCallback(async () => {
    setLoadingSections(true);
    try {
      const data = await fetchSectionsAPI();
      setSections(data);
    } finally {
      setLoadingSections(false);
    }
  }, []);

  const fetchSubSections = useCallback(async (sectionId) => {
    if (!sectionId) return;

    setLoadingSubSections(true);
    try {
      const data = await fetchSubSectionsAPI(sectionId);
      setSubSections(data);
    } finally {
      setLoadingSubSections(false);
    }
  }, []);

  const fetchQuestions = useCallback(async (subSectionId, pageNum = 0) => {
    if (!subSectionId) return;

    setLoadingQuestions(true);
    try {
      const pageData = await fetchQuestionsAPI(
        subSectionId,
        pageNum,
        pageSize
      );

      setQuestions(pageData.content || []);
      setTotalPages(pageData.totalPages || 0);
      setPage(pageNum);

    } finally {
      setLoadingQuestions(false);
    }
  }, []);

  /* ============================================================
     EFFECTS
  ============================================================ */

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  useEffect(() => {
    if (selectedSectionId) {
      setSelectedSubSectionId(null);
      setQuestions([]);
      fetchSubSections(selectedSectionId);
    }
  }, [selectedSectionId, fetchSubSections]);

  useEffect(() => {
    if (selectedSubSectionId) {
      fetchQuestions(selectedSubSectionId, 0);
    }
  }, [selectedSubSectionId, fetchQuestions]);

  /* ============================================================
     SELECTION
  ============================================================ */

  const handleSectionClick = (id) => {
    if (selectedSectionId !== id) {
      setSelectedSectionId(id);
    }
  };

  const handleSubSectionClick = (e, id) => {
    e.stopPropagation();
    setSelectedSubSectionId(id);
  };

  /* ============================================================
     MODAL OPENERS
  ============================================================ */

  const openCreateSection = () => {
    setCurrentItem({ type: 'SECTION', action: 'CREATE' });
    setFormData({ name: '', description: '' });
    setIsSectionModalOpen(true);
  };

  const openEditSection = (e, section) => {
    e.stopPropagation();
    setCurrentItem({ type: 'SECTION', action: 'EDIT', data: section });
    setFormData({ name: section.name, description: section.description });
    setIsSectionModalOpen(true);
  };

  const openDeleteSection = (e, section) => {
    e.stopPropagation();
    setCurrentItem({ type: 'SECTION', action: 'DELETE', data: section });
    setIsDeleteConfirmOpen(true);
  };

  const openCreateSubSection = () => {
    if (!selectedSectionId) return;

    setCurrentItem({ type: 'SUBSECTION', action: 'CREATE' });
    setFormData({ name: '', description: '' });
    setIsSubSectionModalOpen(true);
  };

  const openEditSubSection = (e, sub) => {
    e.stopPropagation();
    setCurrentItem({ type: 'SUBSECTION', action: 'EDIT', data: sub });
    setFormData({ name: sub.name, description: sub.description });
    setIsSubSectionModalOpen(true);
  };

  const openDeleteSubSection = (e, sub) => {
    e.stopPropagation();
    setCurrentItem({ type: 'SUBSECTION', action: 'DELETE', data: sub });
    setIsDeleteConfirmOpen(true);
  };

  const openCreateQuestion = () => {
    if (!selectedSubSectionId) return;

    setCurrentItem({ type: 'QUESTION', action: 'CREATE' });
    setFormData({
      text: '',
      marks: 1,
      difficultyLevel: 'EASY',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    });

    setIsQuestionModalOpen(true);
  };

  const openEditQuestion = (q) => {
    setCurrentItem({ type: 'QUESTION', action: 'EDIT', data: q });

    setFormData({
      text: q.questionText,
      marks: q.marks,
      difficultyLevel: q.difficultyLevel || 'EASY',
      options: q.options.map(opt => ({
        text: opt,
        isCorrect: opt === q.correctOption
      }))
    });

    setIsQuestionModalOpen(true);
  };

  const openDeleteQuestion = (q) => {
    setCurrentItem({ type: 'QUESTION', action: 'DELETE', data: q });
    setIsDeleteConfirmOpen(true);
  };

  /* ============================================================
     SAVE HANDLERS
  ============================================================ */

  const handleSaveSection = async () => {
    if (!formData.name.trim()) return alert("Name required");

    if (currentItem.action === 'CREATE') {
      await createSectionAPI(formData);
    } else {
      await updateSectionAPI(currentItem.data.id, formData);
    }

    setIsSectionModalOpen(false);
    fetchSections();
  };

  const handleSaveSubSection = async () => {
    if (!formData.name.trim()) return alert("Name required");

    if (currentItem.action === 'CREATE') {
      await createSubSectionAPI(selectedSectionId, formData);
    } else {
      await updateSubSectionAPI(currentItem.data.id, formData);
    }

    setIsSubSectionModalOpen(false);
    fetchSubSections(selectedSectionId);
  };

  const handleSaveQuestion = async () => {
    const correct = formData.options.find(o => o.isCorrect);
    if (!correct) return alert("Select correct option");

    const payload = {
      questionText: formData.text,
      marks: Number(formData.marks),
      difficultyLevel: formData.difficultyLevel,
      options: formData.options.map(o => o.text),
      correctOption: correct.text
    };

    if (currentItem.action === 'CREATE') {
      await createQuestionAPI(selectedSubSectionId, payload);
    } else {
      await updateQuestionAPI(currentItem.data.id, payload);
    }

    setIsQuestionModalOpen(false);
    fetchQuestions(selectedSubSectionId, page);
  };

  /* ============================================================
     DELETE HANDLER
  ============================================================ */

  const executeDelete = async () => {

    if (currentItem.type === 'SECTION') {
      await deleteSectionAPI(currentItem.data.id);
      setSelectedSectionId(null);
      fetchSections();
    }

    if (currentItem.type === 'SUBSECTION') {
      await deleteSubSectionAPI(currentItem.data.id);
      setSelectedSubSectionId(null);
      fetchSubSections(selectedSectionId);
    }

    if (currentItem.type === 'QUESTION') {
      await deleteQuestionAPI(currentItem.data.id);
      fetchQuestions(selectedSubSectionId, page);
    }

    setIsDeleteConfirmOpen(false);
  };

  /* ============================================================
     ICONS
  ============================================================ */

  const Icons = {
    Plus: () => <span>＋</span>,
    Edit: () => <span>✏️</span>,
    Trash: () => <span>🗑️</span>,
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <>
      <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row bg-gray-50 p-6 gap-6">

        <SectionPanel
          sections={sections}
          subSections={subSections}
          selectedSectionId={selectedSectionId}
          selectedSubSectionId={selectedSubSectionId}
          onSectionClick={handleSectionClick}
          onSubSectionClick={handleSubSectionClick}
          onCreateSection={openCreateSection}
          onEditSection={openEditSection}
          onDeleteSection={openDeleteSection}
          onCreateSubSection={openCreateSubSection}
          onEditSubSection={openEditSubSection}
          onDeleteSubSection={openDeleteSubSection}
          Icons={Icons}
        />

        <QuestionPanel
          questions={questions}
          selectedSubSectionId={selectedSubSectionId}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          onBulkUpload={() => setIsBulkUploadOpen(true)}
          onCreateQuestion={openCreateQuestion}
          onEditQuestion={openEditQuestion}
          onDeleteQuestion={openDeleteQuestion}
          onPageChange={(newPage) =>
            fetchQuestions(selectedSubSectionId, newPage)
          }
          Icons={Icons}
        />

      </div>

      <QuestionBankModals
        currentItem={currentItem}
        formData={formData}
        setFormData={setFormData}
        isSectionModalOpen={isSectionModalOpen}
        setIsSectionModalOpen={setIsSectionModalOpen}
        isSubSectionModalOpen={isSubSectionModalOpen}
        setIsSubSectionModalOpen={setIsSubSectionModalOpen}
        isQuestionModalOpen={isQuestionModalOpen}
        setIsQuestionModalOpen={setIsQuestionModalOpen}
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
        handleSaveSection={handleSaveSection}
        handleSaveSubSection={handleSaveSubSection}
        handleSaveQuestion={handleSaveQuestion}
        executeDelete={executeDelete}
        Icons={Icons}
      />

      {isBulkUploadOpen && selectedSubSectionId && (
        <BulkQuestionUploadModal
          subSectionId={selectedSubSectionId}
          onClose={() => setIsBulkUploadOpen(false)}
          onSuccess={() => fetchQuestions(selectedSubSectionId, 0)}
        />
      )}

    </>
  );
};

export default QuestionBank;