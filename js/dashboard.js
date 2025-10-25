// Dashboard component with all summary views and month filtering

function Dashboard({ transactions, subscriptions, bills, budgets, savingsBalance, setSavingsBalance, getCategorySpending, exportData, importData, getMonthlyAmount, getSavedAmount, addSavingsPayment, adjustSavings, deleteSubscription, toggleSubscriptionFlag }) {
    const [editingSavings, setEditingSavings] = useState(false);
    const [tempSavings, setTempSavings] = useState(savingsBalance);
    const [testDate, setTestDate] = useState(null); // For date testing
    const [dismissedReminders, setDismissedReminders] = useState(new Set()); // Track "remind me again" dismissals
    
    // Get current month as default
    const getCurrentMonth = () => {
        const now = testDate || new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    };
    
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
    
    // Get unique months from transactions
    const getAvailableMonths = () => {
        const months = transactions.map(t => {
            const date = new Date(t.date);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        });
        const uniqueMonths = [...new Set(months)].sort().reverse();
        
        // Always include current month even if no transactions
        const currentMonth = getCurrentMonth();
        if (!uniqueMonths.includes(currentMonth)) {
            uniqueMonths.unshift(currentMonth);
        }
        
        return uniqueMonths;
    };
    
    const availableMonths = getAvailableMonths();
    
    // Filter transactions by selected month
    const filteredTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        const transactionMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        return transactionMonth === selectedMonth;
    });
    
    // Calculate totals for selected month
    const monthlyIncome = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const monthlyExpenses = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const monthlyBalance = monthlyIncome - monthlyExpenses;
    
    // Category spending for selected month
    const getCategorySpendingForMonth = (category) => {
        const transactionSpending = filteredTransactions
            .filter(t => t.type === 'expense' && t.category === category)
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
        // Add monthly portion of subscriptions and bills
        const subscriptionSpending = subscriptions
            .filter(s => s.category === category)
            .reduce((sum, s) => sum + parseFloat(getMonthlyAmount(s.amount, s.frequency)), 0);
        
        const billSpending = bills
            .filter(b => b.category === category)
            .reduce((sum, b) => sum + parseFloat(getMonthlyAmount(b.amount, b.frequency)), 0);
        
        return transactionSpending + subscriptionSpending + billSpending;
    };
    
    const getAllCategorySpendingForMonth = () => {
        const categories = {};
        
        // Get all categories from transactions, subscriptions, and bills
        const allCategories = new Set([
            ...filteredTransactions.filter(t => t.type === 'expense').map(t => t.category),
            ...subscriptions.map(s => s.category),
            ...bills.map(b => b.category)
        ]);
        
        allCategories.forEach(category => {
            categories[category] = getCategorySpendingForMonth(category);
        });
        
        return categories;
    };

    const allRecurring = [...subscriptions, ...bills];
    const upcomingPayments = allRecurring
        .map(item => {
            const daysUntil = Math.ceil((new Date(item.nextPayment) - new Date()) / (1000 * 60 * 60 * 24));
            return { ...item, daysUntil };
        })
        .filter(item => item.daysUntil >= 0 && item.daysUntil <= 7)
        .sort((a, b) => a.daysUntil - b.daysUntil);
    
    const totalSubscriptionCost = subscriptions.reduce((sum, sub) => sum + parseFloat(getMonthlyAmount(sub.amount, sub.frequency || 'Monthly')), 0);
    const totalBillsCost = bills.reduce((sum, bill) => sum + parseFloat(getMonthlyAmount(bill.amount, bill.frequency || 'Monthly')), 0);
    const totalRecurringCost = totalSubscriptionCost + totalBillsCost;

    const savingsItems = allRecurring.filter(item => (item.frequency || 'Monthly') !== 'Monthly');
    
    // MONTHLY TARGET CALCULATION: Cumulative monthly targets that increase on the 1st
    const calculateShouldHaveSaved = (item) => {
        const frequency = item.frequency || 'Monthly';
        const frequencyMonths = { 'Quarterly': 3, 'Semi-Annual': 6, 'Annual': 12 }[frequency];
        if (!frequencyMonths) return 0;
        
        const monthlyAmount = parseFloat(item.amount) / frequencyMonths;
        const nextPaymentDate = new Date(item.nextPayment);
        const now = testDate || new Date(); // Use test date if set
        
        // If payment is overdue, should have full amount
        if (nextPaymentDate <= now) return parseFloat(item.amount);
        
        // Calculate months elapsed in this cycle
        // Assume last payment was frequencyMonths ago from next payment date
        const lastPaymentDate = new Date(nextPaymentDate);
        lastPaymentDate.setMonth(lastPaymentDate.getMonth() - frequencyMonths);
        
        // Count whole months since last payment
        const yearsDiff = now.getFullYear() - lastPaymentDate.getFullYear();
        const monthsDiff = now.getMonth() - lastPaymentDate.getMonth();
        const monthsElapsed = Math.max(0, yearsDiff * 12 + monthsDiff);
        
        // Target = monthly amount Ã— whole months elapsed
        const shouldHave = monthlyAmount * monthsElapsed;
        
        // Cap at full bill amount
        return Math.max(0, Math.min(shouldHave, parseFloat(item.amount)));
    };
    
    const totalNeededSavings = savingsItems.reduce((sum, item) => sum + calculateShouldHaveSaved(item), 0);
    const totalFullAmount = savingsItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const totalSaved = savingsItems.reduce((sum, item) => sum + getSavedAmount(item), 0);

    const categorySpending = getAllCategorySpendingForMonth();
    const sortedCategories = Object.entries(categorySpending).sort((a, b) => b[1] - a[1]);
    const maxSpending = sortedCategories.length > 0 ? sortedCategories[0][1] : 0;
    
    // Format month for display
    const formatMonthDisplay = (monthStr) => {
        const [year, month] = monthStr.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    // Get flagged subscriptions due in next 7 days (excluding dismissed ones)
    const flaggedSubscriptionsDueSoon = subscriptions.filter(sub => {
        if (!sub.flaggedForCancellation || dismissedReminders.has(sub.id)) return false;
        const daysUntil = Math.ceil((new Date(sub.nextPayment) - new Date()) / (1000 * 60 * 60 * 24));
        return daysUntil >= 0 && daysUntil <= 7;
    });

    const handleCancelled = (id) => {
        deleteSubscription(id);
    };

    const handleRemindAgain = (id) => {
        setDismissedReminders(prev => new Set([...prev, id]));
    };

    const handleKeepIt = (id) => {
        toggleSubscriptionFlag(id);
    };

    return (
        <div className="space-y-6">
            {/* Month Selector */}
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Dashboard</h2>
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-600">Viewing:</label>
                        <select 
                            value={selectedMonth} 
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="px-4 py-2 border rounded-lg font-medium"
                        >
                            {availableMonths.map(month => (
                                <option key={month} value={month}>
                                    {formatMonthDisplay(month)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Recurring Payments Summary */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Recurring Payments</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600">Monthly Total</p>
                        <p className="text-2xl font-bold text-purple-600">${totalRecurringCost.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{subscriptions.length} subscriptions + {bills.length} bills</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Yearly Total</p>
                        <p className="text-2xl font-bold text-purple-600">${(totalRecurringCost * 12).toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Estimated annual cost</p>
                    </div>
                </div>
            </div>

            {/* Upcoming Payments - Combined */}
            {(flaggedSubscriptionsDueSoon.length > 0 || upcomingPayments.length > 0) && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Upcoming Payments (Next 7 Days)</h2>
                    
                    {/* Flagged Subscriptions */}
                    {flaggedSubscriptionsDueSoon.length > 0 && (
                        <div className="mb-4">
                            <h3 className="font-semibold text-red-700 mb-3 flex items-center">
                                <AlertCircle className="mr-2" size={20} />
                                Flagged for Cancellation
                            </h3>
                            <div className="space-y-3">
                                {flaggedSubscriptionsDueSoon.map(sub => {
                                    const daysUntil = Math.ceil((new Date(sub.nextPayment) - new Date()) / (1000 * 60 * 60 * 24));
                                    return (
                                        <div key={sub.id} className="bg-red-50 p-3 rounded border border-red-200">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-bold">{sub.name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        ${sub.amount} - Due {daysUntil === 0 ? 'today' : `in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 flex-wrap">
                                                <button
                                                    onClick={() => handleCancelled(sub.id)}
                                                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                                                >
                                                    I cancelled it - delete
                                                </button>
                                                <button
                                                    onClick={() => handleRemindAgain(sub.id)}
                                                    className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                                                >
                                                    Remind me again
                                                </button>
                                                <button
                                                    onClick={() => handleKeepIt(sub.id)}
                                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                                >
                                                    I'm keeping it - unflag
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    
                    {/* Regular Upcoming Payments */}
                    {upcomingPayments.filter(item => !item.flaggedForCancellation || dismissedReminders.has(item.id)).length > 0 && (
                        <div>
                            {flaggedSubscriptionsDueSoon.length > 0 && <hr className="my-4" />}
                            <h3 className="font-semibold text-gray-700 mb-3">All Upcoming</h3>
                            <div className="space-y-2">
                                {upcomingPayments
                                    .filter(item => !item.flaggedForCancellation || dismissedReminders.has(item.id))
                                    .map(item => (
                                        <div key={item.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                                            <span>{item.name || item.description}</span>
                                            <span className="font-medium">
                                                ${item.amount} - {item.daysUntil === 0 ? 'Today' : `in ${item.daysUntil} day${item.daysUntil > 1 ? 's' : ''}`}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Savings Tracker */}
            {savingsItems.length > 0 && (
                <SavingsTracker 
                    savingsItems={savingsItems}
                    savingsBalance={savingsBalance}
                    totalNeededSavings={totalNeededSavings}
                    totalFullAmount={totalFullAmount}
                    totalSaved={totalSaved}
                    editingSavings={editingSavings}
                    setEditingSavings={setEditingSavings}
                    tempSavings={tempSavings}
                    setTempSavings={setTempSavings}
                    setSavingsBalance={setSavingsBalance}
                    getMonthlyAmount={getMonthlyAmount}
                    getSavedAmount={getSavedAmount}
                    addSavingsPayment={addSavingsPayment}
                    adjustSavings={adjustSavings}
                    subscriptions={subscriptions}
                />
            )}

            {/* Spending by Category */}
            {sortedCategories.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Spending by Category ({formatMonthDisplay(selectedMonth)})</h2>
                    <div className="space-y-3">
                        {sortedCategories.map(([category, amount]) => {
                            const percentage = maxSpending > 0 ? (amount / maxSpending) * 100 : 0;
                            const totalSpending = sortedCategories.reduce((sum, [, amt]) => sum + amt, 0);
                            const categoryPercentage = totalSpending > 0 ? (amount / totalSpending) * 100 : 0;
                            
                            return (
                                <div key={category}>
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium">{category}</span>
                                        <span className="text-sm text-gray-600">
                                            ${amount.toFixed(2)} ({categoryPercentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div 
                                            className="bg-blue-600 h-3 rounded-full transition-all" 
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        <div className="pt-3 border-t mt-4">
                            <div className="flex justify-between">
                                <span className="font-bold text-lg">Total Monthly Spending</span>
                                <span className="font-bold text-lg text-red-600">
                                    ${sortedCategories.reduce((sum, [, amount]) => sum + amount, 0).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Savings Tracker */}
            {savingsItems.length > 0 && (
                <SavingsTracker 
                    savingsItems={savingsItems}
                    savingsBalance={savingsBalance}
                    totalNeededSavings={totalNeededSavings}
                    totalFullAmount={totalFullAmount}
                    totalSaved={totalSaved}
                    editingSavings={editingSavings}
                    setEditingSavings={setEditingSavings}
                    tempSavings={tempSavings}
                    setTempSavings={setTempSavings}
                    setSavingsBalance={setSavingsBalance}
                    getMonthlyAmount={getMonthlyAmount}
                    getSavedAmount={getSavedAmount}
                    addSavingsPayment={addSavingsPayment}
                    adjustSavings={adjustSavings}
                    subscriptions={subscriptions}
                />
            )}

            {/* Budget Overview */}
            {budgets.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Budget Overview ({formatMonthDisplay(selectedMonth)})</h2>
                    <div className="space-y-4">
                        {budgets.map(budget => {
                            const spent = getCategorySpendingForMonth(budget.category);
                            const percentage = (spent / budget.limit) * 100;
                            return (
                                <div key={budget.id}>
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium">{budget.category}</span>
                                        <span className="text-sm text-gray-600">${spent.toFixed(2)} / ${budget.limit}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div 
                                            className={`h-3 rounded-full ${percentage > 100 ? 'bg-red-500' : percentage > 80 ? 'bg-orange-500' : 'bg-green-500'}`} 
                                            style={{ width: `${Math.min(percentage, 100)}%` }} 
                                        />
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">{percentage.toFixed(1)}% used</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Data Management */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Data Management</h2>
                <div className="flex gap-4">
                    <button onClick={exportData} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        <Download size={20} />
                        Export Data
                    </button>
                    <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer">
                        <Upload size={20} />
                        Import Data
                        <input type="file" accept=".json" onChange={importData} className="hidden" />
                    </label>
                </div>
                <p className="text-sm text-gray-600 mt-2">Export your data regularly to keep backups!</p>
            </div>

            {/* TEST CONTROLS - Remove before production */}
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 shadow">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-yellow-800">ðŸ§ª Date Testing Controls</h2>
                        <p className="text-sm text-yellow-700">Test how savings targets change on different dates</p>
                    </div>
                    {testDate && (
                        <span className="px-3 py-1 bg-yellow-600 text-white rounded font-bold">
                            TEST MODE ACTIVE
                        </span>
                    )}
                </div>
                <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                        <button 
                            onClick={() => setTestDate(null)}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-medium"
                        >
                            âœ“ Real Date (Today)
                        </button>
                        <button 
                            onClick={() => setTestDate(new Date('2025-11-01'))}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Nov 1, 2025
                        </button>
                        <button 
                            onClick={() => setTestDate(new Date('2025-12-01'))}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Dec 1, 2025
                        </button>
                        <button 
                            onClick={() => setTestDate(new Date('2026-01-01'))}
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                            Jan 1, 2026
                        </button>
                        <button 
                            onClick={() => setTestDate(new Date('2026-02-01'))}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Feb 1, 2026
                        </button>
                    </div>
                    <div className="bg-white rounded p-3 border border-yellow-300">
                        <p className="text-sm text-gray-700">
                            <strong>Current simulated date:</strong> {testDate ? testDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Real date (not testing)'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}






