/**
 * ================================================================
 * SectionPanel
 * ================================================================
 * Left panel of Question Bank.
 *
 * Responsibilities:
 *  - Display sections
 *  - Display nested subsections
 *  - Highlight selected section
 *  - Highlight selected subsection
 *  - Provide CRUD triggers
 * ================================================================
 */

const SectionPanel = ({
  sections,
  subSections,
  selectedSectionId,
  selectedSubSectionId,

  onSectionClick,
  onSubSectionClick,

  onCreateSection,
  onEditSection,
  onDeleteSection,

  onCreateSubSection,
  onEditSubSection,
  onDeleteSubSection,

  Icons
}) => {

  return (
    <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-sm border flex flex-col overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Sections</h2>

        <button
          onClick={onCreateSection}
          className="p-1 rounded-full bg-indigo-100 text-indigo-600"
        >
          <Icons.Plus />
        </button>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-2">

        {sections.map(section => (
          <div key={section.id} className="mb-2">

            {/* Section Row */}
            <div
              className={`flex justify-between px-4 py-3 rounded-xl cursor-pointer
                ${selectedSectionId === section.id
                  ? 'bg-indigo-50 border border-indigo-200'
                  : 'hover:bg-gray-50'
                }`}
              onClick={() => onSectionClick(section.id)}
            >
              <span>{section.name}</span>

              <div className="flex gap-2">

                <button
                  onClick={(e) => onEditSection(e, section)}
                >
                  <Icons.Edit />
                </button>

                <button
                  onClick={(e) => onDeleteSection(e, section)}
                >
                  <Icons.Trash />
                </button>

              </div>
            </div>

            {/* Subsections (Only for Selected Section) */}
            {selectedSectionId === section.id && (
              <div className="ml-4 mt-1 pl-2 border-l-2 border-indigo-100">

                {/* Subsection Header */}
                <div className="flex justify-between text-xs px-2 py-1">
                  <span>Subsections</span>

                  <button onClick={onCreateSubSection}>
                    + Add
                  </button>
                </div>

                {/* Subsection List */}
                {subSections.map(sub => (
                  <div
                    key={sub.id}
                    className={`flex justify-between px-3 py-2 rounded-lg text-sm cursor-pointer
                      ${selectedSubSectionId === sub.id
                        ? 'bg-white shadow text-indigo-700'
                        : 'hover:bg-gray-50'
                      }`}
                    onClick={(e) => onSubSectionClick(e, sub.id)}
                  >
                    <span>{sub.name}</span>

                    <div className="flex gap-1">

                      <button
                        onClick={(e) => onEditSubSection(e, sub)}
                      >
                        <Icons.Edit />
                      </button>

                      <button
                        onClick={(e) => onDeleteSubSection(e, sub)}
                      >
                        <Icons.Trash />
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>
        ))}

      </div>
    </div>
  );
};

export default SectionPanel;