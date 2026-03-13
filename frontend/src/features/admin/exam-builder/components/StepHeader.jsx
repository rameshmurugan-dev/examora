const steps = [
  { id: 1, label: 'Exam Info' },
  { id: 2, label: 'Sections' },
  { id: 3, label: 'SubSections' },
  { id: 4, label: 'Questions' },
  { id: 5, label: 'Review' },
];

const StepHeader = ({ currentStep, onStepClick }) => {
  return (
    <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-5 shadow-md">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center w-full">
              <div className="flex flex-col items-center w-full">
                <button
                  type="button"
                  onClick={() => onStepClick(step.id)}
                  className={`w-8 h-8 rounded-full text-sm font-semibold transition-all
                    ${isActive
                      ? 'bg-indigo-600 text-white'
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }
                  `}
                >
                  {step.id}
                </button>

                <span
                  className={`mt-1 text-xs ${isActive
                      ? 'text-indigo-600 font-medium'
                      : 'text-gray-500'
                    }`}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 h-[2px] bg-gray-200 mx-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepHeader;