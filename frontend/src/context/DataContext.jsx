import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import { API_BASE_URL } from '../config/constants';

const DataContext = createContext(null);

const STORAGE_KEY = 'storeiq_saas_data_v1';

const INITIAL_DATA = {
  company: {
    company_id: 'CMP001',
    company_name: 'Demo Trading Ltd.',
    owner_name: 'Admin User',
    email: 'admin@demo.com',
    phone: '+880 1712-345678',
    address: 'Motijheel C/A, Dhaka-1000, Bangladesh',
    plan: 'PRO',
    status: 'ACTIVE'
  },
  stores: [
    { store_id: 'STR001', company_id: 'CMP001', store_name: 'Main Store', location: 'Dhaka, Motijheel', manager_name: 'Rahim Khan', status: 'ACTIVE', created_at: '2026-08-01T10:00:00.000+06:00' },
    { store_id: 'STR002', company_id: 'CMP001', store_name: 'Warehouse', location: 'Dhaka, Uttara', manager_name: 'Karim Ahmed', status: 'ACTIVE', created_at: '2026-08-01T10:00:00.000+06:00' }
  ],
  categories: [
    { category_id: 'CAT001', company_id: 'CMP001', category_name: 'Electronics', description: 'Electronic devices & computers', status: 'ACTIVE', created_at: '2026-08-01T10:00:00.000+06:00' },
    { category_id: 'CAT002', company_id: 'CMP001', category_name: 'Accessories', description: 'Computer & phone accessories', status: 'ACTIVE', created_at: '2026-08-01T10:00:00.000+06:00' },
    { category_id: 'CAT003', company_id: 'CMP001', category_name: 'Furniture', description: 'Ergonomic office furniture', status: 'ACTIVE', created_at: '2026-08-01T10:00:00.000+06:00' },
    { category_id: 'CAT004', company_id: 'CMP001', category_name: 'Cables', description: 'Data & power connectivity cables', status: 'ACTIVE', created_at: '2026-08-01T10:00:00.000+06:00' },
    { category_id: 'CAT005', company_id: 'CMP001', category_name: 'Peripherals', description: 'Keyboards, mice & pointers', status: 'ACTIVE', created_at: '2026-08-01T10:00:00.000+06:00' }
  ],
  products: [
    { product_id: 'PRD001', company_id: 'CMP001', category_id: 'CAT001', product_name: 'Wireless Mouse', sku: 'WM-001', barcode: '89012345001', unit: 'Piece', minimum_stock: 20, maximum_stock: 200, purchase_price: 350, selling_price: 550, status: 'ACTIVE', created_at: '2026-08-01T10:00:00.000+06:00' },
    { product_id: 'PRD002', company_id: 'CMP001', category_id: 'CAT005', product_name: 'Mechanical Keyboard', sku: 'KB-001', barcode: '89012345002', unit: 'Piece', minimum_stock: 15, maximum_stock: 150, purchase_price: 800, selling_price: 1200, status: 'ACTIVE', created_at: '2026-08-01T10:00:00.000+06:00' },
    { product_id: 'PRD003', company_id: 'CMP001', category_id: 'CAT004', product_name: 'USB-C Cable 2m', sku: 'UC-001', barcode: '89012345003', unit: 'Piece', minimum_stock: 50, maximum_stock: 500, purchase_price: 50, selling_price: 120, status: 'ACTIVE', created_at: '2026-08-01T10:00:00.000+06:00' },
    { product_id: 'PRD004', company_id: 'CMP001', category_id: 'CAT001', product_name: '27-inch 4K Monitor', sku: 'MN-001', barcode: '89012345004', unit: 'Piece', minimum_stock: 20, maximum_stock: 50, purchase_price: 12000, selling_price: 15000, status: 'ACTIVE', created_at: '2026-08-01T10:00:00.000+06:00' },
    { product_id: 'PRD005', company_id: 'CMP001', category_id: 'CAT003', product_name: 'Ergonomic Office Chair', sku: 'OC-001', barcode: '89012345005', unit: 'Piece', minimum_stock: 10, maximum_stock: 30, purchase_price: 5000, selling_price: 7500, status: 'ACTIVE', created_at: '2026-08-01T10:00:00.000+06:00' }
  ],
  users: [
    { user_id: 'USR001', company_id: 'CMP001', name: 'Admin User', email: 'admin@demo.com', password: 'demo123', phone: '+880 1711-111111', role: 'COMPANY_ADMIN', store_id: 'STR001', status: 'ACTIVE', created_at: '2026-08-01T10:00:00.000+06:00' },
    { user_id: 'USR002', company_id: 'CMP001', name: 'Rahim Khan', email: 'manager@demo.com', password: 'demo123', phone: '+880 1722-222222', role: 'MANAGER', store_id: 'STR001', status: 'ACTIVE', created_at: '2026-08-01T10:00:00.000+06:00' },
    { user_id: 'USR003', company_id: 'CMP001', name: 'Karim Ahmed', email: 'staff@demo.com', password: 'demo123', phone: '+880 1733-333333', role: 'STAFF', store_id: 'STR002', status: 'ACTIVE', created_at: '2026-08-01T10:00:00.000+06:00' },
    { user_id: 'USR004', company_id: 'CMP001', name: 'Sara Begum', email: 'viewer@demo.com', password: 'demo123', phone: '+880 1744-444444', role: 'VIEWER', store_id: 'STR001', status: 'ACTIVE', created_at: '2026-08-01T10:00:00.000+06:00' }
  ],
  suppliers: [
    { supplier_id: 'SUP001', company_id: 'CMP001', supplier_name: 'Tech Supplies Ltd.', phone: '+880 1711-000001', email: 'sales@techsupplies.com', address: 'BCS Computer City, IDB Bhaban, Dhaka', status: 'ACTIVE', created_at: '2026-08-01T10:00:00.000+06:00' },
    { supplier_id: 'SUP002', company_id: 'CMP001', supplier_name: 'Office World BD', phone: '+880 1811-000002', email: 'info@officeworld.com', address: 'Stadium Market, Dhaka', status: 'ACTIVE', created_at: '2026-08-01T10:00:00.000+06:00' }
  ],
  transactions: [
    { transaction_id: 'TXN-101', company_id: 'CMP001', store_id: 'STR001', product_id: 'PRD001', type: 'IN', quantity: 200, user_id: 'USR001', user_name: 'Admin User', purpose: 'Purchase', reference_id: 'PO-2026-001', note: 'Initial inventory shipment', created_at: '2026-08-10T10:15:00.000+06:00' },
    { transaction_id: 'TXN-102', company_id: 'CMP001', store_id: 'STR001', product_id: 'PRD002', type: 'IN', quantity: 100, user_id: 'USR001', user_name: 'Admin User', purpose: 'Purchase', reference_id: 'PO-2026-001', note: 'Initial shipment from Keychron', created_at: '2026-08-10T10:30:00.000+06:00' },
    { transaction_id: 'TXN-103', company_id: 'CMP001', store_id: 'STR002', product_id: 'PRD003', type: 'IN', quantity: 250, user_id: 'USR001', user_name: 'Admin User', purpose: 'Purchase', reference_id: 'PO-2026-002', note: 'Warehouse bulk batch', created_at: '2026-08-11T11:00:00.000+06:00' },
    { transaction_id: 'TXN-104', company_id: 'CMP001', store_id: 'STR001', product_id: 'PRD004', type: 'IN', quantity: 25, user_id: 'USR001', user_name: 'Admin User', purpose: 'Purchase', reference_id: 'PO-2026-003', note: 'Monitors received from Dell distributor', created_at: '2026-08-12T14:20:00.000+06:00' },
    { transaction_id: 'TXN-105', company_id: 'CMP001', store_id: 'STR001', product_id: 'PRD005', type: 'IN', quantity: 12, user_id: 'USR001', user_name: 'Admin User', purpose: 'Purchase', reference_id: 'PO-2026-004', note: 'Office chairs delivery', created_at: '2026-08-13T09:45:00.000+06:00' },
    { transaction_id: 'TXN-106', company_id: 'CMP001', store_id: 'STR001', product_id: 'PRD001', type: 'OUT', quantity: 50, user_id: 'USR002', user_name: 'Rahim Khan', purpose: 'Sales Order', reference_id: 'INV-2026-089', note: 'Bulk client order dispatch', created_at: '2026-08-20T11:30:00.000+06:00' },
    { transaction_id: 'TXN-107', company_id: 'CMP001', store_id: 'STR001', product_id: 'PRD002', type: 'OUT', quantity: 20, user_id: 'USR003', user_name: 'Karim Ahmed', purpose: 'Office Deployment', reference_id: 'REQ-045', note: 'Development team setup', created_at: '2026-08-21T15:10:00.000+06:00' },
    { transaction_id: 'TXN-108', company_id: 'CMP001', store_id: 'STR002', product_id: 'PRD003', type: 'OUT', quantity: 50, user_id: 'USR003', user_name: 'Karim Ahmed', purpose: 'Sales Order', reference_id: 'INV-2026-092', note: 'Accessories store delivery', created_at: '2026-08-22T13:40:00.000+06:00' },
    { transaction_id: 'TXN-109', company_id: 'CMP001', store_id: 'STR001', product_id: 'PRD004', type: 'OUT', quantity: 10, user_id: 'USR002', user_name: 'Rahim Khan', purpose: 'Corporate Client', reference_id: 'INV-2026-095', note: 'Delivered to Grameenphone office', created_at: '2026-08-23T16:00:00.000+06:00' },
    { transaction_id: 'TXN-110', company_id: 'CMP001', store_id: 'STR001', product_id: 'PRD005', type: 'OUT', quantity: 7, user_id: 'USR002', user_name: 'Rahim Khan', purpose: 'Branch Deployment', reference_id: 'REQ-048', note: 'Executive cabin chairs', created_at: '2026-08-24T12:15:00.000+06:00' },
    { transaction_id: 'TXN-111', company_id: 'CMP001', store_id: 'STR001', product_id: 'PRD001', type: 'OUT', quantity: 5, user_id: 'USR002', user_name: 'Rahim Khan', purpose: 'Client Demo', reference_id: 'REQ-052', note: 'Rahim took 5 Wireless Mouse for demo booth', created_at: '2026-08-26T14:35:00.000+06:00' }
  ],
  transfers: [
    {
      transfer_id: 'TRF-001',
      company_id: 'CMP001',
      product_id: 'PRD003',
      product_name: 'USB-C Cable 2m',
      from_store_id: 'STR002',
      from_store_name: 'Warehouse',
      to_store_id: 'STR001',
      to_store_name: 'Main Store',
      quantity: 20,
      requested_by_id: 'USR002',
      requested_by_name: 'Rahim Khan',
      approved_by_id: 'USR001',
      approved_by_name: 'Admin User',
      status: 'COMPLETED',
      note: 'Transfer stock to satisfy retail customer rush',
      created_at: '2026-08-25T09:00:00.000+06:00',
      completed_at: '2026-08-25T11:30:00.000+06:00'
    },
    {
      transfer_id: 'TRF-002',
      company_id: 'CMP001',
      product_id: 'PRD002',
      product_name: 'Mechanical Keyboard',
      from_store_id: 'STR001',
      from_store_name: 'Main Store',
      to_store_id: 'STR002',
      to_store_name: 'Warehouse',
      quantity: 10,
      requested_by_id: 'USR003',
      requested_by_name: 'Karim Ahmed',
      approved_by_id: '',
      approved_by_name: '',
      status: 'PENDING',
      note: 'Rebalancing inventory buffer',
      created_at: '2026-08-26T10:00:00.000+06:00',
      completed_at: ''
    }
  ],
  auditLogs: [
    { log_id: 'LOG-001', company_id: 'CMP001', user_id: 'USR001', user_name: 'Admin User', action: 'LOGIN', module: 'AUTH', record_id: 'USR001', details: 'User signed in successfully', ip: '103.112.54.12', created_at: '2026-08-26T09:00:00.000+06:00' },
    { log_id: 'LOG-002', company_id: 'CMP001', user_id: 'USR002', user_name: 'Rahim Khan', action: 'STOCK_OUT', module: 'STOCK', record_id: 'TXN-111', details: 'Issued 5 units of Wireless Mouse (WM-001)', ip: '103.112.54.18', created_at: '2026-08-26T14:35:00.000+06:00' },
    { log_id: 'LOG-003', company_id: 'CMP001', user_id: 'USR003', user_name: 'Karim Ahmed', action: 'TRANSFER_REQUEST', module: 'TRANSFER', record_id: 'TRF-002', details: 'Requested 10 units of Mechanical Keyboard', ip: '103.112.54.20', created_at: '2026-08-26T10:00:00.000+06:00' }
  ],
  settings: {
    allow_negative_stock: false,
    default_timezone: 'Asia/Dhaka',
    currency: 'BDT',
    currency_symbol: '৳',
    default_min_stock: 10,
    default_unit: 'Piece'
  }
};

