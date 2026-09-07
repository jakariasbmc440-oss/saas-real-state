// --- config/Config.gs ---
var CONFIG = {
  SPREADSHEET_ID: '1xUiF2JWqy1kPRDYuzo3P3o8uZAbjS3yDP6MMucCm4w', // Will be set during deployment
  SHEET_NAMES: {
    COMPANIES: 'Companies',
    USERS: 'Users',
    STORES: 'Stores',
    CATEGORIES: 'Categories',
    PRODUCTS: 'Products',
    STOCK_TRANSACTIONS: 'Stock_Transactions',
    STOCK_TRANSFERS: 'Stock_Transfers',
    SUPPLIERS: 'Suppliers',
    PURCHASES: 'Purchases',
    AUDIT_LOGS: 'Audit_Logs',
    SETTINGS: 'Settings',
    SESSIONS: 'Sessions'
  },
  ROLES: {
    SUPER_ADMIN: 'SUPER_ADMIN',
    COMPANY_ADMIN: 'COMPANY_ADMIN',
    MANAGER: 'MANAGER',
    STAFF: 'STAFF',
    VIEWER: 'VIEWER'
  },
  TRANSACTION_TYPES: {
    IN: 'IN',
    OUT: 'OUT',
    ADJUSTMENT_IN: 'ADJUSTMENT_IN',
    ADJUSTMENT_OUT: 'ADJUSTMENT_OUT',
    TRANSFER_IN: 'TRANSFER_IN',
    TRANSFER_OUT: 'TRANSFER_OUT'
  },
  TRANSFER_STATUSES: {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
  },
  RECORD_STATUS: {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
  },
  PLANS: {
    FREE: 'FREE',
    BASIC: 'BASIC',
    PRO: 'PRO'
  },
  SESSION_DURATION_HOURS: 24,
  DEFAULT_TIMEZONE: 'Asia/Dhaka',
  ITEMS_PER_PAGE: 50
};

var COLUMNS = {
  COMPANIES: ['company_id', 'company_name', 'owner_name', 'email', 'phone', 'address', 'plan', 'status', 'created_at', 'updated_at'],
  USERS: ['user_id', 'company_id', 'name', 'email', 'password_hash', 'phone', 'role', 'store_id', 'status', 'created_at', 'updated_at'],
  STORES: ['store_id', 'company_id', 'store_name', 'location', 'manager_id', 'status', 'created_at', 'updated_at'],
  CATEGORIES: ['category_id', 'company_id', 'category_name', 'description', 'status', 'created_at', 'updated_at'],
  PRODUCTS: ['product_id', 'company_id', 'category_id', 'product_name', 'sku', 'barcode', 'unit', 'minimum_stock', 'maximum_stock', 'purchase_price', 'selling_price', 'status', 'created_at', 'updated_at'],
  STOCK_TRANSACTIONS: ['transaction_id', 'company_id', 'store_id', 'product_id', 'type', 'quantity', 'user_id', 'purpose', 'reference_id', 'note', 'created_at'],
  STOCK_TRANSFERS: ['transfer_id', 'company_id', 'product_id', 'from_store_id', 'to_store_id', 'quantity', 'requested_by', 'approved_by', 'status', 'note', 'created_at', 'completed_at'],
  SUPPLIERS: ['supplier_id', 'company_id', 'supplier_name', 'phone', 'email', 'address', 'status', 'created_at', 'updated_at'],
  PURCHASES: ['purchase_id', 'company_id', 'store_id', 'supplier_id', 'product_id', 'quantity', 'unit_cost', 'total_cost', 'received_by', 'created_at'],
  AUDIT_LOGS: ['log_id', 'company_id', 'user_id', 'action', 'module', 'record_id', 'old_value', 'new_value', 'ip_or_session_reference', 'created_at'],
  SETTINGS: ['setting_id', 'company_id', 'setting_key', 'setting_value', 'created_at', 'updated_at'],
  SESSIONS: ['session_id', 'user_id', 'company_id', 'token', 'created_at', 'expires_at']
};

// --- utils/IdGenerator.gs ---
var IdGenerator = {
  generate: function(prefix) {
    var timestamp = new Date().getTime();
    var random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return prefix + '-' + timestamp + '-' + random;
  },
  generateToken: function() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var token = '';
    for (var i = 0; i < 64; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }
};

// --- utils/DateUtils.gs ---
var DateUtils = {
  now: function() {
    return Utilities.formatDate(new Date(), CONFIG.DEFAULT_TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
  },
  today: function() {
    return Utilities.formatDate(new Date(), CONFIG.DEFAULT_TIMEZONE, 'yyyy-MM-dd');
  },
  format: function(date, pattern) {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);
    return Utilities.formatDate(date, CONFIG.DEFAULT_TIMEZONE, pattern || "yyyy-MM-dd'T'HH:mm:ss");
  },
  isToday: function(dateStr) {
    if (!dateStr) return false;
    var today = this.today();
    var dateOnly = dateStr.substring(0, 10);
    return today === dateOnly;
  },
  addHours: function(date, hours) {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
  }
};

// --- utils/ResponseHelper.gs ---
var ResponseHelper = {
  success: function(data, message) {
    return {
      success: true,
      data: data || null,
      message: message || 'Operation completed successfully'
    };
  },
  error: function(code, message) {
    return {
      success: false,
      error: {
        code: code || 'UNKNOWN_ERROR',
        message: message || 'An unexpected error occurred'
      }
    };
  },
  toJsonOutput: function(responseObj) {
    return ContentService
      .createTextOutput(JSON.stringify(responseObj))
      .setMimeType(ContentService.MimeType.JSON);
  }
};

