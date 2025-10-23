// Page components for different tabs

function Transactions({ transactions, onAdd, onDelete }) {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('all');
    
    // Get unique months from transactions
    const getAvailableMonths = () => {
        const months = transactions.map(t => {
            const date = new Date(t.date);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        });
        return [...new Set(months)].sort().reverse();
    };
    
    const availableMonths = getAvailableMonths();
    
    const filteredTransactions = transactions
        .filter(t => filter === 'all' || t.type === filter)
        .filter(t => 
            t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
            t.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(t => {
            if (selectedMonth === 'all') return true;
            const date = new Date(t.date);
            const transactionMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            return transactionMonth === selectedMonth;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Calculate monthly totals
    const monthlyIncome = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const monthlyExpenses = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Transactions</h2>
                <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    <PlusCircle size={20} />
                    Add Transaction
                </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow space-y-3">
                <input 
                    type="text" 
                    placeholder="Search transactions..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full px-4 py-2 border rounded" 
                />
                
                <div className="flex flex-wrap gap-2">
                    <div className="flex gap-2">
                        {['all', 'income', 'expense'].map(f => (
                            <button 
                                key={f} 
                                onClick={() => setFilter(f)} 
                                className={`px-4 py-2 rounded ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                    
                    <select 
                        value={selectedMonth} 
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="px-4 py-2 border rounded"
                    >
                        <option value="all">All Months</option>
                        {availableMonths.map(month => {
                            const [year, monthNum] = month.split('-');
                            const date = new Date(year, monthNum - 1);
                            const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                            return <option key={month} value={month}>{monthName}</option>;
                        })}
                    </select>
                </div>
                
                {selectedMonth !== 'all' && (
                    <div className="flex gap-4 pt-3 border-t">
                        <div className="flex-1 text-center">
                            <p className="text-sm text-gray-600">Income</p>
                            <p className="text-lg font-bold text-green-600">+${monthlyIncome.toFixed(2)}</p>
                        </div>
                        <div className="flex-1 text-center">
                            <p className="text-sm text-gray-600">Expenses</p>
                            <p className="text-lg font-bold text-red-600">-${monthlyExpenses.toFixed(2)}</p>
                        </div>
                        <div className="flex-1 text-center">
                            <p className="text-sm text-gray-600">Net</p>
                            <p className={`text-lg font-bold ${monthlyIncome - monthlyExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${(monthlyIncome - monthlyExpenses).toFixed(2)}
                            </p>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredTransactions.length === 0 ? (
                    <p className="p-6 text-center text-gray-500">No transactions found</p>
                ) : (
                    <div className="divide-y">
                        {filteredTransactions.map(transaction => (
                            <div key={transaction.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">{transaction.description}</p>
                                        <span className={`px-2 py-1 text-xs rounded ${transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {transaction.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{transaction.category} - {transaction.source}</p>
                                    <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className={`text-xl font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                                    </p>
                                    <button onClick={() => onDelete(transaction.id)} className="text-red-600 hover:text-red-800">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function Subscriptions({ subscriptions, onAdd, onEdit, onDelete, onToggleFlag, getMonthlyAmount, getSavedAmount, addSavingsPayment, adjustSavings }) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Subscriptions</h2>
                <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    <PlusCircle size={20} />
                    Add Subscription
                </button>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {subscriptions.length === 0 ? (
                    <p className="p-6 text-center text-gray-500">No subscriptions added yet</p>
                ) : (
                    <div className="divide-y">
                        {subscriptions.map(sub => {
                            const frequency = sub.frequency || 'Monthly';
                            const monthly = getMonthlyAmount(sub.amount, frequency);
                            const needsSavings = frequency !== 'Monthly';
                            const saved = needsSavings ? getSavedAmount(sub) : 0;

                            return (
                                <div key={sub.id} className={`p-4 ${sub.flaggedForCancellation ? 'bg-orange-50 border-l-4 border-orange-500' : ''}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg">{sub.name}</h3>
                                                {sub.flaggedForCancellation && (
                                                    <span className="px-2 py-1 text-xs bg-orange-500 text-white rounded">Flagged</span>
                                                )}
                                            </div>
                                            <p className="text-gray-600">{sub.category}</p>
                                            <p className="text-sm text-gray-500">Source: {sub.source}</p>
                                            <p className="text-sm text-gray-500">Next payment: {new Date(sub.nextPayment).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-blue-600">${sub.amount}</p>
                                            <p className="text-sm text-gray-600">{frequency}</p>
                                            {frequency !== 'Monthly' && (
                                                <p className="text-xs text-gray-500">${monthly}/mo</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {needsSavings && (
                                        <div className="mt-3 pt-3 border-t">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span>Saved for next payment:</span>
                                                <span className="font-bold">${saved.toFixed(2)} / ${sub.amount}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                                <div 
                                                    className={`h-3 rounded-full transition-all ${
                                                        saved >= parseFloat(sub.amount) ? 'bg-green-500' : 
                                                        saved >= parseFloat(sub.amount) * 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${Math.min((saved / parseFloat(sub.amount)) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <SavingsActions 
                                                item={sub} 
                                                monthly={monthly} 
                                                addSavingsPayment={addSavingsPayment}
                                                adjustSavings={adjustSavings}
                                                getSavedAmount={getSavedAmount}
                                                type="subscription"
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="flex gap-2 mt-3">
                                        <button 
                                            onClick={() => onToggleFlag(sub.id)} 
                                            className={`px-3 py-1 text-sm rounded ${sub.flaggedForCancellation ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
                                        >
                                            {sub.flaggedForCancellation ? 'Unflag' : 'Flag for Cancellation'}
                                        </button>
                                        <button onClick={() => onEdit(sub)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                                            Edit
                                        </button>
                                        <button onClick={() => onDelete(sub.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

function Bills({ bills, onAdd, onEdit, onDelete, onToggleFlag, getMonthlyAmount, getSavedAmount, addSavingsPayment, adjustSavings }) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Bills</h2>
                <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    <PlusCircle size={20} />
                    Add Bill
                </button>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {bills.length === 0 ? (
                    <p className="p-6 text-center text-gray-500">No bills added yet</p>
                ) : (
                    <div className="divide-y">
                        {bills.map(bill => {
                            const frequency = bill.frequency || 'Monthly';
                            const monthly = getMonthlyAmount(bill.amount, frequency);
                            const needsSavings = frequency !== 'Monthly';
                            const saved = needsSavings ? getSavedAmount(bill) : 0;

                            return (
                                <div key={bill.id} className={`p-4 ${bill.flaggedForReview ? 'bg-yellow-50 border-l-4 border-yellow-500' : ''}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg">{bill.name}</h3>
                                                {bill.flaggedForReview && (
                                                    <span className="px-2 py-1 text-xs bg-yellow-500 text-white rounded">Flagged</span>
                                                )}
                                            </div>
                                            <p className="text-gray-600">{bill.category}</p>
                                            <p className="text-sm text-gray-500">Source: {bill.source}</p>
                                            <p className="text-sm text-gray-500">Next payment: {new Date(bill.nextPayment).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-purple-600">${bill.amount}</p>
                                            <p className="text-sm text-gray-600">{frequency}</p>
                                            {frequency !== 'Monthly' && (
                                                <p className="text-xs text-gray-500">${monthly}/mo</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {needsSavings && (
                                        <div className="mt-3 pt-3 border-t">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span>Saved for next payment:</span>
                                                <span className="font-bold">${saved.toFixed(2)} / ${bill.amount}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                                <div 
                                                    className={`h-3 rounded-full transition-all ${
                                                        saved >= parseFloat(bill.amount) ? 'bg-green-500' : 
                                                        saved >= parseFloat(bill.amount) * 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${Math.min((saved / parseFloat(bill.amount)) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <SavingsActions 
                                                item={bill} 
                                                monthly={monthly} 
                                                addSavingsPayment={addSavingsPayment}
                                                adjustSavings={adjustSavings}
                                                getSavedAmount={getSavedAmount}
                                                type="bill"
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="flex gap-2 mt-3">
                                        <button 
                                            onClick={() => onToggleFlag(bill.id)} 
                                            className={`px-3 py-1 text-sm rounded ${bill.flaggedForReview ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-yellow-600 text-white hover:bg-yellow-700'}`}
                                        >
                                            {bill.flaggedForReview ? 'Unflag' : 'Flag for Review'}
                                        </button>
                                        <button onClick={() => onEdit(bill)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                                            Edit
                                        </button>
                                        <button onClick={() => onDelete(bill.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

function Budgets({ budgets, onAdd, onEdit, onDelete, getCategorySpending }) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Budgets</h2>
                <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    <PlusCircle size={20} />
                    Add Budget
                </button>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {budgets.length === 0 ? (
                    <p className="p-6 text-center text-gray-500">No budgets set yet</p>
                ) : (
                    <div className="divide-y">
                        {budgets.map(budget => {
                            const spent = getCategorySpending(budget.category);
                            const percentage = (spent / budget.limit) * 100;
                            const remaining = budget.limit - spent;
                            
                            return (
                                <div key={budget.id} className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-medium text-lg">{budget.category}</p>
                                            <p className="text-sm text-gray-600">Monthly limit: ${budget.limit}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold">${spent.toFixed(2)}</p>
                                            <p className={`text-sm ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {remaining >= 0 ? `$${remaining.toFixed(2)} left` : `$${Math.abs(remaining).toFixed(2)} over`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                                        <div 
                                            className={`h-4 rounded-full transition-all ${percentage > 100 ? 'bg-red-500' : percentage > 80 ? 'bg-orange-500' : 'bg-green-500'}`} 
                                            style={{ width: `${Math.min(percentage, 100)}%` }} 
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-gray-600">{percentage.toFixed(1)}% used</p>
                                        <div className="flex gap-2">
                                            <button onClick={() => onEdit(budget)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                                                Edit
                                            </button>
                                            <button onClick={() => onDelete(budget.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