export function DataProvider({ children }) {
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved data', e);
    }
    return INITIAL_DATA;
  });

  // Push latest state to central cloud endpoint
  const pushToCloud = async (updatedData) => {
    if (!API_BASE_URL) return;
    try {
      await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_data', payload: updatedData })
      });
    } catch (e) {
      console.error('Failed to push to central cloud', e);
    }
  };

  // Pull latest state from central cloud endpoint
  const syncLiveCloud = useCallback(async () => {
    if (!API_BASE_URL) return;
    setIsSyncing(true);
    try {
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_data' })
      });
      const result = await res.json();
      if (result && result.success && result.data && result.data.products) {
        setData(result.data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data));
      } else {
        // If central script has no data yet, push initial dataset
        await pushToCloud(data);
      }
    } catch (e) {
      console.error('Failed to sync live cloud data', e);
    } finally {
      setIsSyncing(false);
    }
  }, [data]);

  // Initial cloud sync & periodic sync interval (every 15 seconds)
  useEffect(() => {
    syncLiveCloud();
    const interval = setInterval(() => {
      syncLiveCloud();
    }, 15000);

    const handleFocus = () => syncLiveCloud();
    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  // Update state locally & broadcast to cloud
  const updateDataState = (updater) => {
    setData(prev => {
      const nextData = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
      pushToCloud(nextData);
      return nextData;
    });
  };

  // LEDGER CALCULATION: Sum(IN, ADJUSTMENT_IN, TRANSFER_IN) - Sum(OUT, ADJUSTMENT_OUT, TRANSFER_OUT)
  const getProductStock = (productId, storeId = null) => {
    const inTypes = ['IN', 'ADJUSTMENT_IN', 'TRANSFER_IN'];
    const outTypes = ['OUT', 'ADJUSTMENT_OUT', 'TRANSFER_OUT'];

    return data.transactions.reduce((acc, txn) => {
      if (txn.product_id !== productId) return acc;
      if (storeId && txn.store_id !== storeId) return acc;

      const qty = Number(txn.quantity) || 0;
      if (inTypes.includes(txn.type)) return acc + qty;
      if (outTypes.includes(txn.type)) return acc - qty;
      return acc;
    }, 0);
  };

  const getAllProductsWithStock = (storeId = null) => {
    return data.products.map(product => {
      const currentStock = getProductStock(product.product_id, storeId);
      const min = Number(product.minimum_stock) || 0;
      const purchasePrice = Number(product.purchase_price) || 0;
      
      let stockStatus = 'In Stock';
      if (currentStock <= 0) {
        stockStatus = 'Out of Stock';
      } else if (currentStock <= min) {
        stockStatus = 'Low Stock';
      }

      const category = data.categories.find(c => c.category_id === product.category_id);

      return {
        ...product,
        current_stock: currentStock,
        stock_status: stockStatus,
        category_name: category ? category.category_name : 'General',
        valuation: currentStock * purchasePrice,
        shortage: Math.max(0, min - currentStock)
      };
    });
  };

  const getDashboardStats = () => {
    const productsWithStock = getAllProductsWithStock();
    const totalProducts = data.products.filter(p => p.status === 'ACTIVE').length;
    const totalStockUnits = productsWithStock.reduce((sum, p) => sum + Math.max(0, p.current_stock), 0);
    const lowStockCount = productsWithStock.filter(p => p.stock_status === 'Low Stock' || p.stock_status === 'Out of Stock').length;
    
    // Today's IN & OUT
    const todayStr = new Date().toISOString().substring(0, 10);
    const todayTransactions = data.transactions.filter(t => (t.created_at || '').substring(0, 10) === todayStr);
    
    const todayIn = todayTransactions
      .filter(t => ['IN', 'ADJUSTMENT_IN', 'TRANSFER_IN'].includes(t.type))
      .reduce((sum, t) => sum + (Number(t.quantity) || 0), 0);

    const todayOut = todayTransactions
      .filter(t => ['OUT', 'ADJUSTMENT_OUT', 'TRANSFER_OUT'].includes(t.type))
      .reduce((sum, t) => sum + (Number(t.quantity) || 0), 0);

    const storeCount = data.stores.filter(s => s.status === 'ACTIVE').length;
    const staffCount = data.users.filter(u => u.status === 'ACTIVE').length;
    const totalValuation = productsWithStock.reduce((sum, p) => sum + p.valuation, 0);

    return {
      totalProducts,
      totalStockUnits,
      lowStockCount,
      todayIn,
      todayOut,
      storeCount,
      staffCount,
      totalValuation
    };
  };

  const getLowStockAlerts = () => {
    return getAllProductsWithStock().filter(p => p.stock_status === 'Low Stock' || p.stock_status === 'Out of Stock');
  };

  const getRecentActivities = (limit = 10) => {
    return [...data.transactions]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit)
      .map(txn => {
        const product = data.products.find(p => p.product_id === txn.product_id);
        const store = data.stores.find(s => s.store_id === txn.store_id);
        return {
          ...txn,
          product_name: product ? product.product_name : 'Unknown Product',
          store_name: store ? store.store_name : 'Unknown Store'
        };
      });
  };

  const addAuditLog = (action, module, recordId, details) => {
    const newLog = {
      log_id: `LOG-${Date.now()}`,
      company_id: data.company.company_id,
      user_id: user?.user_id || 'USR001',
      user_name: user?.name || 'Admin User',
      action,
      module,
      record_id: recordId,
      details,
      ip: '103.112.54.' + Math.floor(Math.random() * 50 + 1),
      created_at: new Date().toISOString()
    };
    updateDataState(prev => ({
      ...prev,
      auditLogs: [newLog, ...prev.auditLogs]
    }));
  };

  // MUTATIONS

  const recordStockIn = ({ store_id, product_id, quantity, supplier_id, reference_id, note }) => {
    const qty = Number(quantity);
    if (!qty || qty <= 0) throw new Error('Quantity must be greater than 0');
    if (!store_id) throw new Error('Please select a store');
    if (!product_id) throw new Error('Please select a product');

    const product = data.products.find(p => p.product_id === product_id);
    const store = data.stores.find(s => s.store_id === store_id);

    const newTxn = {
      transaction_id: `TXN-${Date.now()}`,
      company_id: data.company.company_id,
      store_id,
      product_id,
      type: 'IN',
      quantity: qty,
      user_id: user?.user_id || 'USR001',
      user_name: user?.name || 'Admin User',
      purpose: 'Stock In / Procurement',
      reference_id: reference_id || `PO-${Date.now().toString().slice(-4)}`,
      note: note || '',
      created_at: new Date().toISOString()
    };

    updateDataState(prev => ({
      ...prev,
      transactions: [newTxn, ...prev.transactions]
    }));

    addAuditLog('STOCK_IN', 'STOCK', newTxn.transaction_id, `Received ${qty} units of ${product?.product_name || product_id} at ${store?.store_name || store_id}`);
    return newTxn;
  };

  const recordStockOut = ({ store_id, product_id, quantity, purpose, taken_by, note }) => {
    const qty = Number(quantity);
    if (!qty || qty <= 0) throw new Error('Quantity must be greater than 0');
    if (!store_id) throw new Error('Please select a store');
    if (!product_id) throw new Error('Please select a product');

    const currentStock = getProductStock(product_id, store_id);
    if (!data.settings.allow_negative_stock && qty > currentStock) {
      throw new Error(`Insufficient stock available in this store. Current available: ${currentStock} units, Requested: ${qty} units.`);
    }

    const product = data.products.find(p => p.product_id === product_id);
    const store = data.stores.find(s => s.store_id === store_id);

    const newTxn = {
      transaction_id: `TXN-${Date.now()}`,
      company_id: data.company.company_id,
      store_id,
      product_id,
      type: 'OUT',
      quantity: qty,
      user_id: user?.user_id || 'USR001',
      user_name: taken_by || user?.name || 'Admin User',
      purpose: purpose || 'Stock Out / Dispatch',
      reference_id: `OUT-${Date.now().toString().slice(-4)}`,
      note: note || '',
      created_at: new Date().toISOString()
    };

    updateDataState(prev => ({
      ...prev,
      transactions: [newTxn, ...prev.transactions]
    }));

    addAuditLog('STOCK_OUT', 'STOCK', newTxn.transaction_id, `Issued ${qty} units of ${product?.product_name || product_id} by ${taken_by || user?.name} (${purpose})`);
    return newTxn;
  };

  const createTransferRequest = ({ product_id, from_store_id, to_store_id, quantity, note }) => {
    const qty = Number(quantity);
    if (!qty || qty <= 0) throw new Error('Quantity must be greater than 0');
    if (!from_store_id || !to_store_id) throw new Error('Please select both source and destination stores');
    if (from_store_id === to_store_id) throw new Error('Source and Destination stores cannot be the same');

    const currentStock = getProductStock(product_id, from_store_id);
    if (!data.settings.allow_negative_stock && qty > currentStock) {
      throw new Error(`Insufficient stock in source store. Available: ${currentStock}, Requested: ${qty}`);
    }

    const product = data.products.find(p => p.product_id === product_id);
    const fromStore = data.stores.find(s => s.store_id === from_store_id);
    const toStore = data.stores.find(s => s.store_id === to_store_id);

    const newTransfer = {
      transfer_id: `TRF-${Date.now()}`,
      company_id: data.company.company_id,
      product_id,
      product_name: product ? product.product_name : product_id,
      from_store_id,
      from_store_name: fromStore ? fromStore.store_name : from_store_id,
      to_store_id,
      to_store_name: toStore ? toStore.store_name : to_store_id,
      quantity: qty,
      requested_by_id: user?.user_id || 'USR001',
      requested_by_name: user?.name || 'Admin User',
      approved_by_id: '',
      approved_by_name: '',
      status: 'PENDING',
      note: note || '',
      created_at: new Date().toISOString(),
      completed_at: ''
    };

    updateDataState(prev => ({
      ...prev,
      transfers: [newTransfer, ...prev.transfers]
    }));

    addAuditLog('TRANSFER_REQUEST', 'TRANSFER', newTransfer.transfer_id, `Transfer request: ${qty} units of ${newTransfer.product_name} from ${newTransfer.from_store_name} to ${newTransfer.to_store_name}`);
    return newTransfer;
  };

  const approveTransfer = (transfer_id) => {
    updateDataState(prev => ({
      ...prev,
      transfers: prev.transfers.map(t => {
        if (t.transfer_id === transfer_id) {
          return {
            ...t,
            status: 'APPROVED',
            approved_by_id: user?.user_id || 'USR001',
            approved_by_name: user?.name || 'Admin User'
          };
        }
        return t;
      })
    }));
    addAuditLog('TRANSFER_APPROVE', 'TRANSFER', transfer_id, `Approved transfer ${transfer_id}`);
  };

  const completeTransfer = (transfer_id) => {
    const transfer = data.transfers.find(t => t.transfer_id === transfer_id);
    if (!transfer) throw new Error('Transfer not found');

    const txnOut = {
      transaction_id: `TXN-OUT-${Date.now()}`,
      company_id: data.company.company_id,
      store_id: transfer.from_store_id,
      product_id: transfer.product_id,
      type: 'TRANSFER_OUT',
      quantity: transfer.quantity,
      user_id: user?.user_id || 'USR001',
      user_name: user?.name || 'Admin User',
      purpose: 'Transfer to ' + transfer.to_store_name,
      reference_id: transfer.transfer_id,
      note: `Inter-store transfer to ${transfer.to_store_name}`,
      created_at: new Date().toISOString()
    };

    const txnIn = {
      transaction_id: `TXN-IN-${Date.now() + 1}`,
      company_id: data.company.company_id,
      store_id: transfer.to_store_id,
      product_id: transfer.product_id,
      type: 'TRANSFER_IN',
      quantity: transfer.quantity,
      user_id: user?.user_id || 'USR001',
      user_name: user?.name || 'Admin User',
      purpose: 'Transfer from ' + transfer.from_store_name,
      reference_id: transfer.transfer_id,
      note: `Inter-store transfer from ${transfer.from_store_name}`,
      created_at: new Date().toISOString()
    };

    updateDataState(prev => ({
      ...prev,
      transactions: [txnIn, txnOut, ...prev.transactions],
      transfers: prev.transfers.map(t => {
        if (t.transfer_id === transfer_id) {
          return {
            ...t,
            status: 'COMPLETED',
            completed_at: new Date().toISOString()
          };
        }
        return t;
      })
    }));

    addAuditLog('TRANSFER_COMPLETE', 'TRANSFER', transfer_id, `Completed transfer ${transfer_id}: Moved ${transfer.quantity} units of ${transfer.product_name}`);
  };

  const cancelTransfer = (transfer_id) => {
    updateDataState(prev => ({
      ...prev,
      transfers: prev.transfers.map(t => {
        if (t.transfer_id === transfer_id) {
          return { ...t, status: 'CANCELLED' };
        }
        return t;
      })
    }));
    addAuditLog('TRANSFER_CANCEL', 'TRANSFER', transfer_id, `Cancelled transfer ${transfer_id}`);
  };

  const addProduct = (productData) => {
    const existing = data.products.find(p => p.sku.toLowerCase() === (productData.sku || '').toLowerCase());
    if (existing) {
      throw new Error(`A product with SKU "${productData.sku}" already exists.`);
    }

    const newProduct = {
      product_id: `PRD-${Date.now().toString().slice(-5)}`,
      company_id: data.company.company_id,
      product_name: productData.product_name,
      sku: productData.sku,
      barcode: productData.barcode || '',
      category_id: productData.category_id || data.categories[0]?.category_id,
      unit: productData.unit || 'Piece',
      minimum_stock: Number(productData.minimum_stock) || 10,
      maximum_stock: Number(productData.maximum_stock) || 100,
      purchase_price: Number(productData.purchase_price) || 0,
      selling_price: Number(productData.selling_price) || 0,
      status: productData.status || 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    let initialTxn = null;
    if (Number(productData.initial_stock) > 0) {
      const storeId = productData.store_id || data.stores[0]?.store_id;
      initialTxn = {
        transaction_id: `TXN-${Date.now()}`,
        company_id: data.company.company_id,
        store_id: storeId,
        product_id: newProduct.product_id,
        type: 'IN',
        quantity: Number(productData.initial_stock),
        user_id: user?.user_id || 'USR001',
        user_name: user?.name || 'Admin User',
        purpose: 'Initial Stock',
        reference_id: 'INIT-SETUP',
        note: 'Initial balance on product creation',
        created_at: new Date().toISOString()
      };
    }

    updateDataState(prev => ({
      ...prev,
      products: [newProduct, ...prev.products],
      transactions: initialTxn ? [initialTxn, ...prev.transactions] : prev.transactions
    }));

    addAuditLog('CREATE_PRODUCT', 'PRODUCT', newProduct.product_id, `Created product "${newProduct.product_name}" (SKU: ${newProduct.sku})`);
    return newProduct;
  };

  const updateProduct = (product_id, updates) => {
    updateDataState(prev => ({
      ...prev,
      products: prev.products.map(p => {
        if (p.product_id === product_id) {
          return {
            ...p,
            ...updates,
            updated_at: new Date().toISOString()
          };
        }
        return p;
      })
    }));
    addAuditLog('UPDATE_PRODUCT', 'PRODUCT', product_id, `Updated product fields`);
  };

  const deactivateProduct = (product_id) => {
    updateDataState(prev => ({
      ...prev,
      products: prev.products.map(p => p.product_id === product_id ? { ...p, status: 'INACTIVE' } : p)
    }));
    addAuditLog('DEACTIVATE_PRODUCT', 'PRODUCT', product_id, `Deactivated product`);
  };

  const deleteProductPermanently = (product_id) => {
    const product = data.products.find(p => p.product_id === product_id);
    updateDataState(prev => ({
      ...prev,
      products: prev.products.filter(p => p.product_id !== product_id)
    }));
    addAuditLog('DELETE_PRODUCT', 'PRODUCT', product_id, `Permanently deleted product "${product ? product.product_name : product_id}"`);
  };

  const addCategory = (catData) => {
    const newCat = {
      category_id: `CAT-${Date.now().toString().slice(-4)}`,
      company_id: data.company.company_id,
      category_name: catData.category_name,
      description: catData.description || '',
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    };
    updateDataState(prev => ({ ...prev, categories: [...prev.categories, newCat] }));
    addAuditLog('CREATE_CATEGORY', 'CATEGORY', newCat.category_id, `Created category "${newCat.category_name}"`);
    return newCat;
  };

  const updateCategory = (category_id, updates) => {
    updateDataState(prev => ({
      ...prev,
      categories: prev.categories.map(c => c.category_id === category_id ? { ...c, ...updates } : c)
    }));
    addAuditLog('UPDATE_CATEGORY', 'CATEGORY', category_id, `Updated category`);
  };

  const addStore = (storeData) => {
    const newStore = {
      store_id: `STR-${Date.now().toString().slice(-4)}`,
      company_id: data.company.company_id,
      store_name: storeData.store_name,
      location: storeData.location || '',
      manager_name: storeData.manager_name || '',
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    };
    updateDataState(prev => ({ ...prev, stores: [...prev.stores, newStore] }));
    addAuditLog('CREATE_STORE', 'STORE', newStore.store_id, `Created store "${newStore.store_name}"`);
    return newStore;
  };

  const updateStore = (store_id, updates) => {
    updateDataState(prev => ({
      ...prev,
      stores: prev.stores.map(s => s.store_id === store_id ? { ...s, ...updates } : s)
    }));
    addAuditLog('UPDATE_STORE', 'STORE', store_id, `Updated store`);
  };

  const addUser = (userData) => {
    const newUser = {
      user_id: `USR-${Date.now().toString().slice(-4)}`,
      company_id: data.company.company_id,
      name: userData.name,
      email: userData.email,
      password: userData.password || 'demo123',
      phone: userData.phone || '',
      role: userData.role || 'STAFF',
      store_id: userData.store_id || data.stores[0]?.store_id,
      status: userData.status || 'ACTIVE',
      created_at: new Date().toISOString()
    };
    updateDataState(prev => ({ ...prev, users: [...prev.users, newUser] }));
    addAuditLog('CREATE_USER', 'USER', newUser.user_id, `Added user ${newUser.name} with role ${newUser.role}`);
    return newUser;
  };

  const updateUser = (user_id, updates) => {
    updateDataState(prev => ({
      ...prev,
      users: prev.users.map(u => u.user_id === user_id ? { ...u, ...updates } : u)
    }));
    addAuditLog('UPDATE_USER', 'USER', user_id, `Updated user details`);
  };

  const deleteUser = (user_id) => {
    const target = data.users.find(u => u.user_id === user_id);
    updateDataState(prev => ({
      ...prev,
      users: prev.users.filter(u => u.user_id !== user_id)
    }));
    addAuditLog('DELETE_USER', 'USER', user_id, `Permanently deleted user "${target ? target.name : user_id}"`);
  };

  const addSupplier = (supData) => {
    const newSupplier = {
      supplier_id: `SUP-${Date.now().toString().slice(-4)}`,
      company_id: data.company.company_id,
      supplier_name: supData.supplier_name,
      phone: supData.phone || '',
      email: supData.email || '',
      address: supData.address || '',
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    };
    updateDataState(prev => ({ ...prev, suppliers: [...prev.suppliers, newSupplier] }));
    addAuditLog('CREATE_SUPPLIER', 'SUPPLIER', newSupplier.supplier_id, `Added supplier "${newSupplier.supplier_name}"`);
    return newSupplier;
  };

  const updateSupplier = (supplier_id, updates) => {
    updateDataState(prev => ({
      ...prev,
      suppliers: prev.suppliers.map(s => s.supplier_id === supplier_id ? { ...s, ...updates } : s)
    }));
    addAuditLog('UPDATE_SUPPLIER', 'SUPPLIER', supplier_id, `Updated supplier`);
  };

  const updateCompany = (updates) => {
    updateDataState(prev => ({
      ...prev,
      company: { ...prev.company, ...updates }
    }));
    addAuditLog('UPDATE_COMPANY', 'COMPANY', data.company.company_id, `Updated company profile`);
  };

  const updateSettings = (updates) => {
    updateDataState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
    addAuditLog('UPDATE_SETTINGS', 'SETTINGS', 'CONFIG', `Updated system settings`);
  };

  const resetToDemoData = () => {
    updateDataState(INITIAL_DATA);
  };

  return (
    <DataContext.Provider value={{
      data,
      isSyncing,
      syncLiveCloud,
      company: data.company,
      stores: data.stores,
      categories: data.categories,
      products: data.products,
      users: data.users,
      suppliers: data.suppliers,
      transactions: data.transactions,
      transfers: data.transfers,
      auditLogs: data.auditLogs,
      settings: data.settings,
      getProductStock,
      getAllProductsWithStock,
      getDashboardStats,
      getLowStockAlerts,
      getRecentActivities,
      recordStockIn,
      recordStockOut,
      createTransferRequest,
      approveTransfer,
      completeTransfer,
      cancelTransfer,
      addProduct,
      updateProduct,
      deactivateProduct,
      deleteProductPermanently,
      addCategory,
      updateCategory,
      addStore,
      updateStore,
      addUser,
      updateUser,
      deleteUser,
      addSupplier,
      updateSupplier,
      updateCompany,
      updateSettings,
      resetToDemoData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
