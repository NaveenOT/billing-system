import { useEffect, useState } from "react";
import { Bar, Pie ,Line} from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend} from 'chart.js';
import { callback } from "chart.js/helpers";
import CountUp from "react-countup";

function Dashboard(){
    ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend);
    const [transactions, setTransactions] = useState([]);
    const [items_json, setItems_json] = useState([]);
    const [catalogue, setCatalogue] = useState([]);
    const [monthlySales, setMonthlySales] = useState();
    const [dailySales, setDailySales] = useState();
    const [topSeller, setTopSeller] = useState();
    const [totalProfit, setTotalProfit] = useState();
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [inventory, setInventory] = useState();
    const [category_sales, setCategory_Sales] = useState();
    const [soldItems, setSoldItems] = useState();
    const [dayRevenue, setDayRevenuse] = useState();
    const [profitByItem, setProfitByItem] = useState();
    const [profitByCategory, setProfitByCategory] = useState();
    const [profitByDate, setProfitByDate] = useState();
    useEffect(()=>{
        const fetchItems = async () =>{
            const t = await window.api.gettransactions();
            const parsed = t.map(tx => ({
                ...tx,
                t_date: isNaN(tx.date) ? new Date(): new Date(tx.date),
                amount: parseFloat(tx.amount),
                items_json: JSON.parse(tx.items_json)
            }));
            const soldItems = parsed.flatMap(tx => 
                tx.items_json.map(t=>({
                    tid: tx.tid,
                    customer: tx.cust_name,
                    phno: tx.phone_no,
                    notes: tx.notes,
                    ttype: tx.ttype,
                    name: t.name,
                    procurement_rate: parseFloat(t.procurement_rate),
                    quantity: parseFloat(t.billQuantity),
                    category: t.category,
                    price: parseFloat(t.price),
                    date: tx.t_date.toISOString().split('T')[0],
                }))
            );//set this in a state
            const cat = await window.api.getitems();
            console.log("C:", cat);
            const profit = soldItems.reduce((acc, item)=>
                acc + (item.price - item.procurement_rate) * item.quantity, 0
            )
            setSoldItems(soldItems);
            setTotalProfit(profit);
            setTransactions(parsed);
            setTotalRevenue(parsed.reduce((acc, tx)=> acc + tx.amount, 0));
            setCatalogue(cat);
            extractItemsJSON(parsed);
            setMonthlySales(getMonthlySalesData(parsed));
            setDailySales(getDailySalesData(parsed));
            setTopSeller(getTopSellingItems(soldItems));
            setInventory(getInventory(cat));
            setCategory_Sales(getCategoricalSales(soldItems));
            setDayRevenuse(getDayRevenue(soldItems));
            const profitByItem = {};
            const profitByCategory = {};
            const profitByDate = {};
            soldItems.forEach(item =>{
                const profit = (item.price - item.procurement_rate) * item.quantity;
                profitByItem[item.name] = (profitByItem[item.name] || 0) + profit;
                profitByCategory[item.category] = (profitByCategory[item.category] || 0) + profit;
                profitByDate[item.date] = (profitByDate[item.date] || 0) + profit;
            })
            setProfitByCategory(profitByCategory);
            setProfitByDate(profitByDate);
            setProfitByItem(profitByItem);
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
    const getTopSellingItems = (soldItems) =>{
        const itemsold = {};
        soldItems.forEach(item => {
        if (item && item.name) {
            itemsold[item.name] = (itemsold[item.name] || 0) + Number(item.quantity || 0);
        }
        });
        const entries = Object.entries(itemsold).sort((a, b)=>b[1] - a[1]).slice(0, 10);
        const labels = entries.map(e => e[0])
        const data = entries.map(e => e[1])
        return {labels, data}
    }
    const getDayRevenue = (soldItems) => {
      const today = new Date().toISOString().split('T')[0];
      return soldItems.reduce((sum, item) =>
        item.date === today ? sum + item.price : sum, 0);
    };
    const getInventory = (catalogue) =>{
        const cat = {};
        catalogue.map(c=>{
            cat[c.name] = c.quantity;
        })
        const labels = Object.keys(cat);
        const data = labels.map(label => cat[label]);
        return {labels, data};
    }
    const getCategoricalSales = (soldItems) =>{
        const cs = {};
        soldItems.map(item => {
            cs[item.category] = (cs[item.category] || 0) + item.quantity;
        });
        const labels = Object.keys(cs).sort();
        const data = labels.map((label=>cs[label]));
        return {labels, data};
    }
    const exportToCSV = ()=>{
      const headings = ["Date", "Transaction ID", "Customer", "Phone Number", "Transaction Type", "Notes", "Item", "Category", "Quantity", "Price", "Profit"];
      const rows = soldItems.map(item =>{
        const profit = (item.price - item.procurement_rate) * item.quantity;
        return [
          item.date,
          item.tid,
          item.customer,
          item.phno,
          item.ttype,
          item.notes,
          item.name,
          item.category,
          item.quantity,
          item.price.toFixed(2),
          profit.toFixed(2)
        ];
      });
        let csvContent = "data:text/csv;charset=utf-8," + [headings, ...rows].map(e => e.join(",")).join("\n");
        const encodeUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodeUri);
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); 
    };
    const [salesView, setSalesView] = useState("daily");
    const [selectedProfitType, setSelectedProfitType] = useState("category");
    const [g6_view, setg6_view] = useState("total");
    const [date, setDate] = useState();
    const [byDate, setByDate] = useState(false);
    const [filterDate, setFilterDate] = useState();
    return (
  <div className="p-2 grid grid-cols-3 grid-rows-3 gap-6 mt-25">
    
  <div className="bg-white p-4 shadow rounded transform transition-transform duration-500 ease-in-out hover:scale-120 hover:z-10">
      <div className="flex justify-between items-center mt-10 mb-11">
        <h2 className="font-semibold underline text-xl">Sales Overview</h2>
        <select value={salesView} onChange={(e) => setSalesView(e.target.value)} className="border p-1 rounded-2xl bg-blue-50 hover:bg-blue-300 transition-all duration-100">
          <option value="monthly">Monthly Sales</option>
          <option value="daily">Daily Sales</option>
        </select>
      </div>
      {salesView === "monthly" && monthlySales && (
        <Line data={{
          labels: monthlySales.labels,
          datasets: [{
            label: 'Monthly Sales',
            data: monthlySales.data,
            borderColor: '#eb82f6',
            backgroundColor: 'rgba(59,130,240,0.2)',
            tension: 0.4,
            pointBackgroundColor: '#a3f123',
            pointBorderColor: '#3b82f6',
            pointRadius: 5,
            pointHoverRadius: 8,
          }]
        }}
        options={{
            responsive: true,
            plugins: {
              legend: { labels: { color: '#1e293b', font: { weight: 'bold' } } },
              title: { display: true, text: 'Sales Overview', font: { size: 18 } },
              tooltip: { backgroundColor: '#000000', borderColor: 'gray', borderWidth: 2 },
            },
            scales: {
              x: { ticks: { color: 'black' }, grid: { display: false } },
              y: { ticks: { color: 'black' }, grid: { color: '#e2e8f0', display: true } },
            },
          }}
        />
      )}
      {salesView === "daily" && dailySales && (
        <Line data={{
          labels: dailySales.labels,
          datasets: [{
            label: 'Daily Sales',
            data: dailySales.data,
            backgroundColor: 'rgba(0, 200, 255, 0.6)',
            tension: 0.4,
            pointBackgroundColor: 'rgba(182, 27, 238, 0.5)',
            pointBorderColor: '#3b82f6',
            pointRadius: 5,
            pointHoverRadius: 8,
          }]
        }}
        options={{
            responsive: true,
            plugins: {
              legend: { labels: { color: '#1e293b', font: { weight: 'bold' } } },
              title: { display: true, text: 'Sales Overview', font: { size: 18 } },
              tooltip: { backgroundColor: '#000000', borderColor: 'gray', borderWidth: 2 },
            },
            scales: {
              x: { ticks: { color: 'black' }, grid: { display: false } },
              y: { ticks: { color: 'black' }, grid: { color: '#e2e8f0', display: true } },
            },
          }}
        />
      )}
    </div>

  <div className="bg-white p-4 shadow rounded transform transition-transform duration-500 ease-in-out hover:scale-120 hover:z-10">
      <h2 className="text-xl font-semibold underline mb-13 mt-7">Top Sellers</h2>
      {topSeller && (
        <Bar 
          data={{
            labels: topSeller.labels,
            datasets: [{
              label: 'Top 5 Selling Items',
              data: topSeller.data,
              backgroundColor:[ "#FF7F7F","#90EE90", "#FFB6C1", "#ADD8E6", "#E6E6FA"],
              borderColor: 'gray',
              borderRadius: 7,
              borderWidth: 1.2,
            }]
          }}
          options={{
            tooltip: {callback: {label: ctx => `${ctx.label}: ${ctx.raw} units`}},
            scales: {
                  x: { ticks: { color: '#475569' }, grid: { display: false } },
                  y: { ticks: { color: '#475569' }, grid: { color: '#f1f5f9' } },
                }
          }}  
        />
      )}
    </div>
  <div className="bg-white p-4 shadow rounded transform transition-transform duration-500 ease-in-out hover:scale-120 hover:z-10">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-xl underline">Profit Breakdown</h2>
        <select value={selectedProfitType} onChange={(e) => setSelectedProfitType(e.target.value)} className="transition-all duration-150 border-2 rounded-md p-1 font-bold text-pink-800 hover:bg-pink-200">
          <option value="category">By Category</option>
          <option value="item">By Item</option>
          <option value="date">By Date</option>
        </select>
      </div>
      {selectedProfitType == "category" && profitByCategory && 
        (<div className="flex justify-center mt-10">
  <table className="min-w-[300px] border border-gray-300 rounded-xl shadow-md overflow-hidden">
    <thead>
      <tr className="bg-amber-200 text-gray-800 text-lg">
        <th className="border border-gray-300 px-6 py-3 text-left">Category</th>
        <th className="border border-gray-300 px-6 py-3 text-right">Profit (₹)</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(profitByCategory).map(([key, value]) => (
        <tr key={key} className="hover:bg-amber-50 transition-all duration-200">
          <td className="border border-gray-200 px-6 py-2 text-left font-medium">{key}</td>
          <td className="border border-gray-200 px-6 py-2 text-right text-green-600 font-semibold">
            {value.toFixed(2)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        )
      }
        {selectedProfitType == "item" && profitByItem && 
        (
          <div className="flex justify-center mt-10">
          <table className="min-w-[300px] border border-gray-300 rounded-xl shadow-md overflow-hidden">
            <tr className="bg-amber-200 text-gray-800 text-lg"><th className="border border-gray-300 px-6 py-3 text-left">Item</th><th className="border border-gray-300 px-6 py-3 text-right">Profit</th></tr>
              {Object.entries(profitByItem).map(([key, value])=>{
                return(
                  <tr key={key} className="hover:bg-amber-50 transition-all duration-200">
                  <td className="border border-gray-200 px-6 py-1 text-left font-medium">{key}</td>
                  <td className="border border-gray-200 px-6 py-1 text-right text-green-600 font-semibold">{value.toFixed(2)}</td>
                  </tr>
                )
              })}
          </table>
          </div>
        )
      }
        {selectedProfitType == "date" && profitByDate && 
        (
          <div>
            <input type="date" onChange={(e)=>setDate(e.target.value)} className="mt-5 border-2 rounded-md p-1 font-semibold text-pink-700 bg-yellow-100 hover:bg-yellow-200 transition-all duration-200"/>
            <div className="flex justify-center mt-10">
            <table className="min-w-[300px] border border-gray-300 rounded-xl shadow-md overflow-hidden">
            <tr className="bg-amber-200 text-gray-800 text-lg"><th className="border border-gray-300 px-6 py-3 text-left">Date</th><th className="border border-gray-300 px-6 py-3 text-right">Profit</th></tr>

              {Object.entries(profitByDate).map(([key, value])=>{
                if(key == date || !date){
                return(
                  <tr key={key} className="hover:bg-amber-50 transition-all duration-200">
                  <td className="border border-gray-200 px-6 py-2 text-left font-medium">{key}</td>
                  <td className="border border-gray-200 px-6 py-1 text-right text-green-600 font-semibold">{value.toFixed(2)}</td>
                  </tr>
                )}
                else{
                  return(
                    <tr><td colSpan={2}>No Data Available</td></tr>
                  )
                }
              })}
          </table>
          </div>
          </div>

        )
      }
    </div>
    
  <div className="bg-white p-4 shadow rounded transform transition-transform duration-500 ease-in-out hover:scale-120 hover:z-10">
    <h2 className="text-xl font-semibold underline mb-12 mt-5">Inventory</h2>
      {inventory && (
        <Bar 
        data={{
          labels: inventory.labels,
          datasets: [{
            label: 'Items in Kg (Unit)',
            data: inventory.data,
            backgroundColor:["#F49AC2", "#B3E0FF", "#C1E1C1", "#E0BBE4", "#FFCCCB", "#FDFD96", "#FFDAB9", "#ADD8E6", "#DDA0DD", "#FFE5B4"],
            borderColor: 'gray',
            borderRadius: 7,
            borderWidth: 1.5,

          }]
        }}
        options={{
          responsive: true,
          scales: {
            x: { ticks: { color: '#475569' }, grid: { display: false } },
            y: { ticks: { color: '#475569' }, grid: { color: '#f1f5f9' } }
        }}}
        />
      )}
    </div>

  <div className="bg-white p-4 shadow rounded transform transition-transform duration-500 ease-in-out hover:scale-120 hover:z-10">
      <h2 className="text-xl font-semibold ">Categorical Split</h2>
      {category_sales && (
        <Pie 
          data={{
            labels: category_sales.labels,
            datasets: [{
              label: 'Units in Kg',
              data: category_sales.data,
              backgroundColor: ["#CE93D8", "#FFAB91", "#80DEEA", "#A5D6A7", "#90CAF9", "#FFF59D"],
              borderColor: 'gray',
              borderAlign: "center",
              borderWidth: 3,
              hoverOffset: 22,
              
            }]
          }}  
        />
      )}
    </div>
    
  <div className="bg-white p-4 shadow rounded transform transition-transform duration-500 ease-in-out hover:scale-120 hover:z-10">
      <div className="flex flex-col space-y-10">
        <div>
          <select value={g6_view} onChange={(e)=>setg6_view(e.target.value)} className="font-semibold text-xl border-2 p-1 rounded-2xl mt-2 border-blue-400 text-blue-400 hover:bg-blue-50 transition-all duration-200">
            <option value="total">Total</option>
            <option value="today">Today</option>
          </select>
        </div>
        {g6_view === "total" && (
          <div>
            <h2 className="text-2xl font-bold underline text-left ml-2">Total Profit:</h2>
        <h2 className="font-extrabold text-3xl mt-2 text-right text-green-500">  <CountUp start={0} end={parseFloat(totalProfit) || 0} duration={2} decimals={2} suffix=" ₹" />
</h2>
        <h2 className="text-2xl font-bold underline text-left ml-2 mt-8 mb-5">Total Revenue:</h2>
        <h2 className="font-extrabold text-3xl mt-2 text-right text-blue-600">
           <CountUp start={0} end={parseFloat(totalRevenue) || 0} duration={2} decimals={2} suffix=" ₹" />
           
          </h2>
          </div>
        )}
         {g6_view === "today" && (
          <div>
            <h2  className="text-2xl font-bold underline text-left ml-2">Today's Profit:</h2>
        <h2  className="font-extrabold text-3xl mt-2 text-right text-green-500" >
          <CountUp start={0} end={parseFloat(profitByDate[new Date().toISOString().split('T')[0]]) || 0} duration={2} decimals={2} suffix=" ₹" />
        </h2>
        <h2 className="text-2xl font-bold underline text-left ml-2 mt-8 mb-5" >Today's Revenue:</h2>
        <h2 className="font-extrabold text-3xl mt-2 text-right text-blue-600">
          <CountUp start={0} end={parseFloat(dayRevenue) || 0} duration={2} decimals={2} suffix=" ₹" />
          </h2>
          </div>
        )}
      </div>
    </div>
   <div className="bg-white p-4 shadow rounded transform transition-transform duration-500 ease-in-out hover:scale-120 hover:z-10 col-span-3 border overflow-y-auto h-[400px]">
        <div className="flex justify-center items-center flex-col">
        <h2 className="font-semibold text-5xl under">Transactions</h2>
        <div className="mb-4 mt-5 w-full flex flex-col items-end mr-15">
          <div className="flex items-center gap-2">
        <input type="checkbox" id="byDate" onChange={(e)=>setByDate(e.target.checked)} className="w-5 h-5 accent-amber-200 cursor-pointer"/>
        <label htmlFor="byDate" className="font-semibold text-lg">Transaction By Date</label>
        </div>
        {byDate && (
          <div className="mt-2">
            <input type="date" onChange={(e)=>setFilterDate(e.target.value)} className="border-2 rounded-xl p-2" />
          </div>
        )}
        </div>
  
        <div>
          
          <table className="w-full border border-gray-300 text-sm mt-4 overflow-hidden rounded-2xl">
  <thead className="bg-amber-200 sticky top-0 z-10">
    <tr>
      <th className="border px-4 py-2">Date</th>
      <th className="border px-4 py-2">Transaction ID</th>
      <th className="border px-4 py-2">Customer</th>
      <th className="border px-4 py-2">Item</th>
      <th className="border px-4 py-2">Category</th>
      <th className="border px-4 py-2">Quantity</th>
      <th className="border px-4 py-2">Price</th>
      <th className="border px-4 py-2">Profit</th>
    </tr>
  </thead>
  {byDate === false ? (<tbody>
    {soldItems?.map((item, index) => {
      const profit = (item.price - item.procurement_rate) * item.quantity;
      return (
        <tr key={index} className="hover:bg-gray-200 font-semibold">
          <td className="border px-4 py-2">{item.date}</td>
          <td className="border px-4 py-2">{item.tid}</td>
          <td className="border px-4 py-2">{item.customer}</td>
          <td className="border px-4 py-2">{item.name}</td>
          <td className="border px-4 py-2">{item.category}</td>
          <td className="border px-4 py-2">{item.quantity}</td>
          <td className="border px-4 py-2">₹{item.price.toFixed(2)}</td>
          <td className="border px-4 py-2 text-green-600 font-semibold">₹{profit.toFixed(2)}</td>
        </tr>
      );
    })}
  </tbody>):
  (<tbody>
    {
    soldItems?.map((item, index) => {
      const profit = (item.price - item.procurement_rate) * item.quantity;
      if(item.date === filterDate){
        return (
          <tr key={index} className="hover:bg-gray-200 font-semibold">
          <td className="border px-4 py-2">{item.date}</td>
          <td className="border px-4 py-2">{item.tid}</td>
          <td className="border px-4 py-2">{item.customer}</td>
          <td className="border px-4 py-2">{item.name}</td>
          <td className="border px-4 py-2">{item.category}</td>
          <td className="border px-4 py-2">{item.quantity}</td>
          <td className="border px-4 py-2">₹{item.price.toFixed(2)}</td>
          <td className="border px-4 py-2 text-green-600 font-semibold">₹{profit.toFixed(2)}</td>
        </tr>
      );
    }
    })
    }
  </tbody>)
  }
</table>
<div>
<button style={{backgroundColor: "#0BDA51", color: "white"}} className="mt-5" onClick={exportToCSV}>Export To CSV</button>
</div>

        </div>
        </div>
  </div>
 

  </div>
);

}
export default Dashboard;