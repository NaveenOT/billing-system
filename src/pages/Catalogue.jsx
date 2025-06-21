import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
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
        <p className="text-2xl font-semibold mb-7">Add Item</p>
        <div className="flex flex-col justify-center items-center ml-35">
                <div className="flex flex-row text-2xl justify-center items-center space-x-10 py-2">
            <label htmlFor="code">Product Code</label>
            <input type="number" placeholder="Product Code" id="code" onChange={handleChange}/> 
        </div>
        <div className="flex flex-row text-2xl justify-center items-center space-x-5 py-2">
            <label htmlFor="category" className="mr-10">Category</label>
            <select className="mr-50">
                <option value="Traditional">Traditional</option>
                <option value="Millets">Millets</option>
                <option value="Rice">Rice</option>
            </select>
        </div>
                <div className="flex flex-row text-2xl justify-center items-center space-x-5 py-2">
            <label htmlFor="name" className="mr-10">Product Name</label>
            <input type="text" placeholder="Name" id="name" onChange={handleChange}/>
        </div>
                <div className="flex flex-row text-2xl justify-center items-center space-x-15 py-2">
            <label htmlFor="price">Price Per Kg</label>
            <input type="number" placeholder="Price" id="price" onChange={handleChange}/>
        </div>
                <div className="flex flex-row text-2xl justify-center items-center space-x-25 py-2">
            <label htmlFor="price" className="ml-3" >Quantity</label>
            <input type="number" placeholder="Quantity" id="quantity" onChange={handleChange} className=""/>
        </div>
        

        <button onClick={addItem} className="mt-5 mr-35"><span className="text-2xl font-semibold">Add Item</span></button>
        </div>        
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
        <h3 className="text-3xl font-semibold mb-10">Remove Item</h3>
        <div className="flex flex-row space-x-15 justify-center items-center ml-30 text-2xl mb-10">
        <label htmlFor="code" className="font-semibold mr-10">Product Code: </label>
        <input type="number" placeholder="Enter Here" id="code" onChange={handleChange} min={0} className="border-grey-400m rounded-md border-2 p-1"/>
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
                <div className="flex justify-center items-center mt-15 text-2xl">
                        <div className="max-h-96 overflow-y-auto w-full flex justify-center">
                      <table className="min-w-200 r border-gray-300 text-2xl text-center shadow-lg border-2">
                    <tr className="bg-gray-300">
                        <th className="py-3 px-6 border-b border-gray-300 rounded-b-4xl">S.No</th>
                        <th className="py-3 px-6 border-b border-gray-300 rounded-b-4xl">Item Code</th>
                        <th className="py-3 px-6 border-b border-gray-300 rounded-b-4xl">Category</th>
                        <th className="py-3 px-6 border-b border-gray-300 rounded-b-4xl">Name</th>
                        <th className="py-3 px-6 border-b border-gray-300 rounded-b-4xl">Price</th>
                        <th className="py-3 px-6 border-b border-gray-300 rounded-b-4xl">Quantity</th>
                    </tr>
                    {items && items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                            <td>{index+1}</td>
                            <td>{item.code}</td>
                            <td>Category</td>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                        </tr>
                    ))}
                </table>
                </div>
                </div>
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
            <input type="number" placeholder="Product Code" id="code" min={0} onChange={handleChange} className="mb-5 px-4 py-3 border border-grey-400 rounded-2xl mt-2 w-60 "/>
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
                <input className=" border border-grey-400 rounded-md px-5"size={15} type="number" min={0}  placeholder="Product Code" id="code" value={newItem.code > 0 ? newItem.code : 0}  onChange={handleUpdateChange}/>
                </div>
                <div className="flex flex-row text-2xl justify-center items-center space-x-15">
                <label htmlFor="name">Product Name: </label>
                <input className=" border border-grey-400 rounded-md px-5" type="text" placeholder="Product Name" id="name" value = {newItem.name} onChange={handleUpdateChange}/>
                </div>
                <div className="flex flex-row text-2xl justify-center items-center space-x-15">
                <label htmlFor="price">Product Price: </label>
                <input className=" border border-grey-400 rounded-md px-5" type="number" placeholder="Product Price" id="price" value = {newItem.price} onChange={handleUpdateChange}/>
                </div>
                <div className="flex flex-row text-2xl justify-center items-center space-x-24 ml-6">
                <label htmlFor="quantity">Quantity</label>
                <input className=" border border-grey-400 rounded-md px-5" type="number" placeholder="quantity" id="quantity" value = {newItem.quantity} onChange={handleUpdateChange}/>
                </div>
                <button onClick={onUpdateSubmit} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                Apply Changes
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
            <div className="fixed top-20 left-0 w-full z-40 bg-white py-4">
            <div className=" text-blue-700 z-40 bg-white shadow-md py-1 mt-5 flex justify-center space-x-25 font-extrabold text-2xl">
            <button onClick={()=>setTab("add")} >Add Items</button>
            <button onClick={()=>setTab("remove")}>Remove Items</button>
            <button onClick={()=>setTab("update")}>Update Items</button>
            </div>
        </div>
        <div className="absolute top-[15rem] left-0 w-full px-6 z-30 mt-10 bg-white">
            {(tab == "add") && <Add onUpdate={triggerRefresh}/>}
            {(tab == "remove") && <Remove onUpdate={triggerRefresh}/>}
            {(tab == "update") && <Update onUpdate={triggerRefresh}/>}
            <div className="items-center justify-center">
            <Items props={refresh}/>
            <button className="bg-green-500 text-white px-4 py-2 rounded">Test</button>

            <div className="mt-15"></div>
            </div>
        </div>
        </div>
    )
}
export default Catalogue;