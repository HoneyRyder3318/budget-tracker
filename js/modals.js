// All modal components for adding and editing items

function AddTransactionModal({ onClose, onAdd }) {
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        description: '',
        category: '',
        source: '',
        date: new Date().toISOString().split('T')[0]
    });
    
    const categories = ['Groceries', 'Dining Out', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other'];
    const sources = ['Checking Account', 'Credit Card', 'Savings', 'Cash', 'Other'];

    const handleSubmit = () => {
        if (!formData.amount || !formData.category || !formData.source) {
            alert('Please fill in all required fields');
            return;
        }
        const finalDescription = formData.description.trim() || formData.category;
        const finalAmount = parseFloat(formData.amount).toFixed(2);
        onAdd({
            ...formData,
            description: finalDescription,
            amount: finalAmount
        });
    };

    const handleAmountBlur = () => {
        if (formData.amount) {
            setFormData({...formData, amount: parseFloat(formData.amount).toFixed(2)});
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Add Transaction</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <div className="flex gap-2">
                            <button 
                                type="button" 
                                onClick={() => setFormData({...formData, type: 'expense'})} 
                                className={`flex-1 py-2 rounded ${formData.type === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
                            >
                                Expense
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setFormData({...formData, type: 'income'})} 
                                className={`flex-1 py-2 rounded ${formData.type === 'income' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                            >
                                Income
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Amount</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            value={formData.amount} 
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            onBlur={handleAmountBlur}
                            className="w-full px-3 py-2 border rounded" 
                            required 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Description (optional)</label>
                        <input 
                            type="text" 
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})} 
                            className="w-full px-3 py-2 border rounded"
                            placeholder={formData.category ? formData.category : 'Will use category name if empty'}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select 
                            value={formData.category} 
                            onChange={(e) => setFormData({...formData, category: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required
                        >
                            <option value="">Select category</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Source</label>
                        <select 
                            value={formData.source} 
                            onChange={(e) => setFormData({...formData, source: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required
                        >
                            <option value="">Select source</option>
                            {sources.map(src => <option key={src} value={src}>{src}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input 
                            type="date" 
                            value={formData.date} 
                            onChange={(e) => setFormData({...formData, date: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required 
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <button type="button" onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                            Add
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AddSubscriptionModal({ onClose, onAdd }) {
    const [formData, setFormData] = useState({ 
        name: '', 
        amount: '', 
        source: '', 
        frequency: 'Monthly',
        category: 'Entertainment',
        nextPayment: '', 
        flaggedForCancellation: false 
    });
    
    const sources = ['Checking Account', 'Credit Card', 'Savings', 'Other'];
    const frequencies = ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual'];
    const categories = ['Entertainment', 'Education', 'Tools/Software', 'Health/Fitness', 'News/Media', 'Gaming', 'Other'];

    const handleSubmit = () => {
        if (!formData.name || !formData.amount || !formData.source || !formData.nextPayment) {
            alert('Please fill in all required fields');
            return;
        }
        const finalAmount = parseFloat(formData.amount).toFixed(2);
        onAdd({
            ...formData,
            amount: finalAmount
        });
    };

    const handleAmountBlur = () => {
        if (formData.amount) {
            setFormData({...formData, amount: parseFloat(formData.amount).toFixed(2)});
        }
    };

    const getMonthlyBreakdown = () => {
        if (!formData.amount || formData.frequency === 'Monthly') return '';
        const divisor = formData.frequency === 'Quarterly' ? 3 : formData.frequency === 'Semi-Annual' ? 6 : 12;
        return (parseFloat(formData.amount) / divisor).toFixed(2);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Add Subscription</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Amount</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            value={formData.amount} 
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            onBlur={handleAmountBlur}
                            className="w-full px-3 py-2 border rounded" 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Frequency</label>
                        <select 
                            value={formData.frequency} 
                            onChange={(e) => setFormData({...formData, frequency: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required
                        >
                            {frequencies.map(freq => <option key={freq} value={freq}>{freq}</option>)}
                        </select>
                        {getMonthlyBreakdown() && (
                            <p className="text-xs text-gray-600 mt-1">
                                Monthly breakdown: ${getMonthlyBreakdown()}/mo
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select 
                            value={formData.category} 
                            onChange={(e) => setFormData({...formData, category: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Payment Source</label>
                        <select 
                            value={formData.source} 
                            onChange={(e) => setFormData({...formData, source: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required
                        >
                            <option value="">Select source</option>
                            {sources.map(src => <option key={src} value={src}>{src}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Next Payment Date</label>
                        <input 
                            type="date" 
                            value={formData.nextPayment} 
                            onChange={(e) => setFormData({...formData, nextPayment: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required 
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <button type="button" onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                            Add
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AddBillModal({ onClose, onAdd }) {
    const [formData, setFormData] = useState({ 
        name: '', 
        amount: '', 
        source: '', 
        frequency: 'Monthly',
        category: 'Utilities',
        nextPayment: '', 
        flaggedForReview: false 
    });
    
    const sources = ['Checking Account', 'Credit Card', 'Savings', 'Other'];
    const frequencies = ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual'];
    const categories = ['Housing', 'Utilities', 'Insurance', 'Transportation', 'Other'];

    const handleSubmit = () => {
        if (!formData.name || !formData.amount || !formData.source || !formData.nextPayment) {
            alert('Please fill in all required fields');
            return;
        }
        const finalAmount = parseFloat(formData.amount).toFixed(2);
        onAdd({
            ...formData,
            amount: finalAmount
        });
    };

    const handleAmountBlur = () => {
        if (formData.amount) {
            setFormData({...formData, amount: parseFloat(formData.amount).toFixed(2)});
        }
    };

    const getMonthlyBreakdown = () => {
        if (!formData.amount || formData.frequency === 'Monthly') return '';
        const divisor = formData.frequency === 'Quarterly' ? 3 : formData.frequency === 'Semi-Annual' ? 6 : 12;
        return (parseFloat(formData.amount) / divisor).toFixed(2);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Add Recurring Bill</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Bill Name</label>
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            className="w-full px-3 py-2 border rounded"
                            placeholder="e.g., Mortgage, Car Insurance, Electric"
                            required 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Amount</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            value={formData.amount} 
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            onBlur={handleAmountBlur}
                            className="w-full px-3 py-2 border rounded" 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Frequency</label>
                        <select 
                            value={formData.frequency} 
                            onChange={(e) => setFormData({...formData, frequency: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required
                        >
                            {frequencies.map(freq => <option key={freq} value={freq}>{freq}</option>)}
                        </select>
                        {getMonthlyBreakdown() && (
                            <p className="text-xs text-gray-600 mt-1">
                                Monthly breakdown: ${getMonthlyBreakdown()}/mo
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select 
                            value={formData.category} 
                            onChange={(e) => setFormData({...formData, category: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Payment Source</label>
                        <select 
                            value={formData.source} 
                            onChange={(e) => setFormData({...formData, source: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required
                        >
                            <option value="">Select source</option>
                            {sources.map(src => <option key={src} value={src}>{src}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Next Payment Date</label>
                        <input 
                            type="date" 
                            value={formData.nextPayment} 
                            onChange={(e) => setFormData({...formData, nextPayment: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required 
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <button type="button" onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                            Add
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AddBudgetModal({ onClose, onAdd }) {
    const [formData, setFormData] = useState({ category: '', limit: '' });
    const categories = ['Groceries', 'Dining Out', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other'];

    const handleSubmit = () => {
        if (!formData.category || !formData.limit) {
            alert('Please fill in all required fields');
            return;
        }
        const finalLimit = parseFloat(formData.limit).toFixed(2);
        onAdd({
            ...formData,
            limit: finalLimit
        });
    };

    const handleLimitBlur = () => {
        if (formData.limit) {
            setFormData({...formData, limit: parseFloat(formData.limit).toFixed(2)});
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Add Budget</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select 
                            value={formData.category} 
                            onChange={(e) => setFormData({...formData, category: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required
                        >
                            <option value="">Select category</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Monthly Limit</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            value={formData.limit} 
                            onChange={(e) => setFormData({...formData, limit: e.target.value})}
                            onBlur={handleLimitBlur}
                            className="w-full px-3 py-2 border rounded" 
                            required 
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <button type="button" onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                            Add
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EditSubscriptionModal({ subscription, onClose, onUpdate }) {
    const [formData, setFormData] = useState({ 
        name: subscription.name,
        amount: subscription.amount,
        source: subscription.source,
        frequency: subscription.frequency || 'Monthly',
        category: subscription.category || 'Entertainment',
        nextPayment: subscription.nextPayment,
        flaggedForCancellation: subscription.flaggedForCancellation || false
    });
    
    const sources = ['Checking Account', 'Credit Card', 'Savings', 'Other'];
    const frequencies = ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual'];
    const categories = ['Entertainment', 'Education', 'Tools/Software', 'Health/Fitness', 'News/Media', 'Gaming', 'Other'];

    const handleSubmit = () => {
        if (!formData.name || !formData.amount || !formData.source || !formData.nextPayment) {
            alert('Please fill in all required fields');
            return;
        }
        const finalAmount = parseFloat(formData.amount).toFixed(2);
        onUpdate(subscription.id, {
            ...formData,
            amount: finalAmount,
            savingsLog: subscription.savingsLog
        });
    };

    const handleAmountBlur = () => {
        if (formData.amount) {
            setFormData({...formData, amount: parseFloat(formData.amount).toFixed(2)});
        }
    };

    const getMonthlyBreakdown = () => {
        if (!formData.amount || formData.frequency === 'Monthly') return '';
        const divisor = formData.frequency === 'Quarterly' ? 3 : formData.frequency === 'Semi-Annual' ? 6 : 12;
        return (parseFloat(formData.amount) / divisor).toFixed(2);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Edit Subscription</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Amount</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            value={formData.amount} 
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            onBlur={handleAmountBlur}
                            className="w-full px-3 py-2 border rounded" 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Frequency</label>
                        <select 
                            value={formData.frequency} 
                            onChange={(e) => setFormData({...formData, frequency: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required
                        >
                            {frequencies.map(freq => <option key={freq} value={freq}>{freq}</option>)}
                        </select>
                        {getMonthlyBreakdown() && (
                            <p className="text-xs text-gray-600 mt-1">
                                Monthly breakdown: ${getMonthlyBreakdown()}/mo
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select 
                            value={formData.category} 
                            onChange={(e) => setFormData({...formData, category: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Payment Source</label>
                        <select 
                            value={formData.source} 
                            onChange={(e) => setFormData({...formData, source: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required
                        >
                            <option value="">Select source</option>
                            {sources.map(src => <option key={src} value={src}>{src}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Next Payment Date</label>
                        <input 
                            type="date" 
                            value={formData.nextPayment} 
                            onChange={(e) => setFormData({...formData, nextPayment: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required 
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <button type="button" onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                            Update
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EditBillModal({ bill, onClose, onUpdate }) {
    const [formData, setFormData] = useState({ 
        name: bill.name,
        amount: bill.amount,
        source: bill.source,
        frequency: bill.frequency || 'Monthly',
        category: bill.category || 'Utilities',
        nextPayment: bill.nextPayment,
        flaggedForReview: bill.flaggedForReview || false
    });
    
    const sources = ['Checking Account', 'Credit Card', 'Savings', 'Other'];
    const frequencies = ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual'];
    const categories = ['Housing', 'Utilities', 'Insurance', 'Transportation', 'Other'];

    const handleSubmit = () => {
        if (!formData.name || !formData.amount || !formData.source || !formData.nextPayment) {
            alert('Please fill in all required fields');
            return;
        }
        const finalAmount = parseFloat(formData.amount).toFixed(2);
        onUpdate(bill.id, {
            ...formData,
            amount: finalAmount,
            savingsLog: bill.savingsLog
        });
    };

    const handleAmountBlur = () => {
        if (formData.amount) {
            setFormData({...formData, amount: parseFloat(formData.amount).toFixed(2)});
        }
    };

    const getMonthlyBreakdown = () => {
        if (!formData.amount || formData.frequency === 'Monthly') return '';
        const divisor = formData.frequency === 'Quarterly' ? 3 : formData.frequency === 'Semi-Annual' ? 6 : 12;
        return (parseFloat(formData.amount) / divisor).toFixed(2);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Edit Recurring Bill</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Bill Name</label>
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            className="w-full px-3 py-2 border rounded"
                            placeholder="e.g., Mortgage, Car Insurance, Electric"
                            required 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Amount</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            value={formData.amount} 
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            onBlur={handleAmountBlur}
                            className="w-full px-3 py-2 border rounded" 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Frequency</label>
                        <select 
                            value={formData.frequency} 
                            onChange={(e) => setFormData({...formData, frequency: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required
                        >
                            {frequencies.map(freq => <option key={freq} value={freq}>{freq}</option>)}
                        </select>
                        {getMonthlyBreakdown() && (
                            <p className="text-xs text-gray-600 mt-1">
                                Monthly breakdown: ${getMonthlyBreakdown()}/mo
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select 
                            value={formData.category} 
                            onChange={(e) => setFormData({...formData, category: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                   </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Payment Source</label>
                        <select 
                            value={formData.source} 
                            onChange={(e) => setFormData({...formData, source: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required
                        >
                            <option value="">Select source</option>
                            {sources.map(src => <option key={src} value={src}>{src}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Next Payment Date</label>
                        <input 
                            type="date" 
                            value={formData.nextPayment} 
                            onChange={(e) => setFormData({...formData, nextPayment: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required 
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <button type="button" onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                            Update
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Add this to modals.js - EditBudgetModal component

function EditBudgetModal({ budget, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        category: budget.category,
        limit: budget.limit
    });
    
    const categories = ['Groceries', 'Dining Out', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other'];

    const handleSubmit = () => {
        if (!formData.category || !formData.limit) {
            alert('Please fill in all required fields');
            return;
        }
        const finalLimit = parseFloat(formData.limit).toFixed(2);
        onUpdate(budget.id, {
            ...formData,
            limit: finalLimit
        });
    };

    const handleLimitBlur = () => {
        if (formData.limit) {
            setFormData({...formData, limit: parseFloat(formData.limit).toFixed(2)});
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Edit Budget</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select 
                            value={formData.category} 
                            onChange={(e) => setFormData({...formData, category: e.target.value})} 
                            className="w-full px-3 py-2 border rounded" 
                            required
                        >
                            <option value="">Select category</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Monthly Limit</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            value={formData.limit} 
                            onChange={(e) => setFormData({...formData, limit: e.target.value})}
                            onBlur={handleLimitBlur}
                            className="w-full px-3 py-2 border rounded" 
                            required 
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <button type="button" onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                            Update
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