// --- utils/Validator.gs ---
var Validator = {
  required: function(value, fieldName) {
    if (value === undefined || value === null || value === '') {
      return fieldName + ' is required';
    }
    return null;
  },
  positiveNumber: function(value, fieldName) {
    if (isNaN(value) || Number(value) <= 0) {
      return fieldName + ' must be a positive number';
    }
    return null;
  },
  nonNegativeNumber: function(value, fieldName) {
    if (isNaN(value) || Number(value) < 0) {
      return fieldName + ' must be a non-negative number';
    }
    return null;
  },
  email: function(value) {
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      return 'Invalid email format';
    }
    return null;
  },
  oneOf: function(value, allowedValues, fieldName) {
    if (allowedValues.indexOf(value) === -1) {
      return fieldName + ' must be one of: ' + allowedValues.join(', ');
    }
    return null;
  },
  maxLength: function(value, max, fieldName) {
    if (value && String(value).length > max) {
      return fieldName + ' must not exceed ' + max + ' characters';
    }
    return null;
  },
  validateAll: function(rules) {
    var errors = [];
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      var err = rule.fn.apply(this, rule.args);
      if (err) errors.push(err);
    }
    return errors;
  }
};

// --- repositories/BaseRepository.gs ---
var BaseRepository = {
  _getSheet: function(sheetName) {
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) throw new Error('Sheet not found: ' + sheetName);
    return sheet;
  },
  
  _getHeaders: function(sheet) {
    return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  },
  
  _rowToObject: function(headers, row) {
    var obj = {};
    for (var i = 0; i < headers.length; i++) {
      obj[headers[i]] = row[i] !== undefined ? row[i] : '';
    }
    return obj;
  },
  
  _objectToRow: function(headers, obj) {
    return headers.map(function(h) { return obj[h] !== undefined ? obj[h] : ''; });
  },
  
  getAll: function(sheetName, companyId, filters) {
    var sheet = this._getSheet(sheetName);
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    if (values.length <= 1) return { data: [], total: 0, page: 1, limit: 50 };
    
    var headers = values[0];
    var results = [];
    
    for (var i = 1; i < values.length; i++) {
      var row = this._rowToObject(headers, values[i]);
      if (companyId && row.company_id && row.company_id !== companyId) continue;
      
      var match = true;
      if (filters) {
        for (var k in filters) {
          if (k === '_page' || k === '_limit' || k === '_search' || k === '_searchFields') continue;
          if (row[k] !== filters[k]) {
            match = false;
            break;
          }
        }
      }
      
      if (match) results.push(row);
    }
    
    return { data: results, total: results.length, page: 1, limit: results.length };
  },
  
  getById: function(sheetName, idColumn, id, companyId) {
    var sheet = this._getSheet(sheetName);
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    if (values.length <= 1) return null;
    
    var headers = values[0];
    var idIndex = headers.indexOf(idColumn);
    if (idIndex === -1) return null;
    
    for (var i = 1; i < values.length; i++) {
      if (values[i][idIndex] === id) {
        var row = this._rowToObject(headers, values[i]);
        if (companyId && row.company_id && row.company_id !== companyId) return null;
        return row;
      }
    }
    return null;
  },
  
  create: function(sheetName, data, columns) {
    var sheet = this._getSheet(sheetName);
    var rowData = this._objectToRow(columns, data);
    sheet.appendRow(rowData);
    return data;
  },
  
  update: function(sheetName, idColumn, id, updates, companyId) {
    var sheet = this._getSheet(sheetName);
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    if (values.length <= 1) return null;
    
    var headers = values[0];
    var idIndex = headers.indexOf(idColumn);
    
    for (var i = 1; i < values.length; i++) {
      if (values[i][idIndex] === id) {
        var row = this._rowToObject(headers, values[i]);
        if (companyId && row.company_id && row.company_id !== companyId) return null;
        
        for (var k in updates) {
          row[k] = updates[k];
        }
        
        var newRowValues = this._objectToRow(headers, row);
        sheet.getRange(i + 1, 1, 1, headers.length).setValues([newRowValues]);
        return row;
      }
    }
    return null;
  },
  
  findWhere: function(sheetName, conditions, companyId) {
    var sheet = this._getSheet(sheetName);
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    if (values.length <= 1) return [];
    
    var headers = values[0];
    var results = [];
    
    for (var i = 1; i < values.length; i++) {
      var row = this._rowToObject(headers, values[i]);
      if (companyId && row.company_id && row.company_id !== companyId) continue;
      
      var match = true;
      for (var k in conditions) {
        if (conditions[k] === null) continue;
        if (row[k] !== conditions[k]) {
          match = false;
          break;
        }
      }
      
      if (match) results.push(row);
    }
    return results;
  },
  
  count: function(sheetName, companyId, conditions) {
    return this.findWhere(sheetName, conditions, companyId).length;
  }
};

// --- repositories/CompanyRepository.gs ---
var CompanyRepository = {
  getById: function(companyId) {
    return BaseRepository.getById(CONFIG.SHEET_NAMES.COMPANIES, 'company_id', companyId, null);
  },
  create: function(data) {
    return BaseRepository.create(CONFIG.SHEET_NAMES.COMPANIES, data, COLUMNS.COMPANIES);
  },
  update: function(companyId, updates) {
    return BaseRepository.update(CONFIG.SHEET_NAMES.COMPANIES, 'company_id', companyId, updates, null);
  },
  getByEmail: function(email) {
    var results = BaseRepository.findWhere(CONFIG.SHEET_NAMES.COMPANIES, {email: email}, null);
    return results.length > 0 ? results[0] : null;
  }
};

