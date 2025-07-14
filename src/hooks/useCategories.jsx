// Custom hook for transaction categorization
import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage.jsx';

const DEFAULT_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', color: '#ef4444', icon: '🍽️' },
  { id: 'transport', name: 'Transportation', color: '#3b82f6', icon: '🚗' },
  { id: 'shopping', name: 'Shopping', color: '#8b5cf6', icon: '🛍️' },
  { id: 'entertainment', name: 'Entertainment', color: '#f59e0b', icon: '🎬' },
  { id: 'bills', name: 'Bills & Utilities', color: '#10b981', icon: '💡' },
  { id: 'health', name: 'Healthcare', color: '#ec4899', icon: '🏥' },
  { id: 'education', name: 'Education', color: '#6366f1', icon: '📚' },
  { id: 'other', name: 'Other', color: '#6b7280', icon: '📦' }
];

export function useCategories() {
  const [categories, setCategories] = useLocalStorage('transaction_categories', DEFAULT_CATEGORIES);
  const [transactionCategories, setTransactionCategories] = useLocalStorage('transaction_category_mapping', {});

  // Add new category
  const addCategory = useCallback((categoryData) => {
    const newCategory = {
      id: Date.now().toString(),
      ...categoryData,
      createdAt: new Date().toISOString()
    };
    
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  }, [setCategories]);

  // Update category
  const updateCategory = useCallback((categoryId, updates) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId ? { ...cat, ...updates } : cat
      )
    );
  }, [setCategories]);

  // Delete category
  const deleteCategory = useCallback((categoryId) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    
    // Remove category assignments
    setTransactionCategories(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(transactionId => {
        if (updated[transactionId] === categoryId) {
          delete updated[transactionId];
        }
      });
      return updated;
    });
  }, [setCategories, setTransactionCategories]);

  // Assign category to transaction
  const assignCategory = useCallback((transactionId, categoryId) => {
    setTransactionCategories(prev => ({
      ...prev,
      [transactionId]: categoryId
    }));
  }, [setTransactionCategories]);

  // Get category for transaction
  const getTransactionCategory = useCallback((transactionId) => {
    const categoryId = transactionCategories[transactionId];
    return categories.find(cat => cat.id === categoryId) || null;
  }, [categories, transactionCategories]);

  // Get transactions by category
  const getTransactionsByCategory = useCallback((transactions) => {
    const categorized = {};
    const uncategorized = [];

    transactions.forEach(transaction => {
      const category = getTransactionCategory(transaction.id);
      if (category) {
        if (!categorized[category.id]) {
          categorized[category.id] = {
            category,
            transactions: [],
            total: 0
          };
        }
        categorized[category.id].transactions.push(transaction);
        categorized[category.id].total += transaction.nominal;
      } else {
        uncategorized.push(transaction);
      }
    });

    return { categorized, uncategorized };
  }, [getTransactionCategory]);

  // Get spending summary by category
  const getSpendingSummary = useCallback((transactions) => {
    const { categorized } = getTransactionsByCategory(transactions);
    const summary = Object.values(categorized).map(({ category, total, transactions }) => ({
      category,
      total,
      count: transactions.length,
      percentage: 0 // Will be calculated after total sum
    }));

    const totalSpending = summary.reduce((sum, item) => sum + item.total, 0);
    
    return summary.map(item => ({
      ...item,
      percentage: totalSpending > 0 ? (item.total / totalSpending) * 100 : 0
    })).sort((a, b) => b.total - a.total);
  }, [getTransactionsByCategory]);

  return {
    categories,
    transactionCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    assignCategory,
    getTransactionCategory,
    getTransactionsByCategory,
    getSpendingSummary
  };
}