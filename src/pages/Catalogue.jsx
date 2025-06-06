import { useState } from "react";
const Add = () =>{
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

const Remove = () =>{
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
function Catalogue(){

    return(
        <>
        <Add />
        <Remove />
        </>
    )
}
export default Catalogue;