// --- repositories/UserRepository.gs ---
var UserRepository = {
  getById: function(userId, companyId) {
    return BaseRepository.getById(CONFIG.SHEET_NAMES.USERS, 'user_id', userId, companyId);
  },
  getByEmail: function(email) {
    var results = BaseRepository.findWhere(CONFIG.SHEET_NAMES.USERS, {email: email}, null);
    return results.length > 0 ? results[0] : null;
  },
  list: function(companyId, filters) {
    return BaseRepository.getAll(CONFIG.SHEET_NAMES.USERS, companyId, filters);
  },
  create: function(data) {
    return BaseRepository.create(CONFIG.SHEET_NAMES.USERS, data, COLUMNS.USERS);
  },
  update: function(userId, updates, companyId) {
    return BaseRepository.update(CONFIG.SHEET_NAMES.USERS, 'user_id', userId, updates, companyId);
  }
};

// --- repositories/ProductRepository.gs ---
var ProductRepository = {
  list: function(companyId, filters) {
    return BaseRepository.getAll(CONFIG.SHEET_NAMES.PRODUCTS, companyId, filters);
  },
  getById: function(productId, companyId) {
    return BaseRepository.getById(CONFIG.SHEET_NAMES.PRODUCTS, 'product_id', productId, companyId);
  },
  create: function(data) {
    return BaseRepository.create(CONFIG.SHEET_NAMES.PRODUCTS, data, COLUMNS.PRODUCTS);
  },
  update: function(productId, updates, companyId) {
    return BaseRepository.update(CONFIG.SHEET_NAMES.PRODUCTS, 'product_id', productId, updates, companyId);
  },
  findBySku: function(companyId, sku) {
    var results = BaseRepository.findWhere(CONFIG.SHEET_NAMES.PRODUCTS, {sku: sku}, companyId);
    return results.length > 0 ? results[0] : null;
  },
  getByCategory: function(companyId, categoryId) {
    return BaseRepository.findWhere(CONFIG.SHEET_NAMES.PRODUCTS, {category_id: categoryId}, companyId);
  }
};

// --- repositories/StockRepository.gs ---
var StockRepository = {
  createTransaction: function(data) {
    return BaseRepository.create(CONFIG.SHEET_NAMES.STOCK_TRANSACTIONS, data, COLUMNS.STOCK_TRANSACTIONS);
  },
  getTransactions: function(companyId, filters) {
    return BaseRepository.getAll(CONFIG.SHEET_NAMES.STOCK_TRANSACTIONS, companyId, filters);
  },
  calculateCurrentStock: function(companyId, productId, storeId) {
    var conditions = { product_id: productId };
    if (storeId) conditions.store_id = storeId;
    
    var transactions = BaseRepository.findWhere(
      CONFIG.SHEET_NAMES.STOCK_TRANSACTIONS,
      conditions,
      companyId
    );
    
    var inTypes = ['IN', 'ADJUSTMENT_IN', 'TRANSFER_IN'];
    var outTypes = ['OUT', 'ADJUSTMENT_OUT', 'TRANSFER_OUT'];
    
    var total = 0;
    transactions.forEach(function(txn) {
      var qty = Number(txn.quantity) || 0;
      if (inTypes.indexOf(txn.type) >= 0) total += qty;
      else if (outTypes.indexOf(txn.type) >= 0) total -= qty;
    });
    
    return total;
  },
  calculateAllStock: function(companyId, storeId) {
    var products = BaseRepository.getAll(CONFIG.SHEET_NAMES.PRODUCTS, companyId).data;
    var result = [];
    for (var i=0; i<products.length; i++) {
      var p = products[i];
      p.current_stock = this.calculateCurrentStock(companyId, p.product_id, storeId);
      result.push(p);
    }
    return result;
  },
  getLowStockProducts: function(companyId) {
    var all = this.calculateAllStock(companyId, null);
    return all.filter(function(p) {
      return p.current_stock < (Number(p.minimum_stock) || 0);
    });
  },
  getTodayTransactions: function(companyId, type) {
    var today = DateUtils.today();
    var all = BaseRepository.findWhere(CONFIG.SHEET_NAMES.STOCK_TRANSACTIONS, {type: type}, companyId);
    return all.filter(function(txn) {
      return DateUtils.isToday(txn.created_at);
    });
  }
};

// --- repositories/StoreRepository.gs ---
var StoreRepository = {
  list: function(companyId, filters) {
    return BaseRepository.getAll(CONFIG.SHEET_NAMES.STORES, companyId, filters);
  },
  getById: function(id, companyId) {
    return BaseRepository.getById(CONFIG.SHEET_NAMES.STORES, 'store_id', id, companyId);
  },
  create: function(data) {
    return BaseRepository.create(CONFIG.SHEET_NAMES.STORES, data, COLUMNS.STORES);
  },
  update: function(id, updates, companyId) {
    return BaseRepository.update(CONFIG.SHEET_NAMES.STORES, 'store_id', id, updates, companyId);
  }
};

// --- repositories/CategoryRepository.gs ---
var CategoryRepository = {
  list: function(companyId, filters) {
    return BaseRepository.getAll(CONFIG.SHEET_NAMES.CATEGORIES, companyId, filters);
  },
  getById: function(id, companyId) {
    return BaseRepository.getById(CONFIG.SHEET_NAMES.CATEGORIES, 'category_id', id, companyId);
  },
  create: function(data) {
    return BaseRepository.create(CONFIG.SHEET_NAMES.CATEGORIES, data, COLUMNS.CATEGORIES);
  },
  update: function(id, updates, companyId) {
    return BaseRepository.update(CONFIG.SHEET_NAMES.CATEGORIES, 'category_id', id, updates, companyId);
  }
};

