// Utility functions and helper components
const { useState, useEffect } = React;

// Helper function to calculate monthly amount from different frequencies
function getMonthlyAmount(amount, frequency) {
    const frequencyMap = { 'Monthly': 1, 'Quarterly': 3, 'Semi-Annual': 6, 'Annual': 12 };
    return parseFloat(amount) / (frequencyMap[frequency] || 1);
}

// Helper function to get total saved amount from savings log
function getSavedAmount(item) {
    if (!item.savingsLog || item.savingsLog.length === 0) return 0;
    return item.savingsLog.reduce((sum, entry) => sum + entry.amount, 0);
}

// SavingsActions component
function SavingsActions({ item, monthly, addSavingsPayment, adjustSavings, getSavedAmount, type }) {
    const [showAdjust, setShowAdjust] = useState(false);
    const [adjustAmount, setAdjustAmount] = useState('');
    const [saveAmount, setSaveAmount] = useState(monthly.toFixed(2));

    const handleAddPayment = () => {
        if (saveAmount && parseFloat(saveAmount) > 0) {
            addSavingsPayment(item.id, saveAmount, type);
            setSaveAmount(monthly.toFixed(2));
        }
    };

    const handleAdjust = () => {
        if (adjustAmount && parseFloat(adjustAmount) >= 0) {
            adjustSavings(item.id, adjustAmount, type);
            setShowAdjust(false);
            setAdjustAmount('');
        }
    };

    return (
        <div className="flex gap-2 flex-wrap">
            {!showAdjust ? (
                <>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            step="0.01"
                            value={saveAmount}
                            onChange={(e) => setSaveAmount(e.target.value)}
                            className="w-24 px-2 py-1 border rounded text-sm"
                        />
                        <button
                            onClick={handleAddPayment}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                            ✓ Add to Savings
                        </button>
                    </div>
                    <button
                        onClick={() => {
                            setShowAdjust(true);
                            setAdjustAmount(getSavedAmount(item).toFixed(2));
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                        Adjust Total
                    </button>
                </>
            ) : (
                <div className="flex items-center gap-2">
                    <span className="text-sm">Set total saved:</span>
                    <input
                        type="number"
                        step="0.01"
                        value={adjustAmount}
                        onChange={(e) => setAdjustAmount(e.target.value)}
                        className="w-24 px-2 py-1 border rounded text-sm"
                    />
                    <button onClick={handleAdjust} className="px-3 py-1 bg-green-600 text-white rounded text-sm">
                        Save
                    </button>
                    <button onClick={() => setShowAdjust(false)} className="px-3 py-1 bg-gray-300 rounded text-sm">
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}

// SavingsTracker component
function SavingsTracker({ savingsItems, savingsBalance, totalNeededSavings, totalSaved, editingSavings, setEditingSavings, tempSavings, setTempSavings, setSavingsBalance, getMonthlyAmount, getSavedAmount, addSavingsPayment, adjustSavings, subscriptions }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Savings Tracker</h2>
                <div className="flex items-center gap-4">
                    {editingSavings ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                step="0.01"
                                value={tempSavings}
                                onChange={(e) => setTempSavings(e.target.value)}
                                className="w-32 px-2 py-1 border rounded"
                            />
                            <button
                                onClick={() => {
                                    setSavingsBalance(parseFloat(tempSavings));
                                    setEditingSavings(false);
                                }}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setTempSavings(savingsBalance);
                                    setEditingSavings(false);
                                }}
                                className="px-3 py-1 bg-gray-300 rounded text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Savings Account:</span>
                            <span className="text-lg font-bold">${savingsBalance.toFixed(2)}</span>
                            <button
                                onClick={() => setEditingSavings(true)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Total Saved for Bills</p>
                    <p className="text-2xl font-bold text-blue-600">${totalSaved.toFixed(2)}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Total Needed</p>
                    <p className="text-2xl font-bold text-orange-600">${totalNeededSavings.toFixed(2)}</p>
                </div>
                <div className={`p-4 rounded ${savingsBalance >= totalNeededSavings ? 'bg-green-50' : 'bg-red-50'}`}>
                    <p className="text-sm text-gray-600">Account vs Needed</p>
                    <p className={`text-2xl font-bold ${savingsBalance >= totalNeededSavings ? 'text-green-600' : 'text-red-600'}`}>
                        {savingsBalance >= totalNeededSavings ? '+' : ''}${(savingsBalance - totalNeededSavings).toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {savingsItems.map(item => {
                    const saved = getSavedAmount(item);
                    const needed = parseFloat(item.amount);
                    const percentage = (saved / needed) * 100;
                    const monthly = getMonthlyAmount(item.amount, item.frequency);
                    const daysUntil = Math.ceil((new Date(item.nextPayment) - new Date()) / (1000 * 60 * 60 * 24));
                    
                    let statusColor = 'bg-green-500';
                    if (percentage < 100 && daysUntil <= 30) statusColor = 'bg-yellow-500';
                    if (percentage < 80) statusColor = 'bg-red-500';

                    return (
                        <div key={item.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-600">
                                        ${needed.toFixed(2)} {item.frequency} (${monthly.toFixed(2)}/mo)
                                    </p>
                                    <p className="text-xs text-gray-500">Due: {new Date(item.nextPayment).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">${saved.toFixed(2)} / ${needed.toFixed(2)}</p>
                                    <p className="text-sm text-gray-600">{percentage.toFixed(0)}% saved</p>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                <div className={`h-3 rounded-full ${statusColor}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
                            </div>
                            <SavingsActions 
                                item={item} 
                                monthly={monthly} 
                                addSavingsPayment={addSavingsPayment}
                                adjustSavings={adjustSavings}
                                getSavedAmount={getSavedAmount}
                                type={subscriptions.find(s => s.id === item.id) ? 'subscription' : 'bill'}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
