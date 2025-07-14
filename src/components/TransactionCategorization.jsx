// Transaction Categorization Component with Drag & Drop
import { useState, useRef } from 'react';
import { useCategories } from '../hooks/useCategories.jsx';
import { useActivity } from '../context/ActivityProvider';
import { useAccount } from '../context/AccountProvider.jsx';
import { useFirebaseTransactions } from '../hooks/useFirebaseTransactions.jsx';

export default function TransactionCategorization() {
  const { activeAccount } = useAccount();
  const { transactions } = useFirebaseTransactions(activeAccount?.accountNumber);
  const { 
    categories, 
    assignCategory, 
    getTransactionCategory, 
    getSpendingSummary,
    addCategory 
  } = useCategories();
  const { logActivity } = useActivity();
  
  const [draggedTransaction, setDraggedTransaction] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', color: '#3b82f6', icon: '📦' });

  const spendingSummary = getSpendingSummary(transactions.filter(t => t.tipeTransaksi === 'Expenses'));

  // Drag handlers
  const handleDragStart = (e, transaction) => {
    setDraggedTransaction(transaction);
    e.dataTransfer.effectAllowed = 'move';
    logActivity('drag_start', 'transaction', { transactionId: transaction.id });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, categoryId) => {
    e.preventDefault();
    
    if (draggedTransaction) {
      assignCategory(draggedTransaction.id, categoryId);
      logActivity('category_assigned', 'transaction', { 
        transactionId: draggedTransaction.id, 
        categoryId 
      });
      setDraggedTransaction(null);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      addCategory(newCategory);
      setNewCategory({ name: '', color: '#3b82f6', icon: '📦' });
      setShowAddCategory(false);
      logActivity('category_created', 'preference', { categoryName: newCategory.name });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Transaction Categorization</h3>
          {activeAccount && (
            <p className="text-sm text-gray-500 mt-1">
              {activeAccount.accountType} Account - {activeAccount.accountNumber}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowAddCategory(true)}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          + Add Category
        </button>
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h4 className="text-lg font-semibold mb-4">Add New Category</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Category name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <input
                  type="text"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="📦"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddCategory(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-4">Categories</h4>
          <div className="space-y-3">
            {categories.map((category) => {
              const categoryTransactions = transactions.filter(t => 
                getTransactionCategory(t.id)?.id === category.id
              );
              
              return (
                <div
                  key={category.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, category.id)}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-all duration-200 hover:bg-blue-50"
                  style={{ borderColor: draggedTransaction ? category.color : undefined }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800">{category.name}</h5>
                      <div className="flex items-center gap-2 mt-1">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="text-xs text-gray-500">
                          {categoryTransactions.length} transactions
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Show categorized transactions */}
                  {categoryTransactions.length > 0 && (
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {categoryTransactions.slice(0, 3).map((transaction) => (
                        <div
                          key={transaction.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, transaction)}
                          className="p-2 bg-white rounded text-xs cursor-move hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700 truncate">
                              {transaction.nama}
                            </span>
                            <span className={`font-medium ${
                              transaction.tipeTransaksi === 'Income' 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0,
                                notation: 'compact'
                              }).format(transaction.nominal)}
                            </span>
                          </div>
                        </div>
                      ))}
                      {categoryTransactions.length > 3 && (
                        <div className="text-xs text-gray-500 text-center py-1">
                          +{categoryTransactions.length - 3} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Uncategorized Transactions */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-4">
            Uncategorized Transactions ({transactions.filter(t => !getTransactionCategory(t.id)).length})
          </h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {transactions
              .filter(transaction => !getTransactionCategory(transaction.id))
              .slice(0, 10)
              .map((transaction) => (
                <div
                  key={transaction.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, transaction)}
                  className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors duration-200 hover:shadow-md"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{transaction.nama}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.tanggal).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        transaction.tipeTransaksi === 'Income' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.tipeTransaksi === 'Income' ? '+' : '-'}
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0
                        }).format(transaction.nominal)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        {/* All Categorized Transactions */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-4">
            All Categorized ({transactions.filter(t => getTransactionCategory(t.id)).length})
          </h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {transactions
              .filter(transaction => getTransactionCategory(transaction.id))
              .slice(0, 15)
              .map((transaction) => {
                const category = getTransactionCategory(transaction.id);
                return (
                  <div
                    key={transaction.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, transaction)}
                    className="p-3 bg-white border rounded-lg cursor-move hover:bg-gray-50 transition-colors duration-200 hover:shadow-md"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">{category?.icon}</span>
                          <span 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: category?.color }}
                          ></span>
                          <span className="text-xs text-gray-500">{category?.name}</span>
                        </div>
                        <p className="font-medium text-gray-800 text-sm">{transaction.nama}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.tanggal).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium text-sm ${
                          transaction.tipeTransaksi === 'Income' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {transaction.tipeTransaksi === 'Income' ? '+' : '-'}
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                            notation: 'compact'
                          }).format(transaction.nominal)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Spending Summary */}
      {spendingSummary.length > 0 && (
        <div className="mt-8">
          <h4 className="text-md font-medium text-gray-700 mb-4">Spending Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {spendingSummary.slice(0, 4).map((item) => (
              <div key={item.category.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{item.category.icon}</span>
                  <h5 className="font-medium text-gray-800 text-sm">{item.category.name}</h5>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  }).format(item.total)}
                </p>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{item.count} transactions</span>
                  <span>{item.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: item.category.color 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}