// --- repositories/SupplierRepository.gs ---
var SupplierRepository = {
  list: function(companyId, filters) {
    return BaseRepository.getAll(CONFIG.SHEET_NAMES.SUPPLIERS, companyId, filters);
  },
  getById: function(id, companyId) {
    return BaseRepository.getById(CONFIG.SHEET_NAMES.SUPPLIERS, 'supplier_id', id, companyId);
  },
  create: function(data) {
    return BaseRepository.create(CONFIG.SHEET_NAMES.SUPPLIERS, data, COLUMNS.SUPPLIERS);
  },
  update: function(id, updates, companyId) {
    return BaseRepository.update(CONFIG.SHEET_NAMES.SUPPLIERS, 'supplier_id', id, updates, companyId);
  }
};

// --- repositories/PurchaseRepository.gs ---
var PurchaseRepository = {
  list: function(companyId, filters) {
    return BaseRepository.getAll(CONFIG.SHEET_NAMES.PURCHASES, companyId, filters);
  },
  getById: function(id, companyId) {
    return BaseRepository.getById(CONFIG.SHEET_NAMES.PURCHASES, 'purchase_id', id, companyId);
  },
  create: function(data) {
    return BaseRepository.create(CONFIG.SHEET_NAMES.PURCHASES, data, COLUMNS.PURCHASES);
  },
  update: function(id, updates, companyId) {
    return BaseRepository.update(CONFIG.SHEET_NAMES.PURCHASES, 'purchase_id', id, updates, companyId);
  }
};

// --- repositories/TransferRepository.gs ---
var TransferRepository = {
  create: function(data) {
    return BaseRepository.create(CONFIG.SHEET_NAMES.STOCK_TRANSFERS, data, COLUMNS.STOCK_TRANSFERS);
  },
  getById: function(id, companyId) {
    return BaseRepository.getById(CONFIG.SHEET_NAMES.STOCK_TRANSFERS, 'transfer_id', id, companyId);
  },
  list: function(companyId, filters) {
    return BaseRepository.getAll(CONFIG.SHEET_NAMES.STOCK_TRANSFERS, companyId, filters);
  },
  updateStatus: function(id, status, companyId) {
    return BaseRepository.update(CONFIG.SHEET_NAMES.STOCK_TRANSFERS, 'transfer_id', id, {status: status}, companyId);
  }
};

// --- repositories/AuditRepository.gs ---
var AuditRepository = {
  log: function(companyId, userId, action, module, recordId, oldValue, newValue, sessionRef) {
    var data = {
      log_id: IdGenerator.generate('LOG'),
      company_id: companyId,
      user_id: userId,
      action: action,
      module: module,
      record_id: recordId || '',
      old_value: oldValue ? JSON.stringify(oldValue) : '',
      new_value: newValue ? JSON.stringify(newValue) : '',
      ip_or_session_reference: sessionRef || '',
      created_at: DateUtils.now()
    };
    return BaseRepository.create(CONFIG.SHEET_NAMES.AUDIT_LOGS, data, COLUMNS.AUDIT_LOGS);
  },
  list: function(companyId, filters) {
    return BaseRepository.getAll(CONFIG.SHEET_NAMES.AUDIT_LOGS, companyId, filters);
  }
};

// --- repositories/SettingsRepository.gs ---
var SettingsRepository = {
  get: function(companyId, key) {
    var res = BaseRepository.findWhere(CONFIG.SHEET_NAMES.SETTINGS, {setting_key: key}, companyId);
    return res.length > 0 ? res[0].setting_value : null;
  },
  set: function(companyId, key, value) {
    var res = BaseRepository.findWhere(CONFIG.SHEET_NAMES.SETTINGS, {setting_key: key}, companyId);
    if (res.length > 0) {
      BaseRepository.update(CONFIG.SHEET_NAMES.SETTINGS, 'setting_id', res[0].setting_id, {setting_value: value, updated_at: DateUtils.now()}, companyId);
    } else {
      BaseRepository.create(CONFIG.SHEET_NAMES.SETTINGS, {
        setting_id: IdGenerator.generate('SET'),
        company_id: companyId,
        setting_key: key,
        setting_value: value,
        created_at: DateUtils.now(),
        updated_at: DateUtils.now()
      }, COLUMNS.SETTINGS);
    }
  },
  getAll: function(companyId) {
    return BaseRepository.findWhere(CONFIG.SHEET_NAMES.SETTINGS, {}, companyId);
  }
};

// --- middleware/Auth.gs ---
var Auth = {
  authenticate: function(token) {
    if (!token) return ResponseHelper.error('UNAUTHORIZED', 'Authentication required');
    
    var sessions = BaseRepository.findWhere(CONFIG.SHEET_NAMES.SESSIONS, { token: token }, null);
    if (!sessions || sessions.length === 0) {
      return ResponseHelper.error('UNAUTHORIZED', 'Invalid or expired session');
    }
    
    var session = sessions[0];
    
    if (new Date(session.expires_at) < new Date()) {
      return ResponseHelper.error('SESSION_EXPIRED', 'Your session has expired. Please login again.');
    }
    
    var user = UserRepository.getById(session.user_id, session.company_id);
    if (!user || user.status !== CONFIG.RECORD_STATUS.ACTIVE) {
      return ResponseHelper.error('UNAUTHORIZED', 'User account is inactive');
    }
    
    return ResponseHelper.success(user);
  },
  
  createSession: function(user) {
    var token = IdGenerator.generateToken();
    var now = new Date();
    var expiresAt = DateUtils.addHours(now, CONFIG.SESSION_DURATION_HOURS);
    
    var sessionData = {
      session_id: IdGenerator.generate('SES'),
      user_id: user.user_id,
      company_id: user.company_id,
      token: token,
      created_at: DateUtils.now(),
      expires_at: DateUtils.format(expiresAt)
    };
    
    BaseRepository.create(CONFIG.SHEET_NAMES.SESSIONS, sessionData, COLUMNS.SESSIONS);
    return token;
  },
  
  destroySession: function(token) {
    var sessions = BaseRepository.findWhere(CONFIG.SHEET_NAMES.SESSIONS, { token: token }, null);
    if (sessions && sessions.length > 0) {
      BaseRepository.update(CONFIG.SHEET_NAMES.SESSIONS, 'session_id', sessions[0].session_id, { expires_at: DateUtils.now() }, null);
    }
  },
  
  hashPassword: function(password) {
    var hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password);
    return hash.map(function(b) { return ('0' + (b & 0xFF).toString(16)).slice(-2); }).join('');
  }
};

