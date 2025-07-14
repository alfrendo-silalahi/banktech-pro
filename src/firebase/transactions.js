// Firebase Transaction Service
import { ref, push } from 'firebase/database';
import { database } from './config';

// Add transaction record to Firebase
export const addTransactionRecord = async (userId, accountNumber, transactionData) => {
  try {
    const transactionRef = ref(database, `transactions/${userId}/${accountNumber}`);
    const result = await push(transactionRef, {
      ...transactionData,
      timestamp: Date.now(),
      createdAt: new Date().toISOString()
    });
    
    console.log('✅ Transaction record added:', result.key);
    return { success: true, id: result.key };
  } catch (error) {
    console.error('❌ Failed to add transaction record:', error);
    return { success: false, error: error.message };
  }
};

// Add transfer transactions (both sender and receiver)
export const addTransferTransactions = async (
  fromUserId, 
  fromAccountNumber, 
  toUserId, 
  toAccountNumber, 
  amount, 
  fromUserName, 
  toUserName
) => {
  try {
    const timestamp = Date.now();
    const transactionDate = new Date().toISOString();

    // Sender transaction (Expenses) - nomorRekening = target account
    const senderTransaction = {
      nama: `Transfer ke ${toUserName}`,
      nominal: amount,
      tipeTransaksi: 'Expenses', // Uang keluar
      tanggal: transactionDate,
      nomorRekening: toAccountNumber // Rekening lawan (penerima)
    };

    // Receiver transaction (Income) - nomorRekening = source account
    const receiverTransaction = {
      nama: `Transfer dari ${fromUserName}`,
      nominal: amount,
      tipeTransaksi: 'Income', // Uang masuk
      tanggal: transactionDate,
      nomorRekening: fromAccountNumber // Rekening lawan (pengirim)
    };

    // Save both transactions
    await addTransactionRecord(fromUserId, fromAccountNumber, senderTransaction);
    await addTransactionRecord(toUserId, toAccountNumber, receiverTransaction);

    return { success: true, timestamp };
  } catch (error) {
    console.error('❌ Failed to add transfer transactions:', error);
    return { success: false, error: error.message };
  }
};