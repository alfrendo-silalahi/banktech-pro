// Transfer Wizard Component
import { useState, useEffect } from "react";
import useTransferStore, { TRANSFER_STEPS } from "../store/transferStore.jsx";
import { useActivity } from "../context/ActivityProvider";
import { useCategories } from "../hooks/useCategories.jsx";
import { useCurrentUser } from "../hooks/useCurrentUser.jsx";
import { useAccount } from "../context/AccountProvider.jsx";

// Step Components
const RecipientStep = () => {
  const {
    transferData,
    updateTransferData,
    lookupAccount,
    errors,
    isLoading,
    currentUserAccount,
  } = useTransferStore();
  const { fullName } = useCurrentUser();

  const handleLookup = async () => {
    if (
      transferData.recipientAccount &&
      /^\d{10,}$/.test(transferData.recipientAccount)
    ) {
      await lookupAccount(transferData.recipientAccount);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Enter Recipient Account
      </h3>

      {/* Current User Info */}
      {currentUserAccount && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-800 text-sm">
            <strong>Your Account:</strong> {currentUserAccount} ({fullName})
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Account Number
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={transferData.recipientAccount}
            onChange={(e) => {
              updateTransferData({
                recipientAccount: e.target.value,
                recipientName: "",
              });
            }}
            className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.recipientAccount ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter 10-digit account number"
          />
          <button
            onClick={handleLookup}
            disabled={!transferData.recipientAccount || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Looking up..." : "Lookup"}
          </button>
        </div>
        {errors.recipientAccount && (
          <div
            className={`p-3 rounded-md mt-2 ${
              errors.recipientAccount.includes("own account")
                ? "bg-yellow-50 border border-yellow-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <p
              className={`text-sm ${
                errors.recipientAccount.includes("own account")
                  ? "text-yellow-800"
                  : "text-red-800"
              }`}
            >
              {errors.recipientAccount.includes("own account") && "⚠️ "}
              {errors.recipientAccount}
            </p>
          </div>
        )}
      </div>

      {transferData.recipientName && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">
            <strong>Account Found:</strong> {transferData.recipientName}
          </p>
        </div>
      )}
    </div>
  );
};

const AmountStep = () => {
  const { transferData, updateTransferData, errors } = useTransferStore();
  const { categories } = useCategories();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Enter Transfer Amount
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount (IDR)
        </label>
        <input
          type="number"
          value={transferData.amount || ""}
          onChange={(e) =>
            updateTransferData({ amount: Number(e.target.value) })
          }
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.amount ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter amount"
          min="10000"
          max="100000000"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
        )}
        <p className="text-gray-500 text-sm mt-1">
          Min: Rp 10,000 | Max: Rp 100,000,000
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          value={transferData.description}
          onChange={(e) => updateTransferData({ description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter transfer description"
          rows="3"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <input
            type="checkbox"
            checked={transferData.shouldCategorize}
            onChange={(e) =>
              updateTransferData({
                shouldCategorize: e.target.checked,
                selectedCategory: e.target.checked
                  ? transferData.selectedCategory
                  : null,
              })
            }
            className="rounded"
          />
          Categorize this transfer
        </label>

        {transferData.shouldCategorize && (
          <select
            value={transferData.selectedCategory || ""}
            onChange={(e) =>
              updateTransferData({ selectedCategory: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

const ConfirmationStep = () => {
  const { transferData } = useTransferStore();
  const { categories } = useCategories();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Confirm Transfer Details
      </h3>

      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Recipient Account:</span>
          <span className="font-medium">{transferData.recipientAccount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Recipient Name:</span>
          <span className="font-medium">{transferData.recipientName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Amount:</span>
          <span className="font-medium text-lg">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(transferData.amount)}
          </span>
        </div>
        {transferData.description && (
          <div className="flex justify-between">
            <span className="text-gray-600">Description:</span>
            <span className="font-medium">{transferData.description}</span>
          </div>
        )}
        {transferData.shouldCategorize && transferData.selectedCategory && (
          <div className="flex justify-between">
            <span className="text-gray-600">Category:</span>
            <span className="font-medium">
              {categories.find((c) => c.id === transferData.selectedCategory)
                ?.name || "Unknown"}
            </span>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
        <p className="text-yellow-800 text-sm">
          ⚠️ Please review all details carefully. This action cannot be undone.
        </p>
      </div>
    </div>
  );
};

const SuccessStep = () => {
  const { resetTransfer } = useTransferStore();

  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <span className="text-2xl">✅</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-800">
        Transfer Successful!
      </h3>
      <p className="text-gray-600">
        Your money transfer has been processed successfully.
      </p>
      <button
        onClick={resetTransfer}
        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Make Another Transfer
      </button>
    </div>
  );
};

// Progress Indicator
const ProgressIndicator = () => {
  const { steps, currentStep, isTransitioning } = useTransferStore();

  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 ease-in-out transform ${
              step.completed
                ? "bg-green-500 text-white scale-110"
                : step.id === currentStep
                ? `bg-blue-500 text-white scale-110 ${
                    isTransitioning ? "animate-pulse" : ""
                  }`
                : "bg-gray-300 text-gray-600 scale-100"
            }`}
          >
            {step.completed ? "✓" : index + 1}
          </div>
          <span
            className={`ml-2 text-sm font-medium transition-all duration-300 ${
              step.id === currentStep
                ? "text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            {step.title}
          </span>
          {index < steps.length - 1 && (
            <div
              className={`w-12 h-0.5 mx-4 transition-all duration-500 ease-in-out ${
                step.completed ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Main Transfer Wizard Component
export default function TransferWizard({ onClose }) {
  const {
    currentStep,
    transferData,
    nextStep,
    prevStep,
    validateStep,
    lookupAccount,
    setCurrentUserAccount,
    executeTransfer,
    isLoading,
    isTransitioning,
    errors,
    steps,
  } = useTransferStore();
  const { logActivity } = useActivity();
  const { accountNumber } = useCurrentUser();

  const { activeAccount } = useAccount();

  // Set current user account when wizard opens
  useEffect(() => {
    if (accountNumber) {
      setCurrentUserAccount(accountNumber);
    }
  }, [accountNumber, setCurrentUserAccount]);

  const handleNext = async () => {
    if (currentStep === TRANSFER_STEPS.CONFIRMATION) {
      logActivity("transfer_initiated", "transaction", { step: currentStep });
      // TODO:
      "account number wizard", activeAccount.accountNumber;
      const result = await executeTransfer(activeAccount.accountNumber);
      if (result.success) {
        logActivity("transfer_completed", "transaction", {
          transactionId: result.transactionId,
        });
      }
    } else if (currentStep === TRANSFER_STEPS.RECIPIENT) {
      // For recipient step, validate account lookup first
      if (transferData.recipientAccount && !transferData.recipientName) {
        const result = await lookupAccount(transferData.recipientAccount);
        if (result.success) {
          nextStep();
          logActivity("transfer_step_completed", "transaction", {
            step: currentStep,
          });
        }
      } else if (validateStep(currentStep)) {
        nextStep();
        logActivity("transfer_step_completed", "transaction", {
          step: currentStep,
        });
      }
    } else {
      if (validateStep(currentStep)) {
        nextStep();
        logActivity("transfer_step_completed", "transaction", {
          step: currentStep,
        });
      }
    }
  };

  const handlePrev = () => {
    prevStep();
    logActivity("transfer_step_back", "transaction", { step: currentStep });
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case TRANSFER_STEPS.RECIPIENT:
        return <RecipientStep />;
      case TRANSFER_STEPS.AMOUNT:
        return <AmountStep />;
      case TRANSFER_STEPS.CONFIRMATION:
        return <ConfirmationStep />;
      case TRANSFER_STEPS.SUCCESS:
        return <SuccessStep />;
      default:
        return <RecipientStep />;
    }
  };

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStep === TRANSFER_STEPS.SUCCESS;

  return (
    <div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Money Transfer</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <ProgressIndicator />

        <div className="mb-8 min-h-[300px] relative">
          <div
            className={`transition-all duration-300 ease-in-out ${
              isTransitioning
                ? "opacity-0 transform translate-x-4"
                : "opacity-100 transform translate-x-0"
            }`}
          >
            {renderCurrentStep()}
          </div>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{errors.general}</p>
          </div>
        )}

        {!isLastStep && (
          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              disabled={isFirstStep || isTransitioning}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isTransitioning && (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              )}
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={isLoading || isTransitioning}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {(isLoading || isTransitioning) && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {currentStep === TRANSFER_STEPS.CONFIRMATION
                ? "Transfer Now"
                : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