// --- middleware/Permissions.gs ---
var Permissions = {
  MATRIX: {
    'auth/logout': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'auth/me': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'dashboard/stats': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'dashboard/recent-activity': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'dashboard/low-stock': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'products/list': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'products/get': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'products/create': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    'products/update': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    'products/deactivate': ['SUPER_ADMIN', 'COMPANY_ADMIN'],
    
    'categories/list': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'categories/create': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    'categories/update': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    
    'stock/in': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF'],
    'stock/out': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF'],
    'stock/current': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'stock/history': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'stock/low': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    
    'transfers/create': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    'transfers/approve': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    'transfers/complete': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    'transfers/cancel': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    'transfers/list': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    
    'stores/list': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'stores/create': ['SUPER_ADMIN', 'COMPANY_ADMIN'],
    'stores/update': ['SUPER_ADMIN', 'COMPANY_ADMIN'],
    
    'users/list': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'users/create': ['SUPER_ADMIN', 'COMPANY_ADMIN'],
    'users/update': ['SUPER_ADMIN', 'COMPANY_ADMIN'],
    'users/deactivate': ['SUPER_ADMIN', 'COMPANY_ADMIN'],
    
    'suppliers/list': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'suppliers/create': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    'suppliers/update': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    
    'reports/stock': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'reports/activity': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'reports/low-stock': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'reports/dashboard': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    
    'audit/list': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER'],
    
    'settings/get': ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
    'settings/update': ['SUPER_ADMIN', 'COMPANY_ADMIN']
  },
  
  check: function(user, action) {
    var allowedRoles = this.MATRIX[action];
    if (!allowedRoles) {
      return ResponseHelper.error('FORBIDDEN', 'Action not recognized');
    }
    if (allowedRoles.indexOf(user.role) === -1) {
      return ResponseHelper.error('FORBIDDEN', 'You do not have permission for this action');
    }
    return ResponseHelper.success(true);
  }
};

// --- services/AuthService.gs ---
var AuthService = {
  login: function(email, password) {
    var user = UserRepository.getByEmail(email);
    if (!user) return ResponseHelper.error('INVALID_CREDENTIALS', 'Invalid email or password');
    
    var passwordHash = Auth.hashPassword(password);
    if (user.password_hash !== passwordHash) {
      return ResponseHelper.error('INVALID_CREDENTIALS', 'Invalid email or password');
    }
    
    if (user.status !== CONFIG.RECORD_STATUS.ACTIVE) {
      return ResponseHelper.error('ACCOUNT_INACTIVE', 'Your account has been deactivated');
    }
    
    var token = Auth.createSession(user);
    AuditRepository.log(user.company_id, user.user_id, 'LOGIN', 'AUTH', user.user_id, null, null, '');
    delete user.password_hash;
    
    return ResponseHelper.success({ user: user, token: token }, 'Login successful');
  }
};

// --- services/StockService.gs ---
var StockService = {
  stockIn: function(data, user) {
    var transaction = {
      transaction_id: IdGenerator.generate('TXN'),
      company_id: user.company_id,
      store_id: data.store_id,
      product_id: data.product_id,
      type: 'IN',
      quantity: data.quantity,
      user_id: user.user_id,
      purpose: data.purpose || 'STOCK_IN',
      reference_id: data.reference_id || '',
      note: data.note || '',
      created_at: DateUtils.now()
    };
    var res = StockRepository.createTransaction(transaction);
    AuditRepository.log(user.company_id, user.user_id, 'STOCK_IN', 'STOCK', res.transaction_id, null, res, '');
    return ResponseHelper.success(res, 'Stock added successfully');
  },
  
  stockOut: function(data, user) {
    var current = StockRepository.calculateCurrentStock(user.company_id, data.product_id, data.store_id);
    if (Number(data.quantity) > current) {
      return ResponseHelper.error('INSUFFICIENT_STOCK', 'Not enough stock available');
    }
    var transaction = {
      transaction_id: IdGenerator.generate('TXN'),
      company_id: user.company_id,
      store_id: data.store_id,
      product_id: data.product_id,
      type: 'OUT',
      quantity: data.quantity,
      user_id: user.user_id,
      purpose: data.purpose || 'STOCK_OUT',
      reference_id: data.reference_id || '',
      note: data.note || '',
      created_at: DateUtils.now()
    };
    var res = StockRepository.createTransaction(transaction);
    AuditRepository.log(user.company_id, user.user_id, 'STOCK_OUT', 'STOCK', res.transaction_id, null, res, '');
    return ResponseHelper.success(res, 'Stock removed successfully');
  },
  
  getCurrentStock: function(companyId, productId, storeId) {
    var stock = StockRepository.calculateCurrentStock(companyId, productId, storeId);
    return ResponseHelper.success({ stock: stock });
  },
  
  getAllCurrentStock: function(companyId, storeId) {
    var list = StockRepository.calculateAllStock(companyId, storeId);
    return ResponseHelper.success(list);
  },
  
  getLowStockProducts: function(companyId) {
    var list = StockRepository.getLowStockProducts(companyId);
    return ResponseHelper.success(list);
  }
};

