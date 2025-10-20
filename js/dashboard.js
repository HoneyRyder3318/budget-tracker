// Dashboard component with all summary views

function Dashboard({ totals, subscriptions, bills, budgets, savingsBalance, setSavingsBalance, getCategorySpending, getAllCategorySpending, exportData, importData, getMonthlyAmount, getSavedAmount, addSavingsPayment, adjustSavings }) {
    const [editingSavings, setEditingSavings] = useState(false);
    const [tempSavings, setTempSavings] = useState(savingsBalance);

    const allRecurring = [...subscriptions, ...bills];
    const upcomingPayments = allRecurring
        .map(item => {
            const daysUntil = Math.ceil((new Date(item.nextPayment) - new Date()) / (1000 * 60 * 60 * 24));
            return { ...item, daysUntil };
        })
        .filter(item => item.daysUntil >= 0 && item.daysUntil <= 7)
        .sort((a, b) => a.daysUntil - b.daysUntil);
    
    const totalSubscriptionCost = subscriptions.reduce((sum, sub) => sum + getMonthlyAmount(sub.amount, sub.frequency || 'Monthly'), 0);
    const totalBillsCost = bills.reduce((sum, bill) => sum + getMonthlyAmount(bill.amount, bill.frequency || 'Monthly'), 0);
    const totalRecurringCost = totalSubscriptionCost + totalBillsCost;

    const savingsItems = allRecurring.filter(item => (item.frequency || 'Monthly') !== 'Monthly');
    const totalNeededSavings = savingsItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const totalSaved = savingsItems.reduce((sum, item) => sum + getSavedAmount(item), 0);

    const categorySpending = getAllCategorySpending();
    const sortedCategories = Object.entries(categorySpending).sort((a, b) => b[1] - a[1]);
    const maxSpending = sortedCategories.length > 0 ? sortedCategories[0][1] : 0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Income</p>
                            <p className="text-2xl font-bold text-green-600">${totals.income.toFixed(2)}</p>
                        </div>
                        <TrendingUp className="text-green-600" size={32} />
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Expenses</p>
                            <p className="text-2xl font-bold text-red-600">${totals.expenses.toFixed(2)}</p>
                        </div>
                        <TrendingDown className="text-red-600" size={32} />
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Balance</p>
                            <p className={`text-2xl font-bold ${totals.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                ${totals.balance.toFixed(2)}
                            </p>
                        </div>
                        <DollarSign className="text-blue-600" size={32} />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Recurring Payments Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-gray-600">Subscriptions</p>
                        <p className="text-2xl font-bold">{subscriptions.length}</p>
                        <p className="text-sm text-red-600">${totalSubscriptionCost.toFixed(2)}/mo</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Bills</p>
                        <p className="text-2xl font-bold">{bills.length}</p>
                        <p className="text-sm text-red-600">${totalBillsCost.toFixed(2)}/mo</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Total Monthly</p>
                        <p className="text-3xl font-bold text-red-600">${totalRecurringCost.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Yearly: ${(totalRecurringCost * 12).toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {upcomingPayments.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="text-orange-500" size={24} />
                        <h2 className="text-xl font-bold">Upcoming Payments (Next 7 Days)</h2>
                    </div>
                    <div className="space-y-3">
                        {upcomingPayments.map(payment => (
                            <div key={payment.id} className="flex justify-between items-center p-3 bg-orange-50 rounded border-l-4 border-orange-500">
                                <div>
                                    <p className="font-medium">{payment.name}</p>
                                    <p className="text-sm text-gray-600">{new Date(payment.nextPayment).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-orange-600">${payment.amount}</p>
                                    <p className="text-xs text-gray-600">{payment.daysUntil === 0 ? 'Today' : `${payment.daysUntil} days`}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {sortedCategories.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Spending by Category</h2>
                    <div className="space-y-3">
                        {sortedCategories.map(([category, amount]) => {
                            const percentage = maxSpending > 0 ? (amount / maxSpending) * 100 : 0;
                            return (
                                <div key={category}>
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium">{category}</span>
                                        <span className="text-sm font-bold">${amount.toFixed(2)}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-8">
                                        <div 
                                            className="h-8 rounded-full bg-blue-500 flex items-center justify-end pr-2" 
                                            style={{ width: `${percentage}%` }}
                                        >
                                            {percentage > 15 && (
                                                <span className="text-white text-xs font-medium">
                                                    {((amount / sortedCategories.reduce((sum, [, amt]) => sum + amt, 0)) * 100).toFixed(0)}%
                                                </span>
                                            )}
                                        </div>
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

            {savingsItems.length > 0 && (
                <SavingsTracker 
                    savingsItems={savingsItems}
                    savingsBalance={savingsBalance}
                    totalNeededSavings={totalNeededSavings}
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

            {budgets.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Budget Overview</h2>
                    <div className="space-y-4">
                        {budgets.map(budget => {
                            const spent = getCategorySpending(budget.category);
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
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Data Management</h2>
                <div className="flex flex-wrap gap-3">
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
                <p className="text-sm text-gray-600 mt-2">Export your data to backup or transfer between devices</p>
            </div>
        </div>
    );
}
