import { useEffect, useState } from "react";
const Add = ({onUpdate}) =>{
    const [item, setItem] = useState(
        {
            name: "",
            code: "",
            price: "",
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
        <h1>Add Item</h1>
        <label htmlFor="name">Product Name</label>
        <input type="text" placeholder="Name" id="name" onChange={handleChange}/>
        <br />

        <label htmlFor="code">Product Code</label>
        <input type="number" placeholder="Product Code" id="code" onChange={handleChange}/>
        <br />

        <label htmlFor="price">Price Per Kg</label>
        <input type="number" placeholder="Product Code" id="price" onChange={handleChange}/>
        <button onClick={addItem}>Add Item</button>
        <br />
        {yes && (
  <div>
    <h1>{item.name}</h1>
    <h1>{item.code}</h1>
    <h1>{item.price}</h1>
    
    <h2>All Items</h2>
    <ul>
      {rows && rows.map((row, index) => (
        <li key={index}>
          Name: {row.name} | Code: {row.code} | Price: {row.price}
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
              Name: {row.name} | Code: {row.code} | Price: {row.price}
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
                    </tr>
                    {items && items.map((item, index) => (
                        <tr key={index}>
                            <td>{item.code}</td>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
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
        }
    );
    const [newItem, setnewItem] = useState({
            name : "",
            code : "",
            price: "",
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
                setFind({ name: row.name, code: row.code, price: row.price });
                setnewItem({ name: row.name, code: row.code, price: row.price });
            } else {
                setisDisp(false);
                setFind({ name: "", code: "", price: "" });
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

        <>
            <h3>Update Item</h3>
            <label htmlFor="code">Product Code</label>
            <input type="number" placeholder="Product Code" id="code" onChange={handleChange}/>
            {find && <h5>{find.code} | {find.name} | {find.price}</h5>}
            {isDisp && 
            <div>
                <label htmlFor="code">Product Code</label>
                <input type="number" placeholder="Product Code" id="code" value = {newItem.code} onChange={handleUpdateChange}/>
                <label htmlFor="name">Product Name</label>
                <input type="text" placeholder="Product Name" id="name" value = {newItem.name} onChange={handleUpdateChange}/>
                <label htmlFor="price">Product Price</label>
                <input type="number" placeholder="Product Price" id="price" value = {newItem.price} onChange={handleUpdateChange}/>
                <button onClick={onUpdateSubmit} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Apply Changes
                </span>
                </button>
            </div>}
        </>
    );
}
function Catalogue(){
    const [refresh, setRefresh] = useState(false);
    const triggerRefresh = () => {
        setRefresh((prev)=>(!prev));
    }
    const [tab, setTab] = useState("add");
    return(
        <>
        <div id="tab">
            <button onClick={()=>setTab("add")}>Add Items</button>
            <button onClick={()=>setTab("remove")}>Remove Items</button>
            <button onClick={()=>setTab("update")}>Update Items</button>
        </div>
        {(tab == "add") && <Add onUpdate={triggerRefresh}/>}
        {(tab == "remove") && <Remove onUpdate={triggerRefresh}/>}
        {(tab == "update") && <Update onUpdate={triggerRefresh}/>}
        <Items props={refresh}/>
        </>
    )
}
export default Catalogue;