// --- services/TransferService.gs ---
var TransferService = {
  createTransfer: function(data, user) {
    var t = {
      transfer_id: IdGenerator.generate('TRF'),
      company_id: user.company_id,
      product_id: data.product_id,
      from_store_id: data.from_store_id,
      to_store_id: data.to_store_id,
      quantity: data.quantity,
      requested_by: user.user_id,
      approved_by: '',
      status: CONFIG.TRANSFER_STATUSES.PENDING,
      note: data.note || '',
      created_at: DateUtils.now(),
      completed_at: ''
    };
    var res = TransferRepository.create(t);
    AuditRepository.log(user.company_id, user.user_id, 'CREATE', 'TRANSFER', res.transfer_id, null, res, '');
    return ResponseHelper.success(res);
  },
  approveTransfer: function(data, user) {
    var res = TransferRepository.updateStatus(data.transfer_id, CONFIG.TRANSFER_STATUSES.APPROVED, user.company_id);
    AuditRepository.log(user.company_id, user.user_id, 'APPROVE', 'TRANSFER', data.transfer_id, null, res, '');
    return ResponseHelper.success(res);
  },
  completeTransfer: function(data, user) {
    var t = TransferRepository.getById(data.transfer_id, user.company_id);
    StockRepository.createTransaction({
      transaction_id: IdGenerator.generate('TXN'),
      company_id: user.company_id, store_id: t.from_store_id, product_id: t.product_id,
      type: 'TRANSFER_OUT', quantity: t.quantity, user_id: user.user_id,
      purpose: 'TRANSFER', reference_id: t.transfer_id, note: '', created_at: DateUtils.now()
    });
    StockRepository.createTransaction({
      transaction_id: IdGenerator.generate('TXN'),
      company_id: user.company_id, store_id: t.to_store_id, product_id: t.product_id,
      type: 'TRANSFER_IN', quantity: t.quantity, user_id: user.user_id,
      purpose: 'TRANSFER', reference_id: t.transfer_id, note: '', created_at: DateUtils.now()
    });
    var res = TransferRepository.updateStatus(data.transfer_id, CONFIG.TRANSFER_STATUSES.COMPLETED, user.company_id);
    AuditRepository.log(user.company_id, user.user_id, 'COMPLETE', 'TRANSFER', data.transfer_id, null, res, '');
    return ResponseHelper.success(res);
  },
  cancelTransfer: function(data, user) {
    var res = TransferRepository.updateStatus(data.transfer_id, CONFIG.TRANSFER_STATUSES.CANCELLED, user.company_id);
    AuditRepository.log(user.company_id, user.user_id, 'CANCEL', 'TRANSFER', data.transfer_id, null, res, '');
    return ResponseHelper.success(res);
  }
};

// --- services/ReportService.gs ---
var ReportService = {
  stockReport: function(companyId) {
    return ResponseHelper.success(StockRepository.calculateAllStock(companyId, null));
  },
  activityReport: function(companyId) {
    return ResponseHelper.success(StockRepository.getTransactions(companyId).data);
  },
  lowStockReport: function(companyId) {
    return ResponseHelper.success(StockRepository.getLowStockProducts(companyId));
  }
};

// --- services/DashboardService.gs ---
var DashboardService = {
  getStats: function(companyId) {
    var totalProducts = ProductRepository.list(companyId).data.length;
    var storeCount = StoreRepository.list(companyId).data.length;
    var staffCount = UserRepository.list(companyId).data.length;
    var lowStockCount = StockRepository.getLowStockProducts(companyId).length;
    return ResponseHelper.success({
      totalProducts: totalProducts,
      storeCount: storeCount,
      staffCount: staffCount,
      lowStockCount: lowStockCount
    });
  },
  getRecentActivity: function(companyId, limit) {
    var txns = StockRepository.getTransactions(companyId).data;
    txns.sort(function(a,b) { return new Date(b.created_at) - new Date(a.created_at); });
    return ResponseHelper.success(txns.slice(0, limit || 10));
  },
  getLowStockAlerts: function(companyId) {
    return ResponseHelper.success(StockRepository.getLowStockProducts(companyId));
  }
};

// --- controllers/AuthController.gs ---
var AuthController = {
  login: function(payload) {
    if (!payload.email || !payload.password) {
      return ResponseHelper.error('VALIDATION_ERROR', 'Email and password are required');
    }
    return AuthService.login(payload.email, payload.password);
  },
  logout: function(token) {
    Auth.destroySession(token);
    return ResponseHelper.success(null, 'Logged out successfully');
  },
  me: function(user) {
    var u = JSON.parse(JSON.stringify(user));
    delete u.password_hash;
    return ResponseHelper.success(u);
  }
};

// --- controllers/ProductController.gs ---
var ProductController = {
  list: function(payload, user) {
    return ResponseHelper.success(ProductRepository.list(user.company_id, payload).data);
  },
  get: function(payload, user) {
    return ResponseHelper.success(ProductRepository.getById(payload.product_id, user.company_id));
  },
  create: function(payload, user) {
    if (ProductRepository.findBySku(user.company_id, payload.sku)) {
      return ResponseHelper.error('VALIDATION_ERROR', 'SKU must be unique');
    }
    payload.product_id = IdGenerator.generate('PRD');
    payload.company_id = user.company_id;
    payload.created_at = DateUtils.now();
    payload.updated_at = DateUtils.now();
    var res = ProductRepository.create(payload);
    AuditRepository.log(user.company_id, user.user_id, 'CREATE', 'PRODUCT', res.product_id, null, res, '');
    return ResponseHelper.success(res);
  },
  update: function(payload, user) {
    payload.updated_at = DateUtils.now();
    var res = ProductRepository.update(payload.product_id, payload, user.company_id);
    AuditRepository.log(user.company_id, user.user_id, 'UPDATE', 'PRODUCT', payload.product_id, null, res, '');
    return ResponseHelper.success(res);
  },
  deactivate: function(payload, user) {
    var res = ProductRepository.update(payload.product_id, {status: CONFIG.RECORD_STATUS.INACTIVE}, user.company_id);
    return ResponseHelper.success(res);
  }
};

