import { useEffect, useState } from "react";
import { Bar, Pie ,Line} from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend } from 'chart.js';

function Dashboard(){
    ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend);
    const [transactions, setTransactions] = useState([]);
    const [totalRevenue, setTotalRevenuse] = useState(0);
    const [items_json, setItems_json] = useState([]);
    useEffect(()=>{
        const fetchItems = async () =>{
            const t = await window.api.gettransactions();
            const parsed = t.map(tx => ({
                ...tx,
                t_date: new Date(tx.date),
                amount: parseFloat(tx.amount),
                items_json: JSON.parse(tx.items_json)
            }));
            setTransactions(parsed);
            setTotalRevenuse(parsed.reduce((acc, tx)=> acc + tx.amount, 0));
            
        }
        fetchItems();

    }, []);
    const getMonthlySalesData = (transactions) =>{
      const monthly = {};
      transactions.forEach(tx => {
        const key = `${tx.t_date.getFullYear()}-${tx.t_date.getMonth() + 1}`;
        monthly[key] = (monthly[key] || 0) + tx.amount;
      })
      const labels = Object.keys(monthly).sort();
      const data = labels.map(label => monthly[label])
      return {labels, data};
    }
    const getDailySalesData = (transactions) =>{
        const daily = {}
        transactions.forEach(tx =>{
            const key = tx.t_date.toISOString().split('T')[0]; // YYYY - MM - DD T format
            daily[key] = (daily[key] || 0) + tx.amount;
        })
        const labels  = Object.keys(daily).sort();
        const data = labels.map(label => daily[label])
        return {labels, data};
    }
    const extractItemsJSON = (transactions) =>{
        const items = [];
        transactions.forEach(tx =>{
            items.push(tx.items_json);
        });
        setItems_json(items);
    }
    const getTopSellingItems = (items_json) =>{
        const itemsold = {};
        items_json.forEach(item =>{
            itemsold[item.name] = (itemsold[item.name] || 0) + item.quantity;
        })
        const entries = Object.entries(itemsold).sort((a, b)=>b[1] - a[1]).slice(0, 10);
        const labels = entries.map(e => e[0])
        const data = entries.map(e => e[1])
        return {labels, data}

    }
    return(
        <>
        
        <h1>Dashboard</h1>
        </>
    )
}
export default Dashboard;