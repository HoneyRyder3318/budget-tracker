// Main BudgetTracker component

function BudgetTracker() {
    const [transactions, setTransactions] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [bills, setBills] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [savingsBalance, setSavingsBalance] = useState(0);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const [showAddSubscription, setShowAddSubscription] = useState(false);
    const [showAddBill, setShowAddBill] = useState(false);
    const [showAddBudget, setShowAddBudget] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState(null);
    const [editingBill, setEditingBill] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('budgetData');
        if (saved) {
            const data = JSON.parse(saved);
            setTransactions(data.transactions || []);
            setSubscriptions(data.subscriptions || []);
            setBills(data.bills || []);
            setBudgets(data.budgets || []);
            setSavingsBalance(data.savingsBalance || 0);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('budgetData', JSON.stringify({ 
            transactions, subscriptions, bills, budgets, savingsBalance 
        }));
    }, [transactions, subscriptions, bills, budgets, savingsBalance]);

    const addTransaction = (transaction) => {
        const newTransaction = { ...transaction, id: Date.now() };
        setTransactions(prev => [...prev, newTransaction]);
        setShowAddTransaction(false);
    };

    const addSubscription = (subscription) => {
        const frequency = subscription.frequency || 'Monthly';
        const category = subscription.category || 'Other';
        const savingsLog = frequency !== 'Monthly' ? [] : undefined;
        const newSubscription = { ...subscription, id: Date.now(), frequency, category, savingsLog };
        setSubscriptions(prev => [...prev, newSubscription]);
        setShowAddSubscription(false);
    };

    const addBill = (bill) => {
        const frequency = bill.frequency || 'Monthly';
        const category = bill.category || 'Other';
        const savingsLog = frequency !== 'Monthly' ? [] : undefined;
        const newBill = { ...bill, id: Date.now(), frequency, category, savingsLog };
        setBills(prev => [...prev, newBill]);
        setShowAddBill(false);
    };

    const addBudget = (budget) => {
        const newBudget = { ...budget, id: Date.now() };
        setBudgets(prev => [...prev, newBudget]);
        setShowAddBudget(false);
    };

    const updateSubscription = (id, updatedData) => {
        setSubscriptions(subscriptions.map(s => 
            s.id === id ? { ...s, ...updatedData } : s
        ));
        setEditingSubscription(null);
    };

    const updateBill = (id, updatedData) => {
        setBills(bills.map(b => 
            b.id === id ? { ...b, ...updatedData } : b
        ));
        setEditingBill(null);
    };

    const deleteTransaction = (id) => setTransactions(transactions.filter(t => t.id !== id));
    const deleteSubscription = (id) => setSubscriptions(subscriptions.filter(s => s.id !== id));
    const deleteBill = (id) => setBills(bills.filter(b => b.id !== id));

    const toggleSubscriptionFlag = (id) => {
        setSubscriptions(subscriptions.map(s => 
            s.id === id ? { ...s, flaggedForCancellation: !s.flaggedForCancellation } : s
        ));
    };

    const toggleBillFlag = (id) => {
        setBills(bills.map(b => 
            b.id === id ? { ...b, flaggedForReview: !b.flaggedForReview } : b
        ));
    };

    const addSavingsPayment = (id, amount, type) => {
        const date = new Date().toISOString();
        if (type === 'subscription') {
            setSubscriptions(subscriptions.map(s => {
                if (s.id === id) {
                    const log = s.savingsLog || [];
                    return { ...s, savingsLog: [...log, { date, amount: parseFloat(amount) }] };
                }
                return s;
            }));
        } else {
            setBills(bills.map(b => {
                if (b.id === id) {
                    const log = b.savingsLog || [];
                    return { ...b, savingsLog: [...log, { date, amount: parseFloat(amount) }] };
                }
                return b;
            }));
        }
    };

    const adjustSavings = (id, newAmount, type) => {
        if (type === 'subscription') {
            setSubscriptions(subscriptions.map(s => 
                s.id === id ? { ...s, savingsLog: [{ date: new Date().toISOString(), amount: parseFloat(newAmount) }] } : s
            ));
        } else {
            setBills(bills.map(b => 
                b.id === id ? { ...b, savingsLog: [{ date: new Date().toISOString(), amount: parseFloat(newAmount) }] } : b
            ));
        }
    };

    const exportData = () => {
        const data = { transactions, subscriptions, bills, budgets, savingsBalance, exportDate: new Date().toISOString() };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'budget-backup.json';
        a.click();
    };

    const importData = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (data.transactions) setTransactions(data.transactions);
                    if (data.subscriptions) setSubscriptions(data.subscriptions);
                    if (data.bills) setBills(data.bills);
                    if (data.budgets) setBudgets(data.budgets);
                    if (data.savingsBalance !== undefined) setSavingsBalance(data.savingsBalance);
                    alert('Data imported successfully!');
                } catch (error) {
                    alert('Error importing data');
                }
            };
            reader.readAsText(file);
        }
    };

    const calculateTotals = () => {
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);
        return { income, expenses, balance: income - expenses };
    };

    const getCategorySpending = (category) => {
        return transactions.filter(t => t.type === 'expense' && t.category === category).reduce((sum, t) => sum + parseFloat(t.amount), 0);
    };

    const getAllCategorySpending = () => {
        const spending = {};
        
        transactions.filter(t => t.type === 'expense').forEach(t => {
            spending[t.category] = (spending[t.category] || 0) + parseFloat(t.amount);
        });
        
        subscriptions.forEach(sub => {
            const monthly = getMonthlyAmount(sub.amount, sub.frequency || 'Monthly');
            const category = sub.category || 'Subscriptions';
            spending[category] = (spending[category] || 0) + monthly;
        });
        
        bills.forEach(bill => {
            const monthly = getMonthlyAmount(bill.amount, bill.frequency || 'Monthly');
            const category = bill.category || 'Bills';
            spending[category] = (spending[category] || 0) + monthly;
        });
        
        return spending;
    };

    const totals = calculateTotals();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-blue-600 text-white p-4 shadow-lg">
                <h1 className="text-2xl font-bold">Budget Tracker</h1>
                <p className="text-blue-100 text-sm">Take control of your finances</p>
            </div>

            <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="flex overflow-x-auto">
                    {['dashboard', 'transactions', 'subscriptions', 'bills', 'budgets'].map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)} 
                            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-4">
                {activeTab === 'dashboard' && (
                    <Dashboard 
                        totals={totals} 
                        subscriptions={subscriptions}
                        bills={bills}
                        budgets={budgets}
                        savingsBalance={savingsBalance}
                        setSavingsBalance={setSavingsBalance}
                        getCategorySpending={getCategorySpending}
                        getAllCategorySpending={getAllCategorySpending}
                        exportData={exportData} 
                        importData={importData}
                        getMonthlyAmount={getMonthlyAmount}
                        getSavedAmount={getSavedAmount}
                        addSavingsPayment={addSavingsPayment}
                        adjustSavings={adjustSavings}
                    />
                )}
                {activeTab === 'transactions' && (
                    <Transactions 
                        transactions={transactions} 
                        onAdd={() => setShowAddTransaction(true)} 
                        onDelete={deleteTransaction} 
                    />
                )}
                {activeTab === 'subscriptions' && (
                    <Subscriptions 
                        subscriptions={subscriptions} 
                        onAdd={() => setShowAddSubscription(true)} 
                        onEdit={setEditingSubscription}
                        onDelete={deleteSubscription} 
                        onToggleFlag={toggleSubscriptionFlag}
                        getMonthlyAmount={getMonthlyAmount}
                        getSavedAmount={getSavedAmount}
                        addSavingsPayment={addSavingsPayment}
                        adjustSavings={adjustSavings}
                    />
                )}
                {activeTab === 'bills' && (
                    <Bills 
                        bills={bills} 
                        onAdd={() => setShowAddBill(true)} 
                        onEdit={setEditingBill}
                        onDelete={deleteBill} 
                        onToggleFlag={toggleBillFlag}
                        getMonthlyAmount={getMonthlyAmount}
                        getSavedAmount={getSavedAmount}
                        addSavingsPayment={addSavingsPayment}
                        adjustSavings={adjustSavings}
                    />
                )}
                {activeTab === 'budgets' && (
                    <Budgets 
                        budgets={budgets} 
                        onAdd={() => setShowAddBudget(true)} 
                        getCategorySpending={getCategorySpending} 
                    />
                )}
            </div>

            {showAddTransaction && <AddTransactionModal onClose={() => setShowAddTransaction(false)} onAdd={addTransaction} />}
            {showAddSubscription && <AddSubscriptionModal onClose={() => setShowAddSubscription(false)} onAdd={addSubscription} />}
            {showAddBill && <AddBillModal onClose={() => setShowAddBill(false)} onAdd={addBill} />}
            {showAddBudget && <AddBudgetModal onClose={() => setShowAddBudget(false)} onAdd={addBudget} />}
            {editingSubscription && <EditSubscriptionModal subscription={editingSubscription} onClose={() => setEditingSubscription(null)} onUpdate={updateSubscription} />}
            {editingBill && <EditBillModal bill={editingBill} onClose={() => setEditingBill(null)} onUpdate={updateBill} />}
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BudgetTracker />);