// --- controllers/CategoryController.gs ---
var CategoryController = {
  list: function(payload, user) {
    return ResponseHelper.success(CategoryRepository.list(user.company_id, payload).data);
  },
  create: function(payload, user) {
    payload.category_id = IdGenerator.generate('CAT');
    payload.company_id = user.company_id;
    payload.created_at = DateUtils.now();
    payload.updated_at = DateUtils.now();
    var res = CategoryRepository.create(payload);
    AuditRepository.log(user.company_id, user.user_id, 'CREATE', 'CATEGORY', res.category_id, null, res, '');
    return ResponseHelper.success(res);
  },
  update: function(payload, user) {
    payload.updated_at = DateUtils.now();
    var res = CategoryRepository.update(payload.category_id, payload, user.company_id);
    AuditRepository.log(user.company_id, user.user_id, 'UPDATE', 'CATEGORY', payload.category_id, null, res, '');
    return ResponseHelper.success(res);
  }
};

// --- controllers/StockController.gs ---
var StockController = {
  stockIn: function(payload, user) { return StockService.stockIn(payload, user); },
  stockOut: function(payload, user) { return StockService.stockOut(payload, user); },
  getCurrentStock: function(payload, user) { return StockService.getCurrentStock(user.company_id, payload.product_id, payload.store_id); },
  getHistory: function(payload, user) { return ResponseHelper.success(StockRepository.getTransactions(user.company_id, payload).data); },
  getLowStock: function(payload, user) { return StockService.getLowStockProducts(user.company_id); }
};

// --- controllers/TransferController.gs ---
var TransferController = {
  create: function(payload, user) { return TransferService.createTransfer(payload, user); },
  approve: function(payload, user) { return TransferService.approveTransfer(payload, user); },
  complete: function(payload, user) { return TransferService.completeTransfer(payload, user); },
  cancel: function(payload, user) { return TransferService.cancelTransfer(payload, user); },
  list: function(payload, user) { return ResponseHelper.success(TransferRepository.list(user.company_id, payload).data); }
};

// --- controllers/StoreController.gs ---
var StoreController = {
  list: function(payload, user) {
    return ResponseHelper.success(StoreRepository.list(user.company_id, payload).data);
  },
  create: function(payload, user) {
    payload.store_id = IdGenerator.generate('STR');
    payload.company_id = user.company_id;
    payload.created_at = DateUtils.now();
    payload.updated_at = DateUtils.now();
    var res = StoreRepository.create(payload);
    AuditRepository.log(user.company_id, user.user_id, 'CREATE', 'STORE', res.store_id, null, res, '');
    return ResponseHelper.success(res);
  },
  update: function(payload, user) {
    payload.updated_at = DateUtils.now();
    var res = StoreRepository.update(payload.store_id, payload, user.company_id);
    AuditRepository.log(user.company_id, user.user_id, 'UPDATE', 'STORE', payload.store_id, null, res, '');
    return ResponseHelper.success(res);
  }
};

// --- controllers/UserController.gs ---
var UserController = {
  list: function(payload, user) {
    return ResponseHelper.success(UserRepository.list(user.company_id, payload).data);
  },
  create: function(payload, user) {
    payload.user_id = IdGenerator.generate('USR');
    payload.company_id = user.company_id;
    payload.password_hash = Auth.hashPassword(payload.password);
    delete payload.password;
    payload.created_at = DateUtils.now();
    payload.updated_at = DateUtils.now();
    var res = UserRepository.create(payload);
    AuditRepository.log(user.company_id, user.user_id, 'CREATE', 'USER', res.user_id, null, res, '');
    return ResponseHelper.success(res);
  },
  update: function(payload, user) {
    if (payload.password) {
      payload.password_hash = Auth.hashPassword(payload.password);
      delete payload.password;
    }
    payload.updated_at = DateUtils.now();
    var res = UserRepository.update(payload.user_id, payload, user.company_id);
    AuditRepository.log(user.company_id, user.user_id, 'UPDATE', 'USER', payload.user_id, null, res, '');
    return ResponseHelper.success(res);
  },
  deactivate: function(payload, user) {
    var res = UserRepository.update(payload.user_id, {status: CONFIG.RECORD_STATUS.INACTIVE}, user.company_id);
    return ResponseHelper.success(res);
  }
};

// --- controllers/SupplierController.gs ---
var SupplierController = {
  list: function(payload, user) {
    return ResponseHelper.success(SupplierRepository.list(user.company_id, payload).data);
  },
  create: function(payload, user) {
    payload.supplier_id = IdGenerator.generate('SUP');
    payload.company_id = user.company_id;
    payload.created_at = DateUtils.now();
    payload.updated_at = DateUtils.now();
    var res = SupplierRepository.create(payload);
    AuditRepository.log(user.company_id, user.user_id, 'CREATE', 'SUPPLIER', res.supplier_id, null, res, '');
    return ResponseHelper.success(res);
  },
  update: function(payload, user) {
    payload.updated_at = DateUtils.now();
    var res = SupplierRepository.update(payload.supplier_id, payload, user.company_id);
    AuditRepository.log(user.company_id, user.user_id, 'UPDATE', 'SUPPLIER', payload.supplier_id, null, res, '');
    return ResponseHelper.success(res);
  }
};

// --- controllers/ReportController.gs ---
var ReportController = {
  stockReport: function(payload, user) { return ReportService.stockReport(user.company_id); },
  activityReport: function(payload, user) { return ReportService.activityReport(user.company_id); },
  lowStockReport: function(payload, user) { return ReportService.lowStockReport(user.company_id); },
  dashboardReport: function(payload, user) { return DashboardService.getStats(user.company_id); }
};

