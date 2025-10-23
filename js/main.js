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
    const [editingBudget, setEditingBudget] = useState(null);

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

    const updateBudget = (id, updatedData) => {
        setBudgets(budgets.map(b => 
            b.id === id ? { ...b, ...updatedData } : b
        ));
        setEditingBudget(null);
    };

    const deleteTransaction = (id) => setTransactions(transactions.filter(t => t.id !== id));
    const deleteSubscription = (id) => setSubscriptions(subscriptions.filter(s => s.id !== id));
    const deleteBill = (id) => setBills(bills.filter(b => b.id !== id));
    
    const deleteBudget = (id) => {
        if (confirm('Are you sure you want to delete this budget?')) {
            setBudgets(budgets.filter(b => b.id !== id));
        }
    };

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

    const getMonthlyAmount = (amount, frequency) => {
       const frequencyMap = { 'Monthly': 1, 'Quarterly': 3, 'Semi-Annual': 6, 'Annual': 12 };
       return parseFloat(amount) / (frequencyMap[frequency] || 1);
   };

    const getSavedAmount = (item) => {
        if (!item.savingsLog || item.savingsLog.length === 0) return 0;
        return item.savingsLog.reduce((sum, log) => sum + log.amount, 0);
    };

    const getCategorySpending = (category) => {
        const transactionSpending = transactions
            .filter(t => t.type === 'expense' && t.category === category)
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
        const subscriptionSpending = subscriptions
            .filter(s => s.category === category)
            .reduce((sum, s) => sum + parseFloat(getMonthlyAmount(s.amount, s.frequency)), 0);
        
        const billSpending = bills
            .filter(b => b.category === category)
            .reduce((sum, b) => sum + parseFloat(getMonthlyAmount(b.amount, b.frequency)), 0);
        
        return transactionSpending + subscriptionSpending + billSpending;
    };

    const exportData = () => {
        const dataStr = JSON.stringify({ transactions, subscriptions, bills, budgets, savingsBalance }, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `budget-tracker-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    const importData = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    setTransactions(data.transactions || []);
                    setSubscriptions(data.subscriptions || []);
                    setBills(data.bills || []);
                    setBudgets(data.budgets || []);
                    setSavingsBalance(data.savingsBalance || 0);
                    alert('Data imported successfully!');
                } catch (error) {
                    alert('Error importing data. Please check the file format.');
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-blue-600 text-white p-4 shadow-md">
                <h1 className="text-3xl font-bold">💰 Privelly</h1>
            </div>
            
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="flex border-b">
                    {['dashboard', 'transactions', 'subscriptions', 'bills', 'budgets'].map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)} 
                            className={`flex-1 py-3 px-4 font-medium ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="container mx-auto p-4 max-w-6xl">
                {activeTab === 'dashboard' && (
                    <Dashboard 
                        transactions={transactions}
                        subscriptions={subscriptions}
                        bills={bills}
                        budgets={budgets}
                        savingsBalance={savingsBalance}
                        setSavingsBalance={setSavingsBalance}
                        getMonthlyAmount={getMonthlyAmount}
                        getSavedAmount={getSavedAmount}
                        getCategorySpending={getCategorySpending}
                        exportData={exportData}
                        importData={importData}
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
                        onEdit={(sub) => setEditingSubscription(sub)}
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
                        onEdit={(bill) => setEditingBill(bill)}
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
                        onEdit={(budget) => setEditingBudget(budget)}
                        onDelete={deleteBudget}
                        transactions={transactions}
                        subscriptions={subscriptions}
                        bills={bills}
                        getMonthlyAmount={getMonthlyAmount}
                    />
                )}
            </div>

            {showAddTransaction && <AddTransactionModal onClose={() => setShowAddTransaction(false)} onAdd={addTransaction} />}
            {showAddSubscription && <AddSubscriptionModal onClose={() => setShowAddSubscription(false)} onAdd={addSubscription} />}
            {showAddBill && <AddBillModal onClose={() => setShowAddBill(false)} onAdd={addBill} />}
            {showAddBudget && <AddBudgetModal onClose={() => setShowAddBudget(false)} onAdd={addBudget} />}
            {editingSubscription && <EditSubscriptionModal subscription={editingSubscription} onClose={() => setEditingSubscription(null)} onUpdate={updateSubscription} />}
            {editingBill && <EditBillModal bill={editingBill} onClose={() => setEditingBill(null)} onUpdate={updateBill} />}
            {editingBudget && <EditBudgetModal budget={editingBudget} onClose={() => setEditingBudget(null)} onUpdate={updateBudget} />}
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BudgetTracker />);






