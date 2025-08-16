import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./ButtonStyle.css"
const Add = ({onUpdate, categories}) =>{
    
    const [item, setItem] = useState(
        {   
            category: "",
            name: "",
            code: "",
            price: "",
            quantity: "",
            procurement_rate: "",
        }
    );
    const [rows, setRow] = useState([]);
    const [yes, setYes] = useState(false);
    const handleChange = (e) =>{
            setItem((prevItem) =>({
                ...prevItem,
                [e.target.id]: e.target.value,         
            }));
    }
    const addItem = async () =>{
        setYes(true);
        if(!item.code || item.name == "" || !item.price || !item.procurement_rate || item.quantity == 0){
            alert("Add All Fields");
            return;
        }
        const res = await window.api.additems(item);
        console.log(item);
        if(res.success){
            console.log(item + 'inserted');
            console.log(res.id);
        }
        onUpdate();
        const rows = await window.api.getitems();
        console.table(rows);
        setRow(rows);
    }
    
    return(
        <>
  <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
    <p className="text-2xl font-semibold mb-6 text-center">Add Item</p>

    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="code" className="text-lg font-medium w-40">
          Product Code
        </label>
        <input
          type="number"
          placeholder="Product Code"
          id="code"
          onChange={handleChange}
          className="border border-gray-300 rounded-md p-2 flex-1"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="category" className="text-lg font-medium w-40">
          Category
        </label>
        <select
          id="category"
          onChange={handleChange}
          className="border border-gray-300 rounded-md p-2 flex-1"
        >
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="name" className="text-lg font-medium w-40">
          Product Name
        </label>
        <input
          type="text"
          placeholder="Name"
          id="name"
          onChange={handleChange}
          className="border border-gray-300 rounded-md p-2 flex-1"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="price" className="text-lg font-medium w-40">
          Price Per Kg
        </label>
        <input
          type="number"
          placeholder="Price"
          id="price"
          onChange={handleChange}
          className="border border-gray-300 rounded-md p-2 flex-1"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label
          htmlFor="procurement_rate"
          className="text-lg font-medium w-40"
        >
          Procurement Rate
        </label>
        <input
          type="number"
          placeholder="Procurement Rate / Kg"
          id="procurement_rate"
          onChange={handleChange}
          className="border border-gray-300 rounded-md p-2 flex-1"
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="quantity" className="text-lg font-medium w-40">
          Quantity
        </label>
        <input
          type="number"
          placeholder="Quantity"
          id="quantity"
          onChange={handleChange}
          className="border border-gray-300 rounded-md p-2 flex-1"
        />
      </div>
    </div>

    <div className="flex justify-center mt-6">
      <button
        onClick={addItem}
        style={{
      backgroundColor: "#007BAA",
      color: "white",
      fontSize: "18px",
      fontWeight: "600",
      padding: "10px 24px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    }}
      >
        Add Item
      </button>
    </div>
  </div>
</>

    )
}

const Remove = ({onUpdate}) =>{
    const [code, setCode] = useState(NaN);
    const [yes, setYes] = useState(false);
    //const [rows, setRow] = useState([]);
    const [items, setItems] = useState([]);
    const handleChange = (e) =>{
        setCode(e.target.value);
    }
    const handleLoad = async () =>{
      let rows = await window.api.getitems();
      setItems(rows);
      console.log(items);
      console.log("Handle Load Invoked");
    }
    useEffect(()=>{handleLoad()}, []);
    const removeItem = async () =>{
        const noMatch = !items.some(item => String(item.code) == String(code));
        console.log(items);
        console.log("Remove Item");
        if(noMatch){
            alert("No Items Found with product ID");
            return;
        }
        const res = await window.api.delitems(code);
        if(res.success){
            alert('SUCCESS');
            setYes(true);
            onUpdate();
        }
        /*
        const rows = await window.api.getitems();
        console.table(rows);
        setRow(rows);
        */
    }
    return(
        <>
        <h3 className="text-3xl font-semibold mb-10">Remove Item</h3>
        <div className="flex flex-row space-x-15 justify-center items-center ml-30 text-2xl mb-10">
        <label htmlFor="code" className="font-normal mr-10">Product Code: </label>
        <input type="number" placeholder="Enter Here" id="code" onChange={handleChange} min={0} className="border-grey-400m rounded-md border-1 p-1"/>
        </div>
        <button onClick={removeItem} className="ml-20 font-extrabold" disabled={!code}><span className="text-2xl font-semibold">Remove Item</span></button>
        </>

    );
}

const Items = ({props}) =>{
        const [items, setItems] = useState([]);
        const handleLoad = async () => {
            const rows = await window.api.getitems();
            setItems(rows);
        }
        useEffect(()=>{handleLoad()}, [props]);
        return(
    <>
  <div className="flex justify-center items-center mt-10 text-2xl">
    <div className="w-full max-w-5xl shadow-lg rounded-xl border border-gray-200 bg-white">
      <table className="w-full border-collapse text-center text-lg">
        <thead className="sticky top-0 bg-gray-100 text-gray-700 font-semibold shadow-sm">
          <tr>
            <th className="py-3 px-6 border-b border-gray-300">S.No</th>
            <th className="py-3 px-6 border-b border-gray-300">Item Code</th>
            <th className="py-3 px-6 border-b border-gray-300">Category</th>
            <th className="py-3 px-6 border-b border-gray-300">Name</th>
            <th className="py-3 px-6 border-b border-gray-300">Price</th>
            <th className="py-3 px-6 border-b border-gray-300">Procurement Rate</th>
            <th className="py-3 px-6 border-b border-gray-300">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {items && items.map((item, index) => (
            <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
              <td className="py-2 px-4 border-b border-gray-200">{index + 1}</td>
              <td className="py-2 px-4 border-b border-gray-200">{item.code}</td>
              <td className="py-2 px-4 border-b border-gray-200">{item.category}</td>
              <td className="py-2 px-4 border-b border-gray-200">{item.name}</td>
              <td className="py-2 px-4 border-b border-gray-200">{item.price}</td>
              <td className="py-2 px-4 border-b border-gray-200">{item.procurement_rate}</td>
              <td className="py-2 px-4 border-b border-gray-200">{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</>


        );
}
const Update = ({onUpdate, categories})=>{
    const [find, setFind] = useState(
        {
            category: "",
            name : "",
            code : "",
            price: "",
            procurement_rate: "",
            quantity: "",
        }
    );
    const [newItem, setnewItem] = useState({
            category: "",
            name : "",
            code : "",
            price: "",
            procurement_rate: "",
            quantity: "",
    })
    const [code, setCode] = useState(NaN);
    const [isDisp, setisDisp] = useState(false);
    
    const handleChange = async (e) => {
        const enteredCode = e.target.value;
        setCode(enteredCode);
        if (enteredCode) {
            const row = await window.api.finditems(enteredCode);
            if (row) {
                setisDisp(true);
                setFind({ category: row.category, name: row.name, code: row.code, price: row.price, quantity: row.quantity, procurement_rate: row.procurement_rate });
                setnewItem({ category: row.category, name: row.name, code: row.code, price: row.price, quantity: row.quantity,procurement_rate: row.procurement_rate  });
            } else {
                setisDisp(false);
                setFind({category: "", name: "", code: "", price: "", quantity: "", procurement_rate: "" });
            }
        } else {
            setisDisp(false);
        }
    };


    const handleUpdateChange = (e) =>{
        const { id, value } = e.target;
        setnewItem((prevItem) =>(
            {
                ...prevItem,
                [id]: value,
            }
        ))
    }
    const onUpdateSubmit = async () =>{
        onUpdate();
        if(newItem){
            const res = await window.api.updateitems(newItem);
            if(res.id > 0){
                alert("SUCCESS");
            }else{
                alert("NOT FOUND")
            }
            setFind(newItem);
        }
    }
    const [category, setCategory] = useState("");
    const handleAddCategory = (e) =>{
        setCategory(e.target.value);
    }
    const addCategory = async () =>{
        if(category === ""){
            alert("Category is Empty");
            return;
        }else{
            const res = await window.api.addcategory(category);
            onUpdate();
            setCategory("");
            alert("Category Added");
        }
    }
    
    return (

        <div className="flex flex-col items-center justify-center p-8 bg-white shadow-lg rounded-xl max-w-4xl mx-auto">
  <h3 className="text-3xl font-bold text-gray-800 mb-6">Update Item</h3>

  <div className="flex items-center gap-4 mb-6">
    <label htmlFor="code" className="font-semibold text-2xl text-gray-700">Product Code</label>
    <input type="number" placeholder="Product Code" id="code" min={0} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg w-60 focus:outline-none focus:ring-2 focus:ring-blue-500" />
  </div>

  {find && (
    <table className="border-collapse border border-gray-300 text-lg mb-6">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 border border-gray-300">Code</th>
          <th className="px-4 py-2 border border-gray-300">Name</th>
          <th className="px-4 py-2 border border-gray-300">Price</th>
          <th className="px-4 py-2 border border-gray-300">Procurement</th>
          <th className="px-4 py-2 border border-gray-300">Quantity</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="px-4 py-2 border border-gray-300">{find.code}</td>
          <td className="px-4 py-2 border border-gray-300">{find.name}</td>
          <td className="px-4 py-2 border border-gray-300">{find.price}</td>
          <td className="px-4 py-2 border border-gray-300">{find.procurement_rate}</td>
          <td className="px-4 py-2 border border-gray-300">{find.quantity}</td>
        </tr>
      </tbody>
    </table>
  )}

  {isDisp && (
    <div className="flex flex-col gap-5 w-full max-w-2xl">
      <div className="flex items-center gap-4 text-xl">
        <label htmlFor="code" className="w-40">Product Code:</label>
        <input className="border border-gray-300 rounded-lg px-4 py-2 w-full" type="number" min={0} placeholder="Product Code" id="code" value={newItem.code > 0 ? newItem.code : 0} onChange={handleUpdateChange} />
      </div>

      <div className="flex items-center gap-4 text-xl">
        <label htmlFor="category" className="w-40">Category:</label>
        <select className="border border-gray-300 rounded-lg px-4 py-2 w-full" id="category" onChange={handleUpdateChange} value={newItem.category}>
          <option value="">Select Category</option>
          {categories.map((cat, index) => <option key={index} value={cat.name}>{cat.name}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-4 text-xl">
        <label htmlFor="name" className="w-40">Product Name:</label>
        <input className="border border-gray-300 rounded-lg px-4 py-2 w-full" type="text" placeholder="Product Name" id="name" value={newItem.name} onChange={handleUpdateChange} />
      </div>

      <div className="flex items-center gap-4 text-xl">
        <label htmlFor="price" className="w-40">Product Price:</label>
        <input className="border border-gray-300 rounded-lg px-4 py-2 w-full" type="number" placeholder="Product Price" id="price" value={newItem.price} onChange={handleUpdateChange} />
      </div>

      <div className="flex items-center gap-4 text-xl">
        <label htmlFor="procurement_rate" className="w-40">Procurement Rate:</label>
        <input className="border border-gray-300 rounded-lg px-4 py-2 w-full" type="number" placeholder="Procurement Rate" id="procurement_rate" value={newItem.procurement_rate} onChange={handleUpdateChange} />
      </div>

      <div className="flex items-center gap-4 text-xl">
        <label htmlFor="quantity" className="w-40">Quantity:</label>
        <input className="border border-gray-300 rounded-lg px-4 py-2 w-full" type="number" placeholder="Quantity" id="quantity" value={newItem.quantity} onChange={handleUpdateChange} />
      </div>

      <button onClick={onUpdateSubmit} className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
        Apply Changes
      </button>
    </div>
  )}

  <div className="mt-10 flex items-center gap-4">
    <label htmlFor="add_category" className="text-2xl font-semibold">Add Category</label>
    <input type="text" className="px-4 py-2 border border-gray-300 rounded-lg text-lg" onChange={handleAddCategory} />
    <button onClick={addCategory} className="tick-btn">Add Category</button>
  </div>
</div>

    );
}
const Expense = () =>{
        const [expenses, setExpenses] = useState([]);
        const [trigger, setTrigger] = useState(false);
        useEffect(()=>{
            
            const fetchExpense = async () =>{
                const e = await window.api.getexpenses();
                e.sort((a, b)=> new Date(b.date) - new Date(a.date));
                setExpenses(e)
                const tot = e.reduce((acc, s) => acc + s.amount, 0)
            }
            fetchExpense();
        }, [trigger])
        const [expense ,setExpense] = useState({
            description: "",
            date: "",
            amount: "",
        });

        const addExpense = async () =>{
            if(!expense.amount || !expense.date || !expense.description){
                alert("Fill All Fields");
                return;
            }
            const res = await window.api.addexpense(expense);
            setTrigger(prev => !prev);
            setExpense({description: "",
            date: "",
            amount: "",});
        }

        
        const deleteExpense = async (desc) => {
              const confirm = window.confirm("Delete this expense?");
              if(!confirm) return;
            await window.api.delexpense(desc);
            setTrigger(prev => !prev);

        };
        const toggleExpense = async (desc) => {
            await window.api.updateexpense(desc);
            setTrigger(prev => !prev);
            
        };
        const handleExpenseChange = (idx, val) =>{
            const id = idx;
            const value = val;
            setExpense((prev)=>({
                ...prev,
                [id]: value,
            }))
        }
        return(
            <>
                <h2 className="mt-10 font-bold text-3xl underline mb-8">Expenses</h2>
                <div className="flex justify-center items-center space-x-10">
                 <input className="text-xl p-2 border-2 rounded-xl font-semibold border-white shadow bg-red-400 text-white hover:bg-red-700 transition-all duration-200" type="date" id="date" onChange={(e) => handleExpenseChange("date", e.target.value)} value={expense.date}/>
                <input  className="text-xl p-2 border-2 rounded-xl font-semibold border-white shadow bg-red-400 text-white hover:bg-red-700 transition-all duration-200" type="text" id="description" placeholder="Expense Description" onChange={(e) => handleExpenseChange("description", e.target.value)} value={expense.description}/>
                <input   className="text-xl p-2 border-2 rounded-xl font-semibold border-white shadow bg-red-400 text-white hover:bg-red-700 transition-all duration-200" type="number" id="amount" placeholder="Amount" onChange={(e) => handleExpenseChange("amount", e.target.value)} value={expense.amount}/>
                <button className="expense-button" onClick={addExpense}>Add Expense</button>
                </div>
                <div className="flex justify-center mt-12">
                 <table className="w-[800px] overflow-hidden border-2 rounded-2xl shadow-2xl ">
  <thead>
    <tr className="bg-indigo-400 text-white">
      <th className="border px-4 py-2">Date</th>
      <th className="border px-4 py-2">Description</th>
      <th className="border px-4 py-2">Amount (₹)</th>
      <th className="border px-4 py-2">Remove</th>
    </tr>
  </thead>
  <tbody>
    {expenses && expenses.map((e, index) => (
      <tr key={index} className="">
        <td className="border px-4 py-2">{e.date}</td>
        <td className="border px-4 py-2">{e.description}</td>
        <td className="border px-4 py-2">₹{e.amount}</td>
        <td className="border px-4 py-2 space-x-2">
          <button
            title="Remove Expense"
            onClick={() => deleteExpense(e.description)}
            className="tick-btn"
          >
            ✔
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
                </div>
            </>
        )
    }
function Catalogue(){
    const [refresh, setRefresh] = useState(false);
    const triggerRefresh = () => {
        setRefresh((prev)=>(!prev));
    }
    const [categories, setCategories] = useState([]);
    useEffect(()=>{
    const getCategories = async () =>{
        const c = await window.api.getcategories();
        setCategories(c);
    }
    getCategories();
    }, [refresh])
    const [tab, setTab] = useState("add");
    return(
        <div className="h-screen overflow-hidden">
            <div className="fixed top-20 left-0 w-full z-40 bg-white py-4">
            <div className=" text-blue-700 z-40 bg-white shadow-md py-1 mt-5 flex justify-center space-x-25 font-extrabold text-2xl">
            <button onClick={()=>setTab("add")} >Add Items</button>
            <button onClick={()=>setTab("remove")}>Remove Items</button>
            <button onClick={()=>setTab("update")}>Update Items</button>
            </div>
        </div>
        <div className="absolute top-[15rem] left-0 w-full px-6 z-30 mt-10 bg-white">
            {(tab == "add") && <Add onUpdate={triggerRefresh} categories={categories}/>}
            {(tab == "remove") && <Remove onUpdate={triggerRefresh}/>}
            {(tab == "update") && <Update onUpdate={triggerRefresh} categories={categories}/>}
            <div className="items-center justify-center">
            <Items props={refresh}/>
            <Expense />
            <div className="mt-15"></div>
            </div>
        </div>
        </div>
    )
}
export default Catalogue;