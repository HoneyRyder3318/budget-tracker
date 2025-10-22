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
                            Add to Savings
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
function SavingsTracker({ savingsItems, savingsBalance, totalNeededSavings, totalFullAmount, totalSaved, editingSavings, setEditingSavings, tempSavings, setTempSavings, setSavingsBalance, getMonthlyAmount, getSavedAmount, addSavingsPayment, adjustSavings, subscriptions }) {
    // Calculate thermometer percentage based on MANUAL BALANCE vs TARGET
    const thermometerPercentage = totalNeededSavings > 0 ? (savingsBalance / totalNeededSavings) * 100 : 0;
    
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6">Savings Tracker</h2>

            {/* Affiliate Ad Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="font-bold text-lg text-gray-800">Maximize Your Savings</p>
                        <p className="text-sm text-gray-600">Earn more with a high-yield savings account</p>
                    </div>
                    <a 
                        href="#" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                        Learn More
                    </a>
                </div>
            </div>

            {/* Thermometer Visual with Savings Balance */}
            <div className="bg-gradient-to-b from-gray-50 to-white border rounded-lg p-6 mb-6">
                <div className="flex items-start gap-6">
                    {/* Left: Thermometer */}
                    <div className="flex flex-col items-center">
                        <div className="text-sm font-medium text-gray-600 mb-2">Progress</div>
                        <div className="relative w-16 h-48 bg-gray-200 rounded-full overflow-hidden border-4 border-gray-300">
                            <div 
                                className={`absolute bottom-0 w-full transition-all duration-500 ${
                                    thermometerPercentage >= 100 ? 'bg-green-500' : 
                                    thermometerPercentage >= 80 ? 'bg-blue-500' : 
                                    thermometerPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ height: `${Math.min(thermometerPercentage, 100)}%` }}
                            />
                        </div>
                        <div className="mt-2 text-center">
                            <div className="text-2xl font-bold text-gray-800">{Math.round(thermometerPercentage)}%</div>
                            <div className="text-xs text-gray-500">of target</div>
                        </div>
                    </div>

                    {/* Right: Stats Grid */}
                    <div className="flex-1 space-y-4">
                        {/* Savings Balance Field - Prominently Displayed */}
                        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Your Savings Balance (Manual Entry)</p>
                            {editingSavings ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={tempSavings}
                                        onChange={(e) => setTempSavings(e.target.value)}
                                        className="flex-1 px-3 py-2 border-2 border-purple-300 rounded text-lg font-bold"
                                    />
                                    <button
                                        onClick={() => {
                                            setSavingsBalance(parseFloat(tempSavings));
                                            setEditingSavings(false);
                                        }}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setTempSavings(savingsBalance);
                                            setEditingSavings(false);
                                        }}
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl font-bold text-purple-700">${savingsBalance.toFixed(2)}</span>
                                    <button
                                        onClick={() => setEditingSavings(true)}
                                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                                    >
                                        Update Balance
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Other Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-blue-50 p-3 rounded">
                                <p className="text-xs text-gray-600">Tracked Contributions</p>
                                <p className="text-xl font-bold text-blue-600">${totalSaved.toFixed(2)}</p>
                                <p className="text-xs text-gray-500 mt-1">What you've logged</p>
                            </div>
                            <div className="bg-orange-50 p-3 rounded">
                                <p className="text-xs text-gray-600">Target Savings</p>
                                <p className="text-xl font-bold text-orange-600">${totalNeededSavings.toFixed(2)}</p>
                                <p className="text-xs text-gray-500 mt-1">Should have by now</p>
                            </div>
                            <div className={`p-3 rounded ${savingsBalance >= totalNeededSavings ? 'bg-green-50' : 'bg-red-50'}`}>
                                <p className="text-xs text-gray-600">Balance vs Target</p>
                                <p className={`text-xl font-bold ${savingsBalance >= totalNeededSavings ? 'text-green-600' : 'text-red-600'}`}>
                                    {savingsBalance >= totalNeededSavings ? '+' : ''}${(savingsBalance - totalNeededSavings).toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Actual vs needed</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Full amount info */}
                <div className="mt-4 pt-4 border-t text-center">
                    <p className="text-sm text-gray-600">
                        Total upcoming bills: <span className="font-bold text-gray-800">${totalFullAmount.toFixed(2)}</span>
                    </p>
                </div>
            </div>

            {/* Individual Bill Progress */}
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
