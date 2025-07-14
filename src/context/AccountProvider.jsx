// Account Context untuk manage active bank account
import { createContext, useContext, useState, useEffect } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser.jsx";

const AccountContext = createContext();

export function AccountProvider({ children }) {
  const { currentUserData } = useCurrentUser();
  const [activeAccountIndex, setActiveAccountIndex] = useState(0);
  const [activeAccount, setActiveAccount] = useState(null);

  // Update active account when user data changes or index changes
  useEffect(() => {
    if (currentUserData?.bankAccounts?.length > 0) {
      // Find default account or use first account
      const defaultAccount = currentUserData.bankAccounts.find(
        (acc) => acc.isDefault
      );
      const accountToUse = defaultAccount || currentUserData.bankAccounts[0];
      const accountIndex = currentUserData.bankAccounts.indexOf(accountToUse);

      setActiveAccountIndex(accountIndex);
      setActiveAccount(accountToUse);
    }
  }, [currentUserData]);

  // Update active account when index changes
  useEffect(() => {
    if (currentUserData?.bankAccounts?.length > 0) {
      const account = currentUserData.bankAccounts[activeAccountIndex];
      setActiveAccount(account);
    }
  }, [activeAccountIndex, currentUserData]);

  // Switch to specific account
  const switchAccount = (index) => {
    if (currentUserData?.bankAccounts?.[index]) {
      setActiveAccountIndex(index);
    }
  };

  // Get account by account number
  const getAccountByNumber = (accountNumber) => {
    return currentUserData?.bankAccounts?.find(
      (account) => account.accountNumber === accountNumber
    );
  };

  "active account", activeAccount;

  return (
    <AccountContext.Provider
      value={{
        activeAccount,
        activeAccountIndex,
        switchAccount,
        getAccountByNumber,
        allAccounts: currentUserData?.bankAccounts || [],
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within AccountProvider");
  }
  return context;
}