// --- controllers/AuditController.gs ---
var AuditController = {
  list: function(payload, user) {
    return ResponseHelper.success(AuditRepository.list(user.company_id, payload).data);
  }
};

// --- controllers/SettingsController.gs ---
var SettingsController = {
  get: function(payload, user) {
    return ResponseHelper.success(SettingsRepository.getAll(user.company_id));
  },
  update: function(payload, user) {
    for (var k in payload.settings) {
      SettingsRepository.set(user.company_id, k, payload.settings[k]);
    }
    AuditRepository.log(user.company_id, user.user_id, 'UPDATE', 'SETTINGS', '', null, payload.settings, '');
    return ResponseHelper.success(SettingsRepository.getAll(user.company_id));
  }
};

// --- controllers/DashboardController.gs ---
var DashboardController = {
  getStats: function(payload, user) { return DashboardService.getStats(user.company_id); },
  getRecentActivity: function(payload, user) { return DashboardService.getRecentActivity(user.company_id, payload.limit); },
  getLowStock: function(payload, user) { return DashboardService.getLowStockAlerts(user.company_id); }
};

// --- Router.gs ---
var Router = {
  route: function(action, payload, token) {
    if (action === 'auth/login') return AuthController.login(payload);
    
    var authResult = Auth.authenticate(token);
    if (!authResult.success) return authResult;
    var user = authResult.data;
    
    var permResult = Permissions.check(user, action);
    if (!permResult.success) return permResult;
    
    switch (action) {
      case 'auth/logout': return AuthController.logout(token);
      case 'auth/me': return AuthController.me(user);
      
      case 'dashboard/stats': return DashboardController.getStats(payload, user);
      case 'dashboard/recent-activity': return DashboardController.getRecentActivity(payload, user);
      case 'dashboard/low-stock': return DashboardController.getLowStock(payload, user);
      
      case 'products/list': return ProductController.list(payload, user);
      case 'products/get': return ProductController.get(payload, user);
      case 'products/create': return ProductController.create(payload, user);
      case 'products/update': return ProductController.update(payload, user);
      case 'products/deactivate': return ProductController.deactivate(payload, user);
      
      case 'categories/list': return CategoryController.list(payload, user);
      case 'categories/create': return CategoryController.create(payload, user);
      case 'categories/update': return CategoryController.update(payload, user);
      
      case 'stock/in': return StockController.stockIn(payload, user);
      case 'stock/out': return StockController.stockOut(payload, user);
      case 'stock/current': return StockController.getCurrentStock(payload, user);
      case 'stock/history': return StockController.getHistory(payload, user);
      case 'stock/low': return StockController.getLowStock(payload, user);
      
      case 'transfers/create': return TransferController.create(payload, user);
      case 'transfers/approve': return TransferController.approve(payload, user);
      case 'transfers/complete': return TransferController.complete(payload, user);
      case 'transfers/cancel': return TransferController.cancel(payload, user);
      case 'transfers/list': return TransferController.list(payload, user);
      
      case 'stores/list': return StoreController.list(payload, user);
      case 'stores/create': return StoreController.create(payload, user);
      case 'stores/update': return StoreController.update(payload, user);
      
      case 'users/list': return UserController.list(payload, user);
      case 'users/create': return UserController.create(payload, user);
      case 'users/update': return UserController.update(payload, user);
      case 'users/deactivate': return UserController.deactivate(payload, user);
      
      case 'suppliers/list': return SupplierController.list(payload, user);
      case 'suppliers/create': return SupplierController.create(payload, user);
      case 'suppliers/update': return SupplierController.update(payload, user);
      
      case 'reports/stock': return ReportController.stockReport(payload, user);
      case 'reports/activity': return ReportController.activityReport(payload, user);
      case 'reports/low-stock': return ReportController.lowStockReport(payload, user);
      case 'reports/dashboard': return ReportController.dashboardReport(payload, user);
      
      case 'audit/list': return AuditController.list(payload, user);
      
      case 'settings/get': return SettingsController.get(payload, user);
      case 'settings/update': return SettingsController.update(payload, user);
      
      default:
        return ResponseHelper.error('INVALID_ACTION', 'Unknown action: ' + action);
    }
  }
};

// --- main.gs ---
function doGet(e) {
  var action = (e && e.parameter) ? e.parameter.action : '';
  if (action === 'get_data') {
    var props = PropertiesService.getScriptProperties();
    var rawData = props.getProperty('STOREIQ_DATA');
    var dataObj = rawData ? JSON.parse(rawData) : null;
    return ContentService.createTextOutput(JSON.stringify({ success: true, data: dataObj }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  var output = { success: true, message: 'Store Management API is running', version: '1.0.0' };
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var request = JSON.parse(e.postData.contents);
    var action = request.action;
    var payload = request.payload || {};
    var token = request.token || '';

    if (action === 'save_data') {
      var props = PropertiesService.getScriptProperties();
      props.setProperty('STOREIQ_DATA', JSON.stringify(payload));
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: 'Data synced to cloud successfully' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'get_data') {
      var props = PropertiesService.getScriptProperties();
      var rawData = props.getProperty('STOREIQ_DATA');
      var dataObj = rawData ? JSON.parse(rawData) : null;
      return ContentService.createTextOutput(JSON.stringify({ success: true, data: dataObj }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var response = Router.route(action, payload, token);
    return ResponseHelper.toJsonOutput(response);
  } catch (error) {
    Logger.log('doPost error: ' + error.toString());
    var errorResponse = ResponseHelper.error('SERVER_ERROR', 'An internal server error occurred: ' + error.message);
    return ResponseHelper.toJsonOutput(errorResponse);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}