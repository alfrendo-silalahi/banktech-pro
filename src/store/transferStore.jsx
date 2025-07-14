// Transfer Wizard Store with Zustand
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { transferMoney } from "../firebase/auth";

const TRANSFER_STEPS = {
  RECIPIENT: "recipient",
  AMOUNT: "amount",
  CONFIRMATION: "confirmation",
  SUCCESS: "success",
};

const useTransferStore = create(
  persist(
    (set, get) => ({
      // Transfer state
      currentStep: TRANSFER_STEPS.RECIPIENT,
      currentUserAccount: null,
      transferData: {
        recipientAccount: "",
        recipientName: "",
        amount: 0,
        description: "",
        shouldCategorize: false,
        selectedCategory: null,
      },

      // UI state
      isLoading: false,
      errors: {},
      isTransitioning: false,

      // Step management
      steps: [
        { id: TRANSFER_STEPS.RECIPIENT, title: "Recipient", completed: false },
        { id: TRANSFER_STEPS.AMOUNT, title: "Amount", completed: false },
        {
          id: TRANSFER_STEPS.CONFIRMATION,
          title: "Confirmation",
          completed: false,
        },
        { id: TRANSFER_STEPS.SUCCESS, title: "Success", completed: false },
      ],

      // Actions
      setCurrentStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const { currentStep, steps } = get();
        const currentIndex = steps.findIndex((s) => s.id === currentStep);

        if (currentIndex < steps.length - 1) {
          set({ isTransitioning: true });

          setTimeout(() => {
            const nextStep = steps[currentIndex + 1].id;
            set((state) => ({
              currentStep: nextStep,
              isTransitioning: false,
              steps: state.steps.map((step) =>
                step.id === currentStep ? { ...step, completed: true } : step
              ),
            }));
          }, 150);
        }
      },

      prevStep: () => {
        const { currentStep, steps } = get();
        const currentIndex = steps.findIndex((s) => s.id === currentStep);

        if (currentIndex > 0) {
          set({ isTransitioning: true });

          setTimeout(() => {
            const prevStep = steps[currentIndex - 1].id;
            set((state) => ({
              currentStep: prevStep,
              errors: {}, // Clear errors when going back
              isTransitioning: false,
              steps: state.steps.map((step, index) =>
                index >= currentIndex ? { ...step, completed: false } : step
              ),
            }));
          }, 150);
        }
      },

      updateTransferData: (data) =>
        set((state) => ({
          transferData: { ...state.transferData, ...data },
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      setTransitioning: (transitioning) =>
        set({ isTransitioning: transitioning }),

      setErrors: (errors) => set({ errors }),

      clearErrors: () => set({ errors: {} }),

      resetTransfer: () =>
        set({
          currentStep: TRANSFER_STEPS.RECIPIENT,
          currentUserAccount: null,
          transferData: {
            recipientAccount: "",
            recipientName: "",
            amount: 0,
            description: "",
            shouldCategorize: false,
            selectedCategory: null,
          },
          errors: {},
          isLoading: false,
          isTransitioning: false,
          steps: [
            {
              id: TRANSFER_STEPS.RECIPIENT,
              title: "Recipient",
              completed: false,
            },
            { id: TRANSFER_STEPS.AMOUNT, title: "Amount", completed: false },
            {
              id: TRANSFER_STEPS.CONFIRMATION,
              title: "Confirmation",
              completed: false,
            },
            { id: TRANSFER_STEPS.SUCCESS, title: "Success", completed: false },
          ],
        }),

      // Set current user account (called when transfer wizard opens)
      setCurrentUserAccount: (accountNumber) =>
        set({ currentUserAccount: accountNumber }),

      // Account lookup
      lookupAccount: async (accountNumber) => {
        set({ isLoading: true, errors: {} });

        try {
          const { currentUserAccount } = get();

          // Check if trying to transfer to own account
          if (accountNumber === currentUserAccount) {
            set({
              isLoading: false,
              errors: {
                recipientAccount: "Cannot transfer to your own account",
              },
            });
            return { success: false, error: "Cannot transfer to own account" };
          }

          // Simulate API call to lookup account
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Mock account lookup - check against known account numbers
          const mockAccounts = {
            8219837001: "Alfito Doe",
            8219837011: "Alfito Doe",
            8219837002: "Alfrendo Smith",
            8219837012: "Alfrendo Smith",
            8219837003: "Akmal Wilson",
            8219837013: "Akmal Wilson",
            8219837023: "Akmal Wilson",
          };

          const recipientName = mockAccounts[accountNumber];

          if (recipientName) {
            set((state) => ({
              transferData: { ...state.transferData, recipientName },
              isLoading: false,
            }));
            return { success: true, name: recipientName };
          } else {
            set({
              isLoading: false,
              errors: { recipientAccount: "Account number not found" },
            });
            return { success: false, error: "Account not found" };
          }
        } catch (error) {
          set({
            isLoading: false,
            errors: { recipientAccount: "Failed to lookup account" },
          });
          return { success: false, error: error.message };
        }
      },

      // Validation
      validateStep: (step) => {
        const { transferData } = get();
        const errors = {};

        switch (step) {
          case TRANSFER_STEPS.RECIPIENT:
            if (!transferData.recipientAccount) {
              errors.recipientAccount = "Account number is required";
            } else if (!/^\d{10,}$/.test(transferData.recipientAccount)) {
              errors.recipientAccount = "Invalid account number format";
            }
            if (!transferData.recipientName) {
              errors.recipientAccount = "Please lookup the account first";
            }
            break;

          case TRANSFER_STEPS.AMOUNT:
            if (!transferData.amount || transferData.amount <= 0) {
              errors.amount = "Amount must be greater than 0";
            } else if (transferData.amount < 10000) {
              errors.amount = "Minimum transfer amount is Rp 10,000";
            } else if (transferData.amount > 100000000) {
              errors.amount = "Maximum transfer amount is Rp 100,000,000";
            }
            break;
        }

        set({ errors });
        return Object.keys(errors).length === 0;
      },

      // Transfer execution with offline support
      executeTransfer: async (fromAccountNumber) => {
        const { transferData } = get();
        set({ isLoading: true, errors: {} });
        
        // Check if online
        const isOnline = navigator.onLine;
        
        try {
          if (isOnline) {
            // Online: Execute transfer normally
            await transferMoney(
              fromAccountNumber,
              transferData.recipientAccount,
              transferData.amount
            );
          } else {
            // Offline: Save to IndexedDB queue
            const db = await new Promise((resolve, reject) => {
              const request = indexedDB.open('BankTechProDB', 1);
              request.onsuccess = () => resolve(request.result);
              request.onerror = () => reject(request.error);
            });
            
            const tx = db.transaction(['offlineQueue'], 'readwrite');
            const store = tx.objectStore('offlineQueue');
            
            await new Promise((resolve, reject) => {
              const request = store.add({
                type: 'transfer',
                fromAccount: fromAccountNumber,
                toAccount: transferData.recipientAccount,
                amount: transferData.amount,
                description: transferData.description,
                timestamp: Date.now(),
                status: 'pending'
              });
              request.onsuccess = () => resolve();
              request.onerror = () => reject(request.error);
            });
            
            db.close();
            console.log('💾 Transfer saved to offline queue');
          }

          set({
            currentStep: TRANSFER_STEPS.SUCCESS,
            isLoading: false,
            steps: get().steps.map((step) => ({ ...step, completed: true })),
          });
          
          return { 
            success: true, 
            transactionId: `TXN${Date.now()}`,
            offline: !isOnline
          };
        } catch (error) {
          set({
            isLoading: false,
            errors: { general: error.message },
          });
          return { success: false, error: error.message };
        }
      },
    }),
    {
      name: "transfer-wizard-storage",
      partialize: (state) => ({
        transferData: state.transferData,
        currentStep: state.currentStep,
      }),
    }
  )
);

export { TRANSFER_STEPS };
export default useTransferStore;
