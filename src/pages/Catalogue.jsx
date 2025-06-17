import { useEffect, useState } from "react";
const Add = ({onUpdate}) =>{
    const [item, setItem] = useState(
        {
            name: "",
            code: "",
            price: "",
            quantity: "",
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
        <p className="text-2xl">Add Item</p>
        <label htmlFor="name">Product Name</label>
        <input type="text" placeholder="Name" id="name" onChange={handleChange}/>
        <br />

        <label htmlFor="code">Product Code</label>
        <input type="number" placeholder="Product Code" id="code" onChange={handleChange}/>
        <br />

        <label htmlFor="price">Price Per Kg</label>
        <input type="number" placeholder="Product Code" id="price" onChange={handleChange}/>

        <label htmlFor="price">Quantity</label>
        <input type="number" placeholder="Quantity" id="quantity" onChange={handleChange}/>

        <button onClick={addItem}>Add Item</button>
        <br />
        {yes && (
  <div>
    <h1>{item.name}</h1>
    <h1>{item.code}</h1>
    <h1>{item.price}</h1>
    <h1>{item.quantity}</h1>
    <h2>All Items</h2>
    <ul>
      {rows && rows.map((row, index) => (
        <li key={index}>
          Name: {row.name} | Code: {row.code} | Price: {row.price} | Quantity: {row.quantity}
        </li>
      ))}
    </ul>
  </div>
)}
    </>
    )
}

const Remove = ({onUpdate}) =>{
    const [code, setCode] = useState(NaN);
    const [yes, setYes] = useState(false);
    const [rows, setRow] = useState([]);

    const handleChange = (e) =>{
        setCode(e.target.value);
    }
    const removeItem = async () =>{
        const res = await window.api.delitems(code);
        if(res.success){
            alert('SUCCESS');
            setYes(true);
            onUpdate();
        }
         const rows = await window.api.getitems();
        console.table(rows);
        setRow(rows);
    }
    return(
        <>
        <h3>Remove Item</h3>
        <label htmlFor="code">Product Code</label>
        <input type="number" placeholder="Product Code" id="code" onChange={handleChange}/>
        <button onClick={removeItem}>Remove Item</button>
        {yes && 
        <ul>
          {rows.map((row, index) => (
            <li key={index}>
              Name: {row.name} | Code: {row.code} | Price: {row.price}   | Quantity: {<td>{row.quantity}</td>}
            </li>
          ))}
        </ul>
        }
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
                <table>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                    </tr>
                    {items && items.map((item, index) => (
                        <tr key={index}>
                            <td>{item.code}</td>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                        </tr>
                    ))}
                </table>
            </>
        );
}
const Update = ({onUpdate})=>{
    const [find, setFind] = useState(
        {
            name : "",
            code : "",
            price: "",
            quantity: "",
        }
    );
    const [newItem, setnewItem] = useState({
            name : "",
            code : "",
            price: "",
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
                setFind({ name: row.name, code: row.code, price: row.price, quantity: row.quantity });
                setnewItem({ name: row.name, code: row.code, price: row.price, quantity: row.quantity  });
            } else {
                setisDisp(false);
                setFind({ name: "", code: "", price: "", quantity: "" });
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
    return (

        <div className="flex justify-center  items-center flex-col">
            <h3 className="text-3xl font-bold mt-0 mb-5">Update Item</h3>
            <div className="flex flex-row space-x-7">
                <label htmlFor="code" className="mt-2 font-semibold text-3xl">Product Code</label>
            <input type="number" placeholder="Product Code" id="code" onChange={handleChange} className="mb-5 px-4 py-3 border border-grey-400 rounded-2xl mt-2 w-60 "/>
            </div>
            {find && 
            <table>
                <tr className="text-2xl">
                    <th className="px-4 py-2 border border-gray-300 rounded-md">Code</th>
                    <th className="px-4 py-2 border border-gray-300">Name</th>
                    <th className="px-4 py-2 border border-gray-300">Price</th>
                    <th className="px-4 py-2 border border-gray-300">Quantity</th>
                </tr>
                <tr className="text-2xl">
                    <td className="px-4 py-2 border border-gray-300 rounded-md">{find.code}</td>
                    <td className="px-4 py-2 border border-gray-300">{find.name}</td>
                    <td className="px-4 py-2 border border-gray-300">{find.price}</td>
                    <td className="px-4 py-2 border border-gray-300">{find.quantity}</td>
                </tr>
            </table>
            }
            {isDisp && 
            <div className="mt-7 flex flex-col space-y-5">
                <div className="flex flex-row text-2xl justify-center items-center space-x-15">
                <label htmlFor="code">Product Code: </label>
                <input className=" border border-grey-400 rounded-md px-5" size={15} type="number" placeholder="Product Code" id="code" value = {newItem.code} onChange={handleUpdateChange}/>
                </div>
                <div className="flex flex-row">
                <label htmlFor="name">Product Name</label>
                <input type="text" placeholder="Product Name" id="name" value = {newItem.name} onChange={handleUpdateChange}/>
                </div>
                <div className="flex flex-row">
                <label htmlFor="price">Product Price</label>
                <input type="number" placeholder="Product Price" id="price" value = {newItem.price} onChange={handleUpdateChange}/>
                </div>
                <div className="flex flex-row">
                <label htmlFor="quantity">Quantity</label>
                <input type="number" placeholder="quantity" id="quantity" value = {newItem.quantity} onChange={handleUpdateChange}/>
                </div>
                <button onClick={onUpdateSubmit} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Apply Changes
                </span>
                </button>
            </div>}
        </div>
    );
}
function Catalogue(){
    const [refresh, setRefresh] = useState(false);
    const triggerRefresh = () => {
        setRefresh((prev)=>(!prev));
    }
    const [tab, setTab] = useState("add");
    return(
        <div className="h-screen overflow-hidden">
        <div id="tab" className="pt-[6.5rem] min-h-screen">
            <div className="sticky top-[6.5rem] text-blue-700 z-40 bg-white shadow-md py-1 mt-5 flex justify-center space-x-25 font-extrabold text-2xl">
            <button onClick={()=>setTab("add")} >Add Items</button>
            <button onClick={()=>setTab("remove")}>Remove Items</button>
            <button onClick={()=>setTab("update")}>Update Items</button>
            </div>
        </div>
        <div className="absolute top-[15rem] left-0 w-full px-6 z-30 mt-10">
            {(tab == "add") && <Add onUpdate={triggerRefresh}/>}
            {(tab == "remove") && <Remove onUpdate={triggerRefresh}/>}
            {(tab == "update") && <Update onUpdate={triggerRefresh}/>}
            <Items props={refresh}/>
        </div>
        </div>
    )
}
export default Catalogue;